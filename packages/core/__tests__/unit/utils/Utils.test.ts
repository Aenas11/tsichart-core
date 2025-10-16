import Utils from '../../../src/utils/Utils';

describe('Utils', () => {
    describe('formatYAxisNumber', () => {
        it('should format small numbers with grouping and significant digits', () => {
            expect(Utils.formatYAxisNumber(1234.567)).toBe('1,234.567');
            expect(Utils.formatYAxisNumber(999999)).toBe('999,999');
        });

        it('should use scientific notation for very small numbers', () => {
            const result = Utils.formatYAxisNumber(0.00000001);
            expect(result).toContain('e');
        });

        it('should format millions with M suffix', () => {
            const result = Utils.formatYAxisNumber(1500000);
            expect(result).toContain('M');
        });

        it('should format billions with B suffix', () => {
            const result = Utils.formatYAxisNumber(1500000000);
            expect(result).toContain('B');
        });

        it('should handle negative numbers', () => {
            const result = Utils.formatYAxisNumber(-1234.567);
            // D3 format uses Unicode minus sign (−) instead of hyphen (-)
            expect(result).toMatch(/[−-]/);
            expect(result).toContain('1,234');
        });

        it('should trim trailing zeros after decimal point', () => {
            const result = Utils.formatYAxisNumber(123.4);
            expect(result).not.toMatch(/\.0+$/);
        });
    });

    describe('parseTimeInput', () => {
        it('should parse milliseconds', () => {
            expect(Utils.parseTimeInput('100ms')).toBe(100);
            expect(Utils.parseTimeInput('500MS')).toBe(500);
        });

        it('should parse seconds', () => {
            expect(Utils.parseTimeInput('5s')).toBe(5000);
            expect(Utils.parseTimeInput('30S')).toBe(30000);
        });

        it('should parse minutes', () => {
            expect(Utils.parseTimeInput('5m')).toBe(300000);
            expect(Utils.parseTimeInput('10M')).toBe(600000);
        });

        it('should parse hours', () => {
            expect(Utils.parseTimeInput('1h')).toBe(3600000);
            expect(Utils.parseTimeInput('2H')).toBe(7200000);
        });

        it('should parse days', () => {
            expect(Utils.parseTimeInput('1d')).toBe(86400000);
            expect(Utils.parseTimeInput('7D')).toBe(604800000);
        });

        it('should handle PT prefix for ISO duration', () => {
            expect(Utils.parseTimeInput('PT5m')).toBe(300000);
            expect(Utils.parseTimeInput('P1d')).toBe(86400000);
        });
    });

    describe('guid', () => {
        it('should generate unique identifiers', () => {
            const guid1 = Utils.guid();
            const guid2 = Utils.guid();

            expect(guid1).toBeDefined();
            expect(guid2).toBeDefined();
            expect(guid1).not.toBe(guid2);
        });

        it('should generate valid UUID format', () => {
            const guid = Utils.guid();
            const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            expect(guid).toMatch(uuidPattern);
        });
    });

    describe('getStackStates', () => {
        it('should return YAxisStates', () => {
            const states = Utils.getStackStates();
            expect(states).toBeDefined();
            expect(typeof states).toBe('object');
        });
    });
});
