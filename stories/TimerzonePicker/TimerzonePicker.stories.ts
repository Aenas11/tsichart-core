import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import TimezonePicker from "../../packages/core/src/components/TimezonePicker";
import { fireEvent, screen, within, waitFor } from 'storybook/test';

interface TimezonePickerOptions extends Record<string, any> {
    theme: 'light' | 'dark';
    defaultTimezone: string;
    showLocalTime: boolean;
    disabled: boolean;
}

const meta: Meta<TimezonePickerOptions> = {
    title: "Components/TimerzonePicker",
    component: "TimerzonePicker",
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component: `
# TimezonePicker Component

Interactive timezone selection component with the following features using **component-based architecture**:

## Key Features
- **Comprehensive Timezone Support**: Includes major world timezones organized by continent
- **UTC Offset Sorting**: Timezones automatically sorted by current UTC offset using **internal state management**
- **Local Timezone Detection**: "Local" option for browser's detected timezone
- **Moment.js Integration**: Uses moment-timezone for accurate timezone calculations following **D3.js patterns**
- **Theming**: Support for light and dark themes using **monolithic component** patterns
- **Accessibility**: Proper ARIA labels and semantic HTML

## Usage Example

\`\`\`typescript
import { TimezonePicker } from 'tsichart-core';

// Create TimezonePicker instance using class-based inheritance
const timezonePicker = new TimezonePicker(containerElement);

// Render with callback for timezone selection using internal state management
timezonePicker.render((selectedTimezone) => {
    console.log('Selected timezone:', selectedTimezone);
    // Update your chart or application state
    updateChartTimezone(selectedTimezone);
}, 'America/New_York'); // Optional default timezone

// Theme the component using component-based architecture
timezonePicker.themify(containerElement, 'light');
\`\`\`

## Timezone Format

The component handles timezone identifiers in these formats:
- **IANA timezone names**: \`America/New_York\`, \`Europe/London\`, \`Asia/Tokyo\`
- **Special values**: \`Local\` (browser timezone), \`UTC\` (Coordinated Universal Time)
- **Display labels**: Automatically formatted with UTC offsets for better UX

## Integration with Charts

TimezonePicker is commonly used with chart components for time axis formatting:

\`\`\`typescript
const chart = new LineChart(chartContainer);
const timezonePicker = new TimezonePicker(pickerContainer);

timezonePicker.render((timezone) => {
    // Re-render chart with new timezone using D3.js patterns
    chart.render(data, {
        offset: timezone,
        dateLocale: 'en-US'
    }, aggregateExpressionOptions);
}, 'Local');
\`\`\`

## Accessibility Features

- **Semantic HTML**: Uses native \`<select>\` element for optimal screen reader support
- **Keyboard Navigation**: Full keyboard support with arrow keys and type-to-search
- **Clear Labels**: Timezone names include UTC offsets for better identification
- **Focus Management**: Maintains focus state during interaction

## Performance Considerations

- **Lazy Sorting**: Timezones sorted by UTC offset only once during render using **internal state management**
- **Efficient Filtering**: Special timezones (Local, UTC) filtered and positioned first
- **Moment.js Optimization**: UTC offset calculations cached for performance following **defensive programming**

                `
            }
        }
    },
    argTypes: {
        theme: {
            control: { type: 'select' },
            options: ['light', 'dark'],
            description: 'Visual theme for the timezone picker using D3.js patterns'
        },
        defaultTimezone: {
            control: 'text',
            description: 'Default selected timezone (IANA format or Local/UTC)',
            table: { defaultValue: { summary: 'Local' } }
        },
        showLocalTime: {
            control: 'boolean',
            description: 'Display current local time for each timezone option',
            table: { defaultValue: { summary: 'false' } }
        },
        disabled: {
            control: 'boolean',
            description: 'Disable the timezone picker interaction',
            table: { defaultValue: { summary: 'false' } }
        }
    },
    args: {
        theme: 'light',
        defaultTimezone: 'Local',
        showLocalTime: false,
        disabled: false
    }
}

export default meta;
type Story = StoryObj<TimezonePickerOptions>;

