import { L as LineChart } from './LineChart-BCAhJePZ.js';
import { A as AvailabilityChart } from './AvailabilityChart-CAGpQwI8.js';
import { P as PieChart } from './PieChart-BNH5PydL.js';
import { S as ScatterPlot } from './ScatterPlot-ChNxdFH-.js';
import { G as GroupedBarChart } from './GroupedBarChart-CT_GKq--.js';
import { G as Grid } from './Grid-BzURcKA2.js';
import { S as Slider } from './Slider-CrFsi4FV.js';
import { H as Hierarchy } from './Hierarchy--fsFVZDf.js';
import AggregateExpression from './AggregateExpression.js';
import { H as Heatmap } from './Heatmap-Cj0jA_xl.js';
import { E as EventsTable } from './EventsTable-DqPkdfdq.js';
import { M as ModelSearch } from './ModelSearch-DKV38a4H.js';
import { D as DateTimePicker } from './DateTimePicker-D7E-_kAs.js';
import { T as TimezonePicker } from './TimezonePicker-CoHvxukI.js';
import { U as Utils } from './Utils-CKNrHyqc.js';
import { E as EllipsisMenu } from './EllipsisMenu-HD_ON6mM.js';
import TsqExpression from './TsqExpression.js';
import { M as ModelAutocomplete } from './ModelAutocomplete-i77tybzR.js';
import { H as HierarchyNavigation } from './HierarchyNavigation-CV5oz-ZR.js';
import { S as SingleDateTimePicker } from './SingleDateTimePicker-DWOzjfxN.js';
import { D as DateTimeButtonSingle } from './DateTimeButtonSingle-CfYUWlPu.js';
import { D as DateTimeButtonRange } from './DateTimeButtonRange-K01PFL-Z.js';
import { P as ProcessGraphic } from './ProcessGraphic-Dfa341jT.js';
import { P as PlaybackControls } from './PlaybackControls-CcyC0oZd.js';
import { C as ColorPicker } from './ColorPicker-B3Zh83RV.js';
import { G as GeoProcessGraphic } from './GeoProcessGraphic-CfOCH6Xe.js';

