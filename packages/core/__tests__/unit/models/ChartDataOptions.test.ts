import { ChartDataOptions } from '../../../src/models/ChartDataOptions';
import { InterpolationFunctions, DataTypes, EventElementTypes } from '../../../src/constants/Enums';

describe('ChartDataOptions', () => {
    describe('constructor', () => {
        it('should create with default values when empty object is passed', () => {
            const options = new ChartDataOptions({});

            // Utils.getValueOrDefault returns null for undefined values, not undefined
            expect(options.searchSpan).toBeNull();
            expect(options.measureTypes).toBeNull();
            expect(options.color).toBeNull();
            expect(options.alias).toBeNull();
            expect(options.contextMenu).toEqual([]);
            expect(options.interpolationFunction).toBe(InterpolationFunctions.None);
            expect(options.includeEnvelope).toBe(false);
            expect(options.includeDots).toBe(false);
            expect(options.visibilityState).toBeNull();
            expect(options.yExtent).toBeNull();
            expect(options.timeShift).toBe('');
            expect(options.dataType).toBe(DataTypes.Numeric);
            expect(options.valueMapping).toEqual({});
            expect(options.height).toBe(40); // DEFAULT_HEIGHT
            expect(options.onElementClick).toBeNull();
            expect(options.eventElementType).toBe(EventElementTypes.Diamond);
            expect(options.rollupCategoricalValues).toBe(false);
            expect(options.tooltipAttributes).toEqual([]);
            expect(options.positionX).toBe(0);
            expect(options.positionY).toBe(0);
            expect(options.swimLane).toBeNull();
            expect(options.variableAlias).toBeNull();
            expect(options.connectPoints).toBe(false);
            expect(options.pointConnectionMeasure).toBe('');
            expect(options.positionXVariableName).toBeNull();
            expect(options.positionYVariableName).toBeNull();
            expect(options.image).toBeNull();
            expect(options.startAt).toBeNull();
            expect(options.isRawData).toBe(false);
            expect(options.isVariableAliasShownOnTooltip).toBe(true);
            expect(options.horizontalMarkers).toEqual([]);
        });

        it('should set all properties from options object', () => {
            const optionsObj = {
                searchSpan: { from: '2020-01-01', to: '2020-01-31', bucketSize: '1h' },
                measureTypes: ['avg', 'min', 'max'],
                color: '#FF0000',
                alias: 'Temperature',
                contextMenu: [{ name: 'Action1', action: () => { } }],
                interpolationFunction: InterpolationFunctions.CurveLinear,
                includeEnvelope: true,
                includeDots: true,
                visibilityState: [true, false],
                yExtent: [0, 100],
                timeShift: '1h',
                dataType: DataTypes.Categorical,
                valueMapping: { A: 1, B: 2 },
                height: 80,
                onElementClick: jest.fn(),
                eventElementType: EventElementTypes.Teardrop,
                rollupCategoricalValues: true,
                tooltipAttributes: [['attr1', 'value1']],
                positionX: 10,
                positionY: 20,
                swimLane: 1,
                variableAlias: 'temp',
                connectPoints: true,
                pointConnectionMeasure: 'measure1',
                positionXVariableName: 'x_var',
                positionYVariableName: 'y_var',
                image: 'data:image/png;base64,...',
                startAt: '2020-01-01T00:00:00Z',
                isRawData: true,
                isVariableAliasShownOnTooltip: false,
                horizontalMarkers: [{ value: 50, label: 'Threshold' }]
            };

            const options = new ChartDataOptions(optionsObj);

            expect(options.searchSpan).toEqual(optionsObj.searchSpan);
            expect(options.measureTypes).toEqual(optionsObj.measureTypes);
            expect(options.color).toBe(optionsObj.color);
            expect(options.alias).toBe(optionsObj.alias);
            expect(options.contextMenu).toEqual(optionsObj.contextMenu);
            expect(options.interpolationFunction).toBe(optionsObj.interpolationFunction);
            expect(options.includeEnvelope).toBe(true);
            expect(options.includeDots).toBe(true);
            expect(options.visibilityState).toEqual(optionsObj.visibilityState);
            expect(options.yExtent).toEqual(optionsObj.yExtent);
            expect(options.timeShift).toBe(optionsObj.timeShift);
            expect(options.dataType).toBe(optionsObj.dataType);
            expect(options.valueMapping).toEqual(optionsObj.valueMapping);
            expect(options.height).toBe(80);
            expect(options.onElementClick).toBe(optionsObj.onElementClick);
            expect(options.eventElementType).toBe(optionsObj.eventElementType);
            expect(options.rollupCategoricalValues).toBe(true);
            expect(options.tooltipAttributes).toEqual(optionsObj.tooltipAttributes);
            expect(options.positionX).toBe(10);
            expect(options.positionY).toBe(20);
            expect(options.swimLane).toBe(1);
            expect(options.variableAlias).toBe(optionsObj.variableAlias);
            expect(options.connectPoints).toBe(true);
            expect(options.pointConnectionMeasure).toBe(optionsObj.pointConnectionMeasure);
            expect(options.positionXVariableName).toBe(optionsObj.positionXVariableName);
            expect(options.positionYVariableName).toBe(optionsObj.positionYVariableName);
            expect(options.image).toBe(optionsObj.image);
            expect(options.startAt).toBe(optionsObj.startAt);
            expect(options.isRawData).toBe(true);
            expect(options.isVariableAliasShownOnTooltip).toBe(false);
            expect(options.horizontalMarkers).toEqual(optionsObj.horizontalMarkers);
        });

        it('should handle color as a function', () => {
            const colorFn = (d: any) => '#FF0000';
            const options = new ChartDataOptions({ color: colorFn });

            expect(options.color).toBe(colorFn);
            expect(typeof options.color).toBe('function');
        });

        it('should use default height when height is not provided', () => {
            const options = new ChartDataOptions({});

            expect(options.height).toBe(40);
        });

        it('should override default height when provided', () => {
            const options = new ChartDataOptions({ height: 100 });

            expect(options.height).toBe(100);
        });

        it('should handle partial options object', () => {
            const options = new ChartDataOptions({
                alias: 'MyAlias',
                color: '#00FF00',
                includeEnvelope: true
            });

            expect(options.alias).toBe('MyAlias');
            expect(options.color).toBe('#00FF00');
            expect(options.includeEnvelope).toBe(true);
            // Check defaults for non-provided values
            expect(options.interpolationFunction).toBe(InterpolationFunctions.None);
            expect(options.dataType).toBe(DataTypes.Numeric);
            expect(options.height).toBe(40);
        });

        it('should handle different data types', () => {
            const numericOptions = new ChartDataOptions({ dataType: DataTypes.Numeric });
            const categoricalOptions = new ChartDataOptions({ dataType: DataTypes.Categorical });
            const eventsOptions = new ChartDataOptions({ dataType: DataTypes.Events });

            expect(numericOptions.dataType).toBe(DataTypes.Numeric);
            expect(categoricalOptions.dataType).toBe(DataTypes.Categorical);
            expect(eventsOptions.dataType).toBe(DataTypes.Events);
        });

        it('should handle different event element types', () => {
            const diamondOptions = new ChartDataOptions({ eventElementType: EventElementTypes.Diamond });
            const teardropOptions = new ChartDataOptions({ eventElementType: EventElementTypes.Teardrop });

            expect(diamondOptions.eventElementType).toBe(EventElementTypes.Diamond);
            expect(teardropOptions.eventElementType).toBe(EventElementTypes.Teardrop);
        });

        it('should handle negative position values', () => {
            const options = new ChartDataOptions({ positionX: -10, positionY: -20 });

            expect(options.positionX).toBe(-10);
            expect(options.positionY).toBe(-20);
        });

        it('should handle empty arrays for context menu and tooltip attributes', () => {
            const options = new ChartDataOptions({
                contextMenu: [],
                tooltipAttributes: []
            });

            expect(options.contextMenu).toEqual([]);
            expect(options.tooltipAttributes).toEqual([]);
        });

        it('should handle complex value mapping', () => {
            const valueMapping = {
                'On': 1,
                'Off': 0,
                'Unknown': null
            };
            const options = new ChartDataOptions({ valueMapping });

            expect(options.valueMapping).toEqual(valueMapping);
        });
    });
});
