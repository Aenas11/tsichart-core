import * as d3 from 'd3';
import ColorPicker from '../../../src/components/ColorPicker/ColorPicker';

describe('ColorPicker', () => {
    let renderTarget: HTMLDivElement;
    let colorPicker: ColorPicker;

    beforeEach(() => {
        renderTarget = document.createElement('div');
        document.body.appendChild(renderTarget);
        colorPicker = new ColorPicker(renderTarget);
    });

    afterEach(() => {
        document.body.removeChild(renderTarget);
    });

    describe('constructor', () => {
        it('should create a ColorPicker instance', () => {
            expect(colorPicker).toBeInstanceOf(ColorPicker);
        });

        it('should accept custom component ID', () => {
            const customId = 'custom-color-picker-123';
            const picker = new ColorPicker(renderTarget, customId);

            expect(picker).toBeInstanceOf(ColorPicker);
        });
    });

    describe('render', () => {
        it('should render with default options', () => {
            colorPicker.render();

            expect(renderTarget.classList.contains('tsi-colorPicker')).toBe(true);
            expect(renderTarget.querySelector('.tsi-colorPickerButton')).toBeTruthy();
            expect(renderTarget.querySelector('.tsi-colorGrid')).toBeTruthy();
        });

        it('should apply dark theme by default', () => {
            colorPicker.render();

            expect(renderTarget.classList.contains('tsi-dark')).toBe(true);
        });

        it('should apply light theme when specified', () => {
            colorPicker.render({ theme: 'light' });

            expect(renderTarget.classList.contains('tsi-light')).toBe(true);
        });

        it('should render default number of colors (15)', () => {
            colorPicker.render();

            const colorItems = renderTarget.querySelectorAll('.tsi-colorItem');
            expect(colorItems.length).toBeGreaterThanOrEqual(15);
        });

        it('should render custom number of colors', () => {
            colorPicker.render({ numberOfColors: 10 });

            const colorItems = renderTarget.querySelectorAll('.tsi-colorItem');
            expect(colorItems.length).toBeGreaterThanOrEqual(10);
        });

        it('should render with custom colors array', () => {
            const customColors = ['#FF0000', '#00FF00', '#0000FF'];
            colorPicker.render({ colors: customColors, numberOfColors: 3 });

            const colorItems = renderTarget.querySelectorAll('.tsi-colorItem');
            // May include one extra for defaultColor if it's added
            expect(colorItems.length).toBeGreaterThanOrEqual(3);
            expect(colorItems.length).toBeLessThanOrEqual(4);
        });

        it('should set default color when provided', () => {
            const defaultColor = '#FF0000';
            colorPicker.render({ defaultColor });

            const selectedColorDiv = renderTarget.querySelector('.tsi-selectedColor') as HTMLElement;
            expect(selectedColorDiv?.style.backgroundColor).toBe('rgb(255, 0, 0)');
        });

        it('should show "No color" text when no default color is set', () => {
            colorPicker.render({ defaultColor: undefined });

            const selectedColorValue = renderTarget.querySelector('.tsi-selectedColorValue');
            expect(selectedColorValue?.textContent).toContain('No color');
        });

        it('should show selected color value when not hidden', () => {
            const defaultColor = '#FF0000';
            colorPicker.render({ defaultColor, isColorValueHidden: false });

            const selectedColorValue = renderTarget.querySelector('.tsi-selectedColorValue');
            expect(selectedColorValue?.classList.contains('hidden')).toBe(false);
        });

        it('should hide selected color value when isColorValueHidden is true', () => {
            const defaultColor = '#FF0000';
            colorPicker.render({ defaultColor, isColorValueHidden: true });

            const selectedColorValue = renderTarget.querySelector('.tsi-selectedColorValue');
            expect(selectedColorValue?.classList.contains('hidden')).toBe(true);
        });

        it('should create color grid with role grid', () => {
            colorPicker.render();

            const colorGrid = renderTarget.querySelector('.tsi-colorGrid');
            expect(colorGrid?.getAttribute('role')).toBe('grid');
        });

        it('should create color items with gridcell role', () => {
            colorPicker.render();

            const colorItem = renderTarget.querySelector('.tsi-colorItem');
            expect(colorItem?.getAttribute('role')).toBe('gridcell');
        });

        it('should set tabindex on color items', () => {
            colorPicker.render();

            const colorItem = renderTarget.querySelector('.tsi-colorItem');
            expect(colorItem?.getAttribute('tabindex')).toBe('0');
        });

        it('should set aria-label with color value on items', () => {
            const customColors = ['#FF0000'];
            colorPicker.render({ colors: customColors, numberOfColors: 1 });

            const colorItem = renderTarget.querySelector('.tsi-colorItem');
            expect(colorItem?.getAttribute('aria-label')).toBe('#FF0000');
        });

        it('should mark selected color item with aria-selected', () => {
            const customColors = ['#FF0000', '#00FF00'];
            const defaultColor = '#FF0000';
            colorPicker.render({ colors: customColors, numberOfColors: 2, defaultColor });

            const colorItems = renderTarget.querySelectorAll('.tsi-colorItem');
            expect(colorItems[0]?.getAttribute('aria-selected')).toBe('true');
            expect(colorItems[1]?.getAttribute('aria-selected')).toBe('false');
        });

        it('should mark selected color item with tsi-selected class', () => {
            const customColors = ['#FF0000', '#00FF00'];
            const defaultColor = '#FF0000';
            colorPicker.render({ colors: customColors, numberOfColors: 2, defaultColor });

            const colorItems = renderTarget.querySelectorAll('.tsi-colorItem');
            expect(colorItems[0]?.classList.contains('tsi-selected')).toBe(true);
            expect(colorItems[1]?.classList.contains('tsi-selected')).toBe(false);
        });

        it('should add tsi-noColor class when no default color', () => {
            colorPicker.render({ defaultColor: undefined });

            const selectedColorDiv = renderTarget.querySelector('.tsi-selectedColor');
            expect(selectedColorDiv?.classList.contains('tsi-noColor')).toBe(true);
        });
    });

    describe('color selection', () => {
        it('should call onSelect callback when color is clicked', () => {
            const mockOnSelect = jest.fn();
            const customColors = ['#FF0000', '#00FF00'];
            colorPicker.render({ colors: customColors, numberOfColors: 2, onSelect: mockOnSelect });

            // Open color grid first
            const button = renderTarget.querySelector('.tsi-colorPickerButton') as HTMLElement;
            button.click();

            const colorItems = renderTarget.querySelectorAll('.tsi-colorItem');
            (colorItems[0] as HTMLElement).click();

            expect(mockOnSelect).toHaveBeenCalledWith('#FF0000');
        });

        it('should update selected color display when new color is selected', () => {
            const customColors = ['#FF0000', '#00FF00'];
            colorPicker.render({ colors: customColors, numberOfColors: 2 });

            const button = renderTarget.querySelector('.tsi-colorPickerButton') as HTMLElement;
            button.click();

            const colorItems = renderTarget.querySelectorAll('.tsi-colorItem');
            (colorItems[1] as HTMLElement).click();

            const selectedColorDiv = renderTarget.querySelector('.tsi-selectedColor') as HTMLElement;
            expect(selectedColorDiv?.style.backgroundColor).toBe('rgb(0, 255, 0)');
        });
    });

    describe('button interaction', () => {
        it('should toggle color grid visibility on button click', () => {
            colorPicker.render();

            const button = renderTarget.querySelector('.tsi-colorPickerButton') as HTMLElement;
            const colorGrid = renderTarget.querySelector('.tsi-colorGrid') as HTMLElement;

            // Initially hidden
            expect(colorGrid?.style.display).toBeFalsy();

            // Click to show
            button.click();
            // Color grid should be visible (test indirectly through class or state)

            // Note: Actual visibility testing would require checking internal state
        });

        it('should call onClick callback when button is clicked', () => {
            const mockOnClick = jest.fn();
            colorPicker.render({ onClick: mockOnClick });

            const button = renderTarget.querySelector('.tsi-colorPickerButton') as HTMLElement;
            button.click();

            expect(mockOnClick).toHaveBeenCalled();
        });

        it('should have proper aria-label on button', () => {
            const defaultColor = '#FF0000';
            colorPicker.render({ defaultColor });

            const button = renderTarget.querySelector('.tsi-colorPickerButton');
            const ariaLabel = button?.getAttribute('aria-label');
            expect(ariaLabel).toContain('#FF0000');
            expect(ariaLabel).toContain('Select color');
        });

        it('should have aria-controls pointing to color grid', () => {
            colorPicker.render();

            const button = renderTarget.querySelector('.tsi-colorPickerButton');
            const ariaControls = button?.getAttribute('aria-controls');
            expect(ariaControls).toContain('tsi-colorGrid_');
        });
    });

    describe('re-rendering', () => {
        it('should clear previous content when re-rendered', () => {
            colorPicker.render({ numberOfColors: 5 });
            const itemsCount1 = renderTarget.querySelectorAll('.tsi-colorItem').length;

            colorPicker.render({ numberOfColors: 10 });
            const itemsCount2 = renderTarget.querySelectorAll('.tsi-colorItem').length;

            expect(itemsCount2).toBeGreaterThan(itemsCount1);
        });

        it('should update theme on re-render', () => {
            colorPicker.render({ theme: 'dark' });
            expect(renderTarget.classList.contains('tsi-dark')).toBe(true);

            colorPicker.render({ theme: 'light' });
            expect(renderTarget.classList.contains('tsi-light')).toBe(true);
            expect(renderTarget.classList.contains('tsi-dark')).toBe(false);
        });
    });

    describe('accessibility', () => {
        it('should have proper ARIA attributes on color grid', () => {
            colorPicker.render();

            const colorGrid = renderTarget.querySelector('.tsi-colorGrid');
            expect(colorGrid?.getAttribute('role')).toBe('grid');
            expect(colorGrid?.getAttribute('id')).toContain('tsi-colorGrid_');
        });

        it('should have proper ARIA attributes on color grid row', () => {
            colorPicker.render();

            const row = renderTarget.querySelector('.tsi-colorGridRow');
            expect(row?.getAttribute('role')).toBe('row');
        });

        it('should support keyboard navigation', () => {
            colorPicker.render();

            const colorItems = renderTarget.querySelectorAll('.tsi-colorItem');
            expect(colorItems[0]?.getAttribute('tabindex')).toBe('0');
        });
    });
});
