// stories/LineChartAdvanced.stories.ts
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ref, createRef } from 'lit/directives/ref.js';
import LineChart from '../packages/core/src/components/LineChart/LineChart';

// Generate more complex sample data for advanced examples
function generateAdvancedSampleData() {
    const data: any[] = [];
    const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

    // Generate data for different scenarios
    const scenarios = [
        { name: 'Production', baseValue: 100, variance: 20, trend: 0.1 },
        { name: 'Quality', baseValue: 85, variance: 15, trend: -0.05 },
        { name: 'Efficiency', baseValue: 75, variance: 25, trend: 0.15 }
    ];

    scenarios.forEach((scenario, i) => {
        const lines: any = {};
        const scenarioData: any = {};
        scenarioData[scenario.name] = lines;
        data.push(scenarioData);

        // Multiple machines per scenario
        for (let j = 0; j < 4; j++) {
            const values: any = {};
            lines[`Machine${j + 1}`] = values;

            // Generate hourly data for the last week
            for (let k = 0; k < 24 * 7; k++) {
                const timestamp = new Date(from.getTime() + k * 60 * 60 * 1000);

                // Add trends, cycles, and random variation
                const timeProgress = k / (24 * 7);
                const dailyCycle = Math.sin((k % 24) / 24 * 2 * Math.PI) * 10;
                const weeklyTrend = scenario.trend * timeProgress * 50;
                const randomVariation = (Math.random() - 0.5) * scenario.variance;

                const value = scenario.baseValue +
                    dailyCycle +
                    weeklyTrend +
                    randomVariation +
                    (j * 5); // Machine offset

                values[timestamp.toISOString()] = {
                    value: Math.max(0, parseFloat(value.toFixed(2))),
                    min: Math.max(0, parseFloat((value - 5).toFixed(2))),
                    max: parseFloat((value + 5).toFixed(2))
                };
            }
        }
    });

    return data;
}

// Function to render LineChart with advanced options
function renderAdvancedLineChart(container: HTMLElement, options: any = {}) {
    container.innerHTML = '';

    try {
        const chart = new LineChart(container);

        const chartOptions = {
            theme: options.theme || 'light',
            legend: options.legend || 'shown',
            grid: options.grid !== false,
            tooltip: options.tooltip !== false,
            yAxisState: options.yAxisState || 'shared',
            interpolationFunction: options.interpolationFunction || 'curveMonotoneX',
            includeEnvelope: options.includeEnvelope || false,
            snapBrush: options.snapBrush || false,
            minBrushWidth: options.minBrushWidth || 10,
            is24HourTime: true,
            offset: 'Local',
            zeroYAxis: options.zeroYAxis || false,
            brushContextMenuActions: [],
            ...options
        };

        const sampleData = generateAdvancedSampleData();
        chart.render(sampleData, chartOptions, {});

        return chart;
    } catch (error) {
        container.innerHTML = `<div style="color: red; padding: 20px;">
            Error rendering Advanced LineChart: ${error.message}
            <br><small>Check console for details</small>
        </div>`;
        console.error('Advanced LineChart rendering error:', error);
    }
}

