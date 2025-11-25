import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import DateTimeButtonRange from '../../packages/core/src/components/DateTimeButtonRange';
import { fireEvent, screen, within, waitFor } from 'storybook/test';

interface IDateTimeButtonRangeOptions {
    theme?: 'light' | 'dark';
    offset?: string;
    is24HourTime?: boolean;
    dateLocale?: string;
    dTPIsModal?: boolean;
    minutesForTimeLabels?: boolean;
    minMillis?: number;
    maxMillis?: number;
    fromMillis?: number;
    toMillis?: number;
    onSet?: (fromMillis: number, toMillis: number, offset: string, isRelative: boolean, currentQuickTime: number) => void;
    onCancel?: () => void;
}



const meta: Meta<IDateTimeButtonRangeOptions> = {
    title: 'Components/DateTimeButtonRange',
    component: 'DateTimeButtonRange',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
# DateTimeButtonRange Component

Interactive date-time range selection button with dropdown picker for time series applications.

## Key Features
- **Range Selection**: Select both start and end times for a time range
- **Quick Time Options**: Pre-defined time ranges (Last hour, Last day, Last week, etc.)
- **Custom Range**: Pick specific start and end dates/times
- **Timezone Support**: Display times in different timezones with abbreviations
- **Relative Time**: Support for relative time ranges (e.g., "Last 24 hours")
- **Modal Picker**: Dropdown date-time picker interface
- **Accessibility**: Full keyboard navigation and screen reader support
- **Theming**: Support for light and dark themes
- **Time Precision**: Control whether to show seconds and milliseconds in time labels

## Usage Example

\`\`\`typescript
import TsiClient from 'tsichart-core';

// Create button instance
const tsiClient = new TsiClient();
const dateTimeButton = new tsiClient.DateTimeButtonRange(containerElement);

// Set up time range (last 24 hours)
const now = new Date();
const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

// Render the button
dateTimeButton.render({
    theme: 'light',
    offset: 'Local',
    is24HourTime: true,
    dateLocale: 'en-US',
    minutesForTimeLabels: false  // Show seconds and milliseconds
},
dayAgo.getTime(),     // minMillis - earliest selectable time
now.getTime(),        // maxMillis - latest selectable time  
dayAgo.getTime(),     // fromMillis - current start time
now.getTime(),        // toMillis - current end time
(fromMillis, toMillis, offset, isRelative, currentQuickTime) => {
    console.log('Time range selected:', {
        from: new Date(fromMillis),
        to: new Date(toMillis),
        offset,
        isRelative,
        quickTime: currentQuickTime
    });
},
() => {
    console.log('Selection cancelled');
});
\`\`\`

## Time Range Formats
- **Absolute Range**: "Jan 1, 2023 12:00 PM - Jan 2, 2023 12:00 PM (EST)"
- **Relative Range**: "Last 24 hours (Jan 1, 2023 12:00 PM - Latest)"
- **Quick Times**: "Last hour", "Last day", "Last week", "Last month"                 
                `
            }
        }
    },
    argTypes: {
        theme: {
            control: { type: 'select' },
            options: ['light', 'dark'],
            description: 'Visual theme for the date-time button and picker',
            table: { defaultValue: { summary: 'light' } }
        },
        offset: {
            control: { type: 'select' },
            options: ['Local', 'UTC', 'EST', 'PST', 'CST', 'MST'],
            description: 'Timezone offset for displaying times',
            table: { defaultValue: { summary: 'Local' } }
        },
        is24HourTime: {
            control: 'boolean',
            description: 'Use 24-hour time format instead of 12-hour AM/PM',
            table: { defaultValue: { summary: 'true' } }
        },
        dateLocale: {
            control: { type: 'select' },
            options: ['en-US', 'en-GB', 'fr-FR', 'de-DE', 'ja-JP', 'zh-CN'],
            description: 'Locale for date formatting and localization',
            table: { defaultValue: { summary: 'en-US' } }
        },
        dTPIsModal: {
            control: 'boolean',
            description: 'Whether the date-time picker should be modal',
            table: { defaultValue: { summary: 'true' } }
        },
        minutesForTimeLabels: {
            control: 'boolean',
            description: 'When true, shows only hours and minutes in time labels. When false, includes seconds and milliseconds for higher precision.',
            table: { defaultValue: { summary: 'true' } }
        }
    }
};

export default meta;
type Story = StoryObj<IDateTimeButtonRangeOptions>;

