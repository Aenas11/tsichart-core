import type { Meta, StoryObj } from '@storybook/web-component-vite';
import { html } from 'lit';
import LineChart from '../../packages/core/src/components/LineChart';
import GroupedBarChart from '../../packages/core/src/components/GroupedBarChart';
import PlaybackControls from '../../packages/core/src/components/PlaybackControls';
import PieChart from '../../packages/core/src/components/PieChart';
import Heatmap from '../../packages/core/src/components/Heatmap';


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
    render: (args: IPlaybackControlsOptions) => {
        const containerId = 'playback-with-chart-' + Math.random().toString(36).substring(7);
        setTimeout(() => {
            const container = document.getElementById(containerId);
            if (container) {
                renderPlaybackControlsWithLineChart(container, args);
            }
        }, 100);

        return html`
            <div style="height: 600px; width: 100%; border: 1px solid #ddd; border-radius: 4px; background: ${args.theme === 'dark' ? '#1a1a1a' : '#fff'};">
                <div id="${containerId}" style="height: 100%; width: 100%; padding: 20px; box-sizing: border-box;"></div>
            </div>
        `;
    }
}

function generateTimeSeriesData() {
    const data = [];
    const now = new Date();
    const startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

    // Create 3 series with hourly data points
    for (let seriesIndex = 0; seriesIndex < 3; seriesIndex++) {
        const seriesName = `Sensor${seriesIndex + 1}`;
        const splitByData = {};

        // Generate data for each location
        ['LocationA', 'LocationB'].forEach(location => {
            const timeSeries = {};

            for (let hour = 0; hour < 24; hour++) {
                const timestamp = new Date(startTime.getTime() + hour * 60 * 60 * 1000);
                const baseValue = 50 + seriesIndex * 20;
                const value = baseValue +
                    Math.sin(hour / 4) * 15 +
                    Math.cos(hour / 6) * 10 +
                    (Math.random() - 0.5) * 8;

                timeSeries[timestamp.toISOString()] = {
                    value: parseFloat(value.toFixed(2)),
                    temperature: 20 + Math.sin(hour / 6) * 5 + Math.random() * 2
                };
            }

            splitByData[location] = timeSeries;
        });

        data.push({ [seriesName]: splitByData });
    }

    return data;
}

