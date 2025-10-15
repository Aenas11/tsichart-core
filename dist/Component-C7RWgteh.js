import { I as InterpolationFunctions, U as Utils, a as DefaultHierarchyNavigationOptions } from './Utils-CKNrHyqc.js';
import * as d3 from 'd3';

var Strings = /** @class */ (function () {
    function Strings() {
        this.stringValueDefaults = {
            "Last 30 mins": "Last 30 mins",
            "Last Hour": "Last Hour",
            "Last 2 Hours": "Last 2 Hours",
            "Last 4 Hours": "Last 4 Hours",
            "Last 12 Hours": "Last 12 Hours",
            "Last 24 Hours": "Last 24 Hours",
            "Last 7 Days": "Last 7 Days",
            "Last 30 Days": "Last 30 Days",
            "Custom": "Custom",
            "Timeframe": "Timeframe",
            "Save": "Save",
            "timezone": "timezone",
            "start": "start",
            "end": "end",
            "Latest": "Latest",
            "Show ellipsis menu": "Show ellipsis menu",
            "Hide ellipsis menu": "Hide ellipsis menu",
            "Download as CSV": "Download as CSV",
            "Toggle all columns": "Toggle all columns",
            "All Columns": "All Columns",
            "only": "only",
            "Invalid Date": "Invalid Date",
            "Stack/Unstack Bars": "Stack/Unstack Bars",
            "Stack bars": "Stack bars",
            "Unstack bars": "Unstack bars",
            "No filter results": "No filter results",
            "All hierarchies": "All hierarchies",
            "Selected": "Selected",
            "toggle visibility for": "toggle visibility for",
            "Series type selection for": "Series type selection for",
            "shifted": "shifted",
            "Click to drop marker": "Click to drop marker",
            "drag to reposition": "drag to reposition",
            "Delete marker at": "Delete marker at",
            "set axis state to": "set axis state to",
            "Drop a Marker": "Drop a Marker",
            "Search Time Series Instances": "Search Time Series Instances",
            "No results": "No results",
            "No instances": "No instances found",
            "No search result": "No instances found for entered search term.",
            "Instance not found": "Instance not found under selected hierarchy.",
            "Show more": "Show more",
            "No description": "No description",
            "Time Series ID": "Time Series ID",
            "Currently displayed time is": "Currently displayed time is",
            "Left arrow to go back in time": "Left arrow to go back in time",
            "right arrow to go forward": "right arrow to go forward",
            "Local": "Local",
            "Display Grid": "Display Grid",
            "Previous Month": "Previous Month",
            "Next Month": "Next Month",
            "Unassigned Time Series Instances": "Unassigned Time Series Instances",
            "Search globally": "Search globally",
            "Lookup globally": "Lookup globally",
            "Show More Instances": "Show more instances",
            "Show More Hierarchies": "Show more hierarchies",
            "Add to Filter Path": "Add to Filter Path",
            "Empty": "Empty",
            "Date/Time": "Date/Time",
            "show series": "show series",
            "hide series": "hide series",
            "in group": "in group",
            "show group": "show group",
            "hide group": "hide group",
            "Use the arrow keys to navigate the values of each cell": "Use the arrow keys to navigate the values of each cell",
            "A grid of values": "A grid of values",
            "close grid": "close grid",
            "column header for date": "column header for date",
            "row header for": "row header for",
            "values for cell at": "values for cell at",
            "no values at": "no values at",
            "and": "and",
            "are": "are",
            "timezone selection": "timezone selection",
            "Start time input": "Start time input",
            "End time input": "End time input",
            "*": "*",
            "snap end time to latest": "snap end time to latest",
            "zoom in": "zoom in",
            "zoom out": "zoom out",
            "A line chart zoom in": "A line chart zoom in",
            "A line chart zoom out": "A line chart zoom out",
            "select quick time of": "select quick time of",
            "a time selection control dialog": "a time selection control dialog.",
            "a button to launch a time selection dialog current selected time is ": "a button to launch a time selection dialog. current selected time is ",
            "No color": "No color",
            "Change y-axis type": "Change y-axis type",
            "Show/Hide values": "Show/Hide values",
            "Line chart": "Line chart",
            "Bar chart": "Bar chart",
            "Heatmap": "Heatmap",
            "Pie chart": "Pie chart",
            "Scatter plot": "Scatter plot",
            "Select color": "Select color",
            "Search suggestion instruction": "When autocomplete results are available use up and down arrows to review and enter to select",
            "Search suggestions available": " results available, keyboard users, use up and down arrows to review and enter to select.",
            "Hierarchy list": "Hierarchy list",
            "event in series": "Event in series",
            "at time": "at time",
            "measure with key": "measure with key",
            "and value": "and value",
            "Looking for": "Looking for",
            "Hierarchy error": "Error occured! Refreshing hierarchy...",
            "Failed to get token": "Failed to get token",
            "Error in hierarchy navigation": "Error in hierarchy navigation",
            "Failed to load types for navigation": "Failed to load types for navigation",
            "Failed to load hierarchies for navigation": "Failed to load hierarchies for navigation",
            "Failed to complete search": "Failed to complete search",
            "Failed to get instance details": "Failed to get instance details",
            "Add": "Add",
            "Search": "Search",
            "Marker": "Marker",
            "Start at": "Start at",
            "Dismiss": "Dismiss"
        };
        this.stringValues = {};
        this.stringValues = this.stringValueDefaults;
    }
    Strings.prototype.mergeStrings = function (stringKeyValues) {
        var _this = this;
        Object.keys(this.stringValues).forEach(function (stringKey) {
            if (stringKey in stringKeyValues) {
                _this.stringValues[stringKey] = stringKeyValues[stringKey];
            }
        });
    };
    Strings.prototype.getString = function (stringKey) {
        if (stringKey in this.stringValues) {
            return this.stringValues[stringKey];
        }
        return stringKey;
    };
    Strings.prototype.toObject = function () {
        return this.stringValues;
    };
    return Strings;
}());

