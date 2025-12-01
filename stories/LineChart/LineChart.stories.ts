// stories/LineChart.stories.ts
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import LineChart from '../../packages/core/src/components/LineChart';
import { ChartData } from '../../packages/core/src/types';
import { ILineChartOptions } from '../../packages/core/src/components/LineChart/ILineChartOptions';

import { fireEvent, screen, within, waitFor, waitForElementToBeRemoved } from 'storybook/test';



// Define custom metrics for this example
interface FactoryMetrics extends Record<string, number> {
    value: number;
    temperature: number;
}

const meta: Meta<ILineChartOptions> = {
    title: 'Charts/LineChart/LineChart',
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
- **Adaptive Heuristics**: Automatically optimizes settings based on data characteristics

---

## Default Values

The LineChart comes with sensible defaults optimized for the best out-of-the-box experience:

| Option | Default | Description |
|--------|---------|-------------|
| \`theme\` | \`'light'\` | Visual theme (light is more universally accessible) |
| \`legend\` | \`'shown'\` | Legend visibility for multi-series identification |
| \`grid\` | \`true\` | Gridlines for better quantitative reading |
| \`tooltip\` | \`true\` | Interactive tooltips for data exploration |
| \`yAxisState\` | \`'shared'\` | Shared axis preserves scale relationships |
| \`includeDots\` | \`true\` | Data point markers for visibility |
| \`brushHandlesVisible\` | \`true\` | Visible brush handles for better affordance |
| \`minBrushWidth\` | \`1\` | Prevents accidental zero-span selections |
| \`interpolationFunction\` | \`curveMonotoneX\` | Smooth, professional-looking curves |
| \`arcWidthRatio\` | \`0.55\` | Proper donut chart appearance |
| \`is24HourTime\` | *locale-based* | Automatically derived from \`dateLocale\` |

---

## Adaptive Heuristics

The LineChart **automatically analyzes your data** and adjusts options for optimal presentation. This happens transparently when you call \`render()\`.

### Legend Adaptation
| Condition | Behavior |
|-----------|----------|
| Single series | Legend hidden (redundant) |
| 2-10 series | Legend shown |
| 10+ series | Legend compact (saves space) |

### Data Point Dots
| Condition | Behavior |
|-----------|----------|
| ≤500 total points | Dots enabled |
| >500 total points | Dots disabled (performance optimization) |

### Brush Snapping
| Condition | Behavior |
|-----------|----------|
| Uniform time intervals | \`snapBrush: true\` enabled |
| Irregular intervals | \`snapBrush\` remains off |

### Series Markers
| Condition | Behavior |
|-----------|----------|
| Legend hidden + 2-10 series | Series markers enabled |
| Otherwise | Default behavior |

### Interpolation
| Chart Type | Interpolation |
|------------|---------------|
| Events/categorical | \`CurveStepAfter\` (step function) |
| Continuous data | \`CurveMonotoneX\` (smooth curve) |

### Envelope Display
| Condition | Behavior |
|-----------|----------|
| Area chart + min/max data | Envelope auto-enabled |
| Otherwise | Envelope remains off |

---

## Time Format Locale

The \`is24HourTime\` option is **automatically derived** from your \`dateLocale\` setting:

- **12-hour format**: \`en-US\`, \`en-AU\`, \`en-CA\`, \`en-NZ\`, \`en-PH\`
- **24-hour format**: All other locales

You can always override this by setting \`is24HourTime\` explicitly.

---

## Overriding Adaptive Behavior

Adaptive heuristics only modify options that **haven't been explicitly set**. To override:

\`\`\`typescript
chart.render(data, {
    legend: 'hidden',      // Explicit = no legend adaptation
    includeDots: true,     // Explicit = dots always shown
    snapBrush: false       // Explicit = snapping always off
}, {});
\`\`\`

---

## Usage Example

### Minimal Configuration (Recommended)
Let adaptive heuristics optimize your chart:

\`\`\`typescript
import TsiClient from 'tsichart-core';

const tsiClient = new TsiClient();
const chart = new tsiClient.LineChart(containerElement);

// Just provide your data - heuristics handle the rest!
chart.render(data, {}, {});
\`\`\`

### Full Configuration Example
For complete control over all options:

\`\`\`typescript
import TsiClient from 'tsichart-core';

const tsiClient = new TsiClient();
const chart = new tsiClient.LineChart(containerElement);

const data = [{
    "SeriesName": {
        "SplitByValue": {
            "2023-01-01T00:00:00Z": { value: 100, temperature: 22 },
            "2023-01-01T01:00:00Z": { value: 110, temperature: 21 },
            // More timestamped data points...
        }
    }
}];

chart.render(data, {
    theme: 'light',
    legend: 'shown',
    grid: true,
    tooltip: true,
    yAxisState: 'shared',
    interpolationFunction: 'curveMonotoneX',
    includeDots: true,
    brushHandlesVisible: true,
    includeEnvelope: false,
    brushContextMenuActions: [],
    snapBrush: false,
    minBrushWidth: 1,
    is24HourTime: true,
    offset: 'Local',
    zeroYAxis: false
}, {});
\`\`\`

---

## Migration from Older Versions

If upgrading from versions before November 2025, note these **breaking default changes**:

| Option | Old Default | New Default |
|--------|-------------|-------------|
| \`theme\` | \`'dark'\` | \`'light'\` |
| \`legend\` | \`'hidden'\` | \`'shown'\` |
| \`tooltip\` | \`false\` | \`true\` |
| \`grid\` | \`false\` | \`true\` |
| \`yAxisState\` | \`'stacked'\` | \`'shared'\` |
| \`includeDots\` | \`false\` | \`true\` |

To preserve legacy behavior:

\`\`\`typescript
const legacyOptions = {
    theme: 'dark',
    legend: 'hidden',
    tooltip: false,
    grid: false,
    yAxisState: 'stacked',
    includeDots: false,
    brushHandlesVisible: false,
    minBrushWidth: 0
};
\`\`\`
                `
            },
        }
    },
    argTypes: {
        theme: {
            control: { type: 'select' },
            options: ['light', 'dark'],
            description: 'Visual theme for the chart. Light theme is more universally accessible.',
            table: { defaultValue: { summary: 'light' } }
        },
        yAxisState: {
            control: { type: 'select' },
            options: ['stacked', 'shared', 'overlap'],
            description: 'How multiple series should be displayed on the Y-axis. Shared axis preserves scale relationships.',
            table: { defaultValue: { summary: 'shared' } }
        },
        legend: {
            control: { type: 'select' },
            options: ['shown', 'hidden', 'compact'],
            description: 'Legend display mode. Adaptive: hidden for single series, compact for 10+ series.',
            table: { defaultValue: { summary: 'shown' } }
        },
        tooltip: {
            control: 'boolean',
            description: 'Enable/disable interactive tooltips for data exploration.',
            table: { defaultValue: { summary: 'true' } }
        },
        grid: {
            control: 'boolean',
            description: 'Show/hide gridlines for better quantitative reading.',
            table: { defaultValue: { summary: 'true' } }
        },
        includeDots: {
            control: 'boolean',
            description: 'Show data point markers. Adaptive: disabled for >500 total data points.',
            table: { defaultValue: { summary: 'true' } }
        },
        brushHandlesVisible: {
            control: 'boolean',
            description: 'Show visible brush handles for better affordance.',
            table: { defaultValue: { summary: 'true' } }
        },
        snapBrush: {
            control: 'boolean',
            description: 'Snap brush selection to data points. Adaptive: enabled for uniform time intervals.',
            table: { defaultValue: { summary: 'false' } }
        },
        minBrushWidth: {
            control: { type: 'number' },
            description: 'Minimum brush selection width in pixels. Prevents zero-span selections.',
            table: { defaultValue: { summary: '1' } }
        },
        includeEnvelope: {
            control: 'boolean',
            description: 'Show envelope (min/max confidence bands). Adaptive: enabled for area charts with envelope data.',
            table: { defaultValue: { summary: 'false' } }
        },
        is24HourTime: {
            control: 'boolean',
            description: 'Use 24-hour time format. Adaptive: derived from dateLocale setting.',
            table: { defaultValue: { summary: 'locale-based' } }
        },
        zeroYAxis: {
            control: 'boolean',
            description: 'Force Y-axis to start at zero.',
            table: { defaultValue: { summary: 'false' } }
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

        // Default options for the chart (matching new adaptive defaults)
        // Note: Many of these are now the library defaults, shown here for clarity
        const chartOptions = {
            theme: options.theme || 'light',      // New default: 'light' (was 'dark')
            legend: 'shown',                       // New default: 'shown' (was 'hidden')
            grid: true,                            // New default: true (was false)
            tooltip: true,                         // New default: true (was false)
            yAxisState: 'stacked',                  // New default: 'shared' (was 'stacked')
            interpolationFunction: 'curveMonotoneX', // New default: curveMonotoneX (was none)
            includeDots: true,                     // New default: true (was false)
            brushHandlesVisible: true,             // New default: true (was false)
            includeEnvelope: false,
            brushContextMenuActions: [],
            snapBrush: false,                      // Adaptive: enabled for uniform intervals
            minBrushWidth: 1,                      // New default: 1 (was 0)
            is24HourTime: true,                    // Adaptive: derived from dateLocale
            offset: 'Local',
            zeroYAxis: false,
            ...options
        };

        // Generate and render data
        // Note: Adaptive heuristics will analyze this data and may adjust
        // options like legend, includeDots, and snapBrush automatically
        const sampleData = generateSampleData();
        chart.render(sampleData, chartOptions, {});

        return chart;
    } catch (error) {
        console.error('LineChart rendering error:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        container.innerHTML = `<div style="color: red; padding: 20px; font-family: monospace;">
            <h3>Error rendering LineChart</h3>
            <p><strong>Error:</strong> ${errorMessage}</p>
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
    name: 'Light Theme (Default)',
    args: {
        theme: 'light',
        yAxisState: 'shared',
        legend: 'shown',
        tooltip: true,
        grid: true,
        includeDots: true,
        brushHandlesVisible: true,
    },
    render: createLineChartStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px;')
};

export const DarkTheme: Story = {
    name: 'Dark Theme',
    args: {
        theme: 'dark',
        yAxisState: 'shared',
        legend: 'shown',
        tooltip: true,
        grid: true,
        includeDots: true,
        brushHandlesVisible: true,
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

        // wait for 1 second
        await new Promise((r) => setTimeout(r, 1000));

        // Click again to show the series
        fireEvent.click(seriesToClick);

        // Verify the series is shown again
        await waitFor(() => {
            const legendItem = chartSvg.querySelector(`.tsi-seriesLabel[title="Factory1"]`);
            if (legendItem && !legendItem.classList.contains('shown')) {
                throw new Error("Series Factory1 should be shown but is still hidden");
            }
        });

        // 3. Test Brushing
        // const brushOverlay = chartSvg.querySelector('.brushElem');

        // if (brushOverlay) {
        //     // Simulate a brush drag from x=200 to x=400
        //     await fireEvent.mouseDown(brushOverlay, { clientX: 200, clientY: 150 });
        //     await fireEvent.mouseMove(brushOverlay, { clientX: 400, clientY: 150, buttons: 1 });
        //     const tst = await fireEvent.mouseUp(brushOverlay);
        //     console.log('Brush events simulated:', tst);

        //     // Check if the brush selection element is visible
        //     await waitFor(() => {
        //         const brushSelection = brushOverlay.querySelector('.selection');
        //         if (!brushSelection || brushSelection.getAttribute('width') === '0') {
        //             throw new Error("Brush selection not created");
        //         }
        //     });

        //     // 4. Test Brush Context Menu
        //     const brushSelection = brushOverlay.querySelector('.selection');
        //     if (brushSelection) {
        //         // The context menu should be triggered on the visible selection area
        //         fireEvent.contextMenu(brushSelection);

        //         // Wait for the context menu to appear, then find the item
        //         const contextMenu = await screen.findByRole('menu', { name: /Context Menu/i });
        //         const contextMenuItem = within(contextMenu).getByText('Zoom');

        //         await waitFor(() => {
        //             if (!contextMenuItem) {
        //                 throw new Error("Context menu item not found");
        //             }
        //         });

        //         // Optionally, you can trigger the context menu action
        //         fireEvent.click(contextMenuItem);
        //     }
        // }
    }
};