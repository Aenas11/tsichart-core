import { C as Component } from './Component-C2OFsACF.js';
import './Enums-CjbndcX3.js';
import './Interfaces-DBBnA26W.js';

interface ColorPickerOptions {
    theme?: string;
    numberOfColors?: number;
    colors?: Array<string>;
    defaultColor?: string;
    isColorValueHidden?: boolean;
    onSelect?: (colorHex: string) => void;
    onClick?: (event: any) => void;
}
declare class ColorPicker extends Component {
    private colorPickerElem;
    private selectedColor;
    private isColorGridVisible;
    private componentId;
    constructor(renderTarget: Element, componentId?: string);
    render(options?: ColorPickerOptions): void;
    getSelectedColorValue: () => string;
    private showColorGrid;
    hideColorGrid: (withFocusBackToPickerButton?: boolean) => void;
    private setSelectedColor;
    getColorPickerElem: () => any;
}

export { ColorPicker as default };
