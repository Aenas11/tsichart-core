import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import HeatMap from '../../packages/core/src/components/Heatmap';
import { ChartData } from '../../packages/core/src/types';
import { fireEvent, within, waitFor } from 'storybook/test';

// Heatmaps visualize a SINGLE metric across time and categories
// Each interface represents one type of metric that can be displayed
interface TemperatureMetric extends Record<string, number> {
    temperature: number;
}

interface CpuMetric extends Record<string, number> {
    cpu: number;
}

interface TrafficMetric extends Record<string, number> {
    requests: number;
}

interface IHeatMapOptions {
    theme?: 'light' | 'dark';
    legend?: 'shown' | 'hidden' | 'compact';
    tooltip?: boolean;
    xAxisHidden?: boolean;
    hideChartControlPanel?: boolean;
    is24HourTime?: boolean;
    offset?: string;
    dateLocale?: string;
    suppressResizeListener?: boolean;
    onMouseover?: (aggKey: string, splitBy: string) => void;
    onMouseout?: () => void;
}

const meta: Meta<IHeatMapOptions> = {
    title: 'Charts/HeatMap/HeatMap',
    component: 'HeatMap',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
 # HeatMap Component
 
Interactive heatmap visualization for time series data with color-coded intensity mapping. Perfect for visualizing patterns and anomalies across time and categories.

## Key Features
- **Time-based Heatmap**: Display data intensity over time using color gradients
- **Multi-series Support**: Visualize multiple data series in separate heatmap rows
- **Interactive Tooltips**: Hover over cells to see detailed time and value information
- **Temporal Focus**: Click and hover to see exact time ranges and values
- **Split-by Visualization**: Each row can represent different categories or series
- **Theming**: Support for light and dark themes
- **Responsive**: Automatically adjusts to container size
 
## Common Use Cases

- **Infrastructure Monitoring**: CPU/Memory usage across servers
- **IoT & Sensors**: Temperature, humidity across zones/devices
- **Manufacturing**: Machine efficiency, output rates across production lines
- **Web Analytics**: Traffic patterns, response times across regions/endpoints
- **Network Monitoring**: Bandwidth, latency across network nodes

## Usage Example

\`\`\` typescript
import TsiClient from 'tsichart-core';

// Create chart instance
const tsiClient = new TsiClient();
const chart = new tsiClient.HeatMap(containerElement);

// Prepare your data - ONE metric per heatmap
const data = [{
    "Server Monitoring": {
        "Server-1": {
            "2023-01-01T00:00:00Z": { cpu: 45.2 },
            "2023-01-01T01:00:00Z": { cpu: 52.8 },
            // More timestamped data points...
        },
        "Server-2": {
            "2023-01-01T00:00:00Z": { cpu: 67.5 },
            "2023-01-01T01:00:00Z": { cpu: 71.3 },
            // More timestamped data points...
        }
    }
}];

// Render the chart
chart.render(data, {
    theme: 'light',
    legend: 'shown',
    tooltip: true,
    xAxisHidden: false,
    hideChartControlPanel: false,
    is24HourTime: true,
    offset: 'Local'
}, [{
    measureTypes: ['cpu'],  // Specify which metric to visualize
    searchSpan: { from: '...', to: '...', bucketSize: '1m' }
}]);
\`\`\`          
                
                `
            }
        }
    },
    argTypes: {
        theme: {
            control: { type: 'select' },
            options: ['light', 'dark'],
            description: 'Visual theme for the heatmap',
            table: { defaultValue: { summary: 'light' } }
        },
        legend: {
            control: { type: 'select' },
            options: ['shown', 'hidden', 'compact'],
            description: 'Legend display mode',
            table: { defaultValue: { summary: 'shown' } }
        },
        tooltip: {
            control: 'boolean',
            description: 'Enable/disable interactive tooltips',
            table: { defaultValue: { summary: 'true' } }
        },
        xAxisHidden: {
            control: 'boolean',
            description: 'Hide the X-axis time labels',
            table: { defaultValue: { summary: 'false' } }
        },
        hideChartControlPanel: {
            control: 'boolean',
            description: 'Hide the chart control panel',
            table: { defaultValue: { summary: 'false' } }
        },
        is24HourTime: {
            control: 'boolean',
            description: 'Use 24-hour time format',
            table: { defaultValue: { summary: 'true' } }
        }
    }
}

export default meta;
type Story = StoryObj<IHeatMapOptions>;

