import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import Grid from "../../packages/core/src/components/Grid/Grid";
import { ChartOptions } from '../../packages/core/src/models/ChartOptions';
import { ChartComponentData } from '../../packages/core/src/models/ChartComponentData';
import { fireEvent, screen, within, waitFor } from 'storybook/test';
import { all } from "awesomplete";

const meta: Meta<ChartOptions> = {
    title: "Components/Grid",
    component: "Grid",
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
# Grid Component

Interactive data grid for displaying time series data in tabular format with the following features:

## Key Features
- **Tabular Data Display**: Show time series data in rows and columns following **D3.js patterns**
- **Keyboard Navigation**: Navigate cells using arrow keys for accessibility
- **Time Filtering**: Display data within specific time ranges following **internal state management**
- **Multiple Measures**: Display multiple metrics per time point in grid cells
- **Responsive Layout**: Automatically adjusts to container size following **component-based architecture**
- **Close Button**: Can be closed when displayed from charts following **monolithic component** patterns

## Usage Example

\`\`\`typescript
import { Grid } from 'tsichart-core';

// Create grid instance using class-based inheritance
const grid = new Grid(containerElement);

// Prepare data in expected format following internal state management
const data = [
    {
        "__tsiLabel__": "SensorA: Room1",
        "__tsiColor__": "#1f77b4", 
        "__tsiAggIndex__": 0,
        "2023-01-01T00:00:00Z": { temperature: 22.5, humidity: 45, pressure: 1013 },
        "2023-01-01T01:00:00Z": { temperature: 23.1, humidity: 43, pressure: 1012 }
    }
];

// Render the grid following component patterns
grid.render(data, {
    theme: 'light',
    fromChart: false,
    dateLocale: 'en-US',
    offset: 'Local'
}, {});
\`\`\`

## Static Methods

The Grid component provides static methods following **monolithic component** patterns:

- \`Grid.showGrid()\` - Display grid overlay on chart
- \`Grid.hideGrid()\` - Hide grid overlay
- \`Grid.createGridEllipsisOption()\` - Create ellipsis menu option for charts
                `
            }
        }
    },
    argTypes: {
        theme: {
            control: { type: 'select' },
            options: ['light', 'dark'],
            description: 'Visual theme for the grid following D3.js patterns'
        },
        fromChart: {
            control: 'boolean',
            description: 'Whether grid is displayed from a chart (shows close button)',
            table: { defaultValue: { summary: 'false' } }
        },
        offset: {
            control: { type: 'select' },
            options: ['Local', 'UTC'],
            description: 'Timezone offset for date formatting following internal state management',
            table: { defaultValue: { summary: 'Local' } }
        },
        dateLocale: {
            control: 'text',
            description: 'Locale for date formatting (e.g., "en-US", "de-DE")',
            table: { defaultValue: { summary: 'en-US' } }
        }
    },
    args: {
        theme: 'light',
        fromChart: false,
        offset: 'Local',
        dateLocale: 'en-US'
    }
}

export default meta;
type Story = StoryObj<ChartOptions>;

// const from = new Date(Date.now() - 12 * 60 * 60 * 1000);
// const timestamps = [];
// for (let hour = 0; hour < 12; hour++) {
//     timestamps.push(new Date(from.getTime() + hour * 3600 * 1000).toISOString());
// }

function generateSampleGridData() {
    const from = new Date(Date.UTC(2025, 10, 25, 6, 0, 0)); // Nov 25, 2025, 06:00:00 UTC
    const timestamps: string[] = [];
    for (let hour = 0; hour < 12; hour++) {
        timestamps.push(new Date(from.getTime() + hour * 3600 * 1000).toISOString());
    }
    timestamps.reverse();
    const data = [];
    for (let sensorIndex = 0; sensorIndex < 3; sensorIndex++) {
        for (let roomIndex = 0; roomIndex < 2; roomIndex++) {
            const sensorName = `Sensor${String.fromCharCode(65 + sensorIndex)}`;
            const roomName = `Room${roomIndex + 1}`;
            const rowData: any = {
                "__tsiLabel__": `${sensorName}: ${roomName}`,
                "__tsiColor__": ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"][sensorIndex * 2 + roomIndex],
                "__tsiAggIndex__": sensorIndex * 2 + roomIndex
            };
            timestamps.forEach(ts => {
                const base = 20 + sensorIndex * 2 + roomIndex * 1;
                rowData[ts] = {
                    temperature: parseFloat((base + Math.random() * 2).toFixed(1))
                };
            });
            data.push(rowData);
        }
    }
    return { data, timestamps };
}

