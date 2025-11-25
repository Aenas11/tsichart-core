// stories/LineChart/LineChartDataTypes.stories.ts
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import LineChart from '../../packages/core/src/components/LineChart';
import { ChartData } from '../../packages/core/src/types';
import { ILineChartOptions } from '../../packages/core/src/components/LineChart/ILineChartOptions';

/**
 * This story demonstrates the different data types supported by LineChart:
 * - Numeric (LinePlot): Standard time series with continuous numeric values
 * - Categorical: State-based data with discrete categories
 * - Events: Discrete events that occur at specific timestamps
 * 
 * Each data type renders differently and has its own interaction patterns.
 */

// Define interfaces for different metric types
interface NumericMetrics extends Record<string, number> {
    temperature: number;
    pressure: number;
}

interface CategoricalMetrics extends Record<string, string | number> {
    state: string;
}

interface EventMetrics extends Record<string, string | number> {
    event: string;
}

const meta: Meta<ILineChartOptions> = {
    title: 'Charts/LineChart/Data Types',
    component: 'LineChart',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
# LineChart Data Types

The LineChart component supports three distinct data types, each with unique rendering and interaction behaviors:

## 1. Numeric Data (LinePlot)
- **Use Case**: Continuous measurements like temperature, pressure, flow rates
- **Rendering**: Line graphs with optional dots and envelopes
- **Features**: 
  - Interpolation between points
  - Min/max envelopes
  - Voronoi-based hover detection
  - Full brushing and zooming support

## 2. Categorical Data (CategoricalPlot)
- **Use Case**: State-based data like machine status, operational modes
- **Rendering**: Colored horizontal bars representing states over time
- **Features**:
  - Discrete color-coded states
  - Value mapping for colors
  - State transitions visualization
  - Optional rollup of adjacent identical values

## 3. Events Data (EventsPlot)
- **Use Case**: Discrete events like alarms, notifications, incidents
- **Rendering**: Icons (diamonds or teardrops) at event timestamps
- **Features**:
  - Two icon styles: diamond or teardrop (custom icons not currently supported)
  - Color-coded by event type
  - Collapsible event lanes
  - Click handlers for event details
  - Gradient fills for events with multiple measure types

## Data Type Configuration

Configure data types using the \`aggregateExpressionOptions\` parameter:

\`\`\`typescript
chart.render(data, chartOptions, [
    { dataType: 'numeric' },              // LinePlot
    { dataType: 'categorical', valueMapping: { ... } },  // CategoricalPlot
    { dataType: 'events', eventElementType: 'diamond' }  // EventsPlot
]);
\`\`\`

## Custom Color Schemes

All data types support custom colors:
- **Numeric**: Use \`color\` property in aggregateExpressionOptions (string or function)
- **Categorical**: Use \`valueMapping\` with color property for each state
- **Events**: Use \`valueMapping\` with color property for each event type

## Mixing Data Types

All three data types can be combined in a single chart with swim lanes to organize them.
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
        legend: {
            control: { type: 'select' },
            options: ['shown', 'hidden', 'compact'],
            description: 'Legend display mode'
        },
        tooltip: {
            control: 'boolean',
            description: 'Enable/disable interactive tooltips'
        },
    },
};

export default meta;
type Story = StoryObj<ILineChartOptions>;

/**
 * Generate numeric time series data for LinePlot demonstration
 */
function generateNumericData(): ChartData<NumericMetrics> {
    const data: ChartData<NumericMetrics> = [];
    const from = new Date(Date.now() - 12 * 60 * 60 * 1000); // 12 hours ago

    // Create 2 sensors with temperature and pressure readings
    for (let i = 0; i < 2; i++) {
        const sensorName = `Sensor${i + 1}`;
        const splitByData: Record<string, Record<string, NumericMetrics>> = {};

        const timeSeries: Record<string, NumericMetrics> = {};

        // Generate data points every 30 minutes
        for (let k = 0; k < 24; k++) {
            const timestamp = new Date(from.getTime() + k * 30 * 60 * 1000);
            const baseTemp = 20 + i * 5;
            const basePressure = 100 + i * 10;

            timeSeries[timestamp.toISOString()] = {
                temperature: parseFloat((baseTemp + Math.sin(k / 4) * 8 + Math.random() * 3).toFixed(2)),
                pressure: parseFloat((basePressure + Math.cos(k / 3) * 15 + Math.random() * 5).toFixed(2))
            };
        }

        splitByData[''] = timeSeries;
        data.push({ [sensorName]: splitByData });
    }

    return data;
}

/**
 * Generate categorical data for CategoricalPlot demonstration
 * Categorical data uses property names as state identifiers with numeric values (0-1 range)
 * representing the proportion of each state
 */
function generateCategoricalData(): ChartData {
    const data: ChartData = [];
    const from = new Date(Date.now() - 12 * 60 * 60 * 1000);

    // Create different patterns for each machine to make visualization more interesting
    const patterns = [
        // Pattern 1: More varied states (Machine1)
        [
            { idle: 0.6, running: 0.3, maintenance: 0.1, error: 0 },
            { idle: 0.1, running: 0.8, maintenance: 0.1, error: 0 },
            { idle: 0, running: 1, maintenance: 0, error: 0 },
            { idle: 0, running: 0.7, maintenance: 0.3, error: 0 },
            { idle: 0.3, running: 0.5, maintenance: 0.2, error: 0 },
            { idle: 0, running: 0, maintenance: 1, error: 0 },
            { idle: 0.2, running: 0.6, maintenance: 0.2, error: 0 },
            { idle: 0, running: 0.9, maintenance: 0, error: 0.1 }
        ],
        // Pattern 2: More distinct states (Machine2)
        [
            { idle: 1, running: 0, maintenance: 0, error: 0 },
            { idle: 0, running: 1, maintenance: 0, error: 0 },
            { idle: 0, running: 0, maintenance: 1, error: 0 },
            { idle: 0, running: 1, maintenance: 0, error: 0 },
            { idle: 0, running: 0, maintenance: 0, error: 1 },
            { idle: 0, running: 1, maintenance: 0, error: 0 },
            { idle: 0.5, running: 0.5, maintenance: 0, error: 0 },
            { idle: 0, running: 0, maintenance: 1, error: 0 }
        ]
    ];

    for (let i = 0; i < 2; i++) {
        const machineName = `Machine${i + 1}`;
        const splitByData: Record<string, Record<string, any>> = {};
        const timeSeries: Record<string, any> = {};
        const pattern = patterns[i];

        // Generate state changes with pattern
        let currentTime = from.getTime();
        const endTime = Date.now();
        let patternIndex = 0;

        while (currentTime < endTime) {
            const timestamp = new Date(currentTime);
            const stateConfig = pattern[patternIndex % pattern.length];

            timeSeries[timestamp.toISOString()] = { ...stateConfig };

            // Random interval between 20-40 minutes
            currentTime += (20 + Math.random() * 20) * 60 * 1000;
            patternIndex++;
        }

        splitByData[''] = timeSeries;
        data.push({ [machineName]: splitByData });
    }

    return data;
}

/**
 * Generate events data for EventsPlot demonstration
 * Events use property names as event types with numeric values
 */
function generateEventsData(): ChartData {
    const data: ChartData = [];
    const from = new Date(Date.now() - 12 * 60 * 60 * 1000);

    // Different event patterns for each system
    const eventPatterns = [
        // System1: More info and warnings, few criticals
        { alert: 0.3, warning: 0.4, info: 0.25, critical: 0.05 },
        // System2: More balanced distribution
        { alert: 0.25, warning: 0.25, info: 0.25, critical: 0.25 }
    ];

    for (let i = 0; i < 2; i++) {
        const systemName = `System${i + 1}`;
        const splitByData: Record<string, Record<string, any>> = {};
        const timeSeries: Record<string, any> = {};
        const pattern = eventPatterns[i];

        // Generate 18-25 events with weighted distribution
        const eventCount = 18 + Math.floor(Math.random() * 8);

        for (let k = 0; k < eventCount; k++) {
            const randomOffset = Math.random() * 12 * 60 * 60 * 1000;
            const timestamp = new Date(from.getTime() + randomOffset);

            // Select event type based on weighted probability
            const rand = Math.random();
            let eventType = 'info'; // default
            let cumulative = 0;

            for (const [type, probability] of Object.entries(pattern)) {
                cumulative += probability;
                if (rand <= cumulative) {
                    eventType = type;
                    break;
                }
            }

            // Event data uses the event type as the property name with a numeric value
            // Multiple event types can occur at the same timestamp
            if (timeSeries[timestamp.toISOString()]) {
                timeSeries[timestamp.toISOString()][eventType] = 1;
            } else {
                timeSeries[timestamp.toISOString()] = {
                    [eventType]: 1
                };
            }
        }

        splitByData[''] = timeSeries;
        data.push({ [systemName]: splitByData });
    }

    return data;
}

/**
 * Generate mixed data combining all three types
 */
function generateMixedData() {
    const numericData = generateNumericData();
    const categoricalData = generateCategoricalData();
    const eventsData = generateEventsData();

    return {
        numeric: numericData,
        categorical: categoricalData,
        events: eventsData
    };
}

// Function to render LineChart in a container
function renderLineChart(container: HTMLElement, data: any, aggregateExpressionOptions: any[], options: any = {}) {
    container.innerHTML = '';

    try {
        const chart = new LineChart(container);

        const chartOptions = {
            theme: options.theme || 'light',
            legend: 'shown',
            grid: true,
            tooltip: true,
            yAxisState: 'stacked',
            is24HourTime: true,
            offset: 'Local',
            ...options
        };

        chart.render(data, chartOptions, aggregateExpressionOptions);

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

// Helper function to create a story
function createDataTypeStory(dataGenerator: () => any, aggregateOptions: any[], containerStyle: string) {
    return (args: any) => {
        const chartId = 'chart-' + Math.random().toString(36).substring(7);

        setTimeout(() => {
            const container = document.getElementById(chartId);
            if (container) {
                const data = dataGenerator();
                renderLineChart(container, data, aggregateOptions, args);
            }
        }, 100);

        return html`
            <div style="${containerStyle}">
                <div id="${chartId}" style="height: 100%; width: 100%;"></div>
            </div>
        `;
    };
}

/**
 * Numeric data type (LinePlot) - displays continuous time series data with lines
 */
export const NumericDataType: Story = {
    name: 'Numeric (LinePlot)',
    args: {
        theme: 'light',
        legend: 'shown',
        tooltip: true,
    },
    render: createDataTypeStory(
        generateNumericData,
        [
            { includeEnvelope: false, includeDots: false },
            { includeEnvelope: false, includeDots: false }
        ],
        'height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px;'
    ),
    parameters: {
        docs: {
            description: {
                story: `
### Numeric Data Type (LinePlot)

This example demonstrates the **LinePlot** component for numeric time series data.

**Features:**
- Continuous line interpolation between data points
- Multiple measures per timestamp (temperature, pressure)
- Smooth curves with configurable interpolation
- Hover interactions with crosshairs
- Full zoom and brush support

**Data Format:**
\`\`\`typescript
{
    "Sensor1": {
        "": {
            "2023-01-01T00:00:00Z": { 
                temperature: 22.5, 
                pressure: 101.3 
            }
        }
    }
}
\`\`\`

**Configuration:**
\`\`\`typescript
aggregateExpressionOptions: [
    { 
        dataType: 'numeric',  // or omit, as numeric is default
        includeEnvelope: false,
        includeDots: false,
        color: '#3599B8'  // Optional: custom color (hex, rgb, or color name)
    }
]
\`\`\`
                `
            }
        }
    }
};

