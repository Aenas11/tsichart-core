import { H as HistoryPlayback, G as GraphicInfo } from './HistoryPlayback-BUNZlPNJ.js';
import TsqExpression from './TsqExpression.js';
import 'd3';
import './Component-C2OFsACF.js';
import './Enums-CjbndcX3.js';
import './Interfaces-DBBnA26W.js';
import './PlaybackControls.js';
import './ChartDataOptions-CkfzpWKW.js';

declare class ProcessGraphic extends HistoryPlayback {
    private graphicSrc;
    constructor(renderTarget: Element);
    render(environmentFqdn: string, getToken: () => Promise<string>, graphicSrc: string, data: Array<TsqExpression>, chartOptions: any): void;
    protected loadResources(): Promise<GraphicInfo>;
    protected draw(): void;
    private getResizedImageDimensions;
    protected getDataPoints(results: Array<IProcessGraphicLabelInfo>): void;
    protected updateDataMarkers(graphicValues: Array<IProcessGraphicLabelInfo>): void;
    protected parseTsqResponse(response: any): any;
    protected sanitizeAttribute(str: any): string;
}
interface IProcessGraphicLabelInfo {
    value: number;
    alias: string;
    x: number;
    y: number;
    color: string;
    onClick: Function;
}

export { ProcessGraphic as default };
