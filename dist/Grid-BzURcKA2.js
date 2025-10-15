import { a as __assign, _ as __extends } from './_tslib-B2CX7HIe.js';
import * as d3 from 'd3';
import { D as DataTypes, U as Utils, S as ShiftTypes, v as valueTypes, G as GRIDCONTAINERCLASS } from './Utils-CKNrHyqc.js';
import { C as Component } from './Component-C7RWgteh.js';

var ChartComponentData = /** @class */ (function () {
    function ChartComponentData() {
        var _this = this;
        this.data = {};
        this.displayState = {};
        this.timeArrays = [];
        this.visibleTSCount = 0;
        this.visibleTAs = [];
        this.allValues = [];
        this.allNumericValues = [];
        this.usesSeconds = false;
        this.usesMillis = false;
        this.fromMillis = Infinity;
        this.toMillis = 0;
        this.stickiedKey = null;
        this.isFromHeatmap = false;
        this.getSwimlane = function (aggKey) {
            return (_this.displayState[aggKey].aggregateExpression ? _this.displayState[aggKey].aggregateExpression.swimLane : null);
        };
        this.getVisibleType = function (aggKey, splitBy, defaultType, measures) {
            if (_this.displayState[aggKey] && _this.displayState[aggKey].splitBys[splitBy]) {
                var prospectiveVisible = _this.displayState[aggKey].splitBys[splitBy].visibleType;
                if (measures.indexOf(prospectiveVisible) !== -1) {
                    return prospectiveVisible;
                }
            }
            return defaultType;
        };
    }
    ChartComponentData.prototype.setAllTimestampsArray = function () {
        var allTimestamps = {};
        this.data.forEach(function (ae) {
            var aeObj = ae[Object.keys(ae)[0]];
            Object.keys(aeObj).forEach(function (timeseries) {
                Object.keys(aeObj[timeseries]).forEach(function (timestamp) {
                    allTimestamps[timestamp] = true;
                });
            });
        });
        this.allTimestampsArray = Object.keys(allTimestamps).sort();
    };
    ChartComponentData.prototype.getDataType = function (aggKey) {
        return this.displayState[aggKey] ? this.displayState[aggKey].dataType : DataTypes.Numeric;
    };
    //add colors if none present
    ChartComponentData.prototype.fillColors = function (aggregateExpressionOptions) {
        if (aggregateExpressionOptions == null)
            aggregateExpressionOptions = [];
        // correct aEOs to add empty objects if the length doesn't match up with the data
        if (aggregateExpressionOptions.length < this.data.length) {
            for (var i = aggregateExpressionOptions.length; i < this.data.length; i++) {
                aggregateExpressionOptions.push({});
            }
        }
        var colorlessCount = aggregateExpressionOptions.reduce(function (colorlessCount, aEO) {
            if (aEO.color != null)
                return colorlessCount;
            return colorlessCount + 1;
        }, 0);
        var colorI = 0;
        var colors = Utils.generateColors(colorlessCount);
        aggregateExpressionOptions.forEach(function (aEO) {
            if (aEO.color == null) {
                aEO.color = colors[colorI];
                colorI++;
            }
        });
        return aggregateExpressionOptions;
    };
    ChartComponentData.prototype.mergeDataToDisplayStateAndTimeArrays = function (data, aggregateExpressionOptions) {
        var _this = this;
        if (aggregateExpressionOptions === void 0) { aggregateExpressionOptions = null; }
        this.data = data;
        var newDisplayState = {};
        this.timeArrays = {};
        this.visibleTAs = {};
        this.allValues = [];
        this.allNumericValues = [];
        this.visibleTSCount = 0;
        this.fromMillis = Infinity;
        this.toMillis = 0;
        this.usesSeconds = false;
        this.usesMillis = false;
        aggregateExpressionOptions = this.fillColors(aggregateExpressionOptions);
        var aggKeys = Utils.getAggKeys(this.data);
        this.data = this.data.map(function (aggregate, i) {
            var aggName = Object.keys(aggregate)[0];
            var aggregateCopy = __assign({}, aggregate);
            var aggKey = aggKeys[i];
            _this.data[i].aggKey = aggKey;
            aggregateCopy.aggKey = aggKey;
            if (_this.displayState[aggKey]) {
                newDisplayState[aggKey] = {
                    visible: (aggregateExpressionOptions[i] && aggregateExpressionOptions[i].visibilityState) ?
                        aggregateExpressionOptions[i].visibilityState[0] : _this.displayState[aggKey].visible,
                    name: _this.displayState[aggKey].name,
                    color: ((aggregateExpressionOptions[i] && aggregateExpressionOptions[i].color) ?
                        aggregateExpressionOptions[i].color : _this.displayState[aggKey].color),
                    interpolationFunction: aggregateExpressionOptions[i].interpolationFunction,
                    yExtent: aggregateExpressionOptions[i].yExtent,
                    includeEnvelope: aggregateExpressionOptions[i].includeEnvelope,
                    includeDots: aggregateExpressionOptions[i].includeDots,
                    splitBys: {},
                    dataType: aggregateExpressionOptions[i].dataType,
                    visibleSplitByCap: _this.displayState[aggKey].visibleSplitByCap,
                    shownSplitBys: 20
                };
            }
            else {
                newDisplayState[aggKey] = {
                    visible: (aggregateExpressionOptions[i] && aggregateExpressionOptions[i].visibilityState) ?
                        aggregateExpressionOptions[i].visibilityState[0] : true,
                    splitBys: {},
                    name: aggName,
                    color: ((aggregateExpressionOptions[i] && aggregateExpressionOptions[i].color) ?
                        aggregateExpressionOptions[i].color : "teal"),
                    interpolationFunction: aggregateExpressionOptions[i].interpolationFunction,
                    yExtent: aggregateExpressionOptions[i].yExtent,
                    includeEnvelope: aggregateExpressionOptions[i].includeEnvelope,
                    includeDots: aggregateExpressionOptions[i].includeDots,
                    dataType: aggregateExpressionOptions[i].dataType,
                    visibleSplitByCap: 10,
                    shownSplitBys: 20
                };
            }
            if (aggregateExpressionOptions) {
                newDisplayState[aggKey].contextMenuActions = aggregateExpressionOptions[i] ?
                    aggregateExpressionOptions[i].contextMenu : [];
                newDisplayState[aggKey].aggregateExpression = aggregateExpressionOptions[i];
                // impose cap on visible splitBys if relevant
                if (aggregateExpressionOptions[i] && aggregateExpressionOptions[i].visibleSplitByCap) {
                    newDisplayState[aggKey].visibleSplitByCap = aggregateExpressionOptions[i].visibleSplitByCap;
                }
            }
            else {
                //revert to previous context menu actions if no new ones passed in and old ones exist
                var oldContextMenuActions = (_this.displayState[aggKey] && _this.displayState[aggKey].contextMenuActions) ?
                    _this.displayState[aggKey].contextMenuActions : [];
                newDisplayState[aggKey].contextMenuActions = oldContextMenuActions;
                var oldAggregateExpression = (_this.displayState[aggKey] && _this.displayState[aggKey].aggregateExpression) ?
                    _this.displayState[aggKey].aggregateExpression : {};
                newDisplayState[aggKey].aggregateExpression = oldAggregateExpression;
            }
            if (newDisplayState[aggKey].aggregateExpression && newDisplayState[aggKey].aggregateExpression.searchSpan) {
                newDisplayState[aggKey].from = new Date(newDisplayState[aggKey].aggregateExpression.searchSpan.from);
                newDisplayState[aggKey].to = new Date(newDisplayState[aggKey].aggregateExpression.searchSpan.to);
                newDisplayState[aggKey].bucketSize = newDisplayState[aggKey].aggregateExpression.searchSpan.bucketSize ?
                    Utils.parseTimeInput(newDisplayState[aggKey].aggregateExpression.searchSpan.bucketSize) :
                    null;
            }
            var aggregateVisible = newDisplayState[aggKey].visible;
            _this.timeArrays[aggKey] = [];
            _this.visibleTAs[aggKey] = {};
            Object.keys(data[i][aggName]).forEach(function (splitBy, splitByI) {
                var shiftValue = Utils.parseShift(aggregateExpressionOptions[i].timeShift, aggregateExpressionOptions[i].startAt, aggregateExpressionOptions[i].searchSpan);
                _this.timeArrays[aggKey][splitBy] = _this.convertAggregateToArray(data[i][aggName][splitBy], aggKey, aggName, splitBy, newDisplayState[aggKey].from, newDisplayState[aggKey].to, newDisplayState[aggKey].bucketSize, shiftValue);
                if (newDisplayState[aggKey].dataType === DataTypes.Categorical && aggregateExpressionOptions[i].rollupCategoricalValues) {
                    _this.timeArrays[aggKey][splitBy] = Utils.rollUpContiguous(_this.timeArrays[aggKey][splitBy]);
                }
                var isVisible;
                // first priority: set from passed in visibility state
                if (aggregateExpressionOptions[i] && aggregateExpressionOptions[i].visibilityState && aggregateExpressionOptions[i].visibilityState.length === 2) {
                    isVisible = aggregateExpressionOptions[i].visibilityState[1].indexOf(splitBy) != -1;
                }
                //second priority: special case where solo split by and is ''
                else if (aggregateExpressionOptions[i] && aggregateExpressionOptions[i].visibilityState && Object.keys(data[i][aggName]).length === 1 && splitBy === '') {
                    isVisible = aggregateExpressionOptions[i].visibilityState[0];
                }
                // third priority: already set value
                else if (_this.displayState[aggKey] && _this.displayState[aggKey].splitBys[splitBy]) {
                    isVisible = _this.displayState[aggKey].splitBys[splitBy].visible;
                }
                // last priority: set isVisible based on visibleSplitByCap 
                else {
                    isVisible = (splitByI < newDisplayState[aggKey].visibleSplitByCap);
                }
                newDisplayState[aggKey].splitBys[splitBy] = {
                    visible: isVisible,
                    visibleType: newDisplayState[aggKey].splitBys[splitBy] ? newDisplayState[aggKey].splitBys[splitBy].visibleType : null,
                    types: newDisplayState[aggKey].splitBys[splitBy] ? newDisplayState[aggKey].splitBys[splitBy].types : [],
                };
                if (_this.timeArrays[aggKey][splitBy] && _this.timeArrays[aggKey][splitBy].length &&
                    newDisplayState[aggKey].aggregateExpression && newDisplayState[aggKey].aggregateExpression.measureTypes) {
                    newDisplayState[aggKey].splitBys[splitBy].types = newDisplayState[aggKey].aggregateExpression.measureTypes;
                }
                else {
                    newDisplayState[aggKey].splitBys[splitBy].types = _this.determineMeasureTypes(_this.timeArrays[aggKey][splitBy]);
                }
                if (!newDisplayState[aggKey].splitBys[splitBy].visibleType || (newDisplayState[aggKey].splitBys[splitBy].types.indexOf(newDisplayState[aggKey].splitBys[splitBy].visibleType) === -1)) {
                    var visibleMeasure = newDisplayState[aggKey].splitBys[splitBy].types.indexOf("avg") !== -1 ? "avg" :
                        newDisplayState[aggKey].splitBys[splitBy].types[0];
                    newDisplayState[aggKey].splitBys[splitBy].visibleType = _this.getVisibleType(aggKey, splitBy, visibleMeasure, newDisplayState[aggKey].splitBys[splitBy].types);
                }
                //add to visible display states if splitby is visible
                if (newDisplayState[aggKey]["splitBys"][splitBy]["visible"] && aggregateVisible) {
                    _this.allValues = _this.allValues.concat(_this.timeArrays[aggKey][splitBy]);
                    if (newDisplayState[aggKey].dataType === DataTypes.Numeric) {
                        _this.allNumericValues = _this.allNumericValues.concat(_this.timeArrays[aggKey][splitBy]);
                    }
                    _this.usesSeconds = _this.usesSeconds || _this.doesTimeArrayUseSeconds(_this.timeArrays[aggKey][splitBy]);
                    _this.usesMillis = _this.usesMillis || _this.doesTimeArrayUseMillis(_this.timeArrays[aggKey][splitBy]);
                    _this.visibleTAs[aggKey][splitBy] = _this.timeArrays[aggKey][splitBy];
                    _this.visibleTSCount += 1;
                }
            });
            return aggregateCopy;
        });
        //ensure that the stickied Key exists in the new data, otherwise revert to null
        if (this.stickiedKey) {
            var splitBy = this.stickiedKey.splitBy;
            var aggKey = this.stickiedKey.aggregateKey;
            if (!(newDisplayState[aggKey] && newDisplayState[aggKey].visible &&
                newDisplayState[aggKey].splitBys[splitBy] && newDisplayState[aggKey].splitBys[splitBy].visible)) {
                this.stickiedKey = null;
            }
        }
        this.displayState = newDisplayState;
        this.setAllTimestampsArray();
    };
    ChartComponentData.prototype.determineMeasureTypes = function (timeArray) {
        var measureTypes = timeArray.reduce(function (measureTypes, curr) {
            if (curr && curr.measures && Object.keys(curr.measures).length) {
                Object.keys(curr.measures).forEach(function (measure) {
                    measureTypes[measure] = true;
                });
            }
            return measureTypes;
        }, {});
        return Object.keys(measureTypes);
    };
    ChartComponentData.prototype.getTemporalShiftStringTuple = function (aggKey) {
        var ae = this.displayState[aggKey].aggregateExpression;
        if (ae) {
            if (Utils.isStartAt(ae.startAt, ae.searchSpan)) {
                return [ShiftTypes.startAt, ae.startAt];
            }
            if (ae.timeShift) {
                return [ShiftTypes.shifted, ae.timeShift];
            }
        }
        return null;
    };
    ChartComponentData.prototype.getTemporalShiftMillis = function (aggKey) {
        var ae = this.displayState[aggKey].aggregateExpression;
        if (ae) {
            return Utils.parseShift(ae.timeShift, ae.startAt, ae.searchSpan);
        }
        return 0;
    };
    ChartComponentData.prototype.doesTimeArrayUseSeconds = function (timeArray) {
        return timeArray.reduce(function (prev, curr) {
            return curr.dateTime.getSeconds() != 0 || prev;
        }, false);
    };
    ChartComponentData.prototype.doesTimeArrayUseMillis = function (timeArray) {
        return timeArray.reduce(function (prev, curr) {
            return curr.dateTime.getMilliseconds() != 0 || prev;
        }, false);
    };
    //returns the from and to of all values
    ChartComponentData.prototype.setAllValuesAndVisibleTAs = function () {
        var _this = this;
        var toMillis = 0;
        var fromMillis = Infinity;
        this.allValues = [];
        this.allNumericValues = [];
        this.visibleTAs = [];
        this.visibleTSCount = 0;
        Object.keys(this.timeArrays).forEach(function (aggKey) {
            if (_this.getAggVisible(aggKey)) {
                _this.visibleTAs[aggKey] = {};
                Object.keys(_this.timeArrays[aggKey]).forEach(function (splitBy) {
                    if (_this.getSplitByVisible(aggKey, splitBy)) {
                        _this.allValues = _this.allValues.concat(_this.timeArrays[aggKey][splitBy]);
                        if (_this.displayState[aggKey].dataType === DataTypes.Numeric) {
                            _this.allNumericValues = _this.allNumericValues.concat(_this.timeArrays[aggKey][splitBy]);
                        }
                        _this.visibleTAs[aggKey][splitBy] = _this.timeArrays[aggKey][splitBy];
                        _this.visibleTSCount += 1;
                        _this.timeArrays[aggKey][splitBy].forEach(function (d) {
                            var millis = d.dateTime.valueOf();
                            var bucketSize = _this.displayState[aggKey].bucketSize;
                            if (millis < fromMillis)
                                fromMillis = millis;
                            var endValue = bucketSize ? millis + bucketSize : millis;
                            if (endValue > toMillis)
                                toMillis = endValue;
                        });
                        _this.usesSeconds = _this.usesSeconds || _this.doesTimeArrayUseSeconds(_this.timeArrays[aggKey][splitBy]);
                        _this.usesMillis = _this.usesMillis || _this.doesTimeArrayUseMillis(_this.timeArrays[aggKey][splitBy]);
                    }
                });
            }
        });
        //set this.toMillis and this.fromMillis if new values are more extreme 
        this.toMillis = (toMillis > this.toMillis) ? toMillis : this.toMillis;
        this.fromMillis = (fromMillis < this.fromMillis) ? fromMillis : this.fromMillis;
        if (this.fromMillis === Infinity) {
            this.fromMillis = this.toMillis - 1;
        }
        return [new Date(this.fromMillis), new Date(this.toMillis)];
    };
    ChartComponentData.prototype.findLastTimestampWithValue = function (aggKey, splitBy) {
        var timeArray = this.timeArrays[aggKey][splitBy];
        var i = timeArray.length - 1;
        var lastValue = null;
        while (i >= 0 && lastValue === null) {
            if (timeArray[i].measures && (timeArray[i].measures[this.getVisibleMeasure(aggKey, splitBy)] !== null)) {
                lastValue = timeArray[i];
            }
            i += -1;
        }
        return lastValue;
    };
    ChartComponentData.prototype.findFirstBucket = function (agg, fromMillis, bucketSize) {
        if (agg == null || Object.keys(agg).length == 0)
            return null;
        var possibleFirstKeys = Object.keys(agg).filter(function (a) {
            return ((new Date(a)).valueOf() + bucketSize) > fromMillis;
        });
        if (possibleFirstKeys.length === 0) {
            return null;
        }
        var firstPresentKey = possibleFirstKeys.sort(function (a, b) {
            if ((new Date(a)).valueOf() < (new Date(b)).valueOf())
                return -1;
            if ((new Date(a)).valueOf() > (new Date(b)).valueOf())
                return 1;
            return 0;
        })[0];
        var firstMillis = (new Date(firstPresentKey)).valueOf();
        while (firstMillis > fromMillis) {
            firstMillis += -bucketSize;
        }
        return firstMillis;
    };
    ChartComponentData.prototype.getNumberOfPaddedBuckets = function (from, to, bucketSize) {
        return Math.ceil((to - from) / bucketSize);
    };
    //aggregates object => array of objects containing timestamp and values. Pad with 
    ChartComponentData.prototype.convertAggregateToArray = function (agg, aggKey, aggName, splitBy, from, to, bucketSize, shiftValue) {
        if (from === void 0) { from = null; }
        if (to === void 0) { to = null; }
        if (bucketSize === void 0) { bucketSize = null; }
        var aggArray = [];
        var isoStringAgg = {};
        Object.keys(agg).forEach(function (dateString) {
            var shiftedDate = new Date((new Date(dateString)).valueOf() - shiftValue);
            var jsISOString = shiftedDate.toISOString();
            isoStringAgg[jsISOString] = agg[dateString];
        });
        agg = isoStringAgg;
        var createTimeValueObject = function () {
            var timeValueObject = {};
            timeValueObject["aggregateKey"] = aggKey;
            timeValueObject["aggregateName"] = aggName;
            timeValueObject["splitBy"] = splitBy;
            timeValueObject["measures"] = {};
            timeValueObject["bucketSize"] = bucketSize;
            return timeValueObject;
        };
        if (from)
            this.fromMillis = Math.min(from.valueOf(), this.fromMillis);
        if (to)
            this.toMillis = Math.max(to.valueOf(), this.toMillis);
        if (from && to && bucketSize) {
            var firstBucket = this.findFirstBucket(agg, from.valueOf(), bucketSize);
            if (firstBucket !== null) {
                var firstBucketMillis = firstBucket.valueOf();
                var isExcessiveBucketCount = (this.getNumberOfPaddedBuckets(firstBucketMillis, to.valueOf(), bucketSize) > 10000);
                // pad if not an excessive number of buckets
                if (!isExcessiveBucketCount) {
                    for (var currTime = new Date(firstBucketMillis); (currTime.valueOf() < to.valueOf()); currTime = new Date(currTime.valueOf() + bucketSize)) {
                        var timeValueObject = createTimeValueObject();
                        timeValueObject["dateTime"] = currTime;
                        var currTimeString = currTime.toISOString();
                        if (agg[currTimeString]) {
                            var currMeasures = agg[currTimeString];
                            Object.keys(currMeasures).forEach(function (measure) {
                                timeValueObject["measures"][measure] = currMeasures[measure];
                            });
                        }
                        else {
                            timeValueObject["measures"] = null;
                        }
                        aggArray.push(timeValueObject);
                        this.fromMillis = Math.min(from.valueOf(), currTime.valueOf());
                        this.toMillis = Math.max(to.valueOf(), currTime.valueOf() + bucketSize);
                    }
                }
                else {
                    Object.keys(agg).forEach(function (currTimeString) {
                        var timeValueObject = createTimeValueObject();
                        timeValueObject["dateTime"] = new Date(currTimeString);
                        var currMeasures = agg[currTimeString];
                        Object.keys(currMeasures).forEach(function (measure) {
                            timeValueObject["measures"][measure] = currMeasures[measure];
                        });
                        aggArray.push(timeValueObject);
                    });
                }
            }
        }
        else {
            Object.keys(agg).sort().forEach(function (dateTime) {
                var timeValueObject = createTimeValueObject();
                timeValueObject["dateTime"] = new Date(dateTime);
                if (agg[dateTime]) {
                    Object.keys(agg[dateTime]).forEach(function (measure) {
                        timeValueObject["measures"][measure] = agg[dateTime][measure];
                    });
                }
                aggArray.push(timeValueObject);
            });
        }
        return aggArray;
    };
    ChartComponentData.prototype.isSplitByVisible = function (aggI, splitBy) {
        if (this.displayState[aggI] == undefined || !this.displayState[aggI].visible)
            return false;
        if (this.displayState[aggI].splitBys[splitBy] == undefined)
            return false;
        return this.displayState[aggI].splitBys[splitBy].visible;
    };
    ChartComponentData.prototype.isPossibleEnvelope = function (aggKey, splitBy) {
        return (this.displayState[aggKey].splitBys[splitBy].visibleType == "avg") &&
            (this.displayState[aggKey].splitBys[splitBy].types.indexOf("min") != -1) &&
            (this.displayState[aggKey].splitBys[splitBy].types.indexOf("max") != -1);
    };
    ChartComponentData.prototype.getVisibleMeasure = function (aggI, splitBy) {
        if (this.displayState[aggI] == undefined || this.displayState[aggI].splitBys[splitBy] == undefined)
            return null;
        return this.displayState[aggI].splitBys[splitBy].visibleType;
    };
    ChartComponentData.prototype.getAggVisible = function (aggKey) {
        return this.displayState[aggKey].visible;
    };
    ChartComponentData.prototype.getSplitByVisible = function (aggKey, splitBy) {
        return (this.getAggVisible(aggKey) && this.displayState[aggKey].splitBys[splitBy].visible);
    };
    ChartComponentData.prototype.aggHasVisibleSplitBys = function (aggKey) {
        var _this = this;
        if (!this.getAggVisible(aggKey))
            return false;
        var hasVisibleSplitBy = false;
        Object.keys(this.displayState[aggKey].splitBys).forEach(function (splitBy) {
            if (_this.isSplitByVisible(aggKey, splitBy))
                hasVisibleSplitBy = true;
        });
        return hasVisibleSplitBy;
    };
    ChartComponentData.prototype.valueAtTS = function (aggKey, splitByName, ts) {
        var splitBy = this.displayState[aggKey].splitBys[splitByName];
        return this.data[aggKey][this.displayState[aggKey].name][splitByName][ts][splitBy.visibleType];
    };
    ChartComponentData.prototype.setFilteredAggregates = function () {
        var _this = this;
        this.filteredAggregates = Object.keys(this.displayState).filter(function (aggKey) {
            return _this.displayState[aggKey].visible;
        });
    };
    ChartComponentData.prototype.guessValueType = function (v) {
        if (typeof v === 'number') {
            return valueTypes.Double;
        }
        if (typeof v === 'string') {
            return valueTypes.String;
        }
        return valueTypes.Dynamic;
    };
    ChartComponentData.prototype.generateCSVString = function (offset, dateLocale, spMeasures) {
        var _this = this;
        if (offset === void 0) { offset = 0; }
        if (dateLocale === void 0) { dateLocale = 'en'; }
        if (spMeasures === void 0) { spMeasures = null; }
        //replace comma at end of line with end line character
        var endLine = function (s) {
            return s.slice(0, s.length - 1) + "\n";
        };
        var csvString = "";
        var headerString = "Interval, Interval (UTC),";
        var rowMap = {};
        var rowOrder = [];
        this.data.forEach(function (aggObj) {
            var aggKey = aggObj.aggKey;
            var splitByObject = _this.displayState[aggKey].aggregateExpression.splitByObject;
            Object.keys(_this.timeArrays[aggKey]).forEach(function (splitBy) {
                var splitByString = Utils.stripNullGuid(_this.displayState[aggKey].name);
                if (splitByObject !== undefined && splitByObject !== null) {
                    splitByString += "/" + splitByObject.property + "/" + splitBy;
                }
                else if (splitBy !== '') {
                    splitByString += '/' + splitBy;
                }
                else if (_this.displayState[aggKey].aggregateExpression.variableAlias) {
                    splitByString += '/' + _this.displayState[aggKey].aggregateExpression.variableAlias;
                }
                var types = spMeasures ? spMeasures : _this.displayState[aggKey].splitBys[splitBy].types;
                types.forEach(function (type) {
                    var rowKey = aggKey + "_" + splitBy + "_" + type;
                    rowMap[rowKey] = {};
                    rowOrder.push(rowKey);
                    headerString += Utils.sanitizeString(splitByString + "." + type, valueTypes.String) + ",";
                });
            });
        });
        csvString = endLine(headerString);
        this.allValues.forEach(function (value) {
            if (value.measures && Object.keys(value.measures).length != 0) {
                Object.keys(value.measures).forEach(function (type) {
                    var rowKey = value.aggregateKey + "_" + value.splitBy + "_" + type;
                    if (rowKey in rowMap) {
                        rowMap[rowKey][value.dateTime.valueOf()] =
                            (value.measures[type] == null || value.measures[type] == undefined) ?
                                "" : Utils.sanitizeString(value.measures[type], _this.guessValueType(value.measures[type]));
                    }
                });
            }
        });
        this.allTimestampsArray.forEach(function (timeString) {
            var millis = (new Date(timeString)).valueOf();
            csvString += Utils.timeFormat(_this.usesSeconds, _this.usesMillis, offset, null, null, null, dateLocale)(new Date(millis)) + ",";
            csvString += Utils.timeFormat(_this.usesSeconds, _this.usesMillis, 0, null, null, null, dateLocale)(new Date(millis)) + ",";
            rowOrder.forEach(function (rowKey) {
                csvString += (rowMap[rowKey][millis] != undefined ? rowMap[rowKey][millis] : "") + ",";
            });
            csvString = endLine(csvString);
        });
        return csvString;
    };
    ChartComponentData.prototype.getVisibilityState = function () {
        var _this = this;
        var visibilityStateArray = [];
        Object.keys(this.displayState).forEach(function (aggKey) {
            var aggDisplayState = _this.displayState[aggKey];
            var visibleSplitBys = !aggDisplayState.visible ? [] :
                Object.keys(aggDisplayState.splitBys).filter(function (splitByName) {
                    return aggDisplayState.splitBys[splitByName].visible;
                });
            var aggName = aggDisplayState.name;
            var visibilityObject = {};
            visibilityObject[aggName] = [aggDisplayState.visible, visibleSplitBys];
            visibilityStateArray.push(visibilityObject);
        });
        return visibilityStateArray;
    };
    return ChartComponentData;
}());

