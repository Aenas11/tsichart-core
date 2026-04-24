import * as d3 from 'd3';
import Utils from "../utils";
import { ChartVisualizationComponent } from './ChartVisualizationComponent';

/**
 * Shared base class for chart components that render a temporal x-axis.
 *
 * Subclasses must configure `this.x` before using this class. In practice that means
 * creating the D3 time scale, setting its range, and assigning its final domain before
 * calling `drawXAxis(yOffset, snapFirst, snapLast)` or `updateXAxis(forceFirst, forceLast)`.
 *
 * The main flow is:
 *
 * - `createOffsetXAxis()` returns a copy of `this.x` so tick generation uses the same
 *   runtime domain as the chart geometry.
 * - `createXAxis(singleLineXAxisLabel, snapFirst, snapLast)` generates tick values from
 *   that copied scale, optionally replaces the first or last tick with `this.x.domain()`
 *   edges, and returns the configured `d3.axisBottom(this.x)` instance.
 * - `getXTickNumber(singleLineXAxisLabel)` derives the target tick count from
 *   `this.chartWidth`.
 * - `labelFormatUsesSeconds(ticks)` and `labelFormatUsesMillis(ticks)` choose label
 *   precision from adjacent tick spacing.
 * - `createSmartTickFormat(ticks, offsetX)` decides whether each label should show only
 *   time or both time and date.
 * - `updateAxisText(forceFirst, forceLast)` rewrites tick labels after layout, applying
 *   `this.chartOptions.xAxisTimeFormat` when provided or the formatter from
 *   `createSmartTickFormat(ticks, offsetX)` otherwise.
 * - `keepTickLabelsInView()` hides overlapping or overflowing tick labels after text has
 *   been rendered.
 *
 * The important contract is that this class reads from the already-configured `this.x`
 * instead of re-deriving the domain from raw options. That keeps horizontal axis
 * placement consistent with the scale the chart is actually using.
 */
class TemporalXAxisComponent extends ChartVisualizationComponent {

    protected xAxis;
    protected x;
    protected chartHeight;
    private smartTickFormat;
    private xAxisEntered;

    constructor(renderTarget: Element) {
        super(renderTarget);
    }

    /**
     * Builds a copy of the already-configured x scale.
     * Tick calculation must derive from the resolved runtime domain so axis geometry
     * stays consistent with the scale that the chart is actually rendering.
     */
    private createOffsetXAxis() {
        return this.x.copy();
    }

    /**
     * Creates the bottom x-axis with an explicit tick list and matching formatter.
     * The first or last tick can be snapped to the exact domain edge when needed.
     */
    private createXAxis(singleLineXAxisLabel, snapFirst = false, snapLast = false) {
        let offsetX: any = this.createOffsetXAxis();
        let ticks = offsetX.ticks(this.getXTickNumber(singleLineXAxisLabel));
        if (ticks.length <= 2) {
            ticks = this.x.domain();
        }

        if (snapFirst) {
            ticks[0] = this.x.domain()[0];
        }
        if (snapLast) {
            ticks[ticks.length - 1] = this.x.domain()[1];
        }

        this.smartTickFormat = this.createSmartTickFormat(ticks, offsetX);
        return d3.axisBottom(this.x)
            .tickValues(ticks)
            .tickFormat(Utils.timeFormat(this.labelFormatUsesSeconds(ticks), this.labelFormatUsesMillis(ticks), this.chartOptions.offset, this.chartOptions.is24HourTime, null, null, this.chartOptions.dateLocale));
    }

    /**
     * Chooses a target tick count from the chart width.
     * Single-line labels need more spacing, so they use fewer ticks.
     */
    private getXTickNumber(singleLineXAxisLabel) {
        return Math.max((singleLineXAxisLabel ? Math.floor(this.chartWidth / 300) : Math.floor(this.chartWidth / 160)), 1);
    }

    /**
     * Enables seconds in tick labels only when adjacent ticks are closer than one minute.
     */
    private labelFormatUsesSeconds(ticks = null) {
        let tickSpanSubMinute = ticks ? !this.isTickSpanGreaterThan(ticks, 59 * 1000) : false;
        return !this.chartOptions.minutesForTimeLabels && tickSpanSubMinute;
    }

    /**
     * Enables millisecond precision only when adjacent ticks are closer than one second.
     */
    private labelFormatUsesMillis(ticks = null) {
        let tickSpanSubSecond = ticks ? !this.isTickSpanGreaterThan(ticks, 999) : false;
        return !this.chartOptions.minutesForTimeLabels && tickSpanSubSecond;
    }

    public updateXAxis(forceFirst = false, forceLast = false) {
        this.xAxisEntered.call(this.createXAxis(this.chartOptions.singleLineXAxisLabel, forceFirst, forceLast));
        this.updateAxisText(forceFirst, forceLast);
    }

