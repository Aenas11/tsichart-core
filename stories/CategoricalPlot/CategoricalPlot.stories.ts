import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import * as d3 from 'd3';
import CategoricalPlot from '../../packages/core/src/components/CategoricalPlot';

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

/**
 * Generate sample categorical data for demonstration.
 * Returns data in the format expected by CategoricalPlot.
 * 
 * Data structure:
 * - Array of aggregate objects with categorical measurements
 * - Timestamped data points with categorical measures
 * - Multiple series with different split-by values
 */
function generateCategoricalData() {
    const timestamps = [
        '2023-01-01T00:00:00Z',
        '2023-01-01T01:00:00Z',
        '2023-01-01T02:00:00Z',
        '2023-01-01T03:00:00Z',
        '2023-01-01T04:00:00Z'
    ];

    const statuses = ['Running', 'Warning', 'Error', 'Maintenance', 'Stopped'];
    const priorities = ['Low', 'Normal', 'High', 'Critical'];
    const servers = ['', 'Server1', 'Server2', 'Server3'];

    return [{
        "SystemStatus": Object.fromEntries(
            servers.map(server => [
                server,
                Object.fromEntries(
                    timestamps.map((timestamp, i) => [
                        timestamp,
                        {
                            "Status": statuses[Math.floor(Math.random() * statuses.length)],
                            "Priority": priorities[Math.floor(Math.random() * priorities.length)],
                            "Alert": Math.random() > 0.7 ? 'Active' : 'None'
                        }
                    ])
                )
            ])
        )
    }];
}

/**
 * Generate IoT device status data for demonstration.
 * Shows different device states over time periods.
 */
function generateIoTDeviceData() {
    const timestamps = [
        '2023-01-01T00:00:00Z',
        '2023-01-01T00:30:00Z',
        '2023-01-01T01:00:00Z',
        '2023-01-01T01:30:00Z',
        '2023-01-01T02:00:00Z',
        '2023-01-01T02:30:00Z'
    ];

    const deviceStates = ['Online', 'Offline', 'Maintenance', 'Error', 'Sleep'];
    const batteryLevels = ['High', 'Medium', 'Low', 'Critical'];
    const devices = ['', 'Sensor1', 'Sensor2', 'Sensor3', 'Gateway1'];

    return [{
        "DeviceStatus": Object.fromEntries(
            devices.map(device => [
                device,
                Object.fromEntries(
                    timestamps.map(timestamp => [
                        timestamp,
                        {
                            "DeviceState": deviceStates[Math.floor(Math.random() * deviceStates.length)],
                            "BatteryLevel": batteryLevels[Math.floor(Math.random() * batteryLevels.length)],
                            "ConnectionStatus": Math.random() > 0.3 ? 'Connected' : 'Disconnected'
                        }
                    ])
                )
            ])
        )
    }];
}

/**
 * Generate manufacturing process data for demonstration.
 * Shows production line states and quality metrics.
 */
function generateManufacturingData() {
    const timestamps = [
        '2023-01-01T08:00:00Z',
        '2023-01-01T10:00:00Z',
        '2023-01-01T12:00:00Z',
        '2023-01-01T14:00:00Z',
        '2023-01-01T16:00:00Z',
        '2023-01-01T18:00:00Z'
    ];

    const processStates = ['Production', 'Setup', 'Changeover', 'Maintenance', 'Idle'];
    const qualityStates = ['Pass', 'Warning', 'Fail', 'Review'];
    const productionLines = ['', 'LineA', 'LineB', 'LineC'];

    return [{
        "ProductionProcess": Object.fromEntries(
            productionLines.map(line => [
                line,
                Object.fromEntries(
                    timestamps.map(timestamp => [
                        timestamp,
                        {
                            "ProcessState": processStates[Math.floor(Math.random() * processStates.length)],
                            "QualityState": qualityStates[Math.floor(Math.random() * qualityStates.length)],
                            "OperatorPresent": Math.random() > 0.2 ? 'Yes' : 'No'
                        }
                    ])
                )
            ])
        )
    }];
}


/**
 * Render CategoricalPlot in a container with mock chart infrastructure.
 * Note: CategoricalPlot is typically used within a larger chart component.
 */
