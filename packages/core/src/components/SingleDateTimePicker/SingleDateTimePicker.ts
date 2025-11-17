import * as d3 from 'd3';
import '../../../packages/pikaday/pikaday.js';
import '../../../packages/pikaday/css/pikaday.css'
import './SingleDateTimePicker.scss';
import Utils from "../../utils";
import { DateTimeButton } from '../../interfaces/DateTimeButton.js';
import { DateFormatter } from '../../utils/DateFormatter';

declare const Pikaday: any;

interface ValidationResult {
    rangeIsValid: boolean;
    errors: string[];
}

type OnSetCallback = (millis: number) => void;

// Keyboard key codes
const KEY_CODES = {
    ARROW_LEFT: 37,
    ARROW_UP: 38,
    ARROW_RIGHT: 39,
    ARROW_DOWN: 40,
    TAB: 9,
    ESCAPE: 27
} as const;

class SingleDateTimePicker extends DateTimeButton {
    private calendar: d3.Selection<HTMLDivElement, unknown, null, undefined>;
    private calendarPicker: any; // Pikaday instance - external library without types
    private timeControls: d3.Selection<HTMLDivElement, unknown, null, undefined>;
    protected minMillis: number;
    protected maxMillis: number;
    private millis: number;
    private minutes: number;
    private hours: number;
    protected onSet: OnSetCallback | null;
    private targetElement: d3.Selection<HTMLElement, unknown, null, undefined>;
    private isValid: boolean = true;
    private offsetName: string;
    private date: Date;
    private timeInput: d3.Selection<HTMLInputElement, unknown, null, undefined>;
    private saveButton: d3.Selection<HTMLButtonElement, unknown, null, undefined>;
    private dateFormatter: DateFormatter;

    constructor(renderTarget: Element) {
        super(renderTarget);
    }

    /**
     * Get the currently selected time in milliseconds
     * @returns The selected time in milliseconds since epoch
     */
    public getMillis(): number {
        return this.millis;
    }

    /**
     * Render the single date/time picker component
     * 
     * @param chartOptions - Configuration options for the component
     * @param minMillis - Minimum selectable time in milliseconds
     * @param maxMillis - Maximum selectable time in milliseconds
     * @param millis - Initially selected time (defaults to maxMillis if null)
     * @param onSet - Callback function invoked when user saves a selection
     */
    public render(chartOptions: any = {}, minMillis: number, maxMillis: number,
        millis: number = null, onSet: OnSetCallback = null) {
        this.minMillis = minMillis;
        this.maxMillis = maxMillis;
        if (chartOptions.offset && (typeof chartOptions.offset == "string")) {
            this.offsetName = chartOptions.offset;
        }

        if (millis === null) {
            millis = this.maxMillis;
        }

        this.chartOptions.setOptions(chartOptions);
        this.millis = millis;
        this.onSet = onSet;
        this.targetElement = d3.select(this.renderTarget)
            .classed("tsi-singleDateTimePicker", true)
        this.targetElement.html('');
        super.themify(this.targetElement, this.chartOptions.theme);

        this._setupEventHandlers();
        this._createDOM();
        this._createCalendar();
        this._createTimePicker();

        this.updateDisplayedDateTime();

        this.date = new Date(this.millis);
        this.calendarPicker.draw();
        if (this.chartOptions.dTPIsModal) {
            this.timeInput.node().focus();
        }
        return;
    }

    /**
     * Set up keyboard event handlers for the component
     * Handles arrow keys and escape key navigation
     * @private
     */
    private _setupEventHandlers(): void {
        this.targetElement.on('keydown', (event) => {
            const keyCode = event.keyCode;
            // Arrow keys
            if (keyCode >= KEY_CODES.ARROW_LEFT && keyCode <= KEY_CODES.ARROW_DOWN) {
                event.stopPropagation();
            }
            // Escape key in modal mode
            if (keyCode === KEY_CODES.ESCAPE && this.chartOptions.dTPIsModal) {
                if (this.onSet) {
                    this.onSet(this.millis);
                }
            }
        });
    }

