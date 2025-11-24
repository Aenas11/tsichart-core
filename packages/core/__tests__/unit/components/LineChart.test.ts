import * as d3 from 'd3';
import LineChart from '../../../src/components/LineChart';
import { ChartComponentData } from '../../../src/models/ChartComponentData';
import { ILineChartOptions } from '../../../src/components/LineChart/LineChart/ILineChartOptions';

describe('LineChart', () => {
    let renderTarget: HTMLDivElement;
    let lineChart: LineChart;
    let data: ChartComponentData;
    let options: ILineChartOptions;

    beforeEach(() => {
        // Create a render target
        renderTarget = document.createElement('div');
        renderTarget.style.width = '800px';
        renderTarget.style.height = '600px';
        document.body.appendChild(renderTarget);

        data = new ChartComponentData();
        options = {
            theme: 'dark',
            grid: true,
            legend: 'shown',
            tooltip: true,
            animations: false,
        };

        lineChart = new LineChart(renderTarget);
    });

    afterEach(() => {
        document.body.removeChild(renderTarget);
    });

    describe('constructor', () => {
        it('should create a LineChart instance', () => {
            expect(lineChart).toBeInstanceOf(LineChart);
        });
    });

    describe('render', () => {
        it('should render a line chart', () => {
            lineChart.render(data, options, []);
            const svgElement = renderTarget.querySelector('.tsi-lineChartSVG');
            expect(svgElement).toBeTruthy();
        });
    });
});
