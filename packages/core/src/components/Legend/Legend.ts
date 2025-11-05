import * as d3 from 'd3';
import './Legend.scss';
import { Component } from '../../interfaces/Component';
import { ChartComponentData } from '../../models/ChartComponentData';
// Note: LegendState and VirtualList are available for future use but not currently integrated
// See STATE_MANAGEMENT_NOTE.md for details
// import { LegendState } from './LegendState';
// import { VirtualList } from './VirtualList';
import { DataTypes, EventElementTypes } from '../../constants/Enums';
import Utils from '../../utils';

/**
 * Constants for Legend component layout and behavior
 */
const LEGEND_CONSTANTS = {
    /** Height in pixels for each numeric split-by item (includes type selector dropdown) */
    NUMERIC_SPLITBY_HEIGHT: 44,

    /** Height in pixels for each non-numeric (categorical/events) split-by item */
    NON_NUMERIC_SPLITBY_HEIGHT: 24,

    /** Height in pixels for the series name label header */
    NAME_LABEL_HEIGHT: 24,

    /** Vertical padding in pixels between series label elements */
    VERTICAL_PADDING: 16,

    /** Buffer distance in pixels from scroll edge before triggering "load more" */
    SCROLL_BUFFER: 40,

    /** Number of split-by items to load per batch when paginating */
    BATCH_SIZE: 20,

    /** Minimum height in pixels for aggregate container */
    MIN_AGGREGATE_HEIGHT: 201,

    /** Minimum width in pixels for each series label in compact mode */
    MIN_SERIES_WIDTH: 124,
} as const;

class Legend extends Component {
    public drawChart: any;
    public legendElement: any;
    public legendWidth: number;
    private legendState: string;
    private stickySeriesAction: any;
    private labelMouseover: any;
    private labelMouseout: any;
    private svgSelection: any;
    private chartComponentData: ChartComponentData;


    constructor(drawChart: any, renderTarget: Element, legendWidth: number) {
        super(renderTarget);
        this.drawChart = drawChart;
        this.legendWidth = legendWidth;

        this.legendElement = d3.select(renderTarget)
            .insert("div", ":first-child")
            .attr("class", "tsi-legend")
            .style("left", "0px");
        // Note: width is set conditionally in draw() based on legendState
        // to allow CSS to control width in compact mode

    }


    private getHeightPerSplitBy(aggKey: string): number {
        const dataType = this.chartComponentData.displayState[aggKey].dataType;
        return dataType === DataTypes.Numeric
            ? LEGEND_CONSTANTS.NUMERIC_SPLITBY_HEIGHT
            : LEGEND_CONSTANTS.NON_NUMERIC_SPLITBY_HEIGHT;
    }

    private addColorKey(
        selection: d3.Selection<HTMLElement, any, any, any>,
        aggKey: string,
        splitBy: string,
        dataType: DataTypes
    ): void {
        const colors = Utils.createSplitByColors(
            this.chartComponentData.displayState,
            aggKey,
            this.chartOptions.keepSplitByColor
        );
        const splitByKeys = Object.keys(this.chartComponentData.timeArrays[aggKey]);
        const splitByIndex = splitByKeys.indexOf(splitBy);
        const color = this.chartComponentData.isFromHeatmap
            ? this.chartComponentData.displayState[aggKey].color
            : colors[splitByIndex];

        const colorKey = selection.selectAll<HTMLDivElement, string>('.tsi-colorKey').data([color]);
        const colorKeyEntered = colorKey.enter()
            .append('div')
            .attr('class', 'tsi-colorKey')
            .merge(colorKey);

        if (dataType === DataTypes.Numeric) {
            colorKeyEntered.style('background-color', d => d);
        } else {
            this.createNonNumericColorKey(dataType, colorKeyEntered, aggKey);
        }

        colorKey.exit().remove();
    }

