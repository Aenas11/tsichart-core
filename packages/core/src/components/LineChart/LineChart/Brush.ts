import * as d3 from 'd3';
import { ILineChart } from './ILineChart';

class Brush {
    private lineChart: ILineChart;
    private brush: any;
    private brushElem: any;
    public brushStartTime: Date;
    public brushEndTime: Date;
    private brushStartPosition: number = null;
    private brushEndPosition: number = null;
    private hasBrush: boolean = false;
    private isClearingBrush: boolean = false;
    private surpressBrushTimeSet: boolean = false;
    private minBrushWidth = 1;

    constructor(lineChart: ILineChart) {
        this.lineChart = lineChart;
    }

    public render(chartOptions) {
        this.hasBrush = !!(chartOptions && (chartOptions.brushMoveAction || chartOptions.brushMoveEndAction || chartOptions.brushContextMenuActions));
        if (this.hasBrush) {
            this.brushElem = this.lineChart.svgSelection.select('.svgGroup').append("g")
                .attr("class", "brushElem");
            this.brushElem.classed("hideBrushHandles", !chartOptions.brushHandlesVisible);
        }
    }

    public clear() {
        if (this.brush) {
            this.lineChart.svgSelection.select('.svgGroup').select(".brushElem").call(this.brush.move, null);
        }
        this.deleteBrushRange();
        if (this.lineChart.brushContextMenu) {
            this.lineChart.brushContextMenu.hide();
        }
    }

    public setBrush() {
        if (this.brushStartTime && this.brushEndTime && this.brushElem && this.brush) {
            var rawLeftSide = this.lineChart.x(this.brushStartTime);
            var rawRightSide = this.lineChart.x(this.brushEndTime);

            //if selection is out of range of brush. clear brush
            this.brushElem.call(this.brush.move, null);
            if ((rawRightSide < this.lineChart.xOffset) || (rawLeftSide > (this.lineChart.chartWidth - (2 * this.lineChart.xOffset)))) {
                this.isClearingBrush = true;
                this.brushElem.call(this.brush.move, null);
                return;
            }

            let leftSide = Math.min(this.lineChart.chartWidth - (2 * this.lineChart.xOffset), Math.max(this.lineChart.xOffset, this.lineChart.x(this.brushStartTime)));
            let rightSide = Math.min(this.lineChart.chartWidth - (2 * this.lineChart.xOffset), Math.max(this.lineChart.xOffset, this.lineChart.x(this.brushEndTime)));

            this.surpressBrushTimeSet = true;
            this.brushStartPosition = leftSide;
            this.brushEndPosition = rightSide;
            //small adjusetment so that width is always at least 1 pixel
            if (rightSide - leftSide < 1) {
                if (rightSide + 1 > this.lineChart.chartWidth - (2 * this.lineChart.xOffset)) {
                    leftSide += -1;
                } else {
                    rightSide += 1;
                }
            }
            this.brushElem.call(this.brush.move, [leftSide, rightSide]);
        }
    }

    public draw(xLowerBound, xUpperBound) {
        if (this.brushElem) {
            var self = this;
            this.brush = d3.brushX()
                .extent([[xLowerBound, Math.min(this.lineChart.chartHeight, this.lineChart.chartOptions.aggTopMargin)],
                [xUpperBound, this.lineChart.chartHeight]])
                .on("start", function (event) {
                    if (self.lineChart.activeMarker !== null && self.lineChart.isDroppingMarker) {
                        self.lineChart.voronoiClick(event, this);
                    }
                    var handleHeight = self.lineChart.getHandleHeight();
                    self.brushElem.selectAll('.handle')
                        .attr('height', handleHeight)
                        .attr('y', (self.lineChart.chartHeight - handleHeight) / 2)
                        .attr('rx', '4px')
                        .attr('ry', '4px');
                })
                .on("brush", function (event) {
                    self.brushBrush(event);
                    self.drawBrushRange();
                })
                .on("end", function (event) {
                    self.brushEnd(event, this);
                    self.drawBrushRange();
                });
            this.brushElem.call(this.brush);
            this.setBrush();
        }
    }

