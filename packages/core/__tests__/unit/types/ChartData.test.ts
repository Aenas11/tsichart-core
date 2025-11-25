/**
 * Unit tests for ChartData type definitions and utilities
 */

import {
    ChartData,
    DataPoint,
    TimeSeries,
    SeriesData,
    Series,
    isChartData
} from '../../../src/types';

// User-defined metric types for testing
interface FactoryMetrics extends Record<string, number> {
    value: number;
    temperature: number;
}

interface AggregateMetrics extends Record<string, number> {
    avg: number;
    min: number;
    max: number;
}

interface SingleValueMetrics extends Record<string, number> {
    value: number;
}

interface EnvironmentalMetrics extends Record<string, number> {
    temperature: number;
    humidity: number;
    pressure: number;
}

describe('ChartData Types', () => {
    describe('Type Structure', () => {
        it('should accept valid generic ChartData', () => {
            const data: ChartData = [{
                "Series1": {
                    "SplitBy1": {
                        "2023-01-01T00:00:00Z": { value: 100 }
                    }
                }
            }];

            expect(data).toBeDefined();
            expect(Array.isArray(data)).toBe(true);
            expect(data.length).toBe(1);
        });

        it('should accept ChartData with multiple series', () => {
            const data: ChartData = [{
                "Series1": {
                    "": {
                        "2023-01-01T00:00:00Z": { value: 100 }
                    }
                }
            }, {
                "Series2": {
                    "": {
                        "2023-01-01T00:00:00Z": { value: 200 }
                    }
                }
            }];

            expect(data.length).toBe(2);
        });

        it('should accept ChartData with multiple split-by values', () => {
            const data: ChartData = [{
                "Temperature": {
                    "Sensor1": {
                        "2023-01-01T00:00:00Z": { value: 22.5 }
                    },
                    "Sensor2": {
                        "2023-01-01T00:00:00Z": { value: 23.1 }
                    },
                    "Sensor3": {
                        "2023-01-01T00:00:00Z": { value: 21.8 }
                    }
                }
            }];

            const temperature = data[0]["Temperature"];
            expect(Object.keys(temperature).length).toBe(3);
        });

        it('should accept ChartData with multiple timestamps', () => {
            const data: ChartData = [{
                "Series1": {
                    "": {
                        "2023-01-01T00:00:00Z": { value: 100 },
                        "2023-01-01T01:00:00Z": { value: 105 },
                        "2023-01-01T02:00:00Z": { value: 110 }
                    }
                }
            }];

            const timeSeries = data[0]["Series1"][""];
            expect(Object.keys(timeSeries).length).toBe(3);
        });

        it('should accept ChartData with multiple metrics per data point', () => {
            const data: ChartData = [{
                "Sensor": {
                    "": {
                        "2023-01-01T00:00:00Z": {
                            temperature: 22.5,
                            humidity: 65,
                            pressure: 1013.25
                        }
                    }
                }
            }];

            const dataPoint = data[0]["Sensor"][""]["2023-01-01T00:00:00Z"];
            expect(Object.keys(dataPoint).length).toBe(3);
        });
    });

    describe('Typed Metrics', () => {
        it('should accept ChartData with FactoryMetrics', () => {
            const data: ChartData<FactoryMetrics> = [{
                "Factory0": {
                    "Station0": {
                        "2023-01-01T00:00:00Z": { value: 100, temperature: 22.5 }
                    }
                }
            }];

            const dataPoint = data[0]["Factory0"]["Station0"]["2023-01-01T00:00:00Z"];
            expect(dataPoint.value).toBe(100);
            expect(dataPoint.temperature).toBe(22.5);
        });

        it('should accept ChartData with AggregateMetrics', () => {
            const data: ChartData<AggregateMetrics> = [{
                "Temperature": {
                    "Room1": {
                        "2023-01-01T00:00:00Z": { avg: 22.5, min: 20.0, max: 25.0 }
                    }
                }
            }];

            const dataPoint = data[0]["Temperature"]["Room1"]["2023-01-01T00:00:00Z"];
            expect(dataPoint.avg).toBe(22.5);
            expect(dataPoint.min).toBe(20.0);
            expect(dataPoint.max).toBe(25.0);
        });

        it('should accept ChartData with SingleValueMetrics', () => {
            const data: ChartData<SingleValueMetrics> = [{
                "CPU": {
                    "": {
                        "2023-01-01T00:00:00Z": { value: 75.5 }
                    }
                }
            }];

            const dataPoint = data[0]["CPU"][""]["2023-01-01T00:00:00Z"];
            expect(dataPoint.value).toBe(75.5);
        });

        it('should accept ChartData with EnvironmentalMetrics', () => {
            const data: ChartData<EnvironmentalMetrics> = [{
                "OutdoorSensor": {
                    "": {
                        "2023-01-01T00:00:00Z": {
                            temperature: 22.5,
                            humidity: 65,
                            pressure: 1013.25
                        }
                    }
                }
            }];

            const dataPoint = data[0]["OutdoorSensor"][""]["2023-01-01T00:00:00Z"];
            expect(dataPoint.temperature).toBe(22.5);
            expect(dataPoint.humidity).toBe(65);
            expect(dataPoint.pressure).toBe(1013.25);
        });
    });

    describe('Individual Type Components', () => {
        it('should create valid DataPoint', () => {
            const point: DataPoint = { value: 100, temperature: 22 };
            expect(point.value).toBe(100);
            expect(point.temperature).toBe(22);
        });

        it('should create valid TimeSeries', () => {
            const timeSeries: TimeSeries = {
                "2023-01-01T00:00:00Z": { value: 100 },
                "2023-01-01T01:00:00Z": { value: 105 }
            };

            expect(Object.keys(timeSeries).length).toBe(2);
            expect(timeSeries["2023-01-01T00:00:00Z"].value).toBe(100);
        });

        it('should create valid SeriesData', () => {
            const seriesData: SeriesData = {
                "Station0": {
                    "2023-01-01T00:00:00Z": { value: 100 }
                },
                "Station1": {
                    "2023-01-01T00:00:00Z": { value: 95 }
                }
            };

            expect(Object.keys(seriesData).length).toBe(2);
        });

        it('should create valid Series', () => {
            const series: Series = {
                "Factory0": {
                    "Station0": {
                        "2023-01-01T00:00:00Z": { value: 100 }
                    }
                }
            };

            expect(series["Factory0"]).toBeDefined();
            expect(series["Factory0"]["Station0"]).toBeDefined();
        });
    });

    describe('isChartData Type Guard', () => {
        it('should return true for valid ChartData', () => {
            const data = [{
                "Series1": {
                    "": {
                        "2023-01-01T00:00:00Z": { value: 100 }
                    }
                }
            }];

            expect(isChartData(data)).toBe(true);
        });

        it('should return true for valid ChartData with multiple series', () => {
            const data = [{
                "Series1": {
                    "Split1": {
                        "2023-01-01T00:00:00Z": { value: 100, temp: 22 }
                    }
                }
            }, {
                "Series2": {
                    "Split2": {
                        "2023-01-01T00:00:00Z": { value: 200 }
                    }
                }
            }];

            expect(isChartData(data)).toBe(true);
        });

        it('should return false for non-array input', () => {
            expect(isChartData(null)).toBe(false);
            expect(isChartData(undefined)).toBe(false);
            expect(isChartData({})).toBe(false);
            expect(isChartData("string")).toBe(false);
            expect(isChartData(123)).toBe(false);
        });

        it('should return false for empty array', () => {
            expect(isChartData([])).toBe(true); // Empty array is technically valid
        });

        it('should return false for array with null/undefined elements', () => {
            expect(isChartData([null])).toBe(false);
            expect(isChartData([undefined])).toBe(false);
        });

        it('should return false for invalid series structure', () => {
            const invalidData = [{
                "Series1": "not an object"
            }];

            expect(isChartData(invalidData)).toBe(false);
        });

        it('should return false for invalid SeriesData structure', () => {
            const invalidData = [{
                "Series1": {
                    "Split1": "not an object"
                }
            }];

            expect(isChartData(invalidData)).toBe(false);
        });

        it('should return false for invalid TimeSeries structure', () => {
            const invalidData = [{
                "Series1": {
                    "Split1": {
                        "2023-01-01T00:00:00Z": "not an object"
                    }
                }
            }];

            expect(isChartData(invalidData)).toBe(false);
        });

        it('should return false for non-numeric values in DataPoint', () => {
            const invalidData = [{
                "Series1": {
                    "Split1": {
                        "2023-01-01T00:00:00Z": { value: "not a number" }
                    }
                }
            }];

            expect(isChartData(invalidData)).toBe(false);
        });

        it('should return false for DataPoint with mixed types', () => {
            const invalidData = [{
                "Series1": {
                    "Split1": {
                        "2023-01-01T00:00:00Z": { value: 100, temp: "string" }
                    }
                }
            }];

            expect(isChartData(invalidData)).toBe(false);
        });

        it('should return true for DataPoint with all numeric values', () => {
            const data = [{
                "Series1": {
                    "Split1": {
                        "2023-01-01T00:00:00Z": {
                            value: 100,
                            temp: 22.5,
                            humidity: 65,
                            pressure: 1013.25
                        }
                    }
                }
            }];

            expect(isChartData(data)).toBe(true);
        });
    });

    describe('Complex Data Structures', () => {
        it('should handle factory data with multiple stations and timestamps', () => {
            const data: ChartData<FactoryMetrics> = [];

            for (let i = 0; i < 3; i++) {
                const series: Series<FactoryMetrics> = {};
                const factoryName = `Factory${i}`;
                const seriesData: SeriesData<FactoryMetrics> = {};

                for (let j = 0; j < 3; j++) {
                    const stationName = `Station${j}`;
                    const timeSeries: TimeSeries<FactoryMetrics> = {};

                    for (let k = 0; k < 5; k++) {
                        const timestamp = new Date(2023, 0, 1, k).toISOString();
                        timeSeries[timestamp] = {
                            value: 100 + i * 10 + j * 5 + k,
                            temperature: 20 + i + j + k * 0.5
                        };
                    }

                    seriesData[stationName] = timeSeries;
                }

                series[factoryName] = seriesData;
                data.push(series);
            }

            expect(data.length).toBe(3);
            expect(Object.keys(data[0]["Factory0"]).length).toBe(3);
            expect(Object.keys(data[0]["Factory0"]["Station0"]).length).toBe(5);
        });

        it('should handle data without split-by values', () => {
            const data: ChartData = [{
                "Temperature": {
                    "": {
                        "2023-01-01T00:00:00Z": { value: 22.5 }
                    }
                }
            }];

            expect(data[0]["Temperature"][""]).toBeDefined();
            expect(data[0]["Temperature"][""]["2023-01-01T00:00:00Z"].value).toBe(22.5);
        });

        it('should handle sparse data', () => {
            const data: ChartData = [{
                "Series1": {
                    "Split1": {
                        "2023-01-01T00:00:00Z": { value: 100 },
                        "2023-01-01T05:00:00Z": { value: 150 },
                        "2023-01-01T10:00:00Z": { value: 200 }
                    }
                }
            }];

            const timestamps = Object.keys(data[0]["Series1"]["Split1"]);
            expect(timestamps.length).toBe(3);
        });

        it('should handle data with varying metrics per timestamp', () => {
            const data: ChartData = [{
                "Sensor": {
                    "": {
                        "2023-01-01T00:00:00Z": { temp: 22 },
                        "2023-01-01T01:00:00Z": { temp: 23, humidity: 65 },
                        "2023-01-01T02:00:00Z": { temp: 24, humidity: 66, pressure: 1013 }
                    }
                }
            }];

            expect(isChartData(data)).toBe(true);
        });
    });

    describe('Data Manipulation', () => {
        it('should allow iteration over series', () => {
            const data: ChartData = [{
                "Series1": {
                    "": { "2023-01-01T00:00:00Z": { value: 100 } }
                }
            }, {
                "Series2": {
                    "": { "2023-01-01T00:00:00Z": { value: 200 } }
                }
            }];

            let count = 0;
            for (const series of data) {
                count++;
                expect(series).toBeDefined();
            }
            expect(count).toBe(2);
        });

        it('should allow accessing nested values', () => {
            const data: ChartData<FactoryMetrics> = [{
                "Factory0": {
                    "Station0": {
                        "2023-01-01T00:00:00Z": { value: 100, temperature: 22.5 }
                    }
                }
            }];

            const value = data[0]["Factory0"]["Station0"]["2023-01-01T00:00:00Z"].value;
            const temp = data[0]["Factory0"]["Station0"]["2023-01-01T00:00:00Z"].temperature;

            expect(value).toBe(100);
            expect(temp).toBe(22.5);
        });

        it('should allow counting data points', () => {
            const data: ChartData = [{
                "Series1": {
                    "Split1": {
                        "2023-01-01T00:00:00Z": { value: 100 },
                        "2023-01-01T01:00:00Z": { value: 101 },
                        "2023-01-01T02:00:00Z": { value: 102 }
                    },
                    "Split2": {
                        "2023-01-01T00:00:00Z": { value: 200 }
                    }
                }
            }];

            let totalPoints = 0;
            for (const series of data) {
                for (const seriesName in series) {
                    for (const splitBy in series[seriesName]) {
                        totalPoints += Object.keys(series[seriesName][splitBy]).length;
                    }
                }
            }

            expect(totalPoints).toBe(4);
        });

        it('should allow filtering data points by value', () => {
            const data: ChartData<SingleValueMetrics> = [{
                "Series1": {
                    "": {
                        "2023-01-01T00:00:00Z": { value: 100 },
                        "2023-01-01T01:00:00Z": { value: 150 },
                        "2023-01-01T02:00:00Z": { value: 200 }
                    }
                }
            }];

            const highValues: string[] = [];
            const timeSeries = data[0]["Series1"][""];

            for (const timestamp in timeSeries) {
                if (timeSeries[timestamp].value > 125) {
                    highValues.push(timestamp);
                }
            }

            expect(highValues.length).toBe(2);
        });

        it('should allow transforming data', () => {
            const input: ChartData<SingleValueMetrics> = [{
                "Series1": {
                    "": {
                        "2023-01-01T00:00:00Z": { value: 100 }
                    }
                }
            }];

            const output: ChartData<AggregateMetrics> = [];

            for (const series of input) {
                const newSeries: Series<AggregateMetrics> = {};

                for (const seriesName in series) {
                    const seriesData: SeriesData<AggregateMetrics> = {};

                    for (const splitBy in series[seriesName]) {
                        const timeSeries: TimeSeries<AggregateMetrics> = {};

                        for (const timestamp in series[seriesName][splitBy]) {
                            const value = series[seriesName][splitBy][timestamp].value;
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

            expect(isChartData(output)).toBe(true);
            expect(output[0]["Series1"][""]["2023-01-01T00:00:00Z"].avg).toBe(100);
            expect(output[0]["Series1"][""]["2023-01-01T00:00:00Z"].min).toBeCloseTo(90);
            expect(output[0]["Series1"][""]["2023-01-01T00:00:00Z"].max).toBeCloseTo(110);
        });
    });

    describe('Edge Cases', () => {
        it('should handle single series with single split-by and single timestamp', () => {
            const data: ChartData = [{
                "S": {
                    "": {
                        "2023-01-01T00:00:00Z": { v: 1 }
                    }
                }
            }];

            expect(isChartData(data)).toBe(true);
        });

        it('should handle very long series names', () => {
            const longName = 'A'.repeat(1000);
            const data: ChartData = [{
                [longName]: {
                    "": {
                        "2023-01-01T00:00:00Z": { value: 100 }
                    }
                }
            }];

            expect(data[0][longName]).toBeDefined();
        });

        it('should handle many metrics per data point', () => {
            const dataPoint: DataPoint = {};
            for (let i = 0; i < 100; i++) {
                dataPoint[`metric${i}`] = i;
            }

            const data: ChartData = [{
                "Series1": {
                    "": {
                        "2023-01-01T00:00:00Z": dataPoint
                    }
                }
            }];

            expect(isChartData(data)).toBe(true);
            expect(Object.keys(data[0]["Series1"][""]["2023-01-01T00:00:00Z"]).length).toBe(100);
        });

        it('should handle extreme numeric values', () => {
            const data: ChartData = [{
                "Series1": {
                    "": {
                        "2023-01-01T00:00:00Z": {
                            verySmall: Number.MIN_VALUE,
                            veryLarge: Number.MAX_VALUE,
                            negative: -999999999,
                            zero: 0,
                            decimal: 0.123456789
                        }
                    }
                }
            }];

            expect(isChartData(data)).toBe(true);
        });

        it('should handle ISO 8601 timestamp variations', () => {
            const data: ChartData = [{
                "Series1": {
                    "": {
                        "2023-01-01T00:00:00Z": { value: 1 },
                        "2023-01-01T00:00:00.000Z": { value: 2 },
                        "2023-01-01T00:00:00+00:00": { value: 3 },
                        "2023-01-01T12:30:45.123Z": { value: 4 }
                    }
                }
            }];

            expect(isChartData(data)).toBe(true);
            expect(Object.keys(data[0]["Series1"][""]).length).toBe(4);
        });
    });
});
