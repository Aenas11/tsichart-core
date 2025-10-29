import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import AvailabilityChart from "../../packages/core/src/components/AvailabilityChart/AvailabilityChart";
import { ChartOptions } from "../../packages/core/src/models/ChartOptions";

//TODO: AvailabilityChart options should be properly typed in the core package, for now it is using ChartOptions
const meta: Meta<ChartOptions> = {
  title: "Charts/Availability/AvailabilityChart",
  component: "AvailabilityChart",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
# AvailabilityChart Component

The AvailabilityChart component visualizes the range and density of available time series data, helping users understand data coverage and select meaningful time periods for analysis. It provides an interactive interface for exploring data availability across different time ranges and selecting specific periods for detailed examination.

## Key Features
- **Data Availability Visualization**: Visual representation of data density across time ranges
- **Available Range Indication**: Clear display of the overall data availability period
- **Time Range Selection**: Interactive brushing to select specific time periods from available data
- **Dual-View Display**: Main sparkline chart showing data density and detailed time picker chart
- **Zoom Controls**: Mouse wheel zooming and zoom in/out buttons for detailed exploration of available data
- **Date/Time Picker**: Integrated date-time picker for precise range selection within available periods
- **Compact Mode**: Streamlined view for space-constrained layouts
- **Warm Store Range**: Visual indication of warm storage data availability vs. cold storage
- **Ghost Selection**: Visual feedback showing selected time range
- **Bucket Aggregation**: Intelligent data bucketing based on time range and resolution
- **Theming**: Support for light and dark themes
- **Responsive**: Automatically adjusts bucket size and display based on container size

## Usage Example

\`\`\`typescript
import TsiClient from 'tsichart-core';

// Create chart instance
const tsiClient = new TsiClient();
const chart = new tsiClient.AvailabilityChart(containerElement);

// Prepare availability data showing data counts across time periods
const availabilityData = [{
    "availabilityCount": {
        "": {
            "2023-01-01T00:00:00Z": { count: 100 },
            "2023-01-01T01:00:00Z": { count: 95 },
            // More timestamped availability counts...
        }
    }
}];

// Raw availability metadata defining the overall available data range
const rawAvailability = {
    range: {
        from: "2023-01-01T00:00:00Z",
        to: "2023-01-31T23:59:59Z"
    },
    intervalSize: "PT1H" // 1 hour intervals
};

// Render the chart to show available data range and enable selection
chart.render(availabilityData, {
    theme: 'light',
    color: 'teal',
    maxBuckets: 500,
    isCompact: false,
    persistDateTimeButtonRange: true,
    preserveAvailabilityState: false,
    warmStoreRange: {
        from: "2023-01-01T00:00:00Z",
        to: "2023-01-15T23:59:59Z"
    },
    brushMoveAction: (from, to) => {
        console.log('Selected range from available data:', from, to);
    },
    brushMoveEndAction: (from, to, offset, isRelative, quickTime) => {
        console.log('Selection ended:', from, to);
    },
    offset: 'Local',
    is24HourTime: true
}, rawAvailability);
\`\`\`

## Chart Options

- **theme**: Visual theme ('light' or 'dark')
- **color**: Primary color for the chart (default: 'teal')
- **maxBuckets**: Maximum number of data buckets to display (default: 500)
- **isCompact**: Enable compact view mode for space-constrained layouts
- **persistDateTimeButtonRange**: Show persistent date/time range button
- **preserveAvailabilityState**: Maintain zoom and selection state between renders
- **warmStoreRange**: Define the range of warm storage data availability
- **brushMoveAction**: Callback for brush movement events during range selection
- **brushMoveEndAction**: Callback for brush selection completion
- **offset**: Timezone offset handling ('Local', 'UTC', or specific offset)
- **is24HourTime**: Use 24-hour time format in displays

## Interactive Features

1. **Brush Selection**: Click and drag on the main chart to select time ranges from available data
2. **Wheel Zoom**: Use mouse wheel to zoom in/out on the available data range
3. **Zoom Buttons**: Click zoom in/out buttons for controlled zooming
4. **Date/Time Picker**: Click the date/time button to open precise range selector
5. **Ghost Range**: Visual indicator shows the currently selected time range
6. **Warm Range**: Highlighted area indicates data stored in warm storage (recent data)

## Data Format

The availability count data shows the density of available data points across time periods, allowing users to see where data is sparse or dense before selecting a range for analysis.
                `,
      },
    },
  },
  argTypes: {
    theme: {
      control: { type: "select" },
      options: ["light", "dark"],
      description: "Visual theme for the chart",
    },
    // yAxisState: {
    //     control: { type: 'select' },
    //     options: ['stacked', 'shared', 'overlap'],
    //     description: 'How multiple series should be displayed on the Y-axis',
    //     table: { defaultValue: { summary: 'stacked' } }
    // },
    // legend: {
    //     control: { type: 'select' },
    //     options: ['shown', 'hidden', 'compact'],
    //     description: 'Legend display mode',
    //     table: { defaultValue: { summary: 'shown' } }
    // },

    // tooltip: {
    //     control: 'boolean',
    //     description: 'Enable/disable interactive tooltips',
    //     table: { defaultValue: { summary: 'true' } }
    // },
    color: {
      control: { type: "color" },
      description: "Primary color for the availability chart",
      table: { defaultValue: { summary: "teal" } },
    },
    maxBuckets: {
      control: { type: "number", min: 10, max: 1000, step: 10 },
      description: "Maximum number of data buckets to display",
      table: { defaultValue: { summary: "500" } },
    },
    isCompact: {
      control: "boolean",
      description: "Enable compact view mode for space-constrained layouts",
      table: { defaultValue: { summary: "false" } },
    },
    persistDateTimeButtonRange: {
      control: "boolean",
      description: "Show persistent date/time range selection button",
      table: { defaultValue: { summary: "false" } },
    },
    preserveAvailabilityState: {
      control: "boolean",
      description: "Maintain zoom and selection state between renders",
      table: { defaultValue: { summary: "false" } },
    },
    warmStoreEnabled: {
      control: "boolean",
      description: "Enable warm storage range visualization",
      table: { defaultValue: { summary: "true" } },
    },
    warmStoreDays: {
      control: { type: "number", min: 1, max: 30, step: 1 },
      description:
        "Number of days for warm storage range (from current time backwards)",
      table: { defaultValue: { summary: "3" } },
    },
    offset: {
      control: { type: "select" },
      options: ["Local", "UTC", "+01:00", "-05:00", "+09:00"],
      description: "Timezone offset handling for time display",
      table: { defaultValue: { summary: "Local" } },
    },
    is24HourTime: {
      control: "boolean",
      description: "Use 24-hour time format in displays",
      table: { defaultValue: { summary: "true" } },
    },
    enableBrushLogging: {
      control: "boolean",
      description:
        "Enable console logging for brush move actions (demo purposes)",
      table: { defaultValue: { summary: "true" } },
    },
    enableBrushEndLogging: {
      control: "boolean",
      description:
        "Enable console logging for brush end actions (demo purposes)",
      table: { defaultValue: { summary: "true" } },
    },
  },
};
export default meta;