/**
 * Categorical data type - displays state-based data with colored horizontal bars
 */
export const CategoricalDataType: Story = {
    name: 'Categorical (CategoricalPlot)',
    args: {
        theme: 'light',
        legend: 'shown',
        tooltip: true,
    },
    render: createDataTypeStory(
        generateCategoricalData,
        [
            {
                dataType: 'categorical',
                valueMapping: {
                    'idle': { color: '#60B9AE' },
                    'running': { color: '#3599B8' },
                    'maintenance': { color: '#F2C80F' },
                    'error': { color: '#FD625E' }
                },
                height: 80
            },
            {
                dataType: 'categorical',
                valueMapping: {
                    'idle': { color: '#60B9AE' },
                    'running': { color: '#3599B8' },
                    'maintenance': { color: '#F2C80F' },
                    'error': { color: '#FD625E' }
                },
                height: 80
            }
        ],
        'height: 400px; width: 100%; border: 1px solid #ddd; border-radius: 4px;'
    ),
    parameters: {
        docs: {
            description: {
                story: `
### Categorical Data Type (CategoricalPlot)

This example demonstrates the **CategoricalPlot** component for state-based data.

**Features:**
- Horizontal colored bars representing states over time
- State transitions clearly visualized
- Custom color mapping per state value
- Configurable height per series
- Click handlers for state bars

**Data Format:**
\`\`\`typescript
{
    "Machine1": {
        "": {
            "2023-01-01T00:00:00Z": { idle: 1, running: 0, maintenance: 0, error: 0 },
            "2023-01-01T00:30:00Z": { idle: 0, running: 1, maintenance: 0, error: 0 },
            "2023-01-01T01:00:00Z": { idle: 0, running: 0, maintenance: 1, error: 0 }
        }
    }
}
\`\`\`
**Note:** Property names (idle, running, etc.) represent states, with numeric values (0-1) indicating proportions.

**Configuration:**
\`\`\`typescript
aggregateExpressionOptions: [
    {
        dataType: 'categorical',
        valueMapping: {
            'idle': { color: '#60B9AE' },
            'running': { color: '#3599B8' },
            'maintenance': { color: '#F2C80F' },
            'error': { color: '#FD625E' }
        },
        height: 80,
        rollupCategoricalValues: true,  // optional: merge adjacent identical states
        onElementClick: (aggKey, splitBy, timestamp, measures) => {
            console.log('State clicked:', measures);
        }
    }
]
\`\`\`
                `
            }
        }
    }
};