var ChartOptions = /** @class */ (function () {
    function ChartOptions() {
        this.stringsInstance = new Strings();
    }
    ChartOptions.prototype.getInterpolationFunction = function (interpolationName) {
        if (interpolationName == InterpolationFunctions.CurveLinear)
            return d3.curveLinear;
        if (interpolationName == InterpolationFunctions.CurveStep)
            return d3.curveStep;
        if (interpolationName == InterpolationFunctions.CurveStepBefore)
            return d3.curveStepBefore;
        if (interpolationName == InterpolationFunctions.CurveStepAfter)
            return d3.curveStepAfter;
        if (interpolationName == InterpolationFunctions.CurveBasis)
            return d3.curveBasis;
        if (interpolationName == InterpolationFunctions.CurveCardinal)
            return d3.curveCardinal;
        if (interpolationName == InterpolationFunctions.CurveMonotoneX)
            return d3.curveMonotoneX;
        if (interpolationName == InterpolationFunctions.CurveCatmullRom)
            return d3.curveCatmullRom;
        // default
        return d3.curveMonotoneX;
    };
    ChartOptions.prototype.setOptions = function (chartOptionsObj) {
        chartOptionsObj = !chartOptionsObj ? {} : chartOptionsObj;
        this.grid = this.mergeValue(chartOptionsObj, 'grid', false);
        this.preserveAvailabilityState = this.mergeValue(chartOptionsObj, 'preserveAvailabilityState', false);
        this.persistDateTimeButtonRange = this.mergeValue(chartOptionsObj, 'persistDateTimeButtonRange', false);
        this.isCompact = this.mergeValue(chartOptionsObj, 'isCompact', false);
        this.keepBrush = this.mergeValue(chartOptionsObj, 'keepBrush', false);
        this.isArea = this.mergeValue(chartOptionsObj, 'isArea', false);
        this.noAnimate = this.mergeValue(chartOptionsObj, 'noAnimate', false);
        this.updateInterval = this.mergeValue(chartOptionsObj, 'updateInterval', 0);
        this.minutesForTimeLabels = this.mergeValue(chartOptionsObj, 'minutesForTimeLabels', false);
        this.aggTopMargin = this.mergeValue(chartOptionsObj, 'aggTopMargin', 12);
        this.color = this.mergeValue(chartOptionsObj, 'color', null);
        this.maxBuckets = this.mergeValue(chartOptionsObj, 'maxBuckets', 500);
        this.yAxisHidden = this.mergeValue(chartOptionsObj, 'yAxisHidden', false);
        this.focusHidden = this.mergeValue(chartOptionsObj, 'focusHidden', false);
        this.singleLineXAxisLabel = this.mergeValue(chartOptionsObj, 'singleLineXAxisLabel', false);
        this.legend = this.mergeValue(chartOptionsObj, 'legend', 'shown');
        this.tooltip = this.mergeValue(chartOptionsObj, 'tooltip', false);
        this.throttleSlider = this.mergeValue(chartOptionsObj, 'throttleSlider', false);
        this.snapBrush = this.mergeValue(chartOptionsObj, 'snapBrush', false);
        this.minBrushWidth = this.mergeValue(chartOptionsObj, 'minBrushWidth', 0);
        this.theme = this.mergeValue(chartOptionsObj, 'theme', 'dark');
        this.keepSplitByColor = this.mergeValue(chartOptionsObj, 'keepSplitByColor', false);
        this.brushContextMenuActions = this.mergeValue(chartOptionsObj, 'brushContextMenuActions', null);
        this.timeFrame = this.mergeValue(chartOptionsObj, 'timeFrame', null);
        this.fromChart = this.mergeValue(chartOptionsObj, 'fromChart', false);
        this.timestamp = this.mergeValue(chartOptionsObj, 'timestamp', null);
        this.stacked = this.mergeValue(chartOptionsObj, 'stacked', false);
        this.scaledToCurrentTime = this.mergeValue(chartOptionsObj, 'scaledToCurrentTime', false);
        this.zeroYAxis = this.mergeValue(chartOptionsObj, 'zeroYAxis', true);
        this.arcWidthRatio = this.mergeValue(chartOptionsObj, 'arcWidthRatio', 0);
        this.bucketSizeMillis = this.mergeValue(chartOptionsObj, 'bucketSizeMillis', 0);
        this.brushClearable = this.mergeValue(chartOptionsObj, 'brushClearable', true);
        this.brushMoveAction = this.mergeValue(chartOptionsObj, 'brushMoveAction', function () { });
        this.brushMoveEndAction = this.mergeValue(chartOptionsObj, 'brushMoveEndAction', function () { });
        this.yAxisState = this.mergeValue(chartOptionsObj, 'yAxisState', 'stacked');
        this.xAxisHidden = this.mergeValue(chartOptionsObj, 'xAxisHidden', false);
        this.suppressResizeListener = this.mergeValue(chartOptionsObj, 'suppressResizeListener', false);
        this.onMouseout = this.mergeValue(chartOptionsObj, 'onMouseout', function () { });
        this.onMouseover = this.mergeValue(chartOptionsObj, 'onMouseover', function () { });
        this.onSticky = this.mergeValue(chartOptionsObj, 'onSticky', function () { });
        this.onUnsticky = this.mergeValue(chartOptionsObj, 'onUnsticky', function () { });
        this.onKeydown = this.mergeValue(chartOptionsObj, 'onKeydown', function () { });
        this.onInput = this.mergeValue(chartOptionsObj, 'onInput', function () { });
        this.brushHandlesVisible = this.mergeValue(chartOptionsObj, 'brushHandlesVisible', false);
        this.hideChartControlPanel = this.mergeValue(chartOptionsObj, 'hideChartControlPanel', false);
        this.offset = this.mergeValue(chartOptionsObj, 'offset', 0);
        this.is24HourTime = this.mergeValue(chartOptionsObj, 'is24HourTime', true);
        this.includeTimezones = this.mergeValue(chartOptionsObj, 'includeTimezones', true);
        this.availabilityLeftMargin = this.mergeValue(chartOptionsObj, 'availabilityLeftMargin', 60);
        this.onInstanceClick = this.mergeValue(chartOptionsObj, 'onInstanceClick', function () { return {}; });
        this.interpolationFunction = this.getInterpolationFunction(this.mergeValue(chartOptionsObj, 'interpolationFunction', InterpolationFunctions.None));
        this.includeEnvelope = this.mergeValue(chartOptionsObj, 'includeEnvelope', false);
        this.canDownload = this.mergeValue(chartOptionsObj, 'canDownload', true);
        this.withContextMenu = this.mergeValue(chartOptionsObj, 'withContextMenu', false);
        this.autoTriggerBrushContextMenu = this.mergeValue(chartOptionsObj, 'autoTriggerBrushContextMenu', false);
        this.includeDots = this.mergeValue(chartOptionsObj, 'includeDots', false);
        this.yExtent = this.mergeValue(chartOptionsObj, 'yExtent', null);
        this.ellipsisItems = this.mergeValue(chartOptionsObj, 'ellipsisItems', []);
        this.markers = Utils.getValueOrDefault(chartOptionsObj, 'markers', null); // intentionally not mergeValue
        this.onMarkersChange = this.mergeValue(chartOptionsObj, 'onMarkersChange', function (markers) { });
        this.spMeasures = this.mergeValue(chartOptionsObj, 'spMeasures', null);
        this.scatterPlotRadius = this.mergeValue(chartOptionsObj, 'scatterPlotRadius', [4, 10]);
        this.spAxisLabels = this.mergeValue(chartOptionsObj, 'spAxisLabels', null);
        this.isTemporal = this.mergeValue(chartOptionsObj, "isTemporal", false);
        this.xAxisTimeFormat = this.mergeValue(chartOptionsObj, 'xAxisTimeFormat', null);
        this.brushRangeVisible = this.mergeValue(chartOptionsObj, 'brushRangeVisible', true);
        this.strings = this.mergeStrings(Utils.getValueOrDefault(chartOptionsObj, 'strings', {}));
        this.dateLocale = this.mergeValue(chartOptionsObj, 'dateLocale', Utils.languageGuess());
        this.defaultAvailabilityZoomRangeMillis = this.mergeValue(chartOptionsObj, 'defaultAvailabilityZoomRangeMillis', null);
        this.warmStoreRange = this.mergeValue(chartOptionsObj, 'warmStoreRange', null);
        this.initialValue = this.mergeValue(chartOptionsObj, 'initialValue', null);
        this.dTPIsModal = this.mergeValue(chartOptionsObj, 'dTPIsModal', false);
        this.defaultColor = this.mergeValue(chartOptionsObj, 'defaultColor', null);
        this.numberOfColors = this.mergeValue(chartOptionsObj, 'numberOfColors', 15);
        this.colors = Utils.generateColors(this.numberOfColors, chartOptionsObj['colors'] ? chartOptionsObj['colors'] : null);
        this.isColorValueHidden = this.mergeValue(chartOptionsObj, 'isColorValueHidden', false);
        this.onClick = this.mergeValue(chartOptionsObj, 'onClick', function () { });
        this.onSelect = this.mergeValue(chartOptionsObj, 'onSelect', function () { });
        this.swimLaneOptions = this.mergeValue(chartOptionsObj, 'swimLaneOptions', null);
        this.hierarchyOptions = this.mergeValue(chartOptionsObj, 'hierarchyOptions', Object.assign({}, DefaultHierarchyNavigationOptions));
        this.labelSeriesWithMarker = this.mergeValue(chartOptionsObj, 'labelSeriesWithMarker', false);
        this.onError = this.mergeValue(chartOptionsObj, 'onError', function (titleKey, messageKey, xhr) { });
        this.timeSeriesIdProperties = Utils.getValueOrDefault(chartOptionsObj, 'timeSeriesIdProperties', []);
        this.shouldSticky = this.mergeValue(chartOptionsObj, 'shouldSticky', true);
        this.isRelative = this.mergeValue(chartOptionsObj, 'isRelative', false);
        this.currentQuickTime = this.mergeValue(chartOptionsObj, 'currentQuickTime', 0);
    };
    ChartOptions.prototype.mergeStrings = function (strings) {
        this.stringsInstance.mergeStrings(strings);
        return this.stringsInstance.toObject();
    };
    ChartOptions.prototype.mergeValue = function (chartOptionsObj, propertyName, defaultValue) {
        if (this[propertyName] !== undefined && chartOptionsObj[propertyName] === undefined) {
            return this[propertyName];
        }
        return Utils.getValueOrDefault(chartOptionsObj, propertyName, defaultValue);
    };
    ChartOptions.prototype.toObject = function () {
        return {
            grid: this.grid,
            preserveAvailabilityState: this.preserveAvailabilityState,
            persistDateTimeButtonRange: this.persistDateTimeButtonRange,
            isCompact: this.isCompact,
            keepBrush: this.keepBrush,
            isArea: this.isArea,
            noAnimate: this.noAnimate,
            minutesForTimeLabels: this.minutesForTimeLabels,
            aggTopMargin: this.aggTopMargin,
            color: this.color,
            maxBuckets: this.maxBuckets,
            yAxisHidden: this.yAxisHidden,
            focusHidden: this.focusHidden,
            singleLineXAxisLabel: this.singleLineXAxisLabel,
            legend: this.legend,
            tooltip: this.tooltip,
            throttleSlider: this.throttleSlider,
            snapBrush: this.snapBrush,
            minBrushWidth: this.minBrushWidth,
            theme: this.theme,
            keepSplitByColor: this.keepSplitByColor,
            brushContextMenuActions: this.brushContextMenuActions,
            timeFrame: this.timeFrame,
            fromChart: this.fromChart,
            timestamp: this.timestamp,
            stacked: this.stacked,
            scaledToCurrentTime: this.scaledToCurrentTime,
            zeroYAxis: this.zeroYAxis,
            arcWidthRatio: this.arcWidthRatio,
            brushClearable: this.brushClearable,
            brushMoveAction: this.brushMoveAction,
            yAxisState: this.yAxisState,
            xAxisHidden: this.xAxisHidden,
            suppressResizeListener: this.suppressResizeListener,
            brushMoveEndAction: this.brushMoveEndAction,
            onMouseout: this.onMouseout,
            onMouseover: this.onMouseover,
            onSticky: this.onSticky,
            onUnsticky: this.onUnsticky,
            onKeydown: this.onKeydown,
            onInput: this.onInput,
            brushHandlesVisible: this.brushHandlesVisible,
            hideChartControlPanel: this.hideChartControlPanel,
            offset: this.offset,
            is24HourTime: this.is24HourTime.valueOf,
            includeTimezones: this.includeTimezones,
            availabilityLeftMargin: this.availabilityLeftMargin,
            onInstanceClick: this.onInstanceClick,
            interpolationFunction: this.interpolationFunction,
            includeEnvelope: this.includeEnvelope,
            canDownload: this.canDownload,
            withContextMenu: this.withContextMenu,
            autoTriggerBrushContextMenu: this.autoTriggerBrushContextMenu,
            includeDots: this.includeDots,
            yExtent: this.yExtent,
            ellipsisItems: this.ellipsisItems,
            markers: this.markers,
            onMarkersChange: this.onMarkersChange,
            xAxisTimeFormat: this.xAxisTimeFormat,
            spMeasures: this.spMeasures,
            scatterPlotRadius: this.scatterPlotRadius,
            spAxisLabels: this.spAxisLabels,
            brushRangeVisible: this.brushRangeVisible,
            strings: this.strings.toObject(),
            dateLocale: this.dateLocale,
            defaultAvailabilityZoomRangeMillis: this.defaultAvailabilityZoomRangeMillis,
            warmStoreRange: this.warmStoreRange,
            initialValue: this.initialValue,
            bucketSizeMillis: this.bucketSizeMillis,
            updateInterval: this.updateInterval,
            dTPIsModal: this.dTPIsModal,
            numberOfColors: this.numberOfColors,
            defaultColor: this.defaultColor,
            isColorValueHidden: this.isColorValueHidden,
            onClick: this.onClick,
            onSelect: this.onSelect,
            colors: this.colors,
            swimLaneOptions: this.swimLaneOptions,
            hierarchyOptions: this.hierarchyOptions,
            onError: this.onError,
            labelSeriesWithMarker: this.labelSeriesWithMarker,
            timeSeriesIdProperties: this.timeSeriesIdProperties,
            shouldSticky: this.shouldSticky,
            isRelative: this.isRelative,
            currentQuickTime: this.currentQuickTime
        };
    };
    return ChartOptions;
}());

