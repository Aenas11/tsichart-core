import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import ContextMenu from "../../packages/core/src/components/ContextMenu";
import LineChart from '../../packages/core/src/components/LineChart';
import { ChartData } from '../../packages/core/src/types';
import { action } from 'storybook/actions';

interface ContextMenuOptions {
    theme?: string;
    position?: 'auto' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    showNestedMenus?: boolean;
    enableBrushActions?: boolean;
    autoHide?: boolean;
}

const meta: Meta<ContextMenuOptions> = {
    title: 'Components/ContextMenu',
    component: "ContextMenu",
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
 # ContextMenu Component

Interactive context menu component providing right-click functionality for chart elements with accessibility features and nested menu support. Part of the tsichart-core component library.

## Key Features
- **Multi-level Menus**: Support for nested submenus with hover activation
- **Smart Positioning**: Automatic positioning to stay within viewport bounds
- **Accessibility**: Full ARIA support with keyboard navigation and screen reader compatibility
- **Theme Support**: Compatible with light and dark themes
- **Event Integration**: Supports both element-specific and brush selection actions
- **D3.js Integration**: Uses D3 selections for DOM manipulation following component patterns
- **Responsive Layout**: Automatically adjusts to container size and content

## Usage Example

\`\`\`typescript
import TsiClient from 'tsichart-core';

// Create ContextMenu instance (typically created by parent chart components)
const contextMenu = new TsiClient.ux.ContextMenu(drawFunction, containerElement);

// Define context menu actions
const contextMenuActions = [
    {
        name: 'View Details',
        action: (aggKey, splitBy, timestamp, event) => {
            console.log('View details for:', { aggKey, splitBy, timestamp });
        }
    },
    {
        name: 'Export Data',
        action: (aggKey, splitBy, timestamp, event) => {
            console.log('Export data for:', { aggKey, splitBy, timestamp });
        }
    },
    {
        name: 'Configure',
        isNested: true,
        subActions: [
            {
                name: 'Set Alert',
                action: (aggKey, splitBy, timestamp, event) => {
                    console.log('Set alert for:', { aggKey, splitBy, timestamp });
                }
            },
            {
                name: 'Change Color',
                action: (aggKey, splitBy, timestamp, event) => {
                    console.log('Change color for:', { aggKey, splitBy, timestamp });
                }
            }
        ]
    }
]; 

// Show context menu at mouse position
contextMenu.draw(
    chartComponentData,
    renderTarget,
    chartOptions,
    [mouseX, mouseY],
    aggregateKey,
    splitByValue,
    onClickCallback,
    timestamp
);
\`\`\`

## Interactive Features

1. **Right-click Activation**: Context menu appears on right-click events
2. **Nested Menus**: Hover over items with submenus to expand additional options
3. **Smart Positioning**: Menu position adjusts to stay within viewport
4. **Keyboard Navigation**: Tab through menu items, Enter to select, Escape to close
5. **Auto-hide**: Menu hides when clicking outside or after action selection
6. **Brush Support**: Special handling for brush selection context menus

## Accessibility

- ARIA roles and labels for screen reader compatibility
- Keyboard navigation support (Tab, Enter, Escape)
- Focus management for proper accessibility flow
- Semantic HTML structure with proper menu roles
- High contrast support for visibility
                `
            }
        }
    },
    argTypes: {
        theme: {
            control: { type: 'select' },
            options: ['light', 'dark'],
            description: 'Visual theme for the context menu',
            table: { defaultValue: { summary: 'light' } }
        },
        position: {
            control: { type: 'select' },
            options: ['auto', 'top-left', 'top-right', 'bottom-left', 'bottom-right'],
            description: 'Menu positioning behavior',
            table: { defaultValue: { summary: 'auto' } }
        },
        showNestedMenus: {
            control: 'boolean',
            description: 'Enable nested submenu functionality',
            table: { defaultValue: { summary: 'true' } }
        },
        enableBrushActions: {
            control: 'boolean',
            description: 'Show brush-specific context menu actions',
            table: { defaultValue: { summary: 'true' } }
        },
        autoHide: {
            control: 'boolean',
            description: 'Automatically hide menu when clicking outside',
            table: { defaultValue: { summary: 'true' } }
        }
    }
}

export default meta;

type Story = StoryObj<ContextMenuOptions>;

