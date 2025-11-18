import * as d3 from 'd3';
import './DateTimeButtonRange.scss';
import { DateTimeButton } from '../../interfaces/DateTimeButton';
import DateTimePicker from '../DateTimePicker/DateTimePicker';
import Utils from '../../utils';

type OnSetCallback = (fromMillis: number, toMillis?: number, offset?: string, isRelative?: boolean, quickTime?: number) => void;
type OnCancelCallback = () => void;

// Constants
const CLICK_OUTSIDE_HANDLER_DELAY = 0; // Delay to prevent opening click from immediately closing picker

class DateTimeButtonRange extends DateTimeButton {
    private onCancel: OnCancelCallback;
    private fromMillis: number;
    private toMillis: number;
    private clickOutsideHandler: ((event: MouseEvent) => void) | null = null;

    constructor(renderTarget: Element) {
        super(renderTarget);
    }

    /**
     * Set the button text to display the selected date/time range
     * 
     * @param fromMillis - Start time in milliseconds
     * @param toMillis - End time in milliseconds
     * @param isRelative - Whether this is a relative time range (e.g., "Last 24 Hours")
     * @param quickTime - Quick time selection in milliseconds (if applicable)
     * @private
     */
    private setButtonText(fromMillis: number, toMillis: number, isRelative: boolean, quickTime: number): void {
        const fromString = this.buttonDateTimeFormat(fromMillis);
        const tzAbbr = Utils.createTimezoneAbbreviation(this.chartOptions.offset);
        const toString = this.buttonDateTimeFormat(toMillis) + ' (' + tzAbbr + ')';

        if (!isRelative) {
            this.dateTimeButton.text(`${fromString} - ${toString}`);
            this.dateTimeButton.attr('aria-label', `${this.getString('a button to launch a time selection dialog current selected time is ')} ${fromString} - ${toString}`)
        }
        else {
            const quickTimeText = this.dateTimePicker.getQuickTimeText(quickTime);
            const text = quickTimeText !== null ? `${quickTimeText} (${fromString} - ${toString})` : `${fromString} - ${this.getString('Latest')} (${toString})`
            this.dateTimeButton.text(text);
            this.dateTimeButton.attr('aria-label', `${this.getString('a button to launch a time selection dialog current selected time is ')} ${text}`)
        }
    }

    /**
     * Close the date/time picker and return focus to the button
     * @private
     */
    private onClose(): void {
        this.dateTimePickerContainer.style("display", "none");
        this.dateTimeButton.node().focus();
        this.removeClickOutsideHandler();
    }

    /**
     * Remove the click outside event handler if it exists
     * @private
     */
    private removeClickOutsideHandler(): void {
        if (this.clickOutsideHandler) {
            document.removeEventListener('click', this.clickOutsideHandler);
            this.clickOutsideHandler = null;
        }
    }

    /**
     * Set up click outside handler to close the picker when clicking outside
     * Uses a small delay to prevent the opening click from immediately closing the picker
     * @private
     */
    private setupClickOutsideHandler(): void {
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
        }, CLICK_OUTSIDE_HANDLER_DELAY);
    }

    /**
     * Render the date/time button with range selection
     * 
     * @param chartOptions - Configuration options for the component
     * @param minMillis - Minimum selectable time in milliseconds
     * @param maxMillis - Maximum selectable time in milliseconds
     * @param fromMillis - Start time of the range (defaults to 24 hours before maxMillis)
     * @param toMillis - End time of the range (defaults to maxMillis)
     * @param onSet - Callback invoked when user saves a selection
     * @param onCancel - Callback invoked when user cancels
     */
    public render(chartOptions: any = {}, minMillis: number, maxMillis: number,
        fromMillis: number = null, toMillis: number = null, onSet: OnSetCallback = null, onCancel: OnCancelCallback = null) {
        super.initializeDateTimeButton(chartOptions, minMillis, maxMillis, onSet);
        const container = d3.select(this.renderTarget);
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
                this._openPicker(minMillis, maxMillis);
            }
        });
    }

    /**
     * Open the date/time picker in modal mode
     * 
     * @param minMillis - Minimum selectable time
     * @param maxMillis - Maximum selectable time
     * @private
     */
    private _openPicker(minMillis: number, maxMillis: number): void {
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
}
export default DateTimeButtonRange;
