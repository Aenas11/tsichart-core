import { H as HorizontalMarker } from './Interfaces-DBBnA26W.js';

declare class ChartDataOptions {
    searchSpan: any;
    color: string | Function;
    alias: string;
    contextMenu: any;
    measureTypes: Array<string>;
    interpolationFunction: string;
    yExtent: any;
    includeEnvelope: boolean;
    includeDots: boolean;
    visibilityState: Array<any>;
    timeShift: string;
    startAt: string;
    dataType: string;
    valueMapping: any;
    height: number;
    onElementClick: any;
    eventElementType: any;
    rollupCategoricalValues: boolean;
    tooltipAttributes: Array<any>;
    positionX: number;
    positionY: number;
    swimLane: number;
    variableAlias: any;
    connectPoints: boolean;
    pointConnectionMeasure: string;
    positionXVariableName: string;
    positionYVariableName: string;
    image: string;
    isRawData: boolean;
    isVariableAliasShownOnTooltip: boolean;
    horizontalMarkers: Array<HorizontalMarker>;
    constructor(optionsObject: Object);
}

export { ChartDataOptions as C };
