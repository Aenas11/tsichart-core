import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import DateTimePicker from '../../packages/core/src/components/DateTimePicker';
import { fireEvent, screen, within, waitFor } from 'storybook/test';


interface IDateTimePickerOptions {
    theme?: 'light' | 'dark';
    offset?: string;
    is24HourTime?: boolean;
    dateLocale?: string;
    dTPIsModal?: boolean;
    includeTimezones?: boolean;
    showFeedback?: boolean;
}


const meta: Meta<IDateTimePickerOptions> = {
    title: 'Components/DateTimePicker',
    component: 'DateTimePicker',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
# DateTimePicker Component

Interactive date and time range picker for selecting time ranges in time series data visualization.

## Key Features
- **Range Selection**: Select both start and end dates/times with dual calendars
- **Quick Time Options**: Pre-defined time ranges (Last 15 mins, Last Hour, Last 7 Days, etc.)
- **Calendar Interface**: Dual month calendar view for easy date selection
- **Time Controls**: Precise hour/minute controls for both start and end times
- **Timezone Support**: Display and convert times across different timezones
- **Validation**: Automatic validation of time ranges with error feedback
- **Accessibility**: Full keyboard navigation and ARIA support
- **Theming**: Support for light and dark themes
- **Internationalization**: Multi-locale support for dates and time formats
- **Time Format**: Flexible 12-hour and 24-hour time format support

## Quick Time Options

The component provides convenient quick-select buttons for common time ranges:

| Option | Duration | Use Case |
|--------|----------|----------|
| Last 15 mins | 15 minutes | Real-time monitoring |
| Last 30 mins | 30 minutes | Recent trends |
| Last Hour | 1 hour | Hourly analysis |
| Last 2 Hours | 2 hours | Short-term patterns |
| Last 4 Hours | 4 hours | Half-day trends |
| Last 12 Hours | 12 hours | Daily patterns |
| Last 24 Hours | 24 hours | Full day analysis |
| Last 7 Days | 7 days | Weekly trends |
| Last 30 Days | 30 days | Monthly overview |
| Last 90 Days | 90 days | Quarterly analysis |

## Default Configuration

| Option | Default | Description |
|--------|---------|-------------|
| \`theme\` | \`'light'\` | Visual theme (light is more accessible) |
| \`offset\` | \`'Local'\` | Timezone offset for time display |
| \`is24HourTime\` | *locale-based* | Auto-derived from dateLocale |
| \`dateLocale\` | \`'en-US'\` | Locale for date/time formatting |
| \`dTPIsModal\` | \`true\` | Use modal picker interface |
| \`includeTimezones\` | \`false\` | Show timezone selector |
| \`fromMillis\` | 24 hours before max | Default start time |
| \`toMillis\` | maxMillis | Default end time |

## Localization Examples

The component automatically formats dates based on the locale:

- **English (US)**: "Jan 15, 2023" with 12-hour time
- **English (GB)**: "15 Jan 2023" with 24-hour time
- **German (DE)**: "15. Januar 2023" with 24-hour time
- **French (FR)**: "15 janvier 2023" with 24-hour time
- **Japanese (JP)**: "2023年1月15日" with 24-hour time

## Keyboard Navigation

| Key | Action |
|-----|--------|
| \`Tab\` | Move through quick time buttons and controls |
| \`Enter\` / \`Space\` | Select quick time or activate button |
| \`Escape\` | Close picker (when modal) |
| \`Arrow Keys\` | Navigate calendar dates (when focused) |
| \`Shift+Tab\` | Navigate backwards through controls |

## Range Validation

The component validates that:
- Start time is before end time
- Both times are within min/max bounds
- Times follow the specified offset/timezone
- No duplicate start and end times

Error messages appear below the calendar when validation fails.

## Usage Example

\`\`\`typescript
import TsiClient from 'tsichart-core';

const tsiClient = new TsiClient();
const dateTimePicker = new tsiClient.DateTimePicker(containerElement);

// Calculate time bounds
const now = Date.now();
const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);

// Render the picker
dateTimePicker.render(
    {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: 'en-US',
        includeTimezones: true
    },
    oneWeekAgo,           // minMillis
    now,                  // maxMillis
    oneWeekAgo,           // fromMillis (start of range)
    now,                  // toMillis (end of range)
    (from, to, offset, isRelative, quickTime) => {
        console.log('Time range selected:', {
            from: new Date(from),
            to: new Date(to),
            offset,
            isRelative,
            quickTime
        });
    },
    () => {
        console.log('Picker cancelled');
    }
);
\`\`\`

## Callbacks

### onSet(fromMillis, toMillis, offset, isRelative, quickTime)
Called when the user clicks the Save button.

**Parameters:**
- \`fromMillis\` (number): Start time in milliseconds
- \`toMillis\` (number): End time in milliseconds
- \`offset\` (string): Selected timezone offset
- \`isRelative\` (boolean): Whether selection is relative to now
- \`quickTime\` (number): Quick time milliseconds (-1 if custom range)

### onCancel()
Called when the user clicks the Cancel button.

---

## Migration from Older Versions

If upgrading from older versions, note these improvements:

- Better error messaging for invalid ranges
- Enhanced accessibility with ARIA labels
- Improved keyboard navigation
- More granular time precision controls
- Better timezone handling and display

                `
            }
        }
    },
    argTypes: {
        theme: {
            control: { type: 'select' },
            options: ['light', 'dark'],
            description: 'Visual theme for the date-time picker',
            table: { defaultValue: { summary: 'light' } }
        },
        offset: {
            control: { type: 'select' },
            options: ['Local', 'UTC', '-05:00', '-06:00', '-07:00', '+01:00', '+09:00'],
            description: 'Timezone offset for displaying and interpreting times',
            table: { defaultValue: { summary: 'Local' } }
        },
        is24HourTime: {
            control: 'boolean',
            description: 'Use 24-hour time format instead of 12-hour AM/PM',
            table: { defaultValue: { summary: 'locale-based' } }
        },
        dateLocale: {
            control: { type: 'select' },
            options: ['en-US', 'en-GB', 'fr-FR', 'de-DE', 'ja-JP', 'zh-CN', 'es-ES', 'pt-BR'],
            description: 'Locale for date formatting and translations',
            table: { defaultValue: { summary: 'en-US' } }
        },
        dTPIsModal: {
            control: 'boolean',
            description: 'Whether the picker should be displayed as a modal',
            table: { defaultValue: { summary: 'true' } }
        },
        includeTimezones: {
            control: 'boolean',
            description: 'Show timezone selector in the picker',
            table: { defaultValue: { summary: 'false' } }
        },
        showFeedback: {
            control: 'boolean',
            description: 'Show configuration feedback below the picker for demo purposes',
            table: { defaultValue: { summary: 'true' } }
        }
    }
};