function generateTimeBounds(scenario: 'recent' | 'historical' | 'future' | 'wide') {
    const now = new Date();

    switch (scenario) {
        case 'recent':
            return {
                minMillis: now.getTime() - 7 * 24 * 60 * 60 * 1000,
                maxMillis: now.getTime(),
                fromMillis: now.getTime() - 24 * 60 * 60 * 1000,
                toMillis: now.getTime()
            };
        case 'historical':
            return {
                minMillis: new Date('2023-01-01').getTime(),
                maxMillis: new Date('2023-12-31').getTime(),
                fromMillis: new Date('2023-06-01').getTime(),
                toMillis: new Date('2023-06-30').getTime()
            };
        case 'future':
            return {
                minMillis: now.getTime(),
                maxMillis: now.getTime() + 30 * 24 * 60 * 60 * 1000,
                fromMillis: now.getTime() + 7 * 24 * 60 * 60 * 1000,
                toMillis: now.getTime() + 14 * 24 * 60 * 60 * 1000
            };
        case 'wide':
            return {
                minMillis: now.getTime() - 365 * 24 * 60 * 60 * 1000,
                maxMillis: now.getTime() + 365 * 24 * 60 * 60 * 1000,
                fromMillis: now.getTime() - 30 * 24 * 60 * 60 * 1000,
                toMillis: now.getTime() + 30 * 24 * 60 * 60 * 1000
            };
        default:
            return generateTimeBounds('recent');
    }
}

function renderDateTimeButtonRange(container: HTMLElement, options: IDateTimeButtonRangeOptions = {}, scenario: string = 'recent') {
    container.innerHTML = '';

    try {
        console.log('Rendering DateTimeButtonRange with options:', options);

        // Create DateTimeButtonRange instance
        const dateTimeButton = new DateTimeButtonRange(container);

        // Get time bounds for the scenario
        const timeBounds = generateTimeBounds(scenario as any);

        // Default options for the component
        const componentOptions = {
            theme: 'light',
            offset: 'Local',
            is24HourTime: true,
            //set date locale to browser default if not provided
            dateLocale: navigator.language || 'en-US',
            dTPIsModal: true,
            minutesForTimeLabels: true,
            ...options
        };

        // Set up event handlers
        const onSet = (fromMillis: number, toMillis: number, offset: string, isRelative: boolean, currentQuickTime: number) => {
            console.log('DateTimeButtonRange - Time range selected:', {
                from: new Date(fromMillis),
                to: new Date(toMillis),
                offset,
                isRelative,
                quickTime: currentQuickTime
            });

            // Update button text to reflect new selection
            if (options.onSet) {
                options.onSet(fromMillis, toMillis, offset, isRelative, currentQuickTime);
            }
        };
        const onCancel = () => {
            console.log('DateTimeButtonRange - Selection cancelled');
            if (options.onCancel) {
                options.onCancel();
            }
        };

        // Render the component
        dateTimeButton.render(
            componentOptions,
            timeBounds.minMillis,
            timeBounds.maxMillis,
            timeBounds.fromMillis,
            timeBounds.toMillis,
            onSet as any,
            onCancel as any
        );

        return dateTimeButton;
    } catch (error: any) {
        console.error('DateTimeButtonRange rendering error:', error);
        container.innerHTML = `<div style="color: red; padding: 20px; font-family: monospace;">
            <h3>Error rendering DateTimeButtonRange</h3>
            <p><strong>Error:</strong> ${error.message}</p>
            <p><strong>Stack:</strong></p>
            <pre style="white-space: pre-wrap; font-size: 12px;">${error.stack}</pre>
            <p><small>Check browser console for more details</small></p>
        </div>`;
    }
}


function createDateTimeButtonRangeStory(scenario: string = 'recent') {
    return (args: IDateTimeButtonRangeOptions) => {
        const buttonId = 'datetime-button-' + Math.random().toString(36).substring(7);

        setTimeout(() => {
            const container = document.getElementById(buttonId);
            if (container) {
                renderDateTimeButtonRange(container, args, scenario);
            }
        }, 100);

        return html`
            <div style="min-height: 500px; position: relative; padding: 20px;">
                <div id="${buttonId}" style="position: relative;"></div>
            </div>
        `;
    };
}

export const Default: Story = {
    name: 'Recent Time Range (Default)',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: navigator.language || 'en-US',
        dTPIsModal: true,
        minutesForTimeLabels: true
    },
    render: createDateTimeButtonRangeStory('recent')
};

export const DarkTheme: Story = {
    name: 'Dark Theme',
    args: {
        theme: 'dark',
        offset: 'Local',
        is24HourTime: true,
        dTPIsModal: true
    },
    render: createDateTimeButtonRangeStory()
};

