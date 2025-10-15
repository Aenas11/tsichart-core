import { _ as __extends } from './_tslib-B2CX7HIe.js';
import { U as Utils } from './Utils-CKNrHyqc.js';
import { C as ChartComponent } from './ChartComponent-C6-wlPEA.js';
import { C as ChartDataOptions } from './ChartDataOptions-B0uw7jmx.js';

var ChartVisualizationComponent = /** @class */ (function (_super) {
    __extends(ChartVisualizationComponent, _super);
    function ChartVisualizationComponent(renderTarget) {
        return _super.call(this, renderTarget) || this;
    }
    ChartVisualizationComponent.prototype.render = function (data, options, aggregateExpressionOptions) {
        this.data = Utils.standardizeTSStrings(data);
        this.chartOptions.setOptions(options);
        this.aggregateExpressionOptions = data.map(function (d, i) {
            return Object.assign(d, aggregateExpressionOptions && i in aggregateExpressionOptions ?
                new ChartDataOptions(aggregateExpressionOptions[i]) :
                new ChartDataOptions({}));
        });
    };
    return ChartVisualizationComponent;
}(ChartComponent));

export { ChartVisualizationComponent as C };
