import { C as ChartComponent } from './ChartComponent-DStYAnZD.js';
import './Enums-CjbndcX3.js';
import './Component-C2OFsACF.js';
import './Interfaces-DBBnA26W.js';
import './ChartComponentData-dXJYEzCd.js';
import './EllipsisMenu.js';

declare class SingleDateTimePicker extends ChartComponent {
    private calendar;
    private calendarPicker;
    private timeControls;
    private minMillis;
    private maxMillis;
    private millis;
    private minutes;
    private hours;
    private onSet;
    private targetElement;
    private isValid;
    private offsetName;
    private date;
    private timeInput;
    private saveButton;
    constructor(renderTarget: Element);
    getMillis(): number;
    render(chartOptions: any, minMillis: number, maxMillis: number, millis?: number, onSet?: any): void;
    private roundDay;
    private setSelectedDate;
    private createCalendar;
    private setDate;
    private setIsValid;
    private setMillis;
    private displayErrors;
    private checkDateTimeValidity;
    private dateTimeIsValid;
    private getTimeFormat;
    private parseUserInputDateTime;
    private convertToCalendarDate;
    private updateDisplayedDateTime;
    private createTimeString;
    private convertToLocal;
    private createTimePicker;
}

export { SingleDateTimePicker as default };