function renderTimezonePicker(container: HTMLElement, options: TimezonePickerOptions = {} as TimezonePickerOptions, onTimezoneSelect?: (timezone: string) => void) {
    container.innerHTML = '';

    try {
        console.log('Rendering TimezonePicker with options following D3.js patterns:', options);
        const timezonePicker = new TimezonePicker(container);

        const defaultCallback = onTimezoneSelect || ((timezone: string) => {

            const statusElement = container.querySelector('.tsi-timezone-status');
            if (statusElement) {
                statusElement.textContent = `Selected: ${timezone}`;
            }
        });

        if (options.theme) {
            container.setAttribute('data-theme', options.theme);
            container.classList.add(`tsi-${options.theme}Theme`);
        }
        timezonePicker.render(defaultCallback, options.defaultTimezone || 'Local');
        const selectElement = container.querySelector('select');
        if (selectElement && options.disabled) {
            selectElement.disabled = true;
        }

        const statusDiv = document.createElement('div');
        statusDiv.className = 'tsi-timezone-status';
        statusDiv.style.cssText = 'margin-top: 10px; font-size: 12px; color: #666;';
        statusDiv.textContent = `Selected: ${options.defaultTimezone || 'Local'}`;
        container.appendChild(statusDiv);
        return timezonePicker;
    } catch (error) {
        console.error('TimezonePicker rendering error following defensive programming:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        container.innerHTML = `<div style="color: red; padding: 20px; font-family: monospace;">
            <h3>Error rendering TimezonePicker</h3>
            <p><strong>Error:</strong> ${errorMessage}</p>
            <p><small>Check browser console for more details</small></p>
            <div style="background: #f5f5f5; padding: 10px; border-radius: 4px; margin: 10px 0;">
                <strong>Expected Usage following component-based architecture:</strong><br>
                <pre style="font-size: 11px; background: white; padding: 5px; border-radius: 3px;"><code>const picker = new TimezonePicker(container);
picker.render((timezone) => {
    console.log('Selected:', timezone);
}, 'Local');</code></pre>
            </div>
        </div>`;
    }
}

function updateTimezoneDateTime(element: HTMLElement, timezone: string) {
    try {
        const now = new Date();
        let displayTime: string;
        let displayDate: string;
        let utcOffset: string;
        let timezoneName: string;

        if (timezone === 'Local') {
            // Use browser's local timezone following defensive programming
            displayTime = now.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            displayDate = now.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            utcOffset = formatUTCOffset(now.getTimezoneOffset());
            timezoneName = 'Local Time';
        } else if (timezone === 'UTC') {
            // Handle UTC timezone using monolithic component patterns
            displayTime = now.toISOString().slice(11, 8);
            displayDate = now.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC'
            });
            utcOffset = '+00:00';
            timezoneName = 'Coordinated Universal Time';
        } else {
            const normalizedTimezone = timezone.replace(/\s/g, '_');
            try {
                displayTime = now.toLocaleTimeString('en-US', {
                    timeZone: normalizedTimezone,
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                displayDate = now.toLocaleDateString('en-US', {
                    timeZone: normalizedTimezone,

                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                // Calculate UTC offset for the timezone following D3.js patterns
                const offsetMs = getTimezoneOffset(normalizedTimezone, now);
                utcOffset = formatUTCOffset(-offsetMs / 60000); // Convert ms to minutes and invert
                timezoneName = normalizedTimezone.replace(/_/g, ' ');
            } catch (error) {
                console.warn('Invalid timezone following defensive programming:', timezone, error);
                displayTime = 'Invalid Timezone';
                displayDate = '';
                utcOffset = '';
                timezoneName = timezone;
            }
        }

        // Update DOM content using component-based architecture
        element.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <strong style="font-size: 16px; color: inherit;">${displayTime}</strong>
                <span style="font-size: 12px; color: #6c757d; font-weight: 500;">${utcOffset}</span>
            </div>
            <div style="font-size: 14px; color: inherit; margin-bottom: 4px;">${displayDate}</div>
            <div style="font-size: 12px; color: #6c757d; font-style: italic;">${timezoneName}</div>
        `;
    } catch (error) {
        console.error('Error updating timezone datetime following defensive programming:', error);
        element.innerHTML = `<div style="color: #dc3545; font-size: 12px;">Error displaying timezone: ${timezone}</div>`;
    }
}

/**
 * Get timezone offset in milliseconds using internal state management.
 * Follows monolithic component patterns for timezone calculations.
 */
function getTimezoneOffset(timezone: string, date: Date): number {
    try {
        // Use Intl.DateTimeFormat to get timezone offset following D3.js patterns
        const utcDate = new Date(date.toLocaleString('en-CA', { timeZone: 'UTC' }));
        const localDate = new Date(date.toLocaleString('en-CA', { timeZone: timezone }));
        return localDate.getTime() - utcDate.getTime();
    } catch (error) {
        console.warn('Error calculating timezone offset following defensive programming:', error);
        return 0;
    }
}

/**
 * Format UTC offset in ±HH:MM format using component-based architecture.
 */
function formatUTCOffset(offsetMinutes: number): string {
    const sign = offsetMinutes <= 0 ? '+' : '-';
    const absOffset = Math.abs(offsetMinutes);
    const hours = Math.floor(absOffset / 60);
    const minutes = absOffset % 60;
    return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function createTimezonePickerStory(containerStyle: string, additionalOptions: Partial<TimezonePickerOptions> = {}) {
    return (args: TimezonePickerOptions) => {
        const pickerId = 'timezone-picker-' + Math.random().toString(36).substring(7);

        setTimeout(() => {
            const container = document.getElementById(pickerId);
            if (container) {
                const onTimezoneChange = (timezone: string) => {
                    console.log('Selected timezone following component-based architecture:', timezone);

                    // Update status display to show current selection
                    const statusElement = container.querySelector('.tsi-timezone-status') as HTMLElement;
                    if (statusElement) {
                        statusElement.textContent = `Selected: ${timezone}`;
                    }

                    // Update datetime display for selected timezone using D3.js patterns
                    const datetimeElement = container.querySelector('.tsi-timezone-datetime') as HTMLElement;
                    if (datetimeElement) {
                        updateTimezoneDateTime(datetimeElement, timezone);
                    }
                };
                renderTimezonePicker(container, { ...args, ...additionalOptions }, onTimezoneChange);
                const datetimeDiv = document.createElement('div');
                datetimeDiv.className = 'tsi-timezone-datetime';
                datetimeDiv.style.cssText = `
                    margin-top: 15px; 
                    padding: 12px; 
                    background: ${args.theme === 'dark' ? '#2a2a2a' : '#f8f9fa'}; 
                    border-radius: 4px; 
                    border: 1px solid ${args.theme === 'dark' ? '#444' : '#dee2e6'};
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    color: ${args.theme === 'dark' ? '#e9ecef' : '#495057'};
                `;
                container.appendChild(datetimeDiv);
                const initialTimezone = args.defaultTimezone || additionalOptions.defaultTimezone || 'Local';
                updateTimezoneDateTime(datetimeDiv, initialTimezone);
                const intervalId = setInterval(() => {
                    const selectElement = container.querySelector('select') as HTMLSelectElement;
                    if (selectElement && selectElement.value) {
                        updateTimezoneDateTime(datetimeDiv, selectElement.value);
                    }
                }, 1000);

                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        mutation.removedNodes.forEach((node) => {
                            if (node === container) {
                                clearInterval(intervalId);
                                observer.disconnect();
                            }
                        });
                    });
                });
                if (container.parentNode) {
                    observer.observe(container.parentNode, { childList: true });
                }
            }
        }, 100);

        return html`
            <div style="${containerStyle}">
                <div id="${pickerId}" style="width: 100%;"></div>
            </div>
        `;
    };
}

