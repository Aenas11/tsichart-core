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

class MovingGeoProcessGraphic extends GeoProcessGraphic {
    private vehicleData: Map<string, Array<any>> = new Map();
    private routeGenerators: Map<string, any> = new Map();

    protected renderBase(data: Array<TsqExpression>, chartOptions: any) {
        this.generateVehicleRoutes(data, chartOptions);
        super.renderBase(data, chartOptions);
        this.setupVehicleMovement();
    }

    private setupVehicleMovement(): void {
        setTimeout(() => {
            if (this.playbackControls) {
                const originalCallback = (this.playbackControls as any).selectTimeStampCallback;
                (this.playbackControls as any).selectTimeStampCallback = (timeStamp: Date) => {
                    if (originalCallback && typeof originalCallback === 'function') {
                        try {
                            originalCallback(timeStamp);
                        } catch (error) {
                            console.warn('Error calling original callback:', error);
                        }
                    }

                    this.handleVehicleMovement(timeStamp);
                };
            } else {
                console.warn('PlaybackControls not available for vehicle movement setup');
            }
        }, 300);
    }

    private handleVehicleMovement(timeStamp: Date): void {

        if (!this.tsqExpressions || this.tsqExpressions.length === 0) {
            console.warn('No TSQ expressions available for vehicle movement');
            return;
        }

        const vehiclePositions: Array<any> = [];

        this.tsqExpressions.forEach((expression, index) => {
            let vehicleId: string;
            try {
                if (Array.isArray(expression.timeSeriesId)) {
                    vehicleId = expression.timeSeriesId[0];
                } else if (expression.timeSeriesId && typeof expression.timeSeriesId === 'object') {
                    vehicleId = (expression.timeSeriesId as any).timeSeriesId?.[0] || `vehicle-${index}`;
                } else {
                    vehicleId = `vehicle-${index}`;
                }
            } catch (error) {
                console.warn('Error extracting vehicle ID:', error);
                vehicleId = `vehicle-${index}`;
            }

            const vehicleData = this.vehicleData.get(vehicleId);

            if (vehicleData && vehicleData.length > 0) {

                let closestPoint = vehicleData[0];
                let minDiff = Math.abs(vehicleData[0].timestamp.getTime() - timeStamp.getTime());

                for (const dataPoint of vehicleData) {
                    const diff = Math.abs(dataPoint.timestamp.getTime() - timeStamp.getTime());
                    if (diff < minDiff) {
                        minDiff = diff;
                        closestPoint = dataPoint;
                    }
                }


                vehiclePositions.push(closestPoint);
            } else {
                console.warn(`No route data found for vehicle: ${vehicleId}`);

                vehiclePositions.push({
                    timestamp: timeStamp,
                    longitude: 153.021072 + (Math.random() - 0.5) * 0.01,
                    latitude: -27.470125 + (Math.random() - 0.5) * 0.01,
                    speed: Math.random() * 30,
                    fuel: 50 + Math.random() * 50,
                    engineTemp: 85 + Math.random() * 15,
                    odometer: 15000 + index * 100,
                    status: 'moving',
                    driver: `Driver ${index + 1}`
                });
            }
        });

        if (vehiclePositions.length > 0) {
            this.updateVehicleMarkers(vehiclePositions);
        }
    }

    private updateVehicleMarkers(dataPoints: Array<any>): void {
        if (!(this as any).map) {
            console.warn('Azure Maps instance not available');
            return;
        }

        try {
            const map = (this as any).map;
            const markers = map.markers?.getMarkers?.() || [];
            const popups = map.popups?.getPopups?.() || [];
            dataPoints.forEach((dataPoint, index) => {
                if (markers[index] &&
                    dataPoint.longitude !== undefined &&
                    dataPoint.latitude !== undefined &&
                    !isNaN(dataPoint.longitude) &&
                    !isNaN(dataPoint.latitude)) {

                    const newPosition = [dataPoint.longitude, dataPoint.latitude];
                    markers[index].setOptions({
                        position: newPosition
                    });
                    if (popups[index]) {
                        popups[index].setOptions({
                            position: newPosition,
                            content: this.createVehiclePopupContent(dataPoint, index)
                        });
                    }
                } else {
                    console.warn(`⚠️ Cannot update marker ${index}: invalid position data`);
                }
            });
        } catch (error) {
            console.error('Error updating vehicle markers:', error);
        }
    }

