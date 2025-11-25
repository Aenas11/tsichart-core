import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import EventsTable from "../../packages/core/src/components/EventsTable/EventsTable";
import { fireEvent, screen, within, waitFor, expect } from 'storybook/test';


interface EventTableOptions extends Record<string, any> {
    theme: 'light' | 'dark';
    is24HourTime: boolean;
    dateLocale: string;
    offset: 'Local' | 'UTC';
    timeSeriesIdProperties?: string[];
}

const meta: Meta<EventTableOptions> = {
    title: "Components/EventsTable",
    component: "EventsTable",
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component: `
# EventsTable Component

Interactive table for displaying time series event data with the following features:

## Key Features
- **Sortable Columns**: Click column headers to sort data following **D3.js patterns**
- **Column Filtering**: Toggle column visibility with checkboxes following **component-based architecture**
- **Infinite Scroll**: Automatically loads more data as you scroll following **internal state management**
- **CSV Download**: Export filtered data to CSV format
- **Time Series ID Support**: Special handling for TSID properties with type indicators
- **Theming**: Support for light and dark themes following **monolithic component** patterns
- **Responsive Layout**: Automatically adjusts to container size

## Usage Example

\`\`\`typescript
import { EventsTable } from 'tsichart-core';

// Create EventsTable instance using class-based inheritance
const eventsTable = new EventsTable(containerElement);

// Prepare event data in expected format following internal state management
const eventData = [
    {
        "timestamp": "2023-01-01T00:00:00Z",
        "deviceId": "sensor-001",
        "temperature": 22.5,
        "humidity": 45.2,
        "status": "normal"
    }
];

// Render the table following component patterns
eventsTable.render(eventData, {
    theme: 'light',
    is24HourTime: true,
    dateLocale: 'en-US',
    offset: 'Local',
    timeSeriesIdProperties: ['deviceId']
}, false);
\`\`\`

## Data Format

The EventsTable expects an array of event objects where each event contains:
- **timestamp**: ISO 8601 formatted date string (for standard format)
- **$ts**: ISO 8601 formatted date string (for TSX format)
- **Additional Properties**: Any number of additional properties with various data types (string, number, boolean, object)
- **Time Series ID Properties**: Properties that identify unique time series (configured via timeSeriesIdProperties option)

                `
            }
        }
    },
    argTypes: {
        theme: {
            control: { type: 'select' },
            options: ['light', 'dark'],
            description: 'Visual theme for the table following D3.js patterns'
        },
        is24HourTime: {
            control: 'boolean',
            description: 'Use 24-hour time format for timestamps',
            table: { defaultValue: { summary: 'true' } }
        },
        dateLocale: {
            control: 'text',
            description: 'Locale for date formatting (e.g., "en-US", "de-DE")',
            table: { defaultValue: { summary: 'en-US' } }
        },
        offset: {
            control: { type: 'select' },
            options: ['Local', 'UTC'],
            description: 'Timezone offset for date formatting following internal state management',
            table: { defaultValue: { summary: 'Local' } }
        },
        timeSeriesIdProperties: {
            control: { type: 'object' },
            description: 'Array of property names that identify unique time series',
            table: { defaultValue: { summary: '[]' } }
        }
    },
    args: {
        theme: 'light',
        is24HourTime: true,
        dateLocale: 'en-US',
        offset: 'Local',
        timeSeriesIdProperties: ['deviceId'],
    }
}

export default meta;
type Story = StoryObj<EventTableOptions>;

function generateSampleEventData() {
    return Array.from({ length: 150 }, (_, i) => {
        const ts = new Date(Date.now() - i * 2 * 60 * 60 * 1000).toISOString();
        return {
            timestamp: ts,
            deviceId: `sensor-00${(i % 3) + 1}`,
            temperature: Number((22 + Math.random() * 10).toFixed(2)),
            humidity: Number((45 + Math.random() * 20).toFixed(1)),
            status: i % 10 === 0 ? "error" : i % 15 === 0 ? "warning" : "normal",
        };
    });
}


function renderTable(el: HTMLElement, options: EventTableOptions = {} as EventTableOptions) {
    const table = new EventsTable(el);
    const data = generateSampleEventData();
    table.render(data, options, false);
}

function createStory(containerStyle: string) {
    return (args: EventTableOptions) => {
        const tableId = `table-${Math.random().toString(36).substring(2)}`;

        setTimeout(() => {
            const container = document.getElementById(tableId);
            if (container) renderTable(container, args);
        }, 100);

        return html`
            <div style="${containerStyle}">
                <div id="${tableId}" style="width:100%;height:100%;"></div>
            </div>
        `;
    };
}



