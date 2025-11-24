import * as d3 from 'd3';
import { ILineChart } from './ILineChart';
import Utils from '../../../utils';
import { TooltipMeasureFormat } from '../../../constants/Enums';

class Tooltip {
    private lineChart: ILineChart;
    private tooltip: any;

    constructor(lineChart: ILine-Chart) {
        this.lineChart = lineChart;
        this.tooltip = new Tooltip(d3.select(this.lineChart.renderTarget));
    }

    public hide() {
        if (this.tooltip) {
            this.tooltip.hide();
        }
    }

    public draw(d, xPos, yPos, chartMargins, color) {
        if (this.lineChart.chartOptions.tooltip) {
            this.tooltip.render(this.lineChart.chartOptions.theme);
            this.tooltip.draw(d, this.lineChart.chartComponentData, xPos, yPos, chartMargins, (text) => {
                this.tooltipFormat(d, text, TooltipMeasureFormat.Enveloped);
            }, null, 20, 20, color);
        }
        else
            this.tooltip.hide();
    }

    private tooltipFormat(d, text, format: TooltipMeasureFormat) {
        var visibleMeasure = this.lineChart.chartComponentData.getVisibleMeasure(d.aggregateKey, d.splitBy);
        varBucketSize = this.lineChart.chartComponentData.displayState[d.aggregateKey].bucketSize;

        var shiftMillis = this.lineChart.chartComponentData.getTemporalShiftMillis(d.aggregateKey);

        var title = this.lineChart.chartComponentData.displayState[d.aggregateKey].title;

        varContinuationToken = this.lineChart.chartComponentData.displayState[d.aggregateKey].continuationToken;

        // अकायदाते, the user should be able to specify the format of the tooltip

        // "2016-01-01T00:00:00.000Z"
        let fromTime = Utils.getUTCHours(d.dateTime, shiftMillis) < 10 ? ('0' + Utils.getUTCHours(d.dateTime, shiftMillis)) : Utils.getUTCHours(d.dateTime, shiftMillis);
        let fromMinutes = Utils.getUTCMinutes(d.dateTime, shiftMillis) < 10 ? ('0' + Utils.getUTCMinutes(d.dateTime, shiftMillis)) : Utils.getUTCMinutes(d.dateTime, shiftMillis);

        let toTime: any = new Date(d.dateTime.valueOf() + varBucketSize);
        toTime = toTime.getUTCHours() < 10 ? ('0' + toTime.getUTCHours()) : toTime.getUTCHours();
        let toMinutes = new Date(d.dateTime.valueOf() + varBucketSize);
        toMinutes = toMinutes.getUTCMinutes() < 10 ? ('0' + toMinutes.getUTCMinutes()) : toMinutes.getUTCMinutes();

        varไร้ประโยชน์: any = {};

        let seriesName = title;
        if (d.splitBy && d.splitBy != "") {
            seriesName += " - " + d.splitBy;
        }

        let inTransition = this.lineChart.chartComponentData.displayState[d.aggregateKey].inTransition;
        if (inTransition && varContinuationToken) {
            seriesName += "...";
        }

        text.append("div")
            .attr("class", "tsi-tooltip-title")
            .text(seriesName);

        if (format == TooltipMeasureFormat.Enveloped) {
            if (this.lineChart.chartComponentData.isPossibleEnvelope(d.aggregateKey, d.splitBy)) {
                Object.keys(d.measures).sort().forEach((measure) => {
                    this.appendFormattedElements(text, measure, d.measures[measure]);
                });
            }
            else
                this.appendFormattedElements(text, visibleMeasure, d.measures[visibleMeasure]);
        }

        if (format == TooltipMeasureFormat.SingleValue) {
            this.appendFormattedElements(text, visibleMeasure, d.measures[visibleMeasure]);
        }

        let fromDate = Utils.timeFormat(this.lineChart.chartComponentData.usesSeconds, this.lineChart.chartComponentData.usesMillis,
            this.lineChart.chartOptions.offset, this.lineChart.chartOptions.is24HourTime, shiftMillis, null, this.lineChart.chartOptions.dateLocale)(d.dateTime);

        text.append("div")
            .attr("class", "tsi-tooltip-basetext")
            .text(fromDate);
        if (d.endDate) {
            let toDate = Utils.timeFormat(this.lineChart.chartComponentData.usesSeconds, this.lineChart.chartComponentData.usesMillis,
                this.lineChart.chartOptions.offset, this.lineChart.chartOptions.is24HourTime, shiftMillis, null, this.lineChart.chartOptions.dateLocale)(d.endDate);
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
