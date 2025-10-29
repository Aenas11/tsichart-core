// stories/LineChart.stories.ts
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import LineChart from '../packages/core/src/components/LineChart';
import { ChartData } from '../packages/core/src/types';
import { ILineChartOptions } from '../packages/core/src/components/LineChart/ILineChartOptions';

import { fireEvent, screen, within, waitFor, waitForElementToBeRemoved } from 'storybook/test';



// Define custom metrics for this example
interface FactoryMetrics extends Record<string, number> {
    value: number;
    temperature: number;
}

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
            },
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
            description: 'How multiple series should be displayed on the Y-axis',
            table: { defaultValue: { summary: 'stacked' } }
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
        // onClick: {
        //     action: 'clicked',
        //     description: 'Event handler for click events on the chart',
        // },
        // onInstanceClick: {
        //     action: 'instanceClicked',
        //     description: 'Event handler for click events on individual data points',
        // }        

    },
    play: async ({ args, canvasElement }) => {
        // You can add interaction tests here if needed
        // const chartContainer = within(canvasElement).getByTestId('tsi-lineChart');
        // fireEvent.click(chartContainer);
    }
};

export default meta;
type Story = StoryObj<ILineChartOptions>;

/**
 * Generate sample time series data for demonstration.
 * Returns strongly-typed ChartData with FactoryMetrics (value + temperature).
 * 
 * Data structure:
 * - 3 Factories (Factory0, Factory1, Factory2)
 * - 3 Stations per factory (Station0, Station1, Station2)
 * - 24 hourly data points per station
 * - Each data point has: value (numeric) and temperature (numeric)
 */
function generateSampleData(): ChartData<FactoryMetrics> {
    const data: ChartData<FactoryMetrics> = [];
    const from = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

    for (let i = 0; i < 3; i++) {
        const factoryName = `Factory${i}`;
        const splitByData: Record<string, Record<string, FactoryMetrics>> = {};

        for (let j = 0; j < 3; j++) {
            const stationName = `Station${j}`;
            const timeSeries: Record<string, FactoryMetrics> = {};

            // Generate hourly data points for the last 24 hours
            for (let k = 0; k < 24; k++) {
                const timestamp = new Date(from.getTime() + k * 60 * 60 * 1000);
                const baseValue = 50 + i * 20 + j * 10;
                const value = baseValue + Math.sin(k / 4) * 15 + Math.random() * 10;

                timeSeries[timestamp.toISOString()] = {
                    value: parseFloat(value.toFixed(2)),
                    temperature: 20 + Math.sin(k / 6) * 8 + Math.random() * 3
                };
            }

            splitByData[stationName] = timeSeries;
        }

        data.push({ [factoryName]: splitByData });
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
    name: 'Light Theme  (Default)',
    args: {
        theme: 'light',
        yAxisState: 'stacked',
        legend: 'shown',
        tooltip: true,
    },
    render: createLineChartStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px;')
};

export const DarkTheme: Story = {
    name: 'Dark Theme',
    args: {
        theme: 'dark',
        yAxisState: 'stacked',
        legend: 'shown',
        tooltip: true,
    },
    render: createLineChartStory('height: 500px; width: 100%; background: #1a1a1a; border: 1px solid #444; border-radius: 4px;')
};

export const Interactive: Story = {
    name: 'Interaction Tests',
    args: {
        theme: 'light',
        yAxisState: 'stacked',
        legend: 'shown',
        tooltip: true,
        brushContextMenuActions: [{
            name: 'Zoom',
            action: () => { console.log('Zoom action triggered'); }
        }],
    },
    render: createLineChartStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px;'),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for the chart to be fully rendered
        await waitFor(() => canvas.getByTitle('Line chart'), { timeout: 5000 });
        const chartSvg = canvas.getByTitle('Line chart');

        // 1. Test Hover and Tooltip
        // The voronoi overlay captures mouse events. We fire the event on it.
        const voronoiOverlay = chartSvg.querySelector('.voronoiRect, .brushElem .overlay');
        if (voronoiOverlay) {
            // Move mouse to the center of the chart to trigger a tooltip
            fireEvent.mouseMove(voronoiOverlay, { clientX: 400, clientY: 250 });

            // Wait for tooltip to appear and check its content
            const tooltip = await screen.findByRole('tooltip', {}, { timeout: 2000 });
            await waitFor(() => {
                if (!within(tooltip).queryByText(/Factory/)) {
                    throw new Error("Tooltip content not found");
                }
            });
        }

        // 2. Test Hiding Series by clicking
        const seriesToClick = await screen.findByTitle('Factory1');
        fireEvent.click(seriesToClick);

        // Check if the series becomes "hidden" in the legend
        // Visible series have shown in tsi-serieslLabel class, hidden ones don't have "shown" class
        await waitFor(() => {
            //find legend item for Factory1
            const legendItem = chartSvg.querySelector(`.tsi-seriesLabel[title="Factory1"]`);
            if (legendItem && legendItem.classList.contains('shown')) {
                throw new Error("Series Factory1 should be hidden but is still shown");
            }

        });

    }
};