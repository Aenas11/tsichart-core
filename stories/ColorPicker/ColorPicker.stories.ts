import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { action } from 'storybook/actions';
import { html } from "lit";
import ColorPicker from "../../packages/core/src/components/ColorPicker/ColorPicker.ts";

interface ColorPickerOptions {
    theme?: string;
    numberOfColors?: number;
    defaultColor?: string;
    colors?: Array<string>;
    isColorValueHidden?: boolean;
    colorPalette?: 'default' | 'custom' | 'limited';
    onSelect?: (colorHex: string) => void;
    onClick?: (event: any) => void;
}

const meta: Meta<ColorPickerOptions> = {
    title: "Charts/ColorPicker/ColorPicker",
    component: "ColorPicker",
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component: `
# ColorPicker Component

Interactive color picker component for selecting colors with accessibility features and keyboard navigation. Part of the tsichart-core component library.

## Key Features
- **Color Grid**: Display a grid of predefined colors for selection
- **Keyboard Navigation**: Full keyboard support with Tab, Enter, and Escape keys
- **Accessibility**: ARIA attributes for screen readers and assistive technologies
- **Theme Support**: Compatible with light and dark themes
- **Custom Colors**: Support for custom color palettes
- **Event Callbacks**: Configurable onSelect and onClick event handlers
- **Default Selection**: Option to set a default selected color
- **Hidden Values**: Option to hide color value text for compact display

## Usage Example

\`\`\`typescript
import TsiClient from 'tsichart-core';

// Create ColorPicker instance
const colorPicker = new TsiClient.ux.ColorPicker(containerElement);

// Render with options
colorPicker.render({
    theme: 'light',
    colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
    defaultColor: '#FF0000',
    isColorValueHidden: false,
    onSelect: (colorHex) => {
        console.log('Selected color:', colorHex);
    },
    onClick: (event) => {
        console.log('ColorPicker clicked:', event);
    }
});

// Get selected color
const selectedColor = colorPicker.getSelectedColorValue();
\`\`\`

## Interactive Features

1. **Color Selection**: Click on any color in the grid to select it
2. **Button Toggle**: Click the color picker button to show/hide the color grid
3. **Keyboard Navigation**: Use Tab to navigate, Enter to select, Escape to close
4. **Focus Management**: Proper focus handling for accessibility
5. **Visual Feedback**: Selected color is highlighted and displayed in the button

## Accessibility

- ARIA labels and roles for screen reader compatibility
- Keyboard navigation support
- Focus management
- Color contrast considerations
- Semantic HTML structure
                `
            }
        }
    },
    argTypes: {
        theme: {
            control: { type: 'select' },
            options: ['light', 'dark'],
            description: 'Visual theme for the color picker',
            table: { defaultValue: { summary: 'light' } }
        },
        numberOfColors: {
            control: { type: 'number', min: 3, max: 20, step: 1 },
            description: 'Number of colors to display in the grid',
            table: { defaultValue: { summary: '8' } }
        },
        defaultColor: {
            control: { type: 'color' },
            description: 'Default selected color (hex format)',
            table: { defaultValue: { summary: '#3599B8' } }
        },
        isColorValueHidden: {
            control: 'boolean',
            description: 'Hide the color value text for compact display',
            table: { defaultValue: { summary: 'false' } }
        },
        colorPalette: {
            control: { type: 'select' },
            options: ['default', 'custom', 'limited'],
            description: 'Color palette to use for the picker',
            table: { defaultValue: { summary: 'default' } }
        },
        onSelect: {
            action: 'onSelect',
            description: 'Callback fired when a color is selected'
        },
        onClick: {
            action: 'onClick',
            description: 'Callback fired when the color picker button is clicked'
        }
    }
}

export default meta;
type Story = StoryObj<ColorPickerOptions>;


function getDefaultColors(): Array<string> {
    return [
        '#3599B8', // Teal (primary brand color)
        '#F2C80F', // Yellow
        '#FD625E', // Red
        '#01B8AA', // Cyan
        '#374649', // Dark Gray
        '#FD9644', // Orange
        '#8AD4EB', // Light Blue
        '#FE9666', // Light Orange
        '#A66999', // Purple
        '#3599B8', // Teal (duplicate for grid completeness)
        '#C4E2F7', // Very Light Blue
        '#FFD93D'  // Bright Yellow
    ];
}

