import * as d3 from "d3";
import "./ProcessGraphic.scss";
import HistoryPlayback, {
  GraphicInfo,
} from "./../../components/HistoryPlayback";
import Utils from "../../utils";
import TsqExpression from "../../models/TsqExpression";
import { TsqRange } from "../../models/TsqRange";
import PlaybackControls from "../../components/PlaybackControls";

class ProcessGraphic extends HistoryPlayback {
  private graphicSrc: string;
  constructor(renderTarget: Element) {
    super(renderTarget);
    this.currentCancelTrigger = null;
  }

  render(
    graphicSrc: string,
    data: Array<TsqExpression>,
    chartOptions
  ) {
    this.graphicSrc = graphicSrc;

    // Initialize component structure
    this.cleanup();
    this.initializeComponent();

    // Set up expressions and options
    this.tsqExpressions = data;
    this.chartOptions.setOptions(chartOptions);
    this.playbackRate = this.chartOptions.updateInterval || this.defaultPlaybackRate;

    // Initialize availability for playback controls
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    this.availability = new TsqRange(oneDayAgo, now);
    this.availability.setNeatBucketSizeByNumerOfBuckets(this.numberOfBuckets);
    this.availability.alignWithServerEpoch();

    // Initialize playback controls
    this.playbackControls = new PlaybackControls(this.playbackControlsContainer.node() as Element);

    // Load the image and render
    this.loadResources()
      .then(() => this.draw())
      .catch((error) => {
        console.error('Failed to load process graphic:', error);
        this.showErrorMessage('Failed to load process diagram image');
      });
  }

  private cleanup(): void {
    if (this.targetElement) {
      this.targetElement.selectAll("*").remove();
    }
  }

  private initializeComponent(): void {
    this.targetElement = d3.select(this.renderTarget);
    this.targetElement.selectAll("*").remove();

    this.componentContainer = this.targetElement
      .append("div")
      .attr("class", "tsi-processGraphicContainer");

    this.component = this.componentContainer
      .append("div")
      .attr("class", "tsi-processGraphic");

    this.playbackControlsContainer = this.targetElement
      .append("div")
      .attr("class", "tsi-playbackControlsContainer");
  }

  private showErrorMessage(message: string): void {
    if (this.component) {
      this.component
        .selectAll("*")
        .remove();
      this.component
        .append("div")
        .style("color", "red")
        .style("padding", "16px")
        .style("text-align", "center")
        .text(message);
    }
  }

  private onSelecTimestamp(timeStamp: Date) {
    const mockResults = this.getMockDataForTimestamp(timeStamp);
    this.getDataPoints(mockResults);
  }

  private getMockDataForTimestamp(timeStamp: Date): Array<any> {
    // Return mock data matching your expressions
    return this.tsqExpressions.map((expr, index) => {
      const baseValues = [45, 80, 65]; // Compressor, Pump, Valve base values
      const variance = [10, 15, 8];
      const value = baseValues[index] + (Math.random() - 0.5) * variance[index];

      return {
        properties: [
          {
            values: [Math.max(0, value)]
          }
        ]
      };
    });
  }

  protected loadResources(): Promise<GraphicInfo> {
    return new Promise((resolve, reject) => {
      let image = new Image();

      image.onload = () => {
        this.graphic = image;
        this.graphicOriginalWidth = image.width;
        this.graphicOriginalHeight = image.height;

        (this.component.node() as any).appendChild(this.graphic);

        resolve(null);
      };

      image.onerror = (errorMessage) => {
        console.log(errorMessage);
        reject(errorMessage);
      };

      image.src = this.graphicSrc;
    });
  }

  protected draw() {
    let graphicContainerWidth = this.renderTarget.clientWidth;
    let graphicContainerHeight =
      this.renderTarget.clientHeight - this.playbackSliderHeight;

    this.componentContainer
      .style("width", `${graphicContainerWidth}px`)
      .style("height", `${graphicContainerHeight}px`);

    let resizedImageDim = this.getResizedImageDimensions(
      graphicContainerWidth,
      graphicContainerHeight,
      this.graphicOriginalWidth,
      this.graphicOriginalHeight
    );

    this.component
      .style("width", `${resizedImageDim.width}px`)
      .style("height", `${resizedImageDim.height}px`);

    this.playbackControlsContainer
      .style("width", `${this.renderTarget.clientWidth}px`)
      .style("height", `${this.playbackSliderHeight}px`);

    this.playbackControls.render(
      this.availability.from,
      this.availability.to,
      this.onSelecTimestamp,  // Pass the callback here
      this.chartOptions,
      {
        intervalMillis: this.playbackRate,
        stepSizeMillis: this.availability.bucketSizeMillis,
      }
    );
  }