    private generateVehicleRoutes(expressions: Array<TsqExpression>, chartOptions: any): void {
        const timeFrame = chartOptions.timeFrame || {
            from: new Date(Date.now() - 2 * 60 * 60 * 1000),
            to: new Date()
        };

        const center = chartOptions.center || [153.021072, -27.470125];
        const bucketSizeMs = 5 * 60 * 1000; // 5 minute intervals
        const totalDuration = timeFrame.to.getTime() - timeFrame.from.getTime();
        const numberOfPoints = Math.ceil(totalDuration / bucketSizeMs);

        expressions.forEach((expression, index) => {
            let vehicleId: string;

            if (Array.isArray(expression.timeSeriesId)) {
                vehicleId = expression.timeSeriesId[0];
            } else if (expression.timeSeriesId && typeof expression.timeSeriesId === 'object') {
                vehicleId = (expression.timeSeriesId as any).timeSeriesId?.[0] || `vehicle-${index}`;
            } else {
                vehicleId = `vehicle-${index}`;
            }

            const route = this.generateRoutePoints(center, numberOfPoints, index);
            const timeSeriesData = this.generateTimeSeriesData(
                timeFrame.from,
                bucketSizeMs,
                route,
                index
            );

            this.vehicleData.set(vehicleId, timeSeriesData);

        });
    }


    private createVehiclePopupContent(dataPoint: any, vehicleIndex: number): string {
        const vehicleTypes = ['🚛 Delivery Truck', '🚐 Service Van', '🚗 Patrol Car'];
        const vehicleType = vehicleTypes[vehicleIndex % vehicleTypes.length];

        const timestamp = new Date(dataPoint.timestamp).toLocaleTimeString();

        return `
        <div style="
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            padding: 12px;
            min-width: 200px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        ">
            <div style="
                display: flex; 
                align-items: center; 
                margin-bottom: 12px;
                font-size: 16px;
                font-weight: 600;
                color: #333;
            ">
                ${vehicleType}
            </div>
            
            <div style="
                display: grid; 
                grid-template-columns: auto 1fr; 
                gap: 6px 12px; 
                font-size: 13px;
                line-height: 1.4;
            ">
                <strong>Driver:</strong>
                <span style="color: #666;">${dataPoint.driver || 'Unknown'}</span>
                
                <strong>Status:</strong>
                <span style="
                    color: ${dataPoint.status === 'moving' ? '#28a745' : '#ffc107'};
                    font-weight: 500;
                ">
                    ${dataPoint.status === 'moving' ? '🚀 Moving' : '⏸️ Stopped'}
                </span>
                
                <strong>Speed:</strong>
                <span style="color: #666;">${Math.round(dataPoint.speed)} km/h</span>
                
                <strong>Fuel:</strong>
                <span style="
                    color: ${dataPoint.fuel > 50 ? '#28a745' : dataPoint.fuel > 25 ? '#ffc107' : '#dc3545'};
                ">
                    ${Math.round(dataPoint.fuel)}%
                </span>
                
                <strong>Engine:</strong>
                <span style="color: #666;">${Math.round(dataPoint.engineTemp)}°C</span>
                
                <strong>Odometer:</strong>
                <span style="color: #666;">${Math.round(dataPoint.odometer).toLocaleString()} km</span>
                
                <strong>Position:</strong>
                <span style="
                    font-family: monospace; 
                    font-size: 11px;
                    color: #666;
                ">
                    ${dataPoint.latitude.toFixed(6)}, ${dataPoint.longitude.toFixed(6)}
                </span>
                
                <strong>Time:</strong>
                <span style="color: #666;">${timestamp}</span>
            </div>
            <!-- Fuel level indicator following D3.js visual patterns -->
            <div style="margin-top: 10px;">
                <div style="
                    height: 6px; 
                    background: #f0f0f0; 
                    border-radius: 3px; 
                    overflow: hidden;
                ">
                    <div style="
                        height: 100%; 
                        width: ${dataPoint.fuel}%; 
                        background: linear-gradient(90deg, 
                            ${dataPoint.fuel > 50 ? '#28a745' : dataPoint.fuel > 25 ? '#ffc107' : '#dc3545'} 0%, 
                            ${dataPoint.fuel > 50 ? '#34ce57' : dataPoint.fuel > 25 ? '#ffd93d' : '#f85c70'} 100%
                        );
                        transition: width 0.3s ease;
                    "></div>
                </div>
            </div>
        </div>
    `;
    }