    private addEyeIcon(
        selection: d3.Selection<HTMLElement, any, any, any>,
        aggKey: string,
        splitBy: string
    ): void {
        if (selection.select('.tsi-eyeIcon').empty()) {
            selection.append('button')
                .attr('class', 'tsi-eyeIcon')
                .attr('aria-label', () => {
                    const showOrHide = this.chartComponentData.displayState[aggKey].splitBys[splitBy].visible
                        ? this.getString('hide series')
                        : this.getString('show series');
                    return `${showOrHide} ${splitBy} ${this.getString('in group')} ${this.chartComponentData.displayState[aggKey].name}`;
                })
                .attr('title', () => this.getString('Show/Hide values'))
                .on('click', (event) => {
                    event.stopPropagation();
                    this.toggleSplitByVisible(aggKey, splitBy);
                    this.drawChart();
                });
        }

        selection.select('.tsi-eyeIcon')
            .classed('shown', Utils.getAgVisible(this.chartComponentData.displayState, aggKey, splitBy));
    }

    private addSeriesName(
        selection: d3.Selection<HTMLElement, any, any, any>,
        aggKey: string,
        splitBy: string
    ): void {
        if (selection.select('.tsi-seriesName').empty()) {
            const seriesName = selection.append('div')
                .attr('class', 'tsi-seriesName');

            const noSplitBys = Object.keys(this.chartComponentData.timeArrays[aggKey]).length === 1
                && Object.keys(this.chartComponentData.timeArrays[aggKey])[0] === '';

            const displayText = noSplitBys
                ? this.chartComponentData.displayState[aggKey].name
                : splitBy;

            Utils.appendFormattedElementsFromString(seriesName, displayText);
        }
    }

    private addSeriesTypeSelection(
        selection: d3.Selection<HTMLElement, any, any, any>,
        aggKey: string,
        splitBy: string
    ): void {
        if (selection.select('.tsi-seriesTypeSelection').empty()) {
            selection.append('select')
                .attr('aria-label', `${this.getString('Series type selection for')} ${splitBy} ${this.getString('in group')} ${this.chartComponentData.displayState[aggKey].name}`)
                .attr('class', 'tsi-seriesTypeSelection')
                .on('change', (event) => {
                    const seriesType = d3.select(event.target).property('value');
                    this.chartComponentData.displayState[aggKey].splitBys[splitBy].visibleType = seriesType;
                    this.drawChart();
                })
                .on('click', (event) => {
                    event.stopPropagation();
                });
        }

        selection.select('.tsi-seriesTypeSelection')
            .each((d, i, nodes) => {
                const typeLabels = d3.select(nodes[i])
                    .selectAll<HTMLOptionElement, any>('option')
                    .data(this.chartComponentData.displayState[aggKey].splitBys[splitBy].types.map(type => ({
                        type,
                        aggKey,
                        splitBy,
                        visibleMeasure: Utils.getAgVisibleMeasure(this.chartComponentData.displayState, aggKey, splitBy)
                    })));

                typeLabels.enter()
                    .append('option')
                    .attr('class', 'seriesTypeLabel')
                    .merge(typeLabels)
                    .property('selected', (data: any) =>
                        data.type === Utils.getAgVisibleMeasure(this.chartComponentData.displayState, data.aggKey, data.splitBy)
                    )
                    .text((data: any) => data.type);

                typeLabels.exit().remove();
            });
    }

    private handleSplitByClick(aggKey: string, splitBy: string): void {
        if (this.legendState === 'compact') {
            this.toggleSplitByVisible(aggKey, splitBy);
        } else {
            this.toggleSticky(aggKey, splitBy);
        }
        this.drawChart();
    }

    private handleSplitByMouseOver(aggKey: string, splitBy: string): void {
        this.labelMouseover(aggKey, splitBy);
    }

    private handleSplitByMouseOut(aggKey: string): void {
        this.svgSelection.selectAll(".tsi-valueElement")
            .attr("stroke-opacity", 1)
            .attr("fill-opacity", 1);
        this.labelMouseout(this.svgSelection, aggKey);
    }

    private isStickied(aggKey: string, splitBy: string): boolean {
        const stickied = this.chartComponentData.stickiedKey;
        return stickied?.aggregateKey === aggKey && stickied?.splitBy === splitBy;
    }