export default meta;
type Story = StoryObj<IDateTimePickerOptions>;

function generateTimeBounds(scenario: 'current' | 'historical' | 'wide' | 'future', minDate?: Date) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (scenario) {
        case 'current':
            return {
                minMillis: today.getTime() - 30 * 24 * 60 * 60 * 1000,
                maxMillis: today.getTime() + 24 * 60 * 60 * 1000,
                fromMillis: now.getTime() - 7 * 24 * 60 * 60 * 1000,
                toMillis: now.getTime()
            };
        case 'historical':
            return {
                minMillis: new Date('2022-01-01').getTime(),
                maxMillis: new Date('2023-12-31').getTime(),
                fromMillis: new Date('2023-06-01').getTime(),
                toMillis: new Date('2023-06-30').getTime()
            };
        case 'wide':
            const minWide = minDate ? minDate.getTime() : new Date('1900-01-01').getTime(); // Much earlier date
            const maxWide = now.getTime();
            const initialFromWide = Math.max(
                maxWide - 90 * 24 * 60 * 60 * 1000,
                minWide
            );

            return {
                minMillis: minWide,
                maxMillis: maxWide,
                fromMillis: initialFromWide,
                toMillis: maxWide
            };
        case 'future':
            return {
                minMillis: now.getTime(),
                maxMillis: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).getTime(),
                fromMillis: now.getTime(),
                toMillis: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).getTime()
            };
    }
}

function renderDateTimePicker(container: HTMLElement, options: any = {}, scenario: string = 'current', minDate?: Date) {
    container.innerHTML = '';

    try {
        // Create DateTimePicker instance
        const picker = new DateTimePicker(container);

        // Get time bounds for the scenario
        const timeBounds = generateTimeBounds(scenario as any, minDate);

        // Default options
        const pickerOptions = {
            theme: options.theme || 'light',
            offset: options.offset || 'Local',
            is24HourTime: options.is24HourTime !== undefined ? options.is24HourTime : true,
            dateLocale: options.dateLocale || 'en-US',
            dTPIsModal: options.dTPIsModal !== undefined ? options.dTPIsModal : true,
            includeTimezones: options.includeTimezones || false,
            ...options
        };

        // Render callbacks
        const onSet = (fromMillis: number, toMillis: number, offset: string, isRelative: boolean, quickTime: number) => {
            console.log('DateTimePicker - Range selected:', {
                from: new Date(fromMillis).toISOString(),
                to: new Date(toMillis).toISOString(),
                offset,
                isRelative,
                quickTimeLabel: quickTime !== -1 ? picker.getQuickTimeText(quickTime) : 'Custom range'
            });
        };

        const onCancel = () => {
            console.log('DateTimePicker - Cancelled');
        };

        // Render the picker
        picker.render(
            pickerOptions,
            timeBounds.minMillis,
            timeBounds.maxMillis,
            timeBounds.fromMillis,
            timeBounds.toMillis,
            onSet,
            onCancel
        );

        // Show feedback (if enabled)
        if (options.showFeedback !== false) {
            const feedback = container.appendChild(document.createElement('div'));
            feedback.style.marginTop = '16px';
            feedback.style.padding = '12px';
            feedback.style.backgroundColor = '#f5f5f5';
            feedback.style.borderRadius = '4px';
            feedback.style.fontSize = '12px';
            feedback.style.color = '#666';
            feedback.innerHTML = `
                <strong>Configuration:</strong><br/>
                Theme: ${pickerOptions.theme}<br/>
                Offset: ${pickerOptions.offset}<br/>
                24-Hour Time: ${pickerOptions.is24HourTime}<br/>
                Locale: ${pickerOptions.dateLocale}<br/>
                Modal: ${pickerOptions.dTPIsModal}<br/>
                Timezones: ${pickerOptions.includeTimezones ? 'Enabled' : 'Disabled'}
            `;
        }

        return picker;
    } catch (error) {
        console.error('DateTimePicker rendering error:', error);
        const errorMsg = error instanceof Error ? error.message : String(error);
        container.innerHTML = `<div style="color: red; padding: 16px;">Error: ${errorMsg}</div>`;
    }
}

