// Import missing types
import { BackgroundBand } from '../components/LineChart/ILineChartOptions';
import { HorizontalMarker } from '../utils/Interfaces';
import { YAxisStates } from '../constants/Enums';

/**
 * Chart Data Type Definitions
 * 
 * These types define the structure for time series data used throughout the tsichart-core library.
 * The data structure is a nested hierarchy: Array -> Series -> SplitBy -> Timestamp -> Metrics
 */

/**
 * Represents a single data point at a specific timestamp with flexible metric values.
 * 
 * @template TMetrics - Optional generic type for strongly typing specific metrics
 * 
 * @example
 * // Generic usage (accepts any numeric metrics)
 * const point: DataPoint = { value: 100, temperature: 22.5, pressure: 1013 };
 * 
 * @example
 * // Strongly typed usage
 * interface SensorMetrics { temperature: number; humidity: number; }
 * const point: DataPoint<SensorMetrics> = { temperature: 22.5, humidity: 65 };
 */
export type DataPoint<TMetrics extends Record<string, number> = Record<string, number>> = TMetrics;

/**
 * Time series data for a single split-by value.
 * Keys are ISO 8601 timestamp strings, values are data points with metrics.
 * 
 * @template TMetrics - Optional generic type for strongly typing specific metrics
 * 
 * @example
 * const timeSeries: TimeSeries = {
 *   "2023-01-01T00:00:00Z": { value: 100, temperature: 22 },
 *   "2023-01-01T01:00:00Z": { value: 110, temperature: 21 }
 * };
 */
export interface TimeSeries<TMetrics extends Record<string, number> = Record<string, number>> {
    [timestamp: string]: DataPoint<TMetrics>;
}

/**
 * Series data with optional split-by groupings.
 * Keys are split-by values (e.g., "Station0", "Machine1", "Sensor_A").
 * Use empty string "" for series without split-by grouping.
 * 
 * @template TMetrics - Optional generic type for strongly typing specific metrics
 * 
 * @example
 * // With split-by values
 * const seriesData: SeriesData = {
 *   "Station0": { "2023-01-01T00:00:00Z": { value: 100 } },
 *   "Station1": { "2023-01-01T00:00:00Z": { value: 95 } }
 * };
 * 
 * @example
 * // Without split-by (use empty string)
 * const seriesData: SeriesData = {
 *   "": { "2023-01-01T00:00:00Z": { value: 100 } }
 * };
 */
export interface SeriesData<TMetrics extends Record<string, number> = Record<string, number>> {
    [splitBy: string]: TimeSeries<TMetrics>;
}

/**
 * A single series in the chart data array.
 * Keys are series names (e.g., "Factory0", "Temperature", "CPU_Usage").
 * 
 * @template TMetrics - Optional generic type for strongly typing specific metrics
 * 
 * @example
 * const series: Series = {
 *   "Factory0": {
 *     "Station0": {
 *       "2023-01-01T00:00:00Z": { value: 100, temperature: 22 }
 *     }
 *   }
 * };
 */
export interface Series<TMetrics extends Record<string, number> = Record<string, number>> {
    [seriesName: string]: SeriesData<TMetrics>;
}

/**
 * Complete chart data structure - an array of series objects.
 * This is the top-level type that should be used for chart render methods.
 * 
 * @template TMetrics - Optional generic type for strongly typing specific metrics
 * 
 * @example
 * // Generic usage (most common)
 * const data: ChartData = [{
 *   "Factory0": {
 *     "Station0": {
 *       "2023-01-01T00:00:00Z": { value: 100, temperature: 22 },
 *       "2023-01-01T01:00:00Z": { value: 110, temperature: 21 }
 *     },
 *     "Station1": {
 *       "2023-01-01T00:00:00Z": { value: 95, temperature: 23 }
 *     }
 *   }
 * }, {
 *   "Factory1": {
 *     "Station0": {
 *       "2023-01-01T00:00:00Z": { value: 88, temperature: 24 }
 *     }
 *   }
 * }];
 * 
 * @example
 * // Strongly typed usage
 * interface FactoryMetrics { value: number; temperature: number; pressure?: number; }
 * const data: ChartData<FactoryMetrics> = [{
 *   "Factory0": {
 *     "Station0": {
 *       "2023-01-01T00:00:00Z": { value: 100, temperature: 22, pressure: 1013 }
 *     }
 *   }
 * }];
 */
export type ChartData<TMetrics extends Record<string, number> = Record<string, number>> =
    Series<TMetrics>[];

/**
 * Type guard to check if data conforms to ChartData structure
 */
export function isChartData(data: unknown): data is ChartData {
    if (!Array.isArray(data)) return false;

    for (const series of data) {
        if (typeof series !== 'object' || series === null) return false;

        for (const seriesData of Object.values(series)) {
            if (typeof seriesData !== 'object' || seriesData === null) return false;

            for (const timeSeries of Object.values(seriesData)) {
                if (typeof timeSeries !== 'object' || timeSeries === null) return false;

                for (const dataPoint of Object.values(timeSeries)) {
                    if (typeof dataPoint !== 'object' || dataPoint === null) return false;

                    // Check that all values in the data point are numbers
                    for (const value of Object.values(dataPoint)) {
                        if (typeof value !== 'number') return false;
                    }
                }
            }
        }
    }

    return true;
}

/**
 * Helper type for extracting series names from ChartData
 */
export type SeriesName<T extends ChartData> = T extends Array<infer S>
    ? S extends Record<infer K, any>
    ? K extends string
    ? K
    : never
    : never
    : never;

/**
 * Helper type for extracting split-by values from a Series
 */
export type SplitByValue<T extends Series> = T extends Record<string, infer S>
    ? S extends Record<infer K, any>
    ? K extends string
    ? K
    : never
    : never
    : never;



export interface BackgroundBandCondition {
    condition: 'Greater Than' | 'Less Than';
    thresholdValue: number;
    color: string;
    opacity?: number;
    label?: string;
}

export interface swimLaneOption {
    yAxisType: YAxisStates;
    horizontalMarkers?: Array<HorizontalMarker>;
    showBackgroundBands?: boolean;
    backgroundBands?: BackgroundBand[];
    backgroundBandCondition?: BackgroundBandCondition;
}
