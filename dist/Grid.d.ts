import { C as Component, a as ChartOptions } from './Component-C2OFsACF.js';
import { C as ChartComponentData } from './ChartComponentData-dXJYEzCd.js';
import './Enums-CjbndcX3.js';
import './Interfaces-DBBnA26W.js';

declare class Grid extends Component {
    private gridComponent;
    private rowLabelKey;
    private colorKey;
    private aggIndexKey;
    private chartComponentData;
    private draw;
    private closeButton;
    private filteredTimestamps;
    private table;
    private tableHeaderRow;
    private tableContentRows;
    usesSeconds: boolean;
    usesMillis: boolean;
    constructor(renderTarget: Element);
    static hideGrid(renderTarget: any): void;
    static showGrid(renderTarget: any, chartOptions: ChartOptions, aggregateExpressionOptions: any, chartComponentData: ChartComponentData): void;
    static createGridEllipsisOption(renderTarget: any, chartOptions: ChartOptions, aggregateExpressionOptions: any, chartComponentData: ChartComponentData, labelText?: string): {
        iconClass: string;
        label: string;
        action: () => void;
        description: string;
    };
    Grid(): void;
    private cellClass;
    focus: (rowIdx: any, colIdx: any) => void;
    renderFromAggregates(data: any, options: any, aggregateExpressionOptions: any, chartComponentData: any): void;
    private getRowData;
    private convertSeriesToGridData;
    private getFormattedDate;
    private setFilteredTimestamps;
    private addHeaderCells;
    private addValueCells;
    render(data: any, options: any, aggregateExpressionOptions: any, chartComponentData?: ChartComponentData): void;
    private arrowNavigate;
}

export { Grid as default };
