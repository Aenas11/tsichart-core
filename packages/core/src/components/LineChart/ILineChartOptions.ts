import { ChartOptions } from "../../models/ChartOptions";

/**
 * Configuration options for the LineChart component.
 * 
 * Provides type safety for LineChart-specific configuration with all properties being optional.
 * Based on ChartOptions class, allowing partial configuration where defaults are applied internally.
 * 
 * @remarks
 * This type includes all properties from ChartOptions as optional fields:
 * - **Appearance**: theme, color, legend, tooltip, grid, isArea, interpolationFunction
 * - **Axis Configuration**: xAxisHidden, yAxisHidden, yAxisState, yExtent, aggTopMargin
 * - **Brush Settings**: brushMoveAction, brushMoveEndAction, brushContextMenuActions, brushHandlesVisible, 
 *   brushRangeVisible, snapBrush, minBrushWidth, keepBrush, brushClearable, autoTriggerBrushContextMenu
 * - **Interaction**: focusHidden, onMouseover, onMouseout, onSticky, onUnsticky, shouldSticky
 * - **Markers**: markers, onMarkersChange, labelSeriesWithMarker
 * - **Swim Lanes**: swimLaneOptions (for stacked charts with multiple y-axes)
 * - **Time Configuration**: timeFrame, offset, is24HourTime, dateLocale, xAxisTimeFormat
 * - **UI Controls**: hideChartControlPanel, suppressResizeListener
 * - **Data Display**: includeEnvelope, includeDots
 * - **Styling**: strings (for i18n), noAnimate
 * 
 * @example
 * ```typescript
 * const lineChartOptions: ILineChartOptions = {
 *   theme: 'dark',
 *   legend: 'shown',
 *   yAxisState: 'stacked',
 *   brushHandlesVisible: true,
 *   interpolationFunction: 'curveMonotoneX',
 *   labelSeriesWithMarker: true
 * };
 * ```
 */
export type ILineChartOptions = Partial<ChartOptions>;