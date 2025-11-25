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

    describe('timeFormat', () => {
        const testDate = new Date('2023-06-15T14:30:45.123Z'); // UTC timestamp for consistent testing

        describe('basic formatting', () => {
            it('should format date with default parameters (24-hour, no seconds/millis)', () => {
                const formatter = Utils.timeFormat();
                const result = formatter(testDate);
                expect(result).toBeTruthy();
                expect(result).toContain('06/15/2023'); // Date portion
                expect(result).toContain('14:30'); // Time portion in 24-hour format
                expect(result).not.toContain('45'); // No seconds
            });

            it('should format date in 12-hour format when is24HourTime is false', () => {
                const formatter = Utils.timeFormat(false, false, 0, false);
                const result = formatter(testDate);
                expect(result).toContain('02:30'); // 14:30 in 12-hour = 02:30
                expect(result).toMatch(/AM|PM/); // Should contain AM/PM indicator
            });

            it('should include seconds when usesSeconds is true', () => {
                const formatter = Utils.timeFormat(true, false, 0, true);
                const result = formatter(testDate);
                expect(result).toContain('14:30:45');
                expect(result).not.toContain('.123'); // No milliseconds
            });

            it('should include milliseconds when usesMillis is true', () => {
                const formatter = Utils.timeFormat(true, true, 0, true);
                const result = formatter(testDate);
                expect(result).toContain('14:30:45.123');
            });

            it('should include milliseconds without seconds when only usesMillis is true', () => {
                const formatter = Utils.timeFormat(false, true, 0, true);
                const result = formatter(testDate);
                expect(result).toContain('14:30'); // No seconds displayed
            });
        });

        describe('timezone offset handling', () => {
            it('should handle numeric offset in minutes (positive)', () => {
                const formatter = Utils.timeFormat(false, false, 60, true); // +1 hour offset
                const result = formatter(testDate);
                expect(result).toContain('15:30'); // 14:30 + 1 hour
            });

            it('should handle numeric offset in minutes (negative)', () => {
                const formatter = Utils.timeFormat(false, false, -300, true); // -5 hours offset
                const result = formatter(testDate);
                expect(result).toContain('09:30'); // 14:30 - 5 hours
            });

            it('should handle zero offset', () => {
                const formatter = Utils.timeFormat(false, false, 0, true);
                const result = formatter(testDate);
                expect(result).toContain('14:30'); // UTC time
            });

            it('should handle string timezone offset (America/New_York)', () => {
                const formatter = Utils.timeFormat(false, false, 'America/New_York', true);
                const result = formatter(testDate);
                expect(result).toBeTruthy();
                // Result will depend on DST but should be valid
            });

            it('should handle "Local" timezone string', () => {
                const formatter = Utils.timeFormat(false, false, 'Local', true);
                const result = formatter(testDate);
                expect(result).toBeTruthy();
                expect(result).toContain('06/15/2023'); // Date should be present
            });

            it('should handle UTC timezone string', () => {
                const formatter = Utils.timeFormat(false, false, 'UTC', true);
                const result = formatter(testDate);
                expect(result).toContain('14:30');
            });

            it('should handle Europe/London timezone', () => {
                const formatter = Utils.timeFormat(false, false, 'Europe/London', true);
                const result = formatter(testDate);
                expect(result).toBeTruthy();
            });
        });

        describe('time shift handling', () => {
            it('should apply positive shiftMillis', () => {
                const formatter = Utils.timeFormat(false, false, 0, true, 3600000); // +1 hour shift
                const result = formatter(testDate);
                expect(result).toContain('15:30'); // Shifted by 1 hour
            });

            it('should apply negative shiftMillis', () => {
                const formatter = Utils.timeFormat(false, false, 0, true, -7200000); // -2 hours shift
                const result = formatter(testDate);
                expect(result).toContain('12:30'); // Shifted back 2 hours
            });

            it('should handle zero shiftMillis', () => {
                const formatter = Utils.timeFormat(false, false, 0, true, 0);
                const result = formatter(testDate);
                expect(result).toContain('14:30'); // No shift
            });

            it('should handle null shiftMillis (no shift)', () => {
                const formatter = Utils.timeFormat(false, false, 0, true, null);
                const result = formatter(testDate);
                expect(result).toContain('14:30'); // No shift
            });

            it('should combine shiftMillis with timezone offset', () => {
                const formatter = Utils.timeFormat(false, false, 60, true, 3600000); // +1h offset, +1h shift
                const result = formatter(testDate);
                expect(result).toContain('16:30'); // 14:30 + 1h shift + 1h offset
            });
        });

        describe('custom time format string', () => {
            it('should use custom timeFormat string when provided', () => {
                const customFormat = 'YYYY-MM-DD HH:mm:ss';
                const formatter = Utils.timeFormat(false, false, 0, true, null, customFormat);
                const result = formatter(testDate);
                expect(result).toBe('2023-06-15 14:30:45');
            });

            it('should override usesSeconds/usesMillis when custom format is provided', () => {
                const customFormat = 'HH:mm'; // Only hours and minutes
                const formatter = Utils.timeFormat(true, true, 0, true, null, customFormat);
                const result = formatter(testDate);
                expect(result).toBe('14:30'); // Custom format takes precedence
            });

            it('should apply custom format with timezone', () => {
                const customFormat = 'YYYY-MM-DD HH:mm Z';
                const formatter = Utils.timeFormat(false, false, 'America/New_York', true, null, customFormat);
                const result = formatter(testDate);
                expect(result).toContain('2023-06-15');
                expect(result).toContain('-'); // Timezone offset indicator
            });

            it('should handle complex custom format', () => {
                const customFormat = 'dddd, MMMM Do YYYY, h:mm:ss a';
                const formatter = Utils.timeFormat(false, false, 0, true, null, customFormat);
                const result = formatter(testDate);
                expect(result).toContain('Thursday');
                expect(result).toContain('June');
                expect(result).toContain('2023');
            });
        });

        describe('locale handling', () => {
            it('should format with default locale (en)', () => {
                const formatter = Utils.timeFormat();
                const result = formatter(testDate);
                expect(result).toContain('06/15/2023'); // US date format
            });

            it('should format with French locale', () => {
                const formatter = Utils.timeFormat(false, false, 0, true, null, null, 'fr');
                const result = formatter(testDate);
                expect(result).toContain('15/06/2023'); // French date format
            });

            it('should format with German locale', () => {
                const formatter = Utils.timeFormat(false, false, 0, true, null, null, 'de');
                const result = formatter(testDate);
                expect(result).toContain('15.06.2023'); // German date format
            });

            it('should format with Japanese locale', () => {
                const formatter = Utils.timeFormat(false, false, 0, true, null, null, 'ja');
                const result = formatter(testDate);
                expect(result).toBeTruthy();
                // Japanese format will vary
            });

            it('should handle locale with custom format', () => {
                const customFormat = 'LL'; // Localized long date format
                const formatter = Utils.timeFormat(false, false, 0, true, null, customFormat, 'fr');
                const result = formatter(testDate);
                expect(result).toContain('juin'); // French month name
                expect(result).toContain('2023');
            });
        });

        describe('edge cases and boundary conditions', () => {
            it('should handle epoch time (Jan 1, 1970)', () => {
                const epochDate = new Date(0);
                const formatter = Utils.timeFormat(false, false, 0, true);
                const result = formatter(epochDate);
                expect(result).toContain('1970');
                expect(result).toContain('00:00');
            });

            it('should handle dates far in the past', () => {
                const oldDate = new Date('1900-01-01T00:00:00Z');
                const formatter = Utils.timeFormat(false, false, 0, true);
                const result = formatter(oldDate);
                expect(result).toContain('1900');
            });

            it('should handle dates far in the future', () => {
                const futureDate = new Date('2100-12-31T23:59:59Z');
                const formatter = Utils.timeFormat(true, false, 0, true);
                const result = formatter(futureDate);
                expect(result).toContain('2100');
                expect(result).toContain('23:59:59');
            });

            it('should handle midnight (00:00:00)', () => {
                const midnightDate = new Date('2023-06-15T00:00:00Z');
                const formatter = Utils.timeFormat(false, false, 0, true);
                const result = formatter(midnightDate);
                expect(result).toContain('00:00');
            });

            it('should handle noon (12:00:00)', () => {
                const noonDate = new Date('2023-06-15T12:00:00Z');
                const formatter = Utils.timeFormat(false, false, 0, false);
                const result = formatter(noonDate);
                expect(result).toContain('12:00');
                expect(result).toContain('PM');
            });

            it('should handle end of day (23:59:59.999)', () => {
                const endOfDayDate = new Date('2023-06-15T23:59:59.999Z');
                const formatter = Utils.timeFormat(true, true, 0, true);
                const result = formatter(endOfDayDate);
                expect(result).toContain('23:59:59.999');
            });
        });

        describe('combined scenarios (real-world usage)', () => {
            it('should format like LineChart horizontal value box (with shift)', () => {
                const shiftMillis = 3600000; // 1 hour
                const formatter = Utils.timeFormat(true, true, 0, true, shiftMillis, null, 'en');
                const result = formatter(testDate);
                expect(result).toContain('15:30:45.123'); // Shifted by 1 hour
            });

            it('should format with timezone and 12-hour format', () => {
                const formatter = Utils.timeFormat(false, false, 'America/Los_Angeles', false, null, null, 'en');
                const result = formatter(testDate);
                expect(result).toMatch(/AM|PM/);
            });

            it('should format with all options combined', () => {
                const formatter = Utils.timeFormat(true, true, 120, false, 1800000, null, 'en');
                const result = formatter(testDate);
                expect(result).toBeTruthy();
                expect(result).toMatch(/AM|PM/); // 12-hour format
            });

            it('should be consistent across multiple calls', () => {
                const formatter = Utils.timeFormat(true, false, 0, true);
                const result1 = formatter(testDate);
                const result2 = formatter(testDate);
                expect(result1).toBe(result2);
            });

            it('should handle different dates with same formatter', () => {
                const formatter = Utils.timeFormat(false, false, 0, true);
                const date1 = new Date('2023-01-01T00:00:00Z');
                const date2 = new Date('2023-12-31T23:59:59Z');

                const result1 = formatter(date1);
                const result2 = formatter(date2);

                expect(result1).toContain('2023');
                expect(result1).toContain('01/01');
                expect(result2).toContain('2023');
                expect(result2).toContain('12/31');
            });

            it('should format for EventsTable (seconds, millis, 12/24-hour)', () => {
                // From EventsTable.ts: Utils.timeFormat(true, true, 0, this.chartOptions.is24HourTime, null, null, locale)
                const formatter24 = Utils.timeFormat(true, true, 0, true, null, null, 'en');
                const formatter12 = Utils.timeFormat(true, true, 0, false, null, null, 'en');

                const result24 = formatter24(testDate);
                const result12 = formatter12(testDate);

                expect(result24).toContain('14:30:45.123');
                expect(result12).toContain('02:30:45.123');
                expect(result12).toMatch(/PM/);
            });

            it('should format for PlaybackControls (seconds, no millis)', () => {
                // From PlaybackControls.ts: Utils.timeFormat(true, false, offset, is24HourTime, null, null, locale)
                const formatter = Utils.timeFormat(true, false, 0, true, null, null, 'en');
                const result = formatter(testDate);

                expect(result).toContain('14:30:45');
                expect(result).not.toContain('.123');
            });

            it('should format for Grid component', () => {
                // From Grid.ts: Utils.timeFormat(usesSeconds, usesMillis, offset, null, null, null, locale)
                const formatter = Utils.timeFormat(true, true, 0, true, null, null, 'en');
                const result = formatter(testDate);

                expect(result).toContain('14:30:45.123');
            });
        });

        describe('return value validation', () => {
            it('should return a function', () => {
                const formatter = Utils.timeFormat();
                expect(typeof formatter).toBe('function');
            });

            it('should return a function that returns a string', () => {
                const formatter = Utils.timeFormat();
                const result = formatter(testDate);
                expect(typeof result).toBe('string');
            });

            it('should never return empty string', () => {
                const formatter = Utils.timeFormat();
                const result = formatter(testDate);
                expect(result.length).toBeGreaterThan(0);
            });
        });
    });

});