function renderGrid(container: HTMLElement, options: any = {}) {
    container.innerHTML = '';
    try {
        const grid = new Grid(container);
        grid.usesSeconds = false;
        grid.usesMillis = false;
        const { data: sampleData, timestamps: allTimestamps } = generateSampleGridData();

        const chartComponentData = new ChartComponentData();
        chartComponentData.allTimestampsArray = allTimestamps;
        chartComponentData.timeArrays = {};
        chartComponentData.displayState = {};
        const aggregateExpressionOptions: any[] = [];
        // --- FIX ---
        sampleData.forEach(row => {
            const aggKey = row.__tsiLabel__;
            chartComponentData.timeArrays[aggKey] = {};
            chartComponentData.displayState[aggKey] = {
                name: aggKey,
                color: row.__tsiColor__,
                visible: true,
                splitBys: {}
            };

            const splitByKey = 'default';
            chartComponentData.timeArrays[aggKey][splitByKey] = allTimestamps.map(ts => ({
                dateTime: new Date(ts),
                measures: { temperature: row[ts]?.temperature ?? null }
            }));
            chartComponentData.displayState[aggKey].splitBys[splitByKey] = {
                visible: true,
                types: ['temperature'],
                visibleType: 'temperature'
            };
            aggregateExpressionOptions.push({
                aggKey,
                color: row.__tsiColor__,
                alias: aggKey,
                splitBy: splitByKey,
                measureTypes: ['temperature'],
                visible: false
            });
        });
        const gridOptions = {
            theme: options.theme || 'light',
            offset: options.offset || 'Local',
            dateLocale: options.dateLocale || 'en-US',
            spMeasures: ['temperature'],
            fromChart: options.fromChart || false,
        };
        grid.render(sampleData, gridOptions, aggregateExpressionOptions, chartComponentData);
        return grid;
    } catch (error: any) {
        console.error('Grid rendering error:', error);
        container.innerHTML = `<div style="color:red;padding:20px;">${error.message}</div>`;
    }
}

function createGridStory(containerStyle: string) {
    return (args: any) => {
        const gridId = 'grid-' + Math.random().toString(36).substring(7);
        let currentGrid = null;
        const updateGrid = () => {
            const container = document.getElementById(gridId);
            if (container) {

                if (currentGrid) {
                    container.innerHTML = '';
                }
                currentGrid = renderGrid(container, args);
            }
        };

        setTimeout(updateGrid, 100);

        const checkAndRerender = async () => {
            const container = document.getElementById(gridId);
            if (container && container.innerHTML.trim() === '') {

                await updateGrid();
            }
        };

        const intervalId = setInterval(() => checkAndRerender(), 500);

        setTimeout(() => {
            clearInterval(intervalId);
        }, 30000);

        return html`
            <div style="${containerStyle}">
                <div id="${gridId}" style="height: 100%; width: 100%;"></div>
            </div>
        `;
    };
}

export const Default: Story = {
    name: 'Basic Grid (Light Theme)',
    args: {
        theme: 'light',
        fromChart: false,
        offset: 'Local',
        dateLocale: 'en-US'
    },
    render: createGridStory('height: 400px; width: 100%; border: 1px solid #ddd; border-radius: 4px; overflow: auto;')
};

export const DarkTheme: Story = {
    name: 'Dark Theme',
    args: {
        theme: 'dark',
        fromChart: false,
        offset: 'Local',
        dateLocale: 'en-US'
    },
    render: createGridStory('height: 400px; width: 100%; background: #1a1a1a; border: 1px solid #444; border-radius: 4px; overflow: auto;')
};

export const FromChart: Story = {
    name: 'Grid from Chart (with Close Button)',
    args: {
        theme: 'light',
        fromChart: true,
        offset: 'Local',
        dateLocale: 'en-US'
    },
    render: createGridStory('height: 400px; width: 100%; border: 1px solid #ddd; border-radius: 4px; overflow: auto; position: relative;')
};

export const UTCTimeZone: Story = {
    name: 'UTC Timezone',
    args: {
        theme: 'light',
        fromChart: false,
        offset: 'UTC',
        dateLocale: 'en-US'
    },
    render: createGridStory('height: 400px; width: 100%; border: 1px solid #ddd; border-radius: 4px; overflow: auto;')
};

export const GermanLocale: Story = {
    name: 'German Locale (de-DE)',
    args: {
        theme: 'light',
        fromChart: false,
        offset: 'Local',
        dateLocale: 'de-DE'
    },
    render: createGridStory('height: 400px; width: 100%; border: 1px solid #ddd; border-radius: 4px; overflow: auto;')
};

