import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import GeoProcessGraphic from '../../packages/core/src/components/GeoProcessGraphic';
import { fireEvent, screen, within, waitFor } from 'storybook/test';
import TsqExpression from "../../packages/core/src/models/TsqExpression";

interface IGeoTsqExpression extends TsqExpression {
    positionXVariableName: string;
    positionYVariableName: string;
    image: string;
}

interface IGeoProcessGraphicOptions {
    theme?: 'light' | 'dark';
    subscriptionKey: string;
    center?: [number, number];
    zoom?: number;
    bearing?: number;
    pitch?: number;
    maxZoom?: number;
    minZoom?: number;
    duration?: number;
    width?: number;
    height?: number;
    tilesetId?: string;
    timeFrame?: {
        from: Date;
        to: Date;
    };
    minutesPerInterval?: number;
    speed?: number;
}

const meta: Meta<IGeoProcessGraphicOptions> = {
    title: 'Charts/GeoProcessGraphic/GeoProcessGraphic',
    component: 'GeoProcessGraphic',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
# GeoProcessGraphic Component

Interactive map-based visualization for time series location data with the following features:

## Key Features
- **Azure Maps Integration**: Professional mapping with custom tile sources
- **Custom Tile Support**: Use Azure Maps tile API with different tilesets
- **Time-based Playback**: Replay location data with history controls
- **Interactive Markers**: Custom vehicle icons with detailed popups
- **Multiple Map Styles**: Road, satellite, hybrid, and dark themes

## Prerequisites
- **Azure Maps Subscription Key**: Required for map functionality
- **Position Data**: Time series data must include longitude/latitude variables
- **Custom Marker Images**: URLs to marker images for different device types

## Tile Configuration

The component supports Azure Maps tile API:
\`\`\`
https://atlas.microsoft.com/map/tile?subscription-key={key}&api-version=2024-04-01&tilesetId={tilesetId}&zoom={z}&x={x}&y={y}&tileSize=256
\`\`\`

Available tilesets:
- \`microsoft.base.road\` - Standard road map
- \`microsoft.base.darkgrey\` - Dark theme roads  
- \`microsoft.imagery\` - Satellite imagery
- \`microsoft.base.hybrid\` - Satellite with road labels

## Usage Example

\`\`\`typescript
const geoChart = new GeoProcessGraphic(container);
geoChart.render(tsqExpressions, {
    subscriptionKey: "your-azure-maps-key",
    center: [-122.33, 47.61],
    zoom: 15,
    tilesetId: "microsoft.base.road",
    theme: 'light'
});
\`\`\`

                `
            }
        }
    },
    argTypes: {
        theme: {
            control: { type: 'select' },
            options: ['light', 'dark'],
            description: 'Visual theme for the map'
        },
        subscriptionKey: {
            control: 'text',
            description: 'Azure Maps subscription key (required)'
        },
        tilesetId: {
            control: { type: 'select' },
            options: [
                'microsoft.base.road',
                'microsoft.base.darkgrey',
                'microsoft.imagery',
                'microsoft.base.hybrid'
            ],
            description: 'Azure Maps tileset identifier'
        },
        center: {
            control: 'object',
            description: 'Map center coordinates [longitude, latitude]',
            table: { defaultValue: { summary: '[-122.33, 47.61]' } }
        },
        zoom: {
            control: { type: 'range', min: 1, max: 20, step: 1 },
            description: 'Map zoom level (matches your example zoom=15)'
        }
    }
}

export default meta;
type Story = StoryObj<IGeoProcessGraphicOptions>;

function generateSampleGeoData(): IGeoTsqExpression[] {
    const vehicles = [
        { id: "vehicle-001", name: "Delivery Truck A", route: 'downtown' },
        { id: "vehicle-002", name: "Service Van B", route: 'suburbs' },
        { id: "vehicle-003", name: "Field Car C", route: 'highway' }
    ];

    const timeSpanStart = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
    const timeSpanEnd = new Date();

    return vehicles.map((vehicle, index) => {
        // Create proper TsqExpression instance following class-based architecture
        const tsqExpression = new TsqExpression(
            { timeSeriesId: [vehicle.id] },
            {
                longitude: { kind: "numeric", aggregation: { tsx: "avg($value)" } },
                latitude: { kind: "numeric", aggregation: { tsx: "avg($value)" } },
                speed: { kind: "numeric", aggregation: { tsx: "avg($value)" } },
                fuel: { kind: "numeric", aggregation: { tsx: "avg($value)" } }
            },
            {
                from: timeSpanStart,
                to: timeSpanEnd,
                bucketSize: "5m"
            },
            {
                alias: vehicle.name,
                color: ['#ff6b6b', '#4ecdc4', '#45b7d1'][index]
            }
        ) as IGeoTsqExpression;

        // Add geo-specific properties following component patterns
        tsqExpression.positionXVariableName = "longitude";
        tsqExpression.positionYVariableName = "latitude";
        tsqExpression.image = `data:image/svg+xml,${encodeURIComponent(`
            <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="12" fill="${['#ff6b6b', '#4ecdc4', '#45b7d1'][index]}" stroke="#fff" stroke-width="2"/>
                <text x="16" y="20" text-anchor="middle" font-size="12">${['🚛', '🚐', '🚗'][index]}</text>
            </svg>
        `)}`;

        return tsqExpression;
    });
}

