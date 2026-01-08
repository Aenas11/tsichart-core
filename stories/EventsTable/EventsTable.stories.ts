import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import EventsTable from '../../packages/core/src/components/EventsTable';
import { ChartOptions } from '../../packages/core/src/models/ChartOptions';
import { fireEvent, screen, within, waitFor } from 'storybook/test';

interface IEventsTableOptions {
    theme?: 'light' | 'dark';
    is24HourTime?: boolean;
    dateLocale?: string;
    offset?: string | number;
    timeSeriesIdProperties?: Array<{ name: string, type: any }>;
    canDownload?: boolean;
    strings?: any;
}

const meta: Meta<IEventsTableOptions> = {
    title: 'Components/EventsTable',
    component: 'EventsTable', 
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
# EventsTable Component

Interactive table for displaying time series event data with the following features:

## Key Features
- **Sortable Columns**: Click column headers to sort data ascending/descending
- **Column Visibility**: Toggle columns on/off via the legend panel
- **CSV Export**: Download table data as CSV file
- **Infinite Scroll**: Load more data as you scroll down
- **Time Formatting**: Display timestamps in various formats and timezones
- **Responsive**: Automatically adjusts to container size
- **Theming**: Support for light and dark themes

## Usage Example

\`\`\` typescript
import TsiClient from 'tsichart-core';

// Create EventsTable instance
const tsiClient = new TsiClient();
const eventsTable = new tsiClient.EventsTable(containerElement);

// Prepare your events data
const events = [
    {
        'timestamp ($ts)': '2023-01-01T00:00:00Z',
        'temperature': { name: 'Temperature', value: 25.5, type: 'Double' },
        'humidity': { name: 'Humidity', value: 65.2, type: 'Double' },
        'status': { name: 'Status', value: 'Normal', type: 'String' }
    },
    {
        'timestamp ($ts)': '2023-01-01T01:00:00Z',
        'temperature': { name: 'Temperature', value: 26.1, type: 'Double' },
        'humidity': { name: 'Humidity', value: 64.8, type: 'Double' },
        'status': { name: 'Status', value: 'Warning', type: 'String' }
    }
    // More events...
];

// Render the table
eventsTable.render(events, {
    theme: 'light',
    is24HourTime: true,
    canDownload: true,
    offset: 'Local',
    dateLocale: 'en'
});
\`\`\`
                `
            },
        }
    },
    argTypes: {
        theme: {
            control: { type: 'select' },
            options: ['light', 'dark'],
            description: 'Visual theme for the table'
        },
        is24HourTime: {
            control: 'boolean',
            description: 'Display time in 24-hour format',
            table: { defaultValue: { summary: 'true' } }
        },
        canDownload: {
            control: 'boolean',
            description: 'Enable CSV download functionality',
            table: { defaultValue: { summary: 'true' } }
        },
        offset: {
            control: { type: 'select' },
            options: ['Local', 'UTC', -480, -300, 0, 60, 120],
            description: 'Timezone offset for timestamp display',
            table: { defaultValue: { summary: 'Local' } }
        },
        dateLocale: {
            control: { type: 'select' },
            options: ['en', 'de', 'fr', 'es', 'ja'],
            description: 'Locale for date formatting',
            table: { defaultValue: { summary: 'en' } }
        }
    }
};

export default meta;
type Story = StoryObj<IEventsTableOptions>;