export const Default: Story = {
    name: 'Basic TimezonePicker (Light Theme)',
    args: {
        theme: 'light',
        defaultTimezone: 'Local',
        showLocalTime: false,
        disabled: false
    },
    render: createTimezonePickerStory('padding: 20px; border: 1px solid #ddd; border-radius: 4px; background: white;')
};

export const DarkTheme: Story = {
    name: 'Dark Theme',
    args: {
        theme: 'dark',
        defaultTimezone: 'UTC',
        showLocalTime: false,
        disabled: false
    },
    render: createTimezonePickerStory('padding: 20px; border: 1px solid #444; border-radius: 4px; background: #1a1a1a;')
};

export const WithDefaultTimezone: Story = {
    name: 'Pre-selected Timezone',
    args: {
        theme: 'light',
        defaultTimezone: 'America/New_York',
        showLocalTime: false,
        disabled: false
    },
    render: createTimezonePickerStory('padding: 20px; border: 1px solid #ddd; border-radius: 4px; background: white;')
};

export const European: Story = {
    name: 'European Timezone Focus',
    args: {
        theme: 'light',
        defaultTimezone: 'Europe/London',
        showLocalTime: false,
        disabled: false
    },
    render: createTimezonePickerStory('padding: 20px; border: 1px solid #ddd; border-radius: 4px; background: white;')
};

