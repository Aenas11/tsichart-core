/**
 * TSIChart Type Definitions
 * 
 * Generic, flexible type system for time series chart data.
 * Industry-agnostic and fully customizable for any use case.
 * 
 * @example
 * // Import core types
 * import { ChartData, DataPoint, TimeSeries } from 'tsichart-core/types';
 * 
 * @example
 * // Define custom metrics for your domain
 * interface MyMetrics extends Record<string, number> {
 *   temperature: number;
 *   pressure: number;
 * }
 * 
 * const data: ChartData<MyMetrics> = [{
 *   "Sensor1": {
 *     "": {
 *       "2023-01-01T00:00:00Z": { temperature: 22.5, pressure: 1013 }
 *     }
 *   }
 * }];
 * 
 * @example
 * // Import everything
 * import * as ChartTypes from 'tsichart-core/types';
 */

// Core data structure types
export {
    DataPoint,
    TimeSeries,
    SeriesData,
    Series,
    ChartData,
    isChartData,
    SeriesName,
    SplitByValue
} from './ChartData';
