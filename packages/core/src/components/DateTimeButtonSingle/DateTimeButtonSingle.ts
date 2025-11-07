import * as d3 from 'd3';
import './DateTimeButtonSingle.scss';
import { DateTimeButton } from '../../interfaces/DateTimeButton';
import SingleDateTimePicker from '../SingleDateTimePicker/SingleDateTimePicker';

class DateTimeButtonSingle extends DateTimeButton {

    private selectedMillis: number;
    private clickOutsideHandler: ((event: MouseEvent) => void) | null = null;

    constructor(renderTarget: Element) {
        super(renderTarget);
    }

    private closeSDTP() {
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
                    this.closeSDTP();
                }
            };
            document.addEventListener('click', this.clickOutsideHandler);
        }, 0);
    }

    private sDTPOnSet = (millis: number = null) => {
        if (millis !== null) {
            this.dateTimeButton.text(this.buttonDateTimeFormat(millis));
            this.selectedMillis = millis;
            this.onSet(millis);
        }
        this.closeSDTP();
    }

    public render(chartOptions: any = {}, minMillis: number, maxMillis: number, selectedMillis: number = null, onSet = null) {
        super.render(chartOptions, minMillis, maxMillis, onSet);
        this.selectedMillis = selectedMillis;
        d3.select(this.renderTarget).classed('tsi-dateTimeContainerSingle', true);
        this.dateTimeButton.text(this.buttonDateTimeFormat(selectedMillis));
        if (!this.dateTimePicker) {
            this.dateTimePicker = new SingleDateTimePicker(this.dateTimePickerContainer.node());
        }

        this.dateTimeButton.on("click", () => {
            this.chartOptions.dTPIsModal = true;
            this.dateTimePickerContainer.style("display", "block");
            this.dateTimePicker.render(this.chartOptions, this.minMillis, this.maxMillis, this.selectedMillis, this.sDTPOnSet);
            this.setupClickOutsideHandler();
        });
    }

}
export default DateTimeButtonSingle
