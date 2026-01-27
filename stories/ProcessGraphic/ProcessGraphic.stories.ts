import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import ProcessGraphic from '../../packages/core/src/components/ProcessGraphic';
import TsqExpression from '../../packages/core/src/models/TsqExpression';
import { fireEvent, within, waitFor } from 'storybook/test';

interface IProcessGraphicOptions {
    theme?: 'light' | 'dark';
    updateInterval?: number;
    bucketSizeMillis?: number;
}

const meta: Meta<IProcessGraphicOptions> = {
    title: 'Charts/ProcessGraphic/ProcessGraphic',
    component: 'ProcessGraphic',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
# ProcessGraphic Component

Interactive visualization of industrial process flows with animated data labels showing real-time metrics overlaid on a process diagram image.

## Key Features
- **Image-Based Visualization**: Display custom process diagrams as PNG/SVG images
- **Dynamic Data Labels**: Overlay real-time data values on specific positions within the diagram
- **Playback Timeline**: Interactive timeline slider with play/pause controls to navigate through time
- **Color-Coded Values**: Conditionally color data labels based on values or custom functions
- **Click-to-Action**: Optional click handlers for interactive diagram elements
- **Responsive Scaling**: Automatically resizes image to fit container while maintaining aspect ratio
- **Theming**: Support for light and dark themes
- **Time-Based Animation**: Step through time intervals to visualize process changes

---

## Default Configuration

| Option | Default | Description |
|--------|---------|-------------|
| \`theme\` | \`'light'\` | Visual theme (light for better diagram visibility) |
| \`updateInterval\` | \`3000\` | Playback update interval in milliseconds |
| \`bucketSizeMillis\` | *auto-calculated* | Time bucket size for data aggregation |

---

## Usage Example

### Minimal Configuration

\`\`\`typescript
import TsiClient from 'tsichart-core';

const tsiClient = new TsiClient();
const processGraphic = new tsiClient.ProcessGraphic(containerElement);

// Define your process diagram and data expressions
const graphicImageUrl = '/images/factory-process-diagram.png';

const timeSpanStart = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
const timeSpanEnd = new Date();

// Create TSQ expressions for each data point
const expressions = [
    new TsqExpression(
        { timeSeriesId: ['Compressor-01'] },
        { value: { kind: 'numeric', aggregation: { tsx: 'avg($value)' } } },
        { from: timeSpanStart, to: timeSpanEnd, bucketSize: '1h' },
        {
            alias: 'Compressor Pressure (psi)',
            color: '#1f77b4',
            positionX: 15,  // % from left
            positionY: 30   // % from top
        }
    ),
    new TsqExpression(
        { timeSeriesId: ['Pump-02'] },
        { value: { kind: 'numeric', aggregation: { tsx: 'avg($value)' } } },
        { from: timeSpanStart, to: timeSpanEnd, bucketSize: '1h' },
        {
            alias: 'Pump Flow Rate (gpm)',
            color: '#ff7f0e',
            positionX: 50,
            positionY: 50
        }
    )
];

processGraphic.render(
    graphicImageUrl,
    expressions,
    {
        theme: 'light',
        updateInterval: 2000
    }
);
\`\`\`

### Advanced Configuration with Dynamic Colors

\`\`\`typescript
const expressions = [
    new TsqExpression(
        { timeSeriesId: ['Compressor-01'] },
        { value: { kind: 'numeric', aggregation: { tsx: 'avg($value)' } } },
        { from: timeSpanStart, to: timeSpanEnd, bucketSize: '1h' },
        {
            alias: 'Compressor Pressure',
            positionX: 15,
            positionY: 30,
            // Dynamic color function: green if normal, red if high
            color: (value) => value > 50 ? '#d62728' : '#2ca02c'
        }
    )
];
\`\`\`

### With Click Handlers

\`\`\`typescript
const expressions = [
    new TsqExpression(
        { timeSeriesId: ['Compressor-01'] },
        { value: { kind: 'numeric', aggregation: { tsx: 'avg($value)' } } },
        { from: timeSpanStart, to: timeSpanEnd, bucketSize: '1h' },
        {
            alias: 'Compressor',
            positionX: 15,
            positionY: 30,
            color: '#1f77b4',
            onElementClick: (event) => {
                console.log('Compressor clicked!', event);
                // Navigate to compressor details
                // Show alert dialog
                // Trigger external action
            }
        }
    )
];
\`\`\`

---

## TsqExpression Constructor

\`\`\`typescript
new TsqExpression(
    instanceObject,   // { timeSeriesId: ['instance-id'] }
    variableObject,   // { value: { kind: 'numeric', aggregation: { tsx: 'avg($value)' } } }
    searchSpan,       // { from: Date, to: Date, bucketSize: string }
    optionsObject     // { alias, color, positionX, positionY, onElementClick, ... }
)
\`\`\`

### Parameters

- **instanceObject**: Object with \`timeSeriesId\` array identifying the time series
- **variableObject**: Object defining variables to query with kind and aggregation
- **searchSpan**: Time range with \`from\`, \`to\` dates and \`bucketSize\` string
- **optionsObject**: Configuration including:
  - \`alias\`: Display name for the data point
  - \`color\`: Color string or function returning color based on value
  - \`positionX\`: Horizontal position as percentage (0-100)
  - \`positionY\`: Vertical position as percentage (0-100)
  - \`onElementClick\`: Optional click handler function

---

## Data Structure

The ProcessGraphic component expects data in the standard TSQ format:

\`\`\`typescript
interface TimeSeriesData {
    [aggregateKey: string]: {
        [splitByValue: string]: {  // Use empty string "" if no split-by
            [timestamp: string]: {
                value: number;
                // ... other properties
            }
        }
    }
}
\`\`\`

---

## Position Coordinates

The \`positionX\` and \`positionY\` properties specify where data labels appear on the image:

- **positionX**: Horizontal position as percentage (0-100) from left edge
- **positionY**: Vertical position as percentage (0-100) from top edge

**Example Diagram Mapping:**
\`\`\`
Top-Left      (0, 0)      Top-Right (100, 0)
  ┌─────────────────────┐
  │   Compressor        │
  │   (15, 30)          │  Pump (50, 50)
  │                     │
  │                     │  Valve (80, 60)
  └─────────────────────┘
Bottom-Left (0, 100)    Bottom-Right (100, 100)
\`\`\`

---

## Image Scaling

ProcessGraphic automatically scales the process diagram image to fit the container:

- **Larger Container**: Image scales up to fit (respects original size if larger)
- **Smaller Container**: Image scales down proportionally
- **Aspect Ratio**: Always maintained to preserve diagram proportions

---

## Playback Controls

The integrated timeline slider provides:

- **Manual Timeline Navigation**: Drag handle to any point in time
- **Play/Pause**: Automatic progression through data at specified interval
- **Time Display**: Current timestamp with locale formatting
- **Date Range**: Visual representation of available data span

---

## Accessibility

- Full keyboard navigation on timeline slider
- ARIA labels on interactive elements
- Semantic HTML for screen readers
- Proper focus management and visual feedback
- High contrast support for visibility

---

## Migration from Older Versions

If upgrading from versions before November 2025, note these changes:

| Feature | Change |
|---------|--------|
| \`theme\` default | Changed from \`'dark'\` to \`'light'\` |
| Image loading | Now uses standard Image API with error handling |
| Data format | Uses standard TSQ format (no changes required) |

---
                
                `
            }
        }
    },
    argTypes: {
        theme: {
            control: { type: 'select' },
            options: ['light', 'dark'],
            description: 'Visual theme for the diagram and labels. Light theme provides better contrast on images.',
            table: { defaultValue: { summary: 'light' } }
        },
        updateInterval: {
            control: { type: 'number', min: 100, max: 10000, step: 100 },
            description: 'Playback update interval in milliseconds. Lower values = faster playback.',
            table: { defaultValue: { summary: '3000' } }
        },
        bucketSizeMillis: {
            control: { type: 'number' },
            description: 'Data aggregation bucket size. Auto-calculated if not specified.',
            table: { defaultValue: { summary: 'auto-calculated' } }
        }
    }
};