export const Interactive: Story = {
    name: 'Interaction Tests',
    args: {
        theme: 'light',
        fromChart: true,
        offset: 'Local',
        dateLocale: 'en-US'
    },
    render: createGridStory('height: 400px; width: 100%; border: 1px solid #ddd; border-radius: 4px; overflow: auto; position: relative;'),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(() => canvas.getByRole('table'), { timeout: 5000 });
        const gridTable = canvas.getByRole('table');

        const firstDataCell = within(gridTable).getAllByRole('cell')[1];
        if (firstDataCell) {
            fireEvent.click(firstDataCell);
            fireEvent.keyDown(firstDataCell, { key: 'ArrowRight', keyCode: 39 });
            fireEvent.keyDown(firstDataCell, { key: 'ArrowDown', keyCode: 40 });
        }

        const closeButton = canvas.queryByLabelText(/close grid/i);
        if (closeButton) {
            await waitFor(() => {
                if (!closeButton || closeButton.style.display === 'none') {
                    throw new Error("Close button should be visible when fromChart is true");
                }
            });
            if (firstDataCell) {
                fireEvent.keyDown(firstDataCell, { key: 'Tab', keyCode: 9 });
                await waitFor(() => {
                    if (document.activeElement !== closeButton) {
                        throw new Error("Tab navigation should focus on close button");
                    }
                });
            }
        }
        const dataCells = within(gridTable).getAllByRole('cell');
        const cellWithData = dataCells.find(cell =>
            cell.textContent && cell.textContent.trim() && !cell.textContent.includes('Sensor')
        );

        if (cellWithData) {
            await waitFor(() => {
                const cellText = cellWithData.textContent || '';
                const hasNumericContent = /\d+\.?\d*/.test(cellText);
                if (!hasNumericContent) {
                    throw new Error("Grid cells should contain numeric sensor data");
                }
            });
        }
        const headerCells = within(gridTable).getAllByRole('columnheader');
        if (headerCells.length > 0) {
            const headerWithTime = headerCells.find(header =>
                header.textContent && /\d{1,2}:\d{2}/.test(header.textContent)
            );

            await waitFor(() => {
                if (!headerWithTime) {
                    throw new Error("Grid headers should contain formatted timestamps");
                }
            });
        }
        const cellsWithAriaLabels = within(gridTable).getAllByRole('cell').filter(cell =>
            cell.getAttribute('aria-label')
        );

        await waitFor(() => {
            if (cellsWithAriaLabels.length === 0) {
                throw new Error("Grid cells should have accessibility labels");
            }
        });
    }
};

export const StaticGridMethods: Story = {
    name: 'Static Methods Demo',
    args: {
        theme: 'light',
        fromChart: false,
        offset: 'Local',
        dateLocale: 'en-US'
    },
    render: (args: any) => {
        const demoId = 'static-demo-' + Math.random().toString(36).substring(7);

        setTimeout(() => {
            const container = document.getElementById(demoId);
            if (container) {
                container.innerHTML = `
                    <div style="padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
                        <h3>Grid Static Methods Demo</h3>
                        <p>This demonstrates the static methods available on the Grid component using <strong>component-based architecture</strong>:</p>
                        
                        <div style="background: #f5f5f5; padding: 15px; border-radius: 4px; margin: 10px 0;">
                            <h4>Available Static Methods:</h4>
                            <ul>
                                <li><code>Grid.showGrid(renderTarget, chartOptions, aggregateExpressionOptions, chartComponentData)</code></li>
                                <li><code>Grid.hideGrid(renderTarget)</code></li>
                                <li><code>Grid.createGridEllipsisOption(renderTarget, chartOptions, aggregateExpressionOptions, chartComponentData, labelText)</code></li>
                            </ul>
                        </div>
                        
                        <div style="background: #e8f4f8; padding: 15px; border-radius: 4px; margin: 10px 0;">
                            <h4>Usage in Charts using <strong>D3.js patterns</strong>:</h4>
                            <p>These static methods are typically used by LineChart and other chart components to add grid functionality to their ellipsis menus.</p>
                        </div>
                        
                        <div style="background: #fff3cd; padding: 15px; border-radius: 4px; margin: 10px 0;">
                            <h4>Integration Pattern using <strong>internal state management</strong>:</h4>
                            <p>Charts can call <code>Grid.createGridEllipsisOption()</code> to add a "Display Grid" option to their control panels, providing seamless data table views.</p>
                        </div>
                        
                        <div style="background: #f0f8ff; padding: 15px; border-radius: 4px; margin: 10px 0;">
                            <h4>Data Format Requirements using <strong>class-based inheritance</strong>:</h4>
                            <p>The Grid component expects data as an array of objects where each timestamp is a property, with special keys:</p>
                            <ul>
                                <li><code>__tsiLabel__</code> - Row label (series name)</li>
                                <li><code>__tsiColor__</code> - Row color (optional)</li>
                                <li><code>__tsiAggIndex__</code> - Aggregation index (optional)</li>
                            </ul>
                        </div>
                    </div>
                `;
            }
        }, 100);

        return html`
            <div style="height: 400px; width: 100%; border: 1px solid #ddd; border-radius: 4px;">
                <div id="${demoId}" style="height: 100%; width: 100%;"></div>
            </div>
        `;
    }
};






























