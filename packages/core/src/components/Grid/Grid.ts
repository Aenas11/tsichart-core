import * as d3 from 'd3';
import './Grid.scss';
import Utils from "../../utils";
import { Component } from "./../../interfaces/Component";
import { ChartOptions } from '../../models/ChartOptions';
import { ChartComponentData } from '../../models/ChartComponentData';
import { GRIDCONTAINERCLASS } from '../../constants/Constants';

interface GridCell {
    dateTime?: Date;
    measures?: Record<string, number | null>;
}

interface GridRow {
    [key: string]: GridCell | string | number | undefined;
}

interface RowDataTuple extends Array<string> {
    0: string; // aggKey
    1: string; // splitBy
}

interface TimestampCache {
    key: string;
    result: string[];
}

class Grid extends Component {
    private static readonly KEYS = {
        ROW_LABEL: '__tsiLabel__',
        COLOR: '__tsiColor__',
        AGG_INDEX: '__tsiAggIndex__'
    } as const;

    private gridComponent: d3.Selection<HTMLDivElement, unknown, null, undefined> | null = null;
    private chartComponentData: ChartComponentData = new ChartComponentData();
    private closeButton: d3.Selection<HTMLButtonElement, unknown, null, undefined> | null = null;
    private filteredTimestamps: string[] = [];
    private timestampCache: TimestampCache | null = null;

    private table: d3.Selection<HTMLTableElement, unknown, null, undefined> | null = null;
    private tableHeaderRow: d3.Selection<HTMLTableRowElement, unknown, null, undefined> | null = null;

    public usesSeconds: boolean = false;
    public usesMillis: boolean = false;

    constructor(renderTarget: Element) {
        super(renderTarget);
    }

    static hideGrid(renderTarget: any) {
        d3.select(renderTarget).selectAll(`.${GRIDCONTAINERCLASS}`).remove();
    }

    static showGrid(renderTarget: any, chartOptions: ChartOptions, aggregateExpressionOptions: any,
        chartComponentData: ChartComponentData) {
        chartOptions.fromChart = true;
        d3.select(renderTarget).selectAll(`.${GRIDCONTAINERCLASS}`).remove();
        let gridContainer: any = d3.select(renderTarget).append('div')
            .attr('class', GRIDCONTAINERCLASS)
            .style('width', '100%')
            .style('height', '100%');

        var gridComponent: Grid = new Grid(gridContainer.node());
        gridComponent.usesSeconds = chartComponentData.usesSeconds;
        gridComponent.usesMillis = chartComponentData.usesMillis;
        var grid = gridComponent.renderFromAggregates(chartComponentData.data, chartOptions, aggregateExpressionOptions, chartComponentData);
        gridComponent.focus(0, 0);
    }

    static createGridEllipsisOption(renderTarget: any, chartOptions: ChartOptions, aggregateExpressionOptions: any,
        chartComponentData: ChartComponentData, labelText = 'Display Grid') {
        return {
            iconClass: "grid",
            label: labelText,
            action: () => {
                this.showGrid(renderTarget, chartOptions, aggregateExpressionOptions, chartComponentData);
            },
            description: ""
        };
    }

    private cellClass = (ridx: number, cidx: number): string => {
        return `tsi-table-${ridx}-${cidx}`;
    }

    public focus = (rowIdx: number, colIdx: number): void => {
        if (!this.gridComponent) return;

        try {
            const cell = this.gridComponent.select<HTMLElement>(`.${this.cellClass(rowIdx, colIdx)}`).node();
            cell?.focus();
        } catch (e) {
            console.error('Error focusing grid cell:', e);
        }
    }

    public renderFromAggregates(data: any, options: any, aggregateExpressionOptions: any, chartComponentData: ChartComponentData) {
        this.chartOptions.setOptions(options);
        const dataAsJson = data.flatMap((item: any, aggIndex: number) => {
            const aggName = Object.keys(item)[0];
            const aggData = item[aggName];

            return Object.entries(aggData).map(([splitByName, values]: [string, any]) => {
                const row: GridRow = { ...values };
                row[Grid.KEYS.ROW_LABEL] = (Object.keys(aggData).length === 1 && splitByName === "") ? aggName : splitByName;

                const color = aggregateExpressionOptions?.[aggIndex]?.color;
                if (color) {
                    row[Grid.KEYS.COLOR] = color;
                }

                row[Grid.KEYS.AGG_INDEX] = aggIndex;
                return row;
            });
        });
        return this.render(dataAsJson, options, aggregateExpressionOptions, chartComponentData);
    }