function renderPlaybackControlsWithLineChart(container: HTMLElement, options: IPlaybackControlsOptions = {}) {
    container.innerHTML = '';

    try {



        // Generate sample time series data for the last 24 hours
        const chartData = generateTimeSeriesData();
        const timeRange = {
            start: new Date(Date.now() - 24 * 60 * 60 * 1000),
            end: new Date(),
            stepSizeMillis: options.stepSizeMillis || 60000
        };

        // Create containers for chart and controls
        const chartContainer = document.createElement('div');
        chartContainer.style.cssText = 'height: 70%; width: 100%; margin-bottom: 20px;';

        const controlsContainer = document.createElement('div');
        controlsContainer.style.cssText = 'height: 25%; width: 100%; min-height: 120px;';

        const statusContainer = document.createElement('div');
        statusContainer.className = 'tsi-status-feedback';
        statusContainer.style.cssText = `
            height: 5%; 
            padding: 8px 12px; 
            font-family: monospace; 
            font-size: 12px;
            background: ${options.theme === 'dark' ? '#2d2d2d' : '#f0f0f0'};
            color: ${options.theme === 'dark' ? '#fff' : '#333'};
            border-radius: 4px;
            opacity: 0.8;
        `;

        container.appendChild(chartContainer);
        container.appendChild(controlsContainer);
        container.appendChild(statusContainer);
        const lineChart = new LineChart(chartContainer);

        // Chart options with brush enabled for additional interaction
        const chartOptions = {
            theme: options.theme || 'light',
            legend: 'shown',
            grid: true,
            tooltip: true,
            yAxisState: 'stacked',
            brushMoveAction: (startTime, endTime) => {
                console.log('Brush selection:', { startTime, endTime });
                updateStatus(`Brush: ${startTime.toLocaleTimeString()} - ${endTime.toLocaleTimeString()}`);
            },
            onMouseover: (aggKey, splitBy) => {
                console.log('Chart hover:', { aggKey, splitBy });
            },
            markers: [], // Will be updated by playback controls
            onMarkersChange: (markers) => {
                console.log('Markers updated:', markers);
            }
        };

        // Initial chart render
        lineChart.render(chartData, chartOptions, {});

        // Create PlaybackControls instance
        const playbackControls = new PlaybackControls(controlsContainer, timeRange.start);

        const controlOptions = {
            theme: options.theme || 'light',
            offset: options.offset || 'Local',
            is24HourTime: options.is24HourTime !== false,
            dateLocale: options.dateLocale || 'en-US',
            xAxisHidden: options.xAxisHidden || false
        };

        const playbackSettings = {
            intervalMillis: Math.max(options.intervalMillis || 1500, 1000),
            stepSizeMillis: options.stepSizeMillis || 60000
        };

        const updateStatus = (message: string) => {
            statusContainer.textContent = message;
        };

        // Callback for time selection - this is where the integration happens
        const onSelectTimeStamp = (selectedTime: Date) => {
            console.log('Time selected from playback controls:', selectedTime);

            // Update chart with a marker at the selected time
            const updatedChartOptions = {
                ...chartOptions,
                markers: [[selectedTime.getTime(), `Playback: ${selectedTime.toLocaleTimeString()}`]],
                // Optional: Set brush to focus around the selected time
                brushStartTime: new Date(selectedTime.getTime() - 30 * 60 * 1000), // 30 min before
                brushEndTime: new Date(selectedTime.getTime() + 30 * 60 * 1000)    // 30 min after
            };

            // Re-render chart with updated options
            lineChart.render(chartData, updatedChartOptions, {});

            // Update status
            updateStatus(`Playback Time: ${selectedTime.toLocaleString(options.dateLocale || 'en-US')}`);

            // Call user callback if provided
            if (options.onSelectTimeStamp) {
                options.onSelectTimeStamp(selectedTime);
            }

            return {}; // Required by PlaybackControls interface
        };

        // Render playback controls
        playbackControls.render(
            timeRange.start,
            timeRange.end,
            onSelectTimeStamp,
            controlOptions,
            playbackSettings
        );

        updateStatus(`Ready - Time range: ${timeRange.start.toLocaleTimeString()} to ${timeRange.end.toLocaleTimeString()}`);

        return { lineChart, playbackControls };

    } catch (error: any) {
        console.error('Error rendering PlaybackControls with LineChart:', error);
        container.innerHTML = `
            <div style="color: red; padding: 20px; font-family: monospace;">
                <h3>Error rendering PlaybackControls with LineChart</h3>
                <p><strong>Error:</strong> ${error?.message || 'Unknown error'}</p>
                <pre style="white-space: pre-wrap; font-size: 12px;">${error?.stack || 'No stack trace'}</pre>
            </div>
        `;
    }
}


export const WithBarChart: Story = {
    name: 'With BarChart Integration',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: 'en-US',
        xAxisHidden: false,
        intervalMillis: 2000,
        stepSizeMillis: 60000
    },
    render: (args: IPlaybackControlsOptions) => {
        const containerId = 'playback-with-barchart-' + Math.random().toString(36).substring(7);

        setTimeout(() => {
            const container = document.getElementById(containerId);
            if (container) {
                renderPlaybackControlsWithBarChart(container, args);
            }
        }, 100);

        return html`
            <div style="height: 700px; width: 100%; border: 1px solid #ddd; border-radius: 4px; background: ${args.theme === 'dark' ? '#1a1a1a' : '#fff'};">
                <div id="${containerId}" style="height: 100%; width: 100%; padding: 20px; box-sizing: border-box;"></div>
            </div>
        `;
    }
};

function generateBarChartTimeSeriesData() {
    // Generate data for the last 24 hours with 4-hour intervals
    const timestamps = [];
    const now = new Date();
    const startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

    // Create 6 timestamps (every 4 hours)
    for (let i = 0; i <= 6; i++) {
        const timestamp = new Date(startTime.getTime() + i * 4 * 60 * 60 * 1000);
        timestamps.push(timestamp.toISOString());
    }

    const factories = ['Factory A', 'Factory B', 'Factory C'];
    const productionLines = ['', 'Line 1', 'Line 2'];

    return factories.map((factory, factoryIndex) => {
        const factoryData = {};
        factoryData[factory] = {};

        productionLines.forEach((line) => {
            factoryData[factory][line] = {};

            timestamps.forEach((timestamp) => {
                const baseProduction = 80 + factoryIndex * 25;
                const lineMultiplier = line === '' ? 1 : 0.4 + (parseInt(line.split(' ')[1]) || 1) * 0.3;

                // Add some time-based variation to show progression
                const timeIndex = timestamps.indexOf(timestamp);
                const timeProgression = 1 + Math.sin(timeIndex / 3) * 0.2; // Cyclical variation

                factoryData[factory][line][timestamp] = {
                    Production: Math.round(
                        (baseProduction + Math.random() * 30 - 15) * lineMultiplier * timeProgression * 10
                    ) / 10,
                    Quality: Math.round((90 + Math.random() * 8 - 4) * 10) / 10,
                    Efficiency: Math.round((85 + Math.random() * 12 - 6) * 10) / 10,
                };
            });
        });

        return factoryData;
    });
}