/**
 * Events data type - displays discrete events as icons at specific timestamps
 */
export const EventsDataType: Story = {
    name: 'Events (EventsPlot)',
    args: {
        theme: 'light',
        legend: 'shown',
        tooltip: true,
    },
    render: createDataTypeStory(
        generateEventsData,
        [
            {
                dataType: 'events',
                eventElementType: 'diamond',
                valueMapping: {
                    'alert': { color: '#F2C80F' },
                    'warning': { color: '#FFA500' },
                    'info': { color: '#3599B8' },
                    'critical': { color: '#FD625E' }
                },
                height: 60
            },
            {
                dataType: 'events',
                eventElementType: 'teardrop',
                valueMapping: {
                    'alert': { color: '#F2C80F' },
                    'warning': { color: '#FFA500' },
                    'info': { color: '#3599B8' },
                    'critical': { color: '#FD625E' }
                },
                height: 60
            }
        ],
        'height: 400px; width: 100%; border: 1px solid #ddd; border-radius: 4px;'
    ),
    parameters: {
        docs: {
            description: {
                story: `
### Events Data Type (EventsPlot)

This example demonstrates the **EventsPlot** component for discrete event data.

**Features:**
- SVG icons (diamond or teardrop) at event timestamps
- Color-coded by event type
- Two icon styles available
- Collapsible event lanes in swimlane mode
- Click handlers for individual events
- Tooltip showing event details

**Current Limitations:**
- Custom icons/images are not currently supported
- Only diamond and teardrop shapes are available

**Data Format:**
\`\`\`typescript
{
    "System1": {
        "": {
            "2023-01-01T00:05:23Z": { alert: 1 },
            "2023-01-01T00:45:12Z": { critical: 1 },
            "2023-01-01T01:23:45Z": { info: 1 }
        }
    }
}
\`\`\`
**Note:** Property names (alert, warning, etc.) represent event types. Values are typically 1.

**Configuration:**
\`\`\`typescript
aggregateExpressionOptions: [
    {
        dataType: 'events',
        eventElementType: 'diamond',  // or 'teardrop'
        valueMapping: {
            'alert': { color: '#F2C80F' },
            'warning': { color: '#FFA500' },
            'info': { color: '#3599B8' },
            'critical': { color: '#FD625E' }
        },
        height: 60,
        onElementClick: (aggKey, splitBy, timestamp, measures) => {
            console.log('Event clicked:', timestamp, measures);
        }
    }
]
\`\`\`
                `
            }
        }
    }
};