    private generateRoutePoints(center: [number, number], count: number, vehicleIndex: number): Array<[number, number]> {
        const routes = [
            {
                waypoints: [
                    [153.021072, -27.470125], // Brisbane CBD
                    [153.025, -27.465],        // North
                    [153.030, -27.460],        // Northeast  
                    [153.035, -27.465],        // East
                    [153.030, -27.475],        // Southeast
                    [153.025, -27.478],        // South
                    [153.020, -27.475],        // Southwest
                    [153.018, -27.470],        // West
                    [153.021072, -27.470125]  // Back to start
                ],
                speed: 0.8
            },
            // Route 2: Suburban delivery route (Van)
            {
                waypoints: [
                    [153.021072, -27.470125], // Start CBD
                    [153.010, -27.480],        // Southwest suburbs
                    [153.000, -27.485],        // Further southwest
                    [152.995, -27.490],        // Residential area
                    [153.005, -27.495],        // Loop around
                    [153.015, -27.490],        // Return path
                    [153.020, -27.485],        // Back towards CBD
                    [153.021072, -27.470125]  // Return to start
                ],
                speed: 1.2
            },
            // Route 3: Highway patrol route (Car)
            {
                waypoints: [
                    [153.021072, -27.470125], // Start CBD
                    [153.040, -27.450],        // North highway
                    [153.060, -27.430],        // Further north
                    [153.070, -27.420],        // Highway exit
                    [153.080, -27.425],        // Service road
                    [153.075, -27.440],        // Return south
                    [153.050, -27.460],
                ],
                speed: 1.5
            }
        ];

        const route = routes[vehicleIndex % routes.length];
        const interpolatedPoints: Array<[number, number]> = [];

        const waypointsPerSegment = Math.ceil(count / (route.waypoints.length - 1));

        for (let i = 0; i < route.waypoints.length - 1; i++) {
            const start = route.waypoints[i];
            const end = route.waypoints[i + 1];

            for (let j = 0; j < waypointsPerSegment && interpolatedPoints.length < count; j++) {
                const t = j / waypointsPerSegment;

                const noise = 0.0005;
                const randomX = (Math.random() - 0.5) * noise;
                const randomY = (Math.random() - 0.5) * noise;

                const lon = start[0] + (end[0] - start[0]) * t + randomX;
                const lat = start[1] + (end[1] - start[1]) * t + randomY;

                interpolatedPoints.push([lon, lat]);
            }
        }

        while (interpolatedPoints.length < count) {
            interpolatedPoints.push(interpolatedPoints[interpolatedPoints.length - 1]);
        }
        return interpolatedPoints.slice(0, count);
    }

    private generateTimeSeriesData(
        startTime: Date,
        intervalMs: number,
        route: Array<[number, number]>,
        vehicleIndex: number
    ): Array<any> {
        const data: Array<any> = [];

        route.forEach((position, index) => {
            const timestamp = new Date(startTime.getTime() + (index * intervalMs));
            const [lon, lat] = position;
            const speed = 20 + Math.random() * 40;
            const fuel = Math.max(10, 100 - (index * 0.5) + (Math.random() - 0.5) * 5); // Decreasing fuel
            const engineTemp = 85 + Math.random() * 10;
            const odometer = 15000 + (index * 0.1);

            data.push({
                timestamp: timestamp,
                longitude: lon,
                latitude: lat,
                speed: speed,
                fuel: fuel,
                engineTemp: engineTemp,
                odometer: odometer,
                status: index % 10 === 0 ? 'stopped' : 'moving',
                driver: ['John Smith', 'Sarah Johnson', 'Mike Wilson'][vehicleIndex]
            });
        });

        return data;
    }

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
    center: [153.021072, -27.470125],
    zoom: 15,
    tilesetId: "microsoft.base.road",
    theme: 'light'
});
\`\`\`

                `
            }
        }
    },
    args: {
        subscriptionKey: 'demo-key-required', // Default shared value
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
            table: { defaultValue: { summary: '[153.021072, -27.470125]' } }
        },
        zoom: {
            control: { type: 'range', min: 1, max: 20, step: 1 },
            description: 'Map zoom level (matches your example zoom=15)'
        },
        speed: {
            control: { type: 'range', min: 200, max: 5000, step: 100 },
            description: 'Playback speed in milliseconds (lower = faster)'
        }
    }
}

export default meta;

type Story = StoryObj<IGeoProcessGraphicOptions>;

