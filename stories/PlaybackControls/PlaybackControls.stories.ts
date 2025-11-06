import type { Meta, StoryObj } from '@storybook/web-component-vite';
import { html } from 'lit';
import PlaybackControls from '../../packages/core/src/components/PlaybackControls';
import { fireEvent, screen, within, waitFor } from 'storybook/test';


interface IPlaybackControlsOptions {
    theme?: 'light' | 'dark';
    offset?: string;
    is24HourTime?: boolean;
    dateLocale?: string;
    xAxisHidden?: boolean;
    intervalMillis?: number;
    stepSizeMillis?: number;
    onSelectTimeStamp?: (timestamp: Date) => void;
}

const meta: Meta<IPlaybackControlsOptions> = {
    title: 'Components/PlaybackControls',
    component: 'PlaybackControls',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
# PlaybackControls Component

Interactive timeline control with play/pause functionality for time series data playback with the following features:

## Key Features
- **Timeline Slider**: Interactive timeline with draggable handle for time navigation
- **Play/Pause Controls**: Automatic time progression with customizable intervals
- **Time Axis**: Formatted time labels showing the temporal range
- **Time Display**: Current timestamp display with locale formatting
- **Responsive Design**: Adapts to container width automatically
- **Theming**: Support for light and dark themes
- **Accessibility**: Full keyboard navigation and ARIA support

## Usage Example

\`\`\`typescript
import TsiClient from 'tsichart-core';

// Create playback controls instance
const tsiClient = new TsiClient();
const playbackControls = new tsiClient.PlaybackControls(containerElement);

// Define time range and settings
const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
const endTime = new Date(); // Now
const playbackSettings = {
    intervalMillis: 2000,  // Play every 2 seconds
    stepSizeMillis: 60000  // Step forward 1 minute each time
};

// Render the controls
playbackControls.render(
    startTime,
    endTime,
    (selectedTimestamp) => {
        console.log('Time selected:', selectedTimestamp);
        // Update your charts or data visualization here
    },
    {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: 'en-US'
    },
    playbackSettings
);

// Programmatic control
playbackControls.play();   // Start automatic playback
playbackControls.pause();  // Pause playback
playbackControls.next();   // Step to next timestamp
\`\`\`

## Time Navigation Modes
- **Manual**: Drag the handle to any position on the timeline
- **Automatic**: Use play/pause buttons for continuous time progression
- **Step-by-step**: Use next() method for precise control
- **Programmatic**: Set time ranges and callbacks for integration with other components

## Integration with Charts
PlaybackControls is designed to work seamlessly with LineChart and other temporal components in the tsichart-core library for synchronized time-based data exploration.       
                `
            }
        }
    },
    argTypes: {
        theme: {
            control: { type: 'select' },
            options: ['light', 'dark'],
            description: 'Visual theme for the playback controls',
            table: { defaultValue: { summary: 'light' } }
        },
        offset: {
            control: { type: 'select' },
            options: ['Local', 'UTC', 'EST', 'PST', 'CST', 'MST'],
            description: 'Timezone offset for time display',
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
            description: 'Locale for time formatting',
            table: { defaultValue: { summary: 'en-US' } }
        },
        xAxisHidden: {
            control: 'boolean',
            description: 'Hide the time axis labels',
            table: { defaultValue: { summary: 'false' } }
        },
        intervalMillis: {
            control: { type: 'number', min: 500, max: 10000, step: 500 },
            description: 'Playback interval in milliseconds (minimum 1000ms)',
            table: { defaultValue: { summary: '2000' } }
        },
        stepSizeMillis: {
            control: { type: 'number', min: 1000, max: 300000, step: 1000 },
            description: 'Time step size in milliseconds for each progression',
            table: { defaultValue: { summary: '60000' } }
        }
    }
}

export default meta;
type Story = StoryObj<IPlaybackControlsOptions>;

function generateTimeRange(scenario: 'hourly' | 'daily' | 'weekly' | 'monthly') {
    const now = new Date();

    switch (scenario) {
        case 'hourly':
            return {
                start: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
                end: now,
                stepSizeMillis: 5 * 60 * 1000
            };
        case 'daily':
            return {
                start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
                end: now,
                stepSizeMillis: 60 * 60 * 1000
            };
        case 'weekly':
            return {
                start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
                end: now,
                stepSizeMillis: 6 * 60 * 60 * 1000
            };
        case 'monthly':
            return {
                start: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
                end: now,
                stepSizeMillis: 24 * 60 * 60 * 1000
            };
        default:
            return generateTimeRange('daily');
    }
}