/**
 * Mixed data types - combining all three types with swim lanes
 */
export const MixedDataTypes: Story = {
    name: 'Mixed (All Types Combined)',
    args: {
        theme: 'light',
        legend: 'shown',
        tooltip: true,
    },
    render: (args: any) => {
        const chartId = 'chart-' + Math.random().toString(36).substring(7);

        setTimeout(() => {
            const container = document.getElementById(chartId);
            if (container) {
                const mixedData = generateMixedData();

                // Combine all data into single array
                const combinedData = [
                    ...mixedData.numeric,
                    ...mixedData.categorical,
                    ...mixedData.events
                ];

                const aggregateOptions = [
                    // Numeric data (2 series)
                    { dataType: 'numeric', swimLane: 1, includeEnvelope: false },
                    { dataType: 'numeric', swimLane: 1, includeEnvelope: false },
                    // Categorical data (2 series)
                    {
                        dataType: 'categorical',
                        swimLane: 2,
                        valueMapping: {
                            'idle': { color: '#60B9AE' },
                            'running': { color: '#3599B8' },
                            'maintenance': { color: '#F2C80F' },
                            'error': { color: '#FD625E' }
                        },
                        height: 60
                    },
                    {
                        dataType: 'categorical',
                        swimLane: 2,
                        valueMapping: {
                            'idle': { color: '#60B9AE' },
                            'running': { color: '#3599B8' },
                            'maintenance': { color: '#F2C80F' },
                            'error': { color: '#FD625E' }
                        },
                        height: 60
                    },
                    // Events data (2 series)
                    {
                        dataType: 'events',
                        swimLane: 3,
                        eventElementType: 'diamond',
                        valueMapping: {
                            'alert': { color: '#F2C80F' },
                            'warning': { color: '#FFA500' },
                            'info': { color: '#3599B8' },
                            'critical': { color: '#FD625E' }
                        },
                        height: 50
                    },
                    {
                        dataType: 'events',
                        swimLane: 3,
                        eventElementType: 'teardrop',
                        valueMapping: {
                            'alert': { color: '#F2C80F' },
                            'warning': { color: '#FFA500' },
                            'info': { color: '#3599B8' },
                            'critical': { color: '#FD625E' }
                        },
                        height: 50
                    }
                ];

                const chartOptions = {
                    ...args,
                    swimLaneOptions: {
                        1: { yAxisType: 'shared', label: 'Sensors' },
                        2: { yAxisType: 'shared', label: 'Machine States' },
                        3: { yAxisType: 'shared', label: 'System Events' }
                    }
                };

                renderLineChart(container, combinedData, aggregateOptions, chartOptions);
            }
        }, 100);

        return html`
            <div style="height: 600px; width: 100%; border: 1px solid #ddd; border-radius: 4px;">
                <div id="${chartId}" style="height: 100%; width: 100%;"></div>
            </div>
        `;
    },
    parameters: {
        docs: {
            description: {
                story: `
### Mixed Data Types with Swim Lanes

This example combines all three data types (Numeric, Categorical, Events) in a single chart using swim lanes.

**Features:**
- Multiple data types in one visualization
- Swim lanes to organize different data types
- Shared time axis across all types
- Independent y-axes per swim lane
- Coordinated hover interactions
- Custom labels per swim lane

**Use Cases:**
- Industrial monitoring (sensors + machine states + alarms)
- System health dashboards (metrics + status + incidents)
- Process monitoring (measurements + phases + events)

**Configuration:**
\`\`\`typescript
// Data array contains all series
const data = [...numericData, ...categoricalData, ...eventsData];

// Configure each series with its type and swim lane
const aggregateExpressionOptions = [
    { dataType: 'numeric', swimLane: 1 },
    { dataType: 'categorical', swimLane: 2, valueMapping: {...} },
    { dataType: 'events', swimLane: 3, valueMapping: {...} }
];

// Configure swim lane options
const chartOptions = {
    swimLaneOptions: {
        1: { yAxisType: 'shared', label: 'Sensors' },
        2: { yAxisType: 'shared', label: 'States' },
        3: { yAxisType: 'shared', label: 'Events' }
    }
};

chart.render(data, chartOptions, aggregateExpressionOptions);
\`\`\`
                `
            }
        }
    }
};

