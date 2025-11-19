import * as d3 from "d3";
import * as atlas from "../../../node_modules/azure-maps-control/dist/atlas.min.js";
import "./GeoProcessGraphic.scss";
import HistoryPlayback from "./../../components/HistoryPlayback";
import TsqExpression from "../../models/TsqExpression";
import { TsqRange } from "../../models/TsqRange.js";
import PlaybackControls from "../PlaybackControls";

class GeoProcessGraphic extends HistoryPlayback {
  private dataSource: atlas.source.DataSource;
  private azureMapsSubscriptionKey: string;
  private zoom: number;
  private width: number;
  private height: number;
  private theme: string;
  private center: Array<number>;
  private bearing: number;
  private pitch: number;
  private maxZoom: number;
  private minZoom: number;
  private duration: number;
  private map: atlas.Map;
  private tilesetId: string;
  private mapContainer: d3.Selection<d3.BaseType, unknown, null, undefined>;

  constructor(renderTarget: Element) {
    super(renderTarget);
    this.currentCancelTrigger = null;
  }

  render(
    data: Array<TsqExpression>,
    chartOptions
  ) {
    this.zoom = chartOptions.zoom || 10;
    this.center = chartOptions.center || [-122.33, 47.61];
    this.bearing = chartOptions.bearing || 0;
    this.pitch = chartOptions.pitch || 0;
    this.maxZoom = chartOptions.maxZoom || 20;
    this.minZoom = chartOptions.minZoom || 1;
    this.duration = chartOptions.duration || 2000;
    this.azureMapsSubscriptionKey = chartOptions.subscriptionKey;
    this.width = chartOptions.width || 800;
    this.height = chartOptions.height || 600;
    this.theme = chartOptions.theme || 'light';
    this.tilesetId = chartOptions.tilesetId || 'microsoft.base.road';

    this.cleanup();
    this.initializeComponent()
    this.initializeAvaibility(chartOptions);
    this.renderBase(data, chartOptions);
  }

  protected renderBase(data: Array<TsqExpression>, chartOptions: any) {
    this.tsqExpressions = data;
    this.chartOptions.setOptions(chartOptions);
    this.playbackRate = this.chartOptions.updateInterval || this.defaultPlaybackRate;

    this.playbackControls = new PlaybackControls(this.playbackControlsContainer.node() as Element);
    this.draw();
  }

  private initializeAvaibility(chartOptions: any): void {
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const timeFrame = chartOptions.timeFrame || {};
    this.availability = new TsqRange(
      timeFrame.from || twoHoursAgo,
      timeFrame.to || now
    )

    this.availability.setNeatBucketSizeByNumerOfBuckets(this.numberOfBuckets);
    this.availability.alignWithServerEpoch();
  }

  private cleanup(): void {
    if (this.map) {
      try {
        this.map.dispose();
        this.map = null;
      } catch (error) {
        console.warn('Error cleaning up map:', error);
      }
    }
    if (this.dataSource) {
      this.dataSource = null;
    }
    if (this.playbackControls) {
      this.pauseAvailabilityUpdates();
    }
  }

  private initializeComponent() {
    this.targetElement = d3.select(this.renderTarget);
    this.targetElement.selectAll("*").remove();

    this.componentContainer = this.targetElement
      .append("div")
      .attr("class", "tsi-geoProcessGraphicComponent");

    const totalHeight = this.height;
    const playbackHeight = this.playbackSliderHeight || 88;
    const mapHeight = totalHeight - playbackHeight;
    this.mapContainer = this.componentContainer
      .append("div")
      .classed("tsi-geoProcessGraphicMap", true)
      .style("width", `${this.width}px`)
      .style("height", `${mapHeight}px`)
      .style("position", "relative")
      .style("background", "#f0f0f0");
    this.component = this.mapContainer;

    this.playbackControlsContainer = this.componentContainer
      .append("div")
      .classed("tsi-playbackControlsContainer", true)
      .style("height", `${playbackHeight}px`);
  }

  protected loadResources(): Promise<any> {
    if (!this.azureMapsSubscriptionKey ||
      this.azureMapsSubscriptionKey === 'demo-key' ||
      this.azureMapsSubscriptionKey === 'demo-key-required') {
      console.warn('Valid Azure Maps subscription key required for live map functionality');
      return this.renderFallback();
    }

    return this.loadAzureMapsScript().then(() => {
      return this.initializeMap();
    }).catch((error) => {
      console.error('Failed to load Azure Maps:', error);
      return this.renderFallback();
    });
  }