function generateBrushContextMenuActions() {
    return [
        {
            name: 'Zoom to Selection',
            action: (startTime: string, endTime: string) => {
                action('Zoom to Selection')({ startTime, endTime });
                console.log('Zoom to Selection:', { startTime, endTime });
            }
        },
        {
            name: 'Export Time Range',
            action: (startTime: string, endTime: string) => {
                action('Export Time Range')({ startTime, endTime });
                console.log('Export Time Range:', { startTime, endTime });
            }
        },
        {
            name: 'Set as Baseline',
            action: (startTime: string, endTime: string) => {
                action('Set as Baseline')({ startTime, endTime });
                console.log('Set as Baseline:', { startTime, endTime });
            }
        },
        {
            name: 'Create Alert',
            action: (startTime: string, endTime: string) => {
                action('Create Alert')({ startTime, endTime });
                console.log('Create Alert:', { startTime, endTime });
            }
        }
    ];
}

function generateMockTimeSeriesData(factoryCount: number = 5, stationCount: number = 1, dataPointCount: number = 400): ChartData {
    const data = [];
    const from = new Date(1569669120723);

    for (let i = 0; i < factoryCount; i++) {
        const lines = {};
        data.push({ [`Factory${i}`]: lines });

        for (let j = 0; j < stationCount; j++) {
            const values = {};
            lines[`Station${j}`] = values;

            for (let k = 0; k < dataPointCount; k++) {
                const to = new Date(from.valueOf() + 1000 * 60 * k);
                const val = Math.random();
                const val2 = Math.random();
                values[to.toISOString()] = { avg: val, other: val2 };
            }
        }
    }

    return data;
}

function renderContextMenu(container: HTMLElement, options: any = {}) {
    container.innerHTML = '';

    try {
        console.log('Rendering ContextMenu with options:', options);

        const chart = new LineChart(container);
        const mockData = generateMockTimeSeriesData(3, 2, 200);


        const chartOptions = {
            theme: options.theme || 'light',
            brushContextMenuActions: options.enableBrushActions ? generateBrushContextMenuActions() : [],
            ...options
        };

        chart.render(mockData, chartOptions, [])

        return chart
    } catch (error) {
        console.error('ContextMenu rendering error:', error);
        container.innerHTML = `<div style="color: red; padding: 20px; font-family: monospace;">
            <h3>Error rendering ContextMenu</h3>
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

function createContextMenuStory(containerStyle: string) {
    return (args: any) => {
        const menuId = 'context-menu-' + Math.random().toString(36).substring(7);

        setTimeout(() => {
            const container = document.getElementById(menuId);
            if (container) {
                renderContextMenu(container, args);
            }
        }, 100);

        return html`
            <div style="${containerStyle}">
                <div id="${menuId}" style="height: 100%; width: 100%; display: flex; align-items: center; justify-content: center;"></div>
            </div>
        `;
    };
}

export const Default: Story = {
    name: 'Element Context Menu (Default)',
    args: {
        theme: 'light',
        position: 'auto',
        showNestedMenus: true,
        enableBrushActions: true,
        autoHide: true
    },
    render: createContextMenuStory('height: 400px; width: 100%; border: 1px solid #ddd; border-radius: 4px; display: flex; align-items: center; justify-content: center;')
};

export const DarkTheme: Story = {
    name: 'Dark Theme',
    args: {
        theme: 'dark',
        position: 'auto',
        showNestedMenus: true,
        enableBrushActions: true,
        autoHide: true
    },
    render: createContextMenuStory('height: 400px; width: 100%; background: #1a1a1a; border: 1px solid #444; border-radius: 4px; display: flex; align-items: center; justify-content: center;')
};

export const SimpleMenu: Story = {
    name: 'Simple Menu (No Nesting)',
    args: {
        theme: 'light',
        position: 'auto',
        showNestedMenus: false,
        enableBrushActions: true,
        autoHide: true
    },
    render: createContextMenuStory('height: 400px; width: 100%; border: 1px solid #ddd; border-radius: 4px; display: flex; align-items: center; justify-content: center;')
};

export const BrushContextMenu: Story = {
    name: 'Brush Selection Menu',
    args: {
        theme: 'light',
        position: 'auto',
        showNestedMenus: true,
        enableBrushActions: true,
        autoHide: true
    },
    render: createContextMenuStory('height: 400px; width: 100%; border: 1px solid #ddd; border-radius: 4px; display: flex; align-items: center; justify-content: center;')
};

export const NestedMenus: Story = {
    name: 'Multi-level Nested Menus',
    args: {
        theme: 'light',
        position: 'auto',
        showNestedMenus: true,
        enableBrushActions: true,
        autoHide: true
    },
    render: createContextMenuStory('height: 450px; width: 100%; border: 1px solid #ddd; border-radius: 4px; display: flex; align-items: center; justify-content: center;')
};

export const Playground: Story = {
    name: 'Interactive Playground',
    args: {
        theme: 'light',
        position: 'auto',
        showNestedMenus: true,
        enableBrushActions: true,
        autoHide: true
    },
    render: createContextMenuStory('height: 400px; width: 100%; border: 2px solid #ddd; border-radius: 8px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); display: flex; align-items: center; justify-content: center;')
};