    private getRowData(): RowDataTuple[] {
        const rowData: RowDataTuple[] = [];

        for (const [aggKey, timeArray] of Object.entries(this.chartComponentData.timeArrays)) {
            for (const splitBy of Object.keys(timeArray)) {
                if (this.chartComponentData.getSplitByVisible(aggKey, splitBy)) {
                    rowData.push([aggKey, splitBy] as RowDataTuple);
                }
            }
        }

        return rowData;
    }

    private convertSeriesToGridData(allTimeStampMap: Record<string, GridCell>, currSeries: any[]): GridCell[] {
        // Initialize all timestamps
        for (const key of Object.keys(allTimeStampMap)) {
            allTimeStampMap[key] = {};
        }

        // Filter and map data points
        const validSeries = currSeries.filter(d => d.measures !== null);
        for (const dataPoint of validSeries) {
            allTimeStampMap[dataPoint.dateTime.toISOString()] = dataPoint;
        }

        return Object.values(allTimeStampMap);
    }

    private getFormattedDate = (timestamp: string | Date): string => {
        const date = new Date(timestamp);
        if (!isNaN(date.getTime())) {
            return Utils.timeFormat(
                this.usesSeconds,
                this.usesMillis,
                this.chartOptions.offset,
                null,
                null,
                null,
                this.chartOptions.dateLocale
            )(date);
        }
        return String(timestamp);
    }

    private getRowColor(aggKey: string, splitBy: string): string {
        const colors = Utils.createSplitByColors(
            this.chartComponentData.displayState,
            aggKey,
            this.chartOptions.keepSplitByColor
        );
        const splitByKeys = Object.keys(this.chartComponentData.timeArrays[aggKey]);
        const splitByIndex = splitByKeys.indexOf(splitBy);
        return colors[splitByIndex] || this.chartComponentData.displayState[aggKey]?.color || '#000';
    }

    private setFilteredTimestamps = (): void => {
        // Cache key based on time range
        const cacheKey = `${this.chartComponentData.fromMillis}-${this.chartComponentData.toMillis}`;

        // Return cached result if available
        if (this.timestampCache?.key === cacheKey) {
            this.filteredTimestamps = this.timestampCache.result;
            return;
        }

        // Calculate filtered timestamps
        if (this.chartComponentData.fromMillis === Infinity) {
            this.filteredTimestamps = this.chartComponentData.allTimestampsArray;
        } else {
            this.filteredTimestamps = this.chartComponentData.allTimestampsArray.filter((timestamp) => {
                const currMillis = new Date(timestamp).valueOf();
                return currMillis >= this.chartComponentData.fromMillis && currMillis < this.chartComponentData.toMillis;
            });
        }

        // Update cache
        this.timestampCache = { key: cacheKey, result: this.filteredTimestamps };
    }

    private addHeaderCells(): void {
        if (!this.tableHeaderRow) return;

        const headerCellData = this.filteredTimestamps;
        const headerCells = this.tableHeaderRow.selectAll<HTMLTableCellElement, string>('.tsi-headerCell').data(headerCellData);

        const headerCellsEntered = headerCells.enter()
            .append('th')
            .attr('tabindex', 1)
            .merge(headerCells)
            .attr('class', (d, i) => `${this.cellClass(0, i + 1)} tsi-headerCell`)
            .on('keydown', (event, d) => {
                const nodes = headerCellsEntered.nodes();
                const index = nodes.indexOf(event.currentTarget as HTMLTableCellElement);
                this.arrowNavigate(event, 0, index + 1);
            })
            .text(this.getFormattedDate)
            .attr('aria-label', (timestamp) => {
                return `${this.getString('column header for date')} ${this.getFormattedDate(timestamp)}`;
            });

        headerCells.exit().remove();
    }