    private labelMouseoutWrapper(labelMouseout, svgSelection, event) {
        return (svgSelection, aggKey) => {
            event?.stopPropagation();
            svgSelection.selectAll(".tsi-valueElement")
                .filter(function () { return !d3.select(this).classed("tsi-valueEnvelope"); })
                .attr("stroke-opacity", 1)
                .attr("fill-opacity", 1);
            svgSelection.selectAll(".tsi-valueEnvelope")
                .attr("fill-opacity", .2);
            labelMouseout(svgSelection, aggKey);
        }
    }

    private toggleSplitByVisible(aggregateKey: string, splitBy: string) {
        var newState = !this.chartComponentData.displayState[aggregateKey].splitBys[splitBy].visible;
        this.chartComponentData.displayState[aggregateKey].splitBys[splitBy].visible = newState;
        this.chartComponentData.displayState[aggregateKey].visible = Object.keys(this.chartComponentData.displayState[aggregateKey].splitBys)
            .reduce((prev: boolean, curr: string): boolean => {
                return this.chartComponentData.displayState[aggregateKey]["splitBys"][curr]["visible"] || prev;
            }, false);
        //turn off sticky if making invisible
        if (newState == false && (this.chartComponentData.stickiedKey != null &&
            this.chartComponentData.stickiedKey.aggregateKey == aggregateKey &&
            this.chartComponentData.stickiedKey.splitBy == splitBy)) {
            this.chartComponentData.stickiedKey = null;
        }
    }

    public triggerSplitByFocus(aggKey: string, splitBy: string) {
        if (this.chartOptions.legend == "hidden") {
            return;
        }
        this.legendElement.selectAll('.tsi-splitByLabel').classed("inFocus", false);
        this.legendElement.selectAll('.tsi-splitByLabel').filter(function (labelData: any) {
            return (d3.select(this.parentNode).datum() == aggKey) && (labelData == splitBy);
        }).classed("inFocus", true);

        var indexOfSplitBy = Object.keys(this.chartComponentData.displayState[aggKey].splitBys).indexOf(splitBy);

        if (indexOfSplitBy != -1) {
            var splitByNode = this.legendElement.selectAll('.tsi-splitByContainer').filter((d) => {
                return d == aggKey;
            }).node();
            var prospectiveScrollTop = Math.max((indexOfSplitBy - 1) * this.getHeightPerSplitBy(aggKey), 0);
            if (splitByNode.scrollTop < prospectiveScrollTop - (splitByNode.clientHeight - LEGEND_CONSTANTS.SCROLL_BUFFER) || splitByNode.scrollTop > prospectiveScrollTop) {
                splitByNode.scrollTop = prospectiveScrollTop;
            }
        }
    }

    private createGradient(gradientKey, svg, values) {
        let gradient = svg.append('defs').append('linearGradient')
            .attr('id', gradientKey).attr('x1', '0%').attr('x2', '0%').attr('y1', '0%').attr('y2', '100%');
        let catCount = Object.keys(values).length;
        Object.keys(values).forEach((category, i) => {
            let currentStop = i / catCount * 100;
            let nextStop = (i + 1) / catCount * 100;
            let color = values[category].color;

            gradient.append('stop')
                .attr("offset", currentStop + "%")
                .attr("stop-color", color)
                .attr("stop-opacity", 1);

            gradient.append('stop')
                .attr("offset", nextStop + "%")
                .attr("stop-color", color)
                .attr("stop-opacity", 1);
        });
    }

    private createNonNumericColorKey(dataType, colorKey, aggKey) {
        if (dataType === DataTypes.Categorical) {
            this.createCategoricalColorKey(colorKey, aggKey);
        }
        if (dataType === DataTypes.Events) {
            this.createEventsColorKey(colorKey, aggKey);
        }
    }

