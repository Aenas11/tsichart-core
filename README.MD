# tsichart-core - Time Series Interactive Charts

A powerful, flexible JavaScript library for visualizing time series data with **interactive** charts. Built with TypeScript and D3.js, this library provides a rich set of chart components including line charts, bar charts, pie charts, heatmaps, scatter plots, and more.

## Features

✨ **Rich Component Library** - 20+ pre-built, customizable chart components  
📊 **Interactive Visualizations** - Tooltips, zooming, panning, and dynamic data updates  
🎨 **Themeable** - Built-in light and dark themes with customization options  
📱 **Responsive** - Charts adapt to different screen sizes  
🎯 **TypeScript Support** - Full type definitions included  
🌳 **Tree-shakeable** - Import only the components you need  
📦 **Zero Configuration** - Works out of the box with sensible defaults  

**Note:** This library is a community-maintained fork of the original Microsoft Time Series Insights Client, rebranded as **Time Series Interactive Charts** and updated for generic time series visualization use cases.

[![npm version](https://badge.fury.io/js/tsichart-core.svg)](https://www.npmjs.com/package/tsichart-core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/Aenas11/tsichart-core)
[![Live Examples](https://img.shields.io/badge/Examples-Live%20Demo-green)](https://aenas11.github.io/tsichart-core/) 

## Installation

### NPM

```bash
npm install tsichart-core
```

### Yarn

```bash
yarn add tsichart-core
```

## Quick Start

### Import All Components

```js
import TsiClient from "tsichart-core";
import "tsichart-core/tsiclient.css";

// Create a line chart
let tsiClient = new TsiClient();
let lineChart = new tsiClient.ux.LineChart(document.getElementById('chart'));

// Prepare your data
const data = [{
  "Series1": {
    "": {
      "2023-01-01T00:00:00Z": { avg: 10 },
      "2023-01-01T01:00:00Z": { avg: 15 },
      "2023-01-01T02:00:00Z": { avg: 13 }
    }
  }
}];

// Render the chart
lineChart.render(data, { theme: 'light', legend: 'compact' });
```

### Import Individual Components (Recommended for Tree-shaking)

```js
import LineChart from 'tsichart-core/LineChart';
import 'tsichart-core/tsiclient.css';

// Create and render chart
let lineChart = new LineChart(document.getElementById('chart'));
lineChart.render(data, { theme: 'light' });
```

## Available Components

**tsiclient** provides the following visualization components:

- **LineChart** - Render time series data as lines
- **BarChart** - Display time series data as bars with timestamp slider
- **PieChart** - Show time series data as pie charts with timestamp slider  
- **Heatmap** - Visualize time series data as a heatmap
- **ScatterPlot** - Plot time series data points as a scatter plot
- **AvailabilityChart** - Display data availability over time
- **Grid** - Render time series data in a tabular format
- **Hierarchy** - Display hierarchical data structures
- **EventsTable** - Show events in a table format
- **DateTimePicker** - UI component for selecting date/time ranges
- **TimezonePicker** - UI component for timezone selection
- **Slider** - Time slider component
- **ModelSearch** - Search component for time series models
- **HierarchyNavigation** - Navigate hierarchical time series data
- **ProcessGraphic** - Display process graphics with data overlays
- **ColorPicker** - Color selection component
- And more...

For detailed usage examples and API documentation, see the [UX Components documentation](docs/UX.md).

## Data Format

All components work with a consistent JSON data structure. Here's the basic format:

```js
const data = [{
  "SeriesName": {
    "SplitByValue": {  // Use empty string "" if no split
      "2023-01-01T00:00:00Z": {
        avg: 10,    // Your metric values
        min: 8,
        max: 12
      },
      "2023-01-01T01:00:00Z": {
        avg: 15,
        min: 13,
        max: 17
      }
    }
  }
}];
```

**You are responsible for:**
- Fetching time series data from your data source (API, database, etc.)
- Transforming your data into the expected format
- Handling any authentication/authorization

See the [UX Components documentation](docs/UX.md) for detailed format specifications for each chart type.

## Resources

* **[Live Examples](https://aenas11.github.io/tsichart-core/)** - Interactive examples hosted on GitHub Pages
* [Full API Documentation](docs/UX.md)
* [Example Source Code](pages/examples/) - Check the `pages/examples/` directory for working examples


## Contributing

Contributions are welcome! This is a community-maintained project. Please feel free to:

- Report bugs and request features via [GitHub Issues](https://github.com/Aenas11/tsichart-core/issues)
- Submit pull requests
- Improve documentation
- Share examples of your usage

## License

MIT License - see [LICENSE](LICENSE) file for details.

Original work Copyright (c) Microsoft Corporation  
Modified work Copyright (c) 2024 [Alexander Sysoiev]

## Acknowledgments

This library is based on the original Microsoft Time Series Insights (TSI) JavaScript SDK, which has been deprecated. We've rebranded it as **Time Series Interactive Charts** and modernized it for generic time series visualization use cases.

**TSI** now stands for **Time Series Interactive** - reflecting the library's focus on interactive data visualization rather than a specific cloud service.

## Migration from Original TSIClient

If you're migrating from the original Microsoft `tsiclient` package:

1. **Package name change**: Update your imports from `tsiclient` to `tsichart-core`
2. **No breaking changes to component APIs**: The chart components work the same way
3. **Remove server calls**: You'll need to handle data fetching yourself (Azure TSI service was retired)
4. **Update documentation references**: Use the new documentation instead of Azure TSI docs
- The `tsiClient.server` object and all related methods have been removed  
- Focus is now exclusively on client-side visualization components


## Contributing

This project welcomes contributions and suggestions.