    private brushBrush(event) {
        var handleHeight = this.lineChart.getHandleHeight();
        this.brushElem.selectAll('.handle')
            .attr('height', handleHeight)
            .attr('y', (this.lineChart.chartHeight - handleHeight) / 2);

        if (!event.sourceEvent) {
            return;
        }
        if (event.sourceEvent && event.sourceEvent.type === 'mousemove') {
            this.brushElem.select(".selection").attr("visibility", "visible");
            //check boundary conditions for width of the brush
            if (event.selection[1] - event.selection[0] < this.minBrushWidth) {
                return;
            } else {
                this.brushElem.selectAll(".handle").attr("visibility", "visible");
            }
        }
        if (this.surpressBrushTimeSet == true) {
            this.surpressBrushTimeSet = false;
            return;
        }
        if (!event.selection) return;

        if (this.lineChart.contextMenu)
            this.lineChart.contextMenu.hide();
        if (this.lineChart.brushContextMenu)
            this.lineChart.brushContextMenu.hide();

        var newBrushStartPosition = event.selection[0];
        var newBrushEndPosition = event.selection[1];
        if (newBrushStartPosition != this.brushStartPosition) {
            this.brushStartTime = this.lineChart.x.invert(event.selection[0]);
            this.brushStartPosition = newBrushStartPosition;
        }
        if (newBrushEndPosition != this.brushEndPosition) {
            this.brushEndTime = this.lineChart.x.invert(event.selection[1]);
            this.brushEndPosition = newBrushEndPosition;
        }

        if (this.lineChart.chartOptions.brushMoveAction) {
            this.lineChart.chartOptions.brushMoveAction(this.brushStartTime, this.brushEndTime);
        }
    }

    private brushEnd(d3Event, mouseEvent) {
        if (this.isClearingBrush) {
            this.isClearingBrush = false;
            if (this.lineChart.brushContextMenu) {
                this.lineChart.brushContextMenu.hide();
            }
            return;
        }
        if (d3Event && d3Event.selection == null && d3Event.sourceEvent && d3Event.sourceEvent.type == "mouseup" && this.lineChart.chartOptions.minBrushWidth == 0) {
            if (this.lineChart.brushContextMenu) {
                this.lineChart.brushContextMenu.hide();
            }
            const [mx, my] = d3.pointer(d3Event, mouseEvent);
            var site: any = this.lineChart.voronoiDiagram.find(mx, my);
            let isClearingBrush = (this.brushStartPosition !== null) && (this.brushEndPosition !== null);
            if (this.lineChart.chartComponentData.stickiedKey !== null && !this.lineChart.isDroppingMarker && !isClearingBrush) {
                this.lineChart.chartComponentData.stickiedKey = null;
                (<any>this.lineChart.legendObject.legendElement.selectAll('.tsi-splitByLabel')).classed("stickied", false);
                // recompute voronoi with no sticky
                this.lineChart.voronoiDiagram = this.lineChart.voronoi(this.lineChart.getFilteredAndSticky(this.lineChart.chartComponentData.allValues));
                site = this.lineChart.voronoiDiagram.find(mx, my);
                this.lineChart.voronoiMousemove(site.data);
                this.lineChart.chartOptions.onUnsticky(site.data.aggregateKey, site.data.splitBy);
                return;
            }

            this.brushStartTime = null;
            this.brushEndTime = null;
            this.brushStartPosition = null;
            this.brushEndPosition = null;

            if (!this.lineChart.isDroppingMarker && !isClearingBrush && !(this.lineChart.contextMenu && this.lineChart.contextMenu.contextMenuVisible)) {
                this.lineChart.stickySeries(site.data.aggregateKey, site.data.splitBy);
            } else {
                this.lineChart.isDroppingMarker = false;
            }
            return;
        }

        if (d3Event.selection == null) {
            if (!this.lineChart.chartOptions.brushClearable) {
                d3.select(mouseEvent).transition().call(d3Event.target.move, [this.lineChart.x(this.brushStartTime), this.lineChart.x(this.brushEndTime)]);
            }
            return;
        }
        var transformCall = null; //if the brush needs to be transformed due to snap brush or it being too small, this is envoked
        var isZeroWidth = false; //clear the brush context menu if the brush has 0 width
        if (this.lineChart.chartOptions.snapBrush) {
            //find the closest possible value and set to that
            if (this.lineChart.possibleTimesArray.length > 0) {
                var findClosestTime = (rawXValue): Date => {
                    var closestDate = null;
                    this.lineChart.possibleTimesArray.reduce((prev, curr) => {
                        var prospectiveDiff = Math.abs(rawXValue - this.lineChart.x(curr));
                        var currBestDiff = Math.abs(rawXValue - prev);
                        if (prospectiveDiff < currBestDiff) {
                            closestDate = curr;
                            return this.lineChart.x(curr)
                        }
                        return prev;
                    }, Infinity);
                    return closestDate;
                }
                var newBrushStartTime = findClosestTime(d3Event.selection[0]);
                var newBrushEndTime = findClosestTime(d3Event.selection[1]);
                if (newBrushStartTime != this.brushStartTime || newBrushEndTime != this.brushEndTime) {
                    this.brushStartTime = newBrushStartTime;
                    this.brushEndTime = newBrushEndTime;
                    this.brushStartPosition = this.lineChart.x(this.brushStartTime);
                    this.brushEndPosition = this.lineChart.x(this.brushEndTime);
                    transformCall = () => d3.select(mouseEvent).transition().call(d3Event.target.move, [this.lineChart.x(this.brushStartTime), this.lineChart.x(this.brushEndTime)]);
                    isZeroWidth = this.lineChart.x(this.brushStartTime) == this.lineChart.x(this.brushEndTime);
                }
            }
        }
        if (d3Event.selection[1] - d3Event.selection[0] < this.minBrushWidth) {
            let rightSide = Math.min(d3Event.selection[0] + this.minBrushWidth, this.lineChart.x.range()[1]);
            transformCall = () => d3.select(mouseEvent).transition().call(d3Event.target.move, [rightSide - this.minBrushWidth, rightSide]);
            isZeroWidth = (rightSide - this.minBrushWidth == rightSide);
        }
        if (this.lineChart.chartOptions.brushMoveEndAction && (d3Event.sourceEvent && d3Event.sourceEvent.type == 'mouseup')) {
            this.lineChart.chartOptions.brushMoveEndAction(this.brushStartTime, this.brushEndTime);
        }
        if (this.lineChart.chartOptions.brushContextMenuActions && this.lineChart.chartOptions.autoTriggerBrushContextMenu &&
            (d3Event.sourceEvent && d3Event.sourceEvent.type == 'mouseup')) {
            if (!this.lineChart.chartOptions.brushContextMenuActions || this.lineChart.chartOptions.brushContextMenuActions.length == 0)
                return;
            var mousePosition = d3.pointer(d3Event, <any>this.lineChart.targetElement.node());
            //constrain the mouse position to the renderTarget
            var boundingCRect = this.lineChart.targetElement.node().getBoundingClientRect();
            var correctedMousePositionX = Math.min(boundingCRect.width, Math.max(mousePosition[0], 0));
            var correctedMousePositionY = Math.min(boundingCRect.height, Math.max(mousePosition[1], 0));
            var correctedMousePosition = [correctedMousePositionX, correctedMousePositionY];

            this.lineChart.brushContextMenu.draw(this.lineChart.chartComponentData, this.lineChart.renderTarget, this.lineChart.chartOptions,
                correctedMousePosition, null, null, null, this.brushStartTime, this.brushEndTime);
        }
        if (transformCall) {
            transformCall();
            if (this.lineChart.brushContextMenu && isZeroWidth) {
                this.lineChart.brushContextMenu.hide();
            }
        }
    }