    private createCategoricalColorKey(colorKey, aggKey) {
        let categories = this.chartComponentData.displayState[aggKey].aggregateExpression.valueMapping;
        colorKey.classed('tsi-categoricalColorKey', true);
        colorKey.selectAll('*').remove();
        let svg = colorKey.append('svg')
            .attr('width', colorKey.style('width'))
            .attr('height', colorKey.style('height'));
        let rect = svg.append('rect')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('fill', 'black');
        let gradientKey = Utils.guid();
        this.createGradient(gradientKey, svg, categories);
        rect.attr('fill', "url(#" + gradientKey + ")");
    }

    private createEventsColorKey(colorKey, aggKey) {
        let categories = this.chartComponentData.displayState[aggKey].aggregateExpression.valueMapping;
        let eventElementType = this.chartComponentData.displayState[aggKey].aggregateExpression.eventElementType;
        colorKey.classed('tsi-eventsColorKey', true);
        colorKey.selectAll('*').remove();

        let colorKeyWidth = colorKey.node().getBoundingClientRect().width;
        let colorKeyHeight = colorKey.node().getBoundingClientRect().height;
        let colorKeyUnitLength = Math.floor(colorKeyHeight / Math.sqrt(2));

        let svg = colorKey.append('svg')
            .attr('width', `${colorKeyWidth}px`)
            .attr('height', `${colorKeyHeight}px`);

        let gradientKey = Utils.guid();
        this.createGradient(gradientKey, svg, categories);

        if (eventElementType === EventElementTypes.Teardrop) {
            svg.append('path')
                .attr('transform', (d: any) => {
                    return 'translate(' + (colorKeyWidth * .75) + ',' + (colorKeyHeight * .75) + ') rotate(180)';
                })
                .attr('d', this.teardropD(colorKeyWidth / 2, colorKeyHeight / 2))
                .attr('stroke-width', Math.min(colorKeyUnitLength / 2.25, 8))
                .style('fill', 'none')
                .style('stroke', "url(#" + gradientKey + ")");

        } else {
            let rect = svg.append('rect')
                .attr('width', colorKeyUnitLength)
                .attr('height', colorKeyUnitLength)
                .attr('transform', `translate(${(colorKeyWidth / 2)},0)rotate(45)`)
                .attr('fill', 'black');
            rect.attr('fill', "url(#" + gradientKey + ")");
        }
    }

    private handleShowMoreSplitBys(aggKey: string, splitByLabelData: string[], aggSelection: any, dataType: DataTypes, noSplitBys: boolean): void {
        const oldShownSplitBys = this.chartComponentData.displayState[aggKey].shownSplitBys;
        this.chartComponentData.displayState[aggKey].shownSplitBys = Math.min(oldShownSplitBys + LEGEND_CONSTANTS.BATCH_SIZE, splitByLabelData.length);
        if (oldShownSplitBys !== this.chartComponentData.displayState[aggKey].shownSplitBys) {
            this.renderSplitBys(aggKey, aggSelection, dataType, noSplitBys);
        }
    }