export default meta;
type Story = StoryObj<IProcessGraphicOptions>;


function createProcessExpressions() {
    const timeSpanStart = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    const timeSpanEnd = new Date();

    return [
        new TsqExpression(
            { timeSeriesId: ['Compressor-01'] },
            { value: { kind: 'numeric', aggregation: { tsx: 'avg($value)' } } },
            { from: timeSpanStart, to: timeSpanEnd, bucketSize: '1h' },
            {
                alias: 'Compressor Pressure (psi)',
                positionX: 15,
                positionY: 30,
                color:
                    // demo function that returns color based on value (green if <=50, red if >50)
                    (value: number) => value > 50 ? '#d62728' : '#2ca02c',
                onElementClick: () => console.log('Compressor clicked')
            }
        ),
        new TsqExpression(
            { timeSeriesId: ['Pump-02'] },
            { value: { kind: 'numeric', aggregation: { tsx: 'avg($value)' } } },
            { from: timeSpanStart, to: timeSpanEnd, bucketSize: '1h' },
            {
                alias: 'Pump Flow Rate (gpm)',
                positionX: 50,
                positionY: 50,
                color: '#ff7f0e',
                onElementClick: () => console.log('Pump clicked')
            }
        ),
        new TsqExpression(
            { timeSeriesId: ['Valve-03'] },
            { value: { kind: 'numeric', aggregation: { tsx: 'avg($value)' } } },
            { from: timeSpanStart, to: timeSpanEnd, bucketSize: '1h' },
            {
                alias: 'Valve Position (%)',
                positionX: 80,
                positionY: 60,
                color: '#2ca02c',
                onElementClick: () => console.log('Valve clicked')
            }
        )
    ];
}

