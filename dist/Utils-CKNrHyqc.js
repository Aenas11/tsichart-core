import * as d3 from 'd3';
import moment from 'moment-timezone';

var KeyCodes;
(function (KeyCodes) {
    KeyCodes[KeyCodes["Tab"] = 9] = "Tab";
    KeyCodes[KeyCodes["Esc"] = 27] = "Esc";
    KeyCodes[KeyCodes["Enter"] = 13] = "Enter";
    KeyCodes[KeyCodes["Up"] = 38] = "Up";
    KeyCodes[KeyCodes["Down"] = 40] = "Down";
})(KeyCodes || (KeyCodes = {}));
// search api params
var InstancesSort;
(function (InstancesSort) {
    InstancesSort["DisplayName"] = "DisplayName";
    InstancesSort["Rank"] = "Rank";
})(InstancesSort || (InstancesSort = {}));
var HierarchiesExpand;
(function (HierarchiesExpand) {
    HierarchiesExpand["UntilChildren"] = "UntilChildren";
    HierarchiesExpand["OneLevel"] = "OneLevel";
})(HierarchiesExpand || (HierarchiesExpand = {}));
var HierarchiesSort;
(function (HierarchiesSort) {
    HierarchiesSort["Name"] = "Name";
    HierarchiesSort["CumulativeInstanceCount"] = "CumulativeInstanceCount";
})(HierarchiesSort || (HierarchiesSort = {}));
var MetadataPropertyTypes;
(function (MetadataPropertyTypes) {
    MetadataPropertyTypes["Double"] = "Double";
    MetadataPropertyTypes["String"] = "String";
    MetadataPropertyTypes["DateTime"] = "DateTime";
    MetadataPropertyTypes["Long"] = "Long";
})(MetadataPropertyTypes || (MetadataPropertyTypes = {}));
var ShiftTypes;
(function (ShiftTypes) {
    ShiftTypes["startAt"] = "Start at";
    ShiftTypes["shifted"] = "shifted";
})(ShiftTypes || (ShiftTypes = {}));
var InterpolationFunctions;
(function (InterpolationFunctions) {
    InterpolationFunctions["None"] = "";
    InterpolationFunctions["CurveLinear"] = "curveLinear";
    InterpolationFunctions["CurveStep"] = "curveStep";
    InterpolationFunctions["CurveStepBefore"] = "curveStepBefore";
    InterpolationFunctions["CurveStepAfter"] = "curveStepAfter";
    InterpolationFunctions["CurveBasis"] = "curveBasis";
    InterpolationFunctions["CurveCardinal"] = "curveCardinal";
    InterpolationFunctions["CurveMonotoneX"] = "curveMonotoneX";
    InterpolationFunctions["CurveCatmullRom"] = "curveCatmullRom";
})(InterpolationFunctions || (InterpolationFunctions = {}));
var ErrorCodes;
(function (ErrorCodes) {
    ErrorCodes["InvalidInput"] = "InvalidInput";
    ErrorCodes["PartialSuccess"] = "PartialSuccess";
})(ErrorCodes || (ErrorCodes = {}));
// Linechart stack states
var YAxisStates;
(function (YAxisStates) {
    YAxisStates["Stacked"] = "stacked";
    YAxisStates["Shared"] = "shared";
    YAxisStates["Overlap"] = "overlap";
})(YAxisStates || (YAxisStates = {}));
var DataTypes;
(function (DataTypes) {
    DataTypes["Numeric"] = "numeric";
    DataTypes["Categorical"] = "categorical";
    DataTypes["Events"] = "events";
})(DataTypes || (DataTypes = {}));
var EventElementTypes;
(function (EventElementTypes) {
    EventElementTypes["Diamond"] = "diamond";
    EventElementTypes["Teardrop"] = "teardrop";
})(EventElementTypes || (EventElementTypes = {}));
var TooltipMeasureFormat;
(function (TooltipMeasureFormat) {
    TooltipMeasureFormat["Enveloped"] = "Enveloped";
    TooltipMeasureFormat["SingleValue"] = "SingleValue";
    TooltipMeasureFormat["Scatter"] = "Scatter";
})(TooltipMeasureFormat || (TooltipMeasureFormat = {}));
var valueTypes;
(function (valueTypes) {
    valueTypes["String"] = "String";
    valueTypes["Double"] = "Double";
    valueTypes["Long"] = "Long";
    valueTypes["Dynamic"] = "Dynamic";
    valueTypes["Boolean"] = "Boolean";
    valueTypes["DateTime"] = "DateTime";
})(valueTypes || (valueTypes = {}));

var DefaultHierarchyNavigationOptions = {
    instancesPageSize: 10,
    hierarchiesPageSize: 10,
    isInstancesRecursive: false,
    isInstancesHighlighted: false,
    instancesSort: InstancesSort.DisplayName,
    hierarchiesExpand: HierarchiesExpand.OneLevel,
    hierarchiesSort: HierarchiesSort.Name
};
var nullTsidDisplayString = "null";
var swimlaneLabelConstants = {
    leftMarginOffset: 40,
    swimLaneLabelHeightPadding: 8,
    labelLeftPadding: 28
};
var CharactersToEscapeForExactSearchInstance = ['"', '`', '\'', '!', '(', ')', '^', '[', '{', ':', ']', '}', '~', '/', '\\', '@', '#', '$', '%', '&', '*', ';', '=', '.', '_', '-', '<', '>', ',', '?'];
var NONNUMERICTOPMARGIN = 8;
var LINECHARTTOPPADDING = 16;
var GRIDCONTAINERCLASS = 'tsi-gridContainer';
var LINECHARTCHARTMARGINS = {
    top: 40,
    bottom: 40,
    left: 70,
    right: 60
};
var LINECHARTXOFFSET = 8;
var MARKERVALUENUMERICHEIGHT = 20;
var VALUEBARHEIGHT = 3;
var SERIESLABELWIDTH = 92;

