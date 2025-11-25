/**
 * Example Usage of TSIChart Type Definitions
 * 
 * This file demonstrates various ways to use the type system with tsichart-core.
 * All examples show user-defined custom metric types - the library is industry-agnostic.
 */

import {
    ChartData,
    DataPoint,
    TimeSeries,
    SeriesData,
    Series,
    isChartData
} from './index';

// ============================================================================
// User-Defined Metric Types (Examples for different industries)
// ============================================================================

/** Manufacturing/Factory metrics */
interface FactoryMetrics extends Record<string, number> {
    value: number;
    temperature: number;
}

/** Aggregated statistical metrics */
interface AggregateMetrics extends Record<string, number> {
    avg: number;
    min: number;
    max: number;
}

/** Simple single-value metric */
interface SingleValueMetrics extends Record<string, number> {
    value: number;
}

/** Environmental sensor metrics */
interface EnvironmentalMetrics extends Record<string, number> {
    temperature: number;
    humidity: number;
    pressure: number;
}

// ============================================================================
// Example 1: Generic ChartData (Most Flexible)
// ============================================================================

function example1_GenericData() {
    const data: ChartData = [{
        "Temperature": {
            "Sensor1": {
                "2023-01-01T00:00:00Z": { value: 22.5, humidity: 65 },
                "2023-01-01T01:00:00Z": { value: 23.1, humidity: 63 }
            },
            "Sensor2": {
                "2023-01-01T00:00:00Z": { value: 21.8, humidity: 68 }
            }
        }
    }];

    console.log('Generic data example:', data);
    return data;
}

// ============================================================================
// Example 2: Using Pre-defined FactoryMetrics
// ============================================================================

function example2_FactoryMetrics() {
    const data: ChartData<FactoryMetrics> = [{
        "Factory0": {
            "Station0": {
                "2023-01-01T00:00:00Z": { value: 100, temperature: 22.5 },
                "2023-01-01T01:00:00Z": { value: 105, temperature: 23.0 }
            },
            "Station1": {
                "2023-01-01T00:00:00Z": { value: 95, temperature: 21.5 }
            }
        }
    }, {
        "Factory1": {
            "Station0": {
                "2023-01-01T00:00:00Z": { value: 88, temperature: 24.0 }
            }
        }
    }];

    // TypeScript enforces that only 'value' and 'temperature' exist
    return data;
}

// ============================================================================
// Example 3: Creating Type Aliases for Convenience
// ============================================================================

// Users can create their own type aliases
type FactoryChartData = ChartData<FactoryMetrics>;

function example3_TypeAlias(): FactoryChartData {
    return [{
        "Factory0": {
            "Station0": {
                "2023-01-01T00:00:00Z": { value: 100, temperature: 22.5 }
            }
        }
    }];
}

// ============================================================================
// Example 4: Using AggregateMetrics for Bucketed Data
// ============================================================================

type AggregateChartData = ChartData<AggregateMetrics>;

function example4_AggregateMetrics(): AggregateChartData {
    const data: ChartData<AggregateMetrics> = [{
        "Temperature": {
            "Room1": {
                "2023-01-01T00:00:00Z": { avg: 22.5, min: 20.0, max: 25.0 },
                "2023-01-01T01:00:00Z": { avg: 23.0, min: 21.0, max: 25.5 }
            }
        }
    }];

    return data;
}

// ============================================================================
// Example 5: Custom Metric Interface
// ============================================================================

interface CustomSensorMetrics extends Record<string, number> {
    pressure: number;
    flow: number;
    viscosity: number;
    density?: number; // optional metric
}

function example5_CustomMetrics() {
    const data: ChartData<CustomSensorMetrics> = [{
        "Pipeline_A": {
            "Sensor_1": {
                "2023-01-01T00:00:00Z": {
                    pressure: 150.5,
                    flow: 25.3,
                    viscosity: 1.2,
                    density: 0.998
                }
            }
        }
    }];

    return data;
}

// ============================================================================
// Example 6: Building Data Programmatically
// ============================================================================