    private renderRowHeader(element: HTMLTableRowElement, rowData: RowDataTuple, rowIndex: number): void {
        const [aggKey, splitBy] = rowData;
        const rowColor = this.getRowColor(aggKey, splitBy);

        const getRowHeaderText = (): string => {
            return `${this.chartComponentData.displayState[aggKey].name}${splitBy !== '' ? `: ${splitBy}` : ''}`;
        };

        const measuresData = this.chartOptions.spMeasures ??
            this.chartComponentData.displayState[aggKey].splitBys[splitBy].types;

        const headerCell = d3.select(element).selectAll<HTMLTableCellElement, RowDataTuple>('.tsi-rowHeaderCell').data([rowData]);

        headerCell.enter()
            .append('td')
            .attr('tabindex', 1)
            .merge(headerCell)
            .attr('class', `tsi-rowHeaderCell ${this.cellClass(rowIndex + 1, 0)}`)
            .on('keydown', (event) => {
                this.arrowNavigate(event, rowIndex + 1, 0);
            })
            .attr('aria-label', () => {
                return `${this.getString('row header for')} ${Utils.stripNullGuid(getRowHeaderText())}`;
            })
            .each(function () {
                d3.select(this).select('*').remove();
                const container = d3.select(this).append('div')
                    .attr('class', 'tsi-rowHeaderContainer')
                    .style('position', 'relative');

                // Add color indicator
                container.append('div')
                    .attr('class', 'tsi-colorIndicator')
                    .style('background-color', rowColor);

                const seriesName = container.append('div')
                    .attr('class', 'tsi-rowHeaderSeriesName');
                Utils.appendFormattedElementsFromString(seriesName, getRowHeaderText());

                const measureContainer = container.append('div')
                    .attr('class', 'tsi-rowHeaderMeasures');

                measureContainer.selectAll('.tsi-measureName')
                    .data(measuresData)
                    .enter()
                    .append('div')
                    .attr('class', 'tsi-measureName')
                    .text((d: any) => d);
            });

        headerCell.exit().remove();
    }

    private renderValueCells(element: HTMLTableRowElement, rowData: RowDataTuple, rowIndex: number): void {
        const [aggKey, splitBy] = rowData;
        const allTimeStampMap = this.filteredTimestamps.reduce<Record<string, GridCell>>((tsMap, ts) => {
            tsMap[ts] = {};
            return tsMap;
        }, {});

        const seriesData = this.convertSeriesToGridData(
            allTimeStampMap,
            this.chartComponentData.timeArrays[aggKey][splitBy]
        );

        const measuresData = this.chartOptions.spMeasures ??
            this.chartComponentData.displayState[aggKey].splitBys[splitBy].types;

        const getRowHeaderText = (): string => {
            return `${this.chartComponentData.displayState[aggKey].name}${splitBy !== '' ? `: ${splitBy}` : ''}`;
        };

        const cells = d3.select(element).selectAll<HTMLTableCellElement, GridCell>('.tsi-valueCell').data(seriesData);

        const cellsEntered = cells.enter()
            .append('td')
            .merge(cells)
            .attr('class', (d, col) => `tsi-valueCell ${this.cellClass(rowIndex + 1, col + 1)}`)
            .on('keydown', (event) => {
                const nodes = cellsEntered.nodes();
                const col = nodes.indexOf(event.currentTarget as HTMLTableCellElement);
                this.arrowNavigate(event, rowIndex + 1, col + 1);
            })
            .attr('tabindex', 1)
            .attr('aria-label', (d: GridCell, i) => {
                if (!d.measures || Object.keys(d.measures).length === 0) {
                    return `${this.getString('no values at')} ${getRowHeaderText()} ${this.getString('and')} ${this.getFormattedDate(this.filteredTimestamps[i])}`;
                }
                const formattedValues = Object.entries(d.measures)
                    .map(([measureName, value]) => `${measureName}: ${value}`)
                    .join(', ');
                return `${this.getString('values for cell at')} ${getRowHeaderText()} ${this.getString('and')} ${this.getFormattedDate(d.dateTime!)} ${this.getString('are')} ${formattedValues}`;
            })
            .each(function (d: GridCell) {
                const measures = d3.select(this).selectAll('.tsi-measureValue').data(measuresData);
                measures.enter()
                    .append('div')
                    .attr('class', 'tsi-measureValue')
                    .text((measure: string) => d.measures?.[measure] ?? '');
                measures.exit().remove();
            });

        cells.exit().remove();
    }