type Story = StoryObj<ChartOptions>;

/**
 * Generate sample availability data for demonstration.
 * Returns data in the format expected by AvailabilityChart.
 *
 * Data structure:
 * - availabilityCount object with empty string key
 * - Timestamped data points with count values
 * - 7 days of hourly data points
 */
function generateAvailabilityData() {
  const data = [
    {
      availabilityCount: {
        "": {},
      },
    },
  ];

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Generate hourly data points for the last 7 days
  for (let i = 0; i < 7 * 24; i++) {
    const timestamp = new Date(sevenDaysAgo.getTime() + i * 60 * 60 * 1000);
    const baseCount = 80;
    const variation = Math.sin(i / 12) * 20 + Math.random() * 15;
    const count = Math.max(0, baseCount + variation);

    data[0].availabilityCount[""][timestamp.toISOString()] = {
      count: Math.round(count),
    };
  }

  return data;
}

/**
 * Function to render AvailabilityChart in a container.
 */
function generateRawAvailability() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return {
    range: {
      from: sevenDaysAgo.toISOString(),
      to: now.toISOString(),
    },
    intervalSize: "PT1H", // 1 hour intervals
  };
}

// Function to render LineChart in a container
/**
 * Generate raw availability metadata for demonstration.
 * Provides range and interval information for the AvailabilityChart.
 */