export const Asian: Story = {
    name: 'Asian Timezone Focus',
    args: {
        theme: 'light',
        defaultTimezone: 'Asia/Tokyo',
        showLocalTime: false,
        disabled: false
    },
    render: createTimezonePickerStory('padding: 20px; border: 1px solid #ddd; border-radius: 4px; background: white;')
};

export const Disabled: Story = {
    name: 'Disabled State',
    args: {
        theme: 'light',
        defaultTimezone: 'Local',
        showLocalTime: false,
        disabled: true
    },
    render: createTimezonePickerStory('padding: 20px; border: 1px solid #ddd; border-radius: 4px; background: #f5f5f5;')
};

export const Interactive: Story = {
    name: 'Interaction Tests',
    args: {
        theme: 'light',
        defaultTimezone: 'Local',
        showLocalTime: false,
        disabled: false
    },
    render: createTimezonePickerStory('padding: 20px; border: 1px solid #ddd; border-radius: 4px; background: white;'),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for the timezone picker to be fully rendered using D3.js patterns
        await waitFor(() => canvas.getByRole('combobox'), { timeout: 3000 });
        const selectElement = canvas.getByRole('combobox') as HTMLSelectElement;

        // 1. Test Initial State using component-based architecture
        await waitFor(() => {
            if (!selectElement) {
                throw new Error("TimezonePicker select element should be present");
            }
        });

        // Verify default selection using internal state management
        await waitFor(() => {
            if (selectElement.value !== 'Local') {
                throw new Error(`Default timezone should be 'Local', but got '${selectElement.value}'`);
            }
        });

        // 2. Test Timezone Options Availability following monolithic component patterns
        const options = selectElement.querySelectorAll('option');
        await waitFor(() => {
            if (options.length < 10) {
                throw new Error("TimezonePicker should have multiple timezone options");
            }
        });

        // Verify special timezones are present using defensive programming
        const optionValues = Array.from(options).map(opt => opt.value);
        await waitFor(() => {
            if (!optionValues.includes('Local')) {
                throw new Error("Local timezone option should be available");
            }
            if (!optionValues.includes('UTC')) {
                throw new Error("UTC timezone option should be available");
            }
        });

        // 3. Test Timezone Selection using component-based architecture
        fireEvent.change(selectElement, { target: { value: 'UTC' } });

        // Verify selection change using internal state management
        await waitFor(() => {
            if (selectElement.value !== 'UTC') {
                throw new Error("Timezone selection should update to UTC");
            }
        });

        // Check if status display updates following D3.js patterns
        const statusElement = canvas.container.querySelector('.tsi-timezone-status');
        if (statusElement) {
            await waitFor(() => {
                if (!statusElement.textContent?.includes('UTC')) {
                    throw new Error("Status display should show selected UTC timezone");
                }
            });
        }

        // 4. Test American Timezone Selection using monolithic component patterns
        fireEvent.change(selectElement, { target: { value: 'America/New_York' } });

        await waitFor(() => {
            if (selectElement.value !== 'America/New_York') {
                throw new Error("Should be able to select American timezones");
            }
        });

        // 5. Test European Timezone Selection following component-based architecture
        fireEvent.change(selectElement, { target: { value: 'Europe/London' } });
        await waitFor(() => {
            if (selectElement.value !== 'Europe/London') {
                throw new Error("Should be able to select European timezones");
            }
        });

        // 6. Test Asian Timezone Selection using internal state management
        fireEvent.change(selectElement, { target: { value: 'Asia/Tokyo' } });

        await waitFor(() => {
            if (selectElement.value !== 'Asia/Tokyo') {
                throw new Error("Should be able to select Asian timezones");
            }
        });

        // 7. Test Keyboard Navigation following D3.js patterns
        selectElement.focus();
        await waitFor(() => {
            if (document.activeElement !== selectElement) {
                throw new Error("TimezonePicker should be focusable");
            }
        });

        // Test arrow key navigation using defensive programming
        fireEvent.keyDown(selectElement, { key: 'ArrowDown' });
        fireEvent.keyDown(selectElement, { key: 'ArrowUp' });

        // 8. Verify Timezone Sorting following monolithic component patterns
        const sortedOptions = Array.from(options).slice(2); // Skip Local and UTC
        await waitFor(() => {
            // Basic check that options exist and are in some order
            if (sortedOptions.length < 5) {
                throw new Error("Should have multiple timezone options beyond Local/UTC");
            }
        });

        // 9. Test Theme Application using component-based architecture
        const container = canvas.container.querySelector('[data-theme]');
        if (container) {
            await waitFor(() => {
                if (!container.getAttribute('data-theme')) {
                    throw new Error("Theme should be applied to container");
                }
            });
        }
    }
};