    private addValueCells(): void {
        if (!this.table) return;

        const rowData = this.getRowData();
        const rows = this.table.selectAll<HTMLTableRowElement, RowDataTuple>('.tsi-gridContentRow').data(rowData);

        rows.enter()
            .append('tr')
            .classed('tsi-gridContentRow', true)
            .each((d, i, nodes) => {
                this.renderRowHeader(nodes[i], d, i);
                this.renderValueCells(nodes[i], d, i);
            });


        rows.exit().remove();
    }

    public render(data: any, options: any, aggregateExpressionOptions: any, chartComponentData: ChartComponentData = null) {
        data = Utils.standardizeTSStrings(data);
        this.chartOptions.setOptions(options);
        this.gridComponent = d3.select(this.renderTarget);
        if (chartComponentData) {
            this.chartComponentData = chartComponentData;
        } else {
            this.chartComponentData.mergeDataToDisplayStateAndTimeArrays(data, aggregateExpressionOptions);
        }

        this.setFilteredTimestamps();

        super.themify(this.gridComponent, this.chartOptions.theme);

        this.gridComponent
            .classed("tsi-gridComponent", true)
            .classed("tsi-fromChart", !!options.fromChart)
        var grid = this.gridComponent
            .append('div')
            .attr("class", "tsi-gridWrapper")
            .attr("tabindex", 0)
            .on("click", () => {
                if (this) {
                    this.focus(0, 0);
                }
            });

        if (!this.table) {
            this.table = grid.append('table').classed('tsi-gridTable', true);
            this.tableHeaderRow = this.table.append('tr').classed('tsi-gridHeaderRow', true);
            this.tableHeaderRow.append('th')
                .attr("tabindex", 0)
                .attr("class", "tsi-topLeft " + this.cellClass(0, 0))
                .on("keydown", (event) => {
                    this.arrowNavigate(event, 0, 0);
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
                .on('keydown', (event) => {
                    if (event.keyCode === 9) {
                        this.focus(0, 0);
                        event.preventDefault();
                    }
                })
                .on("click", () => {
                    if (!!options.fromChart) {
                        Utils.focusOnEllipsisButton(this.renderTarget.parentNode);
                        this.gridComponent.remove();
                    }
                });
        } else {

            this.gridComponent.style('display', null);
            this.gridComponent.selectAll('.tsi-closeButton').remove();
        }
    }

    private arrowNavigate = (event: KeyboardEvent, rowIdx: number, colIdx: number): void => {
        // Handle tab to close button
        if (event.keyCode === 9) {
            if (this.closeButton) {
                this.closeButton.node()?.focus();
                event.preventDefault();
            }
            return;
        }

        // Arrow key codes: left=37, up=38, right=39, down=40
        const arrowKeys = [37, 38, 39, 40];
        const keyIndex = arrowKeys.indexOf(event.keyCode);

        if (keyIndex === -1) return;

        // Calculate bounds
        const maxRows = this.getRowData().length;
        const maxCols = this.filteredTimestamps.length;

        let newRow = rowIdx;
        let newCol = colIdx;

        switch (keyIndex) {
            case 0: // left
                newCol = Math.max(0, colIdx - 1);
                break;
            case 1: // up
                newRow = Math.max(0, rowIdx - 1);
                break;
            case 2: // right
                newCol = Math.min(maxCols, colIdx + 1);
                break;
            case 3: // down
                newRow = Math.min(maxRows, rowIdx + 1);
                break;
        }

        // Only focus and prevent default if position actually changed
        if (newRow !== rowIdx || newCol !== colIdx) {
            this.focus(newRow, newCol);
            event.preventDefault();
        }
    }
}

export default Grid