// Generate realistic server CPU usage data
function generateServerCpuData(): ChartData<CpuMetric> {
    const data: ChartData<CpuMetric> = [];
    const from = new Date(Math.floor((new Date()).valueOf() / (1000 * 60 * 60)) * (1000 * 60 * 60));
    let to: Date;

    const servers = {};
    data.push({ 'Data Center Monitoring': servers });

    // Simulate 5 servers with realistic CPU patterns
    for (let serverNum = 1; serverNum <= 5; serverNum++) {
        const values = {};
        servers[`Server-${serverNum}`] = values;

        // Each server has a different baseline load
        const baselineLoad = 30 + (serverNum * 8); // 38%, 46%, 54%, 62%, 70%

        for (let minute = 0; minute < 60; minute++) {
            to = new Date(from.valueOf() + 1000 * 60 * minute);

            // Create realistic patterns:
            // - Slight increase during "business hours" (simulated)
            const hourlyVariation = Math.sin(minute / 10) * 10;
            // - Random spikes
            const spike = (Math.random() > 0.85) ? Math.random() * 20 : 0;
            // - Some noise
            const noise = (Math.random() - 0.5) * 5;

            const cpu = Math.min(95, Math.max(10,
                baselineLoad + hourlyVariation + spike + noise
            ));

            values[to.toISOString()] = {
                cpu: parseFloat(cpu.toFixed(1))
            };
        }
    }

    return data;
}

// Generate realistic temperature monitoring data across zones
function generateTemperatureData(): ChartData<TemperatureMetric> {
    const data: ChartData<TemperatureMetric> = [];
    const from = new Date(Math.floor((new Date()).valueOf() / (1000 * 60 * 60)) * (1000 * 60 * 60));
    let to: Date;

    const zones = {};
    data.push({ 'Building Temperature Monitor': zones });

    const zoneConfigs = [
        { name: 'Server Room', baseline: 18, variance: 2, cooling: true },
        { name: 'Office Area', baseline: 22, variance: 3, cooling: false },
        { name: 'Storage', baseline: 20, variance: 1.5, cooling: false },
        { name: 'Laboratory', baseline: 21, variance: 2.5, cooling: true }
    ];

    zoneConfigs.forEach(zone => {
        const values = {};
        zones[zone.name] = values;

        for (let minute = 0; minute < 60; minute++) {
            to = new Date(from.valueOf() + 1000 * 60 * minute);

            // Realistic temperature patterns
            const dailyCycle = Math.sin(minute / 20) * zone.variance;
            const coolingCycle = zone.cooling ? Math.sin(minute / 5) * 0.5 : 0;
            const noise = (Math.random() - 0.5) * 0.3;

            const temperature = zone.baseline + dailyCycle + coolingCycle + noise;

            values[to.toISOString()] = {
                temperature: parseFloat(temperature.toFixed(1))
            };
        }
    });

    return data;
}

// Generate realistic web traffic data
function generateWebTrafficData(): ChartData<TrafficMetric> {
    const data: ChartData<TrafficMetric> = [];
    const from = new Date(Math.floor((new Date()).valueOf() / (1000 * 60 * 60)) * (1000 * 60 * 60));
    let to: Date;

    const endpoints = {};
    data.push({ 'API Endpoint Traffic': endpoints });

    const endpointConfigs = [
        { name: '/api/users', baseline: 150, volatility: 0.4 },
        { name: '/api/products', baseline: 320, volatility: 0.6 },
        { name: '/api/orders', baseline: 95, volatility: 0.3 },
        { name: '/api/search', baseline: 420, volatility: 0.8 },
        { name: '/api/analytics', baseline: 60, volatility: 0.2 }
    ];

    endpointConfigs.forEach(endpoint => {
        const values = {};
        endpoints[endpoint.name] = values;

        for (let minute = 0; minute < 60; minute++) {
            to = new Date(from.valueOf() + 1000 * 60 * minute);

            // Traffic patterns: peaks and valleys
            const trafficWave = Math.sin(minute / 15) * endpoint.baseline * 0.3;
            const burst = (Math.random() > 0.9) ? Math.random() * endpoint.baseline * 0.5 : 0;
            const noise = (Math.random() - 0.5) * endpoint.baseline * endpoint.volatility;

            const requests = Math.max(0,
                endpoint.baseline + trafficWave + burst + noise
            );

            values[to.toISOString()] = {
                requests: parseFloat(requests.toFixed(0))
            };
        }
    });

    return data;
}

// Generate sparse data with clear patterns
function generateSparsePatternData(): ChartData<CpuMetric> {
    const data: ChartData<CpuMetric> = [];
    const from = new Date(Math.floor((new Date()).valueOf() / (1000 * 60 * 60)) * (1000 * 60 * 60));
    let to: Date;

    const services = {};
    data.push({ 'Batch Job Monitor': services });

    const serviceNames = ['Data-Processing', 'Report-Generation', 'Backup-Service'];

    serviceNames.forEach((serviceName, idx) => {
        const values = {};
        services[serviceName] = values;

        for (let minute = 0; minute < 60; minute++) {
            // Create sparseness - services only active at certain times
            const isActive = minute >= (idx * 15) && minute < (idx * 15 + 20);

            if (isActive || Math.random() > 0.7) {
                to = new Date(from.valueOf() + 1000 * 60 * minute);
                const cpu = isActive ? 60 + Math.random() * 30 : Math.random() * 20;

                values[to.toISOString()] = {
                    cpu: parseFloat(cpu.toFixed(1))
                };
            }
        }
    });

    return data;
}

