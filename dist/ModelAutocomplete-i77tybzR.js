import { _ as __extends } from './_tslib-B2CX7HIe.js';
import * as d3 from 'd3';
import 'awesomplete';
import { a as ChartOptions, C as Component } from './Component-C7RWgteh.js';
import { U as Utils } from './Utils-CKNrHyqc.js';

var ModelAutocomplete = /** @class */ (function (_super) {
    __extends(ModelAutocomplete, _super);
    function ModelAutocomplete(renderTarget) {
        var _this = _super.call(this, renderTarget) || this;
        _this.chartOptions = new ChartOptions(); // TODO handle onkeyup and oninput in chart options
        return _this;
    }
    ModelAutocomplete.prototype.render = function (environmentFqdn, getToken, chartOptions) {
        var _this = this;
        this.chartOptions.setOptions(chartOptions);
        var targetElement = d3.select(this.renderTarget);
        targetElement.html("");
        var wrapper = targetElement
            .append("div")
            .attr("class", "tsi-modelAutocompleteWrapper");
        _super.prototype.themify.call(this, wrapper, this.chartOptions.theme);
        var inputWrapper = wrapper.append("div").attr("class", "tsi-search");
        inputWrapper.append("i").classed("tsi-search-icon", true);
        var input = inputWrapper
            .append("input")
            .attr("class", "tsi-searchInput")
            .attr("aria-label", this.getString("Search Time Series Instances"))
            .attr("aria-describedby", "tsi-search-desc")
            .attr("role", "combobox")
            .attr("aria-owns", "tsi-search-results")
            .attr("aria-expanded", "false")
            .attr("aria-haspopup", "listbox")
            .attr("placeholder", this.getString("Search Time Series Instances") + "...");
        var clear = inputWrapper
            .append("div")
            .attr("class", "tsi-clear")
            .attr("tabindex", "0")
            .attr("role", "button")
            .attr("aria-label", "Clear Search")
            .on("click keydown", function (event) {
            if (Utils.isKeyDownAndNotEnter(event)) {
                return;
            }
            input.node().value = "";
            noSuggest = true;
            input.dispatch("input");
            self.ap.close();
            d3.select(this).classed("tsi-shown", false);
        });
        inputWrapper
            .append("span")
            .attr("id", "tsi-search-desc")
            .style("display", "none")
            .text(this.getString("Search suggestion instruction"));
        inputWrapper
            .append("div")
            .attr("class", "tsi-search-results-info")
            .attr("aria-live", "assertive");
        var Awesomplete = window.Awesomplete;
        this.ap = new Awesomplete(input.node(), { minChars: 1 });
        var noSuggest = false;
        var justAwesompleted = false;
        input.node().addEventListener("awesomplete-selectcomplete", function (event) {
            noSuggest = true;
            input.dispatch("input");
            _this.ap.close();
            justAwesompleted = true;
        });
        input.on("keydown", function (event) {
            _this.chartOptions.onKeydown(event, _this.ap);
        });
        input.node().addEventListener("keyup", function (event) {
            if (justAwesompleted) {
                justAwesompleted = false;
                return;
            }
            var key = event.which || event.keyCode;
            if (key === 13) {
                noSuggest = true;
                input.dispatch("input");
            }
        });
        var searchText;
        var self = this;
        input.on("input", function (event) {
            searchText = this.value;
            if (searchText.replace(/ /g, "") && !noSuggest) ;
            else {
                self.ap.close();
            }
            self.chartOptions.onInput(searchText, noSuggest ? { which: 13 } : event);
            noSuggest = false;
            clear.classed("tsi-shown", searchText.length);
        });
    };
    return ModelAutocomplete;
}(Component));

export { ModelAutocomplete as M };