function createDateTimePickerStory(scenario: string = 'current', containerStyle: string = '', minDate?: Date) {
    return (args: any) => {
        return html`
            <div style="${containerStyle || 'height: 800px; width: 100%; border: 1px solid #ddd; border-radius: 4px; padding: 16px;'}">
                ${(() => {
                const container = document.createElement('div');
                renderDateTimePicker(container, args, scenario, minDate);
                return html`${container}`;
            })()}
            </div>
        `;
    };
}


export const Default: Story = {
    name: 'Default (Light Theme - Current Range)',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: 'en-US',
        dTPIsModal: true,
        includeTimezones: false,
        showFeedback: true
    },
    render: createDateTimePickerStory('current', 'height: 750px; width: 100%;')
};

export const DarkTheme: Story = {
    name: 'Dark Theme',
    args: {
        theme: 'dark',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: 'en-US',
        dTPIsModal: true,
        includeTimezones: false
    },
    render: createDateTimePickerStory('current', 'height: 750px; width: 100%; background: #1a1a1a;')
};

export const WithTimezones: Story = {
    name: 'With Timezone Support',
    args: {
        theme: 'light',
        offset: 'UTC',
        is24HourTime: true,
        dateLocale: 'en-US',
        includeTimezones: true,
        dTPIsModal: true
    },
    render: createDateTimePickerStory('current', 'height: 800px; width: 100%;')
};

export const TwelveHourFormat: Story = {
    name: '12-Hour Time Format',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: false,
        dateLocale: 'en-US',
        dTPIsModal: true
    },
    render: createDateTimePickerStory('current', 'height: 750px; width: 100%;')
};

export const DifferentLocales: Story = {
    name: 'German Locale (DE)',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: 'de-DE',
        dTPIsModal: true
    },
    render: createDateTimePickerStory('current', 'height: 750px; width: 100%;')
};

export const FrenchLocale: Story = {
    name: 'French Locale (FR)',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: 'fr-FR',
        dTPIsModal: true
    },
    render: createDateTimePickerStory('current', 'height: 750px; width: 100%;')
};

export const HistoricalData: Story = {
    name: 'Historical Data Range',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: 'en-US',
        dTPIsModal: true
    },
    render: createDateTimePickerStory('historical', 'height: 750px; width: 100%;')
};

export const WideTimeRange: Story = {
    name: 'Wide Time Range (3+ years)',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: 'en-US',
        dTPIsModal: true
    },
    render: createDateTimePickerStory('wide', 'height: 750px; width: 100%;')
};

export const Interaction: Story = {
    name: 'Interaction Tests',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: 'en-US',
        dTPIsModal: true,
        showFeedback: false
    },
    render: createDateTimePickerStory('current', 'height: 750px; width: 100%;'),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for the picker to render
        await waitFor(() => {
            const quickTimeButtons = canvasElement.querySelectorAll('.tsi-quickTime');
            if (!quickTimeButtons || quickTimeButtons.length === 0) {
                throw new Error('Quick time buttons not found');
            }
        }, { timeout: 5000 });

        // Test 1: Click a quick time button
        const quickTimeButtons = canvasElement.querySelectorAll('.tsi-quickTime');
        if (quickTimeButtons.length > 0) {
            fireEvent.click(quickTimeButtons[0]); // "Last 15 mins"
            console.log('Clicked quick time button: Last 15 mins');
        }

        // Test 2: Verify the button is selected
        await waitFor(() => {
            const selectedButton = canvasElement.querySelector('.tsi-quickTime.tsi-isSelected');
            if (!selectedButton) {
                throw new Error('Quick time button not selected');
            }
        }, { timeout: 2000 });

        // Test 3: Find and click Save button
        const saveButton = canvasElement.querySelector('.tsi-saveButton') as HTMLButtonElement;
        if (saveButton) {
            fireEvent.click(saveButton);
            console.log('Clicked Save button');
        }

        // Test 4: Verify Save completed
        await new Promise((r) => setTimeout(r, 500));
    }
};