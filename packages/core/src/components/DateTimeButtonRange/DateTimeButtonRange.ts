import * as d3 from 'd3';
import './DateTimeButtonRange.scss';
import { DateTimeButton } from '../../interfaces/DateTimeButton';
import DateTimePicker from '../DateTimePicker/DateTimePicker';
import Utils from '../../utils';

class DateTimeButtonRange extends DateTimeButton {
    private onCancel;
    private fromMillis: number;
    private toMillis: number;
    private clickOutsideHandler: ((event: MouseEvent) => void) | null = null;

    constructor(renderTarget: Element) {
        super(renderTarget);
    }

    private setButtonText(fromMillis, toMillis, isRelative, quickTime) {
        let fromString = this.buttonDateTimeFormat(fromMillis);
        let tzAbbr = Utils.createTimezoneAbbreviation(this.chartOptions.offset);
        let toString = this.buttonDateTimeFormat(toMillis) + ' (' + tzAbbr + ')';
        if (!isRelative) {
            this.dateTimeButton.text(`${fromString} - ${toString}`);
            this.dateTimeButton.attr('aria-label', `${this.getString('a button to launch a time selection dialog current selected time is ')} ${fromString} - ${toString}`)
        }
        else {
            let quickTimeText = this.dateTimePicker.getQuickTimeText(quickTime);
            let text = quickTimeText !== null ? `${quickTimeText} (${fromString} - ${toString})` : `${fromString} - ${this.getString('Latest')} (${toString})`
            this.dateTimeButton.text(text);
            this.dateTimeButton.attr('aria-label', `${this.getString('a button to launch a time selection dialog current selected time is ')} ${text}`)
        }
    }

    private onClose() {
        this.dateTimePickerContainer.style("display", "none");
        this.dateTimeButton.node().focus();
        this.removeClickOutsideHandler();
    }

    private removeClickOutsideHandler() {
        if (this.clickOutsideHandler) {
            document.removeEventListener('click', this.clickOutsideHandler);
            this.clickOutsideHandler = null;
        }
    }

    private setupClickOutsideHandler() {
        // Remove any existing handler first
        this.removeClickOutsideHandler();

        // Add handler after a small delay to prevent the opening click from immediately closing the picker
        setTimeout(() => {
            this.clickOutsideHandler = (event: MouseEvent) => {
                const pickerElement = this.dateTimePickerContainer.node();
                const buttonElement = this.dateTimeButton.node();
                const target = event.target as Node;

                // Check if click is outside both the picker and the button
                if (pickerElement && buttonElement &&
                    !pickerElement.contains(target) &&
                    !buttonElement.contains(target)) {
                    this.onClose();
                }
            };
            document.addEventListener('click', this.clickOutsideHandler);
        }, 0);
    }

    public render(chartOptions: any = {}, minMillis: number, maxMillis: number,
        fromMillis: number = null, toMillis: number = null, onSet = null, onCancel = null) {
        super.render(chartOptions, minMillis, maxMillis, onSet);
        let container = d3.select(this.renderTarget);
        container.classed('tsi-dateTimeContainerRange', true);
        container.style('position', 'relative');
        this.fromMillis = fromMillis;
        this.toMillis = toMillis;

        this.onCancel = onCancel ? onCancel : () => { };

        if (!this.dateTimePicker) {
            this.dateTimePicker = new DateTimePicker(this.dateTimePickerContainer.node());
        }

        this.setButtonText(fromMillis, toMillis, toMillis === maxMillis, this.toMillis - this.fromMillis);

        this.dateTimeButton.on("click", () => {
            if (this.dateTimePickerContainer.style("display") !== "none") {
                this.onClose();  // close if already open
            }
            else {
                this.chartOptions.dTPIsModal = true;
                this.dateTimePickerContainer.style("display", "block");
                this.dateTimePicker.render(this.chartOptions, minMillis, maxMillis, this.fromMillis, this.toMillis,
                    (fromMillis, toMillis, offset, isRelative, currentQuickTime) => {
                        this.chartOptions.offset = offset;

                        this.fromMillis = fromMillis;
                        this.toMillis = toMillis;

                        this.setButtonText(fromMillis, toMillis, isRelative, currentQuickTime);
                        this.onSet(fromMillis, toMillis, offset, isRelative, currentQuickTime);
                        this.onClose();
                    },
                    () => {
                        this.onClose();
                        this.onCancel();
                    }
                );
                this.setupClickOutsideHandler();
            }
        });
    }
}
export default DateTimeButtonRange;
