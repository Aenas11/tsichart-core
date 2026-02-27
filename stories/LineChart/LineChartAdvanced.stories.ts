// stories/LineChartAdvanced.stories.ts
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ref, createRef } from 'lit/directives/ref.js';
import LineChart from '../../packages/core/src/components/LineChart/LineChart';

// Generate more complex sample data for advanced examples
function generateAdvancedSampleData() {
    const data: any[] = [];
    const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

    // Generate data for different scenarios
    const scenarios = [
        { name: 'Production', baseValue: 100, variance: 20, trend: 0.1 },
        { name: 'Quality', baseValue: 85, variance: 15, trend: -0.05 },
        { name: 'Efficiency', baseValue: 75, variance: 25, trend: 0.15 }
    ];

    scenarios.forEach((scenario, i) => {
        const lines: any = {};
        const scenarioData: any = {};
        scenarioData[scenario.name] = lines;
        data.push(scenarioData);

        // Multiple machines per scenario
        for (let j = 0; j < 4; j++) {
            const values: any = {};
            lines[`Machine${j + 1}`] = values;

            // Generate hourly data for the last week
            for (let k = 0; k < 24 * 7; k++) {
                const timestamp = new Date(from.getTime() + k * 60 * 60 * 1000);

                // Add trends, cycles, and random variation
                const timeProgress = k / (24 * 7);
                const dailyCycle = Math.sin((k % 24) / 24 * 2 * Math.PI) * 10;
                const weeklyTrend = scenario.trend * timeProgress * 50;
                const randomVariation = (Math.random() - 0.5) * scenario.variance;

                const value = scenario.baseValue +
                    dailyCycle +
                    weeklyTrend +
                    randomVariation +
                    (j * 5); // Machine offset

                values[timestamp.toISOString()] = {
                    value: Math.max(0, parseFloat(value.toFixed(2))),
                    min: Math.max(0, parseFloat((value - 5).toFixed(2))),
                    max: parseFloat((value + 5).toFixed(2))
                };
            }
        }
    });

    return data;
}

// Function to render LineChart with advanced options
function renderAdvancedLineChart(container: HTMLElement, options: any = {}) {
    container.innerHTML = '';

    try {
        const chart = new LineChart(container);

        const chartOptions = {
            theme: options.theme || 'light',
            legend: options.legend || 'shown',
            grid: options.grid !== false,
            tooltip: options.tooltip !== false,
            yAxisState: options.yAxisState || 'shared',
            interpolationFunction: options.interpolationFunction || 'curveMonotoneX',
            includeEnvelope: options.includeEnvelope || false,
            snapBrush: options.snapBrush || false,
            minBrushWidth: options.minBrushWidth || 10,
            is24HourTime: true,
            offset: 'Local',
            zeroYAxis: options.zeroYAxis || false,
            brushContextMenuActions: [],
            ...options
        };

        const sampleData = generateAdvancedSampleData();
        chart.render(sampleData, chartOptions, {});

        return chart;
    } catch (error) {
        let message = 'Unknown error';
        if (error instanceof Error) {
            message = error.message;
        }
        container.innerHTML = `<div style="color: red; padding: 20px;">
            Error rendering Advanced LineChart: ${message}
            <br><small>Check console for details</small>
        </div>`;
        console.error('Advanced LineChart rendering error:', error);
    }
}