function renderGeoProcessGraphic(container: HTMLElement, options: IGeoProcessGraphicOptions = {} as any) {
    container.innerHTML = '';

    try {
        console.log('Rendering GeoProcessGraphic with subscription key:', options.subscriptionKey ? 'PROVIDED' : 'MISSING');
        const geoChart = new GeoProcessGraphic(container);
        const geoExpressions = generateSampleGeoData();

        const chartOptions = {
            subscriptionKey: options.subscriptionKey || "demo-key",
            center: options.center || [-122.33, 47.61], // Seattle
            zoom: options.zoom || 10,
            tilesetId: options.tilesetId || 'microsoft.base.road',
            bearing: 0,
            pitch: 0,
            maxZoom: 20,
            minZoom: 1,
            duration: 2000,
            width: 800,
            height: 600,
            theme: options.theme || 'light',
            ...options
        };

        geoChart.render(geoExpressions, chartOptions);
        return geoChart;

    } catch (error) {
        console.error('GeoProcessGraphic rendering error:', error);
        container.innerHTML = `
            <div style="color: red; padding: 20px; font-family: monospace;">
                <h3>Error rendering GeoProcessGraphic</h3>
                <p><strong>Error:</strong> ${error.message}</p>
                <p><small>Check browser console for more details</small></p>
            </div>
        `;
        return null;
    }
}

function createGeoStory(containerStyle: string) {
    return (args: IGeoProcessGraphicOptions) => {
        const chartId = 'geo-chart-' + Math.random().toString(36).substring(7);

        setTimeout(() => {
            const container = document.getElementById(chartId);
            if (container) {
                renderGeoProcessGraphic(container, args);
            }
        }, 100);

        return html`
            <div style="${containerStyle}">
                <div id="${chartId}" style="height: 100%; width: 100%;"></div>
            </div>
        `;
    };
}

export const Default: Story = {
    name: 'Vehicle Tracking (Demo)',
    args: {
        theme: 'light',
        subscriptionKey: 'demo-key-required',
        center: [-122.33, 47.61],
        zoom: 12,
        speed: 1000
    },
    render: createGeoStory('height: 600px; width: 100%; border: 1px solid #ddd; border-radius: 8px;')
};

export const DarkTheme: Story = {
    name: 'Dark Theme',
    args: {
        theme: 'dark',
        subscriptionKey: 'demo-key-required',
        center: [-122.33, 47.61],
        zoom: 12,
        speed: 1000
    },
    render: createGeoStory('height: 600px; width: 100%; background: #1a1a1a; border: 1px solid #444; border-radius: 8px;')
};

export const HighZoom: Story = {
    name: 'Detailed View (High Zoom)',
    args: {
        theme: 'light',
        subscriptionKey: 'demo-key-required',
        center: [-122.33, 47.61],
        zoom: 15,
        speed: 500
    },
    render: createGeoStory('height: 600px; width: 100%; border: 1px solid #ddd; border-radius: 8px;')
};

export const FastPlayback: Story = {
    name: 'Fast Playback',
    args: {
        theme: 'light',
        subscriptionKey: 'demo-key-required',
        center: [-122.33, 47.61],
        zoom: 10,
        speed: 200
    },
    render: createGeoStory('height: 600px; width: 100%; border: 1px solid #ddd; border-radius: 8px;'),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await waitFor(() => {
            const container = canvas.getByText(/GeoProcessGraphic Component/);
            if (!container) throw new Error("Component not rendered");
        }, { timeout: 3000 });

        const playButton = canvas.queryByText('▶️ Play');
        if (playButton) {
            fireEvent.click(playButton);
            console.log('Playback started (mock)');
        }

        const markers = canvasElement.querySelectorAll('[title*="Truck"], [title*="Van"], [title*="Car"]');
        if (markers.length > 0) {
            fireEvent.click(markers[0]);
            console.log('Marker clicked (mock)');
        }
    }
};