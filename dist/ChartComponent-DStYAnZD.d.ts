import { T as TooltipMeasureFormat } from './Enums-CjbndcX3.js';
import { C as Component } from './Component-C2OFsACF.js';
import { C as ChartComponentData } from './ChartComponentData-dXJYEzCd.js';
import EllipsisMenu from './EllipsisMenu.js';

declare class Legend extends Component {
    drawChart: any;
    legendElement: any;
    legendWidth: number;
    private legendState;
    private stickySeriesAction;
    private labelMouseover;
    private labelMouseout;
    private svgSelection;
    private chartComponentData;
    constructor(drawChart: any, renderTarget: Element, legendWidth: number);
    private labelMouseoutWrapper;
    private toggleSplitByVisible;
    triggerSplitByFocus(aggKey: string, splitBy: string): void;
    private getHeightPerSplitBy;
    private createGradient;
    private isNonNumeric;
    private createNonNumericColorKey;
    private createCategoricalColorKey;
    private createEventsColorKey;
    private renderSplitBys;
    private toggleSticky;
    draw(legendState: string, chartComponentData: any, labelMouseover: any, svgSelection: any, options: any, labelMouseoutAction?: any, stickySeriesAction?: any, event?: any): void;
}

declare class ChartComponent extends Component {
    readonly MINWIDTH = 350;
    protected MINHEIGHT: number;
    readonly CONTROLSWIDTH = 200;
    readonly GUTTERWIDTH = 6;
    data: any;
    aggregateExpressionOptions: any;
    protected chartControlsPanel: any;
    protected ellipsisContainer: any;
    protected ellipsisMenu: EllipsisMenu;
    protected legendObject: Legend;
    protected width: number;
    protected chartWidth: number;
    protected svgSelection: any;
    protected legendWidth: number;
    draw: any;
    chartComponentData: ChartComponentData;
    chartMargins: any;
    constructor(renderTarget: Element);
    showGrid(): void;
    gatedShowGrid(): void;
    hideGrid(): void;
    isGridVisible(): boolean;
    protected drawEllipsisMenu(additionalEllipsisItems?: any[]): void;
    downloadAsCSV: (isScatterPlot?: boolean) => void;
    protected removeControlPanel(): void;
    protected removeEllipsisMenu(): void;
    protected getWidth(): number;
    getVisibilityState(): any[];
    protected ellipsisItemsExist(): boolean;
    protected getDataType(aggKey: any): any;
    protected getCDOFromAggKey(aggKey: any): any;
    protected getFilteredMeasures(measureList: any, visibleMeasure: any, measureFormat: TooltipMeasureFormat, xyrMeasures?: any): any;
    protected convertToTimeValueFormat(d: any): {
        aggregateKey: any;
        splitBy: any;
        aggregateName: any;
        measures: {};
    };
    protected formatDate(date: any, shiftMillis: any): string;
    protected tooltipFormat(d: any, text: any, measureFormat: TooltipMeasureFormat, xyrMeasures?: any): void;
    protected getSVGWidth(): any;
    protected getChartWidth(legendWidth?: number): number;
    protected calcSVGWidth(): any;
    protected setControlsPanelWidth(): void;
    protected legendPostRenderProcess(legendState: string, chartElement: any, shouldSetControlsWidth: boolean, splitLegendOnDrag?: any): void;
    protected splitLegendAndSVG(chartElement: any, onDrag?: () => void): void;
}

export { ChartComponent as C };
