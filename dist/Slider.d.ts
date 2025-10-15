import { C as Component } from './Component-C2OFsACF.js';
import './Enums-CjbndcX3.js';
import './Interfaces-DBBnA26W.js';

declare class Slider extends Component {
    private sliderSVG;
    sliderTextDiv: any;
    private xScale;
    private data;
    private width;
    private sliderWidth;
    private selectedLabel;
    private isAscendingTimePeriods;
    private margins;
    private height;
    constructor(renderTarget: Element);
    Slider(): void;
    private getXPositionOfLabel;
    private determineIfAscendingTimePeriods;
    render(data: Array<any>, options: any, width: number, selectedLabel?: string): void;
    remove(): void;
    private onDrag;
    private onDragEnd;
    private setSelectedLabelAndGetLabelAction;
    private setSliderTextDivLabel;
    private setStateFromLabel;
    private moveLeft;
    private moveRight;
}

export { Slider as default };