var Component = /** @class */ (function () {
    function Component(renderTarget) {
        this.TRANSDURATION = (window.navigator.userAgent.indexOf("Edge") > -1) ? 0 : 400;
        this.usesSeconds = false;
        this.usesMillis = false;
        this.chartOptions = new ChartOptions();
        this.teardropD = function (width, height) {
            return "M".concat(width / 2, " ").concat(height / 14, " \n                Q").concat(width / 1.818, " ").concat(height / 6.17, " ").concat(width / 1.2, " ").concat(height / 2.33, "\n                A").concat(width / 2.35, " ").concat(width / 2.35, " 0 1 1 ").concat(width / 6, " ").concat(width / 2.33, "\n                Q").concat(width / 2.22, " ").concat(height / 6.18, " ").concat(width / 2, " ").concat(height / 14, "z");
        };
        this.renderTarget = renderTarget;
    }
    Component.prototype.getString = function (str) {
        return this.chartOptions.stringsInstance.getString(str);
    };
    Component.prototype.themify = function (targetElement, theme) {
        var theme = Utils.getTheme(theme);
        targetElement === null || targetElement === void 0 ? void 0 : targetElement.classed(this.currentTheme, false);
        targetElement === null || targetElement === void 0 ? void 0 : targetElement.classed('tsi-light', false);
        targetElement === null || targetElement === void 0 ? void 0 : targetElement.classed('tsi-dark', false);
        targetElement === null || targetElement === void 0 ? void 0 : targetElement.classed(theme, true);
        this.currentTheme = theme;
    };
    Component.prototype.tooltipFormat = function (d, text, measureFormat, xyrMeasures) {
    };
    Component.prototype.createTooltipSeriesInfo = function (d, group, cDO) {
        var title = group.append('h2').attr('class', 'tsi-tooltipGroupName tsi-tooltipTitle');
        Utils.appendFormattedElementsFromString(title, d.aggregateName);
        if (d.splitBy && d.splitBy != "") {
            var splitBy = group.append('p')
                .attr('class', 'tsi-tooltipSeriesName tsi-tooltipSubtitle');
            Utils.appendFormattedElementsFromString(splitBy, d.splitBy);
        }
        if (cDO.variableAlias && cDO.isVariableAliasShownOnTooltip) {
            group.append('p')
                .text(cDO.variableAlias)
                .attr('class', 'tsi-tooltipVariableAlias tsi-tooltipSubtitle');
        }
    };
    return Component;
}());

export { Component as C, ChartOptions as a };