function renderPlaybackControlsWithBarChart(container: HTMLElement, options: IPlaybackControlsOptions = {}) {
    container.innerHTML = '';

    try {
        console.log('Rendering PlaybackControls with BarChart integration');
        const chartData = generateBarChartTimeSeriesData();
        const allTimestamps = [];
        chartData.forEach(aggregate => {
            const aggKey = Object.keys(aggregate)[0];
            const splitBys = aggregate[aggKey];
            Object.keys(splitBys).forEach(splitBy => {
                Object.keys(splitBys[splitBy]).forEach(timestamp => {
                    if (!allTimestamps.includes(timestamp)) {
                        allTimestamps.push(timestamp);
                    }
                });
            });
        });

        allTimestamps.sort();

        const timeRange = {
            start: new Date(allTimestamps[0]),
            end: new Date(allTimestamps[allTimestamps.length - 1]),
            stepSizeMillis: options.stepSizeMillis || 4 * 60 * 60 * 1000 // 4 hours
        };
        const chartContainer = document.createElement('div');
        chartContainer.style.cssText = 'height: 65%; width: 100%; margin-bottom: 20px;';

        const controlsContainer = document.createElement('div');
        controlsContainer.style.cssText = 'height: 25%; width: 100%; min-height: 120px;';

        const statusContainer = document.createElement('div');
        statusContainer.className = 'tsi-status-feedback';
        statusContainer.style.cssText = `
            height: 10%; 
            padding: 12px; 
            font-family: monospace; 
            font-size: 13px;
            background: ${options.theme === 'dark' ? '#2d2d2d' : '#f8f9fa'};
            color: ${options.theme === 'dark' ? '#fff' : '#333'};
            border-radius: 4px;
            border: 1px solid ${options.theme === 'dark' ? '#444' : '#e9ecef'};
            opacity: 0.9;
        `;

        container.appendChild(chartContainer);
        container.appendChild(controlsContainer);
        container.appendChild(statusContainer);
        const barChart = new GroupedBarChart(chartContainer);

        const chartOptions = {
            theme: options.theme || 'light',
            legend: 'shown',
            tooltip: true,
            stacked: false,
            zeroYAxis: true,
            grid: true,
            hideChartControlPanel: false,
            scaledToCurrentTime: false,
            keepSplitByColor: true,
            timestamp: allTimestamps[0],
        };

        const getDataForTimestamp = (targetTimestamp: string) => {
            return chartData.map(aggregate => {
                const aggKey = Object.keys(aggregate)[0];
                const filteredAggregate = {};
                filteredAggregate[aggKey] = {};
                Object.keys(aggregate[aggKey]).forEach(splitBy => {
                    if (aggregate[aggKey][splitBy][targetTimestamp]) {
                        filteredAggregate[aggKey][splitBy] = {
                            [targetTimestamp]: aggregate[aggKey][splitBy][targetTimestamp]
                        };
                    }
                });

                return filteredAggregate;
            }).filter(aggregate => {
                const aggKey = Object.keys(aggregate)[0];
                return Object.keys(aggregate[aggKey]).length > 0;
            });
        };

        const initialData = getDataForTimestamp(allTimestamps[0]);
        barChart.render(initialData, chartOptions, []);

        const playbackControls = new PlaybackControls(controlsContainer, timeRange.start);

        const controlOptions = {
            theme: options.theme || 'light',
            offset: options.offset || 'Local',
            is24HourTime: options.is24HourTime !== false,
            dateLocale: options.dateLocale || 'en-US',
            xAxisHidden: options.xAxisHidden || false
        };

        const playbackSettings = {
            intervalMillis: Math.max(options.intervalMillis || 2000, 1000),
            stepSizeMillis: options.stepSizeMillis || 4 * 60 * 60 * 1000 // 4 hours
        };

        const updateStatus = (message: string, isHighlight: boolean = false) => {
            statusContainer.textContent = message;
            statusContainer.style.background = isHighlight
                ? (options.theme === 'dark' ? '#0d5aa7' : '#cce5ff')
                : (options.theme === 'dark' ? '#2d2d2d' : '#f8f9fa');

            if (isHighlight) {
                setTimeout(() => {
                    statusContainer.style.background = options.theme === 'dark' ? '#2d2d2d' : '#f8f9fa';
                }, 1000);
            }
        };

        const onSelectTimeStamp = (selectedTime: Date) => {
            console.log('Time selected from playback controls:', selectedTime);

            const selectedTimestamp = selectedTime.toISOString();
            const closestTimestamp = allTimestamps.reduce((closest, current) => {
                const currentDiff = Math.abs(new Date(current).getTime() - selectedTime.getTime());
                const closestDiff = Math.abs(new Date(closest).getTime() - selectedTime.getTime());
                return currentDiff < closestDiff ? current : closest;
            });

            const timestampData = getDataForTimestamp(closestTimestamp);

            if (timestampData.length > 0) {
                const updatedChartOptions = {
                    ...chartOptions,
                    timestamp: closestTimestamp
                };
                barChart.render(timestampData, updatedChartOptions, []);

                updateStatus(
                    `Showing data for: ${new Date(closestTimestamp).toLocaleString(options.dateLocale || 'en-US')} | ` +
                    `Factories: ${timestampData.length} | Selected: ${selectedTime.toLocaleTimeString()}`,
                    true
                );
            } else {
                updateStatus(`No data available for: ${selectedTime.toLocaleString(options.dateLocale || 'en-US')}`);
            }
            if (options.onSelectTimeStamp) {
                options.onSelectTimeStamp(selectedTime);
            }
        };
        playbackControls.render(
            timeRange.start,
            timeRange.end,
            onSelectTimeStamp,
            controlOptions,
            playbackSettings
        );

        updateStatus(
            `Ready - Time range: ${timeRange.start.toLocaleString()} to ${timeRange.end.toLocaleString()} | ` +
            `Available timestamps: ${allTimestamps.length}`
        );

        return { barChart, playbackControls };

    } catch (error) {
        console.error('Error rendering PlaybackControls with BarChart:', error);
        container.innerHTML = `
            <div style="color: red; padding: 20px; font-family: monospace;">
                <h3>Error rendering PlaybackControls with BarChart</h3>
                <p><strong>Error:</strong> ${error.message}</p>
                <pre style="white-space: pre-wrap; font-size: 12px;">${error.stack}</pre>
            </div>
        `;
    }
}