function generateSampleGeoData(): IGeoTsqExpression[] {
    const vehicles = [
        { id: "truck-001", name: "Delivery Truck Alpha", type: "truck" },
        { id: "van-002", name: "Service Van Beta", type: "van" },
        { id: "car-003", name: "Patrol Car Gamma", type: "car" }
    ];

    const timeSpanStart = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
    const timeSpanEnd = new Date();

    return vehicles.map((vehicle, index) => {
        const tsqExpression = new TsqExpression(
            { timeSeriesId: [vehicle.id] },
            {
                longitude: { kind: "numeric", aggregation: { tsx: "avg($value)" } },
                latitude: { kind: "numeric", aggregation: { tsx: "avg($value)" } },
                speed: { kind: "numeric", aggregation: { tsx: "avg($value)" } },
                fuel: { kind: "numeric", aggregation: { tsx: "avg($value)" } },
                engineTemp: { kind: "numeric", aggregation: { tsx: "avg($value)" } },
                odometer: { kind: "numeric", aggregation: { tsx: "avg($value)" } }
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
        tsqExpression.image = ['🚛', '🚐', '🚗'][index];

        return tsqExpression;
    });
}

function renderGeoProcessGraphic(container: HTMLElement, options: IGeoProcessGraphicOptions = {} as any) {
    container.innerHTML = '';

    try {

        const geoChart = new MovingGeoProcessGraphic(container);
        const geoExpressions = generateSampleGeoData();

        const now = new Date();
        const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

        const chartOptions = {
            subscriptionKey: options.subscriptionKey || "demo-key",
            center: options.center || [153.021072, -27.470125], // Brisbane
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
            timeFrame: options.timeFrame || {
                from: twoHoursAgo,
                to: now
            },
            minutesPerInterval: options.minutesPerInterval,
            updateInterval: options.speed || 1000,
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

const geoStateManager = {
    sharedSubscriptionKey: 'demo-key-required',
    lastValidKey: null as string | null,

    updateKey(newKey: string): void {
        if (newKey && newKey !== 'demo-key-required') {
            this.sharedSubscriptionKey = newKey;
            this.lastValidKey = newKey;

        }
    },

    getEffectiveKey(storyKey: string): string {
        if (storyKey && storyKey !== 'demo-key-required') {
            this.updateKey(storyKey);
            return storyKey;
        }
        return this.lastValidKey || this.sharedSubscriptionKey;
    }
};

function createGeoStory(containerStyle: string, storyName?: string) {
    return (args: IGeoProcessGraphicOptions) => {

        const chartId = `geo-chart-${Math.random().toString(36).substring(7)}`;

        const effectiveSubscriptionKey = geoStateManager.getEffectiveKey(args.subscriptionKey);

        const effectiveArgs = {
            ...args,
            subscriptionKey: effectiveSubscriptionKey
        };

        setTimeout(() => {
            const container = document.getElementById(chartId);
            if (container) {
                renderGeoProcessGraphic(container, effectiveArgs);
            }
        }, 50);

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
        subscriptionKey: 'demo-key-required',
        theme: 'light',
        tilesetId: 'microsoft.base.road',
        center: [153.021072, -27.470125],
        zoom: 12,
        speed: 1000
    },
    render: createGeoStory('height: 600px; width: 100%; border: 1px solid #ddd; border-radius: 8px;', 'Vehicle Tracking')
};

export const DarkTheme: Story = {
    name: 'Dark Theme',
    args: {
        subscriptionKey: 'demo-key-required',
        theme: 'dark',
        tilesetId: 'microsoft.base.darkgrey',
        center: [153.021072, -27.470125],
        zoom: 12,
        speed: 1000
    },
    render: createGeoStory('height: 600px; width: 100%; background: #1a1a1a; border: 1px solid #444; border-radius: 8px;', 'Dark Theme')
};

export const HighZoom: Story = {
    name: 'Detailed View (High Zoom)',
    args: {
        subscriptionKey: 'demo-key-required',
        theme: 'light',
        tilesetId: 'microsoft.imagery',
        center: [153.021072, -27.470125],
        zoom: 15,
        speed: 500
    },
    render: createGeoStory('height: 600px; width: 100%; border: 1px solid #ddd; border-radius: 8px;', 'High Zoom')
};

export const FastPlayback: Story = {
    name: 'Fast Playback',
    args: {
        subscriptionKey: 'demo-key-required',
        theme: 'light',
        tilesetId: 'microsoft.base.hybrid',
        center: [153.021072, -27.470125],
        zoom: 10,
        speed: 500
    },
    render: createGeoStory('height: 600px; width: 100%; border: 1px solid #ddd; border-radius: 8px;', 'Fast Playback'),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await waitFor(() => {
            const mapContainer = canvasElement.querySelector('.tsi-geoProcessGraphicMap');
            if (!mapContainer) throw new Error("Map container not rendered");
        }, { timeout: 5000 });

        await new Promise(resolve => setTimeout(resolve, 2000));

        const playButton = canvas.queryByRole('button', { name: /play/i }) ||
            canvasElement.querySelector('.tsi-play-button');
        if (playButton) {
            fireEvent.click(playButton);
        } else {
            console.warn('Play button not found');
        }

        setTimeout(() => {
            const markers = canvasElement.querySelectorAll('.tsi-geoprocess-marker');
            if (markers.length > 0) {
                fireEvent.click(markers[0]);
            }
        }, 3000);
    }
};