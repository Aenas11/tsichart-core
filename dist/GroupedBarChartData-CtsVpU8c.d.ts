import { C as ChartComponentData } from './ChartComponentData-dXJYEzCd.js';

declare class GroupedBarChartData extends ChartComponentData {
    timestamp: any;
    valuesAtTimestamp: any;
    valuesOfVisibleType: Array<any>;
    aggsSeries: any;
    globalMax: number;
    globalMin: number;
    stackedAggregateObject: any;
    constructor();
    mergeDataToDisplayStateAndTimeArrays(data: any, timestamp: any, aggregateExpressionOptions?: any): void;
    private stackMin;
    private stackMax;
    setEntireRangeData(scaledToCurrentTime: any): void;
    setValuesAtTimestamp(): void;
    getValueContainerData(aggKey: any): Array<any>;
}

export { GroupedBarChartData as G };