// function generateSamplePieData() {
//     const data: any[] = [];
//     const regions = ['North', 'South', 'East', 'West'];
//     const timestamps = [
//         new Date('2023-01-01T00:00:00Z'),
//         new Date('2023-04-01T00:00:00Z'),
//         new Date('2023-07-01T00:00:00Z'),
//         new Date('2023-10-01T00:00:00Z')
//     ];

//     const salesData: Record<string, Record<string, any>> = {};

//     regions.forEach((region, regionIndex) => {
//         const regionData: Record<string, any> = {};
//         timestamps.forEach((timestamp, timestampIndex) => {
//             const seasonalMultiplier = 1 + Math.sin(timestampIndex * Math.PI / 2) * 0.3;
//             const regionMultiplier = 1 + (regionIndex * 0.2);

//             const baseRevenue = 20000 + (regionIndex * 5000);
//             const revenue = baseRevenue * seasonalMultiplier * (0.8 + Math.random() * 0.4);
//             const quantity = Math.floor(revenue / 200);
//             const profit = revenue * (0.15 + regionIndex * 0.05);

//             regionData[timestamp.toISOString()] = {
//                 revenue: Math.round(revenue),
//                 quantity: quantity,
//                 profit: Math.round(profit)
//             };
//         });
//         salesData[region] = regionData;
//     });

//     data.push({ 'Sales': salesData });
//     console.log(data, "pie data")
//     return data;
// }

// export const WithPieChart: Story = {
//     name: 'With PieChart Integration',
//     args: {
//         theme: 'light',
//         offset: 'Local',
//         is24HourTime: true,
//         dateLocale: 'en-US',
//         xAxisHidden: false,
//         intervalMillis: 2500,
//         stepSizeMillis: 3 * 30 * 24 * 60 * 60 * 1000 // Fixed: 3 months (not 3 * 3 which was 9 days)
//     },
//     render: (args: IPlaybackControlsOptions) => {
//         const containerId = 'playback-with-piechart-' + Math.random().toString(36).substring(7);

//         setTimeout(() => {
//             const container = document.getElementById(containerId);
//             if (container) {
//                 renderPlaybackControlsWithPieChart(container, args, generateSamplePieData);
//             }
//         }, 100);

//         return html`
//             <div style="height: 700px; width: 100%; border: 1px solid #ddd; border-radius: 4px; background: ${args.theme === 'dark' ? '#1a1a1a' : '#fff'};">
//                 <div id="${containerId}" style="height: 100%; width: 100%; padding: 20px; box-sizing: border-box;"></div>
//             </div>
//         `;
//     }
// };

