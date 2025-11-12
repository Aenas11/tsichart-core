import * as atlas from "../../../node_modules/azure-maps-control/dist/atlas.min.js";
import "./GeoProcessGraphic.scss";
import HistoryPlayback from "./../../components/HistoryPlayback";
import TsqExpression from "../../models/TsqExpression";

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

  constructor(renderTarget: Element) {
    super(renderTarget);
    this.currentCancelTrigger = null;
  }

  render(
    data: Array<TsqExpression>,
    chartOptions
  ) {
    this.zoom = chartOptions.zoom;
    this.center = chartOptions.center;
    this.bearing = chartOptions.bearing;
    this.pitch = chartOptions.pitch;
    this.maxZoom = chartOptions.maxZoom;
    this.minZoom = chartOptions.minZoom;
    this.duration = chartOptions.duration;
    this.azureMapsSubscriptionKey = chartOptions.subscriptionKey;
    this.width = chartOptions.width;
    this.height = chartOptions.height;
    this.theme = chartOptions.theme;
    this.tilesetId = chartOptions.tilesetId || 'microsoft.base.road';

    this.initializeComponent()

    this.renderBase(data, chartOptions);
  }

  private initializeComponent() {
    this.targetElement = d3.select(this.renderTarget);
    this.targetElement.selectAll("*").remove();

    this.componentContainer = this.targetElement
      .append("div")
      .attr("class", "tsi-geoProcessGraphicComponent");
    this.component = this.componentContainer
      .append("div")
      .attr("class", "tsi-geoProcessGraphicMap")
      .style("width", `${this.width}px`)
      .style("height", `${this.height}px`)
      .style("position", "relative");
    this.playbackControlsContainer = this.componentContainer
      .append("div")
      .attr("class", "tsi-playbackControlsContainer");
  }

  protected loadResources(): Promise<any> {
    if (!this.azureMapsSubscriptionKey || this.azureMapsSubscriptionKey === 'demo-key') {
      console.warn('Azure Maps subscription key required for live map functionality');
      return this.renderFallback();
    }
    (<HTMLElement>this.component.node()).style.width = `${this.width}px`;
    (<HTMLElement>this.component.node()).style.height = `${this.height}px`;

    this.map = new atlas.Map(<HTMLElement>this.component.node(), {
      center: this.center,
      zoom: this.zoom,
      style: this.getMapStyle(),
      authOptions: {
        authType: atlas.AuthenticationType.subscriptionKey,
        subscriptionKey: this.azureMapsSubscriptionKey,
      },
      sources: this.createCustomTileSource()
    });
    return new Promise((resolve, reject) => {
      this.map.events.add("ready", () => {
        try {
          this.initializeMapFeatures();
          resolve(null);
        } catch (error) {
          console.error('Error initializing map features:', error);
          reject(error);
        }
      });

      this.map.events.add("error", (error) => {
        console.error('Azure Maps error:', error);
        reject(error);
      });
    });

    // this.map.setCamera({
    //   center: this.center,
    //   bearing: this.bearing,
    //   pitch: this.pitch,
    //   zoom: this.zoom,
    //   maxZoom: this.maxZoom,
    //   minZoom: this.minZoom,
    //   type: "fly",
    //   duration: this.duration,
    // });
    // return Promise.resolve();
  }

  private getMapStyle(): string {
    switch (this.theme) {
      case 'dark':
        return 'night';
      case 'satellite':
        return 'satellite';
      case 'hybrid':
        return 'satellite_road_labels';
      default:
        return 'road';
    }
  }

  private createCustomTileSource(): { [key: string]: any } {
    return {
      'custom-tiles': {
        type: 'raster',
        tiles: [
          `https://atlas.microsoft.com/map/tile?subscription-key=${this.azureMapsSubscriptionKey}&api-version=2024-04-01&tilesetId=${this.tilesetId}&zoom={z}&x={x}&y={y}&tileSize=256`
        ],
        tileSize: 256,
        maxzoom: 22
      }
    };
  }

  private initializeMapFeatures(): void {
    this.dataSource = new atlas.source.DataSource();
    this.map.sources.add(this.dataSource);

    // Create markers for each vehicle following D3.js data binding patterns
    for (let i = 0; i < this.tsqExpressions.length; i++) {
      const tsqExpression = this.tsqExpressions[i];

      // Create popup with vehicle information
      let popup = new atlas.Popup({
        content: `<div class="tsi-gpgPopUp" id="tsi-popup${i}"></div>`,
        pixelOffset: [0, -30],
        closeButton: true
      });

      // Create HTML marker with custom styling
      let marker = new atlas.HtmlMarker({
        htmlContent: this.createMarkerHtml(tsqExpression, i),
        position: [0, 0], // Will be updated with real data
        popup: popup,
        draggable: false
      });

      this.map.markers.add(marker);
      this.map.popups.add(popup);

      // Add click event for popup interaction following component event patterns
      this.map.events.add("click", marker, () => {
        marker.togglePopup();
      });
    }

    // Set camera position with smooth animation
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

  private createMarkerHtml(tsqExpression: any, index: number): string {
    // Create marker HTML following component styling patterns
    return `
      <div class="tsi-geoprocess-graphic" style="
        position: relative;
        width: 40px;
        height: 40px;
        cursor: pointer;
        transform: translate(-50%, -50%);
      ">
        <img 
          class="tsi-gpgcircleImage" 
          id="tsi-htmlMarker${index}" 
          src="${tsqExpression.image}" 
          style="
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 2px solid #fff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            background: white;
          " 
          alt="${tsqExpression.alias || `Vehicle ${index + 1}`}"
        />
        <div class="tsi-marker-pulse" style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(66, 153, 225, 0.3);
          animation: tsi-pulse 2s infinite;
        "></div>
      </div>
    `;
  }
  private renderFallback(): Promise<any> {
    // Fallback rendering when Azure Maps is unavailable
    const container = <HTMLElement>this.component.node();
    container.innerHTML = `
      <div class="tsi-geo-fallback" style="
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${this.theme === 'dark' ? '#2d3748' : '#f7fafc'};
        color: ${this.theme === 'dark' ? '#e2e8f0' : '#4a5568'};
        border-radius: 8px;
        font-family: 'Segoe UI', sans-serif;
      ">
        <div style="text-align: center;">
          <div style="font-size: 3em; margin-bottom: 16px;">🗺️</div>
          <h3>Azure Maps Required</h3>
          <p>Valid subscription key needed for map functionality</p>
        </div>
      </div>
    `;
    return Promise.resolve();
  }

  protected draw() {
    this.drawBase();
  }

  protected getDataPoints(results: Array<IGeoProcessGraphicLabelInfo>) {
    let dataPoints = results.map((r): IGeoProcessGraphicLabelInfo => {
      return this.parseTsqResponse(r);
    });
    this.updateDataMarkers(dataPoints);
  }

  protected parseTsqResponse(response) {
    let parsedResponse = {};
    if (response && response.properties) {
      for (let i = 0; i < response.properties.length; i++) {
        const prop = response.properties[i];
        if (prop && prop.name && prop.values) {
          parsedResponse[prop.name] = prop.values[0];
        }
      }
    }
    return parsedResponse;
  }

  protected updateDataMarkers(dataPoints: Array<any>) {
    const markers = this.map.markers.getMarkers();
    const popups = this.map.popups.getPopups();

    for (let i = 0; i < dataPoints.length && i < markers.length; i++) {
      const tsqExpression = this.tsqExpressions[i];
      const dataPoint = dataPoints[i];

      // Extract position data using configured variable names
      const lat = dataPoint[tsqExpression.positionXVariableName];
      const lon = dataPoint[tsqExpression.positionYVariableName];

      if (lat !== undefined && lon !== undefined) {
        // Update marker position with smooth animation
        markers[i].setOptions({
          position: [lat, lon],
        });

        // Update popup content and position
        const dataPointArr = Object.entries(dataPoint);
        popups[i].setOptions({
          position: [lat, lon],
          content: this.createTooltipTable(dataPointArr, i),
        });
      }
    }
  }

  protected createTooltipTable(dataPointArr, idx) {
    const gpgTooltipDiv = document.createElement("div");
    gpgTooltipDiv.className = `tsi-gpgTooltip tsi-${this.theme}`;

    const gpgTooltipInnerDiv = document.createElement("div");
    gpgTooltipInnerDiv.className = "tsi-gpgTooltipInner";

    const gpgTooltipTitleDiv = document.createElement("div");
    gpgTooltipTitleDiv.className = "tsi-gpgTooltipTitle";
    const title = document.createTextNode(this.tsqExpressions[idx].alias || `Vehicle ${idx + 1}`);
    gpgTooltipTitleDiv.appendChild(title);

    const gpgTooltipTable = document.createElement("table");
    gpgTooltipTable.className = "tsi-gpgTooltipValues tsi-gpgTooltipTable";

    // Add data rows following D3.js data binding concepts
    dataPointArr.forEach(([key, value]) => {
      const spacer = document.createElement("tr");
      spacer.className = "tsi-gpgTableSpacer";
      gpgTooltipTable.appendChild(spacer);

      const gpgTooltipValueRow = document.createElement("tr");

      const gpgValueLabelCell = document.createElement("td");
      gpgValueLabelCell.className = "tsi-gpgValueLabel";
      gpgValueLabelCell.appendChild(document.createTextNode(key));

      const gpgValueCell = document.createElement("td");
      gpgValueCell.className = "tsi-gpgValueCell";
      const displayValue = typeof value === 'number' ? value.toFixed(5) : String(value);
      gpgValueCell.appendChild(document.createTextNode(displayValue));

      gpgTooltipValueRow.appendChild(gpgValueLabelCell);
      gpgTooltipValueRow.appendChild(gpgValueCell);
      gpgTooltipTable.appendChild(gpgTooltipValueRow);
    });

    gpgTooltipInnerDiv.appendChild(gpgTooltipTitleDiv);
    gpgTooltipInnerDiv.appendChild(gpgTooltipTable);
    gpgTooltipDiv.appendChild(gpgTooltipInnerDiv);
    return gpgTooltipDiv;
  }
}
interface IGeoProcessGraphicLabelInfo { }
export default GeoProcessGraphic;