function renderHeatMap(
    container: HTMLElement,
    options: IHeatMapOptions = {},
    dataGenerator: () => ChartData<any> = generateTemperatureData,
    measureType: string = 'temperature'
) {
    container.innerHTML = '';

    try {
        console.log('Rendering HeatMap with options:', options);

        const chart = new HeatMap(container);

        const sampleData = dataGenerator();

        const from = new Date(Math.floor((new Date()).valueOf() / (1000 * 60 * 60)) * (1000 * 60 * 60));
        const to = new Date(from.valueOf() + 1000 * 60 * 60);

        const aggregateExpressionOptions = sampleData.map(dataObj => {
            const aggregateKey = Object.keys(dataObj)[0];

            return {
                measureTypes: [measureType],
                searchSpan: {
                    from: from.toISOString(),
                    to: to.toISOString(),
                    bucketSize: '1m'
                },
                aggregateKey: aggregateKey,
                splitBy: Object.keys(dataObj[aggregateKey] || {}),
                color: null,
                alias: aggregateKey
            };
        });

        const chartOptions = {
            theme: 'light',
            legend: 'shown',
            tooltip: true,
            xAxisHidden: false,
            hideChartControlPanel: false,
            is24HourTime: true,
            offset: 'Local',
            dateLocale: 'en-US',
            suppressResizeListener: false,
            onMouseover: (aggKey: string, splitBy: string) => {
                console.log('Heatmap hover:', aggKey, splitBy);
            },
            onMouseout: () => {
                console.log('Heatmap mouse out');
            },
            ...options
        };


        if (chartOptions.offset === undefined) {
            chartOptions.offset = 'Local';
        }
        if (chartOptions.dateLocale === undefined) {
            chartOptions.dateLocale = 'en-US';
        }
        if (chartOptions.theme === undefined) {
            chartOptions.theme = 'light';
        }

        chart.render(sampleData, chartOptions, aggregateExpressionOptions);

        return chart;
    } catch (error) {
        console.error('HeatMap rendering error:', error);
        container.innerHTML = `<div style="color: red; padding: 20px; font-family: monospace;">
            <h3>Error rendering HeatMap</h3>
            <p><strong>Error:</strong> ${error.message}</p>
            <p><small>Check browser console for more details</small></p>
        </div>`;
    }
}

function createHeatMapStory(
    containerStyle: string,
    dataGenerator: () => ChartData<any> = generateTemperatureData,
    measureType: string = 'temperature'
) {
    return (args: IHeatMapOptions) => {
        const chartId = 'heatmap-' + Math.random().toString(36).substring(7);

        setTimeout(() => {
            const container = document.getElementById(chartId);
            if (container) {
                renderHeatMap(container, args, dataGenerator, measureType);
            }
        }, 100);

        return html`
            <div style="${containerStyle}">
                <div id="${chartId}" style="height: 100%; width: 100%;"></div>
            </div>
        `;
    };
}

export const Default: Story = {
    name: 'Temperature Monitoring',
    args: {
        theme: 'light',
        legend: 'shown',
        tooltip: true,
        xAxisHidden: false,
    },
    render: createHeatMapStory(
        'height: 400px; width: 100%; border: 1px solid #ddd; border-radius: 4px;',
        generateTemperatureData,
        'temperature'
    )
};

export const ServerMonitoring: Story = {
    name: 'Server CPU Usage',
    args: {
        theme: 'dark',
        legend: 'shown',
        tooltip: true,
        xAxisHidden: false,
    },
    render: createHeatMapStory(
        'height: 450px; width: 100%; background: #1a1a1a; border: 1px solid #444; border-radius: 4px;',
        generateServerCpuData,
        'cpu'
    )
};

export const WebTraffic: Story = {
    name: 'API Endpoint Traffic',
    args: {
        theme: 'light',
        legend: 'shown',
        tooltip: true,
        xAxisHidden: false,
    },
    render: createHeatMapStory(
        'height: 450px; width: 100%; border: 1px solid #ddd; border-radius: 4px;',
        generateWebTrafficData,
        'requests'
    )
};

export const SparseData: Story = {
    name: 'Batch Job Activity (Sparse Data)',
    args: {
        theme: 'light',
        legend: 'shown',
        tooltip: true,
        xAxisHidden: false,
    },
    render: createHeatMapStory(
        'height: 350px; width: 100%; border: 1px solid #ddd; border-radius: 4px;',
        generateSparsePatternData,
        'cpu'
    )
};

