import { C as ChartComponent } from './ChartComponent-DStYAnZD.js';
import './Enums-CjbndcX3.js';
import './Component-C2OFsACF.js';
import './Interfaces-DBBnA26W.js';
import './ChartComponentData-dXJYEzCd.js';
import './EllipsisMenu.js';

declare class EventsTable extends ChartComponent {
    private eventsTable;
    private eventsLegend;
    private headers;
    private maxVisibleIndex;
    private isAscending;
    private timestampColumnName;
    private sortColumn;
    private allSelectedState;
    private eventsTableData;
    private margins;
    constructor(renderTarget: Element);
    EventsTable(): void;
    renderFromEventsTsx(eventsFromTsx: any, chartOptions: any): void;
    render(events: any, chartOptions: any, fromTsx?: boolean): void;
    renderLegend(): void;
    setLegendColumnStates(): void;
    getSelectAllState(): string;
    setSelectAllState(): void;
    private getFilteredColumnKeys;
    private buildHeaders;
    private adjustHeaderWidth;
    private buildTable;
    private formatValue;
}

export { EventsTable as default };
