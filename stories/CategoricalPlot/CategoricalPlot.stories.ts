import type { Meta, StoryObj } from '@storybook/web-components-vite';
import LineChart from '../../packages/core/src/components/LineChart';
import { ChartData } from '../../packages/core/src/types';
import { html } from 'lit';

interface FactoryMetrics extends Record<string, number> {
    value: number;
    temperature: number;
}

const meta: Meta<ChartData> = {
    title: 'Charts/CategoricalPlot/CategoricalPlot',
    component: 'CategoricalPlot',
    tags: ['autodocs'],
    parameters:{
        docs: {
            description: {
                component: `
 # CategoricalPlot Component

Interactive categorical data visualization component for displaying time-based categorical measurements with color-coded buckets. Ideal for visualizing discrete states, statuses, or categorical values over time with the following features:

## Key Features
- **Time-Based Categorical Data**: Visualize categorical values across time periods as color-coded buckets
- **Multiple Series Support**: Display multiple categorical series with different split-by values
- **Interactive Buckets**: Hover over categorical buckets to see detailed value information
- **Color Gradients**: Automatic gradient generation for buckets with multiple categorical measures
- **Click Events**: Configurable click handlers for categorical bucket interactions
- **Temporal Layout**: Buckets sized based on time duration with proper temporal alignment
- **Series Grouping**: Vertical stacking of multiple categorical series for comparison
- **Backdrop Support**: Visual backdrop for better categorical data contrast
- **Theme Compatibility**: Support for light and dark themes
- **Responsive Design**: Automatically adjusts bucket sizing based on container dimensions

## Usage Example

\`\`\`typescript
import TsiClient from 'tsichart-core';

// Create chart instance
const tsiClient = new TsiClient();
const plot = new tsiClient.ux.CategoricalPlot(svgSelection);

// Prepare categorical data in the expected format
const categoricalData = [
    {
        "Factory1": {
            "Station1": {
                "2023-01-01T00:00:00Z": {
                    "state1": 1,
                    "state2": 0,
                    "state3": 0
                }
            }
        }
    }
];

// Define value mapping for categorical states
const valueMapping = {
    state1: { color: '#F2C80F' },
    state2: { color: '#FD625E' },
    state3: { color: '#3599B8' }
};

// Render with categorical configuration
lineChart.render(categoricalData, {
    theme: 'light',
    legend: 'shown',
    grid: true,
    tooltip: true
}, [
    {}, // First aggregate expression options
    {}, // Second aggregate expression options  
    {   // Third aggregate with categorical configuration
        dataType: 'categorical',
        valueMapping: valueMapping,
        height: 100,
        onElementClick: onElementClick,
        rollupCategoricalValues: true
    }
]);
\`\`\`

`
            }
        }
    },
    argTypes: {
        theme: {
            control: { type: 'select' },
            options: ['light', 'dark'],
            description: 'Visual theme for the categorical plot'
        },
        height: {
            control: { type: 'number', min: 50, max: 300, step: 25 },
            description: 'Height of the categorical plot area',
            table: { defaultValue: { summary: '100' } }
        },
        enableClickEvents: {
            control: 'boolean',
            description: 'Enable click events on categorical buckets',
            table: { defaultValue: { summary: 'true' } }
        },
        rollupCategoricalValues: {
            control: 'boolean',
            description: 'Rollup categorical values for simplified display',
            table: { defaultValue: { summary: 'true' } }
        },
        showFactoryData: {
            control: 'boolean',
            description: 'Show additional factory data for comparison',
            table: { defaultValue: { summary: 'false' } }
        }
    }
}
export default meta;
type Story = StoryObj<LineChart>;

function generateCategoricalData(includeFactoryData: boolean = false): ChartData<FactoryMetrics> {
    const data: ChartData<FactoryMetrics> = [];
    const from = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago

    // Generate regular time series data for first two aggregates (if requested)
    if (includeFactoryData) {
        for (let i = 0; i < 2; i++) {
            const factoryName = `Factory${i}`;
            const splitByData: Record<string, Record<string, FactoryMetrics>> = {};

            splitByData[''] = {}; // Main aggregate
            
            // Generate time series data
            for (let k = 0; k < 60; k++) {
                const timestamp = new Date(from.valueOf() + 1000 * 60 * k);
                const baseValue = 50 + i * 20;
                const value = baseValue + Math.sin(k / 10) * 10 + Math.random() * 5;

                splitByData[''][timestamp.toISOString()] = {
                    state1: parseFloat(value.toFixed(2)),
                    state2: 0,
                    state3: 0
                };
            }

            data.push({ [factoryName]: splitByData });
        }
    }

    // Generate categorical data following the example pattern
    const states: Record<string, Record<string, FactoryMetrics | null>> = {};
    data.push({ [`Factory3`]: states });
// Create stations with categorical state data
    for (let j = 0; j < 3; j++) {
        const values: Record<string, FactoryMetrics | null> = {};
        states[`Station${j}`] = values;

        for (let k = 0; k < 60; k++) {
            const val1 = Math.random();
            let state1: number, state2: number, state3: number;

            // Following the example logic for state distribution
            if (val1 < 0.5) {
                state1 = 1;
                state2 = 0;
                state3 = 0;
            } else {
                state1 = 0;
                state2 = (1 - 0) / 2; // Distribute remaining between state2 and state3
                state3 = (1 - 0) / 2;
            }

            const timestamp = new Date(from.valueOf() + 1000 * 60 * k);
            
            // Add some sparse data (80% probability following the example)
            if (Math.random() < 0.8) {
                values[timestamp.toISOString()] = {
                    state1: state1,
                    state2: state2,
                    state3: state3
                };
            } else {
                values[timestamp.toISOString()] = null;
            }
        }
    }
    // Add Station3 with constant state1 value following the example
    const values4: Record<string, FactoryMetrics> = {};
    for (let k = 0; k < 60; k++) {
        const timestamp = new Date(from.valueOf() + 1000 * 60 * k);
        values4[timestamp.toISOString()] = { state1: 0.4, state2: 0, state3: 0 };
    }
    states[`Station3`] = values4;

    return data;
}


