/**
 * @tsichart/core - Framework-agnostic time series charting library
 * 
 * This is the main entry point for the core package.
 * All exports are tree-shakeable and don't include side effects (except styles).
 */

// Main UXClient class (for backwards compatibility)
export { default as UXClient } from './UXClient';
export { default } from './UXClient';

// Components - Main Charts
export { default as LineChart } from './components/LineChart';
export { default as AvailabilityChart } from './components/AvailabilityChart';
export { default as PieChart } from './components/PieChart';
export { default as ScatterPlot } from './components/ScatterPlot';
export { default as GroupedBarChart } from './components/GroupedBarChart';
export { default as Heatmap } from './components/Heatmap';

// Components - Data Display
export { default as Grid } from './components/Grid';
export { default as EventsTable } from './components/EventsTable';
export { default as Hierarchy } from './components/Hierarchy';
export { default as Legend } from './components/Legend';

// Components - Controls & Inputs
export { default as Slider } from './components/Slider';
export { default as DateTimePicker } from './components/DateTimePicker';
export { default as SingleDateTimePicker } from './components/SingleDateTimePicker';
export { default as TimezonePicker } from './components/TimezonePicker';
export { default as DateTimeButtonSingle } from './components/DateTimeButtonSingle';
export { default as DateTimeButtonRange } from './components/DateTimeButtonRange';
export { default as ColorPicker } from './components/ColorPicker';
export { default as PlaybackControls } from './components/PlaybackControls';

// Components - Search & Navigation
export { default as ModelSearch } from './components/ModelSearch';
export { default as ModelAutocomplete } from './components/ModelAutocomplete';
export { default as HierarchyNavigation } from './components/HierarchyNavigation';

// Components - UI Elements
export { default as EllipsisMenu } from './components/EllipsisMenu';
export { default as ContextMenu } from './components/ContextMenu';
export { default as Tooltip } from './components/Tooltip';
export { default as Marker } from './components/Marker';

// Components - Graphics & Plots
export { default as ProcessGraphic } from './components/ProcessGraphic';
export { default as GeoProcessGraphic } from './components/GeoProcessGraphic';
export { default as LinePlot } from './components/LinePlot';
export { default as EventsPlot } from './components/EventsPlot';
export { default as CategoricalPlot } from './components/CategoricalPlot';
export { default as HeatmapCanvas } from './components/HeatmapCanvas';
export { default as HistoryPlayback } from './components/HistoryPlayback';

// Models - Core Data Models
export { default as AggregateExpression } from './models/AggregateExpression';
export { default as TsqExpression } from './models/TsqExpression';
export { ChartOptions } from './models/ChartOptions';
export { ChartDataOptions } from './models/ChartDataOptions';
export { ChartComponentData } from './models/ChartComponentData';

// Models - Chart-specific Data
export { LineChartData } from './models/LineChartData';
export { PieChartData } from './models/PieChartData';
export { ScatterPlotData } from './models/ScatterPlotData';
export { GroupedBarChartData } from './models/GroupedBarChartData';
export { HeatmapData } from './models/HeatmapData';
export { EventsTableData } from './models/EventsTableData';

// Models - Supporting Types
export { AxisState } from './models/AxisState';
export { HierarchyNode } from './models/HierarchyNode';
export { TimeSeriesEvent } from './models/TimeSeriesEvent';
export { TimeSeriesEventCell } from './models/TimeSeriesEventCell';
export { TsqRange } from './models/TsqRange';
export { Strings } from './models/Strings';

// Utilities
export { default as Utils } from './utils';

// Note: Styles are imported separately
// Users should import '@tsichart/core/styles' to get CSS