  private loadAzureMapsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if Azure Maps is already loaded
      if (typeof window !== 'undefined' && (window as any).atlas) {
        resolve();
        return;
      }

      // Load Azure Maps CSS
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://atlas.microsoft.com/sdk/javascript/mapcontrol/3/atlas.min.css';
      document.head.appendChild(cssLink);

      // Load Azure Maps JS
      const script = document.createElement('script');
      script.src = 'https://atlas.microsoft.com/sdk/javascript/mapcontrol/3/atlas.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Azure Maps SDK'));
      document.head.appendChild(script);
    });
  }

  private initializeMap(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const mapElement = this.mapContainer.node() as HTMLElement;
        if (!mapElement) {
          throw new Error('Map container element not found');
        }

        const mapConfig: any = {
          center: this.center,
          zoom: this.zoom,
          style: this.getMapStyleForTileset(),
          authOptions: {
            authType: (window as any).atlas.AuthenticationType.subscriptionKey,
            subscriptionKey: this.azureMapsSubscriptionKey,
          }
        };

        this.map = new (window as any).atlas.Map(mapElement, mapConfig);

        // Handle map ready event
        this.map.events.add("ready", () => {
          try {
            this.initializeMapFeatures();
            resolve(null);
          } catch (error) {
            console.error('Error initializing map features:', error);
            reject(error);
          }
        });

        this.map.events.add("error", (error: any) => {
          console.error('Azure Maps error:', error);
          reject(error);
        });

        // Timeout protection
        setTimeout(() => {
          reject(new Error('Map initialization timeout - check subscription key'));
        }, 15000);

      } catch (error) {
        console.error('Error creating map:', error);
        reject(error);
      }
    });
  }

  // private getMapStyle(): string {
  //   // Map theme to Azure Maps style following component patterns
  //   switch (this.theme) {
  //     case 'dark':
  //       return 'night';
  //     case 'satellite':
  //       return 'satellite';
  //     case 'hybrid':
  //       return 'satellite_road_labels';
  //     default:
  //       return 'road';
  //   }
  // }

  private initializeMapFeatures(): void {
    if (!this.map || !this.tsqExpressions) return;
    this.applyMapStyle();
    this.dataSource = new (window as any).atlas.source.DataSource();
    this.map.sources.add(this.dataSource);

    // Create markers for each vehicle following D3.js data binding concepts
    this.tsqExpressions.forEach((tsqExpression: any, index: number) => {
      this.createVehicleMarker(tsqExpression, index);
    });

    // Set initial camera position
    this.map.setCamera({
      center: this.center,
      bearing: this.bearing,
      pitch: this.pitch,
      zoom: this.zoom,
      maxZoom: this.maxZoom,
      minZoom: this.minZoom,
      type: "fly",
      duration: this.duration,
    });
  }

  private applyMapStyle(): void {
    try {
      const style = this.getMapStyleForTileset();
      this.map.setStyle(style);

    } catch (error) {
      console.error('Error applying map style:', error);
    }
  }

  private createVehicleMarker(tsqExpression: any, index: number): void {
    // Create popup following component patterns
    const popup = new (window as any).atlas.Popup({
      content: `<div class="tsi-gpgPopUp" id="tsi-popup${index}">
        <div class="tsi-popup-title">${tsqExpression.alias || `Vehicle ${index + 1}`}</div>
        <div class="tsi-popup-content">Loading data...</div>
      </div>`,
      pixelOffset: [0, -30],
      closeButton: true
    });

    // Create HTML marker with custom styling
    const marker = new (window as any).atlas.HtmlMarker({
      htmlContent: this.createMarkerHtml(tsqExpression, index),
      position: this.center, // Start at map center
      popup: popup,
      draggable: false
    });

    // Add marker and popup to map
    this.map.markers.add(marker);
    this.map.popups.add(popup);

    // Add click event following component event patterns
    this.map.events.add("click", marker, () => {
      marker.togglePopup();
    });
  }

  private getMapStyleForTileset(): string {
    switch (this.tilesetId) {
      case 'microsoft.base.darkgrey':
        return 'night';
      case 'microsoft.imagery':
        return 'satellite';
      case 'microsoft.base.hybrid':
        return 'satellite_road_labels';
      case 'microsoft.base.road':
      default:
        return 'road';
    }
  }

  private createMarkerHtml(tsqExpression: any, index: number): string {
    return `
      <div class="tsi-geoprocess-marker" style="
        position: relative;
        width: 40px;
        height: 40px;
        cursor: pointer;
        transform: translate(-50%, -50%);
      ">
        <div style="
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          background: ${['#ff6b6b', '#4ecdc4', '#45b7d1'][index]};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        ">
          ${['🚛', '🚐', '🚗'][index]}
        </div>
        <div class="tsi-marker-pulse" style="
          position: absolute;
          top: -2px;
          left: -2px;
          width: calc(100% + 4px);
          height: calc(100% + 4px);
          border-radius: 50%;
          background: rgba(66, 153, 225, 0.3);
          animation: tsi-pulse 2s infinite;
        "></div>
      </div>
    `;
  }

  private renderFallback(): Promise<any> {
    const container = this.mapContainer.node() as HTMLElement;
    container.innerHTML = `
      <div class="tsi-geo-fallback" style="
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${this.theme === 'dark' ? '#2d3748' : '#f8f9fa'};
        color: ${this.theme === 'dark' ? '#e2e8f0' : '#4a5568'};
        border-radius: 8px;
        font-family: 'Segoe UI', sans-serif;
        border: 2px dashed #cbd5e0;
      ">
        <div style="text-align: center; padding: 20px;">
          <div style="font-size: 3em; margin-bottom: 16px;">🗺️</div>
          <h3 style="margin: 0 0 12px 0;">Azure Maps Required</h3>
          <p style="margin: 0 0 16px 0;">Please provide a valid Azure Maps subscription key</p>
          <p style="font-family: monospace; font-size: 0.9em; opacity: 0.7;">
            Key status: ${this.azureMapsSubscriptionKey || 'None provided'}
          </p>
        </div>
      </div>
    `;
    return Promise.resolve();
  }

  protected draw() {
    return this.loadResources().then(() => {
      this.drawBase()
    }).catch((error) => {
      console.error('Failed to load resources:', error);
      return this.renderFallback();
    });
  }

  protected getDataPoints(results: Array<IGeoProcessGraphicLabelInfo>) {
    const dataPoints = results.map((r) => this.parseTsqResponse(r));
    this.updateDataMarkers(dataPoints);
  }

  protected parseTsqResponse(response) {
    let parsedResponse: any = {};
    if (response && response.properties) {
      response.properties.forEach((prop: any) => {
        if (prop && prop.name && prop.values) {
          parsedResponse[prop.name] = prop.values[0];
        }
      });
    }
    return parsedResponse;
  }

  protected updateDataMarkers(dataPoints: Array<any>) {
    if (!this.map) return;

    const markers = this.map.markers.getMarkers();
    const popups = this.map.popups.getPopups();

    dataPoints.forEach((dataPoint, i) => {
      if (i < markers.length && this.tsqExpressions[i]) {
        const tsqExpression = this.tsqExpressions[i] as any;

        // Extract position data using configured variable names
        const lat = dataPoint[tsqExpression.positionYVariableName];
        const lon = dataPoint[tsqExpression.positionXVariableName];

        if (lat !== undefined && lon !== undefined) {
          // Update marker position (Azure Maps expects [longitude, latitude])
          markers[i].setOptions({ position: [lon, lat] });

          // Update popup content
          popups[i].setOptions({
            position: [lon, lat],
            content: this.createPopupContent(dataPoint, i)
          });
        }
      }
    });
  }

  private createPopupContent(dataPoint: any, index: number): string {
    const entries = Object.entries(dataPoint);
    const tsqExpression = this.tsqExpressions[index] as any;

    const tableRows = entries.map(([key, value]) => {
      const displayValue = typeof value === 'number' ? (value as number).toFixed(5) : String(value);
      return `
        <tr>
          <td style="padding: 4px 8px; font-weight: 500;">${key}</td>
          <td style="padding: 4px 8px; font-family: monospace;">${displayValue}</td>
        </tr>
      `;
    }).join('');

    return `
      <div class="tsi-gpgTooltip tsi-${this.theme}" style="
        font-family: 'Segoe UI', sans-serif;
        font-size: 12px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        padding: 12px;
        min-width: 200px;
      ">
        <div style="font-weight: 600; margin-bottom: 8px; font-size: 14px;">
          ${tsqExpression.alias || `Vehicle ${index + 1}`}
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          ${tableRows}
        </table>
      </div>
    `;
  }
}

interface IGeoProcessGraphicLabelInfo { }
export default GeoProcessGraphic;