function getSampleDiagramUrl(): string {
    return '/images/Process.jpg';
}

function renderProcessGraphic(container: HTMLElement, options: any = {}) {
    container.innerHTML = '';

    try {
        const processGraphic = new ProcessGraphic(container);
        const expressions = createProcessExpressions();
        const diagramUrl = getSampleDiagramUrl();
        function getMockDataForTimestamp(timeStamp: Date) {
            return expressions.map((expr, index) => {
                const baseValues = [45, 80, 65];
                const variance = [10, 15, 8];
                const timeFactor = (timeStamp.getTime() / 1000 / 60) % variance[index];
                const value = baseValues[index] + timeFactor;
                return {
                    properties: [{ values: [Math.max(0, value)] }]
                };
            });
        };

        const graphicOptions = {
            theme: options.theme || 'light',
            updateInterval: options.updateInterval || 3000,
            bucketSizeMillis: options.bucketSizeMillis || undefined,
            ...options,
            onSelectTimeStamp: (timeStamp: Date) => {
                const mockData = getMockDataForTimestamp(timeStamp);
                processGraphic.setDataForTimestamp(mockData);
            }
        };

        processGraphic.onReady = () => {
            const initialTime = new Date();
            const initialMockData = getMockDataForTimestamp(initialTime);
            processGraphic.setDataForTimestamp(initialMockData);
        };

        processGraphic.render(
            diagramUrl,
            expressions,
            graphicOptions
        );

        return processGraphic;
    } catch (error) {
        console.error('ProcessGraphic rendering error:', error);
        const errorMsg = error instanceof Error ? error.message : String(error);
        container.innerHTML = `<div style="color: red; padding: 16px;">Error: ${errorMsg}</div>`;
    }
}

