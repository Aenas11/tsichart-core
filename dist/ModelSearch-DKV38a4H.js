import { _ as __extends, a as __assign } from './_tslib-B2CX7HIe.js';
import * as d3 from 'd3';
import { U as Utils } from './Utils-CKNrHyqc.js';
import { C as Component } from './Component-C7RWgteh.js';
import 'awesomplete';
import { H as Hierarchy } from './Hierarchy--fsFVZDf.js';
import { M as ModelAutocomplete } from './ModelAutocomplete-i77tybzR.js';

var ModelSearch = /** @class */ (function (_super) {
    __extends(ModelSearch, _super);
    function ModelSearch(renderTarget) {
        var _this = _super.call(this, renderTarget) || this;
        _this.usedContinuationTokens = {};
        _this.currentResultIndex = -1;
        _this.stripHits = function (str) {
            return str
                .split("<hit>")
                .map(function (h) {
                return h
                    .split("</hit>")
                    .map(function (h2) { return Utils.strip(h2); })
                    .join("</hit>");
            })
                .join("<hit>");
        };
        d3.select("html").on("click." + Utils.guid(), function (event) {
            if (_this.clickedInstance &&
                event.target != _this.clickedInstance &&
                _this.contextMenu) {
                _this.closeContextMenu();
                _this.clickedInstance = null;
            }
        });
        return _this;
    }
    ModelSearch.prototype.ModelSearch = function () { };
    ModelSearch.prototype.render = function (environmentFqdn, getToken, hierarchyData, chartOptions) {
        var _this = this;
        this.chartOptions.setOptions(chartOptions);
        var self = this;
        var continuationToken, searchText;
        var targetElement = d3.select(this.renderTarget);
        targetElement.html("");
        this.wrapper = targetElement
            .append("div")
            .attr("class", "tsi-modelSearchWrapper");
        _super.prototype.themify.call(this, this.wrapper, this.chartOptions.theme);
        var inputWrapper = this.wrapper
            .append("div")
            .attr("class", "tsi-modelSearchInputWrapper");
        var autocompleteOnInput = function (st, event) {
            self.usedContinuationTokens = {};
            // blow results away if no text
            if (st.length === 0) {
                searchText = st;
                self.instanceResults.html("");
                self.currentResultIndex = -1;
                hierarchyElement.node().style.display = "block";
                showMore.node().style.display = "none";
                noResults.style("display", "none");
            }
            else if (event.which === 13 || event.keyCode === 13) {
                hierarchyElement.node().style.display = "none";
                self.instanceResults.html("");
                self.currentResultIndex = -1;
                noResults.style("display", "none");
                searchInstances();
                searchText = st;
            }
        };
        var modelAutocomplete = new ModelAutocomplete(inputWrapper.node());
        modelAutocomplete.render(environmentFqdn, getToken, __assign({ onInput: autocompleteOnInput, onKeydown: function (event, ap) {
                _this.handleKeydown(event, ap);
            } }, chartOptions));
        modelAutocomplete.ap;
        var results = this.wrapper
            .append("div")
            .attr("class", "tsi-modelSearchResults")
            .on("scroll", function () {
            self.closeContextMenu();
            var that = this;
            if (that.scrollTop + that.clientHeight + 150 >
                self.instanceResults.node().clientHeight &&
                searchText.length !== 0) {
                searchInstances(searchText, continuationToken);
            }
        });
        var noResults = results
            .append("div")
            .text(this.getString("No results"))
            .classed("tsi-noResults", true)
            .style("display", "none");
        var instanceResultsWrapper = results
            .append("div")
            .attr("class", "tsi-modelSearchInstancesWrapper");
        this.instanceResults = instanceResultsWrapper
            .append("div")
            .attr("class", "tsi-modelSearchInstances");
        var showMore = instanceResultsWrapper
            .append("div")
            .attr("class", "tsi-showMore")
            .text(this.getString("Show more") + "...")
            .on("click", function () { return searchInstances(searchText, continuationToken); })
            .style("display", "none");
        var hierarchyElement = this.wrapper
            .append("div")
            .attr("class", "tsi-hierarchyWrapper");
        var hierarchy = new Hierarchy(hierarchyElement.node());
        hierarchy.render(hierarchyData, __assign(__assign({}, this.chartOptions), { withContextMenu: true }));
        var searchInstances = function (searchText, ct) {
            if (ct === void 0) { ct = null; }
            var self = _this;
            if (ct === "END")
                return;
            if (ct === null || !self.usedContinuationTokens[ct]) {
                self.usedContinuationTokens[ct] = true;
            }
        };
        getToken().then(function (token) {
        });
        // get types
        getToken().then(function (token) {
        });
    };
    ModelSearch.prototype.handleKeydown = function (event, ap) {
        if (!ap.isOpened) {
            var results = this.instanceResults.selectAll(".tsi-modelResultWrapper");
            if (results.size()) {
                if (event.keyCode === 40 &&
                    this.currentResultIndex < results.nodes().length - 1) {
                    this.currentResultIndex++;
                    results.nodes()[this.currentResultIndex].focus();
                }
                else if (event.keyCode === 38) {
                    this.currentResultIndex--;
                    if (this.currentResultIndex <= -1) {
                        this.currentResultIndex = -1;
                        ap.input.focus();
                    }
                    else {
                        results.nodes()[this.currentResultIndex].focus();
                    }
                }
            }
        }
    };
    ModelSearch.prototype.closeContextMenu = function () {
        if (this.contextMenu) {
            this.contextMenu.remove();
        }
        d3.selectAll(".tsi-resultSelected").classed("tsi-resultSelected", false);
    };
    ModelSearch.prototype.getInstanceHtml = function (i) {
        var _this = this;
        return "<div class=\"tsi-modelResult\">\n                    <div class=\"tsi-modelPK\">\n                        ".concat(i.highlights.name
            ? this.stripHits(i.highlights.name)
            : this.stripHits(i.highlights.timeSeriesIds
                ? i.highlights.timeSeriesIds.join(" ")
                : i.highlights.timeSeriesId.join(" ")), "\n                    </div>\n                    <div class=\"tsi-modelHighlights\">\n                        ").concat(this.stripHits(i.highlights.description &&
            i.highlights.description.length
            ? i.highlights.description
            : this.getString("No description")), "\n                        <br/><table>\n                        ").concat(i.highlights.name
            ? "<tr><td>" +
                this.getString("Time Series ID") +
                "</td><td>" +
                this.stripHits(i.highlights.timeSeriesIds
                    ? i.highlights.timeSeriesIds.join(" ")
                    : i.highlights.timeSeriesId.join(" ")) +
                "</td></tr>"
            : "", "                        \n                        ").concat(i.highlights.instanceFieldNames
            .map(function (ifn, idx) {
            var val = i.highlights.instanceFieldValues[idx];
            if (ifn.indexOf("<hit>") !== -1 ||
                val.indexOf("<hit>") !== -1) {
                return val.length === 0
                    ? ""
                    : "<tr><td>" +
                        _this.stripHits(ifn) +
                        "</td><td>" +
                        _this.stripHits(val) +
                        "</tr>";
            }
        })
            .join(""), "\n                        </table>\n                    </div>\n                </div>");
    };
    return ModelSearch;
}(Component));

export { ModelSearch as M };