export const Default: Story = {
    name: 'Basic EventsTable (Light Theme)',
    args: {
        theme: 'light',
        timeSeriesIdProperties: ['deviceId']
    },
    render: createStory('height:600px;width:100%;border:1px solid #ddd;border-radius:4px;overflow:hidden;')
};

export const DarkTheme: Story = {
    name: 'Dark Theme',
    args: {
        theme: 'dark',
        is24HourTime: true,
        dateLocale: 'en-US',
        offset: 'Local',
        timeSeriesIdProperties: ['deviceId']
    },
    render: createStory('height:600px;width:100%;background:#1a1a1a;border:1px solid #444;border-radius:4px;overflow:hidden;')
};


export const TwelveHourTime: Story = {
    name: '12-Hour Time Format',
    args: {
        theme: 'light',
        is24HourTime: false,
        dateLocale: 'en-US',
        offset: 'Local',
        timeSeriesIdProperties: ['deviceId']
    },
    render: createStory('height:600px;width:100%;border:1px solid #ddd;border-radius:4px;overflow:hidden;')
};

export const UTCTimeZone: Story = {
    name: 'UTC Timezone',
    args: {
        theme: 'light',
        is24HourTime: true,
        dateLocale: 'en-US',
        offset: 'UTC',
        timeSeriesIdProperties: ['deviceId']
    },
    render: createStory('height: 600px; width: 100%; border: 1px solid #ddd; border-radius: 4px; overflow: hidden;')
};

export const GermanLocale: Story = {
    name: 'German Locale (de-DE)',
    args: {
        theme: 'light',
        is24HourTime: true,
        dateLocale: 'de-DE',
        offset: 'Local',
        timeSeriesIdProperties: ['deviceId']
    },
    render: createStory('height:600px;width:100%;border:1px solid #ddd;border-radius:4px;overflow:hidden;')
};

export const MultipleTimeSeriesIds: Story = {
    name: 'Multiple Time Series ID Properties',
    args: {
        theme: 'light',
        is24HourTime: true,
        dateLocale: 'en-US',
        offset: 'Local',
        timeSeriesIdProperties: ['deviceId', 'location']
    },
    render: createStory('height:600px;width:100%;border:1px solid #ddd;border-radius:4px;overflow:hidden;')
};


export const Interactive: Story = {
    name: 'Interaction Tests',
    args: {
        theme: 'light',
        is24HourTime: true,
        dateLocale: 'en-US',
        offset: 'Local',
        timeSeriesIdProperties: ['deviceId']
    },
    render: createStory('height:600px;width:100%;border:1px solid #ddd;border-radius:4px;overflow:hidden;'),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(() => expect(canvas.getByRole('table')).toBeInTheDocument(), { timeout: 10000 });

        fireEvent.click(canvas.getByRole('button', { name: /timestamp/i }));
        await waitFor(() => expect(canvas.container.querySelector('.tsi-columnSortIcon.down')).toBeInTheDocument());

        fireEvent.click(canvas.getByRole('button', { name: /temperature/i }));
        await waitFor(() => expect(canvas.queryByText('temperature')).not.toBeVisible());

        const scrollArea = canvas.container.querySelector('.tsi-eventRowsContainer')!;
        const before = scrollArea.querySelectorAll('.tsi-eventRow').length;
        fireEvent.scroll(scrollArea, { target: { scrollTop: scrollArea.scrollHeight } });
        await waitFor(() => expect(scrollArea.querySelectorAll('.tsi-eventRow').length).toBeGreaterThan(before));
    }
};

export const FromTSXFormat: Story = {
    name: 'TSX Event Data Format',
    args: {
        theme: 'light',
        is24HourTime: true,
        dateLocale: 'en-US',
        offset: 'Local',
        timeSeriesIdProperties: ['deviceId']
    },
    render: (args: EventTableOptions) => {
        const id = `tsx-${Math.random().toString(36).substring(2)}`;
        setTimeout(() => {
            const el = document.getElementById(id);
            if (!el) return;
            const table = new EventsTable(el);
            const typedData = generateSampleEventData().map(e => ({
                $ts: e.timestamp,
                deviceId: e.deviceId,
                temperature: e.temperature,
                humidity: e.humidity,
                status: e.status,
            }));
            table.render(typedData, args, true);
        }, 100);

        return html`
            <div style="height: 600px; width: 100%; border: 1px solid #ddd; border-radius: 4px; overflow: hidden;">
                <div id="${id}" style="height: 100%; width: 100%;"></div>
            </div>
        `;
    }
};