const meta: Meta = {
    title: 'Charts/LineChart Advanced',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
# Advanced LineChart Examples

This section demonstrates advanced features and configurations of the LineChart component.

## Advanced Features Showcased

### Multi-Series Management
- **Shared Y-Axis**: All series share the same Y-axis scale
- **Overlapping Y-Axis**: Multiple Y-axes for different value ranges  
- **Stacked Display**: Series stacked vertically

### Interactive Features
- **Brush Selection**: Drag to select time ranges
- **Sticky Series**: Click to focus on specific series
- **Markers**: Add custom time markers
- **Context Menus**: Right-click for additional options

### Data Visualization
- **Envelopes**: Show min/max ranges around values
- **Interpolation**: Different curve types (linear, monotone, step)
- **Responsive Legends**: Compact, shown, or hidden modes
                `
            }
        }
    },
    argTypes: {
        theme: {
            control: { type: 'select' },
            options: ['light', 'dark'],
            description: 'Visual theme'
        },
        yAxisState: {
            control: { type: 'select' },
            options: ['shared', 'stacked', 'overlap'],
            description: 'Y-axis configuration for multiple series'
        },
        legend: {
            control: { type: 'select' },
            options: ['shown', 'hidden', 'compact'],
            description: 'Legend display mode'
        },
        interpolationFunction: {
            control: { type: 'select' },
            options: ['curveLinear', 'curveMonotoneX', 'curveStep', 'curveStepBefore', 'curveStepAfter'],
            description: 'Line interpolation method'
        },
        includeEnvelope: {
            control: 'boolean',
            description: 'Show min/max envelope around values'
        },
        snapBrush: {
            control: 'boolean',
            description: 'Snap brush selection to data points'
        },
        minBrushWidth: {
            control: { type: 'range', min: 0, max: 50, step: 1 },
            description: 'Minimum brush selection width in pixels'
        },
        zeroYAxis: {
            control: 'boolean',
            description: 'Force Y-axis to include zero'
        },
        brushHandlesVisible: {
            control: 'boolean',
            description: 'Enable/disable brushing for zooming'
        },
        color: {
            control: 'color',
            description: 'Base color for the selection/highlight'
        },
        isArea: {
            control: 'boolean',
            description: 'Render lines as filled areas'
        }
    }
};

export default meta;
type Story = StoryObj;

export const SharedYAxis: Story = {
    args: {
        theme: 'light',
        yAxisState: 'shared',
        legend: 'shown',
        interpolationFunction: 'curveMonotoneX',
        includeEnvelope: false,
        snapBrush: false,
        minBrushWidth: 10,
        zeroYAxis: false,
        tooltip: true,
        brushHandlesVisible: false,
        color: 'blue',
        isArea: false
    },
    render: (args) => {
        const containerRef = createRef<HTMLDivElement>();

        setTimeout(() => {
            if (containerRef.value) {
                renderAdvancedLineChart(containerRef.value, args);
            }
        }, 100);

        return html`
            <div style="height: 600px; width: 100%; border: 1px solid #ddd; border-radius: 4px;">
                <div 
                    ${ref(containerRef)}
                    style="height: 100%; width: 100%;"
                ></div>
            </div>
        `;
    }
};

export const OverlappingAxes: Story = {
    args: {
        theme: 'light',
        yAxisState: 'overlap',
        legend: 'shown',
        interpolationFunction: 'curveMonotoneX',
        includeEnvelope: false,
        snapBrush: true,
        minBrushWidth: 15,
        zeroYAxis: false,
        tooltip: true,
        brushHandlesVisible: false,
        color: 'blue',
        isArea: false
    },
    render: (args) => {
        const containerRef = createRef<HTMLDivElement>();

        setTimeout(() => {
            if (containerRef.value) {
                renderAdvancedLineChart(containerRef.value, args);
            }
        }, 100);

        return html`
            <div style="height: 600px; width: 100%; border: 1px solid #ddd; border-radius: 4px;">
                <div 
                    ${ref(containerRef)}
                    style="height: 100%; width: 100%;"
                ></div>
            </div>
        `;
    }
};

export const WithEnvelopes: Story = {
    args: {
        theme: 'light',
        yAxisState: 'shared',
        legend: 'compact',
        interpolationFunction: 'curveMonotoneX',
        includeEnvelope: true,
        snapBrush: false,
        minBrushWidth: 10,
        zeroYAxis: true,
        tooltip: true,
        brushHandlesVisible: false,
        color: 'blue',
        isArea: false
    },
    render: (args) => {
        const containerRef = createRef<HTMLDivElement>();

        setTimeout(() => {
            if (containerRef.value) {
                renderAdvancedLineChart(containerRef.value, args);
            }
        }, 100);

        return html`
            <div style="height: 600px; width: 100%; border: 1px solid #ddd; border-radius: 4px;">
                <div 
                    ${ref(containerRef)}
                    style="height: 100%; width: 100%;"
                ></div>
            </div>
        `;
    }
};

export const DarkThemeAdvanced: Story = {
    args: {
        theme: 'dark',
        yAxisState: 'stacked',
        legend: 'shown',
        interpolationFunction: 'curveStep',
        includeEnvelope: false,
        snapBrush: true,
        minBrushWidth: 20,
        zeroYAxis: false,
        tooltip: true,
        brushHandlesVisible: false,
        color: 'blue',
        isArea: false
    },
    render: (args) => {
        const containerRef = createRef<HTMLDivElement>();

        setTimeout(() => {
            if (containerRef.value) {
                renderAdvancedLineChart(containerRef.value, args);
            }
        }, 100);

        return html`
            <div style="height: 600px; width: 100%; background: #1a1a1a; border: 1px solid #444; border-radius: 4px;">
                <div 
                    ${ref(containerRef)}
                    style="height: 100%; width: 100%;"
                ></div>
            </div>
        `;
    }
};

export const CompactLayout: Story = {
    args: {
        theme: 'light',
        yAxisState: 'shared',
        legend: 'compact',
        interpolationFunction: 'curveLinear',
        includeEnvelope: false,
        snapBrush: false,
        minBrushWidth: 5,
        zeroYAxis: true,
        tooltip: true,
        brushHandlesVisible: false,
        color: 'blue',
        isArea: false
    },
    render: (args) => {
        const containerRef = createRef<HTMLDivElement>();

        setTimeout(() => {
            if (containerRef.value) {
                renderAdvancedLineChart(containerRef.value, args);
            }
        }, 100);

        return html`
            <div style="height: 350px; width: 100%; border: 1px solid #ddd; border-radius: 4px;">
                <div 
                    ${ref(containerRef)}
                    style="height: 100%; width: 100%;"
                ></div>
            </div>
        `;
    }
};
