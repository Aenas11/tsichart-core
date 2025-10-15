import { _ as __extends } from './_tslib-B2CX7HIe.js';
import * as d3 from 'd3';
import { D as DateTimeButton } from './DateTimeButton-XpwTTVod.js';
import { D as DateTimePicker } from './DateTimePicker-D7E-_kAs.js';
import { U as Utils } from './Utils-CKNrHyqc.js';

var DateTimeButtonRange = /** @class */ (function (_super) {
    __extends(DateTimeButtonRange, _super);
    function DateTimeButtonRange(renderTarget) {
        return _super.call(this, renderTarget) || this;
    }
    DateTimeButtonRange.prototype.setButtonText = function (fromMillis, toMillis, isRelative, quickTime) {
        var fromString = this.buttonDateTimeFormat(fromMillis);
        var tzAbbr = Utils.createTimezoneAbbreviation(this.chartOptions.offset);
        var toString = this.buttonDateTimeFormat(toMillis) + ' (' + tzAbbr + ')';
        if (!isRelative) {
            this.dateTimeButton.text("".concat(fromString, " - ").concat(toString));
            this.dateTimeButton.attr('aria-label', "".concat(this.getString('a button to launch a time selection dialog current selected time is '), " ").concat(fromString, " - ").concat(toString));
        }
        else {
            var quickTimeText = this.dateTimePicker.getQuickTimeText(quickTime);
            var text = quickTimeText !== null ? "".concat(quickTimeText, " (").concat(fromString, " - ").concat(toString, ")") : "".concat(fromString, " - ").concat(this.getString('Latest'), " (").concat(toString, ")");
            this.dateTimeButton.text(text);
            this.dateTimeButton.attr('aria-label', "".concat(this.getString('a button to launch a time selection dialog current selected time is '), " ").concat(text));
        }
    };
    DateTimeButtonRange.prototype.onClose = function () {
        this.dateTimePickerContainer.style("display", "none");
        this.dateTimeButton.node().focus();
    };
    DateTimeButtonRange.prototype.render = function (chartOptions, minMillis, maxMillis, fromMillis, toMillis, onSet, onCancel) {
        var _this = this;
        if (chartOptions === void 0) { chartOptions = {}; }
        if (fromMillis === void 0) { fromMillis = null; }
        if (toMillis === void 0) { toMillis = null; }
        if (onSet === void 0) { onSet = null; }
        if (onCancel === void 0) { onCancel = null; }
        _super.prototype.render.call(this, chartOptions, minMillis, maxMillis, onSet);
        d3.select(this.renderTarget).classed('tsi-dateTimeContainerRange', true);
        this.fromMillis = fromMillis;
        this.toMillis = toMillis;
        this.onCancel = onCancel ? onCancel : function () { };
        if (!this.dateTimePicker) {
            this.dateTimePicker = new DateTimePicker(this.dateTimePickerContainer.node());
        }
        this.setButtonText(fromMillis, toMillis, toMillis === maxMillis, this.toMillis - this.fromMillis);
        this.dateTimeButton.on("click", function () {
            if (_this.dateTimePickerContainer.style("display") !== "none") {
                _this.onClose(); // close if already open
            }
            else {
                _this.chartOptions.dTPIsModal = true;
                _this.dateTimePickerContainer.style("display", "block");
                _this.dateTimePicker.render(_this.chartOptions, minMillis, maxMillis, _this.fromMillis, _this.toMillis, function (fromMillis, toMillis, offset, isRelative, currentQuickTime) {
                    _this.chartOptions.offset = offset;
                    _this.fromMillis = fromMillis;
                    _this.toMillis = toMillis;
                    _this.setButtonText(fromMillis, toMillis, isRelative, currentQuickTime);
                    _this.onSet(fromMillis, toMillis, offset, isRelative, currentQuickTime);
                    _this.onClose();
                }, function () {
                    _this.onClose();
                    _this.onCancel();
                });
            }
        });
    };
    return DateTimeButtonRange;
}(DateTimeButton));

export { DateTimeButtonRange as D };