function renderAvailabilityChart(container: HTMLElement, options: any = {}) {
  container.innerHTML = "";

  try {
    console.log("Rendering AvailabilityChart with options:", options);

    // Create AvailabilityChart instance
    const chart = new AvailabilityChart(container);

    const warmStoreRange =
      options.warmStoreEnabled !== false
        ? [
            new Date(
              Date.now() - (options.warmStoreDays || 3) * 24 * 60 * 60 * 1000
            ).toISOString(),
            new Date().toISOString(),
          ]
        : null;

    // Create brush action callbacks based on logging preferences
    const brushMoveAction =
      options.enableBrushLogging !== false
        ? (from, to) => {
            console.log("Brush Move Action:", {
              from: from.toISOString(),
              to: to.toISOString(),
              duration: `${Math.round(
                (to.getTime() - from.getTime()) / (1000 * 60)
              )} minutes`,
            });
          }
        : null;

    const brushMoveEndAction =
      options.enableBrushEndLogging !== false
        ? (from, to, offset, isRelative, quickTime) => {
            console.log("Brush End Action:", {
              from: from.toISOString(),
              to: to.toISOString(),
              offset,
              isRelative,
              quickTime,
              duration: `${Math.round(
                (to.getTime() - from.getTime()) / (1000 * 60)
              )} minutes`,
            });
          }
        : null;

    // Default options for the chart
    const chartOptions = {
      theme: options.theme || "light",
      color: options.color || "teal",
      maxBuckets: options.maxBuckets || 500,
      isCompact: options.isCompact || false,
      persistDateTimeButtonRange: options.persistDateTimeButtonRange || false,
      preserveAvailabilityState: options.preserveAvailabilityState || false,
      warmStoreRange: warmStoreRange,
      brushMoveAction: brushMoveAction,
      brushMoveEndAction: brushMoveEndAction,
      offset: options.offset || "Local",
      is24HourTime: options.is24HourTime !== false,
      ...options,
    };

    // Generate and render data
    const availabilityData = generateAvailabilityData();
    const rawAvailability = generateRawAvailability();
    chart.render(availabilityData, chartOptions, rawAvailability);

    return chart;
  } catch (error) {
    console.error("AvailabilityChart rendering error:", error);
    container.innerHTML = `<div style="color: red; padding: 20px; font-family: monospace;">
            <h3>Error rendering AvailabilityChart</h3>
            <p><strong>Error:</strong> ${error.message}</p>
            <p><small>Check browser console for more details</small></p>
        </div>`;
  }
}

// Helper function to create a story with chart rendering
function createAvailabilityChartStory(containerStyle: string) {
  return (args: any) => {
    const chartId =
      "availability-chart-" + Math.random().toString(36).substring(7);

    setTimeout(() => {
      const container = document.getElementById(chartId);
      if (container) {
        renderAvailabilityChart(container, args);
      }
    }, 100);

    return html`
      <div style="${containerStyle}">
        <div
          id="${chartId}"
          style="height: 100%; width: 100%;"
        ></div>
      </div>
    `;
  };
}

export const Default: Story = {
  name: "Light Theme (Default)",
  args: {
    theme: "light",
    color: "teal",
    maxBuckets: 500,
    isCompact: false,
    persistDateTimeButtonRange: false,
    preserveAvailabilityState: false,
    warmStoreEnabled: true,
    warmStoreDays: 3,
    offset: "Local",
    is24HourTime: true,
    enableBrushLogging: true,
    enableBrushEndLogging: true,
  },
  render: createAvailabilityChartStory(
    "height: 200px; width: 100%; border: 1px solid #ddd; border-radius: 4px;"
  ),
};

export const DarkTheme: Story = {
  name: "Dark Theme",
  args: {
    theme: "dark",
    color: "teal",
    maxBuckets: 500,
    isCompact: false,
    persistDateTimeButtonRange: false,
    preserveAvailabilityState: false,
    warmStoreEnabled: true,
    warmStoreDays: 5,
    offset: "Local",
    is24HourTime: true,
    enableBrushLogging: true,
    enableBrushEndLogging: true,
  },
  render: createAvailabilityChartStory(
    "height: 200px; width: 100%; background: #1a1a1a; border: 1px solid #444; border-radius: 4px;"
  ),
};

export const CompactMode: Story = {
  name: "Compact Mode",
  args: {
    theme: "light",
    color: "steelblue",
    maxBuckets: 300,
    isCompact: true,
    persistDateTimeButtonRange: false,
    preserveAvailabilityState: false,
    warmStoreEnabled: false,
    offset: "UTC",
    is24HourTime: true,
    enableBrushLogging: false,
    enableBrushEndLogging: false,
  },
  render: createAvailabilityChartStory(
    "height: 200px; width: 100%; border: 1px solid #ddd; border-radius: 4px;"
  ),
};

export const WithDateTimeButton: Story = {
  name: "With DateTime Button",
  args: {
    theme: "light",
    color: "orange",
    maxBuckets: 500,
    isCompact: false,
    persistDateTimeButtonRange: true,
    preserveAvailabilityState: false,
    warmStoreEnabled: true,
    warmStoreDays: 7,
    offset: "UTC", // UTC timezone
    is24HourTime: false, // 12-hour format for this demo
    enableBrushLogging: true,
    enableBrushEndLogging: true,
  },
  render: createAvailabilityChartStory(
    "height: 200px; width: 100%; border: 1px solid #ddd; border-radius: 4px;"
  ),
};