    /**
     * Hides ticks whose labels would overlap or extend past the right edge of the SVG.
     * Labels are reset before measuring so repeated renders do not accumulate transforms.
     */
    private keepTickLabelsInView() {
        if (!this.xAxisEntered) {
            return;
        }

        const svgNode = this.xAxisEntered.node()?.ownerSVGElement as SVGSVGElement | null;
        if (!svgNode) {
            return;
        }

        const svgRect = svgNode.getBoundingClientRect();
        let lastVisibleTextRect: DOMRect | null = null;

        this.xAxisEntered.selectAll('.tick').each(function () {
            const tick = d3.select(this);
            const tickText = tick.select('text');
            if (tickText.empty()) {
                return;
            }

            tick.style('display', null);
            tickText
                .attr('transform', null)
                .attr('text-anchor', 'middle');

            const textNode = tickText.node() as SVGGraphicsElement | null;
            if (!textNode) {
                return;
            }

            const textRect = textNode.getBoundingClientRect();
            const overlapsPrevious = lastVisibleTextRect !== null && Math.floor(textRect.left) < Math.ceil(lastVisibleTextRect.right);
            const rightOverflow = Math.ceil(textRect.right - svgRect.right);

            if (overlapsPrevious || rightOverflow > 0) {
                tick.style('display', 'none');
                return;
            }

            lastVisibleTextRect = textRect;
        });
    }

    /**
     * Rewrites tick text after the axis is drawn, applying either a custom formatter
     * or the smart built-in formatter, then splits and trims labels for visibility.
     */
    private updateAxisText(forceFirst = false, forceLast = false) {
        //update text by applying function
        if (this.chartOptions.xAxisTimeFormat) {
            let indexOfLast = this.xAxisEntered.selectAll('.tick').size() - 1;
            let self = this;
            this.xAxisEntered.selectAll('.tick').each(function (d, i) {
                d3.select(this).select('text').text((d) => {
                    let momentTimeFormatString: string = String(self.chartOptions.xAxisTimeFormat(d, i, i === 0, i === indexOfLast));
                    return Utils.timeFormat(self.labelFormatUsesSeconds(), self.labelFormatUsesMillis(), self.chartOptions.offset, self.chartOptions.is24HourTime, null, momentTimeFormatString, self.chartOptions.dateLocale)(d);
                });
            });
        } else {
            let indexOfLast = this.xAxisEntered.selectAll('.tick').size() - 1;
            let self = this;
            this.xAxisEntered.selectAll('.tick').each(function (d, i) {
                d3.select(this).select('text').text((d) => {
                    let momentTimeFormatString: string = String(self.smartTickFormat(d, i, i === 0, i === indexOfLast));
                    //harcode format of first and last to include hours/minutes if force first/last
                    if ((i === 0 && forceFirst) || (i === indexOfLast && forceLast)) {
                        momentTimeFormatString = 'L ' + Utils.subDateTimeFormat(self.chartOptions.is24HourTime, false, false);
                    }
                    return Utils.timeFormat(self.labelFormatUsesSeconds(), self.labelFormatUsesMillis(), self.chartOptions.offset, self.chartOptions.is24HourTime, null, momentTimeFormatString, self.chartOptions.dateLocale)(d);
                });
            });
        }

        if (!this.chartOptions.singleLineXAxisLabel)
            this.xAxisEntered.selectAll('text').call(Utils.splitTimeLabel);

        this.keepTickLabelsInView();

        this.xAxisEntered.select(".domain").style("display", "none");
    }

    protected drawXAxis(yOffset, snapFirst = false, snapLast = false) {
        this.xAxisEntered = this.xAxis.enter()
            .append("g")
            .attr("class", "xAxis")
            .merge(this.xAxis)
            .attr("transform", "translate(0," + yOffset + ")")
            .call(this.createXAxis(this.chartOptions.singleLineXAxisLabel, snapFirst, snapLast));
        this.updateAxisText(snapFirst, snapLast);
    }

    private isSameDate(d1, d2) {
        return (d1.getYear() === d2.getYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate());
    }

    /**
     * Returns whether consecutive ticks are spaced at least the provided duration apart.
     * Tick label precision uses this to decide when seconds or milliseconds are necessary.
     */
    private isTickSpanGreaterThan(ticks, minValue) {
        return (ticks[1].valueOf() - ticks[0].valueOf() >= minValue);
    }

    /**
     * Produces a formatter selector that promotes date information only when the tick set
     * crosses day boundaries or when the first/last label needs extra context.
     */
    private createSmartTickFormat(ticks, offsetX): any {
        let spansMultipleDays = !this.isSameDate(offsetX.domain()[0], offsetX.domain()[1]);
        let lessTicksThanDays = this.isTickSpanGreaterThan(ticks, 23 * 60 * 60 * 1000);

        let timeFormat = Utils.subDateTimeFormat(this.chartOptions.is24HourTime, this.labelFormatUsesSeconds(ticks), this.labelFormatUsesMillis(ticks));

        return (d, i, isFirst, isLast) => {
            let timeAndDate = this.chartOptions.singleLineXAxisLabel ? ('L ' + timeFormat) : (timeFormat + ' L');
            if (lessTicksThanDays) {
                return 'L';
            }
            if (isFirst || isLast) {
                return timeAndDate;
            }
            if (!spansMultipleDays) {
                return timeFormat;
            }
            return timeAndDate;
        }
    }

}
export { TemporalXAxisComponent }
