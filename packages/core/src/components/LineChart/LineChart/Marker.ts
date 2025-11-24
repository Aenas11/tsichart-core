import * as d3 from 'd3';
import { ILineChart } from './ILineChart';
import Utils from '../../../utils';

class Marker {
    private lineChart: ILineChart;
    private marker: any;
    private guid: string;
    private isDropping: boolean = false;
    private onMarkerChange: any;
    private labelText: string;
    private millis: number;

    constructor(lineChart: ILineChart) {
        this.lineChart = lineChart;
        this.guid = Utils.guid();
    }

    public render(millis: number, chartOptions, chartComponentData, renderOptions) {
        this.millis = millis;
        this.onMarkerChange = renderOptions.onChange;
        this.labelText = renderOptions.labelText;

        let markerContainer = d3.select(this.lineChart.renderTarget).selectAll<HTMLDivElement, this>(".tsi-markerContainer").data([this]);
        let markerContainerEntered = markerContainer.enter()
            .append("div")
            .attr("class", "tsi-markerContainer")
            .merge(markerContainer)
            .style("left", `${renderOptions.marginLeft + renderOptions.x(millis)}px`)
            .style("top", `${this.lineChart.chartMargins.top}px`)
            .style("height", `${this.lineChart.chartHeight}px`)

        let self = this;
        let drag = d3.drag()
            .on("start", function () {
                d3.select(this).classed("tsi-dragging", true);
            })
            .on("drag", function (event) {
                let rawTime = self.lineChart.x.invert(event.x);
                let closestTime = Utils.findClosestTime(rawTime.valueOf(), self.lineChart.chartComponentData.timeMap);
                self.millis = closestTime;
                d3.select(this)
                    .style("left", `${renderOptions.marginLeft + self.lineChart.x(closestTime)}px`);
            })
            .on("end", function () {
                d3.select(this).classed("tsi-dragging", false);
                if (self.onMarkerChange) {
                    self.onMarkerChange(false, true);
                }
            });

        markerContainerEntered.call(drag);

        let marker = markerContainerEntered.selectAll<HTMLDivElement, this>(".tsi-marker").data([this]);
        marker.enter()
            .append("div")
            .attr("class", "tsi-marker")
            .merge(marker);

        let label = markerContainerEntered.selectAll<HTMLDivElement, this>(".tsi-markerLabel").data([this]);
        label.enter()
            .append("div")
            .attr("class", "tsi-markerLabel")
            .merge(label)
            .text(this.labelText);

        markerContainer.exit().remove();
    }

    public getGuid() {
        return this.guid;
    }

    public getMillis() {
        return this.millis;
    }

    public setMillis(millis) {
        this.millis = millis;
    }

    public getLabelText() {
        return this.labelText;
    }

    public setLabelText(text) {
        this.labelText = text;
    }

    public isMarkerInRange() {
        return true;
    }

    public focusCloseButton() {
        return;
    }

    public destroyMarker() {
        d3.select(this.lineChart.renderTarget).selectAll(".tsi-markerContainer").filter((d: any) => d.guid === this.guid).remove();
    }
}
export default Marker;
