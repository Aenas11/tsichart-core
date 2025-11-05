import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import HeatMap from '../../packages/core/src/components/Heatmap';
import { ChartData } from '../../packages/core/src/types';
import { fireEvent, screen, within, waitFor } from 'storybook/test';

interface SensorMetrics extends Record<string, number> {
    temperature: number;
    humidity: number;
    pressure: number;
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
 
Interactive heatmap visualization for time series data with color-coded intensity mapping:

## Key Features
- **Time-based Heatmap**: Display data intensity over time using color gradients
- **Multi-series Support**: Visualize multiple data series in separate heatmap rows
- **Interactive Tooltips**: Hover over cells to see detailed time and value information
- **Temporal Focus**: Click and hover to see exact time ranges and values
- **Split-by Visualization**: Each row can represent different categories or series
- **Theming**: Support for light and dark themes
- **Responsive**: Automatically adjusts to container size
 
## Usage Example

\`\`\` typescript
import TsiClient from 'tsichart-core';

// Create chart instance
const tsiClient = new TsiClient();
const chart = new tsiClient.HeatMap(containerElement);

// Prepare your data in the expected format
const data = [{
    "SensorData": {
        "Zone1": {
            "2023-01-01T00:00:00Z": { temperature: 22, humidity: 45, pressure: 1013 },
            "2023-01-01T01:00:00Z": { temperature: 23, humidity: 47, pressure: 1012 },
            // More timestamped data points...
        },
        "Zone2": {
            "2023-01-01T00:00:00Z": { temperature: 20, humidity: 50, pressure: 1015 },
            "2023-01-01T01:00:00Z": { temperature: 21, humidity: 52, pressure: 1014 },
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
    offset: 'Local',
    onMouseover: (aggKey, splitBy) => console.log('Hovered:', aggKey, splitBy),
    onMouseout: () => console.log('Mouse out')
}, []);
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

function generateSampleHeatmapData(): ChartData<SensorMetrics> {
    const data = [];
    const from = new Date(Math.floor((new Date()).valueOf() / (1000 * 60 * 60)) * (1000 * 60 * 60));
    let to: Date;

    for (let i = 0; i < 2; i++) {
        const lines = {};
        data.push({ [`Factory${i}`]: lines });
        for (let j = 0; j < 3; j++) {
            const values = {};
            lines[`Station${j}`] = values;
            for (let k = 0; k < 60; k++) {
                if (!(k % 2 && k % 3)) {  // Create some sparseness in the data
                    to = new Date(from.valueOf() + 1000 * 60 * k);
                    const temp = 20 + Math.random() * 15; // 20-35°C
                    const humidity = 40 + Math.random() * 30; // 40-70%
                    const pressure = 1000 + Math.random() * 50; // 1000-1050 hPa

                    values[to.toISOString()] = {
                        temperature: parseFloat(temp.toFixed(1)),
                        humidity: parseFloat(humidity.toFixed(1)),
                        pressure: parseFloat(pressure.toFixed(1))
                    };
                }
            }
        }
    }

    return data;
}

function generateSimpleHeatmapData(): ChartData<SensorMetrics> {
    const data = [];
    const from = new Date(Math.floor((new Date()).valueOf() / (1000 * 60 * 60)) * (1000 * 60 * 60));
    let to: Date;

    const lines = {};
    data.push({ ['SensorData']: lines });

    const values = {};
    lines['Zone1'] = values;

    for (let k = 0; k < 60; k++) {
        if (!(k % 2 && k % 3)) {  // Create some sparseness in the data
            to = new Date(from.valueOf() + 1000 * 60 * k);
            const temp = 22 + Math.random() * 8; // 22-30°C
            const humidity = 45 + Math.random() * 20; // 45-65%
            const pressure = 1010 + Math.random() * 20; // 1010-1030 hPa

            values[to.toISOString()] = {
                temperature: parseFloat(temp.toFixed(1)),
                humidity: parseFloat(humidity.toFixed(1)),
                pressure: parseFloat(pressure.toFixed(1))
            };
        }
    }

    return data;
}

function renderHeatMap(container: HTMLElement, options: IHeatMapOptions = {}, useComplexData: boolean = false) {
    container.innerHTML = '';

    try {
        console.log('Rendering HeatMap with options:', options);

        const chart = new HeatMap(container);

        const sampleData = useComplexData ? generateSampleHeatmapData() : generateSimpleHeatmapData();

        const from = new Date(Math.floor((new Date()).valueOf() / (1000 * 60 * 60)) * (1000 * 60 * 60));
        const to = new Date(from.valueOf() + 1000 * 60 * 60);

        const aggregateExpressionOptions = sampleData.map(dataObj => {
            const aggregateKey = Object.keys(dataObj)[0];

            return {
                measureTypes: ['temperature'],
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

function createHeatMapStory(containerStyle: string, useComplexData: boolean = false) {
    return (args: IHeatMapOptions) => {
        const chartId = 'heatmap-' + Math.random().toString(36).substring(7);

        setTimeout(() => {
            const container = document.getElementById(chartId);
            if (container) {
                renderHeatMap(container, args, useComplexData);
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
    name: 'Light Theme (Default)',
    args: {
        theme: 'light',
        legend: 'shown',
        tooltip: true,
        xAxisHidden: false,
    },
    render: createHeatMapStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px;')
};

export const DarkTheme: Story = {
    name: 'Dark Theme',
    args: {
        theme: 'dark',
        legend: 'shown',
        tooltip: true,
        xAxisHidden: false,
    },
    render: createHeatMapStory('height: 500px; width: 100%; background: #1a1a1a; border: 1px solid #444; border-radius: 4px;')
};

export const CompactLegend: Story = {
    name: 'Compact Legend',
    args: {
        theme: 'light',
        legend: 'compact',
        tooltip: true,
        xAxisHidden: false,
    },
    render: createHeatMapStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px;')
};

export const HiddenXAxis: Story = {
    name: 'Hidden X-Axis',
    args: {
        theme: 'light',
        legend: 'shown',
        tooltip: true,
        xAxisHidden: true,
    },
    render: createHeatMapStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px;')
};

export const MultiSensor: Story = {
    name: 'Multiple Sensor Types',
    args: {
        theme: 'light',
        legend: 'shown',
        tooltip: true,
        xAxisHidden: false,
    },
    render: createHeatMapStory('height: 600px; width: 100%; border: 1px solid #ddd; border-radius: 4px;', true)
};

export const NoControlPanel: Story = {
    name: 'Hidden Control Panel',
    args: {
        theme: 'light',
        legend: 'shown',
        tooltip: true,
        hideChartControlPanel: true,
    },
    render: createHeatMapStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px;')
};

export const Interactive: Story = {
    name: 'Interaction Tests',
    args: {
        theme: 'light',
        legend: 'shown',
        tooltip: true,
        xAxisHidden: false,
    },
    render: createHeatMapStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px;'),
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
            });
            fireEvent.mouseLeave(firstCanvas);
            await waitFor(() => {
                const timeLabels = heatmapSvg.querySelectorAll('.tsi-heatmapTimeLabels');
                if (timeLabels.length > 0) {
                    throw new Error("Time labels should be hidden after mouse out");
                }
            });
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
            });
            fireEvent.mouseOut(firstLegendItem);
            await waitFor(() => {
                const focusedElements = canvasElement.querySelectorAll('.inFocus');
                if (focusedElements.length > 0) {
                    throw new Error("Expected focus to be removed after mouse out");
                }
            });
        }
        if (legendItems.length > 0) {
            const legendItem = legendItems[0];
            fireEvent.click(legendItem);
            await waitFor(() => {
                if (legendItem.classList.contains('shown')) {
                    throw new Error("Series should be hidden but is still shown");
                }
            });
            await new Promise((r) => setTimeout(r, 500));
            fireEvent.click(legendItem);
            await waitFor(() => {
                if (!legendItem.classList.contains('shown')) {
                    throw new Error("Series should be shown but is still hidden");
                }
            });
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
    render: createHeatMapStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px;')
};