function renderPlaybackControls(container: HTMLElement, options: IPlaybackControlsOptions = {}, scenario: string = 'daily') {
    container.innerHTML = '';

    try {
        console.log('Rendering PlaybackControls with options:', options);
        const timeRange = generateTimeRange(scenario as any);
        const playbackControls = new PlaybackControls(container, timeRange.start);
        const controlOptions = {
            theme: 'light',
            offset: 'Local',
            is24HourTime: true,
            dateLocale: 'en-US',
            xAxisHidden: false,
            ...options
        };
        const playbackSettings = {
            intervalMillis: Math.max(options.intervalMillis || 2000, 1000), // Enforce minimum 1000ms
            stepSizeMillis: options.stepSizeMillis || timeRange.stepSizeMillis
        };
        const onSelectTimeStamp = (timestamp: Date) => {
            console.log('PlaybackControls - Time selected:', {
                timestamp: timestamp,
                formattedTime: timestamp.toISOString()
            });
            const feedbackDiv = container.querySelector('.tsi-feedback') as HTMLElement;
            if (feedbackDiv) {
                feedbackDiv.textContent = `Selected: ${timestamp.toLocaleString()}`;
                feedbackDiv.style.opacity = '1';
                setTimeout(() => {
                    if (feedbackDiv) feedbackDiv.style.opacity = '0.7';
                }, 200);
            }

            if (options.onSelectTimeStamp) {
                options.onSelectTimeStamp(timestamp);
            }
        };
        playbackControls.render(
            timeRange.start,
            timeRange.end,
            onSelectTimeStamp,
            controlOptions,
            playbackSettings
        );
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'tsi-feedback';
        feedbackDiv.style.cssText = `
            margin-top: 16px;
            padding: 8px 12px;
            background: ${controlOptions.theme === 'dark' ? '#2d2d2d' : '#f0f0f0'};
            color: ${controlOptions.theme === 'dark' ? '#fff' : '#333'};
            border-radius: 4px;
            font-family: monospace;
            font-size: 12px;
            opacity: 0.7;
            transition: opacity 0.2s ease;
        `;
        feedbackDiv.textContent = `Initial time: ${timeRange.start.toLocaleString()}`;
        container.appendChild(feedbackDiv);

        return playbackControls;
    } catch (error) {
        console.error('PlaybackControls rendering error:', error);
        container.innerHTML = `<div style="color: red; padding: 20px; font-family: monospace;">
            <h3>Error rendering PlaybackControls</h3>
            <p><strong>Error:</strong> ${error.message}</p>
            <p><strong>Stack:</strong></p>
            <pre style="white-space: pre-wrap; font-size: 12px;">${error.stack}</pre>
            <p><small>Check browser console for more details</small></p>
        </div>`;
    }
}

function createPlaybackControlsStory(containerStyle: string, scenario: string = 'daily') {
    return (args: IPlaybackControlsOptions) => {
        const controlsId = 'playback-controls-' + Math.random().toString(36).substring(7);

        setTimeout(() => {
            const container = document.getElementById(controlsId);
            if (container) {
                renderPlaybackControls(container, args, scenario);
            }
        }, 100);

        return html`
            <div style="${containerStyle}">
                <div id="${controlsId}" style="height: 100%; width: 100%;"></div>
            </div>
        `;
    };
}

export const Default: Story = {
    name: 'Daily Range (Default)',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: 'en-US',
        xAxisHidden: false,
        intervalMillis: 2000,
        stepSizeMillis: 60000
    },
    render: createPlaybackControlsStory('height: 120px; width: 100%; padding: 20px; border: 1px solid #ddd; border-radius: 4px;')
};

export const DarkTheme: Story = {
    name: 'Dark Theme',
    args: {
        theme: 'dark',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: 'en-US',
        xAxisHidden: false,
        intervalMillis: 2000,
        stepSizeMillis: 60000
    },
    render: createPlaybackControlsStory('height: 120px; width: 100%; padding: 20px; background: #1a1a1a; border: 1px solid #444; border-radius: 4px;')
};

export const TwelveHourFormat: Story = {
    name: '12-Hour Time Format',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: false,
        dateLocale: 'en-US',
        xAxisHidden: false,
        intervalMillis: 2000,
        stepSizeMillis: 60000
    },
    render: createPlaybackControlsStory('height: 120px; width: 100%; padding: 20px; border: 1px solid #ddd; border-radius: 4px;')
};

export const UTCTimezone: Story = {
    name: 'UTC Timezone',
    args: {
        theme: 'light',
        offset: 'UTC',
        is24HourTime: true,
        dateLocale: 'en-US',
        xAxisHidden: false,
        intervalMillis: 2000,
        stepSizeMillis: 60000
    },
    render: createPlaybackControlsStory('height: 120px; width: 100%; padding: 20px; border: 1px solid #ddd; border-radius: 4px;')
};

export const HourlyRange: Story = {
    name: 'Hourly Time Range',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: 'en-US',
        xAxisHidden: false,
        intervalMillis: 1000,
        stepSizeMillis: 30000
    },
    render: createPlaybackControlsStory('height: 120px; width: 100%; padding: 20px; border: 1px solid #ddd; border-radius: 4px;', 'hourly')
};