function example6_GenerateData(): ChartData<FactoryMetrics> {
    const data: ChartData<FactoryMetrics> = [];
    const from = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

    for (let i = 0; i < 3; i++) {
        const series: Series<FactoryMetrics> = {};
        const factoryName = `Factory${i}`;
        const seriesData: SeriesData<FactoryMetrics> = {};

        for (let j = 0; j < 3; j++) {
            const stationName = `Station${j}`;
            const timeSeries: TimeSeries<FactoryMetrics> = {};

            // Generate hourly data points
            for (let k = 0; k < 24; k++) {
                const timestamp = new Date(from.getTime() + k * 60 * 60 * 1000);
                const dataPoint: DataPoint<FactoryMetrics> = {
                    value: 50 + i * 20 + j * 10 + Math.sin(k / 4) * 15,
                    temperature: 20 + Math.sin(k / 6) * 8 + Math.random() * 3
                };

                timeSeries[timestamp.toISOString()] = dataPoint;
            }

            seriesData[stationName] = timeSeries;
        }

        series[factoryName] = seriesData;
        data.push(series);
    }

    return data;
}

// ============================================================================
// Example 7: Runtime Type Validation
// ============================================================================

function example7_TypeGuard(untrustedData: unknown) {
    if (isChartData(untrustedData)) {
        // TypeScript now knows this is ChartData
        console.log('Valid chart data with', untrustedData.length, 'series');
        return untrustedData;
    } else {
        throw new Error('Invalid chart data format');
    }
}

// ============================================================================
// Example 8: Function That Accepts Typed Data
// ============================================================================

function example8_ProcessData(data: ChartData<FactoryMetrics>): number {
    let totalValue = 0;

    for (const series of data) {
        for (const seriesName in series) {
            const seriesData = series[seriesName];

            for (const splitBy in seriesData) {
                const timeSeries = seriesData[splitBy];

                for (const timestamp in timeSeries) {
                    const dataPoint = timeSeries[timestamp];
                    totalValue += dataPoint.value; // TypeScript knows 'value' exists
                }
            }
        }
    }

    return totalValue;
}

// ============================================================================
// Example 9: Working with Environmental Data
// ============================================================================

function example9_EnvironmentalData() {
    const data: ChartData<EnvironmentalMetrics> = [{
        "OutdoorSensor": {
            "": { // No split-by, use empty string
                "2023-01-01T00:00:00Z": {
                    temperature: 22.5,
                    humidity: 65,
                    pressure: 1013.25
                },
                "2023-01-01T01:00:00Z": {
                    temperature: 23.1,
                    humidity: 63,
                    pressure: 1013.50
                }
            }
        }
    }];

    return data;
}

// ============================================================================
// Example 10: Mixed Metric Types (Use Generic ChartData)
// ============================================================================

function example10_MixedMetrics() {
    // When you have different metric types in the same dataset,
    // use the generic ChartData without type parameters
    const data: ChartData = [{
        "Temperature": {
            "Sensor1": {
                "2023-01-01T00:00:00Z": { avg: 22.5, min: 20.0, max: 25.0 }
            }
        }
    }, {
        "Pressure": {
            "Sensor1": {
                "2023-01-01T00:00:00Z": { value: 1013.25 }
            }
        }
    }];

    return data;
}

// ============================================================================
// Example 11: Type-safe Data Transformation
// ============================================================================

function example11_TransformData(
    input: ChartData<SingleValueMetrics>
): ChartData<AggregateMetrics> {
    // Transform single values into aggregate metrics
    const output: ChartData<AggregateMetrics> = [];

    for (const series of input) {
        const newSeries: Series<AggregateMetrics> = {};

        for (const seriesName in series) {
            const seriesData: SeriesData<AggregateMetrics> = {};

            for (const splitBy in series[seriesName]) {
                const timeSeries: TimeSeries<AggregateMetrics> = {};

                for (const timestamp in series[seriesName][splitBy]) {
                    const value = series[seriesName][splitBy][timestamp].value;

                    // Create aggregate from single value
                    timeSeries[timestamp] = {
                        avg: value,
                        min: value * 0.9,
                        max: value * 1.1
                    };
                }

                seriesData[splitBy] = timeSeries;
            }

            newSeries[seriesName] = seriesData;
        }

        output.push(newSeries);
    }

    return output;
}

// Export all examples
export {
    example1_GenericData,
    example2_FactoryMetrics,
    example3_TypeAlias,
    example4_AggregateMetrics,
    example5_CustomMetrics,
    example6_GenerateData,
    example7_TypeGuard,
    example8_ProcessData,
    example9_EnvironmentalData,
    example10_MixedMetrics,
    example11_TransformData
};