const meta: Meta = {
    title: 'Charts/LineChart/LineChart Advanced',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
# Advanced LineChart Examples

This section demonstrates advanced features and configurations of the LineChart component.

## Advanced Features Showcased

### Multi-Series Management
- **Shared Y-Axis**: All series share the same Y-axis scale
- **Overlapping Y-Axis**: Multiple Y-axes for different value ranges  
- **Stacked Display**: Series stacked vertically

### Interactive Features
- **Brush Selection**: Drag to select time ranges with configurable snap, width, and visibility
- **Sticky Series**: Click to focus on specific series
- **Markers**: Add custom time markers with labels
- **Context Menus**: Right-click for additional options
- **Tooltips**: Interactive data point tooltips

### Data Visualization
- **Envelopes**: Show min/max ranges around values
- **Interpolation**: Different curve types (linear, monotone, step, basis, cardinal, catmull-rom)
- **Responsive Legends**: Compact, shown, or hidden modes
- **Area Charts**: Fill areas under lines
- **Dots**: Show individual data points
- **Series Labels**: Add markers with labels at the end of series

### Axis Configuration
- **Custom Y Extent**: Set fixed Y-axis ranges
- **Zero Y-Axis**: Force Y-axis to include zero
- **Hidden Axes**: Hide X or Y axes
- **Single Line Labels**: Configure X-axis label layout
- **Top Margins**: Adjust spacing between aggregate lines

### Time Configuration
- **Locale Support**: Configure date/time formatting locale
- **12/24 Hour Time**: Toggle time format
- **UTC Offset**: Set timezone offsets or use local time
- **Time Frames**: Define specific time ranges for events

### UI Controls
- **Control Panel**: Show/hide chart control buttons
- **Download**: Enable/disable download functionality
- **Grid**: Toggle grid visibility
- **Animations**: Control chart animations
- **Resize Handling**: Configure resize behavior

### Swim Lanes
- **Multi-Axis Support**: Configure multiple Y-axes with different scales
- **Custom Labels**: Add labels to swim lanes
- **Click Handlers**: Respond to swim lane interactions
- **Horizontal Markers**: Add reference lines

## All Options Demo

The "All Options Showcase" story demonstrates a comprehensive configuration with all major options enabled.
Use the Controls panel to experiment with different combinations.
                `
            }
        }
    },
    argTypes: {
        // Appearance
        theme: {
            control: { type: 'select' },
            options: ['light', 'dark'],
            description: 'Visual theme',
            table: { category: 'Appearance' }
        },
        color: {
            control: 'color',
            description: 'Base color for the selection/highlight',
            table: { category: 'Appearance' }
        },
        legend: {
            control: { type: 'select' },
            options: ['shown', 'hidden', 'compact'],
            description: 'Legend display mode',
            table: { category: 'Appearance' }
        },
        grid: {
            control: 'boolean',
            description: 'Whether the chart includes a grid and grid button',
            table: { category: 'Appearance' }
        },
        isArea: {
            control: 'boolean',
            description: 'Render lines as filled areas',
            table: { category: 'Appearance' }
        },
        noAnimate: {
            control: 'boolean',
            description: 'Disable animations on state change',
            table: { category: 'Appearance' }
        },

        // Axis Configuration
        yAxisState: {
            control: { type: 'select' },
            options: ['shared', 'stacked', 'overlap'],
            description: 'Y-axis configuration for multiple series',
            table: { category: 'Axis Configuration' }
        },
        xAxisHidden: {
            control: 'boolean',
            description: 'Hide the X-axis',
            table: { category: 'Axis Configuration' }
        },
        yAxisHidden: {
            control: 'boolean',
            description: 'Hide the Y-axis',
            table: { category: 'Axis Configuration' }
        },
        yExtent: {
            control: 'object',
            description: '[min, max] range of Y values',
            table: { category: 'Axis Configuration' }
        },
        aggTopMargin: {
            control: { type: 'range', min: 0, max: 50, step: 1 },
            description: 'Margin on top of each aggregate line(s)',
            table: { category: 'Axis Configuration' }
        },
        singleLineXAxisLabel: {
            control: 'boolean',
            description: 'Whether x axis time labels are on a single line',
            table: { category: 'Axis Configuration' }
        },

        // Brush Settings
        brushHandlesVisible: {
            control: 'boolean',
            description: 'Show handles on the brush',
            table: { category: 'Brush Settings' }
        },
        brushRangeVisible: {
            control: 'boolean',
            description: 'Show the brush duration label',
            table: { category: 'Brush Settings' }
        },
        snapBrush: {
            control: 'boolean',
            description: 'Snap brush selection to data points',
            table: { category: 'Brush Settings' }
        },
        minBrushWidth: {
            control: { type: 'range', min: 0, max: 50, step: 1 },
            description: 'Minimum brush selection width in pixels',
            table: { category: 'Brush Settings' }
        },
        keepBrush: {
            control: 'boolean',
            description: 'Keep the brush selected region upon re-render',
            table: { category: 'Brush Settings' }
        },
        brushClearable: {
            control: 'boolean',
            description: 'Allow clearing the brush selection',
            table: { category: 'Brush Settings' }
        },
        autoTriggerBrushContextMenu: {
            control: 'boolean',
            description: 'Trigger brush context menu on mouse up',
            table: { category: 'Brush Settings' }
        },

        // Interaction
        focusHidden: {
            control: 'boolean',
            description: 'Hide focus element in chart',
            table: { category: 'Interaction' }
        },
        tooltip: {
            control: 'boolean',
            description: 'Show tooltip on hover',
            table: { category: 'Interaction' }
        },
        shouldSticky: {
            control: 'boolean',
            description: 'Enable sticky series on click',
            table: { category: 'Interaction' }
        },

        // Markers
        labelSeriesWithMarker: {
            control: 'boolean',
            description: 'Add a marker at the right side with label for each series',
            table: { category: 'Markers' }
        },
        markers: {
            control: 'object',
            description: 'Array of timestamp/label tuples for markers',
            table: { category: 'Markers' }
        },

        // Swim Lanes
        swimLaneOptions: {
            control: 'object',
            description: 'Mapping of swim lane number to swimlane configuration',
            table: { category: 'Swim Lanes' }
        },

        // Time Configuration
        offset: {
            control: 'text',
            description: 'Offset for all timestamps (in minutes from UTC or "Local")',
            table: { category: 'Time Configuration' }
        },
        is24HourTime: {
            control: 'boolean',
            description: 'Display time in 24-hour format',
            table: { category: 'Time Configuration' }
        },
        dateLocale: {
            control: 'text',
            description: 'Locale for date formatting',
            table: { category: 'Time Configuration' }
        },
        timeFrame: {
            control: 'object',
            description: 'From/to range for event or state series',
            table: { category: 'Time Configuration' }
        },
        minutesForTimeLabels: {
            control: 'boolean',
            description: 'Force time labels to minute granularity',
            table: { category: 'Time Configuration' }
        },

        // UI Controls
        hideChartControlPanel: {
            control: 'boolean',
            description: 'Hide the panel with chart control buttons',
            table: { category: 'UI Controls' }
        },
        suppressResizeListener: {
            control: 'boolean',
            description: 'Ignore component resize function',
            table: { category: 'UI Controls' }
        },
        canDownload: {
            control: 'boolean',
            description: 'Include download button in ellipsis menu',
            table: { category: 'UI Controls' }
        },
        ellipsisItems: {
            control: 'object',
            description: 'Custom options in the ellipsis menu',
            table: { category: 'UI Controls' }
        },

        // Data Display
        interpolationFunction: {
            control: { type: 'select' },
            options: ['curveLinear', 'curveMonotoneX', 'curveStep', 'curveStepBefore', 'curveStepAfter', 'curveBasis', 'curveCardinal', 'curveCatmullRom'],
            description: 'Line interpolation method',
            table: { category: 'Data Display' }
        },
        includeEnvelope: {
            control: 'boolean',
            description: 'Show min/max envelope around values',
            table: { category: 'Data Display' }
        },
        includeDots: {
            control: 'boolean',
            description: 'Show dots for values',
            table: { category: 'Data Display' }
        },
        zeroYAxis: {
            control: 'boolean',
            description: 'Force Y-axis to include zero',
            table: { category: 'Data Display' }
        },
        keepSplitByColor: {
            control: 'boolean',
            description: 'Keep the split by colors when state is updated',
            table: { category: 'Data Display' }
        },

        // Styling
        strings: {
            control: 'object',
            description: 'Key-value pairs for i18n strings',
            table: { category: 'Styling' }
        },

        // Event Handlers
        onMouseover: {
            action: 'mouseover',
            description: 'Callback when hovering over a data point',
            table: { category: 'Event Handlers' }
        },
        onMouseout: {
            action: 'mouseout',
            description: 'Callback when mouse leaves a data point',
            table: { category: 'Event Handlers' }
        },
        onSticky: {
            action: 'sticky',
            description: 'Callback when a series becomes sticky',
            table: { category: 'Event Handlers' }
        },
        onUnsticky: {
            action: 'unsticky',
            description: 'Callback when a series becomes unsticky',
            table: { category: 'Event Handlers' }
        },
        onMarkersChange: {
            action: 'markersChange',
            description: 'Callback when markers are added or removed',
            table: { category: 'Event Handlers' }
        },
        brushMoveAction: {
            action: 'brushMove',
            description: 'Callback when the brush is moved',
            table: { category: 'Event Handlers' }
        },
        brushMoveEndAction: {
            action: 'brushMoveEnd',
            description: 'Callback when the brush movement ends',
            table: { category: 'Event Handlers' }
        }
    }
};

export default meta;
type Story = StoryObj;

// Base configuration shared across all stories
const baseArgs = {
    theme: 'light',
    yAxisState: 'shared',
    legend: 'shown',
    interpolationFunction: 'curveMonotoneX',
    includeEnvelope: false,
    snapBrush: false,
    minBrushWidth: 10,
    zeroYAxis: false,
    tooltip: true,
    grid: true,
    brushHandlesVisible: false,
    is24HourTime: true,
    offset: 'Local'
};

// Comprehensive event handlers for stories that need them
const eventHandlers = {
    onMouseover: (aggKey: string, splitBy: string) => {
        console.log('Mouseover:', aggKey, splitBy);
    },
    onMouseout: () => {
        console.log('Mouseout');
    },
    onSticky: (aggKey: string, splitBy: string) => {
        console.log('Sticky:', aggKey, splitBy);
    },
    onUnsticky: (aggKey: string, splitBy: string) => {
        console.log('Unsticky:', aggKey, splitBy);
    },
    onMarkersChange: (markers: Array<number>) => {
        console.log('Markers changed:', markers);
    },
    brushMoveAction: () => {
        console.log('Brush moving');
    },
    brushMoveEndAction: () => {
        console.log('Brush move ended');
    }
};

// Reusable render function for most stories
const createStoryRender = (height: string = '600px', background?: string) => (args: any) => {
    const containerRef = createRef<HTMLDivElement>();

    setTimeout(() => {
        if (containerRef.value) {
            renderAdvancedLineChart(containerRef.value, args);
        }
    }, 100);

    const containerStyle = `height: ${height}; width: 100%; border: 1px solid ${background ? '#444' : '#ddd'}; border-radius: 4px;${background ? ` background: ${background};` : ''}`;

    return html`
        <div style="${containerStyle}">
            <div 
                ${ref(containerRef)}
                style="height: 100%; width: 100%;"
            ></div>
        </div>
    `;
};

export const SharedYAxis: Story = {
    args: {
        ...baseArgs
    },
    render: createStoryRender()
};

export const OverlappingAxes: Story = {
    args: {
        ...baseArgs,
        yAxisState: 'overlap',
        snapBrush: true,
        minBrushWidth: 15
    },
    render: createStoryRender()
};

export const WithEnvelopes: Story = {
    args: {
        ...baseArgs,
        legend: 'compact',
        includeEnvelope: true,
        zeroYAxis: true
    },
    render: createStoryRender()
};

export const DarkThemeAdvanced: Story = {
    args: {
        ...baseArgs,
        theme: 'dark',
        yAxisState: 'stacked',
        interpolationFunction: 'curveStep',
        snapBrush: true,
        minBrushWidth: 20
    },
    render: createStoryRender('600px', '#1a1a1a')
};

export const CompactLayout: Story = {
    args: {
        ...baseArgs,
        legend: 'compact',
        interpolationFunction: 'curveLinear',
        minBrushWidth: 5,
        zeroYAxis: true
    },
    render: createStoryRender('350px')
};

export const AllOptionsShowcase: Story = {
    args: {
        ...baseArgs,
        // Appearance
        color: '#0078d4',
        isArea: false,
        noAnimate: false,

        // Axis Configuration
        xAxisHidden: false,
        yAxisHidden: false,
        yExtent: null,
        aggTopMargin: 12,
        singleLineXAxisLabel: false,

        // Brush Settings
        brushHandlesVisible: true,
        brushRangeVisible: true,
        snapBrush: true,
        keepBrush: false,
        brushClearable: true,
        autoTriggerBrushContextMenu: false,

        // Interaction
        focusHidden: false,
        shouldSticky: true,

        // Markers
        labelSeriesWithMarker: false,
        markers: null,

        // Swim Lanes
        swimLaneOptions: null,

        // Time Configuration
        dateLocale: 'en',
        timeFrame: null,
        minutesForTimeLabels: false,

        // UI Controls
        hideChartControlPanel: false,
        suppressResizeListener: false,
        canDownload: true,
        ellipsisItems: [],

        // Data Display
        includeEnvelope: true,
        includeDots: false,
        keepSplitByColor: false,

        // Event Handlers
        ...eventHandlers
    },
    render: createStoryRender()
};

export const WithSeriesLabels: Story = {
    args: {
        ...baseArgs,
        legend: 'hidden',
        labelSeriesWithMarker: true
    },
    render: createStoryRender()
};

export const MinimalUI: Story = {
    args: {
        ...baseArgs,
        legend: 'hidden',
        interpolationFunction: 'curveLinear',
        hideChartControlPanel: true,
        xAxisHidden: true,
        yAxisHidden: true,
        focusHidden: true,
        tooltip: false,
        grid: false,
        noAnimate: true
    },
    render: createStoryRender('400px')
};

export const WithCustomYExtent: Story = {
    args: {
        ...baseArgs,
        yExtent: [0, 200],
        zeroYAxis: true
    },
    render: createStoryRender()
};

export const AreaChart: Story = {
    args: {
        ...baseArgs,
        yAxisState: 'stacked',
        isArea: true,
        zeroYAxis: true
    },
    render: createStoryRender()
};

export const WithDots: Story = {
    args: {
        ...baseArgs,
        interpolationFunction: 'curveLinear',
        includeDots: true
    },
    render: createStoryRender()
};

// Example: Per-swim-lane background bands
export const WithBackgroundBands: Story = {
    name: 'With Background Bands',
    args: {
        ...baseArgs,
        yAxisState: 'stacked',
        legend: 'compact',
        swimLaneOptions: {
            0: {
                showBackgroundBands: true,
                horizontalMarkers: [
                    { value: 60, color: '#0078d4', condition: 'Greater Than', label: 'Low' },
                    { value: 80, color: '#387458', condition: 'Greater Than', label: 'Normal' },
                    { value: 90, color: '#88ff00', condition: 'Greater Than', label: 'Warning' },
                    { value: 110, color: '#ff8c00', condition: 'Greater Than', label: 'Critical' }
                ]
            },
            1: {
                showBackgroundBands: true,
                horizontalMarkers: [
                    { value: 70, color: '#c80096', condition: 'Greater Than', label: 'Acceptable' },
                    { value: 90, color: '#e7382b', condition: 'Greater Than', label: 'Target' }
                ]
            }
        }
    },
    render: createStoryRender()
};

export const CustomStrings: Story = {
    name: 'Custom Strings (i18n)',
    parameters: {
        docs: {
            description: {
                story: `
This example demonstrates how to override default strings in the LineChart component for internationalization (i18n) or custom labeling.

The \`strings\` option accepts an object with key-value pairs where keys are the default English strings and values are the custom translations or replacements.

### Available String Keys

You can override any of the following strings:
- **Time ranges**: "Last 30 mins", "Last Hour", "Last 2 Hours", "Last 4 Hours", "Last 12 Hours", "Last 24 Hours", "Last 7 Days", "Last 30 Days"
- **UI labels**: "Custom", "Timeframe", "Save", "timezone", "start", "end", "Latest", "All Columns", "only"
- **Menu actions**: "Download as CSV", "Toggle all columns", "Stack/Unstack Bars", "Stack bars", "Unstack bars"
- **Markers**: "Click to drop marker", "drag to reposition", "Delete marker at", "Drop a Marker", "Marker", "Start at"
- **Accessibility**: "Show ellipsis menu", "Hide ellipsis menu", "toggle visibility for", "Series type selection for"
- **Search**: "Search Time Series Instances", "No results", "No instances", "No search result", "Show more"
- **States**: "shifted", "Selected", "No filter results", "Invalid Date"
- **Chart types**: "Line chart", "Bar chart", "Heatmap", "Pie chart", "Scatter plot"
- **Grid**: "Display Grid", "A grid of values", "close grid"
- **Errors**: "No description", "Hierarchy error", "Failed to get token"
- And many more...

### Example Usage

\`\`\`typescript
const chart = new LineChart(container);
chart.render(data, {
    theme: 'light',
    strings: {
        "Drop a Marker": "Ajouter un marqueur",  // French
        "Click to drop marker": "Cliquez pour déposer un marqueur",
        "drag to reposition": "faites glisser pour repositionner",
        "Delete marker at": "Supprimer le marqueur à",
        "Download as CSV": "Télécharger en CSV",
        "Last Hour": "Dernière heure",
        "Last 24 Hours": "Dernières 24 heures",
        "Line chart": "Graphique linéaire"
    }
}, {});
\`\`\`

In this story, we demonstrate French translations for common UI elements.
                `
            }
        }
    },
    args: {
        ...baseArgs,
        yAxisState: 'shared',
        legend: 'shown',
        tooltip: true,
        // French translations for common UI strings
        strings: {
            // Marker strings
            "Drop a Marker": "Ajouter un marqueur",
            "Click to drop marker": "Cliquez pour déposer un marqueur",
            "drag to reposition": "faites glisser pour repositionner",
            "Delete marker at": "Supprimer le marqueur à",
            "Marker": "Marqueur",
            "Start at": "Commence à",

            // Menu strings
            "Download as CSV": "Télécharger en CSV",
            "Show ellipsis menu": "Afficher le menu points de suspension",
            "Hide ellipsis menu": "Masquer le menu points de suspension",
            "Toggle all columns": "Basculer toutes les colonnes",
            "All Columns": "Toutes les colonnes",

            // Time ranges
            "Last 30 mins": "30 dernières minutes",
            "Last Hour": "Dernière heure",
            "Last 2 Hours": "2 dernières heures",
            "Last 4 Hours": "4 dernières heures",
            "Last 12 Hours": "12 dernières heures",
            "Last 24 Hours": "24 dernières heures",
            "Last 7 Days": "7 derniers jours",
            "Last 30 Days": "30 derniers jours",
            "Custom": "Personnalisé",

            // Common labels
            "Timeframe": "Période",
            "Save": "Enregistrer",
            "timezone": "fuseau horaire",
            "start": "début",
            "end": "fin",
            "Latest": "Dernier",
            "only": "seulement",
            "Selected": "Sélectionné",

            // Chart related
            "Line chart": "Graphique linéaire",
            "Bar chart": "Graphique à barres",
            "Heatmap": "Carte de chaleur",
            "Pie chart": "Graphique circulaire",
            "Scatter plot": "Nuage de points",

            // Y-axis states
            "Stack/Unstack Bars": "Empiler/Dépiler les barres",
            "Stack bars": "Empiler les barres",
            "Unstack bars": "Dépiler les barres",
            "Change y-axis type": "Changer le type d'axe y",
            "set axis state to": "définir l'état de l'axe sur",

            // Visibility
            "toggle visibility for": "basculer la visibilité pour",
            "Series type selection for": "Sélection du type de série pour",
            "show series": "afficher la série",
            "hide series": "masquer la série",
            "show group": "afficher le groupe",
            "hide group": "masquer le groupe",
            "in group": "dans le groupe",

            // Search
            "Search Time Series Instances": "Rechercher des instances de séries temporelles",
            "No results": "Aucun résultat",
            "No instances": "Aucune instance trouvée",
            "No search result": "Aucune instance trouvée pour le terme de recherche saisi.",
            "Show more": "Afficher plus",
            "No description": "Aucune description",

            // Grid
            "Display Grid": "Afficher la grille",
            "A grid of values": "Une grille de valeurs",
            "close grid": "fermer la grille",

            // Other
            "Invalid Date": "Date invalide",
            "No filter results": "Aucun résultat de filtre",
            "shifted": "décalé",
            "Local": "Local",
            "and": "et",
            "Dismiss": "Rejeter"
        },
        ...eventHandlers
    },
    render: createStoryRender()
};
