import { _ as __extends, a as __assign, b as __awaiter, c as __generator } from './_tslib-B2CX7HIe.js';
import * as d3 from 'd3';
import { U as Utils } from './Utils-CKNrHyqc.js';
import { C as Component } from './Component-C7RWgteh.js';

var HierarchyNavigation = /** @class */ (function (_super) {
    __extends(HierarchyNavigation, _super);
    function HierarchyNavigation(renderTarget) {
        var _this = _super.call(this, renderTarget) || this;
        _this.path = [];
        //selectedIds
        _this.selectedIds = [];
        _this.searchEnabled = true;
        _this.renderSearchResult = function (r, payload, target) {
            var _a, _b, _c, _d, _e, _f;
            var hierarchyData = ((_b = (_a = r.hierarchyNodes) === null || _a === void 0 ? void 0 : _a.hits) === null || _b === void 0 ? void 0 : _b.length)
                ? _this.fillDataRecursively(r.hierarchyNodes, payload, payload)
                : {};
            var instancesData = ((_d = (_c = r.instances) === null || _c === void 0 ? void 0 : _c.hits) === null || _d === void 0 ? void 0 : _d.length)
                ? r.instances.hits.reduce(function (acc, i) {
                    acc[_this.instanceNodeIdentifier(i)] = new InstanceNode(i.timeSeriesId, i.name, payload.path.length - _this.path.length, i.id, i.description);
                    return acc;
                }, {})
                : {};
            if ((_f = (_e = r.hierarchyNodes) === null || _e === void 0 ? void 0 : _e.hits) === null || _f === void 0 ? void 0 : _f.length) {
                var hitCountElem = target.select(".tsi-hitCount");
                if (hitCountElem.size() === 0) {
                    hitCountElem = target.append('span').classed('tsi-hitCount', true).text('');
                }
                hitCountElem.text(r.hierarchyNodes.hitCount);
            }
            _this.renderTree(__assign(__assign({}, hierarchyData), instancesData), target);
        };
        _this.hierarchyNodeIdentifier = function (hName) {
            return hName ? hName : '(' + _this.getString("Empty") + ')';
        };
        _this.instanceNodeIdentifier = function (instance) {
            return "instance-".concat(Utils.getInstanceKey(instance));
        };
        _this.instanceNodeStringToDisplay = function (instance) {
            var _a;
            return ((_a = instance.highlights) === null || _a === void 0 ? void 0 : _a.name) || Utils.getHighlightedTimeSeriesIdToDisplay(instance)
                || instance.name || Utils.getTimeSeriesIdToDisplay(instance, _this.getString('Empty'));
        };
        _this.instanceNodeString = function (instance) {
            return instance.name || Utils.getTimeSeriesIdString(instance);
        };
        return _this;
    }
    HierarchyNavigation.prototype.render = function (searchF_1) {
        return __awaiter(this, arguments, void 0, function (searchF, hierarchyNavOptions, preselectedIds) {
            var targetElement, results;
            if (hierarchyNavOptions === void 0) { hierarchyNavOptions = {}; }
            return __generator(this, function (_a) {
                this.chartOptions.setOptions(hierarchyNavOptions);
                this.searchFunction = searchF;
                targetElement = d3.select(this.renderTarget).text('');
                this.hierarchyNavWrapper = this.createHierarchyNavWrapper(targetElement);
                this.selectedIds = preselectedIds;
                //render search wrapper
                //this.renderSearchBox()
                _super.prototype.themify.call(this, this.hierarchyNavWrapper, this.chartOptions.theme);
                results = this.createResultsWrapper(this.hierarchyNavWrapper);
                this.hierarchyElem = this.createHierarchyElem(results);
                this.pathSearchAndRenderResult({ search: { payload: this.requestPayload() }, render: { target: this.hierarchyElem } });
                return [2 /*return*/];
            });
        });
    };
    HierarchyNavigation.prototype.createHierarchyNavWrapper = function (targetElement) {
        return targetElement.append('div').attr('class', 'tsi-hierarchy-nav-wrapper');
    };
    HierarchyNavigation.prototype.createResultsWrapper = function (hierarchyNavWrapper) {
        return hierarchyNavWrapper.append('div').classed('tsi-hierarchy-or-list-wrapper', true);
    };
    HierarchyNavigation.prototype.createHierarchyElem = function (results) {
        return results.append('div').classed('tsi-hierarchy', true).attr("role", "navigation").on('scroll', function () { });
    };
    // prepares the parameters for search request
    HierarchyNavigation.prototype.requestPayload = function (hierarchy) {
        var _a;
        if (hierarchy === void 0) { hierarchy = null; }
        var path = (_a = hierarchy === null || hierarchy === void 0 ? void 0 : hierarchy.path) !== null && _a !== void 0 ? _a : this.path;
        return { path: path, hierarchy: hierarchy };
    };
    // renders tree for both 'Navigate' and 'Filter' mode (with Hierarchy View option selected), locInTarget refers to the 'show more' element -either hierarchy or instance- within the target
    HierarchyNavigation.prototype.renderTree = function (data, target) {
        var _this = this;
        var list = target.append('ul').attr("role", target === this.hierarchyElem ? "tree" : "group");
        Object.keys(data).forEach(function (el) {
            var nodeNameToCheckIfExists = data[el] instanceof InstanceNode ? _this.instanceNodeString(data[el]) : el;
            var li;
            if (list.selectAll(".tsi-name").nodes().find(function (e) { return e.innerText === nodeNameToCheckIfExists; })) {
                li = null;
            }
            else {
                li = list.append('li').classed('tsi-leaf', data[el].isLeaf);
                //if the node is already selected, we want to highlight it
                if (_this.selectedIds && _this.selectedIds.includes(data[el].id)) {
                    li.classed('tsi-selected', true);
                }
            }
            if (!li)
                return;
            li.attr("role", "none");
            var newListElem = _this.createHierarchyItemElem(data[el], el);
            li.node().appendChild(newListElem.node());
            data[el].node = li;
            if (data[el].children) {
                data[el].isExpanded = true;
                data[el].node.classed('tsi-expanded', true);
                _this.renderTree(data[el].children, data[el].node);
            }
        });
    };
    HierarchyNavigation.prototype.renderSearchBox = function () {
        var _this = this;
        this.searchWrapperElem = this.hierarchyNavWrapper.append('div').classed('tsi-hierarchy-search', true);
        var inputWrapper = this.searchWrapperElem.append("div").attr("class", "tsi-search");
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
        var self = this;
        input.on("keydown", function (event) {
            _this.chartOptions.onKeydown(event, _this.ap);
        });
        var searchText;
        input.on("input", function (event) {
            searchText = event.target.value;
            if (searchText.length === 0) {
                //clear the tree
                self.hierarchyElem.selectAll('ul').remove();
                self.pathSearchAndRenderResult({ search: { payload: self.requestPayload() }, render: { target: self.hierarchyElem } });
            }
            else {
                //filter the tree
                self.filterTree(searchText);
            }
        });
    };
    HierarchyNavigation.prototype.pathSearchAndRenderResult = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var result, err_1;
            var _c = _b.search, payload = _c.payload, _d = _c.bubbleUpReject, bubbleUpReject = _d === void 0 ? false : _d, _e = _b.render, target = _e.target; _e.locInTarget;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.searchFunction(payload)];
                    case 1:
                        result = _g.sent();
                        if (result.error) {
                            throw result.error;
                        }
                        this.renderSearchResult(result, payload, target);
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _g.sent();
                        this.chartOptions.onError("Error in hierarchy navigation", "Failed to complete search", err_1 instanceof XMLHttpRequest ? err_1 : null);
                        if (bubbleUpReject) {
                            throw err_1;
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    HierarchyNavigation.prototype.filterTree = function (searchText) {
        var tree = this.hierarchyElem.selectAll('ul').nodes()[0];
        var list = tree.querySelectorAll('li');
        list.forEach(function (li) {
            var name = li.querySelector('.tsi-name').innerText;
            if (name.toLowerCase().includes(searchText.toLowerCase())) {
                li.style.display = 'block';
            }
            else {
                li.style.display = 'none';
            }
        });
    };
    // creates in-depth data object using the server response for hierarchyNodes to show in the tree all expanded, considering UntilChildren
    HierarchyNavigation.prototype.fillDataRecursively = function (hierarchyNodes, payload, payloadForContinuation) {
        var _this = this;
        if (payloadForContinuation === void 0) { payloadForContinuation = null; }
        var data = {};
        hierarchyNodes.hits.forEach(function (h) {
            var _a;
            var hierarchy = new HierarchyNode(h.name, payload.path, payload.path.length - _this.path.length, h.cumulativeInstanceCount, h.id);
            hierarchy.expand = function () {
                hierarchy.isExpanded = true;
                hierarchy.node.classed('tsi-expanded', true);
                return _this.pathSearchAndRenderResult({
                    search: { payload: _this.requestPayload(hierarchy), bubbleUpReject: true },
                    render: { target: hierarchy.node }
                });
            };
            data[_this.hierarchyNodeIdentifier(h.name)] = hierarchy;
            if ((_a = h.hierarchyNodes) === null || _a === void 0 ? void 0 : _a.hits.length) {
                hierarchy.children = _this.fillDataRecursively(h.hierarchyNodes, _this.requestPayload(hierarchy), payloadForContinuation);
            }
        });
        return data;
    };
    //returns the dom element of one hierarchy level item for tree rendering
    HierarchyNavigation.prototype.createHierarchyItemElem = function (hORi, key) {
        var self = this;
        var isHierarchyNode = hORi instanceof HierarchyNode;
        var hierarchyItemElem = d3.create('div').classed('tsi-hierarchyItem', true)
            .attr('style', "padding-left: ".concat(hORi.isLeaf ? hORi.level * 18 + 20 : (hORi.level + 1) * 18 + 20, "px"))
            .attr('tabindex', 0)
            //.attr('arialabel', isHierarchyNode ? key : Utils.getTimeSeriesIdString(hORi))
            .attr('arialabel', isHierarchyNode ? key : self.getAriaLabel(hORi))
            .attr('title', isHierarchyNode ? key : self.getAriaLabel(hORi))
            .attr("role", "treeitem").attr('aria-expanded', hORi.isExpanded)
            .on('click keydown', function (event) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (Utils.isKeyDownAndNotEnter(event)) {
                                return [2 /*return*/];
                            }
                            if (!!isHierarchyNode) return [3 /*break*/, 1];
                            event.stopPropagation();
                            //we want to store clicked instance and hightlight it in the hierarchy
                            //if the instance is already selected, we want to deselect it
                            if (self.chartOptions.onInstanceClick) {
                                if (self.selectedIds && self.selectedIds.includes(hORi.id)) {
                                    self.selectedIds = self.selectedIds.filter(function (id) { return id !== hORi.id; });
                                    hORi.node.classed('tsi-selected', false);
                                }
                                else {
                                    self.selectedIds.push(hORi.id);
                                    hORi.node.classed('tsi-selected', true);
                                }
                            }
                            self.chartOptions.onInstanceClick(hORi);
                            return [3 /*break*/, 4];
                        case 1:
                            if (!hORi.isExpanded) return [3 /*break*/, 2];
                            hORi.collapse();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, hORi.expand()];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        });
        if (isHierarchyNode) {
            hierarchyItemElem.append('span').classed('tsi-caret-icon', true).attr('style', "left: ".concat((hORi.level) * 18 + 20, "px"));
            hierarchyItemElem.append('span').classed('tsi-name', true).text(key);
            hierarchyItemElem.append('span').classed('tsi-instanceCount', true).text(hORi.cumulativeInstanceCount);
            hierarchyItemElem.append('span').classed('tsi-hitCount', true).text(''); // hit count is the number of hierarchy nodes below, it is filled after expand is clicked for this node (after search is done for this path)
        }
        else {
            var spanElem = hierarchyItemElem.append('span').classed('tsi-name', true);
            Utils.appendFormattedElementsFromString(spanElem, this.instanceNodeStringToDisplay(hORi));
        }
        return hierarchyItemElem;
    };
    HierarchyNavigation.prototype.getAriaLabel = function (hORi) {
        if (hORi instanceof HierarchyNode) {
            return hORi.name;
        }
        //check description first then name then id
        return hORi.description || hORi.name || hORi.id || Utils.getTimeSeriesIdString(hORi);
    };
    return HierarchyNavigation;
}(Component));
var HierarchyNode = /** @class */ (function () {
    function HierarchyNode(name, parentPath, level, cumulativeInstanceCount, id) {
        if (cumulativeInstanceCount === void 0) { cumulativeInstanceCount = null; }
        if (id === void 0) { id = null; }
        this.name = name;
        this.id = id;
        this.path = parentPath.concat([name]);
        this.level = level;
        this.cumulativeInstanceCount = cumulativeInstanceCount;
        this.node = null;
        this.children = null;
        this.isExpanded = false;
    }
    HierarchyNode.prototype.expand = function () { };
    HierarchyNode.prototype.collapse = function () {
        this.isExpanded = false;
        this.node.classed('tsi-expanded', false);
        this.node.selectAll('ul').remove();
    };
    return HierarchyNode;
}());
var InstanceNode = /** @class */ (function () {
    function InstanceNode(tsId, name, level, id, description) {
        if (name === void 0) { name = null; }
        if (id === void 0) { id = null; }
        if (description === void 0) { description = null; }
        this.timeSeriesId = tsId;
        this.name = name;
        this.suppressDrawContextMenu = false;
        this.isLeaf = true;
        this.level = level;
        this.node = null;
        this.id = id;
        this.description = description;
    }
    return InstanceNode;
}());
var HierarchySelectionValues;
(function (HierarchySelectionValues) {
    HierarchySelectionValues["All"] = "0";
    HierarchySelectionValues["Unparented"] = "-1";
})(HierarchySelectionValues || (HierarchySelectionValues = {}));
var ViewType;
(function (ViewType) {
    ViewType[ViewType["Hierarchy"] = 0] = "Hierarchy";
    ViewType[ViewType["List"] = 1] = "List";
})(ViewType || (ViewType = {}));
var State;
(function (State) {
    State[State["Navigate"] = 0] = "Navigate";
    State[State["Search"] = 1] = "Search";
    State[State["Filter"] = 2] = "Filter";
})(State || (State = {}));

export { HierarchyNavigation as H };