/**
 * Render CategoricalPlot in a container with mock chart infrastructure.
 * Note: CategoricalPlot is typically used within a larger chart component.
 */
function renderCategoricalPlot(container: HTMLElement, options: any = {}) {
    container.innerHTML = '';

    try {
        console.log('Rendering CategoricalPlot with options:', options);
        const lineChart = new LineChart(container);

        const chartOptions = {
            theme: options.theme || 'light',
            legend: 'shown',
            grid: true,
            tooltip: true,
            brushMoveEndAction: () => {
                console.log('Brush move ended');
            },
            ...options
        };

        const valueMapping = {
            state1: {
                color: '#F2C80F' // Yellow for state1
            },
            state2: {
                color: '#FD625E' // Red for state2
            },
            state3: {
                color: '#3599B8' // Blue for state3
            }
        };

        // Click handler for categorical elements
        const onElementClick = (aggKey: string, splitBy: string, timestamp: Date, measures: any) => {
            console.log('Categorical element clicked:', { aggKey, splitBy, timestamp, measures });
            if (options.enableClickEvents) {
                alert(`Clicked categorical bucket:\nAggregate: ${aggKey}\nSplit By: ${splitBy}\nTime: ${timestamp.toISOString()}\nStates: ${JSON.stringify(measures, null, 2)}`);
            }
        };

        // Generate categorical data
        const categoricalData = generateCategoricalData(options.showFactoryData);
        console.log('Generated categorical data:', categoricalData);

        categoricalData.forEach((aggregate, index) => {
            const aggKey = Object.keys(aggregate)[0];
            const splitBys = aggregate[aggKey];
            
            Object.keys(splitBys).forEach(splitBy => {
                const timeData = splitBys[splitBy];
                Object.keys(timeData).forEach(timestamp => {
                    const measures = timeData[timestamp];
                    if (measures) {
                        // Ensure categorical measures sum to 1 or are valid proportions
                        const total = measures.state1 + measures.state2 + measures.state3;
                        if (Math.abs(total - 1) > 0.01) {
                            console.warn(`Categorical measures don't sum to 1 in ${aggKey}/${splitBy}/${timestamp}: ${total}`);
                        }
                    }
                });
            });
        });

        // Render with aggregateExpressionOptions for categorical display
        const aggregateExpressionOptions = categoricalData.map((aggregate, index) => {
            if (index < 2 && options.showFactoryData) {
                // First two aggregates are numeric time series
                return {
                    aggKey: Object.keys(aggregate)[0],
                    dataType: 'numeric'
                };
            } else {
                // Categorical aggregate configuration
                return {
                    aggKey: Object.keys(aggregate)[0],
                    dataType: 'categorical',
                    valueMapping: valueMapping,
                    height: options.height || 100,
                    onElementClick: onElementClick,
                    rollupCategoricalValues: options.rollupCategoricalValues !== false
                };
            }
        });

        // Render following the monolithic component pattern
        lineChart.render(categoricalData, chartOptions, aggregateExpressionOptions);

        return lineChart;
    } catch (error) {
        console.error('CategoricalPlot rendering error:', error);
        container.innerHTML = `<div style="color: red; padding: 20px; font-family: monospace;">
            <h3>Error rendering CategoricalPlot</h3>
            <p><strong>Error:</strong> ${error.message}</p>
            <p><small>Check browser console for more details</small></p>
        </div>`;
    }
}

// Helper function to create a story with plot rendering
function createCategoricalPlotStory(containerStyle: string) {
    return (args: any) => {
        const plotId = 'categorical-plot-' + Math.random().toString(36).substring(7);

        setTimeout(() => {
            const container = document.getElementById(plotId);
            if (container) {
                renderCategoricalPlot(container, args);
            }
        }, 100);

        return html`
            <div style="${containerStyle}">
                <div id="${plotId}" style="height: 100%; width: 100%;"></div>
            </div>
        `;
    };
}

export const Default: Story = {
    name: 'Categorical States (Default)',
    args: {
        theme: 'light',
        height: 100,
        enableClickEvents: true,
        rollupCategoricalValues: true,
        showFactoryData: false
    },
    render: createCategoricalPlotStory('height: 250px; width: 100%; border: 1px solid #ddd; border-radius: 4px;')
};
export const WithTimeSeriesData: Story = {
    name: 'With Time Series Data',
    args: {
        theme: 'light',
        height: 100,
        enableClickEvents: true,
        rollupCategoricalValues: true,
        showFactoryData: true
    },
    render: createCategoricalPlotStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px;')
};

export const TallCategorical: Story = {
    name: 'Tall Categorical Display',
    args: {
        theme: 'light',
        height: 150,
        enableClickEvents: true,
        rollupCategoricalValues: false,
        showFactoryData: false
    },
    render: createCategoricalPlotStory('height: 400px; width: 100%; border: 1px solid #ddd; border-radius: 4px;')
};

export const DarkTheme: Story = {
    name: 'Dark Theme',
    args: {
        theme: 'dark',
        height: 100,
        enableClickEvents: true,
        rollupCategoricalValues: true,
        showFactoryData: false
    },
    render: createCategoricalPlotStory('height: 300px; width: 100%; background: #1a1a1a; border: 1px solid #444; border-radius: 4px;')
};