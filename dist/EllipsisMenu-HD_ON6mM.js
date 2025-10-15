import { _ as __extends } from './_tslib-B2CX7HIe.js';
import * as d3 from 'd3';
import { C as Component } from './Component-C7RWgteh.js';

var EllipsisMenu = /** @class */ (function (_super) {
    __extends(EllipsisMenu, _super);
    function EllipsisMenu(renderTarget) {
        return _super.call(this, renderTarget) || this;
    }
    EllipsisMenu.prototype.createIconPath = function (iconName, theme) {
        var supportedNames = ["flag", "grid", "download"];
        return (supportedNames.indexOf(iconName) != -1) ? iconName + "Icon" : "";
    };
    EllipsisMenu.prototype.setMenuVisibility = function (isVisible) {
        this.menuIsVisible = isVisible;
        this.containerElement.classed("tsi-ellipsisMenuShown", this.menuIsVisible);
    };
    EllipsisMenu.prototype.focusOnMenuItem = function (itemIndex) {
        if (itemIndex === void 0) { itemIndex = 0; }
        itemIndex = (itemIndex + this.menuItems.length) % this.menuItems.length;
        var menuItem = this.menuElement.selectAll(".tsi-ellipsisMenuItem").filter(function (d, i) {
            return (itemIndex === i);
        });
        menuItem.node().focus();
    };
    EllipsisMenu.prototype.menuItemKeyHandler = function (event, d, i) {
        switch (event.keyCode) {
            case 9: //tab
                this.focusOnMenuItem(i + 1);
                event.preventDefault();
                break;
            case 27: //escape
                this.setMenuVisibility(false);
                this.buttonElement.node().focus();
                event.preventDefault();
                break;
            case 38: // up arrow
                this.focusOnMenuItem(i - 1);
                event.preventDefault();
                break;
            case 40: // down arrow
                this.focusOnMenuItem(i + 1);
                event.preventDefault();
                break;
        }
    };
    EllipsisMenu.prototype.render = function (menuItems, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.menuIsVisible = false;
        this.chartOptions.setOptions(options);
        this.containerElement = d3.select(this.renderTarget).classed("tsi-ellipsisMenuContainer", true);
        this.setMenuItems(menuItems);
        d3.select(this.renderTarget).selectAll("*").remove();
        _super.prototype.themify.call(this, this.containerElement, this.chartOptions.theme);
        var self = this;
        this.buttonElement = d3.select(this.renderTarget).insert("button")
            .attr("class", "tsi-ellipsisButton")
            .attr("aria-label", this.getString("Show ellipsis menu"))
            .attr("title", this.getString("Show ellipsis menu"))
            .attr("type", "button")
            .on("click", function () {
            d3.select(this).attr("aria-label", !self.menuIsVisible ? self.getString("Show ellipsis menu") : self.getString("Hide ellipsis menu"))
                .attr("title", !self.menuIsVisible ? self.getString("Show ellipsis menu") : self.getString("Hide ellipsis menu"));
            self.setMenuVisibility(!self.menuIsVisible);
            if (self.menuIsVisible) {
                self.focusOnMenuItem(0);
            }
        });
        this.menuElement = d3.select(this.renderTarget).insert("div")
            .attr("class", "tsi-ellipsisMenu")
            .attr("role", "menu");
        var menuElementEntered = this.menuElement.selectAll(".tsi-ellipsisMenuItem").data(this.menuItems)
            .enter()
            .append("button")
            .classed("tsi-ellipsisMenuItem", true)
            .attr("aria-label", function (d) { return d.label; })
            .attr("type", "button")
            .attr("role", "menuitem")
            .on('keydown', function (event, d) {
            var e = menuElementEntered.nodes();
            var i = e.indexOf(event.currentTarget);
            _this.menuItemKeyHandler(event, d, i);
        })
            .on("click", function (event, d) {
            d.action();
        })
            .each(function () {
            d3.select(this)
                .append("div")
                .attr("class", function (d) { return "tsi-ellipsisMenuIcon " + self.createIconPath(d.iconClass, self.chartOptions.theme); });
            d3.select(this)
                .append("div")
                .classed("tsi-ellipsisMenuLabel", true)
                .text(function (d) { return d.label; });
            d3.select(this)
                .append("div")
                .classed("tsi-ellipsisMenuDescription", true)
                .style("display", "none");
        });
    };
    EllipsisMenu.prototype.setMenuItems = function (rawMenuItems) {
        this.menuItems = rawMenuItems.reduce(function (menuItems, currMenuItem) {
            menuItems.push({
                iconClass: currMenuItem.iconClass,
                label: currMenuItem.label,
                action: currMenuItem.action,
                description: currMenuItem.description
            });
            return menuItems;
        }, []);
    };
    return EllipsisMenu;
}(Component));

export { EllipsisMenu as E };