// function renderPlaybackControlsWithPieChart(container: HTMLElement, options: IPlaybackControlsOptions = {}, dataGenerator: () => any[] = generateSamplePieData) {
//     container.innerHTML = '';

//     try {
//         console.log('Rendering PlaybackControls with PieChart integration');

//         // Generate temporal pie chart data
//         const chartData = dataGenerator();
//         const allTimestamps: string[] = [];
//         const aggregateData = chartData[0]['Sales'];
//         Object.keys(aggregateData).forEach(region => {
//             Object.keys((aggregateData as any)[region]).forEach((timestamp: string) => {
//                 if (!allTimestamps.includes(timestamp)) {
//                     allTimestamps.push(timestamp);
//                 }
//             });
//         });

//         allTimestamps.sort();

//         const chartContainer = document.createElement('div');
//         chartContainer.style.cssText = 'height: 65%; width: 100%; margin-bottom: 20px; position: relative;';
//         const controlsContainer = document.createElement('div');
//         controlsContainer.style.cssText = 'height: 25%; width: 100%; min-height: 120px;';
//         const statusContainer = document.createElement('div');
//         statusContainer.className = 'tsi-status-feedback';
//         statusContainer.style.cssText = `
//             height: 10%; 
//             padding: 12px; 
//             font-family: monospace; 
//             font-size: 13px;
//             background: ${options.theme === 'dark' ? '#2d2d2d' : '#f8f9fa'};
//             color: ${options.theme === 'dark' ? '#fff' : '#333'};
//             border-radius: 4px;
//             border: 1px solid ${options.theme === 'dark' ? '#444' : '#e9ecef'};
//             opacity: 0.9;
//         `;

//         container.appendChild(chartContainer);
//         container.appendChild(controlsContainer);
//         container.appendChild(statusContainer);

//         const pieChart = new PieChart(chartContainer);


//         const getDataForTimestamp = (targetTimestamp: string) => {
//             const salesData: any = {};
//             Object.keys(aggregateData).forEach(region => {
//                 const value = aggregateData[region][targetTimestamp];
//                 if (value) {
//                     salesData[region] = value;
//                 }
//             });
//             return Object.keys(salesData).length > 0 ? [{ 'Sales': salesData }] : [];
//         };

//         const getAggregateExpressionOptions = (data: any[], timestamp: string) => {
//             if (data.length === 0) return [];
//             const aggregateKey = Object.keys(data[0])[0];
//             const regions = Object.keys(data[0][aggregateKey] || {});
//             return [{
//                 measureTypes: ['revenue'], // The metric to display in the pie chart
//                 searchSpan: { from: timestamp, to: timestamp, bucketSize: '1d' },
//                 aggregateKey: aggregateKey,
//                 splitBy: regions,
//                 visibleSplitByCap: regions.length
//             }];
//         };

//         const chartOptions = {
//             theme: options.theme || 'light',
//             legend: 'shown',
//             tooltip: true,
//             timestamp: '2023-01-01T00:00:00.000Z',
//             arcWidthRatio: 0.4,
//             keepSplitByColor: true,
//             hideChartControlPanel: true,
//             is24HourTime: options.is24HourTime !== false,
//             offset: options.offset || 'Local',
//             dateLocale: options.dateLocale || 'en-US',
//         };

//         const onSelectTimeStamp = (selectedTime: Date) => {
//             // Find the closest available timestamp in our data to the one selected by the controls.
//             const closestTimestamp = allTimestamps.reduce((closest, current) => {
//                 const currentDiff = Math.abs(new Date(current).getTime() - selectedTime.getTime());
//                 const closestDiff = Math.abs(new Date(closest).getTime() - selectedTime.getTime());
//                 return currentDiff < closestDiff ? current : closest;
//             });

//             // Get the snapshot data for the closest timestamp.
//             const timestampData = getDataForTimestamp(closestTimestamp);

//             if (timestampData.length > 0) {
//                 const updatedChartOptions = { ...chartOptions, timestamp: closestTimestamp };
//                 const updatedAggOptions = getAggregateExpressionOptions(timestampData, closestTimestamp);

