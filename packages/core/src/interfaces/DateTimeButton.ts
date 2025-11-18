import * as d3 from 'd3';
import Utils from "../utils";
import { ChartComponent } from "./ChartComponent";
import DateTimePicker from '../components/DateTimePicker/DateTimePicker';

type OnSetCallback = (fromMillis: number, toMillis?: number, offset?: string, isRelative?: boolean, quickTime?: number) => void;

class DateTimeButton extends ChartComponent {

    protected dateTimePicker: DateTimePicker;
    protected minMillis: number;
    protected maxMillis: number;
    protected onSet: OnSetCallback;
    protected dateTimeButton: d3.Selection<HTMLButtonElement, unknown, null, undefined>;
    protected dateTimePickerContainer: d3.Selection<HTMLDivElement, unknown, null, undefined>;

    constructor(renderTarget: Element) {
        super(renderTarget);
    }

    protected buttonDateTimeFormat(millis: number): string {
        const date = new Date(millis);
        const locale = this.chartOptions.dateLocale || 'en-US';
        const is24Hour = this.chartOptions.is24HourTime !== false;

        // Respect minutesForTimeLabels option: true = minutes only, false = include seconds/millis
        const includeSeconds = this.chartOptions.minutesForTimeLabels === false;

        const formatOptions: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: !is24Hour,
            timeZoneName: 'short', // Let Intl handle timezone display
        };

        // Only include seconds if minutesForTimeLabels is false
        if (includeSeconds) {
            formatOptions.second = '2-digit';
            // TypeScript doesn't yet have fractionalSecondDigits in the type definition
            // but it's supported in modern browsers
            (formatOptions as any).fractionalSecondDigits = 3;
        }

        try {
            if (this.chartOptions.offset && this.chartOptions.offset !== 'Local') {
                // Directly pass the offset/IANA name. Modern browsers can handle many formats.
                formatOptions.timeZone = this.chartOptions.offset;
            }
            return new Intl.DateTimeFormat(locale, formatOptions).format(date);
        } catch (error) {
            console.warn(`Failed to format date for locale ${locale} with offset ${this.chartOptions.offset}:`, error);

            // Fallback to the old utility function if Intl fails
            return Utils.timeFormat(!this.chartOptions.minutesForTimeLabels, !this.chartOptions.minutesForTimeLabels,
                this.chartOptions.offset, this.chartOptions.is24HourTime, 0, null, this.chartOptions.dateLocale)(millis);
        }
    }

    protected initializeDateTimeButton(chartOptions: any, minMillis: number, maxMillis: number, onSet: OnSetCallback = null) {
        this.chartOptions.setOptions(chartOptions);
        this.minMillis = minMillis;
        this.maxMillis = maxMillis;
        this.onSet = onSet ? onSet : () => { };
        let dateTimeContainer = d3.select(this.renderTarget);
        if (!this.dateTimeButton) {
            this.dateTimeButton = dateTimeContainer.append("button")
                .classed('tsi-dateTimeButton', true);
        }
        if (!this.dateTimePickerContainer) {
            this.dateTimePickerContainer = dateTimeContainer.append('div').classed('tsi-dateTimePickerContainer', true)
                .attr('role', 'dialog')
                .attr('aria-label', this.getString('a time selection control dialog'));
            this.dateTimePickerContainer.style('display', 'none');
        }
        super.themify(d3.select(this.renderTarget), this.chartOptions.theme);
    }

    private getTimezoneFromOffset(offset: string): string {

        const timezoneMap = {
            'UTC': 'UTC',
            'EST': 'America/New_York',
            'PST': 'America/Los_Angeles',
            'CST': 'America/Chicago',
            'MST': 'America/Denver'
        };

        return timezoneMap[offset] || 'UTC';
    }
}
export { DateTimeButton }
