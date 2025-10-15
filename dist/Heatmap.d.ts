import { T as TemporalXAxisComponent } from './TemporalXAxisComponent-DtcdaTjh.js';
import './ChartVisualizationComponent-BthRAZyW.js';
import './ChartComponent-DStYAnZD.js';
import './Enums-CjbndcX3.js';
import './Component-C2OFsACF.js';
import './Interfaces-DBBnA26W.js';
import './ChartComponentData-dXJYEzCd.js';
import './EllipsisMenu.js';

declare class Heatmap extends TemporalXAxisComponent {
    private lineHeight;
    private splitByLabelWidth;
    private heatmapWrapper;
    private splitByLabels;
    private heatmapCanvasMap;
    private timeLabels;
    private height;
    private timeLabelsHeight;
    private visibleAggs;
    constructor(renderTarget: Element);
    private focusOnEllipsis;
    private createControlsPanel;
    private chartControlsExist;
    private addTimeLabels;
    mouseover: (hoveredAggKey: any, hoveredSplitBy: any) => void;
    mouseout: (selection: any, hoveredAggKey: any) => void;
    render(data: any, chartOptions: any, aggregateExpressionOptions: any): void;
    renderTimeLabels: (focusStartTime: any, focusEndTime: any, focusX1: any, focusX2: any, focusY: any, yOffset: any, shiftMillis: any) => void;
}

export { Heatmap as default };