//                 // Re-render the pie chart with the new data and options.
//                 pieChart.render(timestampData, updatedChartOptions, updatedAggOptions);
//                 // Update the status panel.
//                 const date = new Date(closestTimestamp);
//                 const quarter = Math.ceil((date.getMonth() + 1) / 3);
//                 const totalRevenue = Object.values(timestampData[0]['Sales']).reduce((sum: number, region: any) => sum + (region.revenue || 0), 0);
//                 statusContainer.textContent = `Q${quarter} ${date.getFullYear()} Sales: $${totalRevenue.toLocaleString()} | Date: ${date.toLocaleDateString(options.dateLocale || 'en-US')}`;
//             } else {
//                 statusContainer.textContent = `No data available for: ${selectedTime.toLocaleDateString(options.dateLocale || 'en-US')}`;
//             }
//         };

//         onSelectTimeStamp(new Date(allTimestamps[0]));

//         // Render the playback controls.
//         const playbackControls = new PlaybackControls(controlsContainer, new Date(allTimestamps[0]));
//         playbackControls.render(
//             new Date(allTimestamps[0]),
//             new Date(allTimestamps[allTimestamps.length - 1]),
//             onSelectTimeStamp,
//             { theme: options.theme, offset: options.offset, is24HourTime: options.is24HourTime, dateLocale: options.dateLocale, xAxisHidden: options.xAxisHidden },
//             { intervalMillis: options.intervalMillis, stepSizeMillis: options.stepSizeMillis }
//         );

//     } catch (error: any) {
//         console.error('Error rendering PlaybackControls with PieChart:', error);
//         container.innerHTML = `
//             <div style="color: red; padding: 20px; font-family: monospace;">
//                 <h3>Error rendering PlaybackControls with PieChart</h3>
//                 <p><strong>Error:</strong> ${error?.message || 'Unknown error'}</p>
//                 <pre style="white-space: pre-wrap; font-size: 12px;">${error?.stack || 'No stack trace'}</pre>
//                 <p><small>Check browser console for detailed error information</small></p>
//             </div>
//         `;
//         return null;
//     }
// }


function generateHeatmapTimeSeriesData() {
    const data: any[] = [];
    const from = new Date(Math.floor((new Date()).valueOf() / (1000 * 60 * 60)) * (1000 * 60 * 60));
    let to: Date;

    const servers: any = {};
    data.push({ 'Data Center Monitoring': servers });
    for (let serverNum = 1; serverNum <= 5; serverNum++) {
        const values: any = {};
        servers[`Server-${serverNum}`] = values;
        const baselineLoad = 30 + (serverNum * 8);

        for (let minute = 0; minute < 60; minute++) {
            to = new Date(from.valueOf() + 1000 * 60 * minute);
            const hourlyVariation = Math.sin(minute / 10) * 10;
            const spike = (Math.random() > 0.85) ? Math.random() * 20 : 0;
            const noise = (Math.random() - 0.5) * 5;

            const cpu = Math.min(95, Math.max(10,
                baselineLoad + hourlyVariation + spike + noise
            ));

            values[to.toISOString()] = {
                cpu: parseFloat(cpu.toFixed(1))
            };
        }
    }

    return data;
}