function generateSampleEvents(eventCount: number = 24) {
    const events = [];
    const baseDate = new Date();
    baseDate.setMinutes(0, 0, 0);
    const sensors = ['Temperature', 'Humidity', 'Pressure', 'Voltage'];
    const locations = ['Factory A', 'Factory B', 'Factory C'];
    const statuses = ['Normal', 'Warning', 'Critical', 'Maintenance'];

    for (let i = 0; i < 24; i++) {
        const eventDate = new Date(baseDate);
        eventDate.setHours(i);

        const timestamp = eventDate.toISOString();
        const sensor = sensors[Math.floor(Math.random() * sensors.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        events.push({
            'timestamp ($ts)': timestamp, 
            'sensor': {
                name: 'Sensor',
                value: sensor,
                type: 'String'
            },
            'location': {
                name: 'Location', 
                value: location,
                type: 'String'
            },
            'value': {
                name: 'Value',
                value: parseFloat((Math.random() * 100 + 20).toFixed(2)),
                type: 'Double'
            },
            'status': {
                name: 'Status',
                value: status,
                type: 'String'
            },
            'deviceId': {
                name: 'Device ID',
                value: `DEV-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                type: 'String'
            },
            'alertLevel': {
                name: 'Alert Level',
                value: Math.floor(Math.random() * 5) + 1,
                type: 'Long'
            }
        });
    }

    return events;
}

function generateEventsWithTimeSeriesId(eventCount: number = 30) {
    const events = generateSampleEvents(eventCount);
    
    // Add time series ID properties to some events
    events.forEach((event, index) => {
        if (index % 3 === 0) {
            event['Building'] = {
                name: 'Building',
                value: `Building-${Math.floor(index / 10) + 1}`,
                type: 'String'
            };
            event['Floor'] = {
                name: 'Floor',
                value: `Floor-${(index % 5) + 1}`,
                type: 'String'
            };
        }
    });

    return events;
}

function renderEventsTable(container: HTMLElement, options: any = {}) {
    container.innerHTML = '';

    try {
        const eventsTable = new EventsTable(container);
        const tableOptions = {
            theme: 'light',
            is24HourTime: true,
            canDownload: true,
            offset: 'Local',
            dateLocale: 'en',
            timeSeriesIdProperties: options.timeSeriesIdProperties || [],
            ...options
        };

        // Generate and render data
        const sampleEvents = options.useTimeSeriesId 
            ? generateEventsWithTimeSeriesId(options.eventCount || 50)
            : generateSampleEvents(options.eventCount || 50);

        eventsTable.render(sampleEvents, tableOptions, true);

        return eventsTable;
    } catch (error) {
        console.error('EventsTable rendering error:', error);
        container.innerHTML = `<div style="color: red; padding: 20px; font-family: monospace;">
            <h3>Error rendering EventsTable</h3>
            <p><strong>Error:</strong> ${error.message}</p>
            <p><small>Check browser console for more details</small></p>
        </div>`;
    }
}

function createEventsTableStory(containerStyle: string, additionalOptions: any = {}) {
    return (args: any) => {
        const tableId = 'table-' + Math.random().toString(36).substring(7);

        setTimeout(() => {
            const container = document.getElementById(tableId);
            if (container) {
                renderEventsTable(container, { ...args, ...additionalOptions });
            }
        }, 100);

        return html`
            <div style="${containerStyle}">
                <div id="${tableId}" style="height: 100%; width: 100%;"></div>
            </div>
        `;
    };
}

export const Default: Story = {
    name: 'Light Theme (Default)',
    args: {
        theme: 'light',
        is24HourTime: true,
        canDownload: true,
        offset: 'Local',
        dateLocale: 'en'
    },
    render: createEventsTableStory('height: 600px; width: 100%; border: 1px solid #ddd; border-radius: 4px;')
};

export const DarkTheme: Story = {
    name: 'Dark Theme',
    args: {
        theme: 'dark',
        is24HourTime: true,
        canDownload: true,
        offset: 'Local',
        dateLocale: 'en'
    },
    render: createEventsTableStory('height: 600px; width: 100%; background: #1a1a1a; border: 1px solid #444; border-radius: 4px;')
};

export const TimeFormats: Story = {
    name: '12-Hour Time Format',
    args: {
        theme: 'light',
        is24HourTime: false,
        canDownload: true,
        offset: 'Local',
        dateLocale: 'en'
    },
    render: createEventsTableStory('height: 600px; width: 100%; border: 1px solid #ddd; border-radius: 4px;')
};

export const WithTimeSeriesId: Story = {
    name: 'With Time Series ID Properties',
    args: {
        theme: 'light',
        is24HourTime: true,
        canDownload: true,
        offset: 'Local',
        dateLocale: 'en'
    },
    render: createEventsTableStory(
        'height: 600px; width: 100%; border: 1px solid #ddd; border-radius: 4px;', 
        { 
            useTimeSeriesId: true,
            timeSeriesIdProperties: [
                { name: 'Building', type: 'String' },
                { name: 'Floor', type: 'String' }
            ]
        }
    )
};

export const LargeDataset: Story = {
    name: 'Large Dataset (1000 events)',
    args: {
        theme: 'light',
        is24HourTime: true,
        canDownload: true,
        offset: 'Local',
        dateLocale: 'en'
    },
    render: createEventsTableStory(
        'height: 600px; width: 100%; border: 1px solid #ddd; border-radius: 4px;',
        { eventCount: 1000 }
    )
};

export const DifferentTimezones: Story = {
    name: 'UTC Timezone',
    args: {
        theme: 'light',
        is24HourTime: true,
        canDownload: true,
        offset: 'UTC',
        dateLocale: 'en'
    },
    render: createEventsTableStory('height: 600px; width: 100%; border: 1px solid #ddd; border-radius: 4px;')
};

export const InteractiveFeatures: Story = {
    name: 'Interactive Features Test',
    args: {
        theme: 'light',
        is24HourTime: true,
        canDownload: true,
        offset: 'Local',
        dateLocale: 'en'
    },
    render: createEventsTableStory('height: 600px; width: 100%; border: 1px solid #ddd; border-radius: 4px;'),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for the table to be fully rendered
        await waitFor(() => canvas.getByRole('table', { hidden: true }), { timeout: 5000 });

        // 1. Test Column Sorting
        const sortableHeaders = canvas.getAllByRole('button');
        const timestampHeader = sortableHeaders.find(header => 
            header.getAttribute('aria-label')?.includes('timestamp')
        );
        
        if (timestampHeader) {
            // Click to sort by timestamp
            fireEvent.click(timestampHeader);
            
            // Wait a bit for sort to complete
            await new Promise(resolve => setTimeout(resolve, 500));

            // Verify sort icon appeared (check for 'up' or 'down' class)
            await waitFor(() => {
                const sortIcon = canvas.getByClass('tsi-columnSortIcon');
                if (!sortIcon.classList.contains('up') && !sortIcon.classList.contains('down')) {
                    throw new Error('Sort icon should show sorting state');
                }
            });
        }
        const legendItems = canvas.getAllByRole('button');
        const columnToggle = legendItems.find(button => 
            button.getAttribute('aria-label')?.includes('toggle column')
        );

        if (columnToggle) {
            // Toggle a column off
            fireEvent.click(columnToggle);
            
            // Wait for column to be hidden
            await waitFor(() => {
                const checkbox = columnToggle.parentElement?.querySelector('.tsi-columnToggleCheckbox');
                if (!checkbox?.classList.contains('tsi-notSelected')) {
                    throw new Error('Column should be hidden after toggle');
                }
            });

            // Toggle it back on
            fireEvent.click(columnToggle);
            
            await waitFor(() => {
                const checkbox = columnToggle.parentElement?.querySelector('.tsi-columnToggleCheckbox');
                if (checkbox?.classList.contains('tsi-notSelected')) {
                    throw new Error('Column should be visible after second toggle');
                }
            });
        }

        // 3. Test Download Button (if present)
        const downloadButton = canvas.queryByLabelText(/Download as CSV/i);
        if (downloadButton) {
            // Click download button
            fireEvent.click(downloadButton);
            
            // Check if downloading state was applied
            await waitFor(() => {
                if (!downloadButton.classList.contains('tsi-downloading')) {
                    throw new Error('Download button should show downloading state');
                }
            });

            // Wait for download state to clear
            await waitFor(() => {
                if (downloadButton.classList.contains('tsi-downloading')) {
                    throw new Error('Download state should clear after completion');
                }
            }, { timeout: 2000 });
        }

        // 4. Test Scrolling for Infinite Load (if table has scroll)
        const tableContainer = canvas.queryByClass('tsi-eventRowsContainer');
        if (tableContainer) {
            // Scroll to bottom
            tableContainer.scrollTop = tableContainer.scrollHeight;
            
            // Wait for potential new rows to load
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
};

export const CustomLocale: Story = {
    name: 'German Locale',
    args: {
        theme: 'light',
        is24HourTime: true,
        canDownload: true,
        offset: 'Local',
        dateLocale: 'de'
    },
    render: createEventsTableStory('height: 600px; width: 100%; border: 1px solid #ddd; border-radius: 4px;')
};



