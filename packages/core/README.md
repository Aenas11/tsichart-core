# tsichart-core

Framework-agnostic time series charting library for building interactive data visualizations.

## Features

- 📊 **Comprehensive Chart Types**: Line charts, bar charts, pie charts, heatmaps, scatter plots, and more
- 🎨 **Highly Customizable**: Extensive options for styling and behavior
- 📱 **Responsive**: Adapts to different screen sizes
- ⚡ **Performance**: Optimized for large datasets
- 🌳 **Tree-shakeable**: Import only what you need
- 📦 **Zero Config**: Works out of the box with sensible defaults
- 🔧 **TypeScript**: Full TypeScript support with type definitions

## Installation

```bash
npm install tsichart-core
# or
pnpm add tsichart-core
# or
yarn add tsichart-core
```

## Quick Start

```typescript
import { LineChart } from 'tsichart-core';
import 'tsichart-core/styles';

// Create a container element
const container = document.getElementById('chart-container');

// Initialize the chart
const chart = new LineChart(container);

// Render with data
chart.render(data, options, aggregateExpressionOptions);
```

## Available Components

### Charts
- `LineChart` - Time series line charts
- `AvailabilityChart` - Availability and status visualization
- `PieChart` - Pie and donut charts
- `ScatterPlot` - Scatter plot visualizations
- `GroupedBarChart` - Grouped and stacked bar charts
- `Heatmap` - Heat map visualizations

### Data Display
- `Grid` - Data grid component
- `EventsTable` - Events table with filtering
- `Hierarchy` - Hierarchical data display
- `Legend` - Chart legend component

### Controls
- `DateTimePicker` - Date and time range picker
- `Slider` - Value slider component
- `ColorPicker` - Color selection component
- `PlaybackControls` - Playback controls for temporal data

### Navigation
- `ModelSearch` - Model search interface
- `ModelAutocomplete` - Autocomplete for models
- `HierarchyNavigation` - Navigate hierarchical data

## Usage with Frameworks

For framework-specific wrappers, see:
- **React**: `tsichart-react`
- **Vue**: `tsichart-vue`

## Documentation

Full documentation available at: https://aenas11.github.io/tsichart-core/

## License

MIT © Alex Sysoiev
