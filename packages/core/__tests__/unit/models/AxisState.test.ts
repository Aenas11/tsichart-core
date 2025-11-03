import { AxisState } from '../../../src/models/AxisState';
import { YAxisStates } from '../../../src/constants/Enums';

describe('AxisState', () => {
    describe('constructor', () => {
        it('should create an AxisState with all properties', () => {
            const axisType = YAxisStates.Stacked;
            const yExtent: [number, number] = [0, 100];
            const positionInGroup = 1;

            const axisState = new AxisState(axisType, yExtent, positionInGroup);

            expect(axisState.axisType).toBe(axisType);
            expect(axisState.yExtent).toEqual(yExtent);
            expect(axisState.positionInGroup).toBe(positionInGroup);
        });

        it('should handle Shared axis type', () => {
            const axisState = new AxisState(YAxisStates.Shared, [10, 50], 0);

            expect(axisState.axisType).toBe(YAxisStates.Shared);
            expect(axisState.yExtent).toEqual([10, 50]);
            expect(axisState.positionInGroup).toBe(0);
        });

        it('should handle Overlap axis type', () => {
            const axisState = new AxisState(YAxisStates.Overlap, [-100, 100], 2);

            expect(axisState.axisType).toBe(YAxisStates.Overlap);
            expect(axisState.yExtent).toEqual([-100, 100]);
            expect(axisState.positionInGroup).toBe(2);
        });

        it('should handle negative y extent values', () => {
            const axisState = new AxisState(YAxisStates.Stacked, [-50, -10], 0);

            expect(axisState.yExtent).toEqual([-50, -10]);
        });

        it('should handle zero position in group', () => {
            const axisState = new AxisState(YAxisStates.Shared, [0, 1], 0);

            expect(axisState.positionInGroup).toBe(0);
        });

        it('should allow modification of properties after creation', () => {
            const axisState = new AxisState(YAxisStates.Stacked, [0, 100], 1);

            axisState.axisType = YAxisStates.Overlap;
            axisState.yExtent = [10, 90];
            axisState.positionInGroup = 2;

            expect(axisState.axisType).toBe(YAxisStates.Overlap);
            expect(axisState.yExtent).toEqual([10, 90]);
            expect(axisState.positionInGroup).toBe(2);
        });
    });
});