var UXClient = /** @class */ (function () {
    function UXClient() {
        // Public facing components have class constructors exposed as public UXClient members.
        // This allows for typings to be bundled while maintaining 'new Component()' syntax
        this.DateTimePicker = DateTimePicker;
        this.PieChart = PieChart;
        this.ScatterPlot = ScatterPlot;
        this.BarChart = GroupedBarChart;
        this.LineChart = LineChart;
        this.AvailabilityChart = AvailabilityChart;
        this.Grid = Grid;
        this.Slider = Slider;
        this.Hierarchy = Hierarchy;
        this.AggregateExpression = AggregateExpression;
        this.TsqExpression = TsqExpression;
        this.Heatmap = Heatmap;
        this.EventsTable = EventsTable;
        this.ModelSearch = ModelSearch;
        this.ModelAutocomplete = ModelAutocomplete;
        this.HierarchyNavigation = HierarchyNavigation;
        this.TimezonePicker = TimezonePicker;
        this.EllipsisMenu = EllipsisMenu;
        this.SingleDateTimePicker = SingleDateTimePicker;
        this.DateTimeButtonSingle = DateTimeButtonSingle;
        this.DateTimeButtonRange = DateTimeButtonRange;
        this.ProcessGraphic = ProcessGraphic;
        this.PlaybackControls = PlaybackControls;
        this.ColorPicker = ColorPicker;
        this.GeoProcessGraphic = GeoProcessGraphic;
    }
    UXClient.prototype.UXClient = function () {
    };
    UXClient.prototype.transformTsxToEventsArray = function (events, options) {
        var timezoneOffset = options.timezoneOffset ? options.timezoneOffset : 0;
        var rows = [];
        var eventSourceProperties = {};
        var nameToStrippedPropName = {};
        var valueToStrippedValueMap = {};
        var _loop_1 = function () {
            if (events[eventIdx].hasOwnProperty('schema')) {
                eventSourceProperties[events[eventIdx].schema.rid] = {};
                eventSourceProperties[events[eventIdx].schema.rid].propertyNames = events[eventIdx].schema.properties.reduce(function (prev, curr) {
                    prev.push({ name: curr.name, type: curr.type });
                    return prev;
                }, []);
                eventSourceProperties[events[eventIdx].schema.rid].eventSourceName = events[eventIdx].schema['$esn'];
                eventSourceId = events[eventIdx].schema.rid;
            }
            else {
                eventSourceId = events[eventIdx].schemaRid;
            }
            timeStamp = (new Date((new Date(events[eventIdx]['$ts'])).valueOf() - timezoneOffset)).toISOString().slice(0, -1).replace('T', ' ');
            event = { 'timestamp ($ts)': timeStamp };
            // lts logic
            lts = events[eventIdx]['$lts'] ? events[eventIdx]['$lts'] : null;
            if (lts) {
                event['LocalTimestamp_DateTime'] = {
                    value: lts.replace('T', ' '),
                    name: 'LocalTimestamp',
                    type: 'DateTime'
                };
            }
            event["EventSourceName_String"] = {
                value: eventSourceProperties[eventSourceId].eventSourceName,
                name: 'EventSourceName',
                type: 'String'
            };
            for (var propIdx in eventSourceProperties[eventSourceId].propertyNames) {
                name = eventSourceProperties[eventSourceId].propertyNames[propIdx].name;
                if (!nameToStrippedPropName.hasOwnProperty(name))
                    nameToStrippedPropName[name] = Utils.stripForConcat(name);
                strippedName = nameToStrippedPropName[name];
                type = eventSourceProperties[eventSourceId].propertyNames[propIdx].type;
                columnNameAndType = strippedName + "_" + type;
                if (!valueToStrippedValueMap.hasOwnProperty(String(events[eventIdx].values[propIdx])))
                    valueToStrippedValueMap[String(events[eventIdx].values[propIdx])] = Utils.stripForConcat(String(events[eventIdx].values[propIdx]));
                eventObject = {
                    value: valueToStrippedValueMap[String(events[eventIdx].values[propIdx])],
                    name: strippedName,
                    type: type
                };
                event[columnNameAndType] = eventObject;
            }
            if (events[eventIdx].hasOwnProperty('$op')) {
                var defaultType_1 = 'String';
                var otherProps_1 = JSON.parse(events[eventIdx]['$op']);
                Object.keys(otherProps_1).forEach(function (propNameRaw) {
                    var strippedNameOP = Utils.stripForConcat(propNameRaw);
                    var columnNameAndTypeOP = strippedNameOP + '_String';
                    event[columnNameAndTypeOP] = {
                        value: otherProps_1[propNameRaw],
                        name: strippedNameOP,
                        type: defaultType_1
                    };
                });
            }
            rows.push(event);
        };
        var eventSourceId, timeStamp, event, lts, name, strippedName, type, columnNameAndType, eventObject;
        for (var eventIdx in events) {
            _loop_1();
        }
        return rows;
    };
    UXClient.prototype.toISONoMillis = function (dateTime) {
        return dateTime.toISOString().slice(0, -5) + "Z";
    };
    //specifiedRange gives the subset of availability buckets to be returned. If not included, will return all buckets
    UXClient.prototype.transformAvailabilityForVisualization = function (availabilityTsx) {
        var _this = this;
        var from = new Date(availabilityTsx.range.from);
        var to = new Date(availabilityTsx.range.to);
        var rawBucketSize = Utils.parseTimeInput(availabilityTsx.intervalSize);
        var buckets = {};
        var startBucket = Math.round(Math.floor(from.valueOf() / rawBucketSize) * rawBucketSize);
        var firstKey = this.toISONoMillis(new Date(startBucket));
        var firstCount = availabilityTsx.distribution[firstKey] ? availabilityTsx.distribution[firstKey] : 0;
        // reset first key if greater than the availability range from
        if (startBucket < (new Date(availabilityTsx.range.from)).valueOf())
            firstKey = this.toISONoMillis(new Date(availabilityTsx.range.from));
        buckets[firstKey] = { count: firstCount };
        Object.keys(availabilityTsx.distribution).forEach(function (key) {
            var formattedISO = _this.toISONoMillis(new Date(key));
            buckets[formattedISO] = { count: availabilityTsx.distribution[key] };
        });
        //set end time value
        var lastBucket = Math.round(Math.floor(to.valueOf() / rawBucketSize) * rawBucketSize);
        // pad out if range is less than one bucket;
        if (startBucket == lastBucket) {
            for (var i = startBucket; i <= startBucket + rawBucketSize; i += (rawBucketSize / 60)) {
                if (buckets[this.toISONoMillis(new Date(i))] == undefined)
                    buckets[this.toISONoMillis(new Date(i))] = { count: 0 };
            }
            //reset startBucket to count 0 if not the start time
            if (startBucket != from.valueOf()) {
                buckets[this.toISONoMillis(new Date(startBucket))] = { count: 0 };
            }
        }
        return [{ "availabilityCount": { "": buckets } }];
    };
    UXClient.prototype.transformAggregatesForVisualization = function (aggregates, options) {
        var result = [];
        aggregates.forEach(function (agg, i) {
            var transformedAggregate = {};
            var aggregatesObject = {};
            transformedAggregate[options[i].alias] = aggregatesObject;
            if (agg.hasOwnProperty('__tsiError__'))
                transformedAggregate[''] = {};
            else if (agg.hasOwnProperty('aggregate')) {
                agg.dimension.forEach(function (d, j) {
                    var dateTimeToValueObject = {};
                    aggregatesObject[d] = dateTimeToValueObject;
                    agg.aggregate.dimension.forEach(function (dt, k) {
                        var measuresObject = {};
                        dateTimeToValueObject[dt] = measuresObject;
                        options[i].measureTypes.forEach(function (t, l) {
                            if (agg.aggregate.measures[j][k] != null && agg.aggregate.measures[j][k] != undefined &&
                                agg.aggregate.measures[j][k][l] != null && agg.aggregate.measures[j][k][l] != undefined)
                                measuresObject[t] = agg.aggregate.measures[j][k][l];
                            else
                                measuresObject[t] = null;
                        });
                    });
                });
            }
            else {
                var dateTimeToValueObject = {};
                aggregatesObject[''] = dateTimeToValueObject;
                agg.dimension.forEach(function (dt, j) {
                    var measuresObject = {};
                    dateTimeToValueObject[dt] = measuresObject;
                    options[i].measureTypes.forEach(function (t, l) {
                        measuresObject[t] = agg.measures[j][l];
                    });
                });
            }
            result.push(transformedAggregate);
        });
        return result;
    };
    // exposed publicly to use for highlighting elements in the well on hover/focus
    UXClient.prototype.createEntityKey = function (aggName, aggIndex) {
        if (aggIndex === void 0) { aggIndex = 0; }
        return Utils.createEntityKey(aggName, aggIndex);
    };
    UXClient.prototype.transformTsqResultsToEventsArray = function (results) {
        var flattenedResults = [];
        results.forEach(function (tsqr) {
            tsqr.timestamps.forEach(function (ts, idx) {
                var event = {};
                event['timestamp ($ts)'] = ts;
                tsqr.properties.forEach(function (p) {
                    event["".concat(p.name, "_").concat(p.type)] = { name: p.name, type: p.type, value: p.values[idx] };
                });
                flattenedResults.push(event);
            });
        });
        return flattenedResults.sort(function (a, b) { return (new Date(a['timestamp ($ts)'])).valueOf() < (new Date(b['timestamp ($ts)'])).valueOf() ? -1 : 1; });
    };
    return UXClient;
}());

export { UXClient as U };
