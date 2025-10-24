// stories/LineChart.stories.ts
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import LineChart from '../packages/core/src/components/LineChart/LineChart';

import { ILineChartOptions } from '../packages/core/src/components/LineChart/ILineChartOptions';

const meta: Meta<ILineChartOptions> = {
    title: 'Charts/LineChart',
    component: 'LineChart',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
# LineChart Component

Interactive line chart for time series data visualization with the following features:

## Key Features
- **Multi-series Support**: Display multiple data series with different colors and styles
- **Interactive Tooltips**: Hover over data points to see detailed information
- **Brushing**: Select time ranges by dragging to zoom into specific periods
- **Markers**: Add custom markers to highlight specific time points
- **Sticky Series**: Click to focus on specific data series
- **Theming**: Support for light and dark themes
- **Responsive**: Automatically adjusts to container size

## Usage Example

\`\`\` typescript
import TsiClient from 'tsichart-core';

// Create chart instance
const tsiClient = new TsiClient();
const chart = new tsiClient.LineChart(containerElement);

// Prepare your data in the expected format
const data = [{
    "SeriesName": {
        "SplitByValue": {
            "2023-01-01T00:00:00Z": { value: 100, temperature: 22 },
            "2023-01-01T01:00:00Z": { value: 110, temperature: 21 },
            // More timestamped data points...
        }
    }
}];

// Render the chart
chart.render(data, {
    theme: 'light',
    legend: 'shown',
    grid: true,
    tooltip: true,
    yAxisState: 'stacked',
    interpolationFunction: 'curveMonotoneX',
    includeEnvelope: false,
    brushContextMenuActions: [],
    snapBrush: false,
    minBrushWidth: 0,
    is24HourTime: true,
    offset: 'Local',
    zeroYAxis: false
}, {});
\`\`\`
                `
            }
        }
    },
    argTypes: {
        theme: {
            control: { type: 'select' },
            options: ['light', 'dark'],
            description: 'Visual theme for the chart'
        },
        yAxisState: {
            control: { type: 'select' },
            options: ['stacked', 'shared', 'overlap'],
            description: 'How multiple series should be displayed on the Y-axis'
        },
        legend: {
            control: { type: 'select' },
            options: ['shown', 'hidden', 'compact'],
            description: 'Legend display mode'
        },

        tooltip: {
            control: 'boolean',
            description: 'Enable/disable interactive tooltips'
        }

    }
};

export default meta;
type Story = StoryObj<ILineChartOptions>;

// Generate sample time series data for demonstration
function generateSampleData() {
    const data: any[] = [];
    const from = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

    for (let i = 0; i < 3; i++) {
        const lines: any = {};
        const factoryData: any = {};
        factoryData[`Factory${i}`] = lines;
        data.push(factoryData);

        for (let j = 0; j < 3; j++) {
            const values: any = {};
            lines[`Station${j}`] = values;

            // Generate hourly data points for the last 24 hours
            for (let k = 0; k < 24; k++) {
                const timestamp = new Date(from.getTime() + k * 60 * 60 * 1000);
                const baseValue = 50 + i * 20 + j * 10;
                const value = baseValue + Math.sin(k / 4) * 15 + Math.random() * 10;

                values[timestamp.toISOString()] = {
                    value: parseFloat(value.toFixed(2)),
                    temperature: 20 + Math.sin(k / 6) * 8 + Math.random() * 3
                };
            }
        }
    }

    return data;
}

// Function to render LineChart in a container
function renderLineChart(container: HTMLElement, options: any = {}) {
    container.innerHTML = '';

    try {
        console.log('Rendering LineChart with options:', options);

        // Create LineChart instance
        const chart = new LineChart(container);

        // Default options for the chart
        const chartOptions = {
            theme: options.theme || 'light',
            legend: 'shown',
            grid: true,
            tooltip: true,
            yAxisState: 'stacked',
            interpolationFunction: 'curveMonotoneX',
            includeEnvelope: false,
            brushContextMenuActions: [],
            snapBrush: false,
            minBrushWidth: 0,
            is24HourTime: true,
            offset: 'Local',
            zeroYAxis: false,
            ...options
        };

        // Generate and render data
        const sampleData = generateSampleData();
        chart.render(sampleData, chartOptions, {});

        return chart;
    } catch (error) {
        console.error('LineChart rendering error:', error);
        container.innerHTML = `<div style="color: red; padding: 20px; font-family: monospace;">
            <h3>Error rendering LineChart</h3>
            <p><strong>Error:</strong> ${error.message}</p>
            <p><small>Check browser console for more details</small></p>
        </div>`;
    }
}

// Helper function to create a story with chart rendering
function createLineChartStory(containerStyle: string) {
    return (args: any) => {
        const chartId = 'chart-' + Math.random().toString(36).substring(7);

        setTimeout(() => {
            const container = document.getElementById(chartId);
            if (container) {
                renderLineChart(container, args);
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
    args: {
        theme: 'light',
        yAxisState: 'stacked',
        legend: 'shown',

        tooltip: true
    },
    render: createLineChartStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px;')
};

export const DarkTheme: Story = {
    name: 'Dark Theme',
    args: {
        theme: 'dark',
        yAxisState: 'stacked',
        legend: 'shown',

        tooltip: true
    },
    render: createLineChartStory('height: 500px; width: 100%; background: #1a1a1a; border: 1px solid #444; border-radius: 4px;')
};