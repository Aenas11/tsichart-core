import * as d3 from 'd3';
import Tooltip from '../../../src/components/Tooltip/Tooltip';
import { ChartComponentData } from '../../../src/models/ChartComponentData';

describe('Tooltip', () => {
    let renderTarget: HTMLDivElement;
    let tooltip: Tooltip;

    beforeEach(() => {
        // Create a render target
        renderTarget = document.createElement('div');
        renderTarget.style.width = '800px';
        renderTarget.style.height = '600px';
        document.body.appendChild(renderTarget);

        // Create SVG for chart context
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'tsi-chartSVG');
        svg.setAttribute('width', '800');
        svg.setAttribute('height', '600');
        renderTarget.appendChild(svg);

        tooltip = new Tooltip(d3.select(renderTarget));
    });

    afterEach(() => {
        document.body.removeChild(renderTarget);
    });

    describe('constructor', () => {
        it('should create a Tooltip instance', () => {
            expect(tooltip).toBeInstanceOf(Tooltip);
        });
    });

    describe('render', () => {
        it('should render tooltip with dark theme', () => {
            tooltip.render('dark');

            const tooltipElement = renderTarget.querySelector('.tsi-tooltip');
            expect(tooltipElement).toBeTruthy();
            expect(tooltipElement?.classList.contains('tsi-dark')).toBe(true);
        });

        it('should render tooltip with light theme', () => {
            tooltip.render('light');

            const tooltipElement = renderTarget.querySelector('.tsi-tooltip');
            expect(tooltipElement).toBeTruthy();
            expect(tooltipElement?.classList.contains('tsi-light')).toBe(true);
        });

        it('should create tooltipDivInner element', () => {
            tooltip.render('dark');

            const innerElement = renderTarget.querySelector('.tsi-tooltipInner');
            expect(innerElement).toBeTruthy();
        });

        it('should expose draw function after render', () => {
            tooltip.render('dark');

            expect(typeof tooltip.draw).toBe('function');
        });
    });

    describe('hide', () => {
        it('should hide tooltip when called', () => {
            tooltip.render('dark');
            tooltip.hide();

            const tooltipElement = renderTarget.querySelector('.tsi-tooltip') as HTMLElement;
            expect(tooltipElement?.style.display).toBe('none');
        });

        it('should not throw when tooltip is not rendered', () => {
            expect(() => tooltip.hide()).not.toThrow();
        });
    });

    describe('draw', () => {
        let chartComponentData: ChartComponentData;
        const chartMargins = { top: 20, right: 40, bottom: 60, left: 80 };

        beforeEach(() => {
            chartComponentData = new ChartComponentData();
            tooltip.render('dark');
        });

        it('should display tooltip when draw is called', () => {
            const addText = (tooltipDiv) => {
                tooltipDiv.text('Test tooltip content');
            };

            tooltip.draw({}, chartComponentData, 100, 100, chartMargins, addText);

            const tooltipElement = renderTarget.querySelector('.tsi-tooltip') as HTMLElement;
            expect(tooltipElement?.style.display).toBe('block');
        });

        it('should add custom text to tooltip', () => {
            const addText = (tooltipDiv) => {
                tooltipDiv.text('Custom tooltip text');
            };

            tooltip.draw({}, chartComponentData, 100, 100, chartMargins, addText);

            const innerElement = renderTarget.querySelector('.tsi-tooltipInner');
            expect(innerElement?.textContent).toBe('Custom tooltip text');
        });

        it('should position tooltip at specified coordinates', () => {
            const addText = (tooltipDiv) => {
                tooltipDiv.text('Test');
            };

            tooltip.draw({}, chartComponentData, 200, 150, chartMargins, addText);

            const tooltipElement = renderTarget.querySelector('.tsi-tooltip') as HTMLElement;
            expect(tooltipElement?.style.left).toBeTruthy();
            expect(tooltipElement?.style.top).toBeTruthy();
        });

        it('should apply border color when provided', () => {
            const addText = (tooltipDiv) => {
                tooltipDiv.text('Test');
            };
            const borderColor = '#FF0000';

            tooltip.draw({}, chartComponentData, 100, 100, chartMargins, addText, null, 20, 20, borderColor);

            const innerElement = renderTarget.querySelector('.tsi-tooltipInner') as HTMLElement;
            // Browser might return hex or rgb format
            const color = innerElement?.style.borderLeftColor;
            expect(color === 'rgb(255, 0, 0)' || color === '#FF0000').toBe(true);
            expect(innerElement?.style.borderLeftWidth).toBe('5px');
        });

        it('should not apply border when borderColor is null', () => {
            const addText = (tooltipDiv) => {
                tooltipDiv.text('Test');
            };

            tooltip.draw({}, chartComponentData, 100, 100, chartMargins, addText, null, 20, 20, null);

            const innerElement = renderTarget.querySelector('.tsi-tooltipInner') as HTMLElement;
            // jsdom may return "0" instead of "0px"
            const borderWidth = innerElement?.style.borderLeftWidth;
            expect(borderWidth === '0px' || borderWidth === '0').toBe(true);
        });

        it('should handle custom x and y offsets', () => {
            const addText = (tooltipDiv) => {
                tooltipDiv.text('Test');
            };
            const xOffset = 30;
            const yOffset = 40;

            tooltip.draw({}, chartComponentData, 100, 100, chartMargins, addText, null, xOffset, yOffset);

            const tooltipElement = renderTarget.querySelector('.tsi-tooltip') as HTMLElement;
            expect(tooltipElement?.style.transform).toBeTruthy();
        });

        it('should handle element width parameter', () => {
            const addText = (tooltipDiv) => {
                tooltipDiv.text('Test');
            };
            const elementWidth = 50;

            tooltip.draw({}, chartComponentData, 100, 100, chartMargins, addText, elementWidth);

            const tooltipElement = renderTarget.querySelector('.tsi-tooltip') as HTMLElement;
            expect(tooltipElement?.style.display).toBe('block');
        });

        it('should handle marker tooltips with isFromMarker flag', () => {
            const addText = (tooltipDiv) => {
                tooltipDiv.text('Marker tooltip');
            };

            tooltip.draw({}, chartComponentData, 100, 100, chartMargins, addText, null, 20, 20, null, true);

            const tooltipElement = renderTarget.querySelector('.tsi-tooltip') as HTMLElement;
            expect(tooltipElement?.style.display).toBe('block');
        });

        it('should clear previous content before drawing', () => {
            const addText1 = (tooltipDiv) => {
                tooltipDiv.text('First content');
            };
            const addText2 = (tooltipDiv) => {
                tooltipDiv.text('Second content');
            };

            tooltip.draw({}, chartComponentData, 100, 100, chartMargins, addText1);
            tooltip.draw({}, chartComponentData, 100, 100, chartMargins, addText2);

            const innerElement = renderTarget.querySelector('.tsi-tooltipInner');
            expect(innerElement?.textContent).toBe('Second content');
        });

        it('should allow adding multiple elements to tooltip', () => {
            const addText = (tooltipDiv) => {
                tooltipDiv.append('div').text('Line 1');
                tooltipDiv.append('div').text('Line 2');
                tooltipDiv.append('div').text('Line 3');
            };

            tooltip.draw({}, chartComponentData, 100, 100, chartMargins, addText);

            const innerElement = renderTarget.querySelector('.tsi-tooltipInner');
            const divs = innerElement?.querySelectorAll('div');
            expect(divs?.length).toBe(3);
        });
    });
});