  private getResizedImageDimensions(
    containerWidth: number,
    containerHeight: number,
    imageWidth: number,
    imageHeight: number
  ) {
    if (containerWidth >= imageWidth && containerHeight >= imageHeight) {
      return {
        width: imageWidth,
        height: imageHeight,
      };
    }

    let widthFactor = containerWidth / imageWidth;
    let heightFactor = containerHeight / imageHeight;
    let resizeFactor = Math.min(widthFactor, heightFactor);

    return {
      width: imageWidth * resizeFactor,
      height: imageHeight * resizeFactor,
    };
  }

  protected getDataPoints(results: Array<IProcessGraphicLabelInfo>) {
    if (Array.isArray(results)) {
      let dataPoints = results.map((r, i): IProcessGraphicLabelInfo => {
        let value = this.parseTsqResponse(r);
        let color =
          typeof this.tsqExpressions[i].color === "function"
            ? (<Function>this.tsqExpressions[i].color)(value)
            : this.tsqExpressions[i].color;
        return {
          value,
          alias: this.tsqExpressions[i].alias,
          x: this.tsqExpressions[i].positionX,
          y: this.tsqExpressions[i].positionY,
          color: this.sanitizeAttribute(color),
          onClick: this.tsqExpressions[i].onElementClick,
        };
      });
      this.updateDataMarkers(dataPoints);
    }
  }
  protected updateDataMarkers(graphicValues: Array<IProcessGraphicLabelInfo>) {
    let textElements = this.component
      .selectAll<HTMLDivElement, unknown>("div")
      .data(graphicValues);

    let newElements = textElements
      .enter()
      .append("div")
      .classed("tsi-process-graphic-label", true);

    newElements.append("div").classed("title", true);

    newElements.append("div").classed("value", true);

    newElements
      .merge(textElements)
      .classed("tsi-dark", false)
      .classed("tsi-light", false)
      .classed(Utils.getTheme(this.chartOptions.theme), true)
      .style("left", (tsqe) => `${tsqe.x}%`)
      .style("top", (tsqe) => `${tsqe.y}%`);

    // Trigger glow css animation when values update.
    const highlightCssClass = "tsi-label-highlight";

    this.component
      .selectAll(".tsi-process-graphic-label")
      .data(graphicValues)
      .classed(highlightCssClass, true)
      .classed("clickable", (tsqe) => tsqe.onClick !== null)
      .on("animationend", function () {
        d3.select(this).classed(highlightCssClass, false);
      })
      .on("click", (event, tsqe) => {
        if (typeof tsqe.onClick === "function") {
          tsqe.onClick({
            timeStamp: this.playbackControls.currentTimeStamp,
            value: tsqe.value,
            color: tsqe.color,
          });
        }
      });

    this.component
      .selectAll(".title")
      .data(graphicValues)
      .text((tsqe) => tsqe.alias || "");

    this.component
      .selectAll(".value")
      .data(graphicValues)
      .text((tsqe) =>
        tsqe.value !== null ? Utils.formatYAxisNumber(tsqe.value) : "--"
      )
      .style("color", (tsqe) => tsqe.color);
  }

  protected parseTsqResponse(response) {
    return response &&
      response.properties &&
      response.properties[0] &&
      response.properties[0].values
      ? response.properties[0].values[0]
      : null;
  }

  protected sanitizeAttribute(str) {
    let sanitized = String(str);
    let illegalChars = ['"', "'", "?", "<", ">", ";"];
    illegalChars.forEach((c) => {
      sanitized = sanitized.split(c).join("");
    });

    return sanitized;
  }
}

interface IProcessGraphicLabelInfo {
  value: number;
  alias: string;
  x: number;
  y: number;
  color: string;
  onClick: Function;
}

export default ProcessGraphic;
