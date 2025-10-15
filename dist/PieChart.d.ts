import { G as GroupedBarChartData } from './GroupedBarChartData-CtsVpU8c.js';
import { C as ChartVisualizationComponent } from './ChartVisualizationComponent-BthRAZyW.js';
import './ChartComponentData-dXJYEzCd.js';
import './ChartComponent-DStYAnZD.js';
import './Enums-CjbndcX3.js';
import './Component-C2OFsACF.js';
import './Interfaces-DBBnA26W.js';
import './EllipsisMenu.js';

declare class PieChartData extends GroupedBarChartData {
    flatValueArray: any;
    visibleValuesSum: number;
    constructor();
    mergeDataToDisplayStateAndTimeArrays(data: any, timestamp: any, aggregateExpressionOptions?: any): void;
    updateFlatValueArray(timestamp: any): void;
}

declare class PieChart extends ChartVisualizationComponent {
    private contextMenu;
    chartComponentData: PieChartData;
    constructor(renderTarget: Element);
    PieChart(): void;
    render(data: any, options: any, aggregateExpressionOptions: any): void;
}

export { PieChart as default };