    private renderSplitBys = (aggKey, aggSelection, dataType, noSplitBys) => {
        const splitByLabelData = Object.keys(this.chartComponentData.timeArrays[aggKey]);
        const showMoreSplitBys = () => this.handleShowMoreSplitBys(aggKey, splitByLabelData, aggSelection, dataType, noSplitBys);

        let splitByContainer = aggSelection.selectAll(".tsi-splitByContainer").data([aggKey]);
        const splitByContainerEntered = splitByContainer.enter().append("div")
            .merge(splitByContainer)
            .classed("tsi-splitByContainer", true);

        const splitByLabels = splitByContainerEntered.selectAll('.tsi-splitByLabel')
            .data(splitByLabelData.slice(0, this.chartComponentData.displayState[aggKey].shownSplitBys), function (d: string): string {
                return d;
            });

        const self = this;

        const splitByLabelsEntered = splitByLabels
            .enter()
            .append("div")
            .merge(splitByLabels)
            .attr('role', this.legendState === 'compact' ? 'button' : 'presentation')
            .attr('tabindex', this.legendState === 'compact' ? '0' : '-1')
            .on('keypress', (event, splitBy: string) => {
                if (this.legendState === 'compact' && (event.keyCode === 13 || event.keyCode === 32)) { //space or enter
                    this.toggleSplitByVisible(aggKey, splitBy);
                    this.drawChart();
                    event.preventDefault();
                }
            })
            .on("click", function (event: any, splitBy: string) {
                self.handleSplitByClick(aggKey, splitBy);
            })
            .on("mouseover", function (event, splitBy: string) {
                event.stopPropagation();
                self.handleSplitByMouseOver(aggKey, splitBy);
            })
            .on("mouseout", function (event) {
                event.stopPropagation();
                self.handleSplitByMouseOut(aggKey);
            })
            .attr("class", (splitBy, i) => {
                const compact = (dataType !== DataTypes.Numeric) ? 'tsi-splitByLabelCompact' : '';
                const shown = Utils.getAgVisible(self.chartComponentData.displayState, aggKey, splitBy) ? 'shown' : '';
                return `tsi-splitByLabel ${compact} ${shown}`;
            })
            .classed("stickied", (splitBy, i) => self.isStickied(aggKey, splitBy));

        // Use helper methods to render each split-by element
        splitByLabelsEntered.each(function (splitBy, j) {
            const selection = d3.select(this);

            // Add color key (conditionally based on data type and legend state)
            if (dataType === DataTypes.Numeric || noSplitBys || self.legendState === 'compact') {
                self.addColorKey(selection, aggKey, splitBy, dataType);
                selection.classed('tsi-nonCompactNonNumeric',
                    (dataType === DataTypes.Categorical || dataType === DataTypes.Events) && self.legendState !== 'compact');
            } else {
                selection.selectAll('.tsi-colorKey').remove();
            }

            // Add eye icon
            self.addEyeIcon(selection, aggKey, splitBy);

            // Add series name
            self.addSeriesName(selection, aggKey, splitBy);

            // Add series type selection for numeric data
            if (dataType === DataTypes.Numeric) {
                self.addSeriesTypeSelection(selection, aggKey, splitBy);
            } else {
                selection.selectAll('.tsi-seriesTypeSelection').remove();
            }
        });

        splitByLabels.exit().remove();

        // Show more button
        const shouldShowMore = self.chartComponentData.displayState[aggKey].shownSplitBys < splitByLabelData.length;
        splitByContainerEntered.selectAll('.tsi-legendShowMore').remove();
        if (this.legendState === 'shown' && shouldShowMore) {
            splitByContainerEntered.append('button')
                .text(this.getString('Show more'))
                .attr('class', 'tsi-legendShowMore')
                .style('display', 'block')
                .on('click', showMoreSplitBys);
        }

        // Scroll handler for infinite scrolling
        splitByContainerEntered.on("scroll", function () {
            if (self.chartOptions.legend === 'shown') {
                if ((<any>this).scrollTop + (<any>this).clientHeight + LEGEND_CONSTANTS.SCROLL_BUFFER > (<any>this).scrollHeight) {
                    showMoreSplitBys();
                }
            }
        });

        splitByContainer.exit().remove();
    }

    private toggleSticky = (aggregateKey: string, splitBy: string) => {
        //don't do anything if not visible 
        if (!this.chartComponentData.displayState[aggregateKey].visible ||
            !this.chartComponentData.displayState[aggregateKey].splitBys[splitBy].visible)
            return;
        if (this.chartComponentData.stickiedKey != null &&
            this.chartComponentData.stickiedKey.aggregateKey == aggregateKey &&
            this.chartComponentData.stickiedKey.splitBy == splitBy) {
            this.chartComponentData.stickiedKey = null;
        } else {
            if (this.stickySeriesAction) {
                this.stickySeriesAction(aggregateKey, splitBy);
            }
        }
    }