/**
 * Categorical with rollup option
 */
export const CategoricalWithRollup: Story = {
    name: 'Categorical with Rollup',
    args: {
        theme: 'light',
        legend: 'shown',
        tooltip: true,
    },
    render: createDataTypeStory(
        () => {
            // Generate data with consecutive identical states to demonstrate rollup
            const data: ChartData = [];
            const from = new Date(Date.now() - 6 * 60 * 60 * 1000);

            const machineName = 'Assembly Line';
            const splitByData: Record<string, Record<string, any>> = {};
            const timeSeries: Record<string, any> = {};

            // Define state configurations that match valueMapping keys
            const stateConfigs = {
                idle: { idle: 1, running: 0, maintenance: 0, error: 0 },
                running: { idle: 0, running: 1, maintenance: 0, error: 0 },
                maintenance: { idle: 0, running: 0, maintenance: 1, error: 0 },
                error: { idle: 0, running: 0, maintenance: 0, error: 1 }
            };

            const stateSequence = ['idle', 'idle', 'idle', 'running', 'running', 'running', 'running',
                'maintenance', 'maintenance', 'running', 'running', 'error', 'running'];

            for (let k = 0; k < stateSequence.length; k++) {
                const timestamp = new Date(from.getTime() + k * 30 * 60 * 1000);
                const stateName = stateSequence[k];
                timeSeries[timestamp.toISOString()] = { ...stateConfigs[stateName] };
            }

            splitByData[''] = timeSeries;
            data.push({ [machineName]: splitByData });

            return data;
        },
        [
            {
                dataType: 'categorical',
                valueMapping: {
                    'idle': { color: '#60B9AE' },
                    'running': { color: '#3599B8' },
                    'maintenance': { color: '#F2C80F' },
                    'error': { color: '#FD625E' }
                },
                height: 100,
                rollupCategoricalValues: true
            }
        ],
        'height: 300px; width: 100%; border: 1px solid #ddd; border-radius: 4px;'
    ),
    parameters: {
        docs: {
            description: {
                story: `
### Categorical Data with Rollup

The \`rollupCategoricalValues\` option merges consecutive identical states into a single bar.

**Without Rollup:** Each timestamp creates a separate bar, even if the state value is the same.

**With Rollup (enabled here):** Adjacent bars with identical states are merged into one continuous bar.

This is useful for reducing visual clutter when you have high-frequency state data where the state doesn't change often.

\`\`\`typescript
{
    dataType: 'categorical',
    rollupCategoricalValues: true,  // Merge adjacent identical states
    valueMapping: { ... }
}
\`\`\`
                `
            }
        }
    }
};