    private drawBrushRange() {
        if (this.lineChart.chartOptions.brushRangeVisible) {
            if (this.lineChart.targetElement.select('.tsi-rangeTextContainer').empty() && (this.brushStartTime || this.brushEndTime)) {
                var rangeTextContainer = this.lineChart.targetElement.append("div")
                    .attr("class", "tsi-rangeTextContainer");
            }
            this.updateBrushRange();
        }
    }

    public updateBrushRange() {
        let svgLeftOffset = this.lineChart.getSVGLeftOffset();
        if (!(this.brushStartTime || this.brushEndTime)) {
            this.deleteBrushRange();
            return;
        }

        let rangeText = Utils.rangeTimeFormat(this.brushEndTime.valueOf() - this.brushStartTime.valueOf());
        let rangeTextContainer = this.lineChart.targetElement.select('.tsi-rangeTextContainer');

        let leftPos = this.lineChart.chartMargins.left +
            Math.min(Math.max(0, this.lineChart.x(this.brushStartTime)), this.lineChart.x.range()[1]) + svgLeftOffset;

        let rightPos = this.lineChart.chartMargins.left +
            Math.min(Math.max(0, this.lineChart.x(this.brushEndTime)), this.lineChart.x.range()[1]) + svgLeftOffset;

        rangeTextContainer
            .text(rangeText)
            .style("left", Math.max(8, Math.round((leftPos + rightPos) / 2)) + "px")
            .style("top", (this.lineChart.chartMargins.top + this.lineChart.chartOptions.aggTopMargin) + 'px')

        if (this.lineChart.chartOptions.color) {
            rangeTextContainer
                .style('background-color', this.lineChart.chartOptions.color)
                .style('color', 'white');
        }

        let calcedWidth = rangeTextContainer.node().getBoundingClientRect().width;
        if (this.lineChart.chartOptions.isCompact && (rightPos - leftPos) < calcedWidth) {
            rangeTextContainer.style('visibility', 'hidden');
        } else {
            rangeTextContainer.style('visibility', 'visible');
        }
    }

    public deleteBrushRange() {
        this.lineChart.targetElement.select('.tsi-rangeTextContainer').remove();
    }

    public get brushExtents() {
        return {
            brushStartTime: this.brushStartTime,
            brushEndTime: this.brushEndTime,
            brushStartPosition: this.brushStartPosition,
            brushEndPosition: this.brushEndPosition
        };
    }

    public set brushExtents(extents) {
        this.brushStartTime = extents.brushStartTime;
        this.brushEndTime = extents.brushEndTime;
        this.brushStartPosition = extents.brushStartPosition;
        this.brushEndPosition = extents.brushEndPosition;
    }
}
export default Brush;