function renderPlaybackControlsWithHeatmap(container: HTMLElement, options: IPlaybackControlsOptions = {},
    dataGenerator: () => any[] = generateHeatmapTimeSeriesData) {
    container.innerHTML = '';

    try {

        const chartData = dataGenerator();
        const allTimestamps: string[] = [];
        const aggregateData = chartData[0]['Data Center Monitoring'];

        // Ensure we have data before proceeding
        if (!aggregateData || Object.keys(aggregateData).length === 0) {
            throw new Error('No server data generated');
        }

        // Extract timestamps more reliably
        const serverNames = Object.keys(aggregateData);

        serverNames.forEach(server => {
            const serverData = (aggregateData as any)[server];
            if (serverData) {
                Object.keys(serverData).forEach((timestamp: string) => {
                    if (!allTimestamps.includes(timestamp)) {
                        allTimestamps.push(timestamp);
                    }
                });
            }
        });

        if (allTimestamps.length === 0) {
            throw new Error('No timestamps found in server data');
        }

        allTimestamps.sort();

        const timeRange = {
            start: new Date(allTimestamps[0]),
            end: new Date(allTimestamps[allTimestamps.length - 1]),
            stepSizeMillis: options.stepSizeMillis || 60000
        };



        const chartContainer = document.createElement('div');
        chartContainer.style.cssText = 'height: 65%; width: 100%; margin-bottom: 20px; position: relative;';

        const controlsContainer = document.createElement('div');
        controlsContainer.style.cssText = 'height: 25%; width: 100%; min-height: 120px;';

        const statusContainer = document.createElement('div');
        statusContainer.className = 'tsi-status-feedback';
        statusContainer.style.cssText = `
            height: 10%; 
            padding: 12px; 
            font-family: monospace; 
            font-size: 13px;
            background: ${options.theme === 'dark' ? '#2d2d2d' : '#f8f9fa'};
            color: ${options.theme === 'dark' ? '#fff' : '#333'};
            border-radius: 4px;
            border: 1px solid ${options.theme === 'dark' ? '#444' : '#e9ecef'};
            opacity: 0.9;
        `;

        container.appendChild(chartContainer);
        container.appendChild(controlsContainer);
        container.appendChild(statusContainer);

        const heatmap = new Heatmap(chartContainer);

        // FIXED: Improved data filtering with better validation
        const getDataForTimeRange = (endTime: Date, windowMinutes: number = 30) => {
            const startTime = new Date(endTime.getTime() - windowMinutes * 60 * 1000);
            const filteredData: any[] = [];
            const serverData: any = {};

            Object.keys(aggregateData).forEach(server => {
                const serverTimestamps: any = {};
                const serverValues = (aggregateData as any)[server];

                if (serverValues) {
                    Object.keys(serverValues).forEach((timestamp: string) => {
                        const timestampDate = new Date(timestamp);
                        if (timestampDate >= startTime && timestampDate <= endTime) {
                            serverTimestamps[timestamp] = serverValues[timestamp];
                        }
                    });

                    if (Object.keys(serverTimestamps).length > 0) {
                        serverData[server] = serverTimestamps;
                    }
                }
            });


            if (Object.keys(serverData).length > 0) {
                filteredData.push({ 'Data Center Monitoring': serverData });
            }

            return filteredData;
        };

        const recentTimeIndex = Math.floor(allTimestamps.length * 0.75);
        const initialEndTime = new Date(allTimestamps[recentTimeIndex]);
        const initialData = getDataForTimeRange(initialEndTime, 30);
        if (initialData.length === 0) {
            console.warn('No initial data found, trying different time window');
            const fallbackEndTime = new Date(allTimestamps[Math.floor(allTimestamps.length / 2)]);
            const fallbackData = getDataForTimeRange(fallbackEndTime, 60);

            if (fallbackData.length === 0) {
                throw new Error('No data available for any time window');
            }

        }

        // Chart options - ensure proper configuration
        const chartOptions = {
            theme: options.theme || 'light',
            legend: 'shown',
            tooltip: true,
            xAxisHidden: false,
            hideChartControlPanel: true,
            is24HourTime: options.is24HourTime !== false,
            offset: options.offset || 'Local',
            dateLocale: options.dateLocale || 'en-US',
            suppressResizeListener: false,
            onMouseover: (aggKey: string, splitBy: string) => {
                console.log('Heatmap hover:', { aggKey, splitBy });
            },
            onMouseout: () => {
                console.log('Heatmap mouseout');
            }
        };

        const getAggregateExpressionOptions = (data: any[]) => {
            if (data.length === 0) return [];
            return data.map((dataObj: any) => {
                const aggregateKey = Object.keys(dataObj)[0];
                const servers = Object.keys(dataObj[aggregateKey] || {});
                const allWindowTimestamps: string[] = [];

                servers.forEach(server => {
                    Object.keys(dataObj[aggregateKey][server] || {}).forEach((timestamp: string) => {
                        if (!allWindowTimestamps.includes(timestamp)) {
                            allWindowTimestamps.push(timestamp);
                        }
                    });
                });

                allWindowTimestamps.sort();

                if (allWindowTimestamps.length === 0) {
                    console.warn('No timestamps found for aggregate expression');
                    return null;
                }

                const aggExpression = {
                    measureTypes: ['cpu'],
                    searchSpan: {
                        from: allWindowTimestamps[0],
                        to: allWindowTimestamps[allWindowTimestamps.length - 1],
                        bucketSize: '1m'
                    },
                    aggregateKey: aggregateKey,
                    splitBy: servers,
                    color: '#FF6B35',
                    alias: aggregateKey,
                    visibleSplitByCap: 10000
                };
                return aggExpression;
            }).filter(Boolean);
        };
        const finalInitialData = initialData.length > 0 ? initialData : getDataForTimeRange(new Date(allTimestamps[Math.floor(allTimestamps.length / 2)]), 60);
        const initialAggOptions = getAggregateExpressionOptions(finalInitialData);
        setTimeout(() => {
            heatmap.render(finalInitialData, chartOptions, initialAggOptions);
        }, 50);

        // Create PlaybackControls instance
        const playbackControls = new PlaybackControls(controlsContainer, timeRange.start);

        const controlOptions = {
            theme: options.theme || 'light',
            offset: options.offset || 'Local',
            is24HourTime: options.is24HourTime !== false,
            dateLocale: options.dateLocale || 'en-US',
            xAxisHidden: options.xAxisHidden || false
        };

        const playbackSettings = {
            intervalMillis: Math.max(options.intervalMillis || 1500, 1000),
            stepSizeMillis: options.stepSizeMillis || 60000
        };

        // Status update function
        const updateStatus = (message: string, isHighlight: boolean = false) => {
            statusContainer.textContent = message;
            statusContainer.style.background = isHighlight
                ? (options.theme === 'dark' ? '#0d5aa7' : '#cce5ff')
                : (options.theme === 'dark' ? '#2d2d2d' : '#f8f9fa');

            if (isHighlight) {
                setTimeout(() => {
                    statusContainer.style.background = options.theme === 'dark' ? '#2d2d2d' : '#f8f9fa';
                }, 1200);
            }
        };

        // Callback for time selection
        const onSelectTimeStamp = (selectedTime: Date) => {

            const windowData = getDataForTimeRange(selectedTime, 30);

            if (windowData.length > 0) {
                const updatedAggOptions = getAggregateExpressionOptions(windowData);

                heatmap.render(windowData, chartOptions, updatedAggOptions);

                const serverCount = Object.keys(windowData[0]['Data Center Monitoring']).length;
                const allCpuValues: number[] = [];

                Object.values(windowData[0]['Data Center Monitoring']).forEach(server => {
                    const cpuValues = Object.values(server as any).map((data: any) => data.cpu);
                    allCpuValues.push(...cpuValues);
                });

                if (allCpuValues.length > 0) {
                    const avgCpuUsage = allCpuValues.reduce((a, b) => a + b, 0) / allCpuValues.length;
                    const maxCpuUsage = Math.max(...allCpuValues);

                    const endTime = selectedTime;
                    const startTime = new Date(endTime.getTime() - 30 * 60 * 1000);

                    updateStatus(
                        `Window: ${startTime.toLocaleTimeString()} - ${endTime.toLocaleTimeString()} | ` +
                        `Servers: ${serverCount} | CPU: avg ${avgCpuUsage.toFixed(1)}%, max ${maxCpuUsage.toFixed(1)}%`,
                        true
                    );
                }
            } else {
                updateStatus(`No data available for: ${selectedTime.toLocaleString(options.dateLocale || 'en-US')}`);
            }
            if (options.onSelectTimeStamp) {
                options.onSelectTimeStamp(selectedTime);
            }
        };

        playbackControls.render(
            timeRange.start,
            timeRange.end,
            onSelectTimeStamp,
            controlOptions,
            playbackSettings
        );

        const initialTime = new Date(allTimestamps[Math.floor(allTimestamps.length * 0.75)]);
        updateStatus(
            `Ready - Data Center CPU Monitoring | ` +
            `Range: ${timeRange.start.toLocaleTimeString()} to ${timeRange.end.toLocaleTimeString()} | ` +
            `Points: ${allTimestamps.length}`
        );

        return { heatmap, playbackControls };

    } catch (error: any) {
        console.error('Error rendering PlaybackControls with Heatmap:', error);
        container.innerHTML = `
            <div style="color: red; padding: 20px; font-family: monospace;">
                <h3>Error rendering PlaybackControls with Heatmap</h3>
                <p><strong>Error:</strong> ${error?.message || 'Unknown error'}</p>
                <pre style="white-space: pre-wrap; font-size: 12px;">${error?.stack || 'No stack trace'}</pre>
                <p><small>Check browser console for detailed error information</small></p>
            </div>
        `;
        return null;
    }
}


export const WithHeatmap: Story = {
    name: 'With Heatmap Integration',
    args: {
        theme: 'light',
        offset: 'Local',
        is24HourTime: true,
        dateLocale: 'en-US',
        xAxisHidden: false,
        intervalMillis: 1500,
        stepSizeMillis: 60000
    },
    render: (args: IPlaybackControlsOptions) => {
        const containerId = 'playback-with-heatmap-' + Math.random().toString(36).substring(7);

        setTimeout(() => {
            const container = document.getElementById(containerId);
            if (container) {
                renderPlaybackControlsWithHeatmap(container, args, generateHeatmapTimeSeriesData);
            }
        }, 100);

        return html`
            <div style="height: 700px; width: 100%; border: 1px solid #ddd; border-radius: 4px; background: ${args.theme === 'dark' ? '#1a1a1a' : '#fff'};">
                <div id="${containerId}" style="height: 100%; width: 100%; padding: 20px; box-sizing: border-box;"></div>
            </div>
        `;
    }
};