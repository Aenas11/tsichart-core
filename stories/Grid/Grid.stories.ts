import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import Grid from "../../packages/core/src/components/Grid/Grid";
import { ChartData } from '../../packages/core/src/types';
import { ChartOptions } from '../../packages/core/src/models/ChartOptions';
import { ChartComponentData } from '../../packages/core/src/models/ChartComponentData';
import { fireEvent, screen, within, waitFor } from 'storybook/test';

interface SensorMetrics extends Record<string, number> {
    temperature: number;
    humidity: number;
    pressure: number;
}

const meta: Meta<ChartOptions> = {
    title: "Components/Grid",
    component: "Grid",
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
# Grid Component

Interactive data grid for displaying time series data in tabular format with the following features:

## Key Features
- **Tabular Data Display**: Show time series data in rows and columns following **D3.js patterns**
- **Keyboard Navigation**: Navigate cells using arrow keys for accessibility
- **Time Filtering**: Display data within specific time ranges following **internal state management**
- **Multiple Measures**: Display multiple metrics per time point in grid cells
- **Responsive Layout**: Automatically adjusts to container size following **component-based architecture**
- **Close Button**: Can be closed when displayed from charts following **monolithic component** patterns

## Usage Example

\`\`\`typescript
import TsiClient from 'tsichart-core';

// Create grid instance following class-based inheritance
const tsiClient = new TsiClient();
const grid = new Grid(containerElement);

// Prepare data in expected format following internal state management
const data = [{
    "SensorA": {
        "Room1": {
            "2023-01-01T00:00:00Z": { temperature: 22.5, humidity: 45, pressure: 1013 },
            "2023-01-01T01:00:00Z": { temperature: 23.1, humidity: 43, pressure: 1012 },
            // More timestamped data points...
        }
    }
}];

// Render the grid following component patterns
grid.render(data, {
    theme: 'light',
    fromChart: false,
    dateLocale: 'en-US',
    offset: 'Local'
}, {});
\`\`\`

## Static Methods

The Grid component provides static methods following **monolithic component** patterns:

- \`Grid.showGrid()\` - Display grid overlay on chart
- \`Grid.hideGrid()\` - Hide grid overlay
- \`Grid.createGridEllipsisOption()\` - Create ellipsis menu option for charts


                `
            }
        }
    }
}