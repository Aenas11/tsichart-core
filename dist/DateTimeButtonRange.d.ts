import { D as DateTimeButton } from './DateTimeButton-CGr0A85x.js';
import './ChartComponent-DStYAnZD.js';
import './Enums-CjbndcX3.js';
import './Component-C2OFsACF.js';
import './Interfaces-DBBnA26W.js';
import './ChartComponentData-dXJYEzCd.js';
import './EllipsisMenu.js';

declare class DateTimeButtonRange extends DateTimeButton {
    private onCancel;
    private fromMillis;
    private toMillis;
    constructor(renderTarget: Element);
    private setButtonText;
    private onClose;
    render(chartOptions: any, minMillis: number, maxMillis: number, fromMillis?: number, toMillis?: number, onSet?: any, onCancel?: any): void;
}

export { DateTimeButtonRange as default };