var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.formatYAxisNumber = function (val) {
        if (Math.abs(val) < 1000000) {
            if (Math.abs(val) < .0000001)
                return d3.format('.2n')(val); // scientific for less than 1 billionth
            else {
                // grouped thousands with 7 significant digits, trim insginificant trailing 0s
                var formatted = d3.format(',.7r')(val);
                if (formatted.indexOf('.') != -1) {
                    var lastChar = formatted[formatted.length - 1];
                    while (lastChar == '0') {
                        formatted = formatted.slice(0, -1);
                        lastChar = formatted[formatted.length - 1];
                    }
                    if (lastChar == '.')
                        formatted = formatted.slice(0, -1);
                }
                return formatted;
            }
        }
        else if (Math.abs(val) >= 1000000 && Math.abs(val) < 1000000000)
            return d3.format('.3s')(val); // suffix of M for millions
        else if (Math.abs(val) >= 1000000000 && Math.abs(val) < 1000000000000)
            return d3.format('.3s')(val).slice(0, -1) + 'B'; // suffix of B for billions
        return d3.format('.2n')(val); // scientific for everything else
    };
    Utils.getStackStates = function () {
        return YAxisStates;
    };
    // format [0-9]+[ms|s|m|h|d], convert to millis
    Utils.parseTimeInput = function (inputString) {
        inputString = inputString.toLowerCase();
        var getNumber = function (inputString, charsFromEnd) {
            var startAt = inputString.indexOf('pt') !== -1 ? 2 : (inputString.indexOf('p') !== -1 ? 1 : 0);
            return Number(inputString.slice(startAt, inputString.length - charsFromEnd));
        };
        if (inputString.indexOf('ms') == inputString.length - 2) {
            return getNumber(inputString, 2);
        }
        if (inputString.indexOf('s') == inputString.length - 1) {
            return getNumber(inputString, 1) * 1000;
        }
        if (inputString.indexOf('m') == inputString.length - 1) {
            return getNumber(inputString, 1) * 60 * 1000;
        }
        if (inputString.indexOf('h') == inputString.length - 1) {
            return getNumber(inputString, 1) * 60 * 60 * 1000;
        }
        if (inputString.indexOf('d') == inputString.length - 1) {
            return getNumber(inputString, 1) * 24 * 60 * 60 * 1000;
        }
        return -1;
    };
    Utils.findClosestTime = function (prevMillis, timeMap) {
        var minDistance = Infinity;
        var closestValue = null;
        Object.keys(timeMap).forEach(function (intervalCenterString) {
            var intervalCenter = Number(intervalCenterString);
            if (Math.abs(intervalCenter - prevMillis) < minDistance) {
                minDistance = Math.abs(intervalCenter - prevMillis);
                closestValue = intervalCenter;
            }
        });
        return closestValue;
    };
    Utils.getValueOfVisible = function (d, visibleMeasure) {
        if (d.measures) {
            if (d.measures[visibleMeasure] != null || d.measures[visibleMeasure] != undefined)
                return d.measures[visibleMeasure];
        }
        return null;
    };
    Utils.isStartAt = function (startAtString, searchSpan) {
        if (startAtString === void 0) { startAtString = null; }
        if (searchSpan === void 0) { searchSpan = null; }
        return (startAtString !== null && searchSpan !== null && searchSpan.from !== null);
    };
    Utils.parseShift = function (shiftString, startAtString, searchSpan) {
        if (startAtString === void 0) { startAtString = null; }
        if (searchSpan === void 0) { searchSpan = null; }
        if (this.isStartAt(startAtString, searchSpan)) {
            return (new Date(startAtString)).valueOf() - (new Date(searchSpan.from)).valueOf();
        }
        if (shiftString === undefined || shiftString === null || shiftString.length === 0) {
            return 0;
        }
        var millis;
        if (shiftString[0] === '-' || shiftString[0] === '+') {
            millis = (shiftString[0] === '-' ? -1 : 1) * this.parseTimeInput(shiftString.slice(1, shiftString.length));
        }
        else {
            millis = this.parseTimeInput(shiftString);
        }
        return -millis;
    };
    Utils.adjustStartMillisToAbsoluteZero = function (fromMillis, bucketSize) {
        var epochAdjustment = 62135596800000;
        return Math.floor((fromMillis + epochAdjustment) / bucketSize) * bucketSize - epochAdjustment;
    };
    Utils.bucketSizeToTsqInterval = function (bucketSize) {
        if (!bucketSize) {
            return null;
        }
        var bucketSizeInMillis = Utils.parseTimeInput(bucketSize);
        var padLeadingZeroes = function (number) {
            var numberAsString = String(number);
            if (numberAsString.length < 3)
                numberAsString = (numberAsString.length === 2 ? '0' : '00') + numberAsString;
            return numberAsString;
        };
        if (bucketSizeInMillis < 1000) {
            bucketSize = (bucketSize.toLowerCase().indexOf('d') !== -1) ? 'd.' : '.' + padLeadingZeroes(bucketSizeInMillis) + "s";
        }
        var prefix = bucketSize.toLowerCase().indexOf('d') !== -1 ? 'P' : 'PT';
        return (prefix + bucketSize).toUpperCase();
    };
    Utils.createEntityKey = function (aggName, aggIndex) {
        return encodeURIComponent(aggName).split(".").join("_") + "_" + aggIndex;
    };
    Utils.getColorForValue = function (chartDataOptions, value) {
        if (chartDataOptions.valueMapping && (chartDataOptions.valueMapping[value] !== undefined)) {
            return chartDataOptions.valueMapping[value].color;
        }
        return null;
    };
    Utils.rollUpContiguous = function (data) {
        var areEquivalentBuckets = function (d1, d2) {
            if (!d1.measures || !d2.measures) {
                return false;
            }
            if (Object.keys(d1.measures).length !== Object.keys(d2.measures).length) {
                return false;
            }
            return Object.keys(d1.measures).reduce(function (p, c, i) {
                return p && (d1.measures[c] === d2.measures[c]);
            }, true);
        };
        return data.filter(function (d, i) {
            if (i !== 0) {
                return !areEquivalentBuckets(d, data[i - 1]);
            }
            return true;
        });
    };
    Utils.formatOffsetMinutes = function (offset) {
        return (offset < 0 ? '-' : '+') +
            Math.floor(offset / 60) + ':' +
            (offset % 60 < 10 ? '0' : '') + (offset % 60) + '';
    };
    Utils.getOffsetMinutes = function (offset, millis) {
        if (offset == 'Local') {
            return -moment.tz.zone(moment.tz.guess()).parse(millis);
        }
        if (typeof offset == 'string' && isNaN(offset)) {
            return -moment.tz.zone(offset).parse(millis);
        }
        else {
            return offset;
        }
    };
    Utils.offsetUTC = function (date) {
        var offsettedDate = new Date(date.valueOf() - date.getTimezoneOffset() * 60 * 1000);
        return offsettedDate;
    };
    // inverse of getOffsetMinutes, this is the conversion factor of an offsettedTime to UTC in minutes 
    Utils.getMinutesToUTC = function (offset, millisInOffset) {
        if (offset == 'Local') {
            return moment.tz.zone(moment.tz.guess()).utcOffset(millisInOffset);
        }
        if (typeof offset == 'string' && isNaN(offset)) {
            return moment.tz.zone(offset).utcOffset(millisInOffset);
        }
        else {
            return -offset;
        }
    };
    Utils.addOffsetGuess = function (timezoneName) {
        var timezone = moment.tz(new Date(), timezoneName.split(' ').join('_'));
        var formatted = timezone.format('Z');
        return "UTC" + formatted;
    };
    Utils.timezoneAbbreviation = function (timezoneName) {
        var abbr = moment.tz(new Date(), timezoneName).format('z');
        if (abbr[0] === '-' || abbr[0] === '+')
            return '';
        return abbr;
    };
    Utils.createTimezoneAbbreviation = function (offset) {
        var timezone = Utils.parseTimezoneName(offset);
        var timezoneAbbreviation = Utils.timezoneAbbreviation(timezone);
        return (timezoneAbbreviation.length !== 0 ? timezoneAbbreviation : Utils.addOffsetGuess(timezone));
    };
    Utils.parseTimezoneName = function (timezoneRaw) {
        if (!isNaN(timezoneRaw)) {
            if (timezoneRaw === 0) {
                return 'UTC';
            }
            return '';
        }
        if (timezoneRaw == 'Local') {
            return moment.tz.guess();
        }
        return timezoneRaw !== null ? timezoneRaw.split(' ').join('_') : '';
    };
    Utils.convertTimezoneToLabel = function (timezone, locdLocal) {
        if (locdLocal === void 0) { locdLocal = 'Local'; }
        var timezoneName = this.parseTimezoneName(timezone);
        var localPrefix = '';
        var offsetPrefix = '';
        if (timezone == 'Local') {
            localPrefix = locdLocal + ' - ';
        }
        if (timezone !== 'UTC') {
            offsetPrefix = ' (' + this.addOffsetGuess(timezoneName) + ')';
        }
        var timezoneAbbreviation = this.timezoneAbbreviation(timezoneName);
        var timezoneSuffix = (timezoneAbbreviation && timezoneAbbreviation.length !== 0 && timezoneAbbreviation !== 'UTC') ? ': ' + timezoneAbbreviation : '';
        return offsetPrefix + " " + localPrefix + timezoneName.replace(/_/g, ' ') + timezoneSuffix;
    };
    Utils.rangeTimeFormat = function (rangeMillis) {
        var oneSecond = 1000;
        var oneMinute = 60 * 1000;
        var oneHour = oneMinute * 60;
        var oneDay = oneHour * 24;
        var days = Math.floor(rangeMillis / oneDay);
        var hours = Math.floor(rangeMillis / oneHour) % 24;
        var minutes = Math.floor(rangeMillis / oneMinute) % 60;
        var seconds = Math.floor(rangeMillis / oneSecond) % 60;
        var millis = Math.floor(rangeMillis % 1000);
        if (rangeMillis >= oneDay) {
            return days + "d " + (hours > 0 ? (hours + "h") : "");
        }
        else if (rangeMillis >= oneHour) {
            return hours + "h " + (minutes > 0 ? (minutes + "m") : "");
        }
        else if (rangeMillis >= oneMinute) {
            return minutes + "m " + (seconds > 0 ? (seconds + "s") : "");
        }
        else if (rangeMillis >= oneSecond) {
            return seconds + (millis != 0 ? "." + millis : "") + "s";
        }
        return millis + "ms";
    };
    Utils.subDateTimeFormat = function (is24HourTime, usesSeconds, usesMillis) {
        return (is24HourTime ? "HH" : "hh") + ":mm" + (usesSeconds ? (":ss" + (usesMillis ? ".SSS" : "")) : "") + (is24HourTime ? "" : " A");
    };
    Utils.timeFormat = function (usesSeconds, usesMillis, offset, is24HourTime, shiftMillis, timeFormat, locale) {
        var _this = this;
        if (usesSeconds === void 0) { usesSeconds = false; }
        if (usesMillis === void 0) { usesMillis = false; }
        if (offset === void 0) { offset = 0; }
        if (is24HourTime === void 0) { is24HourTime = true; }
        if (shiftMillis === void 0) { shiftMillis = null; }
        if (timeFormat === void 0) { timeFormat = null; }
        if (locale === void 0) { locale = 'en'; }
        return function (d) {
            if (shiftMillis !== 0) {
                d = new Date(d.valueOf() + shiftMillis);
            }
            var stringFormat;
            if (timeFormat !== null) {
                stringFormat = timeFormat;
            }
            else {
                stringFormat = "L " + _this.subDateTimeFormat(is24HourTime, usesSeconds, usesMillis);
            }
            if (typeof offset == 'string' && isNaN(offset)) {
                return moment.tz(d, 'UTC').tz(offset === 'Local' ? moment.tz.guess() : offset).locale(locale).format(stringFormat);
            }
            else {
                return moment.tz(d, "UTC").utcOffset(offset).locale(locale).format(stringFormat);
            }
        };
    };
    Utils.splitTimeLabel = function (text) {
        var shouldSplit = function (str) {
            var splitLines = str.split(' ');
            return !((splitLines.length === 1) || (splitLines.length === 2 && (splitLines[1] === 'AM' || splitLines[1] === 'PM')));
        };
        text.each(function () {
            if (this.children == undefined || this.children.length == 0) { // don't split already split labels
                var text = d3.select(this);
                var lines = text.text().split(" ");
                var dy = parseFloat(text.attr("dy"));
                if (shouldSplit(text.text())) {
                    var newFirstLine = lines[0] + (lines.length === 3 ? (' ' + lines[1]) : '');
                    var newSecondLine = lines[lines.length - 1];
                    text.text(null).append("tspan")
                        .attr("x", 0)
                        .attr("y", text.attr("y"))
                        .attr("dy", dy + "em")
                        .text(newFirstLine);
                    text.append("tspan")
                        .attr("x", 0)
                        .attr("y", text.attr("y"))
                        .attr("dy", (dy + dy * 1.4) + "em")
                        .text(newSecondLine);
                }
            }
        });
    };
    Utils.getUTCHours = function (d, is24HourTime) {
        if (is24HourTime === void 0) { is24HourTime = true; }
        var hours = d.getUTCHours();
        if (!is24HourTime) {
            if (hours == 0)
                hours = 12;
            if (hours > 12)
                hours = hours - 12;
        }
        return hours;
    };
    Utils.UTCTwelveHourFormat = function (d) {
        var hours = String(this.getUTCHours(d));
        var minutes = (d.getUTCMinutes() < 10 ? "0" : "") + String(d.getUTCMinutes());
        var amPm = (d.getUTCHours() < 12) ? "AM" : "PM";
        return hours + ":" + minutes + " " + amPm;
    };
    Utils.getAgVisible = function (displayState, aggI, splitBy) {
        return (displayState[aggI].visible) ? displayState[aggI].splitBys[splitBy].visible : false;
    };
    Utils.getAgVisibleMeasure = function (displayState, aggI, splitBy) {
        return displayState[aggI].splitBys[splitBy].visibleType;
    };
    Utils.createSeriesTypeIcon = function (seriesType, selection) {
        var g = selection.append("g")
            .style("position", "absolute");
        if (seriesType == "event") {
            g.attr("transform", "translate(7.5,0)")
                .append("rect")
                .attr("width", 7)
                .attr("height", 7)
                .attr("transform", "rotate(45)");
        }
        else if (seriesType == "state") {
            g.append("rect")
                .attr("width", 15)
                .attr("height", 10);
        }
        else { // fxn
            g.append("path")
                .attr("d", "M0 5 Q 4 0, 8 5 T 16 5")
                .attr("fill", "none");
        }
    };
    Utils.strip = function (text) {
        var div = document.createElement('div');
        div.innerHTML = text;
        var textContent = div.textContent || div.innerText || '';
        return textContent;
    };
    Utils.stripForConcat = function (text) {
        var specialCharacters = ['"', "'", '?', '<', '>', ';'];
        specialCharacters.forEach(function (c) { text = text.split(c).join(''); });
        return text;
    };
    Utils.setSeriesLabelSubtitleText = function (subtitle, isInFocus) {
        if (isInFocus === void 0) { isInFocus = false; }
        var subtitleDatum = subtitle.data()[0];
        if (!subtitle.select('.tsi-splitBy').empty()) {
            var textAfterSplitByExists = subtitleDatum.timeShift !== '' || subtitleDatum.variableAlias;
            var splitByString = "".concat(subtitleDatum.splitBy).concat((textAfterSplitByExists && !isInFocus) ? ', ' : '');
            Utils.appendFormattedElementsFromString(subtitle.select('.tsi-splitBy'), splitByString);
        }
        if (subtitle.select('.tsi-timeShift')) {
            subtitle.select('.tsi-timeShift')
                .text(function (d) {
                return "".concat(subtitleDatum.timeShift).concat((subtitleDatum.variableAlias && !isInFocus) ? ', ' : '');
            });
        }
        if (subtitle.select('.tsi-variableAlias')) {
            subtitle.select('.tsi-variableAlias')
                .text(function (d) { return subtitleDatum.variableAlias; });
        }
    };
    Utils.revertAllSubtitleText = function (markerValues, opacity) {
        if (opacity === void 0) { opacity = 1; }
        var self = this;
        markerValues.classed('tsi-isExpanded', false)
            .style('opacity', opacity)
            .each(function () {
            self.setSeriesLabelSubtitleText(d3.select(this).selectAll('.tsi-tooltipSubtitle'), false);
        });
    };
    Utils.generateColors = function (numColors, includeColors) {
        if (includeColors === void 0) { includeColors = null; }
        var defaultColors = ['#008272', '#D869CB', '#FF8C00', '#8FE6D7', '#3195E3', '#F7727E', '#E0349E', '#C8E139', '#60B9AE',
            '#93CFFB', '#854CC7', '#258225', '#0078D7', '#FF2828', '#FFF100'];
        var postDefaultColors = d3.scaleSequential(d3.interpolateCubehelixDefault).domain([defaultColors.length - .5, numColors - .5]);
        var colors = [];
        var colorsIndex = 0;
        if (includeColors) { //add the colors we want to include first
            for (var i = 0; i < includeColors.length && colorsIndex < numColors; i++) {
                var color = includeColors[i];
                if (colors.indexOf(color) === -1) {
                    colors.push(color);
                    colorsIndex++;
                }
            }
        }
        for (var i = 0; colorsIndex < numColors; i++) {
            if (i < defaultColors.length) {
                if (colors.indexOf(defaultColors[i]) === -1) {
                    colors.push(defaultColors[i]);
                    colorsIndex++;
                }
            }
            else if (colors.indexOf(postDefaultColors(i)) === -1) {
                colors.push(postDefaultColors(i));
                colorsIndex++;
            }
        }
        return colors;
    };
    Utils.convertFromLocal = function (date) {
        return new Date(date.valueOf() - date.getTimezoneOffset() * 60 * 1000);
    };
    Utils.adjustDateFromTimezoneOffset = function (date) {
        var dateCopy = new Date(date.valueOf());
        dateCopy.setTime(dateCopy.getTime() + dateCopy.getTimezoneOffset() * 60 * 1000);
        return dateCopy;
    };
    Utils.offsetFromUTC = function (date, offset) {
        if (offset === void 0) { offset = 0; }
        var offsetMinutes = Utils.getOffsetMinutes(offset, date.valueOf());
        var dateCopy = new Date(date.valueOf() + offsetMinutes * 60 * 1000);
        return dateCopy;
    };
    Utils.offsetToUTC = function (date, offset) {
        if (offset === void 0) { offset = 0; }
        var offsetMinutes = Utils.getOffsetMinutes(offset, date.valueOf());
        var dateCopy = new Date(date.valueOf() - offsetMinutes * 60 * 1000);
        return dateCopy;
    };
    Utils.parseUserInputDateTime = function (timeText, offset) {
        var dateTimeFormat = "L " + this.subDateTimeFormat(true, true, true);
        var parsedDate = moment(timeText, dateTimeFormat).toDate();
        var utcDate = this.offsetToUTC(this.convertFromLocal(parsedDate), offset);
        return utcDate.valueOf();
    };
    Utils.getBrighterColor = function (color) {
        var hclColor = d3.hcl(color);
        if (hclColor.l < 80) {
            return hclColor.brighter().toString();
        }
        return hclColor.toString();
    };
    Utils.createSplitByColors = function (displayState, aggKey, ignoreIsOnlyAgg) {
        if (ignoreIsOnlyAgg === void 0) { ignoreIsOnlyAgg = false; }
        if (Object.keys(displayState[aggKey]["splitBys"]).length == 1)
            return [displayState[aggKey].color];
        var isOnlyAgg = Object.keys(displayState).reduce(function (accum, currAgg) {
            if (currAgg == aggKey)
                return accum;
            if (displayState[currAgg]["visible"] == false)
                return accum && true;
            return false;
        }, true);
        if (isOnlyAgg && !ignoreIsOnlyAgg) {
            return this.generateColors(Object.keys(displayState[aggKey]["splitBys"]).length);
        }
        var aggColor = displayState[aggKey].color;
        var interpolateColor = d3.scaleLinear().domain([0, Object.keys(displayState[aggKey]["splitBys"]).length])
            .range([d3.hcl(aggColor).darker().l, d3.hcl(aggColor).brighter().l]);
        var colors = [];
        for (var i = 0; i < Object.keys(displayState[aggKey]["splitBys"]).length; i++) {
            var newColor = d3.hcl(aggColor);
            newColor.l = interpolateColor(i);
            colors.push(newColor.formatHex());
        }
        return colors;
    };
    Utils.colorSplitBy = function (displayState, splitByIndex, aggKey, ignoreIsOnlyAgg) {
        if (ignoreIsOnlyAgg === void 0) { ignoreIsOnlyAgg = false; }
        if (Object.keys(displayState[aggKey]["splitBys"]).length == 1)
            return displayState[aggKey].color;
        var isOnlyAgg = Object.keys(displayState).reduce(function (accum, currAgg) {
            if (currAgg == aggKey)
                return accum;
            if (displayState[currAgg]["visible"] == false)
                return accum && true;
            return false;
        }, true);
        if (isOnlyAgg && !ignoreIsOnlyAgg) {
            var splitByColors = this.generateColors(Object.keys(displayState[aggKey]["splitBys"]).length);
            return splitByColors[splitByIndex];
        }
        var aggColor = displayState[aggKey].color;
        var interpolateColor = d3.scaleLinear().domain([0, Object.keys(displayState[aggKey]["splitBys"]).length])
            .range([d3.hcl(aggColor).darker().l, d3.hcl(aggColor).brighter().l]);
        var newColor = d3.hcl(aggColor);
        newColor.l = interpolateColor(splitByIndex);
        return newColor.formatHex();
    };
    Utils.getTheme = function (theme) {
        return theme ? 'tsi-' + theme : 'tsi-dark';
    };
    Utils.clearSelection = function () {
        var sel = window.getSelection ? window.getSelection() : document.selection;
        if (sel) {
            if (sel.removeAllRanges) {
                sel.removeAllRanges();
            }
            else if (sel.empty) {
                sel.empty();
            }
        }
    };
    Utils.mark = function (filter, text) {
        if (filter.length == 0)
            return text;
        var regExp = new RegExp(filter, 'gi');
        return text.replace(regExp, function (m) { return '<mark>' + m + '</mark>'; });
    };
    Utils.hash = function (str) {
        var hash = 5381, i = str.length;
        while (i) {
            hash = (hash * 33) ^ str.charCodeAt(--i);
        }
        /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
         * integers. Since we want the results to be always positive, convert the
         * signed int to an unsigned by doing an unsigned bitshift. */
        return hash >>> 0;
    };
    Utils.guid = function () {
        var s4 = function () {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
    Utils.createValueFilter = function (aggregateKey, splitBy) {
        return function (d, j) {
            var currAggKey;
            var currSplitBy;
            if (d.aggregateKey) {
                currAggKey = d.aggregateKey;
                currSplitBy = d.splitBy;
            }
            else if (d && d.length) {
                currAggKey = d[0].aggregateKey;
                currSplitBy = d[0].splitBy;
            }
            else
                return true;
            return (currAggKey == aggregateKey && (splitBy == null || splitBy == currSplitBy));
        };
    };
    Utils.downloadCSV = function (csvString, csvName) {
        if (csvName === void 0) { csvName = "Table"; }
        var blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        var blobURL = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.setAttribute("href", blobURL);
        link.setAttribute("download", csvName + ".csv");
        link.setAttribute("tabindex", "0");
        link.innerHTML = "";
        document.body.appendChild(link);
        link.click();
    };
    Utils.sanitizeString = function (str, type) {
        if (str === null || str === undefined) {
            return "";
        }
        if (type !== valueTypes.Double && type !== valueTypes.Long) {
            var jsonifiedString = type === valueTypes.Dynamic ? JSON.stringify(str) : String(str);
            if (jsonifiedString.indexOf(',') !== -1 || jsonifiedString.indexOf('"') !== -1 || jsonifiedString.indexOf('\n') !== -1 || type === valueTypes.Dynamic) {
                var replacedString = jsonifiedString.replace(/"/g, '""');
                return '"' + replacedString + '"';
            }
        }
        return str;
    };
    Utils.focusOnEllipsisButton = function (renderTarget) {
        var ellipsisContainer = d3.select(renderTarget).select(".tsi-ellipsisContainerDiv");
        if (!ellipsisContainer.empty()) {
            ellipsisContainer.select(".tsi-ellipsisButton").node().focus();
        }
    };
    Utils.createDownloadEllipsisOption = function (csvStringGenerator, action, downloadLabel) {
        if (action === void 0) { action = function () { }; }
        if (downloadLabel === void 0) { downloadLabel = "Download as CSV"; }
        return {
            iconClass: "download",
            label: downloadLabel,
            action: function () {
                Utils.downloadCSV(csvStringGenerator());
                action();
            },
            description: ""
        };
    };
    Utils.createControlPanel = function (renderTarget, legendWidth, topChartMargin, chartOptions) {
        d3.select(renderTarget).selectAll(".tsi-chartControlsPanel").remove();
        var controlPanelWidth = Math.max(1, d3.select(renderTarget).node().clientWidth -
            (chartOptions.legend == "shown" ? legendWidth : 0));
        var chartControlsPanel = d3.select(renderTarget).append("div")
            .attr("class", "tsi-chartControlsPanel")
            .style("width", controlPanelWidth + "px")
            .style("top", Math.max((topChartMargin - 32), 0) + "px");
        return chartControlsPanel;
    };
    Utils.escapeQuotesCommasAndNewlines = function (stringToEscape) {
        var escapedString = "";
        if (stringToEscape && (stringToEscape.indexOf("\"") != -1 ||
            stringToEscape.indexOf(",") != -1 ||
            stringToEscape.indexOf("\n") != -1)) {
            stringToEscape = stringToEscape.replace(/"/g, "\"\"");
            escapedString += "\"";
            escapedString += stringToEscape;
            escapedString += "\"";
            return escapedString;
        }
        else {
            return stringToEscape;
        }
    };
    Utils.getNonNumericHeight = function (rawHeight) {
        return rawHeight + NONNUMERICTOPMARGIN;
    };
    Utils.getControlPanelWidth = function (renderTarget, legendWidth, isLegendShown) {
        return Math.max(1, d3.select(renderTarget).node().clientWidth -
            (isLegendShown ? legendWidth : 0));
    };
    Utils.getValueOrDefault = function (chartOptionsObj, propertyName, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        var propertyValue = chartOptionsObj[propertyName];
        if (propertyValue == undefined) {
            if (this[propertyName] == undefined)
                return defaultValue;
            return this[propertyName];
        }
        return propertyValue;
    };
    Utils.safeNotNullOrUndefined = function (valueLambda) {
        try {
            var value = valueLambda();
            return !(value === null || value === undefined);
        }
        catch (err) {
            return false;
        }
    };
    Utils.getAggKeys = function (data) {
        var aggregateCounterMap = {};
        return data.map(function (aggregate) {
            var aggName = Object.keys(aggregate)[0];
            var aggKey;
            if (aggregateCounterMap[aggName]) {
                aggKey = Utils.createEntityKey(aggName, aggregateCounterMap[aggName]);
                aggregateCounterMap[aggName] += 1;
            }
            else {
                aggKey = Utils.createEntityKey(aggName, 0);
                aggregateCounterMap[aggName] = 1;
            }
            return aggKey;
        });
    };
    Utils.roundToMillis = function (rawTo, bucketSize) {
        return Math.ceil((rawTo + 62135596800000) / (bucketSize)) * (bucketSize) - 62135596800000;
    };
    Utils.mergeSeriesForScatterPlot = function (chartData, scatterMeasures) {
        var _a;
        var _this = this;
        var xMeasure = chartData[scatterMeasures.X_MEASURE], yMeasure = chartData[scatterMeasures.Y_MEASURE], rMeasure = chartData[scatterMeasures.R_MEASURE];
        var measureNames = Utils.getScatterPlotMeasureNames(chartData, scatterMeasures);
        // Create data label
        var xLabel = xMeasure.additionalFields.Variable.substring(0, 15) + (xMeasure.additionalFields.Variable.length > 15 ? "... vs" : " vs");
        var yLabel = " " + yMeasure.additionalFields.Variable.substring(0, 15) + (yMeasure.additionalFields.Variable.length > 15 ? "... " : "");
        var rLabel = (rMeasure != null ? " vs " + rMeasure.additionalFields.Variable.substring(0, 15) + (rMeasure.additionalFields.Variable.length > 15 ? "... " : "") : "");
        var dataTitle = xLabel + yLabel + rLabel;
        // Initialize scatter plot data object
        var scatterData = (_a = {},
            _a[dataTitle] = {
                "": {}
            },
            _a);
        // Create measure types
        var measureTypes = {
            X_MEASURE_TYPE: 'avg' in xMeasure.measureTypes ? xMeasure.measureTypes['avg'] : xMeasure.measureTypes[0],
            Y_MEASURE_TYPE: 'avg' in yMeasure.measureTypes ? yMeasure.measureTypes['avg'] : yMeasure.measureTypes[0],
            R_MEASURE_TYPE: null
        };
        // Takes query and returns normalized time data
        var normalizeTimestampKeys = function (query) {
            var newTS = {};
            Object.keys(query.data[query.alias][""]).forEach(function (key) {
                var oldTime = new Date(key).valueOf();
                var timeShift = query.timeShift != "" ? _this.parseShift(query.timeShift, query.startAt, query.searchSpan) : 0;
                // Calculate real timeshift based on bucket snapping
                var bucketShiftInMillis = _this.adjustStartMillisToAbsoluteZero(timeShift, _this.parseShift(query.searchSpan.bucketSize));
                var normalizedTime = oldTime - bucketShiftInMillis;
                var timestamp = new Date(normalizedTime).toISOString();
                newTS[timestamp] = query.data[query.alias][""][key];
            });
            return newTS;
        };
        // Normalize timestamp data
        xMeasure.data[xMeasure.alias][""] = normalizeTimestampKeys(xMeasure);
        yMeasure.data[yMeasure.alias][""] = normalizeTimestampKeys(yMeasure);
        if (rMeasure) {
            rMeasure.data[rMeasure.alias][""] = normalizeTimestampKeys(rMeasure);
            measureTypes.R_MEASURE_TYPE = 'avg' in rMeasure.measureTypes ? rMeasure.measureTypes['avg'] : rMeasure.measureTypes[0];
        }
        // For each timestamp in X data mix measures of other series
        Object.keys(xMeasure.data[xMeasure.alias][""]).forEach(function (key) {
            if (key in yMeasure.data[yMeasure.alias][""]) {
                var measures = {};
                measures[measureNames.X_MEASURE] = xMeasure.data[xMeasure.alias][""][key][measureTypes.X_MEASURE_TYPE];
                measures[measureNames.Y_MEASURE] = yMeasure.data[yMeasure.alias][""][key][measureTypes.Y_MEASURE_TYPE];
                // Add optional R measure
                if (rMeasure != null && key in rMeasure.data[rMeasure.alias][""]) {
                    measures[measureNames.R_MEASURE] = rMeasure.data[rMeasure.alias][""][key][measureTypes.R_MEASURE_TYPE];
                }
                // Discard timestamps with null valued measures
                if (xMeasure.data[xMeasure.alias][""][key][measureTypes.X_MEASURE_TYPE] && yMeasure.data[yMeasure.alias][""][key][measureTypes.Y_MEASURE_TYPE]) {
                    if (rMeasure != null) {
                        if (key in rMeasure.data[rMeasure.alias][""] && rMeasure.data[rMeasure.alias][""][key][measureTypes.R_MEASURE_TYPE])
                            scatterData[dataTitle][""][key] = measures;
                    }
                    else {
                        scatterData[dataTitle][""][key] = measures;
                    }
                }
            }
        });
        return scatterData;
    };
    Utils.getScatterPlotMeasureNames = function (chartData, scatterMeasures) {
        var uniqueNameMap = {};
        var xMeasureName = chartData[scatterMeasures.X_MEASURE].alias + " " + chartData[scatterMeasures.X_MEASURE].additionalFields.Variable +
            (chartData[scatterMeasures.X_MEASURE].timeShift == "" ? "" : " " + chartData[scatterMeasures.X_MEASURE].timeShift);
        uniqueNameMap[xMeasureName] = 1;
        var yMeasureName = chartData[scatterMeasures.Y_MEASURE].alias + " " + chartData[scatterMeasures.Y_MEASURE].additionalFields.Variable +
            (chartData[scatterMeasures.Y_MEASURE].timeShift == "" ? "" : " " + chartData[scatterMeasures.Y_MEASURE].timeShift);
        if (yMeasureName in uniqueNameMap) {
            var tempName = yMeasureName;
            yMeasureName += " (" + uniqueNameMap[yMeasureName].toString() + ")";
            uniqueNameMap[tempName] = uniqueNameMap[tempName] + 1;
        }
        else {
            uniqueNameMap[yMeasureName] = 1;
        }
        var rMeasureName = chartData[scatterMeasures.R_MEASURE] ? chartData[scatterMeasures.R_MEASURE].alias + " " + chartData[scatterMeasures.R_MEASURE].additionalFields.Variable +
            (chartData[scatterMeasures.R_MEASURE].timeShift == "" ? "" : " " + chartData[scatterMeasures.R_MEASURE].timeShift) : null;
        if (rMeasureName != null) {
            if (rMeasureName in uniqueNameMap) {
                rMeasureName += " (" + uniqueNameMap[rMeasureName].toString() + ")";
            }
        }
        return {
            X_MEASURE: xMeasureName,
            Y_MEASURE: yMeasureName,
            R_MEASURE: rMeasureName ? rMeasureName : null
        };
    };
    Utils.getMinWarmTime = function (warmStoreFrom, retentionString) {
        var minWarmTime = new Date(warmStoreFrom);
        if (retentionString !== null) {
            var retentionPeriod = Utils.parseTimeInput(retentionString);
            minWarmTime = new Date(Math.max(minWarmTime.valueOf(), (Date.now() - retentionPeriod)));
        }
        return minWarmTime;
    };
    Utils.standardizeTSStrings = function (rawData) {
        var convertedData = [];
        rawData.forEach(function (dG, i) {
            var dGName = Object.keys(dG)[0];
            var dataGroup = dG[dGName];
            var convertedDataGroup = {};
            var dataGroupKeyedObject = {};
            dataGroupKeyedObject[dGName] = convertedDataGroup;
            convertedData.push(dataGroupKeyedObject);
            if (dataGroup) {
                Object.keys(dataGroup).forEach(function (seriesName) {
                    convertedDataGroup[seriesName] = {};
                    if (dataGroup[seriesName]) {
                        Object.keys(dataGroup[seriesName]).forEach(function (rawTS) {
                            var isoString;
                            try {
                                isoString = (new Date(rawTS)).toISOString();
                                convertedDataGroup[seriesName][isoString] = dataGroup[seriesName][rawTS];
                            }
                            catch (RangeError) {
                                console.log("".concat(rawTS, " is not a valid ISO time"));
                            }
                        });
                    }
                });
            }
        });
        return convertedData;
    };
    // takes in an availability distribution and a min and max date, returns a tuple, where the first is the new distribution 
    // excluding values out of the range, and the second is all excluded values
    Utils.cullValuesOutOfRange = function (availabilityDistribution, minDateString, maxDateString) {
        var dateZero = '0000-01-01T00:00:00Z';
        var minDateValue = new Date(minDateString).valueOf();
        var maxDateValue = new Date(maxDateString).valueOf();
        if (new Date(availabilityDistribution.range.from).valueOf() < minDateValue ||
            new Date(availabilityDistribution.range.to).valueOf() > maxDateValue) {
            var inRangeValues_1 = {};
            var outOfRangeValues_1 = {};
            var highestNotOverMaxString_1 = dateZero;
            var highestNotOverMaxValue_1 = (new Date(highestNotOverMaxString_1)).valueOf();
            var lowestAboveMinValue_1 = Infinity;
            Object.keys(availabilityDistribution.distribution).forEach(function (bucketKey) {
                var bucketValue = (new Date(bucketKey)).valueOf();
                if (bucketValue > maxDateValue || bucketValue < minDateValue) {
                    outOfRangeValues_1[bucketKey] = availabilityDistribution.distribution[bucketKey];
                }
                else {
                    inRangeValues_1[bucketKey] = availabilityDistribution.distribution[bucketKey];
                    if (bucketValue > highestNotOverMaxValue_1) {
                        highestNotOverMaxValue_1 = bucketValue;
                        highestNotOverMaxString_1 = bucketKey;
                    }
                    if (bucketValue < lowestAboveMinValue_1) {
                        lowestAboveMinValue_1 = bucketValue;
                    }
                }
            });
            var bucketSize = this.parseTimeInput(availabilityDistribution.intervalSize);
            if (highestNotOverMaxString_1 !== dateZero) { // a value exists 
                var nowMillis = new Date().valueOf();
                if (highestNotOverMaxValue_1 < nowMillis && (highestNotOverMaxValue_1 + bucketSize) > nowMillis) {
                    // the new end value was before now, but after adding bucket size, its after now
                    // so we set it to now to avoid setting it to a date in the future
                    availabilityDistribution.range.to = new Date(nowMillis).toISOString();
                }
                else {
                    availabilityDistribution.range.to = new Date(highestNotOverMaxValue_1 + bucketSize).toISOString();
                }
            }
            else {
                var rangeToValue = (new Date(availabilityDistribution.range.to)).valueOf();
                if (minDateValue > rangeToValue) { // entire window is to the right of distribution range
                    availabilityDistribution.range.to = maxDateString;
                }
                else {
                    var toValue = Math.min(maxDateValue + bucketSize, (new Date(availabilityDistribution.range.to)).valueOf()); //clamped to maxDateString passed in
                    availabilityDistribution.range.to = (new Date(toValue)).toISOString();
                }
            }
            if (lowestAboveMinValue_1 !== Infinity) { // a value exists
                availabilityDistribution.range.from = (new Date(lowestAboveMinValue_1)).toISOString();
            }
            else {
                var rangeFromValue = (new Date(availabilityDistribution.range.from)).valueOf();
                if (maxDateValue < (new Date(availabilityDistribution.range.from)).valueOf()) { // entire window is to the left of distribution range
                    availabilityDistribution.range.from = minDateString;
                }
                else {
                    var fromValue = Math.max(minDateValue, rangeFromValue); // clamped to minDateString passed in
                    availabilityDistribution.range.from = (new Date(fromValue)).toISOString();
                }
            }
            availabilityDistribution.distribution = inRangeValues_1;
            return [availabilityDistribution, outOfRangeValues_1];
        }
        return [availabilityDistribution, {}];
    };
    Utils.mergeAvailabilities = function (warmAvailability, coldAvailability, retentionString) {
        if (retentionString === void 0) { retentionString = null; }
        var warmStoreRange = warmAvailability.range;
        var minWarmTime = this.getMinWarmTime(warmStoreRange.from, retentionString);
        var warmStoreToMillis = new Date(warmStoreRange.to).valueOf();
        var coldStoreToMillis = new Date(coldAvailability.range.to).valueOf();
        // snap warm availability to cold availability if its ahead of cold
        var maxWarmTime = new Date(Math.min(warmStoreToMillis, coldStoreToMillis));
        var mergedAvailability = Object.assign({}, coldAvailability);
        mergedAvailability.warmStoreRange = [minWarmTime.toISOString(), maxWarmTime.toISOString()];
        if (retentionString !== null) {
            mergedAvailability.retentionPeriod = retentionString;
        }
        return mergedAvailability;
    };
    Utils.languageGuess = function () {
        return navigator.languages && navigator.languages[0] || // Chrome / Firefox
            navigator.language; // All browsers
    };
    Utils.memorySizeOf = function (obj) {
        var bytes = 0;
        var sizeOf = function (obj) {
            if (obj !== null && obj !== undefined) {
                switch (typeof obj) {
                    case 'number':
                        bytes += 8;
                        break;
                    case 'string':
                        bytes += obj.length * 2;
                        break;
                    case 'boolean':
                        bytes += 4;
                        break;
                    case 'object':
                        var objClass = Object.prototype.toString.call(obj).slice(8, -1);
                        if (objClass === 'Object' || objClass === 'Array') {
                            for (var key in obj) {
                                if (!obj.hasOwnProperty(key)) {
                                    continue;
                                }
                                sizeOf(key);
                                sizeOf(obj[key]);
                            }
                        }
                        else {
                            bytes += obj.toString().length * 2;
                        }
                        break;
                }
            }
            return bytes;
        };
        return sizeOf(obj);
    };
    Utils.guidForNullTSID = Utils.guid();
    Utils.equalToEventTarget = (function (current, event) {
        return (current == event.target);
    });
    Utils.isKeyDownAndNotEnter = function (e) {
        if (e && e.type && e.type === 'keydown') {
            var key = e.which || e.keyCode;
            if (key !== 13) {
                return true;
            }
            else {
                e.preventDefault();
            }
        }
        return false;
    };
    Utils.getInstanceKey = function (instance) {
        return Utils.instanceHasEmptyTSID(instance) ? Utils.guid() : instance.timeSeriesId.map(function (id) { return id === null ? Utils.guidForNullTSID : id; }).join();
    };
    Utils.stripNullGuid = function (str) {
        return str.replace(Utils.guidForNullTSID, nullTsidDisplayString);
    };
    Utils.getTimeSeriesIdString = function (instance) {
        return instance.timeSeriesId.map(function (id) { return id === null ? nullTsidDisplayString : id; }).join(', ');
    };
    Utils.getTimeSeriesIdToDisplay = function (instance, emptyDisplayString) {
        return Utils.instanceHasEmptyTSID(instance) ? emptyDisplayString : instance.timeSeriesId.map(function (id) { return id === null ? Utils.guidForNullTSID : id; }).join(', ');
    };
    Utils.getHighlightedTimeSeriesIdToDisplay = function (instance) {
        var _a;
        return (_a = instance.highlights) === null || _a === void 0 ? void 0 : _a.timeSeriesId.map(function (id, idx) { return instance.timeSeriesId[idx] === null ? Utils.guidForNullTSID : id; }).join(', ');
    };
    Utils.instanceHasEmptyTSID = function (instance) {
        return !instance.timeSeriesId || instance.timeSeriesId.length === 0;
    };
    // appends dom elements of stripped strings including hits (for instance search results) and mono classed spans (for null tsid)
    Utils.appendFormattedElementsFromString = function (targetElem, str, options) {
        if (options === void 0) { options = null; }
        var data = [];
        var splitByNullGuid = function (str) {
            var data = [];
            var splittedByNull = str.split(Utils.guidForNullTSID);
            splittedByNull.forEach(function (s, i) {
                if (i === 0) {
                    if (s) {
                        data.push({ str: s });
                    }
                }
                else {
                    data.push({ str: nullTsidDisplayString, isNull: true });
                    if (s) {
                        data.push({ str: s });
                    }
                }
            });
            return data;
        };
        var splitByTag = options && options.splitByTag ? options.splitByTag : 'hit';
        var splittedByHit = str.split("<".concat(splitByTag, ">"));
        splittedByHit.forEach(function (s, i) {
            if (i === 0) {
                data = data.concat(splitByNullGuid(s));
            }
            else {
                var splittedByHitClose = s.split("</".concat(splitByTag, ">"));
                data.push({ str: splittedByHitClose[0], isHit: true });
                data = data.concat(splitByNullGuid(splittedByHitClose[1]));
            }
        });
        var additionalClassName = options && options.additionalClassName ? options.additionalClassName : '';
        var children = targetElem.selectAll('.tsi-formattedChildren').data(data);
        children.enter()
            .append(function (d) {
            return d.isHit ? document.createElement('mark')
                : options && options.inSvg ? document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
                    : document.createElement('span');
        })
            .classed('tsi-formattedChildren', true)
            .merge(children)
            .classed('tsi-baseMono', function (d) { return d.isNull; })
            .classed(additionalClassName, options && options.additionalClassName)
            .text(function (d) { return d.str; });
        children.exit().remove();
    };
    Utils.escapedTsidForExactSearch = function (tsid) {
        var escapedTsid = tsid || '';
        if (tsid) {
            CharactersToEscapeForExactSearchInstance.forEach(function (c) {
                escapedTsid = escapedTsid.split(c).join('+');
            });
        }
        return escapedTsid;
    };
    return Utils;
}());

export { DataTypes as D, EventElementTypes as E, GRIDCONTAINERCLASS as G, InterpolationFunctions as I, KeyCodes as K, LINECHARTTOPPADDING as L, MARKERVALUENUMERICHEIGHT as M, NONNUMERICTOPMARGIN as N, ShiftTypes as S, TooltipMeasureFormat as T, Utils as U, VALUEBARHEIGHT as V, YAxisStates as Y, DefaultHierarchyNavigationOptions as a, LINECHARTXOFFSET as b, LINECHARTCHARTMARGINS as c, SERIESLABELWIDTH as d, swimlaneLabelConstants as s, valueTypes as v };