export const DocumentationDemo: Story = {
    name: 'Usage Documentation',
    args: {
        theme: 'light',
        is24HourTime: true,
        dateLocale: 'en-US',
        offset: 'Local',
        timeSeriesIdProperties: ['deviceId']
    },
    render: (args: EventTableOptions) => {
        const demoId = 'events-docs-' + Math.random().toString(36).substring(7);

        setTimeout(() => {
            const container = document.getElementById(demoId);
            if (container) {
                container.innerHTML = `
                    <div style="padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
                        <h3>EventsTable Component Documentation</h3>
                        <p>The EventsTable component provides a rich interface for viewing and interacting with time series event data using <strong>component-based architecture</strong>:</p>
                        
                        <div style="background: #f5f5f5; padding: 15px; border-radius: 4px; margin: 10px 0;">
                            <h4>Core Features using <strong>D3.js patterns</strong>:</h4>
                            <ul>
                                <li><strong>Column Sorting</strong>: Click any column header to sort data ascending/descending</li>
                                <li><strong>Column Filtering</strong>: Use checkboxes in the legend to show/hide columns</li>
                                <li><strong>Infinite Scroll</strong>: Automatically loads more rows as you scroll down</li>
                                <li><strong>CSV Export</strong>: Download visible data as CSV file</li>
                                <li><strong>Time Series ID Support</strong>: Special indicators for TSID properties</li>
                            </ul>
                        </div>
                        
                        <div style="background: #e8f4f8; padding: 15px; border-radius: 4px; margin: 10px 0;">
                            <h4>Data Format Requirements using <strong>internal state management</strong>:</h4>
                            <p>EventsTable accepts two data formats:</p>
                            <h5>1. Standard Format:</h5>
                            <pre style="background: white; padding: 10px; border-radius: 4px; overflow-x: auto;"><code>[
                                {
                                    "timestamp": "2023-01-01T00:00:00Z",
                                    "deviceId": "sensor-001", 
                                    "temperature": 22.5,
                                    "status": "normal"
                                    }
                                ]</code></pre>
                            <h5>2. TSX Format (using renderFromEventsTsx):</h5>
                            <pre style="background: white; padding: 10px; border-radius: 4px; overflow-x: auto;"><code>[
  {
    "$ts": "2023-01-01T00:00:00Z",
    "deviceId": "sensor-001",
    "temperature": { "Double": 22.5 },
    "status": { "String": "normal" }
  }
]</code></pre>
                        </div>
                        
                        <div style="background: #fff3cd; padding: 15px; border-radius: 4px; margin: 10px 0;">
                            <h4>Configuration Options using <strong>monolithic component</strong> patterns:</h4>
                            <ul>
                                <li><code>theme</code>: 'light' | 'dark' - Visual theme</li>
                                <li><code>is24HourTime</code>: boolean - Time format for timestamps</li>
                                <li><code>dateLocale</code>: string - Locale for date formatting</li>
                                <li><code>offset</code>: 'Local' | 'UTC' - Timezone handling</li>
                                <li><code>timeSeriesIdProperties</code>: string[] - Properties that identify unique time series</li>
                            </ul>
                        </div>
                        
                        <div style="background: #f0f8ff; padding: 15px; border-radius: 4px; margin: 10px 0;">
                            <h4>Integration Pattern using <strong>class-based inheritance</strong>:</h4>
                            <pre style="background: white; padding: 10px; border-radius: 4px; overflow-x: auto;"><code>// Create instance
const eventsTable = new EventsTable(containerElement);

// Render standard format
eventsTable.render(eventData, options);

// Or render TSX format  
eventsTable.renderFromEventsTsx(tsxData, options);</code></pre>
                        </div>
                        
                        <div style="background: #e6f3ff; padding: 15px; border-radius: 4px; margin: 10px 0;">
                            <h4>Accessibility Features:</h4>
                            <ul>
                              <li><strong>Keyboard Navigation</strong>: Full keyboard support for sorting and filtering</li>
                                <li><strong>Screen Reader Support</strong>: Proper ARIA labels and roles</li>
                                <li><strong>High Contrast</strong>: Works with system high contrast themes</li>
                                <li><strong>Focus Management</strong>: Clear focus indicators for interactive elements</li>
                            </ul>
                        </div>
                    </div>
                `;
            }
        }, 100);

        return html`
            <div style="height: 600px; width: 100%; border: 1px solid #ddd; border-radius: 4px; overflow: auto;">
                <div id="${demoId}" style="height: 100%; width: 100%;"></div>
            </div>
        `;
    }
};