export const WeeklyRange: Story = {
    name: 'Weekly Time Range',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: 'en-US',
        xAxisHidden: false,
        intervalMillis: 3000,
        stepSizeMillis: 6 * 60 * 60 * 1000
    },
    render: createPlaybackControlsStory('height: 120px; width: 100%; padding: 20px; border: 1px solid #ddd; border-radius: 4px;', 'weekly')
};

export const MonthlyRange: Story = {
    name: 'Monthly Time Range',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: 'en-US',
        xAxisHidden: false,
        intervalMillis: 4000,
        stepSizeMillis: 24 * 60 * 60 * 1000
    },
    render: createPlaybackControlsStory('height: 120px; width: 100%; padding: 20px; border: 1px solid #ddd; border-radius: 4px;', 'monthly')
};

export const GermanLocale: Story = {
    name: 'German Locale (DE)',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: 'de-DE',
        xAxisHidden: false,
        intervalMillis: 2000,
        stepSizeMillis: 60000
    },
    render: createPlaybackControlsStory('height: 120px; width: 100%; padding: 20px; border: 1px solid #ddd; border-radius: 4px;')
};

export const HiddenTimeAxis: Story = {
    name: 'Hidden Time Axis',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: 'en-US',
        xAxisHidden: true,
        intervalMillis: 2000,
        stepSizeMillis: 60000
    },
    render: createPlaybackControlsStory('height: 80px; width: 100%; padding: 20px; border: 1px solid #ddd; border-radius: 4px;')
};

export const FastPlayback: Story = {
    name: 'Fast Playback (1s intervals)',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: 'en-US',
        xAxisHidden: false,
        intervalMillis: 1000,
        stepSizeMillis: 15000
    },
    render: createPlaybackControlsStory('height: 120px; width: 100%; padding: 20px; border: 1px solid #ddd; border-radius: 4px;')
};

export const Interactive: Story = {
    name: 'Interaction Tests',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: 'en-US',
        xAxisHidden: false,
        intervalMillis: 2000,
        stepSizeMillis: 60000
    },
    render: createPlaybackControlsStory('height: 140px; width: 100%; padding: 20px; border: 1px solid #ddd; border-radius: 4px;'),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(() => {
            const playbackContainer = canvasElement.querySelector('.tsi-playback-timeline');
            if (!playbackContainer) {
                throw new Error("PlaybackControls should render timeline container");
            }
        }, { timeout: 3000 });
        const playButton = canvasElement.querySelector('.tsi-play-button');
        if (!playButton) {
            throw new Error("Play button not found");
        }
        await waitFor(() => {
            if (!playButton.classList.contains('tsi-play-button')) {
                throw new Error("Should start in play state (not playing)");
            }
        });
        fireEvent.click(playButton);
        await waitFor(() => {
            if (!playButton.classList.contains('tsi-pause-button')) {
                throw new Error("Should change to pause button after clicking play");
            }
        }, { timeout: 1000 });
        await new Promise(resolve => setTimeout(resolve, 1500));

        fireEvent.click(playButton);
        await waitFor(() => {
            if (!playButton.classList.contains('tsi-play-button')) {
                throw new Error("Should change back to play button after clicking pause");
            }
        });
        const handle = canvasElement.querySelector('.tsi-playback-handle');
        if (handle) {
            console.log('Testing timeline handle drag functionality');
            const initialCx = parseFloat(handle.getAttribute('cx') || '0');
            const gWrapper = canvasElement.querySelector('svg g');
            if (gWrapper) {
                fireEvent.mouseDown(gWrapper, { clientX: initialCx + 50, clientY: 50 });
                fireEvent.mouseMove(gWrapper, { clientX: initialCx + 100, clientY: 50, buttons: 1 });
                fireEvent.mouseUp(gWrapper);
                await waitFor(() => {
                    const newCx = parseFloat(handle.getAttribute('cx') || '0');
                    if (newCx === initialCx) {
                        throw new Error("Handle should move when dragged");
                    }
                });
            }
        }
        const timestampDisplay = canvasElement.querySelector('.tsi-playback-timestamp');
        if (timestampDisplay) {
            await waitFor(() => {
                const timestampText = timestampDisplay.textContent;
                if (!timestampText || timestampText.length === 0) {
                    throw new Error("Timestamp display should show formatted time");
                }
            });
        }
        const timeAxis = canvasElement.querySelector('.xAxis');
        if (timeAxis) {
            await waitFor(() => {
                const axisTicks = timeAxis.querySelectorAll('.tick');
                if (axisTicks.length === 0) {
                    throw new Error("Time axis should have tick marks");
                }
            });
        }
        const feedback = canvasElement.querySelector('.tsi-feedback');
        if (feedback) {
            await waitFor(() => {
                const feedbackText = feedback.textContent;
                if (!feedbackText || !feedbackText.includes('time:')) {
                    throw new Error("Feedback element should show time selection information");
                }
            });
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
        xAxisHidden: false,
        intervalMillis: 2000,
        stepSizeMillis: 60000
    },
    render: createPlaybackControlsStory('height: 140px; width: 100%; padding: 30px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);')
};