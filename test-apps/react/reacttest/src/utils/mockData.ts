// Mock data generator for tsichart-core components

export interface TimeSeriesDataPoint {
    [timestamp: string]: {
        avg?: number;
        min?: number;
        max?: number;
        sum?: number;
        count?: number;
        [key: string]: number | string | undefined;
    };
}

export interface ChartData {
    [seriesName: string]: {
        [splitByValue: string]: TimeSeriesDataPoint;
    };
}

/**
 * Generate time series data for line charts
 */
export function generateLineChartData(
    seriesCount: number = 2,
    pointsPerSeries: number = 50,
    includeMinMax: boolean = false
): ChartData[] {
    const data: ChartData[] = [];
    const now = new Date();

    for (let i = 0; i < seriesCount; i++) {
        const seriesName = `Series${i + 1}`;
        const seriesData: ChartData = {
            [seriesName]: {
                '': {},
            },
        };

        for (let j = 0; j < pointsPerSeries; j++) {
            const timestamp = new Date(now.getTime() - (pointsPerSeries - j) * 60000);
            const baseValue = 50 + Math.sin(j / 5) * 20 + Math.random() * 10;

            const dataPoint: Record<string, number> = {
                avg: parseFloat(baseValue.toFixed(2)),
            };

            if (includeMinMax) {
                dataPoint.min = parseFloat((baseValue - Math.random() * 5).toFixed(2));
                dataPoint.max = parseFloat((baseValue + Math.random() * 5).toFixed(2));
            }

            seriesData[seriesName][''][timestamp.toISOString()] = dataPoint;
        }

        data.push(seriesData);
    }

    return data;
}

/**
 * Generate categorical data for line charts
 */
export function generateCategoricalData(
    pointCount: number = 30
): ChartData[] {
    const data: ChartData[] = [];
    const now = new Date();
    const states = ['idle', 'running', 'maintenance', 'error'];

    const seriesData: ChartData = {
        'Machine State': {
            '': {},
        },
    };

    for (let i = 0; i < pointCount; i++) {
        const timestamp = new Date(now.getTime() - (pointCount - i) * 60000);
        const state = states[Math.floor(Math.random() * states.length)];

        seriesData['Machine State'][''][timestamp.toISOString()] = {
            val: state,
        };
    }

    data.push(seriesData);
    return data;
}

/**
 * Generate event data for line charts
 */
export function generateEventData(pointCount: number = 20): ChartData[] {
    const data: ChartData[] = [];
    const now = new Date();
    const eventTypes = ['Alert', 'Warning', 'Info', 'Critical'];

    const seriesData: ChartData = {
        'System Events': {
            '': {},
        },
    };

    for (let i = 0; i < pointCount; i++) {
        const timestamp = new Date(
            now.getTime() - (pointCount - i) * 120000 - Math.random() * 60000
        );
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

        seriesData['System Events'][''][timestamp.toISOString()] = {
            val: eventType,
            message: `Event ${i + 1}: ${eventType}`,
        };
    }

    data.push(seriesData);
    return data;
}

/**
 * Generate split-by data (multiple series with split values)
 */
export function generateSplitByData(
    splitCount: number = 3,
    pointsPerSeries: number = 40
): ChartData[] {
    const data: ChartData[] = [];
    const now = new Date();
    const locations = ['Factory A', 'Factory B', 'Factory C', 'Factory D'];

    const seriesData: ChartData = {
        Temperature: {},
    };

    for (let i = 0; i < Math.min(splitCount, locations.length); i++) {
        const location = locations[i];
        seriesData.Temperature[location] = {};

        for (let j = 0; j < pointsPerSeries; j++) {
            const timestamp = new Date(now.getTime() - (pointsPerSeries - j) * 60000);
            const baseValue = 20 + i * 5 + Math.sin(j / 4) * 10 + Math.random() * 3;

            seriesData.Temperature[location][timestamp.toISOString()] = {
                avg: parseFloat(baseValue.toFixed(2)),
            };
        }
    }

    data.push(seriesData);
    return data;
}

/**
 * Generate scatter plot data
 */
export function generateScatterPlotData(
    pointCount: number = 50
): ChartData[] {
    const data: ChartData[] = [];
    const now = new Date();

    const seriesData: ChartData = {
        'Sensor Data': {
            '': {},
        },
    };

    for (let i = 0; i < pointCount; i++) {
        const timestamp = new Date(now.getTime() - (pointCount - i) * 60000);

        seriesData['Sensor Data'][''][timestamp.toISOString()] = {
            temp: parseFloat((20 + Math.random() * 30).toFixed(2)),
            press: parseFloat((100 + Math.random() * 50).toFixed(2)),
            vol: parseFloat((Math.random() * 10).toFixed(2)),
        };
    }

    data.push(seriesData);
    return data;
}

/**
 * Generate bar/pie chart data (single timestamp with multiple values)
 */
export function generateBarPieData(categoryCount: number = 5): ChartData[] {
    const data: ChartData[] = [];
    const categories = ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'];

    for (let i = 0; i < Math.min(categoryCount, categories.length); i++) {
        const category = categories[i];
        const timestamp = new Date().toISOString();

        data.push({
            [category]: {
                '': {
                    [timestamp]: {
                        avg: parseFloat((Math.random() * 100 + 20).toFixed(2)),
                    },
                },
            },
        });
    }

    return data;
}

/**
 * Generate events table data
 */
export function generateEventsTableData(eventCount: number = 50) {
    const events = [];
    const now = new Date();
    const eventTypes = ['Temperature Alert', 'Pressure Warning', 'System Info', 'Critical Error'];
    const sources = ['Sensor 1', 'Sensor 2', 'Sensor 3', 'Controller A', 'Controller B'];

    for (let i = 0; i < eventCount; i++) {
        events.push({
            timestamp: new Date(now.getTime() - i * 120000).toISOString(),
            eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
            source: sources[Math.floor(Math.random() * sources.length)],
            value: parseFloat((Math.random() * 100).toFixed(2)),
            message: `Event description for event ${i + 1}`,
            severity: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
        });
    }

    return events;
}

/**
 * Generate availability chart data
 */
export function generateAvailabilityData(buckets: number = 100) {
    const data: Record<string, { count: number }> = {};
    const now = new Date();

    for (let i = 0; i < buckets; i++) {
        const timestamp = new Date(now.getTime() - (buckets - i) * 3600000);
        data[timestamp.toISOString()] = {
            count: Math.floor(Math.random() * 1000),
        };
    }

    return [{ '': { '': data } }];
}

/**
 * Generate heatmap data
 */
export function generateHeatmapData(
    rows: number = 10,
    cols: number = 20
): ChartData[] {
    const data: ChartData[] = [];
    const now = new Date();

    for (let i = 0; i < rows; i++) {
        const seriesName = `Row ${i + 1}`;
        const seriesData: ChartData = {
            [seriesName]: {
                '': {},
            },
        };

        for (let j = 0; j < cols; j++) {
            const timestamp = new Date(now.getTime() - (cols - j) * 60000);
            const value = Math.random() * 100;

            seriesData[seriesName][''][timestamp.toISOString()] = {
                avg: parseFloat(value.toFixed(2)),
            };
        }

        data.push(seriesData);
    }

    return data;
}