/**
 * Categorical data with mixed/stacked states - showing proportional state values
 */
export const CategoricalStacked: Story = {
    name: 'Categorical (Stacked States)',
    args: {
        theme: 'light',
        legend: 'shown',
        tooltip: true,
    },
    render: createDataTypeStory(
        () => {
            const data: ChartData = [];
            const from = new Date(Date.now() - 8 * 60 * 60 * 1000);

            const machineName = 'Production Line';
            const splitByData: Record<string, Record<string, any>> = {};
            const timeSeries: Record<string, any> = {};

            // Generate data with mixed states showing proportions
            for (let k = 0; k < 16; k++) {
                const timestamp = new Date(from.getTime() + k * 30 * 60 * 1000);
                const t = k / 16; // normalized time

                // Create varying proportions over time
                const idleRatio = Math.max(0, 0.3 - t * 0.2);
                const runningRatio = 0.3 + Math.sin(t * Math.PI * 2) * 0.15;
                const maintenanceRatio = 0.2 + Math.cos(t * Math.PI * 3) * 0.1;
                const errorRatio = Math.max(0, 0.05 + (t > 0.7 ? (t - 0.7) * 0.3 : 0));

                // Normalize to sum to 1
                const total = idleRatio + runningRatio + maintenanceRatio + errorRatio;

                timeSeries[timestamp.toISOString()] = {
                    idle: idleRatio / total,
                    running: runningRatio / total,
                    maintenance: maintenanceRatio / total,
                    error: errorRatio / total
                };
            }

            splitByData[''] = timeSeries;
            data.push({ [machineName]: splitByData });

            return data;
        },
        [
            {
                dataType: 'categorical',
                valueMapping: {
                    'idle': { color: '#60B9AE' },
                    'running': { color: '#3599B8' },
                    'maintenance': { color: '#F2C80F' },
                    'error': { color: '#FD625E' }
                },
                height: 120,
                rollupCategoricalValues: false
            }
        ],
        'height: 350px; width: 100%; border: 1px solid #ddd; border-radius: 4px;'
    ),
    parameters: {
        docs: {
            description: {
                story: `
### Categorical Data with Stacked States

This example shows how categorical data can represent **proportions** of multiple states at each timestamp.

**Key Feature:** Each timestamp can have multiple state values (0-1 range) that sum to 1, showing the distribution of states.

**Use Cases:**
- Server resource allocation (CPU, memory, disk usage by process)
- Manufacturing line utilization (idle, running different products, maintenance)
- Multi-state systems where multiple states can coexist

**Data Structure:**
\`\`\`typescript
{
    "2023-01-01T00:00:00Z": {
        idle: 0.2,      // 20% idle
        running: 0.6,   // 60% running
        maintenance: 0.15, // 15% maintenance
        error: 0.05     // 5% error
    }
}
\`\`\`

The bars are stacked vertically showing the proportion of each state at that time.
                `
            }
        }
    }
};