var Grid = /** @class */ (function (_super) {
    __extends(Grid, _super);
    function Grid(renderTarget) {
        var _this = _super.call(this, renderTarget) || this;
        _this.rowLabelKey = "__tsiLabel__";
        _this.colorKey = "__tsiColor__";
        _this.aggIndexKey = '__tsiAggIndex__';
        _this.chartComponentData = new ChartComponentData();
        _this.closeButton = null;
        _this.usesSeconds = false;
        _this.usesMillis = false;
        _this.cellClass = function (ridx, cidx) {
            return "tsi-table-" + ridx + '-' + cidx;
        };
        _this.focus = function (rowIdx, colIdx) {
            try {
                _this.gridComponent.select('.' + _this.cellClass(rowIdx, colIdx)).node()
                    .focus();
            }
            catch (e) {
                console.log(e);
            }
        };
        _this.getFormattedDate = function (h) {
            var hAsDate = (new Date(h));
            if (hAsDate != _this.getString('Invalid Date'))
                return Utils.timeFormat(_this.usesSeconds, _this.usesMillis, _this.chartOptions.offset, null, null, null, _this.chartOptions.dateLocale)(hAsDate);
            return h;
        };
        _this.setFilteredTimestamps = function () {
            if (_this.chartComponentData.fromMillis === Infinity) {
                _this.filteredTimestamps = _this.chartComponentData.allTimestampsArray;
            }
            else {
                _this.filteredTimestamps = _this.chartComponentData.allTimestampsArray.filter(function (ts) {
                    var currMillis = (new Date(ts)).valueOf();
                    return (currMillis >= _this.chartComponentData.fromMillis && currMillis < _this.chartComponentData.toMillis);
                });
            }
        };
        _this.arrowNavigate = function (d3event, rowIdx, colIdx) {
            if (d3event.keyCode === 9) {
                if (_this.closeButton) {
                    (_this.closeButton.node()).focus();
                    d3event.preventDefault();
                }
                return;
            }
            var codes = [37, 38, 39, 40];
            var codeIndex = codes.indexOf(d3event.keyCode);
            if (codeIndex == -1)
                return;
            switch (codeIndex) {
                case 0:
                    // left
                    _this.focus(rowIdx, colIdx - 1);
                    d3event.preventDefault();
                    break;
                case 1:
                    // up
                    _this.focus(rowIdx - 1, colIdx);
                    d3event.preventDefault();
                    break;
                case 2:
                    // right
                    _this.focus(rowIdx, colIdx + 1);
                    d3event.preventDefault();
                    break;
                case 3:
                    // down
                    _this.focus(rowIdx + 1, colIdx);
                    d3event.preventDefault();
                    break;
            }
        };
        return _this;
    }
    Grid.hideGrid = function (renderTarget) {
        d3.select(renderTarget).selectAll(".".concat(GRIDCONTAINERCLASS)).remove();
    };
    Grid.showGrid = function (renderTarget, chartOptions, aggregateExpressionOptions, chartComponentData) {
        chartOptions.fromChart = true;
        d3.select(renderTarget).selectAll(".".concat(GRIDCONTAINERCLASS)).remove();
        var gridContainer = d3.select(renderTarget).append('div')
            .attr('class', GRIDCONTAINERCLASS)
            .style('width', '100%')
            .style('height', '100%');
        var gridComponent = new Grid(gridContainer.node());
        gridComponent.usesSeconds = chartComponentData.usesSeconds;
        gridComponent.usesMillis = chartComponentData.usesMillis;
        gridComponent.renderFromAggregates(chartComponentData.data, chartOptions, aggregateExpressionOptions, chartComponentData);
        gridComponent.focus(0, 0);
    };
    Grid.createGridEllipsisOption = function (renderTarget, chartOptions, aggregateExpressionOptions, chartComponentData, labelText) {
        var _this = this;
        if (labelText === void 0) { labelText = 'Display Grid'; }
        return {
            iconClass: "grid",
            label: labelText,
            action: function () {
                _this.showGrid(renderTarget, chartOptions, aggregateExpressionOptions, chartComponentData);
            },
            description: ""
        };
    };
    Grid.prototype.Grid = function () {
    };
    Grid.prototype.renderFromAggregates = function (data, options, aggregateExpressionOptions, chartComponentData) {
        var _this = this;
        this.chartOptions.setOptions(options);
        var dataAsJson = data.reduce(function (p, c, i) {
            var aeName = Object.keys(c)[0];
            Object.keys(c[aeName]).forEach(function (sbName) {
                var row = {};
                Object.keys(c[aeName][sbName]).forEach(function (dt) {
                    row[dt] = c[aeName][sbName][dt];
                });
                row[_this.rowLabelKey] = (Object.keys(c[aeName]).length == 1 && sbName == "" ? aeName : sbName);
                if (aggregateExpressionOptions && aggregateExpressionOptions[i].color)
                    row[_this.colorKey] = aggregateExpressionOptions[i].color;
                row[_this.aggIndexKey] = i;
                p.push(row);
            });
            return p;
        }, []);
        return this.render(dataAsJson, options, aggregateExpressionOptions, chartComponentData);
    };
    Grid.prototype.getRowData = function () {
        var _this = this;
        var rowData = [];
        Object.keys(this.chartComponentData.timeArrays).forEach(function (aggKey) {
            Object.keys(_this.chartComponentData.timeArrays[aggKey]).forEach(function (sb, sbI) {
                if (_this.chartComponentData.getSplitByVisible(aggKey, sb)) {
                    rowData.push([aggKey, sb]);
                }
            });
        });
        return rowData;
    };
    Grid.prototype.convertSeriesToGridData = function (allTimeStampMap, currSeries) {
        Object.keys(allTimeStampMap).forEach(function (k) { return allTimeStampMap[k] = {}; });
        currSeries = currSeries.filter(function (d) {
            return d.measures !== null;
        });
        currSeries.map(function (dataPoint) {
            allTimeStampMap[dataPoint.dateTime.toISOString()] = dataPoint;
        });
        return Object.keys(allTimeStampMap).map(function (ts) {
            return allTimeStampMap[ts];
        });
    };
    Grid.prototype.addHeaderCells = function () {
        var _this = this;
        var headerCellData = this.filteredTimestamps; // this.chartComponentData.allTimestampsArray;
        var headerCells = this.tableHeaderRow.selectAll('.tsi-headerCell').data(headerCellData);
        var headerCellsEntered = headerCells.enter()
            .append('th')
            .attr("tabindex", 1)
            .merge(headerCells)
            .attr("class", function (d, i) { return _this.cellClass(0, i + 1) + ' tsi-headerCell'; })
            .on("keydown", function (event, d) {
            var e = headerCellsEntered.nodes();
            var i = e.indexOf(event.currentTarget);
            _this.arrowNavigate(event, 0, i + 1);
        })
            .text(this.getFormattedDate)
            .attr('aria-label', function (h) {
            return "".concat(_this.getString('column header for date'), " ").concat(_this.getFormattedDate(h));
        });
        headerCellsEntered.exit().remove();
    };
    Grid.prototype.addValueCells = function () {
        var rowData = this.getRowData();
        var rows = this.table.selectAll('.tsi-gridContentRow').data(rowData);
        var self = this;
        var allTimeStampMap = this.filteredTimestamps.reduce(function (tsMap, ts) {
            tsMap[ts] = {};
            return tsMap;
        }, {});
        var headerCellData = this.filteredTimestamps;
        var rowsEntered = rows.enter()
            .append('tr')
            .classed('tsi-gridContentRow', true)
            .each(function (d, i) {
            var aggKey = d[0];
            var splitBy = d[1];
            var seriesData = self.convertSeriesToGridData(allTimeStampMap, self.chartComponentData.timeArrays[aggKey][splitBy]);
            var cells = d3.select(this).selectAll('.tsi-valueCell').data(seriesData);
            var measuresData = self.chartOptions.spMeasures ? self.chartOptions.spMeasures : self.chartComponentData.displayState[aggKey].splitBys[splitBy].types;
            //Row header with the name of the series
            var headerCell = d3.select(this).selectAll('tsi-rowHeaderCell').data([d]);
            var getRowHeaderText = function (d) {
                return "".concat(self.chartComponentData.displayState[aggKey].name).concat((splitBy !== '' ? (': ' + splitBy) : ''));
            };
            headerCell.enter()
                .append('td')
                .attr("tabindex", 1)
                .merge(headerCell)
                .attr('class', function (d, col) { return "tsi-rowHeaderCell ".concat(self.cellClass(i + 1, 0)); })
                .on("keydown", function (event, d) {
                self.arrowNavigate(event, i + 1, 0);
            })
                .attr('aria-label', function (d) {
                return "".concat(self.getString('row header for'), " ").concat(Utils.stripNullGuid(getRowHeaderText()));
            })
                .each(function (d) {
                d3.select(this).select('*').remove();
                var container = d3.select(this).append('div').attr('class', 'tsi-rowHeaderContainer');
                var seriesName = container.append('div')
                    .attr('class', 'tsi-rowHeaderSeriesName');
                Utils.appendFormattedElementsFromString(seriesName, getRowHeaderText());
                var measureContainer = container.append('div')
                    .attr('class', 'tsi-rowHeaderMeasures');
                var measureNames = measureContainer.selectAll('.tsi-measureName').data(measuresData);
                measureNames.enter()
                    .append('div')
                    .attr('class', 'tsi-measureName')
                    .text(function (d) { return d; });
            });
            headerCell.exit().remove();
            var cellsEntered = cells.enter()
                .append('td')
                .merge(cells)
                .attr('class', function (d, col) { return "tsi-valueCell ".concat(self.cellClass(i + 1, col + 1)); })
                .on("keydown", function (event, d) {
                var e = cellsEntered.nodes();
                var col = e.indexOf(event.currentTarget);
                self.arrowNavigate(event, i + 1, col + 1);
            })
                .attr("tabindex", 1)
                .attr('aria-label', function (d, i) {
                if (!d.measures || Object.keys(d.measures).length === 0) {
                    return "".concat(self.getString('no values at'), " ").concat(getRowHeaderText(), " and ").concat(self.getFormattedDate(new Date(headerCellData[i])));
                }
                var formattedValues = Object.keys(d.measures).map(function (measureName) {
                    return "".concat(measureName, ": ").concat(d.measures[measureName]);
                }).join(', ');
                return "".concat(self.getString('values for cell at'), " ").concat(getRowHeaderText(), " ").concat(self.getString('and'), " ").concat(self.getFormattedDate(d.dateTime), " ").concat(self.getString('are'), " ").concat(formattedValues);
            })
                .each(function (d, i) {
                var measures = d3.select(this).selectAll('.tsi-measureValue').data(measuresData);
                measures.enter()
                    .append('div')
                    .attr('class', 'tsi-measureValue')
                    .text(function (measure) { return d.measures ? d.measures[measure] : ''; });
                measures.exit().remove();
            });
            cellsEntered.exit().remove();
        });
        rowsEntered.exit().remove();
    };
    Grid.prototype.render = function (data, options, aggregateExpressionOptions, chartComponentData) {
        var _this = this;
        if (chartComponentData === void 0) { chartComponentData = null; }
        data = Utils.standardizeTSStrings(data);
        this.chartOptions.setOptions(options);
        this.gridComponent = d3.select(this.renderTarget);
        if (chartComponentData) {
            this.chartComponentData = chartComponentData;
        }
        else {
            this.chartComponentData.mergeDataToDisplayStateAndTimeArrays(data, aggregateExpressionOptions);
        }
        this.setFilteredTimestamps();
        _super.prototype.themify.call(this, this.gridComponent, this.chartOptions.theme);
        this.gridComponent
            .classed("tsi-gridComponent", true)
            .classed("tsi-fromChart", !!options.fromChart);
        var grid = this.gridComponent
            .append('div')
            .attr("class", "tsi-gridWrapper")
            .attr("tabindex", 0)
            .on("click", function () {
            if (_this) {
                _this.focus(0, 0);
            }
        });
        Object.keys(data.reduce(function (p, c) {
            Object.keys(c).forEach(function (k) {
                if (k != _this.rowLabelKey && k != _this.colorKey)
                    p[k] = true;
            });
            return p;
        }, {})).sort();
        if (!this.table) {
            this.table = grid.append('table').classed('tsi-gridTable', true);
            this.tableHeaderRow = this.table.append('tr').classed('tsi-gridHeaderRow', true);
            this.tableHeaderRow.append('th')
                .attr("tabindex", 0)
                .attr("class", "tsi-topLeft " + this.cellClass(0, 0))
                .on("keydown", function (event) {
                _this.arrowNavigate(event, 0, 0);
            });
        }
        this.addHeaderCells();
        this.addValueCells();
        if (this.chartOptions.fromChart) {
            this.gridComponent.selectAll('.tsi-closeButton').remove();
            this.closeButton = grid.append('button')
                .attr("class", "tsi-closeButton")
                .attr('aria-label', this.getString('close grid'))
                .html('&times')
                .on('keydown', function (event) {
                if (event.keyCode === 9) {
                    _this.focus(0, 0);
                    event.preventDefault();
                }
            })
                .on("click", function () {
                if (!!options.fromChart) {
                    Utils.focusOnEllipsisButton(_this.renderTarget.parentNode);
                    _this.gridComponent.remove();
                }
            });
        }
    };
    return Grid;
}(Component));

export { ChartComponentData as C, Grid as G };
