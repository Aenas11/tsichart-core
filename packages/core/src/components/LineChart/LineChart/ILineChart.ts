import * as d3 from 'd3';
import { ChartDataOptions } from '../../../models/ChartDataOptions';
import { LineChartData } from '../../../models/LineChartData';
import ContextMenu from '../../ContextMenu';
import CustomTooltip from './Tooltip';
import Marker from './Marker';
import { ILineChartOptions } from "./ILineChartOptions";

export interface ILineChart {
    chartComponentData: LineChartData;
    chartOptions: ILineChartOptions;
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

    renderTarget: Element;
    targetElement: any;
    svgSelection: any;

    x: any;
    y: any;
    yMap: any;

=======
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring

    renderTarget: Element;
    targetElement: any;
    svgSelection: any;

    x: any;
    y: any;
    yMap: any;

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 7055322ec922188f65223b2000a759252bbbb96f
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
    chartMargins: any;
    chartHeight: number;
    chartWidth: number;
    height: number;
    xOffset: number;
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

    contextMenu: ContextMenu;
    brushContextMenu: ContextMenu;

    voronoiDiagram: any;
    isDroppingMarker: boolean;
    possibleTimesArray: any;

    activeMarker: Marker;
    colorMap: any;

=======
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring

    contextMenu: ContextMenu;
    brushContextMenu: ContextMenu;

    voronoiDiagram: any;
    isDroppingMarker: boolean;
    possibleTimesArray: any;

    activeMarker: Marker;
    colorMap: any;

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 7055322ec922188f65223b2000a759252bbbb96f
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
    draw: (isFromResize?: boolean, event?: any) => void;

    getHandleHeight: () => number;
    voronoiClick: (d3Event, mouseEvent) => void;
    getSVGLeftOffset: () => number;
    unstickySeries: (aggKey: string, splitBy?: string) => void;
    stickySeries: (aggregateKey: string, splitBy?: string) => void;
    voronoiMousemove: (mouseEvent) => void;
    getValueOfVisible: (d: any) => any;
    focusOnlyHoveredSeries: (aggKey: any, splitBy: any, shouldSetFocusedValues: boolean) => void;
    findClosestValidTime: (rawMillis: number) => number;
    labelMouseover: (aggregateKey: string, splitBy?: string) => void;
    labelMouseout: () => void;
    getMarkerMarginLeft: () => number;

    getChartOptions: () => ILineChartOptions;
    brush: any;
    legendObject: any;
    getFilteredAndSticky: (aggValues: any) => any;
}