/**
 * Custom color schemes - demonstrating how to apply custom colors to all data types
 */
export const CustomColorSchemes: Story = {
    name: 'Custom Color Schemes',
    args: {
        theme: 'light',
        legend: 'shown',
        tooltip: true,
    },
    render: (args: any) => {
        const chartId = 'chart-' + Math.random().toString(36).substring(7);

        setTimeout(() => {
            const container = document.getElementById(chartId);
            if (container) {
                const mixedData = generateMixedData();

                // Combine all data into single array
                const combinedData = [
                    ...mixedData.numeric,
                    ...mixedData.categorical,
                    ...mixedData.events
                ];

                // Custom color palette (purple/pink theme)
                const customColors = {
                    purple1: '#9D4EDD',
                    purple2: '#7209B7',
                    pink1: '#F72585',
                    pink2: '#B5179E',
                    teal: '#4CC9F0',
                    orange: '#FB8500'
                };

                const aggregateOptions = [
                    // Numeric data with custom colors (2 series)
                    {
                        dataType: 'numeric',
                        swimLane: 1,
                        includeEnvelope: false,
                        color: customColors.purple1  // Custom color for first sensor
                    },
                    {
                        dataType: 'numeric',
                        swimLane: 1,
                        includeEnvelope: false,
                        color: customColors.pink1  // Custom color for second sensor
                    },
                    // Categorical data with custom color mapping (2 series)
                    {
                        dataType: 'categorical',
                        swimLane: 2,
                        valueMapping: {
                            'idle': { color: customColors.teal },
                            'running': { color: customColors.purple2 },
                            'maintenance': { color: customColors.orange },
                            'error': { color: customColors.pink2 }
                        },
                        height: 60
                    },
                    {
                        dataType: 'categorical',
                        swimLane: 2,
                        valueMapping: {
                            'idle': { color: customColors.teal },
                            'running': { color: customColors.purple2 },
                            'maintenance': { color: customColors.orange },
                            'error': { color: customColors.pink2 }
                        },
                        height: 60
                    },
                    // Events data with custom color mapping (2 series)
                    {
                        dataType: 'events',
                        swimLane: 3,
                        eventElementType: 'diamond',
                        valueMapping: {
                            'alert': { color: customColors.orange },
                            'warning': { color: customColors.pink1 },
                            'info': { color: customColors.teal },
                            'critical': { color: customColors.pink2 }
                        },
                        height: 50
                    },
                    {
                        dataType: 'events',
                        swimLane: 3,
                        eventElementType: 'teardrop',
                        valueMapping: {
                            'alert': { color: customColors.orange },
                            'warning': { color: customColors.pink1 },
                            'info': { color: customColors.teal },
                            'critical': { color: customColors.pink2 }
                        },
                        height: 50
                    }
                ];

                const chartOptions = {
                    ...args,
                    swimLaneOptions: {
                        1: { yAxisType: 'shared', label: 'Sensors (Custom Colors)' },
                        2: { yAxisType: 'shared', label: 'Machine States' },
                        3: { yAxisType: 'shared', label: 'System Events' }
                    }
                };

                renderLineChart(container, combinedData, aggregateOptions, chartOptions);
            }
        }, 100);

        return html`
            <div style="height: 600px; width: 100%; border: 1px solid #ddd; border-radius: 4px;">
                <div id="${chartId}" style="height: 100%; width: 100%;"></div>
            </div>
        `;
    },
    parameters: {
        docs: {
            description: {
                story: `
### Custom Color Schemes

This example demonstrates how to apply **custom color schemes** to all three data types.

## Color Customization by Data Type

### 1. Numeric Data (LinePlot)
Use the \`color\` property in aggregateExpressionOptions:

\`\`\`typescript
{
    dataType: 'numeric',
    color: '#9D4EDD'  // Hex color string
}
\`\`\`

You can also use a **color function** for dynamic colors:
\`\`\`typescript
{
    dataType: 'numeric',
    color: (aggregateKey, splitBy) => {
        return splitBy === 'Station1' ? '#9D4EDD' : '#F72585';
    }
}
\`\`\`

### 2. Categorical Data (CategoricalPlot)
Use \`valueMapping\` to assign colors to each state:

\`\`\`typescript
{
    dataType: 'categorical',
    valueMapping: {
        'idle': { color: '#4CC9F0' },
        'running': { color: '#7209B7' },
        'maintenance': { color: '#FB8500' },
        'error': { color: '#B5179E' }
    }
}
\`\`\`

### 3. Events Data (EventsPlot)
Use \`valueMapping\` to assign colors to each event type:

\`\`\`typescript
{
    dataType: 'events',
    valueMapping: {
        'alert': { color: '#FB8500' },
        'warning': { color: '#F72585' },
        'info': { color: '#4CC9F0' },
        'critical': { color: '#B5179E' }
    }
}
\`\`\`

## Supported Color Formats

- **Hex**: \`'#9D4EDD'\`, \`'#F72585'\`
- **RGB**: \`'rgb(157, 78, 221)'\`
- **RGBA**: \`'rgba(157, 78, 221, 0.8)'\`
- **Named colors**: \`'purple'\`, \`'orange'\`, \`'teal'\`

## Creating Cohesive Themes

Define a color palette object for consistency across your visualization:

\`\`\`typescript
const brandColors = {
    primary: '#9D4EDD',
    secondary: '#F72585',
    accent: '#4CC9F0',
    warning: '#FB8500',
    error: '#B5179E'
};

// Use throughout your aggregateExpressionOptions
const options = [
    { color: brandColors.primary },
    { valueMapping: { state1: { color: brandColors.accent } } }
];
\`\`\`

This example uses a purple/pink color scheme to demonstrate customization across all data types.
                `
            }
        }
    }
};
