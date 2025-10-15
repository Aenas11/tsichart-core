import { G as GroupedBarChartData } from './GroupedBarChartData-CtsVpU8c.js';
import { C as ChartVisualizationComponent } from './ChartVisualizationComponent-BthRAZyW.js';
import './ChartComponentData-dXJYEzCd.js';
import './ChartComponent-DStYAnZD.js';
import './Enums-CjbndcX3.js';
import './Component-C2OFsACF.js';
import './Interfaces-DBBnA26W.js';
import './EllipsisMenu.js';

declare class GroupedBarChart extends ChartVisualizationComponent {
    private contextMenu;
    private setStateFromData;
    private timestamp;
    private isStacked;
    private stackedButton;
    chartComponentData: GroupedBarChartData;
    constructor(renderTarget: Element);
    GroupedBarChart(): void;
    render(data: any, options: any, aggregateExpressionOptions: any): void;
}

export { GroupedBarChart as default };
