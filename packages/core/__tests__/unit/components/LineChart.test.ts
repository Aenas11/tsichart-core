import * as d3 from 'd3';
import LineChart from '../../../src/components/LineChart/LineChart/LineChart';
import { ILineChartOptions } from '../../../src/components/LineChart/LineChart/ILineChartOptions';

describe('LineChart', () => {
    let renderTarget: HTMLDivElement;
    let lineChart: LineChart;
    let data: any[];
    let options: ILineChartOptions;

    beforeEach(() => {
        // Create a render target
        renderTarget = document.createElement('div');
        renderTarget.style.width = '800px';
        renderTarget.style.height = '600px';
        document.body.appendChild(renderTarget);

        data = [];
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

        it('should render a grid when enabled', () => {
            options.grid = true;
            lineChart.render(data, options, []);
            const gridElement = renderTarget.querySelector('.tsi-grid');
            expect(gridElement).toBeTruthy();
        });

        it('should not render a grid when disabled', () => {
            options.grid = false;
            lineChart.render(data, options, []);
            const gridElement = renderTarget.querySelector('.tsi-grid');
            expect(gridElement).toBeFalsy();
        });

        it('should render a legend when shown', () => {
            options.legend = 'shown';
            lineChart.render(data, options, []);
            const legendElement = renderTarget.querySelector('.tsi-legend');
            expect(legendElement).toBeTruthy();
        });

        it('should not render a legend when hidden', () => {
            options.legend = 'hidden';
            lineChart.render(data, options, []);
            const legendElement = renderTarget.querySelector('.tsi-legend');
            expect(legendElement.classList.contains('hidden')).toBe(true);
        });
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
    });
});
