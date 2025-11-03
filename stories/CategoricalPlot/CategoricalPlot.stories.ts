import type { Meta, StoryObj } from '@storybook/web-components-vite';
import LineChart from '../../packages/core/src/components/LineChart';
import { ChartData } from '../../packages/core/src/types';
import { ILineChartOptions } from '../../packages/core/src/components/LineChart/ILineChartOptions';
import { html } from 'lit';
import * as d3 from 'd3';
import CategoricalPlot from '../../packages/core/src/components/CategoricalPlot';
import { NONNUMERICTOPMARGIN, LINECHARTTOPPADDING } from "../../packages/core/src/constants/Constants";

interface FactoryMetrics extends Record<string, number> {
    value: number;
    temperature: number;
}


const meta: Meta<CategoricalPlot> = {
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
        "SystemStatus": {
            "": {
                "2023-01-01T00:00:00Z": {
                    "Status": "Running",
                    "Priority": "Normal"
                },
                "2023-01-01T01:00:00Z": {
                    "Status": "Warning",
                    "Priority": "High"
                }
            },
            "Server1": {
                "2023-01-01T00:00:00Z": {
                    "Status": "Running",
                    "Priority": "Low"
                }
            }
        }
    }
];

// Render the plot with categorical options
plot.render(chartOptions, visibleAggI, agg, aggVisible, aggregateGroup, 
    chartComponentData, yExtent, chartHeight, visibleAggCount, colorMap, 
    previousAggregateData, x, areaPath, strokeOpacity, y, yMap, defs,
    chartDataOptions, previousIncludeDots, yTopAndHeight, chartGroup, 
    categoricalMouseover, categoricalMouseout);
\`\`\`
                
## Chart Options

- **theme**: Visual theme ('light' or 'dark')
- **height**: Height per categorical series for proper vertical spacing
- **noAnimate**: Disable transition animations for immediate rendering
- **searchSpan**: Time range and bucket size configuration for temporal alignment
- **onElementClick**: Callback function for categorical bucket click events

## Interactive Features

1. **Bucket Hover**: Hover over categorical buckets to see detailed measurement information
2. **Click Events**: Click on buckets to trigger custom actions (if configured)
3. **Series Navigation**: Multiple categorical series stacked vertically for comparison
4. **Temporal Alignment**: Buckets automatically sized based on time duration
5. **Color Coding**: Automatic color assignment based on categorical values
6. **Gradient Support**: Multiple measures within buckets create color gradients

## Data Format

Categorical data should be provided as timestamped measurements containing discrete categorical values. Each measurement represents a categorical state or status at a specific time period.                         
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
            control: { type: 'number', min: 100, max: 800, step: 50 },
            description: 'Height of the categorical plot area',
            table: { defaultValue: { summary: '200' } }
        },
        noAnimate: {
            control: 'boolean',
            description: 'Disable transition animations for immediate rendering',
            table: { defaultValue: { summary: 'false' } }
        },
        enableClickEvents: {
            control: 'boolean',
            description: 'Enable click events on categorical buckets',
            table: { defaultValue: { summary: 'true' } }
        },
        bucketSize: {
            control: { type: 'select' },
            options: ['PT1H', 'PT30M', 'PT15M', 'PT5M'],
            description: 'Time bucket size for categorical data aggregation',
            table: { defaultValue: { summary: 'PT1H' } }
        },
        showBackdrop: {
            control: 'boolean',
            description: 'Show backdrop rectangle for better contrast',
            table: { defaultValue: { summary: 'true' } }
        }
    }
}
export default meta;

type Story = StoryObj<CategoricalPlot>;

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


/**
 * Render CategoricalPlot in a container with mock chart infrastructure.
 * Note: CategoricalPlot is typically used within a larger chart component.
 */
function renderCategoricalPlot(container: HTMLElement, options: any = {}) {
    container.innerHTML = '';

    try {
        console.log('Rendering CategoricalPlot with options:', options);
        const chart = new LineChart(container);

        const chartOptions = {
            theme: options.theme || 'light',
            legend: 'shown',
            grid: true,
            tooltip: true,
            ...options
        };

        let valueMapping = {
            'ColorColorWhatColor[Blue]': {
                color: 'blue'
            }, 
            'ColorColorWhatColor[Green]': {
                color: 'green'
            },
            'ColorColorWhatColor[Yellow]': {
                color:'yellow'
            },
            'ColorColorWhatColor[Orange]': {
                color:'orange'
            },
            'ColorColorWhatColor[Others]': {
                color:'gray'
            }
        }

        const sampleData = generateSampleData();
        chart.render(sampleData, chartOptions, [{}, {dataType: 'categorical',valueMapping: valueMapping, height: 100}]);
        
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
function createCategoricalPlotStory(containerStyle: string, dataType: string = 'system') {
    return (args: any) => {
        const plotId = 'categorical-plot-' + Math.random().toString(36).substring(7);

        setTimeout(() => {
            const container = document.getElementById(plotId);
            if (container) {
                renderCategoricalPlot(container, { ...args, dataType });
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
    name: 'System Status (Default)',
    args: {
        theme: 'light',
        height: 200,
        noAnimate: false,
        enableClickEvents: true,
        bucketSize: 'PT1H',
        showBackdrop: true
    },
    render: createCategoricalPlotStory('height: 250px; width: 100%; border: 1px solid #ddd; border-radius: 4px;', 'system')
};

export const DarkTheme: Story = {
    name: 'Dark Theme',
    args: {
        theme: 'dark',
        height: 200,
        noAnimate: false,
        enableClickEvents: true,
        bucketSize: 'PT1H',
        showBackdrop: true
    },
    render: createCategoricalPlotStory('height: 250px; width: 100%; background: #1a1a1a; border: 1px solid #444; border-radius: 4px;', 'system')
};

export const IoTDevices: Story = {
    name: 'IoT Device Status',
    args: {
        theme: 'light',
        height: 300,
        noAnimate: false,
        enableClickEvents: true,
        bucketSize: 'PT30M',
        showBackdrop: true
    },
    render: createCategoricalPlotStory('height: 350px; width: 100%; border: 1px solid #ddd; border-radius: 4px;', 'iot')
};

export const Manufacturing: Story = {
    name: 'Manufacturing Process',
    args: {
        theme: 'light',
        height: 250,
        noAnimate: true,
        enableClickEvents: true,
        bucketSize: 'PT2H',
        showBackdrop: true
    },
    render: createCategoricalPlotStory('height: 300px; width: 100%; border: 1px solid #ddd; border-radius: 4px;', 'manufacturing')
};