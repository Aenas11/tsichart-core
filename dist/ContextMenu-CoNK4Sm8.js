import { _ as __extends } from './_tslib-B2CX7HIe.js';
import * as d3 from 'd3';
import { C as Component } from './Component-C7RWgteh.js';

var ACTIONELEMENTHEIGHT = 28;
var ACTIONELEMENTMAXWIDTH = 200;
var ACTIONELEMENTCONTAINERMAXHEIGHT = 200;
var VERTICALPADDING = 4;
var ContextMenu = /** @class */ (function (_super) {
    __extends(ContextMenu, _super);
    function ContextMenu(drawChart, renderTarget) {
        var _this = _super.call(this, renderTarget) || this;
        _this.contextMenuVisible = false;
        _this.drawChart = drawChart;
        _this.contextMenuElement = d3.select(renderTarget).insert("div", ":first-child")
            .attr("class", "tsi-contextMenu")
            .style("left", "0px")
            .style("top", "0px");
        return _this;
    }
    ContextMenu.prototype.launchSubMenu = function (parent, subMenuActions, subLevel, top) {
        var container = this.contextMenuElement
            .selectAll(".tsi-actionElementContainer".concat(subLevel))
            .data([{ subLevel: subLevel }]);
        var enteredContainer = container.enter()
            .append('div')
            .attr("class", function (d) { return "tsi-actionElementContainer tsi-actionElementContainer".concat(d.subLevel); })
            .merge(container)
            .style('max-height', "".concat(ACTIONELEMENTCONTAINERMAXHEIGHT, "px"))
            .style('display', 'block');
        this.createActionElements(enteredContainer, subMenuActions, subLevel);
        this.positionAEC(enteredContainer, subMenuActions.length, top, subLevel);
        container.exit().remove();
    };
    ContextMenu.prototype.positionAEC = function (container, subMenuActionsCount, top, subLevel) {
        this.verticalPositionAEC(container, top, subMenuActionsCount, subLevel);
        this.horizontalPositionAEC(container, subLevel);
    };
    ContextMenu.prototype.shouldHorizontalFlip = function (rawLeft) {
        var containerLeft = rawLeft + this.left;
        var totalWidth = d3.select(this.renderTarget).node().getBoundingClientRect().width;
        return ((containerLeft + ACTIONELEMENTMAXWIDTH) > totalWidth);
    };
    ContextMenu.prototype.shouldVerticalFlip = function (rawTop, elementCount) {
        var containerTop = rawTop + this.top;
        var totalHeight = d3.select(this.renderTarget).node().getBoundingClientRect().height;
        var heightOfElements = Math.min(elementCount * ACTIONELEMENTHEIGHT + (VERTICALPADDING * 2), ACTIONELEMENTCONTAINERMAXHEIGHT);
        return ((containerTop + heightOfElements) > totalHeight);
    };
    //determine position relative to the chart as a whole
    ContextMenu.prototype.getRelativeHorizontalPosition = function (node, isLeft) {
        if (isLeft === void 0) { isLeft = true; }
        return node.getBoundingClientRect().x + (isLeft ? 0 : node.getBoundingClientRect().width) - this.renderTarget.getBoundingClientRect().x;
    };
    ContextMenu.prototype.verticalPositionAEC = function (actionElementContainer, rawTop, elementCount, subLevel) {
        var totalHeight = this.contextMenuElement.node().getBoundingClientRect().height;
        if (this.shouldVerticalFlip(rawTop, elementCount)) {
            actionElementContainer.style('bottom', "".concat((totalHeight - rawTop) - (subLevel === 0 ? 0 : ACTIONELEMENTHEIGHT + VERTICALPADDING), "px"))
                .style('top', null);
        }
        else {
            actionElementContainer.style('top', "".concat(rawTop - VERTICALPADDING, "px"))
                .style('bottom', null);
        }
    };
    ContextMenu.prototype.horizontalPositionAEC = function (actionElementContainer, subLevel) {
        var leftPosition = 0;
        var rightPosition = 0;
        if (subLevel !== 0) {
            var oneLevelUp = this.contextMenuElement.selectAll(".tsi-actionElementContainer".concat(subLevel - 1));
            if (oneLevelUp.size()) {
                rightPosition = this.getRelativeHorizontalPosition(oneLevelUp.nodes()[0], false) - this.left;
                leftPosition = this.getRelativeHorizontalPosition(oneLevelUp.nodes()[0], true) - this.left;
            }
        }
        if (this.shouldHorizontalFlip(rightPosition)) {
            actionElementContainer.style('left', null)
                .style('right', "".concat(0 - leftPosition, "px"));
        }
        else {
            actionElementContainer.style('left', "".concat(rightPosition, "px"))
                .style('right', null);
        }
    };
    ContextMenu.prototype.getActionElementContainerTop = function (launchedFromActionNode) {
        if (launchedFromActionNode === void 0) { launchedFromActionNode = null; }
        if (launchedFromActionNode === null) {
            return 0;
        }
        return launchedFromActionNode.getBoundingClientRect().top -
            this.contextMenuElement.node().getBoundingClientRect().top;
    };
    ContextMenu.prototype.removeSubMenusAboveLevel = function (level) {
        d3.select(this.renderTarget).selectAll('.tsi-actionElementContainer').filter(function (subMenuD) {
            return (subMenuD.subLevel > level);
        }).remove();
    };
    ContextMenu.prototype.createActionElements = function (container, actions, subLevel) {
        if (subLevel === void 0) { subLevel = 0; }
        var self = this;
        var actionElements = container.selectAll(".tsi-actionElement")
            .data(actions.map(function (a) {
            a.subLevel = subLevel;
            return a;
        }));
        var actionElementsEntered = actionElements.enter()
            .append("div")
            .attr("class", "tsi-actionElement")
            .classed('tsi-hasSubMenu', function (d) { return d.isNested; })
            .merge(actionElements)
            .text(function (d) { return d.name; })
            .on('mouseenter', function (event, d) {
            var e = actionElementsEntered.nodes();
            var i = e.indexOf(event.currentTarget);
            if (d.isNested) {
                self.launchSubMenu(d3.select(this), d.subActions, subLevel + 1, self.getActionElementContainerTop(this));
                self.subMenuFromActionIndex = i;
                self.subMenuFromSubLevel = d.subLevel;
                return;
            }
            if ((d.subLevel === self.subMenuFromSubLevel && i !== self.subMenuFromActionIndex) || d.subLevel < self.subMenuFromSubLevel) {
                self.removeSubMenusAboveLevel(d.subLevel);
            }
        })
            .on("click", function (event, d) {
            if (d.isNested) {
                return;
            }
            if (self.endTime) { // if endTime is present, this is a brush action
                var startTime = self.startTime ? self.startTime.toISOString().slice(0, -5) + "Z" : null;
                var endTime = self.endTime ? self.endTime.toISOString().slice(0, -5) + "Z" : null;
                d.action(startTime, endTime);
            }
            else {
                var timestamp = self.startTime ? self.startTime.toISOString().slice(0, -5) + "Z" : null;
                d.action(self.ae, self.splitBy, timestamp, event);
            }
            self.hide();
            if (self.onClick)
                self.onClick();
        });
        actionElements.exit().remove();
    };
    ContextMenu.prototype.draw = function (chartComponentData, renderTarget, options, mousePosition, aggKey, splitBy, onClick, startTime, endTime, event) {
        var _this = this;
        if (onClick === void 0) { onClick = null; }
        if (startTime === void 0) { startTime = null; }
        if (endTime === void 0) { endTime = null; }
        this.contextMenuVisible = true;
        if (!endTime) {
            this.actions = chartComponentData.displayState[aggKey].contextMenuActions;
            this.ae = chartComponentData.displayState[aggKey].aggregateExpression;
        }
        else {
            this.actions = options.brushContextMenuActions;
        }
        this.splitBy = splitBy;
        this.startTime = startTime;
        this.endTime = endTime;
        this.onClick = onClick;
        _super.prototype.themify.call(this, this.contextMenuElement, options.theme);
        this.left = mousePosition[0];
        this.top = mousePosition[1];
        this.contextMenuElement
            .style('left', this.left + 'px')
            .style('top', this.top + 'px');
        this.contextMenuElement.selectAll('*').remove();
        this.contextMenuElement.style("display", "block")
            .on('mouseleave', function () {
            _this.removeSubMenusAboveLevel(0);
        });
        var actionContainer = this.contextMenuElement
            .selectAll('.tsi-actionElementContainer0')
            .data([{ subLevel: 0 }]);
        var actionContainerEntered = actionContainer.enter()
            .append('div')
            .attr('class', 'tsi-actionElementContainer tsi-actionElementContainer0');
        this.createActionElements(actionContainerEntered, this.actions);
        this.positionAEC(actionContainerEntered, this.actions.length, 0, 0);
        var self = this;
        d3.select(this.renderTarget).on("click", function (event) {
            if (!d3.select(event.srcElement).classed('tsi-actionElement')) {
                if (onClick) {
                    onClick();
                }
                self.hide();
            }
        });
    };
    ContextMenu.prototype.hide = function () {
        this.contextMenuElement.style("display", "none");
        this.contextMenuVisible = false;
    };
    return ContextMenu;
}(Component));

export { ContextMenu as C };