function getCustomColors(): Array<string> {
    return [
        '#FF6B6B', // Coral Red
        '#4ECDC4', // Turquoise
        '#45B7D1', // Sky Blue
        '#96CEB4', // Mint Green
        '#FFEAA7', // Cream Yellow
        '#DDA0DD', // Plum
        '#98D8C8', // Seafoam
        '#F7DC6F', // Light Gold
        '#BB8FCE', // Lavender
        '#85C1E9'  // Powder Blue
    ];
}

function renderColorPicker(container: HTMLElement, options: any = {}) {
    container.innerHTML = '';

    try {
        console.log('Rendering ColorPicker with options:', options);
        const colorPicker = new ColorPicker(container);

        let colors: Array<string>;
        switch (options.colorPalette) {
            case 'custom':
                colors = getCustomColors();
                break;
            case 'limited':
                colors = getDefaultColors().slice(0, 4);
                break;
            default:
                colors = getDefaultColors();
                break;
        }

        const numberOfColors = Math.min(options.numberOfColors || colors.length, colors.length);
        const finalColors = colors.slice(0, numberOfColors);
        const colorPickerOptions = {
            theme: options.theme || 'light',
            colors: finalColors,
            defaultColor: options.defaultColor || finalColors[0],
            isColorValueHidden: options.isColorValueHidden || false,
            onSelect: (colorHex: string) => {
                console.log('Color selected:', colorHex);
                if (options.onSelect) {
                    options.onSelect(colorHex);
                }
                container.style.borderColor = colorHex;
            },
            onClick: (event: any) => {
                console.log('ColorPicker button clicked:', event);
                if (options.onClick) {
                    options.onClick(event);
                }
            }
        };
        colorPicker.render(colorPickerOptions);

        return colorPicker;
    } catch (error) {
        console.error('ColorPicker rendering error:', error);
        container.innerHTML = `<div style="color: red; padding: 20px; font-family: monospace;">
            <h3>Error rendering ColorPicker</h3>
            <p><strong>Error:</strong> ${error.message}</p>
            <p><small>Check browser console for more details</small></p>
            <details style="margin-top: 10px;">
                <summary>Stack Trace</summary>
                <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px;">
${error.stack}
                </pre>
            </details>
        </div>`;
    }
}

function createColorPickerStory(containerStyle: string) {
    return (args: any) => {
        const pickerId = 'color-picker-' + Math.random().toString(36).substring(7);

        setTimeout(() => {
            const container = document.getElementById(pickerId);
            if (container) {
                renderColorPicker(container, args);
            }
        }, 100);

        return html`
            <div style="${containerStyle}">
                <div id="${pickerId}" style="height: 100%; width: 100%;"></div>
            </div>
        `;
    };
}

export const Default: Story = {
    name: 'Default Color Picker',
    args: {
        theme: 'light',
        numberOfColors: 8,
        defaultColor: '#3599B8',
        isColorValueHidden: false,
        colorPalette: 'default',
        onSelect: action('onSelect'),
        onClick: action('onClick')
    },
    render: createColorPickerStory('height: 200px; width: 300px; border: 2px solid #ddd; border-radius: 4px; padding: 20px;')
};

export const DarkTheme: Story = {
    name: 'Dark Theme',
    args: {
        theme: 'dark',
        numberOfColors: 8,
        defaultColor: '#F2C80F',
        isColorValueHidden: false,
        onSelect: action('onSelect'),
        onClick: action('onClick')
    },
    render: createColorPickerStory('height: 200px; width: 300px; background: #1a1a1a; border: 2px solid #444; border-radius: 4px; padding: 20px;')
};

export const CustomColors: Story = {
    name: 'Custom Color Palette',
    args: {
        theme: 'light',
        numberOfColors: 10,
        defaultColor: '#FF6B6B',
        isColorValueHidden: false,
        colorPalette: 'custom',
        onSelect: action('onSelect'),
        onClick: action('onClick')
    },
    render: createColorPickerStory('height: 200px; width: 350px; border: 2px solid #ddd; border-radius: 4px; padding: 20px;')
};

export const LimitedColors: Story = {
    name: 'Limited Color Options',
    args: {
        theme: 'light',
        numberOfColors: 4,
        defaultColor: '#3599B8',
        isColorValueHidden: false,
        colorPalette: 'limited',
        onSelect: action('onSelect'),
        onClick: action('onClick')
    },
    render: createColorPickerStory('height: 200px; width: 250px; border: 2px solid #ddd; border-radius: 4px; padding: 20px;')
};