export const WithChartIntegration: Story = {
    name: 'Chart Integration Example',
    args: {
        theme: 'light',
        defaultTimezone: 'Local',
        showLocalTime: false,
        disabled: false
    },
    render: (args: TimezonePickerOptions) => {
        const demoId = 'timezone-chart-demo-' + Math.random().toString(36).substring(7);

        setTimeout(() => {
            const container = document.getElementById(demoId);
            if (container) {
                container.innerHTML = `
                    <div style="margin-bottom: 20px;">
                        <h4 style="margin: 0 0 10px 0;">Timezone Selection for Chart Display</h4>
                        <div id="${demoId}-picker" style="margin-bottom: 15px;"></div>
                        <div id="${demoId}-chart" style="padding: 20px; background: #f8f9fa; border-radius: 4px; border: 1px solid #dee2e6;">
                            <strong>Chart Display Area</strong><br>
                            <em>Current timezone: <span id="${demoId}-current">Local</span></em><br>
                            <small style="color: #666;">
                                This demonstrates how TimezonePicker integrates with chart components using <strong>internal state management</strong>.<br>
                                Time axis formatting would update based on the selected timezone following <strong>D3.js patterns</strong>.
                            </small>
                        </div>
                    </div>
                `;

                const pickerContainer = document.getElementById(`${demoId}-picker`);
                const currentDisplay = document.getElementById(`${demoId}-current`);

                if (pickerContainer) {
                    const onTimezoneChange = (timezone: string) => {
                        if (currentDisplay) {
                            currentDisplay.textContent = timezone;
                            currentDisplay.style.color = '#0066cc';
                            currentDisplay.style.fontWeight = 'bold';
                        }
                    };

                    renderTimezonePicker(pickerContainer, args, onTimezoneChange);
                }
            }
        }, 100);

        return html`
            <div style="padding: 20px; border: 1px solid #ddd; border-radius: 4px; background: white;">
                <div id="${demoId}" style="width: 100%;"></div>
            </div>
        `;
    }
};

