import * as d3 from 'd3';
import { ChartDataOptions } from '../../../models/ChartDataOptions';
import { LineChartData } from '../../../models/LineChartData';
import ContextMenu from '../../ContextMenu';
import Tooltip from '../../Tooltip';
import Marker from '../../Marker';
import { ILineChartOptions } from "./ILineChartOptions";

export interface ILineChart {
    chartComponentData: LineChartData;
    chartOptions: ILineChartOptions;

    renderTarget: Element;
    targetElement: any;
    svgSelection: any;

    x: any;

    chartMargins: any;
    chartHeight: number;
    chartWidth: number;
    xOffset: number;

    contextMenu: ContextMenu;
    brushContextMenu: ContextMenu;

    voronoiDiagram: any;
    isDroppingMarker: boolean;
    possibleTimesArray: any;

    activeMarker: Marker;

    getHandleHeight: () => number;
    voronoiClick: (d3Event, mouseEvent) => void;
    getSVGLeftOffset: () => number;
    unstickySeries: (aggKey: string, splitBy?: string) => void;
    stickySeries: (aggregateKey: string, splitBy?: string) => void;
    voronoiMousemove: (mouseEvent) => void;

    getChartOptions: () => ILineChartOptions;
    brush: any;
}