export const TwelveHourFormat: Story = {
    name: '12-Hour Time Format',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: false,
        dTPIsModal: true
    },
    render: createDateTimeButtonRangeStory()
};

export const DifferentTimezones: Story = {
    name: 'UTC Timezone',
    args: {
        theme: 'light',
        offset: 'UTC',
        is24HourTime: true,
        dTPIsModal: true
    },
    render: createDateTimeButtonRangeStory()
};

export const HistoricalData: Story = {
    name: 'Historical Time Range',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dTPIsModal: true
    },
    render: createDateTimeButtonRangeStory('historical')
};

export const FutureRange: Story = {
    name: 'Future Time Range',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dTPIsModal: true
    },
    render: createDateTimeButtonRangeStory('future')
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
    render: createDateTimeButtonRangeStory()
};

export const WideRange: Story = {
    name: 'Wide Time Range (1 Year)',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dTPIsModal: true
    },
    render: createDateTimeButtonRangeStory('wide')
};

export const HighPrecisionTime: Story = {
    name: 'High Precision (Seconds & Milliseconds)',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dTPIsModal: true,
        minutesForTimeLabels: false  // Show seconds and milliseconds
    },
    render: createDateTimeButtonRangeStory('recent')
};

export const Interactive: Story = {
    name: 'Interaction Tests',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dTPIsModal: true
    },
    render: createDateTimeButtonRangeStory(),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // 1. Find and click the date-time button
        const dateTimeButton = await canvas.findByRole('button', {
            name: /a button to launch a time selection dialog/i
        }, { timeout: 5000 });

        // Verify button is present and has correct text format
        await waitFor(() => {
            const buttonText = dateTimeButton.textContent;
            if (!buttonText || (!buttonText.includes('-') && !buttonText.includes('Last'))) {
                throw new Error("DateTimeButtonRange should display a time range");
            }
        });

        // 2. Click to open the date-time picker
        fireEvent.click(dateTimeButton);

        // 3. Wait for the picker to appear
        await waitFor(() => {
            const picker = canvas.queryByRole('dialog') ||
                canvasElement.querySelector('.tsi-dateTimePickerContainer') ||
                canvasElement.querySelector('[style*="display: block"]');
            if (!picker) {
                throw new Error("Date-time picker should be visible after clicking button");
            }
        }, { timeout: 3000 });
        const quickTimeButtons = canvas.queryAllByRole('button');
        const quickTimeFound = quickTimeButtons.some(btn =>
            btn.textContent && (
                btn.textContent.includes('hour') ||
                btn.textContent.includes('day') ||
                btn.textContent.includes('week')
            )
        );

        if (quickTimeFound) {
            console.log('Quick time options found in picker');
        }

        // 5. Look for Apply/OK button and click it
        const applyButton = canvas.queryByRole('button', { name: /apply|ok|set|confirm/i }) ||
            canvas.queryByText('Apply') ||
            canvas.queryByText('OK');

        if (applyButton) {
            fireEvent.click(applyButton);

            // Wait for picker to close
            await waitFor(() => {
                const picker = canvasElement.querySelector('[style*="display: block"]');
                if (picker) {
                    throw new Error("Picker should close after applying selection");
                }
            }, { timeout: 2000 });
        } else {
            // If no apply button, try clicking the main button again to close
            fireEvent.click(dateTimeButton);
        }

        // 6. Verify the button is still accessible and functional
        await waitFor(() => {
            if (dateTimeButton.getAttribute('aria-label') === null) {
                throw new Error("Button should maintain accessibility attributes");
            }
        });
        fireEvent.click(dateTimeButton);

        await waitFor(() => {
            const picker = canvasElement.querySelector('[style*="display: block"]');
            if (!picker) {
                throw new Error("Picker should open again");
            }
        }, { timeout: 2000 });

        // Look for Cancel button and test it
        const cancelButton = canvas.queryByRole('button', { name: /cancel|close/i }) ||
            canvas.queryByText('Cancel');

        if (cancelButton) {
            fireEvent.click(cancelButton);

            // Verify picker closes
            await waitFor(() => {
                const picker = canvasElement.querySelector('[style*="display: block"]');
                if (picker) {
                    throw new Error("Picker should close after cancel");
                }
            }, { timeout: 2000 });
        } else {
            // Close by clicking outside or pressing escape
            fireEvent.keyDown(canvasElement, { key: 'Escape' });
        }
    }
};

export const Playground: Story = {
    name: 'Interactive Playground',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: 'en-US',
        dTPIsModal: true
    },
    render: createDateTimeButtonRangeStory('recent')
};