    public draw(legendState: string, chartComponentData, labelMouseover, svgSelection, options, labelMouseoutAction = null, stickySeriesAction = null, event?: any) {
        this.chartOptions.setOptions(options);
        this.chartComponentData = chartComponentData;
        this.legendState = legendState;
        this.stickySeriesAction = stickySeriesAction;
        this.labelMouseover = labelMouseover;
        this.labelMouseout = this.labelMouseoutWrapper(labelMouseoutAction, svgSelection, event);
        this.svgSelection = svgSelection;
        var legend = this.legendElement;
        var self = this;


        super.themify(this.legendElement, this.chartOptions.theme);

        legend.style('visibility', this.legendState != 'hidden')
            .classed('compact', this.legendState == 'compact')
            .classed('hidden', this.legendState == 'hidden');

        // Set width conditionally - let CSS handle compact mode width
        if (this.legendState !== 'compact') {
            legend.style('width', `${this.legendWidth}px`);
        } else {
            legend.style('width', null); // Remove inline width style in compact mode
        }

        let seriesNames = Object.keys(this.chartComponentData.displayState);
        var seriesLabels: any = legend.selectAll(".tsi-seriesLabel")
            .data(seriesNames, d => d);

        var seriesLabelsEntered = seriesLabels.enter()
            .append("div")
            .merge(seriesLabels)
            .attr("class", (d, i) => {
                return "tsi-seriesLabel " + (this.chartComponentData.displayState[d]["visible"] ? " shown" : "");
            })
            .style("min-width", () => {
                return Math.min(LEGEND_CONSTANTS.MIN_SERIES_WIDTH, this.legendElement.node().clientWidth / seriesNames.length) + 'px';
            })
            .style("border-color", function (d, i) {
                if (d3.select(this).classed("shown"))
                    return self.chartComponentData.displayState[d].color;
                return "lightgray";
            });

        var self = this;

        const usableLegendHeight: number = legend.node().clientHeight;
        var prospectiveAggregateHeight = Math.ceil(Math.max(LEGEND_CONSTANTS.MIN_AGGREGATE_HEIGHT, (usableLegendHeight / seriesLabelsEntered.size())));
        var contentHeight = 0;

        seriesLabelsEntered.each(function (aggKey: string, i: number) {
            let heightPerSplitBy = self.getHeightPerSplitBy(aggKey);
            var splitByLabelData = Object.keys(self.chartComponentData.timeArrays[aggKey]);
            var noSplitBys: boolean = splitByLabelData.length == 1 && splitByLabelData[0] == "";
            var seriesNameLabel = d3.select(this).selectAll<HTMLButtonElement, unknown>(".tsi-seriesNameLabel").data([aggKey]);
            d3.select(this).classed('tsi-nsb', noSplitBys);
            var enteredSeriesNameLabel = seriesNameLabel.enter().append("button")
                .merge(seriesNameLabel)
                .attr("class", (agg: string, i) => {
                    return "tsi-seriesNameLabel" + (self.chartComponentData.displayState[agg].visible ? " shown" : "");
                })
                .attr("aria-label", (agg: string) => {
                    let showOrHide = self.chartComponentData.displayState[agg].visible ? self.getString('hide group') : self.getString('show group');
                    return `${showOrHide} ${self.getString('group')} ${Utils.stripNullGuid(self.chartComponentData.displayState[agg].name)}`;
                })
                .on("click", function (event, d: string) {
                    var newState = !self.chartComponentData.displayState[d].visible;
                    self.chartComponentData.displayState[d].visible = newState;

                    //turn off sticky if making invisible
                    if (newState == false && (self.chartComponentData.stickiedKey != null &&
                        self.chartComponentData.stickiedKey.aggregateKey == d)) {
                        self.chartComponentData.stickiedKey = null;
                    }
                    self.drawChart();
                })
                .on("mouseover", (event, d) => {
                    labelMouseover(d);
                })
                .on("mouseout", (event, d) => {
                    self.labelMouseout(svgSelection, d);
                });
            let dataType = self.chartComponentData.displayState[aggKey].dataType;
            if (dataType === DataTypes.Categorical || dataType === DataTypes.Events) {
                enteredSeriesNameLabel.classed('tsi-nonCompactNonNumeric', true);
                let colorKey = enteredSeriesNameLabel.selectAll<HTMLDivElement, unknown>('.tsi-colorKey').data(['']);
                let colorKeyEntered = colorKey.enter()
                    .append("div")
                    .attr("class", 'tsi-colorKey')
                    .merge(colorKey);
                self.createNonNumericColorKey(dataType, colorKeyEntered, aggKey);
                colorKey.exit().remove();
            }

            var seriesNameLabelText = enteredSeriesNameLabel.selectAll<HTMLHeadingElement, unknown>("h4").data([aggKey]);
            seriesNameLabelText.enter()
                .append("h4")
                .merge(seriesNameLabelText)
                .attr("title", (d: string) => Utils.stripNullGuid(self.chartComponentData.displayState[d].name))
                .each(function () {
                    Utils.appendFormattedElementsFromString(d3.select(this), self.chartComponentData.displayState[aggKey].name);
                });


            seriesNameLabelText.exit().remove();
            seriesNameLabel.exit().remove();

            var splitByContainerHeight;
            if (splitByLabelData.length > (prospectiveAggregateHeight / heightPerSplitBy)) {
                splitByContainerHeight = prospectiveAggregateHeight - LEGEND_CONSTANTS.NAME_LABEL_HEIGHT;
                contentHeight += splitByContainerHeight + LEGEND_CONSTANTS.NAME_LABEL_HEIGHT;
            } else if (splitByLabelData.length > 1 || (splitByLabelData.length === 1 && splitByLabelData[0] !== "")) {
                splitByContainerHeight = splitByLabelData.length * heightPerSplitBy + LEGEND_CONSTANTS.NAME_LABEL_HEIGHT;
                contentHeight += splitByContainerHeight + LEGEND_CONSTANTS.NAME_LABEL_HEIGHT;
            } else {
                splitByContainerHeight = heightPerSplitBy;
                contentHeight += splitByContainerHeight;
            }
            if (self.chartOptions.legend == "shown") {
                d3.select(this).style("height", splitByContainerHeight + "px");
            } else {
                d3.select(this).style("height", "unset");
            }

            var splitByContainer = d3.select(this).selectAll<HTMLDivElement, unknown>(".tsi-splitByContainer").data([aggKey]);
            var splitByContainerEntered = splitByContainer.enter().append("div")
                .merge(splitByContainer)
                .classed("tsi-splitByContainer", true);

            let aggSelection = d3.select(this);

            self.renderSplitBys(aggKey, aggSelection, dataType, noSplitBys);

            // Compact mode horizontal scroll handler
            d3.select(this).on('scroll', function () {
                if (self.chartOptions.legend == "compact") {
                    if ((<any>this).scrollLeft + (<any>this).clientWidth + LEGEND_CONSTANTS.SCROLL_BUFFER > (<any>this).scrollWidth) {
                        self.handleShowMoreSplitBys(aggKey, splitByLabelData, aggSelection, dataType, noSplitBys);
                    }
                }
            });
            splitByContainer.exit().remove();

        });

        if (this.chartOptions.legend == 'shown') {
            //minSplitBysForFlexGrow: the minimum number of split bys for flex-grow to be triggered 
            if (contentHeight < usableLegendHeight) {
                this.legendElement.classed("tsi-flexLegend", true);
                seriesLabelsEntered.each(function (d) {
                    let heightPerSplitBy = self.getHeightPerSplitBy(d);
                    var minSplitByForFlexGrow = (prospectiveAggregateHeight - LEGEND_CONSTANTS.NAME_LABEL_HEIGHT) / heightPerSplitBy;

                    var splitBysCount = Object.keys(self.chartComponentData.displayState[String(d3.select(this).data()[0])].splitBys).length;
                    if (splitBysCount > minSplitByForFlexGrow) {
                        d3.select(this).style("flex-grow", 1);
                    }
                });
            } else {
                this.legendElement.classed("tsi-flexLegend", false);
            }
        }

        seriesLabels.exit().remove();
    }

    public destroy(): void {
        this.legendElement.remove();
        // Note: Virtual list cleanup will be added when virtual scrolling is implemented
        // this.virtualLists.forEach(list => list.destroy());
        // this.virtualLists.clear();
    }
}

export default Legend;