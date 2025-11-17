/**
 * DateFormatter - A utility class for formatting dates using the Intl API
 * 
 * This class provides locale-aware date formatting functionality,
 * replacing the need for moment.js in date/time components.
 */

export interface DateFormatterOptions {
    locale?: string;
    timezone?: string;
}

export class DateFormatter {
    private locale: string;
    private timezone: string;

    // Cache for expensive computations
    private monthNamesCache: Map<string, string[]> = new Map();
    private weekdayNamesCache: Map<string, string[]> = new Map();

    constructor(options: DateFormatterOptions = {}) {
        this.locale = options.locale || 'en-US';
        this.timezone = options.timezone || 'UTC';
    }

    /**
     * Update the locale for this formatter
     */
    setLocale(locale: string): void {
        if (this.locale !== locale) {
            this.locale = locale;
            // Clear caches when locale changes
            this.monthNamesCache.clear();
            this.weekdayNamesCache.clear();
        }
    }

    /**
     * Update the timezone for this formatter
     */
    setTimezone(timezone: string): void {
        this.timezone = timezone;
    }

    /**
     * Get month names for the current locale
     * 
     * @param format - 'long' (default), 'short', or 'narrow'
     * @returns Array of 12 month names
     */
    getMonthNames(format: 'long' | 'short' | 'narrow' = 'long'): string[] {
        const cacheKey = `${this.locale}-${format}`;

        if (!this.monthNamesCache.has(cacheKey)) {
            const formatter = new Intl.DateTimeFormat(this.locale, { month: format });
            const names = Array.from({ length: 12 }, (_, i) => {
                const date = new Date(2000, i, 1);
                return formatter.format(date);
            });
            this.monthNamesCache.set(cacheKey, names);
        }

        return this.monthNamesCache.get(cacheKey)!;
    }

    /**
     * Get weekday names for the current locale
     * 
     * @param format - 'long' (default), 'short', or 'narrow'
     * @returns Array of 7 weekday names starting from Sunday
     */
    getWeekdayNames(format: 'long' | 'short' | 'narrow' = 'long'): string[] {
        const cacheKey = `${this.locale}-${format}`;

        if (!this.weekdayNamesCache.has(cacheKey)) {
            const formatter = new Intl.DateTimeFormat(this.locale, { weekday: format });
            // Start from Sunday (Jan 2, 2000 was a Sunday)
            const names = Array.from({ length: 7 }, (_, i) => {
                const date = new Date(2000, 0, 2 + i);
                return formatter.format(date);
            });
            this.weekdayNamesCache.set(cacheKey, names);
        }

        return this.weekdayNamesCache.get(cacheKey)!;
    }

    /**
     * Format a date with custom options
     * 
     * @param date - The date to format
     * @param options - Intl.DateTimeFormatOptions
     * @returns Formatted date string
     */
    format(date: Date, options?: Intl.DateTimeFormatOptions): string {
        const defaultOptions: Intl.DateTimeFormatOptions = {
            timeZone: this.timezone,
            ...options
        };

        try {
            return new Intl.DateTimeFormat(this.locale, defaultOptions).format(date);
        } catch (error) {
            console.warn(`Failed to format date for locale ${this.locale}:`, error);
            return date.toISOString();
        }
    }

    /**
     * Format a date/time with common presets
     */
    formatDateTime(date: Date, includeSeconds: boolean = false, includeMillis: boolean = false): string {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: this.timezone
        };

        if (includeSeconds) {
            options.second = '2-digit';
        }

        if (includeMillis) {
            // TypeScript doesn't have this in the type definition yet
            (options as any).fractionalSecondDigits = 3;
        }

        return this.format(date, options);
    }

    /**
     * Format just the date part
     */
    formatDate(date: Date): string {
        return this.format(date, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    /**
     * Format just the time part
     */
    formatTime(date: Date, includeSeconds: boolean = true): string {
        const options: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: this.timezone
        };

        if (includeSeconds) {
            options.second = '2-digit';
        }

        return this.format(date, options);
    }
}

/**
 * Create a DateFormatter instance with the given options
 */
export function createDateFormatter(options?: DateFormatterOptions): DateFormatter {
    return new DateFormatter(options);
}
