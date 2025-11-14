import * as d3 from 'd3';
import Utils from "../utils";
import { ChartComponent } from "./ChartComponent";

class DateTimeButton extends ChartComponent {

    protected dateTimePicker: any;
    private pickerIsVisible: boolean = false;
    protected minMillis: number;
    protected maxMillis: number;
    protected onSet: any;
    protected dateTimeButton: any;
    protected dateTimePickerContainer: any;

    constructor(renderTarget: Element) {
        super(renderTarget);
    }

    protected buttonDateTimeFormat(millis) {
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
            hour12: !is24Hour
        };
        
        // Only include seconds if minutesForTimeLabels is false
        if (includeSeconds) {
            formatOptions.second = '2-digit';
        }

        try {
            if (this.chartOptions.offset && this.chartOptions.offset !== 'Local') {
                formatOptions.timeZone = this.getTimezoneFromOffset(this.chartOptions.offset);
            }
            let formattedDate = date.toLocaleString(locale, formatOptions);
            
            // Only append milliseconds if minutesForTimeLabels is false
            if (includeSeconds) {
                const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
                formattedDate = `${formattedDate}.${milliseconds}`;
            }
            
            return formattedDate;
        } catch (error) {
            console.warn(`Failed to format date for locale ${locale}:`, error);

            return Utils.timeFormat(!this.chartOptions.minutesForTimeLabels, !this.chartOptions.minutesForTimeLabels,
                this.chartOptions.offset, this.chartOptions.is24HourTime, 0, null, this.chartOptions.dateLocale)(millis);
        }
    }

    public render(chartOptions, minMillis, maxMillis, onSet = null) {
        let self = this;
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
