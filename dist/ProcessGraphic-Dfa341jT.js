import { _ as __extends } from './_tslib-B2CX7HIe.js';
import * as d3 from 'd3';
import { H as HistoryPlayback } from './HistoryPlayback-CXQAwBIt.js';
import { U as Utils } from './Utils-CKNrHyqc.js';

var ProcessGraphic = /** @class */ (function (_super) {
    __extends(ProcessGraphic, _super);
    function ProcessGraphic(renderTarget) {
        var _this = _super.call(this, renderTarget) || this;
        _this.currentCancelTrigger = null;
        return _this;
    }
    ProcessGraphic.prototype.render = function (environmentFqdn, getToken, graphicSrc, data, chartOptions) {
        this.graphicSrc = graphicSrc;
        this.renderBase(environmentFqdn, getToken, data, chartOptions);
    };
    ProcessGraphic.prototype.loadResources = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var image = new Image();
            image.onload = function () {
                _this.graphic = image;
                _this.graphicOriginalWidth = image.width;
                _this.graphicOriginalHeight = image.height;
                _this.component.node().appendChild(_this.graphic);
                resolve(null);
            };
            image.onerror = function (errorMessage) {
                console.log(errorMessage);
                reject(errorMessage);
            };
            image.src = _this.graphicSrc;
        });
    };
    ProcessGraphic.prototype.draw = function () {
        var graphicContainerWidth = this.renderTarget.clientWidth;
        var graphicContainerHeight = this.renderTarget.clientHeight - this.playbackSliderHeight;
        this.componentContainer
            .style("width", "".concat(graphicContainerWidth, "px"))
            .style("height", "".concat(graphicContainerHeight, "px"));
        var resizedImageDim = this.getResizedImageDimensions(graphicContainerWidth, graphicContainerHeight, this.graphicOriginalWidth, this.graphicOriginalHeight);
        this.component
            .style("width", "".concat(resizedImageDim.width, "px"))
            .style("height", "".concat(resizedImageDim.height, "px"));
        this.drawBase();
    };
    ProcessGraphic.prototype.getResizedImageDimensions = function (containerWidth, containerHeight, imageWidth, imageHeight) {
        if (containerWidth >= imageWidth && containerHeight >= imageHeight) {
            return {
                width: imageWidth,
                height: imageHeight,
            };
        }
        // Calculate the factor we would need to multiply width by to make it fit in the container.
        // Do the same for height. The smallest of those two corresponds to the largest size reduction
        // needed. Multiply both width and height by the smallest factor to a) ensure we maintain the
        // aspect ratio of the image b) ensure the image fits inside the container.
        var widthFactor = containerWidth / imageWidth;
        var heightFactor = containerHeight / imageHeight;
        var resizeFactor = Math.min(widthFactor, heightFactor);
        return {
            width: imageWidth * resizeFactor,
            height: imageHeight * resizeFactor,
        };
    };
    ProcessGraphic.prototype.getDataPoints = function (results) {
        var _this = this;
        if (Array.isArray(results)) {
            var dataPoints = results.map(function (r, i) {
                var value = _this.parseTsqResponse(r);
                var color = typeof _this.tsqExpressions[i].color === "function"
                    ? _this.tsqExpressions[i].color(value)
                    : _this.tsqExpressions[i].color;
                return {
                    value: value,
                    alias: _this.tsqExpressions[i].alias,
                    x: _this.tsqExpressions[i].positionX,
                    y: _this.tsqExpressions[i].positionY,
                    color: _this.sanitizeAttribute(color),
                    onClick: _this.tsqExpressions[i].onElementClick,
                };
            });
            this.updateDataMarkers(dataPoints);
        }
    };
    ProcessGraphic.prototype.updateDataMarkers = function (graphicValues) {
        var _this = this;
        var textElements = this.component
            .selectAll("div")
            .data(graphicValues);
        var newElements = textElements
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
            .style("left", function (tsqe) { return "".concat(tsqe.x, "%"); })
            .style("top", function (tsqe) { return "".concat(tsqe.y, "%"); });
        // Trigger glow css animation when values update.
        var highlightCssClass = "tsi-label-highlight";
        this.component
            .selectAll(".tsi-process-graphic-label")
            .data(graphicValues)
            .classed(highlightCssClass, true)
            .classed("clickable", function (tsqe) { return tsqe.onClick !== null; })
            .on("animationend", function () {
            d3.select(this).classed(highlightCssClass, false);
        })
            .on("click", function (event, tsqe) {
            if (typeof tsqe.onClick === "function") {
                tsqe.onClick({
                    timeStamp: _this.playbackControls.currentTimeStamp,
                    value: tsqe.value,
                    color: tsqe.color,
                });
            }
        });
        this.component
            .selectAll(".title")
            .data(graphicValues)
            .text(function (tsqe) { return tsqe.alias || ""; });
        this.component
            .selectAll(".value")
            .data(graphicValues)
            .text(function (tsqe) {
            return tsqe.value !== null ? Utils.formatYAxisNumber(tsqe.value) : "--";
        })
            .style("color", function (tsqe) { return tsqe.color; });
    };
    ProcessGraphic.prototype.parseTsqResponse = function (response) {
        return response &&
            response.properties &&
            response.properties[0] &&
            response.properties[0].values
            ? response.properties[0].values[0]
            : null;
    };
    ProcessGraphic.prototype.sanitizeAttribute = function (str) {
        var sanitized = String(str);
        var illegalChars = ['"', "'", "?", "<", ">", ";"];
        illegalChars.forEach(function (c) {
            sanitized = sanitized.split(c).join("");
        });
        return sanitized;
    };
    return ProcessGraphic;
}(HistoryPlayback));

export { ProcessGraphic as P };