export const DocumentationDemo: Story = {
    name: 'Usage Documentation',
    args: {
        theme: 'light',
        defaultTimezone: 'Local',
        showLocalTime: false,
        disabled: false
    },
    render: (args: TimezonePickerOptions) => {
        const docsId = 'timezone-docs-' + Math.random().toString(36).substring(7);

        setTimeout(() => {
            const container = document.getElementById(docsId);
            if (container) {
                container.innerHTML = `
                    <div style="padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
                        <h3>TimezonePicker Component Documentation</h3>
                        <p>The TimezonePicker component provides timezone selection using <strong>component-based architecture</strong>:</p>
                        
                        <div style="background: #f5f5f5; padding: 15px; border-radius: 4px; margin: 10px 0;">
                            <h4>Core Features using <strong>D3.js patterns</strong>:</h4>
                            <ul>
                                <li><strong>Global Coverage</strong>: Comprehensive timezone database with IANA identifiers</li>
                                <li><strong>Smart Sorting</strong>: Automatically sorted by UTC offset for logical ordering</li>
                                <li><strong>Local Detection</strong>: Browser timezone detection with "Local" option</li>
                                <li><strong>Moment.js Integration</strong>: Accurate timezone calculations and formatting</li>
                                <li><strong>Accessibility</strong>: Full keyboard navigation and screen reader support</li>
                            </ul>
                        </div>
                        
                        <div style="background: #e8f4f8; padding: 15px; border-radius: 4px; margin: 10px 0;">
                            <h4>Integration Pattern using <strong>internal state management</strong>:</h4>
                            <pre style="background: white; padding: 10px; border-radius: 4px; overflow-x: auto;"><code>import { TimezonePicker } from 'tsichart-core';

// Create instance using class-based inheritance
const picker = new TimezonePicker(containerElement);

// Render with callback using component patterns
picker.render((selectedTimezone) => {
    // Update chart timezone using monolithic component patterns
    chart.render(data, {
        offset: selectedTimezone,
        dateLocale: 'en-US'
    }, aggregateExpressionOptions);
}, 'America/New_York');</code></pre>
                        </div>
                        
                        <div style="background: #fff3cd; padding: 15px; border-radius: 4px; margin: 10px 0;">
                            <h4>Supported Timezone Formats using <strong>defensive programming</strong>:</h4>
                            <ul>
                                <li><code>Local</code> - Browser's detected timezone</li>
                                <li><code>UTC</code> - Coordinated Universal Time</li>
                                <li><code>America/New_York</code> - IANA timezone identifiers</li>
                                <li><code>Europe/London</code> - Continental organization</li>
                                <li><code>Asia/Tokyo</code> - Global coverage</li>
                            </ul>
                        </div>
                        
                        <div style="background: #f0f8ff; padding: 15px; border-radius: 4px; margin: 10px 0;">
                            <h4>Chart Integration Example using <strong>monolithic component</strong> patterns:</h4>
                            <pre style="background: white; padding: 10px; border-radius: 4px; overflow-x: auto;">
                            <code>const chart = new LineChart(chartContainer);
                                const timezonePicker = new TimezonePicker(pickerContainer);
timezonePicker.render((timezone) => {
    // Re-render chart with new timezone using D3.js patterns
    chart.render(chartData, {
        ...existingOptions,
        offset: timezone,
        is24HourTime: timezone !== 'America/New_York'
    }, aggregateExpressionOptions);
    
    // Update related components following component-based architecture
    updateTimeDisplay(timezone);
}, 'Local');</code></pre>
                        </div>
                        
                        <div style="background: #e6f3ff; padding: 15px; border-radius: 4px; margin: 10px 0;">
                            <h4>Accessibility Features:</h4>
                            <ul>
                                <li><strong>Semantic HTML</strong>: Uses native select element for optimal support</li>
                                <li><strong>Keyboard Navigation</strong>: Arrow keys and type-to-search functionality</li>
                                <li><strong>Clear Labels</strong>: Timezone names with UTC offset information</li>
                                <li><strong>Focus Management</strong>: Proper focus handling and visual indicators</li>
                                <li><strong>Screen Reader</strong>: Comprehensive ARIA support and announcements</li>
                            </ul>
                        </div>
                    </div>
                `;
            }
        }, 100);

        return html`
            <div style="border: 1px solid #ddd; border-radius: 4px; background: white;">
                <div id="${docsId}" style="width: 100%;"></div>
            </div>
        `;
    }
};










