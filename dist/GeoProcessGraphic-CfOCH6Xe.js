import { _ as __extends } from './_tslib-B2CX7HIe.js';
import { H as HistoryPlayback } from './HistoryPlayback-CXQAwBIt.js';

var GeoProcessGraphic = /** @class */ (function (_super) {
    __extends(GeoProcessGraphic, _super);
    // private map: atlas.Map;
    function GeoProcessGraphic(renderTarget) {
        var _this = _super.call(this, renderTarget) || this;
        _this.currentCancelTrigger = null;
        return _this;
    }
    GeoProcessGraphic.prototype.render = function (environmentFqdn, getToken, data, chartOptions) {
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
        this.renderBase(environmentFqdn, getToken, data, chartOptions);
    };
    GeoProcessGraphic.prototype.loadResources = function () {
        this.component.node().style.width = "".concat(this.width, "px");
        this.component.node().style.height = "".concat(this.height, "px");
        // this.map = new atlas.Map(<HTMLElement>this.component.node(), {
        //   authOptions: {
        //     authType: atlas.AuthenticationType.subscriptionKey,
        //     subscriptionKey: this.azureMapsSubscriptionKey,
        //   },
        // });
        // this.map.events.add("ready", () => {
        //   this.dataSource = new atlas.source.DataSource();
        //   this.map.sources.add(this.dataSource);
        //   for (let i = 0; i < this.tsqExpressions.length; i++) {
        //     let popup = new atlas.Popup({
        //       content: `<div class = 'tsi-gpgPopUp id= tsi-popup${i}'></div>`,
        //       pixelOffset: [0, -30],
        //     });
        //     let marker = new atlas.HtmlMarker({
        //       htmlContent:
        //         `<div class = tsi-geoprocess-graphic> <img class='tsi-gpgcircleImage
        //       id= tsi-htmlMarker${i}' src= "` +
        //         this.tsqExpressions[i].image +
        //         '" /> </div>',
        //       position: [0, 0],
        //       popup: popup,
        //     });
        //     this.map.markers.add(marker);
        //     this.map.popups.add(popup);
        //     this.map.events.add("click", marker, () => {
        //       marker.togglePopup();
        //     });
        //   }
        // });
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
        return Promise.resolve();
    };
    GeoProcessGraphic.prototype.draw = function () {
        this.drawBase();
    };
    GeoProcessGraphic.prototype.getDataPoints = function (results) {
        // let dataPoints = results.map((r): IGeoProcessGraphicLabelInfo => {
        //   // return this.parseTsqResponse(r);
        // });
        // this.updateDataMarkers(dataPoints);
    };
    GeoProcessGraphic.prototype.parseTsqResponse = function (response) {
        var parsedResponse = {};
        if (response && response.properties) {
            for (var i = 0; i < response.properties.length; i++) {
                response.properties[i] &&
                    response.properties[i].name &&
                    response.properties[i].values
                    ? (parsedResponse[response.properties[i].name] =
                        response.properties[i].values[0])
                    : null;
            }
        }
        return parsedResponse;
    };
    GeoProcessGraphic.prototype.updateDataMarkers = function (dataPoints) {
        for (var i = 0; i < dataPoints.length; i++) {
            dataPoints[i][this.tsqExpressions[i].positionXVariableName];
            dataPoints[i][this.tsqExpressions[i].positionYVariableName];
            // this.map.markers.getMarkers()[i].setOptions({
            //   position: [lat, lon],
            // });
            // let dataPointArr = Object.entries(dataPoints[i]);
            // this.map.popups.getPopups()[i].setOptions({
            //   position: [lat, lon],
            //   content: this.createTable(dataPointArr, i),
            // });
        }
    };
    GeoProcessGraphic.prototype.createTable = function (dataPointArr, idx) {
        var gpgTooltipDiv = document.createElement("div");
        gpgTooltipDiv.className = "tsi-gpgTooltip tsi-" + this.theme;
        var gpgTooltipInnerDiv = document.createElement("div");
        gpgTooltipInnerDiv.className = "tsi-gpgTooltipInner";
        var gpgTooltipTitleDiv = document.createElement("div");
        gpgTooltipTitleDiv.className = "tsi-gpgTooltipTitle";
        var title = document.createTextNode(this.tsqExpressions[idx].alias);
        gpgTooltipTitleDiv.appendChild(title);
        var gpgTooltipTable = document.createElement("table");
        gpgTooltipTable.className = "tsi-gpgTooltipValues";
        gpgTooltipTable.classList.add("tsi-gpgTooltipTable");
        for (var i = 0; i < dataPointArr.length; i++) {
            var spacer = document.createElement("tr");
            spacer.className = "tsi-gpgTableSpacer";
            gpgTooltipTable.appendChild(spacer);
            var gpgTooltipValueRow = document.createElement("tr");
            var gpgValueLabelCell = document.createElement("td");
            gpgValueLabelCell.className = "tsi-gpgValueLabel";
            var labelName = document.createTextNode(dataPointArr[i][0]);
            gpgValueLabelCell.appendChild(labelName);
            gpgTooltipValueRow.appendChild(gpgValueLabelCell);
            var gpgValueCell = document.createElement("td");
            gpgValueCell.className = "tsi-gpgValueCell";
            var cellData = document.createTextNode(dataPointArr[i][1].toFixed(5));
            gpgValueCell.appendChild(cellData);
            gpgTooltipValueRow.appendChild(gpgValueCell);
            gpgTooltipTable.appendChild(gpgTooltipValueRow);
        }
        gpgTooltipInnerDiv.appendChild(gpgTooltipTitleDiv);
        gpgTooltipInnerDiv.appendChild(gpgTooltipTable);
        gpgTooltipDiv.appendChild(gpgTooltipInnerDiv);
        return gpgTooltipDiv;
    };
    return GeoProcessGraphic;
}(HistoryPlayback));

export { GeoProcessGraphic as G };
