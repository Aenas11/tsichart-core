import * as d3 from "d3";
import { Component } from "./../../interfaces/Component";
import PlaybackControls from "../PlaybackControls";
import { TsqRange } from "../../models/TsqRange";
import TsqExpression from "../../models/TsqExpression";

type d3Selection = d3.Selection<d3.BaseType, unknown, null, undefined>;

export interface GraphicInfo {
  graphic: any;
  width: number;
  height: number;
}

abstract class HistoryPlayback extends Component {
  protected targetElement: d3Selection;
  protected tsqExpressions: Array<TsqExpression>;
  protected componentContainer: d3Selection;
  protected component: d3Selection;
  protected playbackControlsContainer: d3Selection;
  protected playbackControls: PlaybackControls;
  protected graphicOriginalWidth: number;
  protected graphicOriginalHeight: number;
  protected currentCancelTrigger: Function;
  protected availabilityInterval: number;
  protected environmentFqdn: string;
  protected availability: TsqRange;
  protected getAuthToken: () => Promise<string>;
  protected playbackRate: number;
  protected graphic: any;

  readonly numberOfBuckets = 1000;
  readonly defaultPlaybackRate = 3000; // 3 seconds
  readonly fetchAvailabilityFrequency = 30000; // 30 seconds
  readonly playbackSliderHeight = 88;
  readonly previewApiFlag = "?api-version=2018-11-01-preview";

  constructor(renderTarget: Element) {
    super(renderTarget);
    this.currentCancelTrigger = null;
  }

  protected abstract loadResources(): Promise<any>;
  protected abstract draw();
  protected abstract updateDataMarkers(data: Array<any>): void;
  protected abstract getDataPoints(data: Array<any>): void;
  protected onGraphicLoaded(): void { }

  protected renderBase(
    environmentFqdn: string,
    getToken: () => Promise<string>,
    data: Array<TsqExpression>,
    chartOptions
  ) {
    this.environmentFqdn = environmentFqdn;
    this.getAuthToken = getToken;
    this.tsqExpressions = data;
    this.chartOptions.setOptions(chartOptions);
    this.playbackRate =
      this.chartOptions.updateInterval || this.defaultPlaybackRate;

  }

  pauseAvailabilityUpdates() {
    if (this.availabilityInterval) {
      window.clearInterval(this.availabilityInterval);
    }
  }

  private onSelecTimestamp(timeStamp: Date) {
    let queryWindow = this.calcQueryWindow(timeStamp);

    let tsqArray = this.tsqExpressions.map((tsqExpression) => {
      tsqExpression.searchSpan = {
        from: queryWindow.fromMillis,
        to: queryWindow.toMillis,
        bucketSize: queryWindow.bucketSize,
      };
      return tsqExpression.toTsq();
    });

    this.getAuthToken().then((authToken: string) => {

    });
  }

  private calcQueryWindow(timeStamp: Date) {
    let timelineOffset = this.availability.fromMillis;
    let queryToMillis: number =
      Math.ceil(
        (timeStamp.valueOf() - timelineOffset) /
        this.availability.bucketSizeMillis
      ) *
      this.availability.bucketSizeMillis +
      timelineOffset;

    return {
      fromMillis: queryToMillis - this.availability.bucketSizeMillis,
      toMillis: queryToMillis,
      bucketSize: this.availability.bucketSizeStr,
    };
  }

  protected drawBase() {
    this.playbackControlsContainer
      .style("width", `${this.renderTarget.clientWidth}px`)
      .style("height", `${this.playbackSliderHeight}px`);

    this.playbackControls.render(
      this.availability.from,
      this.availability.to,
      this.onSelecTimestamp.bind(this),
      this.chartOptions,
      {
        intervalMillis: this.playbackRate,
        stepSizeMillis: this.availability.bucketSizeMillis,
      }
    );
  }

  private updateAvailability(from: Date, to: Date) {
    this.availability = new TsqRange(from, to);

    if (
      this.chartOptions.bucketSizeMillis &&
      this.chartOptions.bucketSizeMillis > 0
    ) {
      this.availability.setNeatBucketSizeByRoughBucketSize(
        this.chartOptions.bucketSizeMillis
      );
    } else {
      this.availability.setNeatBucketSizeByNumerOfBuckets(this.numberOfBuckets);
    }

    this.availability.alignWithServerEpoch();
  }


}
export default HistoryPlayback;