    /**
     * Create the DOM structure for the date/time picker
     * Includes time controls, calendar container, save button, and error message container
     * @private
     */
    private _createDOM(): void {
        this.timeControls = this.targetElement.append("div").classed("tsi-timeControlsContainer", true);
        this.calendar = this.targetElement.append("div").classed("tsi-calendarPicker", true);
        const saveButtonContainer = this.targetElement.append("div").classed("tsi-saveButtonContainer", true);

        this.saveButton = saveButtonContainer.append("button")
            .classed("tsi-saveButton", true)
            .text(this.getString("Save"))
            .on("click", () => {
                if (this.isValid && this.onSet) {
                    this.onSet(this.millis);
                }
            })
            .on('keydown', (event) => {
                if (event.keyCode === KEY_CODES.TAB && !event.shiftKey && this.chartOptions.dTPIsModal) {
                    this.timeInput.node().focus();
                    event.preventDefault();
                }
            });

        this.targetElement.append("div").classed("tsi-errorMessageContainer", true);
    }

    /**
     * Round a date to midnight (zero out hours, minutes, seconds, milliseconds)
     * Takes timezone offset into account
     * 
     * @param d - The date to round
     * @returns A new date at midnight in the specified timezone
     * @private
     */
    private roundDay(d: Date): Date {
        let offsetDate = Utils.offsetFromUTC(d, this.chartOptions.offset);
        return new Date(offsetDate.getUTCFullYear(), offsetDate.getUTCMonth(), offsetDate.getUTCDate());
    }

    /**
     * Update the calendar and time input to reflect a newly selected date
     * 
     * @param d - The selected date
     * @private
     */
    private setSelectedDate(d: Date): void {
        this.calendarPicker.setDate(d, true);
        this.setDate(d);
        this.timeInput.node().value = this.createTimeString(Utils.offsetFromUTC(new Date(this.millis)));
    }

    /**
     * Create and configure the Pikaday calendar component
     * Uses the DateFormatter utility to generate locale-specific month and weekday names
     * @private
     */
    private _createCalendar(): void {
        const locale = this.chartOptions.dateLocale || 'en-US';
        const timezone = this.chartOptions.offset || 'UTC';

        // Initialize or update the date formatter
        if (!this.dateFormatter) {
            this.dateFormatter = new DateFormatter({ locale, timezone });
        } else {
            this.dateFormatter.setLocale(locale);
            this.dateFormatter.setTimezone(timezone);
        }

        const i18nOptions = {
            previousMonth: this.getString('Previous Month'),
            nextMonth: this.getString('Next Month'),
            months: this.dateFormatter.getMonthNames('long'),
            weekdays: this.dateFormatter.getWeekdayNames('long'),
            weekdaysShort: this.dateFormatter.getWeekdayNames('short')
        };

        //@ts-ignore
        this.calendarPicker = new Pikaday({
            bound: false,
            container: this.calendar.node(),
            field: this.calendar.node(),
            i18n: i18nOptions,
            numberOfMonths: 1,
            onSelect: (d) => {
                this.setSelectedDate(d);
                this.calendarPicker.draw();
                this.checkDateTimeValidity();
            },
            onDraw: (d) => {
                this.calendar.select(".pika-single").selectAll('button').attr('tabindex', -1);
            },
            minDate: this.convertToLocal(Utils.offsetFromUTC(new Date(this.minMillis), this.chartOptions.offset)),
            maxDate: this.convertToLocal(Utils.offsetFromUTC(new Date(this.maxMillis), this.chartOptions.offset)),
            defaultDate: this.convertToLocal(Utils.offsetFromUTC(new Date(this.millis), this.chartOptions.offset))
        });
    }

    private setDate(d: Date) {
        const date = Utils.offsetFromUTC(new Date(this.millis), this.chartOptions.offset);
        date.setUTCFullYear(d.getFullYear());
        date.setUTCMonth(d.getMonth());
        date.setUTCDate(d.getDate());
        this.setMillis(date.valueOf(), true);
    }

    private setIsValid(isValid: boolean) {
        this.isValid = isValid;
    }

