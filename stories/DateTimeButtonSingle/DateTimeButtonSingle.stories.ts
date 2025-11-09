import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import DateTimeButtonSingle from "../../packages/core/src/components/DateTimeButtonSingle/DateTimeButtonSingle";
import { moment } from '../../packages/core/src/components/DateTimePicker/pikaday-wrapper';

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
    showFeedback?: boolean;
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

// Render the button
dateTimeButton.render({
    theme: 'light',
    offset: 'Local',
    is24HourTime: true,
    dateLocale: 'de-DE'  // German locale
}, 
dayAgo.getTime(),     // minMillis
dayAhead.getTime(),   // maxMillis
now.getTime(),        // currentMillis
(millis) => {         // Fix: Correct callback signature
    console.log('Time selected:', new Date(millis));
});
\`\`\`

## Locale Examples
- **English (US)**: "Jan 15, 2023 2:30 PM"
- **German (DE)**: "15. Jan. 2023 14:30" 
- **French (FR)**: "15 janv. 2023 14:30"
- **Japanese (JP)**: "2023年1月15日 14:30"
                
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
        showFeedback: {
            control: 'boolean',
            description: 'Show locale feedback information below the button',
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
            showFeedback: true,
            ...options
        };

        try {
            moment.locale(componentOptions.dateLocale);
            console.log(`Moment locale set to: ${componentOptions.dateLocale}, current locale: ${moment.locale()}`);
        } catch (error) {
            console.warn(`Failed to set moment locale to ${componentOptions.dateLocale}:`, error);
            // Fallback to default locale
            moment.locale('en');
        }

        const localeSpecificOptions = {
            ...componentOptions,
            is24HourTime: getLocaleTimeFormat(componentOptions.dateLocale),
            dateLocale: componentOptions.dateLocale
        };

        const onSet = (millis: number) => {
            const selectedDate = new Date(millis);
            console.log('DateTimeButtonSingle - Time selected:', {
                selectedTime: selectedDate,
                timestamp: millis,
                locale: componentOptions.dateLocale,
                localeFormatted: formatDateForLocale(selectedDate, componentOptions.dateLocale, localeSpecificOptions.is24HourTime),
                momentFormatted: moment(selectedDate).format('LLL')
            });

            const feedbackDiv = container.querySelector('.locale-feedback') as HTMLElement;
            if (feedbackDiv) {
                feedbackDiv.innerHTML = `
                    <strong>Selected Time (${componentOptions.dateLocale}):</strong><br>
                    Locale format: ${formatDateForLocale(selectedDate, componentOptions.dateLocale, localeSpecificOptions.is24HourTime)}<br>
                    Moment.js format: ${moment(selectedDate).format('LLL')}
                `;
            }

            if (options.onSet) {
                options.onSet(millis);
            }
        };
        console.log("-----", localeSpecificOptions)
        dateTimeButton.render(
            localeSpecificOptions,
            timeBounds.minMillis,
            timeBounds.maxMillis,
            timeBounds.currentMillis,
            onSet
        );

        // Create feedback element only if showFeedback is enabled
        if (componentOptions.showFeedback) {
            const feedbackDiv = document.createElement('div');
            feedbackDiv.className = 'locale-feedback';
            feedbackDiv.style.cssText = `
                margin-top: 16px;
                padding: 12px;
                background: ${componentOptions.theme === 'dark' ? '#2d2d2d' : '#f8f9fa'};
                color: ${componentOptions.theme === 'dark' ? '#fff' : '#333'};
                border: 1px solid ${componentOptions.theme === 'dark' ? '#444' : '#dee2e6'};
                border-radius: 6px;
                font-size: 12px;
                line-height: 1.4;
                position: absolute;
                width: 90%;              
            `;

            // Show initial time with proper locale formatting
            const initialDate = new Date(timeBounds.currentMillis);
            const initialLocaleFormat = formatDateForLocale(initialDate, componentOptions.dateLocale, localeSpecificOptions.is24HourTime);

            feedbackDiv.innerHTML = `
                <strong>Current Locale (${componentOptions.dateLocale}):</strong><br>
                Locale format: ${initialLocaleFormat}<br>
                Moment.js format: ${moment(initialDate).format('LLL')}<br>
                <em>Click the button to test locale formatting</em>
            `;
            container.appendChild(feedbackDiv);
        }

        return dateTimeButton;
    } catch (error) {
        console.error('DateTimeButtonSingle rendering error:', error);
        container.innerHTML = `<div style="color: red; padding: 20px;">
            <h3>Error rendering DateTimeButtonSingle</h3>
            <p><strong>Error:</strong> ${error.message}</p>
            <p><strong>Stack:</strong></p>
            <pre style="white-space: pre-wrap; font-size: 12px;">${error.stack}</pre>
            <p><small>Check browser console for more details</small></p>
        </div>`;
    }
}

function getLocaleTimeFormat(dateLocale: string): boolean {
    // Define locale-specific time format preferences based on cultural conventions
    const locale24HourFormats = [
        'de-DE',    // Germany uses 24-hour format
        'fr-FR',    // France uses 24-hour format
        'ja-JP',    // Japan uses 24-hour format
        'zh-CN',    // China uses 24-hour format
        'en-GB',    // UK often uses 24-hour format
        'es-ES',    // Spain uses 24-hour format
        'it-IT',    // Italy uses 24-hour format
        'pt-PT',    // Portugal uses 24-hour format
        'ru-RU',    // Russia uses 24-hour format
        'ko-KR'     // Korea uses 24-hour format
    ];

    const locale12HourFormats = [
        'en-US',    // US uses 12-hour format (AM/PM)
        'en-CA',    // Canada often uses 12-hour format
        'en-AU',    // Australia uses 12-hour format
        'hi-IN'     // India uses 12-hour format
    ];

    // Check for 24-hour locales first
    if (locale24HourFormats.includes(dateLocale)) {
        return true;
    }

    // Check for 12-hour locales
    if (locale12HourFormats.includes(dateLocale)) {
        return false;
    }

    // Default to 24-hour for unknown locales (most world regions use 24-hour)
    return true;
}

function formatDateForLocale(date: Date, dateLocale: string, is24HourTime: boolean): string {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: !is24HourTime
    };

    try {
        return date.toLocaleDateString(dateLocale, options);
    } catch (error) {
        console.warn(`Failed to format date for locale ${dateLocale}:`, error);
        // Fallback to standard format
        return date.toLocaleString(dateLocale);
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
                <div id="${buttonId}" style="height: 100%;   width: 100%;"></div>
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
        dTPIsModal: true
    },
    render: createDateTimeButtonSingleStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px; display: flex; align-items: center; justify-content: center;')
};

export const LocaleComparison: Story = {
    name: 'Locale Comparison',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dTPIsModal: true
    },
    render: (args: IDateTimeButtonSingleOptions) => {
        const containerId = 'locale-comparison-' + Math.random().toString(36).substring(7);

        setTimeout(() => {
            const container = document.getElementById(containerId);
            if (container) {
                const locales = ['en-US', 'de-DE', 'fr-FR', 'ja-JP'];
                const currentTime = new Date();
                container.innerHTML = '';

                locales.forEach((locale, index) => {
                    const localeContainer = document.createElement('div');
                    localeContainer.style.cssText = `
                        margin-bottom: 20px;
                        padding: 15px;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        background: #fafafa;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        max-width: 600px;
                        margin-left: auto;
                        margin-right: auto;
                    `;

                    const timeFormat = '24-hour'
                    const localeTitle = document.createElement('h4');
                    localeTitle.textContent = `${locale} Locale (${timeFormat})`;
                    localeTitle.style.cssText = `
                        margin: 0 0 15px 0;
                        text-align: center;
                        color: #333;
                        font-weight: 600;
                        font-size: 16px;
                    `;
                    localeContainer.appendChild(localeTitle);

                    const buttonContainer = document.createElement('div');
                    buttonContainer.id = `button-${locale}-${index}`;
                    buttonContainer.style.cssText = `
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin-bottom: 15px;
                    `;
                    localeContainer.appendChild(buttonContainer);

                    const feedbackDiv = document.createElement('div');
                    feedbackDiv.className = 'locale-feedback';
                    feedbackDiv.style.cssText = `
                        padding: 12px;
                        background: ${args.theme === 'dark' ? '#2d2d2d' : '#f8f9fa'};
                        color: ${args.theme === 'dark' ? '#fff' : '#333'};
                        border: 1px solid ${args.theme === 'dark' ? '#444' : '#dee2e6'};
                        border-radius: 6px;
                        font-size: 12px;
                        line-height: 1.4;
                        position: absolute;
                        bottom: 10px;
                        width: 90%;
                       
                    `;

                    const is24Hour = getLocaleTimeFormat(locale);
                    let momentFormatted: string;
                    let momentShort: string;

                    try {
                        // Save current locale
                        const previousLocale = moment.locale();

                        // Set to specific locale for this formatting
                        moment.locale(locale);
                        momentFormatted = moment(currentTime).format('LLL');
                        momentShort = moment(currentTime).format('L LT');
                        moment.locale(previousLocale);
                        // Restore previous locale
                        moment.locale(previousLocale);
                    } catch (error) {
                        console.warn(`Failed to set moment locale to ${locale}:`, error);
                        momentFormatted = `Error: ${error.message}`;
                        momentShort = `Error: ${error.message}`;
                    }

                    container.appendChild(localeContainer);

                    // Render the DateTimeButtonSingle for this specific locale
                    renderDateTimeButtonSingle(buttonContainer, {
                        ...args,
                        offset: args.offset || 'Local',
                        dateLocale: locale,
                        is24HourTime: getLocaleTimeFormat(locale),
                        dTPIsModal: args.dTPIsModal !== false,
                        showFeedback: false
                    });
                });
            }
        }, 100);

        return html`
            <div style="height: auto; min-height: 800px; width: 100%; padding: 20px;">
                <h3 style="margin: 0 0 20px 0; text-align: center;">DateTimeButtonSingle Locale Comparison</h3>
                <div id="${containerId}" style="width: 100%;"></div>
            </div>
        `;
    }
};


export const Playground: Story = {
    name: 'Interactive Playground',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dTPIsModal: true
    },
    render: createDateTimeButtonSingleStory('height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 4px; display: flex; align-items: center; justify-content: center;')
};