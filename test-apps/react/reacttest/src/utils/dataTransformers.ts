// Data transformation utilities

/**
 * Transform data format for different chart requirements
 */
export function transformToNumericFormat(rawData: Record<string, unknown>[]): unknown[] {
    // Add transformation logic as needed
    return rawData;
}

/**
 * Add search span to chart data options
 */
export function addSearchSpan(
    from: string,
    to: string,
    bucketSize: string = '1m'
) {
    return {
        from,
        to,
        bucketSize,
    };
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(
    timestamp: string,
    includeTime: boolean = true
): string {
    const date = new Date(timestamp);

    if (includeTime) {
        return date.toLocaleString();
    }

    return date.toLocaleDateString();
}

/**
 * Generate color from index
 */
export function getColorFromIndex(index: number, palette: string[]): string {
    return palette[index % palette.length];
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}