    private setMillis(millis: number, shouldOffset = true) {
        const adjustedMillis = millis - (shouldOffset ? Utils.getOffsetMinutes(this.chartOptions.offset, millis) * 60 * 1000 : 0);
        this.millis = adjustedMillis;
    }

    private displayErrors(rangeErrors: string[]): void {
        this.targetElement.select(".tsi-errorMessageContainer").selectAll(".tsi-errorMessage").remove();
        if (rangeErrors.length != 0) {
            this.targetElement.select(".tsi-errorMessageContainer").selectAll(".tsi-errorMessages")
                .data(rangeErrors)
                .enter()
                .append("div")
                .classed("tsi-errorMessage", true)
                .text((d: string) => d);
        }
    }

    private checkDateTimeValidity(): void {
        let parsedMillis = this.parseUserInputDateTime();
        let errorCheck = this.dateTimeIsValid(parsedMillis);
        this.displayErrors(errorCheck.errors);
        this.setIsValid(errorCheck.rangeIsValid);
    }

    private dateTimeIsValid(prospectiveMillis: number): ValidationResult {
        const accumulatedErrors: string[] = [];

        if (isNaN(prospectiveMillis)) {
            accumulatedErrors.push('*time is invalid');
        } else {
            const firstDateTime = Utils.offsetFromUTC(new Date(this.minMillis), this.chartOptions.offset);
            const lastDateTime = Utils.offsetFromUTC(new Date(this.maxMillis), this.chartOptions.offset);
            if (prospectiveMillis < this.minMillis) {
                accumulatedErrors.push("*date/time is before first possible date and time (" + this.getTimeFormat()(firstDateTime) + ")");
            }
            if (prospectiveMillis > this.maxMillis) {
                accumulatedErrors.push("*date/time is after last possible date and time (" + this.getTimeFormat()(lastDateTime) + ")");
            }
        }

        return {
            rangeIsValid: (accumulatedErrors.length == 0),
            errors: accumulatedErrors
        };
    }

    private getTimeFormat() {
        return Utils.timeFormat(true, true, this.chartOptions.offset, true, 0, null, this.chartOptions.dateLocale);
    }

    private parseUserInputDateTime() {
        return Utils.parseUserInputDateTime(this.timeInput.node().value, this.chartOptions.offset);
    }

    private convertToCalendarDate(millis: number) {
        return this.roundDay(Utils.adjustDateFromTimezoneOffset(Utils.offsetFromUTC(new Date(millis), this.chartOptions.offset)));
    }

    private updateDisplayedDateTime(fromInput: boolean = false) {
        let selectedDate = new Date(this.millis);
        this.calendarPicker.setDate(this.convertToCalendarDate(this.millis), fromInput);
        if (!fromInput) {
            this.timeInput.node().value = this.createTimeString(Utils.offsetFromUTC(selectedDate));
        }
    }

    private createTimeString(currDate: Date) {
        let offsetDate = Utils.offsetFromUTC(currDate, this.chartOptions.offset);
        return this.getTimeFormat()(currDate);
    }

    // convert to representation such that: convertedDate.toString() === originalDate.toISOString()
    private convertToLocal(date: Date) {
        return new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);
    }

    private createTimePicker() {
        const timeLabel = this.timeControls.append("h4").classed("tsi-timeLabel", true).text(this.getString('Date/Time'));
        this.timeInput = this.timeControls.append('input').attr('class', 'tsi-dateTimeInput tsi-input')
            .on('input', () => {
                this.checkDateTimeValidity();
                if (this.isValid) {
                    let parsedMillis = this.parseUserInputDateTime();
                    this.setMillis(parsedMillis, false);
                    this.updateDisplayedDateTime(true);
                }
            })
            .on('keydown', (event) => {
                if (event.keyCode === KEY_CODES.TAB && event.shiftKey && this.chartOptions.dTPIsModal) {
                    this.saveButton.node().focus();
                    event.preventDefault();
                }
            });
    }

    private _createTimePicker(): void {
        this.createTimePicker();
    }
}

export default SingleDateTimePicker;