import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import GroupedBarChart from '../../packages/core/src/components/GroupedBarChart';
import { ChartOptions } from '../../packages/core/src/models/ChartOptions';


const meta: Meta<ChartOptions> = {
    title: 'Charts/BarChart/GroupedBarChart',
    component: 'BarChart',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
# GroupedBarChart Component

Interactive bar chart for visualizing categorical time series data with grouping and stacking capabilities. Ideal for comparing values across different series and time periods with the following features:

## Key Features
- **Grouped & Stacked Views**: Toggle between grouped and stacked bar layouts
- **Multiple Time Series**: Display multiple aggregates with different split-by values
- **Interactive Legend**: Click to show/hide series, hover for highlighting
- **Temporal Slider**: Navigate through different timestamps when multiple time periods are available
- **Tooltips**: Hover over bars to see detailed value information
- **Context Menus**: Right-click on bars for custom actions
- **Value Labels**: Aggregate names displayed below each bar group
- **Focus Indicators**: Visual feedback for mouseover interactions
- **Theme Support**: Light and dark theme compatibility
- **Responsive Design**: Automatically adjusts to container size

## Usage Example                

\`\`\`typescript
import TsiClient from 'tsichart-core';

// Create chart instance
const tsiClient = new TsiClient();
const chart = new tsiClient.ux.GroupedBarChart(containerElement);

// Prepare data in the expected format
const barChartData = [
    {
        "Factory1": {
            "": {
                "2023-01-01T00:00:00Z": {
                    "Production": 150.5,
                    "Quality": 95.2
                }
            },
            "LineA": {
                "2023-01-01T00:00:00Z": {
                    "Production": 75.3,
                    "Quality": 98.1
                }
            },
            "LineB": {
                "2023-01-01T00:00:00Z": {
                    "Production": 82.7,
                    "Quality": 92.5
                }
            }
        }
    },
    {
        "Factory2": {
            "": {
                "2023-01-01T00:00:00Z": {
                    "Production": 134.8,
                    "Quality": 89.7
                }
            }
        }
    }
];

// Render the chart
chart.render(barChartData, {
    theme: 'light',
    stacked: false,
    legend: 'shown',
    tooltip: true,
    zeroYAxis: true,
    timestamp: '2023-01-01T00:00:00Z',
    yAxisState: 'shared',
    grid: true
}, []);
\`\`\`

## Chart Options

- **stacked**: Toggle between grouped (false) and stacked (true) bar layout
- **legend**: Legend display mode ('shown', 'hidden', 'compact')
- **tooltip**: Enable/disable hover tooltips
- **zeroYAxis**: Force Y-axis to start from zero
- **timestamp**: Current timestamp to display (for temporal data)
- **yAxisState**: Y-axis configuration ('shared', 'stacked')
- **grid**: Show/hide grid lines
- **theme**: Visual theme ('light' or 'dark')
- **hideChartControlPanel**: Hide the chart control buttons

## Interactive Features

1. **Stack/Unstack Toggle**: Click the stack button in the control panel to switch between grouped and stacked views
2. **Legend Interaction**: Click legend items to show/hide series, hover for highlighting
3. **Bar Hover**: Hover over bars to see focus line and detailed tooltips
4. **Temporal Navigation**: Use the slider to navigate between different time periods
5. **Context Menus**: Right-click on bars for custom actions (if configured)
6. **Responsive Resizing**: Chart automatically adjusts to container size changes

## Data Format

Data should be provided as an array of aggregate objects, where each aggregate represents a time series with optional split-by values. Each measurement contains timestamped values for different measures.
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
        stacked: {
            control: 'boolean',
            description: 'Display bars in stacked layout instead of grouped',
            table: { defaultValue: { summary: 'false' } }
        },
        yAxisState: {
            control: { type: 'select' },
            options: ['shared', 'stacked'], 
        },
        legend: {
            control: { type: 'select' },
            options: ['shown', 'hidden', 'compact'],
            description: 'Legend display configuration',
            table: { defaultValue: { summary: 'shown' } }
        },
        tooltip: {
            control: 'boolean',
            description: 'Enable hover tooltips showing detailed values',
            table: { defaultValue: { summary: 'true' } }
        },
        zeroYAxis: {
            control: 'boolean',
            description: 'Force Y-axis to start from zero',
            table: { defaultValue: { summary: 'false' } }
        },
        grid: {
            control: 'boolean',
            description: 'Show grid lines for easier value reading',
            table: { defaultValue: { summary: 'true' } }
        },
        hideChartControlPanel: {
            control: 'boolean',
            description: 'Hide the chart control panel (stack/unstack button)',
            table: { defaultValue: { summary: 'false' } }
        },
        scaledToCurrentTime: {
            control: 'boolean',
            description: 'Scale the chart to current time context',
            table: { defaultValue: { summary: 'false' } }
        },
        keepSplitByColor: {
            control: 'boolean',
            description: 'Maintain consistent colors for split-by values across aggregates',
            table: { defaultValue: { summary: 'false' } }
        }
    }
};
export default meta;

type Story = StoryObj<GroupedBarChart>;

/**
 * Generate sample factory metrics data for demonstration.
 * Returns data in the format expected by GroupedBarChart.
 * 
 * Data structure:
 * - Array of aggregate objects
 * - Each aggregate has time series with split-by values
 * - Timestamped measurements with multiple measures
 */
function generateFactoryData() {
    const timestamps = [
        '2023-01-01T00:00:00Z',
        '2023-01-01T01:00:00Z',
        '2023-01-01T02:00:00Z',
        '2023-01-01T03:00:00Z'
    ];

    const factories = ['Factory A', 'Factory B', 'Factory C'];
    const productionLines = ['', 'Line 1', 'Line 2', 'Line 3'];
    
    return factories.map((factory, factoryIndex) => {
        const factoryData = {};
        factoryData[factory] = {};
        
        productionLines.forEach(line => {
            factoryData[factory][line] = {};
            
            timestamps.forEach(timestamp => {
                const baseProduction = 100 + factoryIndex * 20;
                const baseQuality = 85 + factoryIndex * 5;
                const lineMultiplier = line === '' ? 1 : 0.3 + (parseInt(line.split(' ')[1]) || 1) * 0.2;
                
                factoryData[factory][line][timestamp] = {
                    'Production': Math.round((baseProduction + Math.random() * 40 - 20) * lineMultiplier * 10) / 10,
                    'Quality': Math.round((baseQuality + Math.random() * 10 - 5) * 10) / 10,
                    'Efficiency': Math.round((80 + Math.random() * 20) * 10) / 10
                };
            });
        });
        
        return factoryData;
    });
}

/**
 * Generate sample data optimized for stacked bar visualization.
 * Creates data with better proportional relationships for stacking.
 * 
 * Data structure:
 * - Array of aggregate objects representing different production metrics
 * - Each aggregate has split-by values for different categories
 * - Values are designed to stack well visually
 */
function generateStackedFactoryData() {
    const timestamps = [
        '2023-01-01T00:00:00Z',
        '2023-01-01T01:00:00Z',
        '2023-01-01T02:00:00Z',
        '2023-01-01T03:00:00Z'
    ];
    const stages = ['Raw Materials', 'Manufacturing', 'Assembly', 'Packaging'];
    const lines = ['', 'Line A', 'Line B'];
    return stages.map((stage, stageIndex) => {
        const aggregateData = {};
        aggregateData[stage] = {};
        
        lines.forEach(line => {
            aggregateData[stage][line] = {};
            
            timestamps.forEach(timestamp => {
                // Progressive values for stacking visualization
                const baseValue = 30 + (stageIndex * 20); // Each stage builds on previous
                const variation = Math.floor(Math.random() * 10);
                const lineMultiplier = line === '' ? 1.0 : 
                                     line === 'Line A' ? 0.8 : 0.6;
                
                // Ensure positive, non-zero values for proper D3.js scale calculations
                const finalValue = Math.max(15, Math.round((baseValue + variation) * lineMultiplier));
                
                aggregateData[stage][line][timestamp] = {
                    // Use 'Production' measure name consistently across all data
                    'Production': finalValue,
                    // Add additional consistent measures for variety
                    'Quality': Math.max(70, Math.round(85 + Math.random() * 10)),
                    'Efficiency': Math.max(60, Math.round(75 + Math.random() * 15))
                };
            });
        });
        
        return aggregateData;
    });
}
/**
 * Generate comparison data for grouped bars showing different metrics.
 * Creates data that works well for both grouped and stacked visualization.
 */
function generateComparisonData() {
    const timestamps = [
        '2023-01-01T00:00:00Z',
        '2023-01-01T01:00:00Z',
        '2023-01-01T02:00:00Z',
        '2023-01-01T03:00:00Z'
    ];

    // Performance metrics for different departments
    const departments = ['Production', 'Quality', 'Maintenance', 'Logistics'];
    
    return departments.map((department, deptIndex) => {
        const deptData = {};
        deptData[department] = {};
        
        // Different performance categories
        const categories = ['', 'Target', 'Actual', 'Variance'];
        
        categories.forEach(category => {
            deptData[department][category] = {};
            
            timestamps.forEach((timestamp, timeIndex) => {
                let baseTarget, actualMultiplier, varianceBase;
                
                // Department-specific base values
                switch (department) {
                    case 'Production':
                        baseTarget = 100;
                        actualMultiplier = 0.85 + Math.random() * 0.3; // 85-115% of target
                        break;
                    case 'Quality':
                        baseTarget = 95;
                        actualMultiplier = 0.9 + Math.random() * 0.15; // 90-105% of target
                        break;
                    case 'Maintenance':
                        baseTarget = 80;
                        actualMultiplier = 0.75 + Math.random() * 0.4; // 75-115% of target
                        break;
                    case 'Logistics':
                        baseTarget = 90;
                        actualMultiplier = 0.8 + Math.random() * 0.35; // 80-115% of target
                        break;
                }
                
                const targetValue = baseTarget + timeIndex * 5; // Slight increase over time
                const actualValue = Math.round(targetValue * actualMultiplier);
                const variance = actualValue - targetValue;
                
                if (category === '' || category === 'Target') {
                    deptData[department][category][timestamp] = {
                        'Performance': targetValue,
                        'Efficiency': 85 + Math.random() * 15,
                        'Output': Math.round(targetValue * 1.2)
                    };
                } else if (category === 'Actual') {
                    deptData[department][category][timestamp] = {
                        'Performance': actualValue,
                        'Efficiency': Math.round((85 + Math.random() * 15) * actualMultiplier),
                        'Output': Math.round(actualValue * 1.2)
                    };
                } else if (category === 'Variance') {
                    deptData[department][category][timestamp] = {
                        'Performance': Math.abs(variance),
                        'Efficiency': Math.abs(Math.round(variance * 0.5)),
                        'Output': Math.abs(Math.round(variance * 1.2))
                    };
                }
            });
        });
        
        return deptData;
    });
}

// Function to render GroupedBarChart in a container
function renderBarChart(container: HTMLElement, options: any = {}) {
    container.innerHTML = '';
 try {
        console.log('Rendering GroupedBarChart with options:', options);

        // Create GroupedBarChart instance
        const chart = new GroupedBarChart(container);

        // Default options for the chart
        const chartOptions = {
            theme: options.theme || 'light',
            stacked: options.stacked || false,
            legend: options.legend || 'shown',
            tooltip: options.tooltip !== false,
            zeroYAxis: options.zeroYAxis || false,
            grid: options.grid !== false,
            hideChartControlPanel: options.hideChartControlPanel || false,
            scaledToCurrentTime: options.scaledToCurrentTime || false,
            keepSplitByColor: options.keepSplitByColor || false,
            suppressResizeListener: false,
            ...options
        };

        // Choose data generation based on whether it's stacked or not
        let factoryData;
        if (options.useComparison) {
            factoryData = generateComparisonData();
        } else if (options.stacked) {
            factoryData = generateStackedFactoryData();
            console.log(factoryData, "------")
        } else {
            factoryData = generateFactoryData();
        }

        if (!Array.isArray(factoryData) || factoryData.length === 0) {
            throw new Error('Invalid data format: Expected non-empty array of aggregates');
        }
        
        factoryData.forEach((aggregate, index) => {
            const aggKey = Object.keys(aggregate)[0];
            if (!aggKey) {
                throw new Error(`Invalid aggregate at index ${index}: Missing aggregate key`);
            }
            
            const splitBys = aggregate[aggKey];
            if (!splitBys || typeof splitBys !== 'object') {
                throw new Error(`Invalid aggregate ${aggKey}: Missing split-by data`);
            }
            
            // Validate each split-by has timestamp data
            Object.keys(splitBys).forEach(splitBy => {
                const timeData = splitBys[splitBy];
                if (!timeData || typeof timeData !== 'object') {
                    throw new Error(`Invalid split-by ${splitBy} in ${aggKey}: Missing time data`);
                }
                
                // Validate each timestamp has measure data
                Object.keys(timeData).forEach(timestamp => {
                    const measures = timeData[timestamp];
                    if (!measures || typeof measures !== 'object') {
                        throw new Error(`Invalid timestamp ${timestamp} in ${aggKey}/${splitBy}: Missing measures`);
                    }
                    
                    // Validate all measures are valid positive numbers
                    Object.keys(measures).forEach(measureName => {
                        const measureValue = measures[measureName];
                        if (typeof measureValue !== 'number' || isNaN(measureValue) || measureValue <= 0) {
                            console.error(`Fixing invalid measure ${measureName} in ${aggKey}/${splitBy}/${timestamp}: was ${measureValue}, setting to 1`);
                            // Fix invalid values to prevent NaN in D3.js calculations
                            measures[measureName] = 1;
                        }
                    });
                });
            });
        });
        chart.render(factoryData, chartOptions, []);

        return chart;
    } catch (error) {
        console.error('GroupedBarChart rendering error:', error);
        container.innerHTML = `<div style="color: red; padding: 20px; font-family: monospace;">
            <h3>Error rendering GroupedBarChart</h3>
            <p><strong>Error:</strong> ${error.message}</p>
            <p><small>Check browser console for more details</small></p>
            <details style="margin-top: 10px;">
                <summary>Stack Trace</summary>
                <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px;">
${error.stack}
                </pre>
            </details>
        </div>`;
    }
}

// Helper function to create a story with chart rendering
function createBarChartStory(containerStyle: string) {
    return (args: any) => {
        const chartId = 'bar-chart-' + Math.random().toString(36).substring(7);

        setTimeout(() => {
            const container = document.getElementById(chartId);
            if (container) {
                renderBarChart(container, args);
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
    name: 'Grouped Bars (Default)',
    args: {
        theme: 'light',
        stacked: false,
        legend: 'shown',
        tooltip: true,
        zeroYAxis: false,
        grid: true,
        hideChartControlPanel: false,
        scaledToCurrentTime: false,
        keepSplitByColor: false
    },
    render: createBarChartStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px;')
};

export const StackedBars: Story = {
    name: 'Stacked Bars',
    args: {
        theme: 'light',
        stacked: true,
        legend: 'shown',
        tooltip: true,
        zeroYAxis: true,
        grid: true,
        hideChartControlPanel: false,
        scaledToCurrentTime: false,
        keepSplitByColor: true,
    },
    render: createBarChartStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px;')
};


export const DarkTheme: Story = {
    name: 'Dark Theme',
    args: {
        theme: 'dark',
        stacked: false,
        legend: 'shown',
        tooltip: true,
        zeroYAxis: false,
        grid: true,
        hideChartControlPanel: false,
        scaledToCurrentTime: false,
        keepSplitByColor: false
    },
    render: createBarChartStory('height: 500px; width: 100%; background: #1a1a1a; border: 1px solid #444; border-radius: 4px;')
};

export const CompactLegend: Story = {
    name: 'Compact Legend',
    args: {
        theme: 'light',
        stacked: false,
        legend: 'compact',
        tooltip: true,
        zeroYAxis: false,
        grid: true,
        hideChartControlPanel: false,
        scaledToCurrentTime: false,
        keepSplitByColor: false
    },
    render: createBarChartStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px;')
};
