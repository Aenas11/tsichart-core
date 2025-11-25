import * as d3 from 'd3';
import { ILineChart } from './ILineChart';
import Tooltip from '../../Tooltip/Tooltip';
import Utils from '../../../utils';
import { TooltipMeasureFormat } from '../../../constants/Enums';

class CustomTooltip {
    private lineChart: ILineChart;
    private tooltip: any;

    constructor(lineChart: ILineChart) {
        this.lineChart = lineChart;
        this.tooltip = new Tooltip(d3.select(this.lineChart.renderTarget));
    }

    public hide() {
        if (this.tooltip) {
            this.tooltip.hide();
        }
    }

    public render(theme: string) {
        this.tooltip.render(theme);
    }

    public draw(d, xPos, yPos, chartMargins, color) {
        if (this.lineChart.getChartOptions().tooltip) {
            this.tooltip.render(this.lineChart.getChartOptions().theme);
            this.tooltip.draw(d, this.lineChart.chartComponentData, xPos, yPos, chartMargins, (text) => {
                this.tooltipFormat(d, text, TooltipMeasureFormat.Enveloped);
            }, null, 20, 20, color);
        }
        else
            this.tooltip.hide();
    }

    private tooltipFormat(d, text, format: TooltipMeasureFormat) {
        var visibleMeasure = this.lineChart.chartComponentData.getVisibleMeasure(d.aggregateKey, d.splitBy);
        var bucketSize = this.lineChart.chartComponentData.displayState[d.aggregateKey].bucketSize;
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

        var shiftMillis = this.lineChart.chartComponentData.getTemporalShiftMillis(d.aggregateKey);

        var title = this.lineChart.chartComponentData.displayState[d.aggregateKey].title;

        var continuationToken = this.lineChart.chartComponentData.displayState[d.aggregateKey].continuationToken;

        let fromTime = Utils.getUTCHours(d.dateTime, shiftMillis) < 10 ? ('0' + Utils.getUTCHours(d.dateTime, shiftMillis)) : Utils.getUTCHours(d.dateTime, shiftMillis);
        let fromMinutes = Utils.getUTCMinutes(d.dateTime, shiftMillis) < 10 ? ('0' + Utils.getUTCMinutes(d.dateTime, shiftMillis)) : Utils.getUTCMinutes(d.dateTime, shiftMillis);

=======
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring

        var shiftMillis = this.lineChart.chartComponentData.getTemporalShiftMillis(d.aggregateKey);

        var title = this.lineChart.chartComponentData.displayState[d.aggregateKey].title;

        var continuationToken = this.lineChart.chartComponentData.displayState[d.aggregateKey].continuationToken;

        let fromTime = Utils.getUTCHours(d.dateTime, shiftMillis) < 10 ? ('0' + Utils.getUTCHours(d.dateTime, shiftMillis)) : Utils.getUTCHours(d.dateTime, shiftMillis);
        let fromMinutes = Utils.getUTCMinutes(d.dateTime, shiftMillis) < 10 ? ('0' + Utils.getUTCMinutes(d.dateTime, shiftMillis)) : Utils.getUTCMinutes(d.dateTime, shiftMillis);

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 7055322ec922188f65223b2000a759252bbbb96f
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
        let toTime: any = new Date(d.dateTime.valueOf() + bucketSize);
        toTime = toTime.getUTCHours() < 10 ? ('0' + toTime.getUTCHours()) : toTime.getUTCHours();
        let toMinutes = new Date(d.dateTime.valueOf() + bucketSize);
        toMinutes = toMinutes.getUTCMinutes() < 10 ? ('0' + toMinutes.getUTCMinutes()) : toMinutes.getUTCMinutes();
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

=======

>>>>>>> 7055322ec922188f65223b2000a759252bbbb96f
=======

>>>>>>> origin/airefactoring
=======

>>>>>>> origin/airefactoring
=======

>>>>>>> origin/airefactoring
=======

>>>>>>> origin/airefactoring
=======

>>>>>>> origin/airefactoring
=======

>>>>>>> origin/airefactoring
        let seriesName = title;
        if (d.splitBy && d.splitBy != "") {
            seriesName += " - " + d.splitBy;
        }
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

=======

>>>>>>> 7055322ec922188f65223b2000a759252bbbb96f
=======

>>>>>>> origin/airefactoring
=======

>>>>>>> origin/airefactoring
=======

>>>>>>> origin/airefactoring
=======

>>>>>>> origin/airefactoring
=======

>>>>>>> origin/airefactoring
=======

>>>>>>> origin/airefactoring
        let inTransition = this.lineChart.chartComponentData.displayState[d.aggregateKey].inTransition;
        if (inTransition && continuationToken) {
            seriesName += "...";
        }
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

        text.append("div")
            .attr("class", "tsi-tooltip-title")
            .text(seriesName);

=======
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring

        text.append("div")
            .attr("class", "tsi-tooltip-title")
            .text(seriesName);

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 7055322ec922188f65223b2000a759252bbbb96f
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
        if (format == TooltipMeasureFormat.Enveloped) {
            if (this.lineChart.chartComponentData.isPossibleEnvelope(d.aggregateKey, d.splitBy)) {
                Object.keys(d.measures).sort().forEach((measure) => {
                    this.appendFormattedElements(text, measure, d.measures[measure]);
                });
            }
            else
                this.appendFormattedElements(text, visibleMeasure, d.measures[visibleMeasure]);
        }
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

        if (format == TooltipMeasureFormat.SingleValue) {
            this.appendFormattedElements(text, visibleMeasure, d.measures[visibleMeasure]);
        }

        let fromDate = Utils.timeFormat(this.lineChart.chartComponentData.usesSeconds, this.lineChart.chartComponentData.usesMillis,
            this.lineChart.getChartOptions().offset, this.lineChart.getChartOptions().is24HourTime, shiftMillis, null, this.lineChart.getChartOptions().dateLocale)(d.dateTime);

=======
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring

        if (format == TooltipMeasureFormat.SingleValue) {
            this.appendFormattedElements(text, visibleMeasure, d.measures[visibleMeasure]);
        }

        let fromDate = Utils.timeFormat(this.lineChart.chartComponentData.usesSeconds, this.lineChart.chartComponentData.usesMillis,
            this.lineChart.getChartOptions().offset, this.lineChart.getChartOptions().is24HourTime, shiftMillis, null, this.lineChart.getChartOptions().dateLocale)(d.dateTime);

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 7055322ec922188f65223b2000a759252bbbb96f
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
        text.append("div")
            .attr("class", "tsi-tooltip-basetext")
            .text(fromDate);
        if (d.endDate) {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
            let toDate = Utils.timeFormat(this.lineChart.chartComponentData.usesSeconds, this.lineChart.chartComponentData.usesMillis,
=======
            let toDate = Utils.timeFormat(this.lineChart.chartComponentData.usesSeconds, this.lineChart.chartComponentData.usesMillis,
>>>>>>> 7055322ec922188f65223b2000a759252bbbb96f
=======
            let toDate = Utils.timeFormat(this.lineChart.chartComponentData.usesSeconds, this.lineChart.chartComponentData.usesMillis,
>>>>>>> origin/airefactoring
=======
            let toDate = Utils.timeFormat(this.lineChart.chartComponentData.usesSeconds, this.lineChart.chartComponentData.usesMillis,
>>>>>>> origin/airefactoring
=======
            let toDate = Utils.timeFormat(this.lineChart.chartComponentData.usesSeconds, this.lineChart.chartComponentData.usesMillis,
>>>>>>> origin/airefactoring
=======
            let toDate = Utils.timeFormat(this.lineChart.chartComponentData.usesSeconds, this.lineChart.chartComponentData.usesMillis,
>>>>>>> origin/airefactoring
=======
            let toDate = Utils.timeFormat(this.lineChart.chartComponentData.usesSeconds, this.lineChart.chartComponentData.usesMillis,
>>>>>>> origin/airefactoring
=======
            let toDate = Utils.timeFormat(this.lineChart.chartComponentData.usesSeconds, this.lineChart.chartComponentData.usesMillis,
>>>>>>> origin/airefactoring
                this.lineChart.getChartOptions().offset, this.lineChart.getChartOptions().is24HourTime, shiftMillis, null, this.lineChart.getChartOptions().dateLocale)(d.endDate);
            text.append("div")
                .attr("class", "tsi-tooltip-basetext")
                .text(toDate);
        }
    }

    private appendFormattedElements(text, measure, value) {
        var self = this;
        var measureFormat = this.lineChart.chartComponentData.getMeasureFormat(measure);
        text.append("div")
            .attr("class", "tsi-tooltip-measure")
            .text(measure);
        text.append("div")
            .attr("class", "tsi-tooltip-value")
            .text(measureFormat(value));
    }
}
export default Tooltip;
