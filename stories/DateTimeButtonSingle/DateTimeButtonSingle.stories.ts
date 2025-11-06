import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import DateTimeButtonSingle from "../../packages/core/src/components/DateTimeButtonSingle/DateTimeButtonSingle";
import { fireEvent, screen, within, waitFor } from "storybook/test";

interface IDateTimeButtonSingleOptions {
    theme?: 'light' | 'dark';
    offset?: string;
    is24HourTime?: boolean;
    dateLocale?: string;
    dTPIsModal?: boolean;
    minMillis?: number;
    maxMillis?: number;
    currentMillis?: number;
    onSet?: (millis: number) => void;
    onCancel?: () => void;
}



const meta: Meta<IDateTimeButtonSingleOptions> = {
    title: 'Components/DateTimeButtonSingle',
    component: 'DateTimeButtonSingle',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
# DateTimeButtonSingle Component

Interactive single date-time selection button with dropdown picker for time series applications.

## Key Features
- **Single Time Selection**: Select a specific date and time point
- **Timezone Support**: Display times in different timezones with abbreviations
- **Modal Picker**: Dropdown date-time picker interface with calendar and time controls
- **Accessibility**: Full keyboard navigation and screen reader support
- **Theming**: Support for light and dark themes
- **Locale Support**: Internationalization for different regions and languages
- **Time Format**: Support for both 12-hour and 24-hour time formats
- **Validation**: Automatic validation against min/max time bounds

## Usage Example

\`\`\`typescript
import TsiClient from 'tsichart-core';

// Create button instance
const tsiClient = new TsiClient();
const dateTimeButton = new tsiClient.DateTimeButtonSingle(containerElement);

// Set up current time selection
const now = new Date();
const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const dayAhead = new Date(now.getTime() + 24 * 60 * 60 * 1000);

// Render the button
dateTimeButton.render({
    theme: 'light',
    offset: 'Local',
    is24HourTime: true,
    dateLocale: 'en-US'
}, 
dayAgo.getTime(),     // minMillis - earliest selectable time
dayAhead.getTime(),   // maxMillis - latest selectable time  
now.getTime(),        // currentMillis - currently selected time
(millis, offset) => {
    console.log('Time selected:', {
        selectedTime: new Date(millis),
        offset
    });
},
() => {
    console.log('Selection cancelled');
});
\`\`\`

## Time Display Formats
- **12-hour format**: "Jan 1, 2023 12:30 PM (EST)"
- **24-hour format**: "Jan 1, 2023 12:30 (EST)"
- **Different locales**: German "1. Jan. 2023 12:30 (MEZ)"
                
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
        }
    }
}

export default meta;

type Story = StoryObj<IDateTimeButtonSingleOptions>;

function generateTimeBounds(scenario: 'current' | 'historical' | 'future' | 'wide') {
    const now = new Date();

    switch (scenario) {
        case 'current':
            return {
                minMillis: now.getTime() - 24 * 60 * 60 * 1000, // 1 day ago
                maxMillis: now.getTime() + 24 * 60 * 60 * 1000, // 1 day ahead
                currentMillis: now.getTime()
            };
        case 'historical':
            return {
                minMillis: new Date('2023-01-01').getTime(),
                maxMillis: new Date('2023-12-31').getTime(),
                currentMillis: new Date('2023-06-15T12:00:00Z').getTime()
            };
        case 'future':
            return {
                minMillis: now.getTime(),
                maxMillis: now.getTime() + 30 * 24 * 60 * 60 * 1000, // 30 days ahead
                currentMillis: now.getTime() + 7 * 24 * 60 * 60 * 1000  // 7 days ahead
            };
        case 'wide':
            return {
                minMillis: now.getTime() - 365 * 24 * 60 * 60 * 1000, // 1 year ago
                maxMillis: now.getTime() + 365 * 24 * 60 * 60 * 1000, // 1 year ahead
                currentMillis: now.getTime()
            };
        default:
            return generateTimeBounds('current');
    }
}

function renderDateTimeButtonSingle(container: HTMLElement, options: IDateTimeButtonSingleOptions = {}, scenario: string = 'current') {
    container.innerHTML = '';

    try {
        console.log('Rendering DateTimeButtonSingle with options:', options);

        // Create DateTimeButtonSingle instance
        const dateTimeButton = new DateTimeButtonSingle(container);

        // Get time bounds for the scenario
        const timeBounds = generateTimeBounds(scenario as any);

        // Default options for the component
        const componentOptions = {
            theme: 'light',
            offset: 'Local',
            is24HourTime: true,
            dateLocale: 'en-US',
            dTPIsModal: true,
            ...options
        };

        const onSet = (millis: number) => {
            console.log('DateTimeButtonSingle - Time selected:', {
                selectedTime: new Date(millis),
                timestamp: millis
            });

            if (options.onSet) {
                options.onSet(millis);
            }
        };

        dateTimeButton.render(
            componentOptions,
            timeBounds.minMillis,
            timeBounds.maxMillis,
            timeBounds.currentMillis,
            onSet
        );

        return dateTimeButton;
    } catch (error) {
        console.error('DateTimeButtonSingle rendering error:', error);
        container.innerHTML = `<div style="color: red; padding: 20px; font-family: monospace;">
            <h3>Error rendering DateTimeButtonSingle</h3>
            <p><strong>Error:</strong> ${error.message}</p>
            <p><strong>Stack:</strong></p>
            <pre style="white-space: pre-wrap; font-size: 12px;">${error.stack}</pre>
            <p><small>Check browser console for more details</small></p>
        </div>`;
    }
}

function createDateTimeButtonSingleStory(containerStyle: string, scenario: string = 'current') {
    return (args: IDateTimeButtonSingleOptions) => {
        const buttonId = 'datetime-single-' + Math.random().toString(36).substring(7);

        setTimeout(() => {
            const container = document.getElementById(buttonId);
            if (container) {
                renderDateTimeButtonSingle(container, args, scenario);
            }
        }, 100);

        return html`
            <div style="${containerStyle}">
                <div id="${buttonId}" style="height: 100%; width: 100%; display: flex; align-items: center; justify-content: center;"></div>
            </div>
        `;
    };
}

export const Default: Story = {
    name: 'Current Time (Default)',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: 'en-US',
        dTPIsModal: true
    },
    render: createDateTimeButtonSingleStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px; display: flex; align-items: center; justify-content: center;')
};

export const DarkTheme: Story = {
    name: 'Dark Theme',
    args: {
        theme: 'dark',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: 'en-US',
        dTPIsModal: true
    },
    render: createDateTimeButtonSingleStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px; display: flex; align-items: center; justify-content: center;')
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
    render: createDateTimeButtonSingleStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px; display: flex; align-items: center; justify-content: center;')
};

export const UTCTimezone: Story = {
    name: 'UTC Timezone',
    args: {
        theme: 'light',
        offset: 'UTC',
        is24HourTime: true,
        dateLocale: 'en-US',
        dTPIsModal: true
    },
    render: createDateTimeButtonSingleStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px; display: flex; align-items: center; justify-content: center;')
};

export const HistoricalTime: Story = {
    name: 'Historical Time Selection',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: 'en-US',
        dTPIsModal: true
    },
    render: createDateTimeButtonSingleStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px; display: flex; align-items: center; justify-content: center;')
};

export const FutureTime: Story = {
    name: 'Future Time Selection',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: 'en-US',
        dTPIsModal: true
    },
    render: createDateTimeButtonSingleStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px; display: flex; align-items: center; justify-content: center;')
};

export const GermanLocale: Story = {
    name: 'German Locale (DE)',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: 'de-DE',
        dTPIsModal: true
    },
    render: createDateTimeButtonSingleStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px; display: flex; align-items: center; justify-content: center;')
};

export const WideTimeRange: Story = {
    name: 'Wide Time Range (1 Year)',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: 'en-US',
        dTPIsModal: true
    },
    render: createDateTimeButtonSingleStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px; display: flex; align-items: center; justify-content: center;')
};


export const Interactive: Story = {
    name: 'Interaction Tests',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: 'en-US',
        dTPIsModal: true
    },
    render: createDateTimeButtonSingleStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px; display: flex; align-items: center; justify-content: center;'),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const dateTimeButton = await canvas.findByRole('button', {
            name: /a button to launch a time selection dialog/i
        }, { timeout: 5000 });

        await waitFor(() => {
            const buttonText = dateTimeButton.textContent;
            if (!buttonText || buttonText.trim().length === 0) {
                throw new Error("DateTimeButtonSingle should display a formatted time");
            }
        });

        fireEvent.click(dateTimeButton);

        await waitFor(() => {
            const picker = canvas.queryByRole('dialog') ||
                canvasElement.querySelector('.tsi-dateTimePickerContainer') ||
                canvasElement.querySelector('[style*="display: block"]');
            if (!picker) {
                throw new Error("Date-time picker should be visible after clicking button");
            }
        }, { timeout: 3000 });
        const pikadayCalendar = canvasElement.querySelector('.pika-single, .tsi-calendarPicker .pika-lendar');
        if (pikadayCalendar) {
            console.log('Pikaday calendar found in SingleDateTimePicker');

            // Test calendar day selection
            const calendarDay = pikadayCalendar.querySelector('.pika-button.pika-day:not(.is-disabled)');
            if (calendarDay) {
                fireEvent.click(calendarDay);
                console.log('Calendar day clicked successfully');
            }
        }

        const timeInput = canvasElement.querySelector('.tsi-dateTimeInput');
        if (timeInput) {
            console.log('Time input control found');

            fireEvent.focus(timeInput);
            fireEvent.change(timeInput, { target: { value: '12:30 PM' } });
        }

        const applyButton = canvas.queryByRole('button', { name: /save/i }) ||
            canvasElement.querySelector('.tsi-saveButton');

        if (applyButton) {
            fireEvent.click(applyButton);

            await waitFor(() => {
                const picker = canvasElement.querySelector('.tsi-singleDateTimePicker[style*="display: block"]') ||
                    canvasElement.querySelector('.tsi-dateTimePickerContainer[style*="display: block"]');
                if (picker) {
                    throw new Error("SingleDateTimePicker should close after saving");
                }
            }, { timeout: 2000 });
        } else {
            fireEvent.keyDown(canvasElement, { key: 'Escape', keyCode: 27 });
        }

        await waitFor(() => {
            if (dateTimeButton.getAttribute('aria-label') === null) {
                throw new Error("Button should maintain accessibility attributes");
            }
        });

        fireEvent.click(dateTimeButton);
        await waitFor(() => {
            const picker = canvasElement.querySelector('.tsi-singleDateTimePicker') ||
                canvasElement.querySelector('[style*="display: block"]');
            if (!picker) {
                throw new Error("Picker should reopen");
            }
        }, { timeout: 2000 });

        const escapeEvent = new KeyboardEvent('keydown', {
            key: 'Escape', keyCode: 27,
            bubbles: true
        });
        canvasElement.dispatchEvent(escapeEvent);

        await waitFor(() => {
            const finalButtonText = dateTimeButton.textContent;
            if (!finalButtonText || finalButtonText.trim().length === 0) {
                throw new Error("Button should maintain readable text after interactions");
            }
        });
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
    render: createDateTimeButtonSingleStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px; display: flex; align-items: center; justify-content: center;')
};