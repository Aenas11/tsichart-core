import { _ as __extends } from './_tslib-B2CX7HIe.js';
import * as d3 from 'd3';
import { D as DateTimeButton } from './DateTimeButton-XpwTTVod.js';
import { S as SingleDateTimePicker } from './SingleDateTimePicker-DWOzjfxN.js';

var DateTimeButtonSingle = /** @class */ (function (_super) {
    __extends(DateTimeButtonSingle, _super);
    function DateTimeButtonSingle(renderTarget) {
        var _this = _super.call(this, renderTarget) || this;
        _this.sDTPOnSet = function (millis) {
            if (millis === void 0) { millis = null; }
            if (millis !== null) {
                _this.dateTimeButton.text(_this.buttonDateTimeFormat(millis));
                _this.selectedMillis = millis;
                _this.onSet(millis);
            }
            _this.closeSDTP();
        };
        return _this;
    }
    DateTimeButtonSingle.prototype.closeSDTP = function () {
        this.dateTimePickerContainer.style("display", "none");
        this.dateTimeButton.node().focus();
    };
    DateTimeButtonSingle.prototype.render = function (chartOptions, minMillis, maxMillis, selectedMillis, onSet) {
        var _this = this;
        if (chartOptions === void 0) { chartOptions = {}; }
        if (selectedMillis === void 0) { selectedMillis = null; }
        if (onSet === void 0) { onSet = null; }
        _super.prototype.render.call(this, chartOptions, minMillis, maxMillis, onSet);
        this.selectedMillis = selectedMillis;
        d3.select(this.renderTarget).classed('tsi-dateTimeContainerSingle', true);
        this.dateTimeButton.text(this.buttonDateTimeFormat(selectedMillis));
        if (!this.dateTimePicker) {
            this.dateTimePicker = new SingleDateTimePicker(this.dateTimePickerContainer.node());
        }
        var targetElement = d3.select(this.renderTarget);
        (targetElement.select(".tsi-dateTimePickerContainer")).selectAll("*");
        this.dateTimeButton.on("click", function () {
            _this.chartOptions.dTPIsModal = true;
            _this.dateTimePickerContainer.style("display", "block");
            _this.dateTimePicker.render(_this.chartOptions, _this.minMillis, _this.maxMillis, _this.selectedMillis, _this.sDTPOnSet);
        });
    };
    return DateTimeButtonSingle;
}(DateTimeButton));

export { DateTimeButtonSingle as D };