function renderCategoricalPlot(container: HTMLElement, options: any = {}) {
    container.innerHTML = '';

    try {
        console.log('Rendering CategoricalPlot with options:', options);
        
        // Set up proper dimensions
        const width = container.clientWidth || 800;
        const height = options.height || 200;
        const margin = { top: 20, right: 20, bottom: 40, left: 60 };

        // Create SVG container with proper styling
        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background', options.theme === 'dark' ? '#1a1a1a' : '#ffffff');

        // Create chart group with margins
        const chartGroup = svg.append('g')
            .attr('class', 'tsi-chartGroup')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        const aggregateGroup = chartGroup.append('g')
            .attr('class', 'tsi-aggregateGroup');

        // Generate data based on type
        const categoricalData = options.dataType === 'iot' ? generateIoTDeviceData() :
                               options.dataType === 'manufacturing' ? generateManufacturingData() :
                               generateCategoricalData();

        // Set up proper time scales
        const aggData = categoricalData[0];
        const aggKey = Object.keys(aggData)[0];
        const splitByData = aggData[aggKey];

        // Create proper chartComponentData structure that Plot.getVisibleSeries() expects
        const chartComponentData = {
            // timeArrays should be the entire aggregate data structure
            timeArrays: aggData,
            // Add required methods that Plot base class uses
            isSplitByVisible: (aggKey: string, splitBy: string) => true,
            toMillis: Date.now(),
            fromMillis: Date.now() - (24 * 60 * 60 * 1000), // 24 hours ago
            // Add data access methods
            getVisibleMeasure: (aggKey: string, splitBy: string) => 'Status'
        };

        const allTimestamps = [];
        Object.values(splitByData).forEach((timeSeriesData: any) => {
            Object.keys(timeSeriesData).forEach(timestamp => {
                allTimestamps.push(new Date(timestamp));
            });
        });

        const timeExtent = d3.extent(allTimestamps) as [Date, Date];
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        const xScale = d3.scaleTime()
            .domain(timeExtent)
            .range([0, chartWidth]);

        const yScale = d3.scaleLinear()
            .domain([0, chartHeight])
            .range([0, chartHeight]);


        const defs = svg.append('defs');
        const plot = new CategoricalPlot(svg);

        const agg = {
            aggKey: aggKey,
            searchSpan: {
                bucketSize: options.bucketSize || 'PT1H'
            },
            splitBys: Object.keys(splitByData),
            visible: true
        };

        // Mock the required parameters for the render method
        const mockParams = {
            chartOptions: {
                theme: options.theme || 'light',
                noAnimate: options.noAnimate || false,
                ...options
            },
            visibleAggI: 0,
            agg: agg,
            aggVisible: true,
            aggregateGroup: aggregateGroup,
            chartComponentData: chartComponentData,
            yExtent: [0, chartHeight],
            chartHeight: chartHeight,
            visibleAggCount: 1,
            colorMap: new Map(),
            previousAggregateData: new Map(),
            x: xScale,
            areaPath: null,
            strokeOpacity: 1,
            y: yScale,
            yMap: new Map([
                [aggKey, { 
                    scaleType: 'linear',
                    yExtent: [0, chartHeight],
                    splitBys: Object.keys(splitByData)
                }]
            ]),
            defs: defs,
            chartDataOptions: {
                height: chartHeight,
                searchSpan: {
                    bucketSize: options.bucketSize || 'PT1H'
                },
                onElementClick: options.enableClickEvents ? 
                    (aggKey, splitBy, dateTime, measures) => {
                        console.log('Categorical bucket clicked:', { aggKey, splitBy, dateTime, measures });
                    } : null
            },
            previousIncludeDots: false,
            yTopAndHeight: [0, chartHeight],
            chartGroup: chartGroup,
            categoricalMouseover: (d, x, y, endDate, width) => {
                console.log('Categorical mouseover:', { d, x, y, endDate, width });
                return true;
            },
            categoricalMouseout: () => {
                console.log('Categorical mouseout');
            }
        };
        // Render the plot
        plot.render(
            mockParams.chartOptions,
            mockParams.visibleAggI,
            mockParams.agg,
            mockParams.aggVisible,
            mockParams.aggregateGroup,
            mockParams.chartComponentData,
            mockParams.yExtent,
            mockParams.chartHeight,
            mockParams.visibleAggCount,
            mockParams.colorMap,
            mockParams.previousAggregateData,
            mockParams.x,
            mockParams.areaPath,
            mockParams.strokeOpacity,
            mockParams.y,
            mockParams.yMap,
            mockParams.defs,
            mockParams.chartDataOptions,
            mockParams.previousIncludeDots,
            mockParams.yTopAndHeight,
            mockParams.chartGroup,
            mockParams.categoricalMouseover,
            mockParams.categoricalMouseout
        );

        return plot;
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