export const DarkTheme: Story = {
    name: 'Dark Theme',
    args: {
        theme: 'dark',
        legend: 'shown',
        tooltip: true,
        xAxisHidden: false,
    },
    render: createHeatMapStory(
        'height: 400px; width: 100%; background: #1a1a1a; border: 1px solid #444; border-radius: 4px;',
        generateTemperatureData,
        'temperature'
    )
};

export const CompactLegend: Story = {
    name: 'Compact Legend',
    args: {
        theme: 'light',
        legend: 'compact',
        tooltip: true,
        xAxisHidden: false,
    },
    render: createHeatMapStory(
        'height: 400px; width: 100%; border: 1px solid #ddd; border-radius: 4px;',
        generateServerCpuData,
        'cpu'
    )
};

export const HiddenXAxis: Story = {
    name: 'Hidden X-Axis',
    args: {
        theme: 'light',
        legend: 'shown',
        tooltip: true,
        xAxisHidden: true,
    },
    render: createHeatMapStory(
        'height: 400px; width: 100%; border: 1px solid #ddd; border-radius: 4px;',
        generateTemperatureData,
        'temperature'
    )
};

export const NoControlPanel: Story = {
    name: 'Hidden Control Panel',
    args: {
        theme: 'light',
        legend: 'shown',
        tooltip: true,
        hideChartControlPanel: true,
    },
    render: createHeatMapStory(
        'height: 400px; width: 100%; border: 1px solid #ddd; border-radius: 4px;',
        generateWebTrafficData,
        'requests'
    )
};

export const Interactive: Story = {
    name: 'Interaction Tests',
    args: {
        theme: 'light',
        legend: 'shown',
        tooltip: true,
        xAxisHidden: false,
    },
    render: createHeatMapStory(
        'height: 400px; width: 100%; border: 1px solid #ddd; border-radius: 4px;',
        generateServerCpuData,
        'cpu'
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(() => canvas.getByTitle('Heatmap'), { timeout: 5000 });
        const heatmapSvg = canvas.getByTitle('Heatmap');
        const heatmapCanvases = canvasElement.querySelectorAll('.tsi-heatmapCanvasWrapper');
        if (heatmapCanvases.length > 0) {
            const firstCanvas = heatmapCanvases[0];
            fireEvent.mouseEnter(firstCanvas);
            fireEvent.mouseMove(firstCanvas, { clientX: 200, clientY: 100 });
            await waitFor(() => {
                const timeLabels = heatmapSvg.querySelectorAll('.tsi-heatmapTimeLabels');
                if (timeLabels.length === 0) {
                    throw new Error("Time labels should appear on hover");
                }
            }, { timeout: 2000 });
            fireEvent.mouseLeave(firstCanvas);
            await new Promise(resolve => setTimeout(resolve, 250));
            await waitFor(() => {
                const timeLabels = heatmapSvg.querySelectorAll('.tsi-heatmapTimeLabels');
                if (timeLabels.length > 0) {
                    throw new Error("Time labels should be hidden after mouse out");
                }
            }, { timeout: 3000 });
        }

        const legendItems = canvasElement.querySelectorAll('.tsi-seriesLabel');
        if (legendItems.length > 0) {
            const firstLegendItem = legendItems[0];
            fireEvent.mouseOver(firstLegendItem);
            await waitFor(() => {
                const focusedElements = canvasElement.querySelectorAll('.inFocus');
                if (focusedElements.length === 0) {
                    throw new Error("Expected some elements to be focused when hovering legend");
                }
            }, { timeout: 2000 });
            fireEvent.mouseOut(firstLegendItem);
            await waitFor(() => {
                const focusedElements = canvasElement.querySelectorAll('.inFocus');
                if (focusedElements.length > 0) {
                    throw new Error("Expected focus to be removed after mouse out");
                }
            }, { timeout: 2000 });
        }
        if (legendItems.length > 0) {
            const legendItem = legendItems[0];
            fireEvent.click(legendItem);
            await waitFor(() => {
                if (legendItem.classList.contains('shown')) {
                    throw new Error("Series should be hidden but is still shown");
                }
            }, { timeout: 2000 });
            await new Promise((r) => setTimeout(r, 500));
            fireEvent.click(legendItem);
            await waitFor(() => {
                if (!legendItem.classList.contains('shown')) {
                    throw new Error("Series should be shown but is still hidden");
                }
            }, { timeout: 2000 });
        }
    }
};

export const TwentyFourHourFormat: Story = {
    name: '12-Hour Time Format',
    args: {
        theme: 'light',
        legend: 'shown',
        tooltip: true,
        is24HourTime: false,
    },
    render: createHeatMapStory(
        'height: 400px; width: 100%; border: 1px solid #ddd; border-radius: 4px;',
        generateTemperatureData,
        'temperature'
    )
};