function createProcessGraphicStory() {
    return (args: any) => {
        return html`
            <style>
                .process-graphic-container {
                    height: 600px;
                    width: 100%;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    display: flex;
                    flex-direction: column;
                    background: white;
                    overflow: hidden;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                
                .process-graphic-container.dark {
                    background: #1a1a1a;
                    border-color: #444;
                    color: #fff;
                }
                
                .process-graphic-container > div {
                    display: flex !important;
                    flex-direction: column !important;
                    height: 100% !important;
                    width: 100% !important;
                }
                
                .tsi-processGraphicContainer {
                    flex: 1;
                    overflow: hidden;
                    display: flex !important;
                    flex-direction: column !important;
                }
                
                .tsi-processGraphic {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }
                
                .tsi-processGraphic img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                }
                
                .tsi-processGraphicLabel {
                    position: absolute;
                    padding: 8px 12px;
                    border-radius: 4px;
                    font-size: 13px;
                    font-weight: 500;
                    white-space: nowrap;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                    transition: all 0.3s ease;
                }
                
                .tsi-processGraphicLabel.clickable {
                    cursor: pointer;
                }
                
                .tsi-processGraphicLabel:hover.clickable {
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
                }
                
                .tsi-processGraphicLabel.dark {
                    background: rgba(0, 0, 0, 0.7);
                    color: #fff;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                
                .tsi-playbackControlsContainer {
                    flex-shrink: 0;
                    border-top: 1px solid #ddd;
                }
                
                .process-graphic-container.dark .tsi-playbackControlsContainer {
                    border-top-color: #444;
                }
            </style>
            <div class="process-graphic-container ${args.theme === 'dark' ? 'dark' : ''}">
                ${(() => {
                const container = document.createElement('div');
                renderProcessGraphic(container, args);
                return html`${container}`;
            })()}
            </div>
        `;
    };
}


export const Default: Story = {
    name: 'Light Theme (Default)',
    args: {
        theme: 'light',
        updateInterval: 3000,
    },
    render: createProcessGraphicStory()
};


export const DarkTheme: Story = {
    name: 'Dark Theme',
    args: {
        theme: 'dark',
        updateInterval: 3000,
    },
    render: createProcessGraphicStory()
};


export const SlowPlayback: Story = {
    name: 'Slow Playback (5s)',
    args: {
        theme: 'light',
        updateInterval: 5000,
    },
    render: createProcessGraphicStory()
};


export const FastPlayback: Story = {
    name: 'Fast Playback (1s)',
    args: {
        theme: 'light',
        updateInterval: 1000,
    },
    render: createProcessGraphicStory()
};


export const Interaction: Story = {
    name: 'Interaction Tests',
    args: {
        theme: 'light',
        updateInterval: 2000,
    },
    render: createProcessGraphicStory(),
    play: async ({ canvasElement }) => {
        await waitFor(() => {
            const graphic = canvasElement.querySelector('.tsi-processGraphic');
            if (!graphic) {
                throw new Error('ProcessGraphic container not found');
            }
        }, { timeout: 5000 });

        await waitFor(() => {
            const labels = canvasElement.querySelectorAll('.tsi-processGraphicLabel');
            if (labels.length === 0) {
                throw new Error('Process labels not rendered');
            }
        }, { timeout: 5000 });

        const labels = canvasElement.querySelectorAll('.tsi-processGraphicLabel');
        if (labels.length > 0) {
            const firstLabel = labels[0] as HTMLElement;
            fireEvent.mouseOver(firstLabel);
            await new Promise((r) => setTimeout(r, 300));
        }

        if (labels.length > 0) {
            const firstLabel = labels[0] as HTMLElement;
            if (firstLabel.classList.contains('clickable')) {
                fireEvent.click(firstLabel);
                console.log('Clicked on first label');
            }
        }
        const playButton = canvasElement.querySelector('[aria-label*="play"], button:has-text("Play")');
        if (playButton) {
            fireEvent.click(playButton as HTMLElement);
            await new Promise((r) => setTimeout(r, 1000));
            const pauseButton = canvasElement.querySelector('[aria-label*="pause"], button:has-text("Pause")');
            if (pauseButton) {
                fireEvent.click(pauseButton as HTMLElement);
                console.log('Paused playback');
            }
        }
    }
};