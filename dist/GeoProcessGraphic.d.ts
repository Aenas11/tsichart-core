import { H as HistoryPlayback } from './HistoryPlayback-BUNZlPNJ.js';
import TsqExpression from './TsqExpression.js';
import 'd3';
import './Component-C2OFsACF.js';
import './Enums-CjbndcX3.js';
import './Interfaces-DBBnA26W.js';
import './PlaybackControls.js';
import './ChartDataOptions-CkfzpWKW.js';

declare class GeoProcessGraphic extends HistoryPlayback {
    private azureMapsSubscriptionKey;
    private zoom;
    private width;
    private height;
    private theme;
    private center;
    private bearing;
    private pitch;
    private maxZoom;
    private minZoom;
    private duration;
    constructor(renderTarget: Element);
    render(environmentFqdn: string, getToken: () => Promise<string>, data: Array<TsqExpression>, chartOptions: any): void;
    protected loadResources(): Promise<any>;
    protected draw(): void;
    protected getDataPoints(results: Array<IGeoProcessGraphicLabelInfo>): void;
    protected parseTsqResponse(response: any): {};
    protected updateDataMarkers(dataPoints: Array<any>): void;
    protected createTable(dataPointArr: any, idx: any): HTMLDivElement;
}
interface IGeoProcessGraphicLabelInfo {
}

export { GeoProcessGraphic as default };
