import { C as ChartDataOptions } from './ChartDataOptions-CkfzpWKW.js';
import './Interfaces-DBBnA26W.js';

declare class TsqExpression extends ChartDataOptions {
    private instanceObject;
    private variableObject;
    constructor(instanceObject: any, variableObject: any, searchSpan: any, colorOrOptionsObject: any, alias?: string, contextMenu?: Array<any>);
    toTsq(roundFromTo?: boolean, getEvents?: boolean, getSeries?: boolean): {
        getEvents: {};
        getSeries?: undefined;
        aggregateSeries?: undefined;
    } | {
        getSeries: {};
        getEvents?: undefined;
        aggregateSeries?: undefined;
    } | {
        aggregateSeries: {};
        getEvents?: undefined;
        getSeries?: undefined;
    };
    toStatsTsq(fromMillis: any, toMillis: any): {
        getEvents: {};
        getSeries?: undefined;
        aggregateSeries?: undefined;
    } | {
        getSeries: {};
        getEvents?: undefined;
        aggregateSeries?: undefined;
    } | {
        aggregateSeries: {};
        getEvents?: undefined;
        getSeries?: undefined;
    };
}

export { TsqExpression as default };
