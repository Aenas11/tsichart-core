import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import PieChart from '../../packages/core/src/components/PieChart';
import { ChartData } from '../../packages/core/src/types';
import { fireEvent, screen, within, waitFor } from 'storybook/test';

interface SalesMetrics extends Record<string, number> {
    revenue: number;
    quantity: number;
    profit: number;
}

interface IPieChartOptions {
    theme?: 'light' | 'dark';
    legend?: 'shown' | 'hidden' | 'compact';
    tooltip?: boolean;
    timestamp?: string;
    arcWidthRatio?: number;
    keepSplitByColor?: boolean;
    hideChartControlPanel?: boolean;
    is24HourTime?: boolean;
    offset?: string;
    dateLocale?: string;
}

const meta: Meta<IPieChartOptions> = {
    title: 'Charts/PieChart/PieChart',
    component: 'PieChart',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
# PieChart Component

Interactive pie chart for visualizing categorical data distribution with the following features:

## Key Features
- **Categorical Data Visualization**: Display data as proportional slices of a pie
- **Interactive Tooltips**: Hover over slices to see detailed information
- **Temporal Slider**: Navigate through different timestamps when multiple time points are available
- **Donut Chart Support**: Configure inner radius for donut-style charts using arcWidthRatio
- **Series Highlighting**: Click on legend items to focus on specific data series
- **Theming**: Support for light and dark themes
- **Responsive**: Automatically adjusts to container size

## Usage Example

\`\`\` typescript
import TsiClient from 'tsichart-core';

// Create chart instance
const tsiClient = new TsiClient();
const chart = new tsiClient.PieChart(containerElement);

// Prepare your data in the expected format
const data = [{
    "Sales": {
        "North": {
            "2023-01-01T00:00:00Z": { revenue: 25000, quantity: 100 },
        },
        "South": {
            "2023-01-01T00:00:00Z": { revenue: 35000, quantity: 150 },
        },
        "East": {
            "2023-01-01T00:00:00Z": { revenue: 30000, quantity: 120 },
        },
        "West": {
            "2023-01-01T00:00:00Z": { revenue: 20000, quantity: 80 },
        }
    }
}];

// Render the chart
chart.render(data, {
    theme: 'light',
    legend: 'shown',
    tooltip: true,
    timestamp: '2023-01-01T00:00:00Z',
    arcWidthRatio: 0.6, // Creates donut chart (0 = full pie, 1 = thin ring)
    keepSplitByColor: true,
    is24HourTime: true,
    offset: 'Local'
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
            description: 'Visual theme for the chart',
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
        arcWidthRatio: {
            control: { type: 'range', min: 0, max: 1, step: 0.1 },
            description: 'Controls the thickness of the pie slices (0 = full pie, 1 = thin ring)',
            table: { defaultValue: { summary: '0' } }
        },
        keepSplitByColor: {
            control: 'boolean',
            description: 'Maintain consistent colors across different timestamps',
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
};

export default meta;
type Story = StoryObj<IPieChartOptions>;

function generateSamplePieData(): ChartData<SalesMetrics> {
    const data: ChartData<SalesMetrics> = [];
    const regions = ['North', 'South', 'East', 'West'];
    const baseDate = new Date('2023-01-01T00:00:00Z');

    // Generate data for multiple quarters
    const timestamps = [
        new Date('2023-01-01T00:00:00Z'),
        new Date('2023-04-01T00:00:00Z'),
        new Date('2023-07-01T00:00:00Z'),
        new Date('2023-10-01T00:00:00Z')
    ];

    const salesData: Record<string, Record<string, SalesMetrics>> = {};

    regions.forEach((region, regionIndex) => {
        const regionData: Record<string, SalesMetrics> = {};

        timestamps.forEach((timestamp, timestampIndex) => {
            // Generate realistic sales data with seasonal variations
            const seasonalMultiplier = 1 + Math.sin(timestampIndex * Math.PI / 2) * 0.3;
            const regionMultiplier = 1 + (regionIndex * 0.2);

            const baseRevenue = 20000 + (regionIndex * 5000);
            const revenue = baseRevenue * seasonalMultiplier * (0.8 + Math.random() * 0.4);
            const quantity = Math.floor(revenue / 200);
            const profit = revenue * (0.15 + regionIndex * 0.05);

            regionData[timestamp.toISOString()] = {
                revenue: Math.round(revenue),
                quantity: quantity,
                profit: Math.round(profit)
            };
        });

        salesData[region] = regionData;
    });
    data.push({ 'Sales': salesData });
    return data;
}

function generateSimplePieData(): ChartData<SalesMetrics> {
    const data: ChartData<SalesMetrics> = [];
    const timestamp = '2023-01-01T00:00:00Z';

    const salesData = {
        'North': {
            [timestamp]: { revenue: 25000, quantity: 125, profit: 3750 }
        },
        'South': {
            [timestamp]: { revenue: 35000, quantity: 175, profit: 7000 }
        },
        'East': {
            [timestamp]: { revenue: 30000, quantity: 150, profit: 6000 }
        },
        'West': {
            [timestamp]: { revenue: 20000, quantity: 100, profit: 3000 }
        }
    };

    data.push({ 'Sales': salesData });
    return data;
}

function renderPieChart(container: HTMLElement, options: IPieChartOptions = {}, useMultipleTimestamps: boolean = false) {
    container.innerHTML = '';

    try {
        console.log('Rendering PieChart with options:', options);

        // Create PieChart instance
        const chart = new PieChart(container);

        // Default options for the chart
        const chartOptions: IPieChartOptions = {
            theme: 'light',
            legend: 'shown',
            tooltip: true,
            arcWidthRatio: 0,
            keepSplitByColor: true,
            hideChartControlPanel: false,
            is24HourTime: true,
            offset: 'Local',
            ...options
        };

        // Generate and render data
        const sampleData = useMultipleTimestamps ? generateSamplePieData() : generateSimplePieData();
        chart.render(sampleData, chartOptions, {});

        return chart;
    } catch (error) {
        console.error('PieChart rendering error:', error);
        container.innerHTML = `<div style="color: red; padding: 20px; font-family: monospace;">
            <h3>Error rendering PieChart</h3>
            <p><strong>Error:</strong> ${error.message}</p>
            <p><small>Check browser console for more details</small></p>
        </div>`;
    }
}

function createPieChartStory(containerStyle: string, useMultipleTimestamps: boolean = false) {
    return (args: IPieChartOptions) => {
        const chartId = 'chart-' + Math.random().toString(36).substring(7);

        setTimeout(() => {
            const container = document.getElementById(chartId);
            if (container) {
                renderPieChart(container, args, useMultipleTimestamps);
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
        arcWidthRatio: 0,
    },
    render: createPieChartStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px;')
};

export const DarkTheme: Story = {
    name: 'Dark Theme',
    args: {
        theme: 'dark',
        legend: 'shown',
        tooltip: true,
        arcWidthRatio: 0,
    },
    render: createPieChartStory('height: 500px; width: 100%; background: #1a1a1a; border: 1px solid #444; border-radius: 4px;')
};

export const DonutChart: Story = {
    name: 'Donut Chart',
    args: {
        theme: 'light',
        legend: 'shown',
        tooltip: true,
        arcWidthRatio: 0.6,
    },
    render: createPieChartStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px;')
};

export const CompactLegend: Story = {
    name: 'Compact Legend',
    args: {
        theme: 'light',
        legend: 'compact',
        tooltip: true,
        arcWidthRatio: 0,
    },
    render: createPieChartStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px;')
};

export const TemporalSlider: Story = {
    name: 'With Temporal Slider',
    args: {
        theme: 'light',
        legend: 'shown',
        tooltip: true,
        arcWidthRatio: 0.3,
        keepSplitByColor: true,
    },
    render: createPieChartStory('height: 600px; width: 100%; border: 1px solid #ddd; border-radius: 4px;', true)
};

export const Interactive: Story = {
    name: 'Interaction Tests',
    args: {
        theme: 'light',
        legend: 'shown',
        tooltip: true,
        arcWidthRatio: 0,
    },
    render: createPieChartStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px;'),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for the chart to be fully rendered
        await waitFor(() => canvas.getByTitle('Pie chart'), { timeout: 5000 });
        const chartSvg = canvas.getByTitle('Pie chart');

        // 1. Test Hover and Tooltip on pie slices
        const pieSlices = chartSvg.querySelectorAll('.tsi-pie-path');
        if (pieSlices.length > 0) {
            // Hover over the first slice
            fireEvent.mouseOver(pieSlices[0]);

            // Wait for tooltip to appear
            const tooltip = await screen.findByRole('tooltip', {}, { timeout: 2000 });
            await waitFor(() => {
                if (!within(tooltip).queryByText(/Sales/)) {
                    throw new Error("Tooltip content not found");
                }
            });

            // Move mouse away to hide tooltip
            fireEvent.mouseOut(pieSlices[0]);
        }

        // 2. Test Legend interaction - hide/show series
        const legendItems = chartSvg.querySelectorAll('.tsi-seriesLabel');
        if (legendItems.length > 0) {
            const firstLegendItem = legendItems[0];

            // Click to hide the series
            fireEvent.click(firstLegendItem);

            // Wait for the change to take effect
            await waitFor(() => {
                // Check if the series is now hidden (no longer has 'shown' class)
                if (firstLegendItem.classList.contains('shown')) {
                    throw new Error("Series should be hidden but is still shown");
                }
            });

            // Wait a moment
            await new Promise((r) => setTimeout(r, 500));

            // Click again to show the series
            fireEvent.click(firstLegendItem);

            // Verify the series is shown again
            await waitFor(() => {
                if (!firstLegendItem.classList.contains('shown')) {
                    throw new Error("Series should be shown but is still hidden");
                }
            });
        }
        if (legendItems.length > 0 && pieSlices.length > 0) {
            const legendItem = legendItems[0];

            // Hover over legend item
            fireEvent.mouseOver(legendItem);

            // Check that corresponding pie slice is highlighted
            // (Implementation may vary based on actual highlighting logic)
            await waitFor(() => {
                // This test assumes that hovering legend affects pie slice opacity
                const nonHighlightedSlices = Array.from(pieSlices).filter(slice =>
                    slice.getAttribute('fill-opacity') === '0.3'
                );
                if (nonHighlightedSlices.length === 0) {
                    throw new Error("Expected some slices to be dimmed when hovering legend");
                }
            });

            // Mouse out from legend
            fireEvent.mouseOut(legendItem);

            // Check that highlighting is removed
            await waitFor(() => {
                const dimmedSlices = Array.from(pieSlices).filter(slice =>
                    slice.getAttribute('fill-opacity') === '0.3'
                );
                if (dimmedSlices.length > 0) {
                    throw new Error("Expected highlighting to be removed after mouse out");
                }
            });
        }
    }
};

export const ThinRing: Story = {
    name: 'Thin Ring Chart',
    args: {
        theme: 'light',
        legend: 'shown',
        tooltip: true,
        arcWidthRatio: 0.9,
    },
    render: createPieChartStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px;')
};




