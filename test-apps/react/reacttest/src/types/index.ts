// TypeScript type definitions for the app

export interface ChartExample {
    title: string;
    description: string;
    code: string;
    data: unknown[];
    options?: Record<string, unknown>;
    dataOptions?: Record<string, unknown>[];
}

export interface NavigationItem {
    title: string;
    path?: string;
    items?: NavigationItem[];
}

export type ThemeType = 'light' | 'dark';

export interface ChartDataOptions {
    alias?: string;
    color?: string;
    dataType?: 'numeric' | 'categorical' | 'events';
    searchSpan?: {
        from: string;
        to: string;
        bucketSize: string;
    };
    measureTypes?: string[];
    includeEnvelope?: boolean;
    includeDots?: boolean;
    valueMapping?: Record<string, { color: string }>;
    height?: number;
    onElementClick?: (
        dataGroupName: string,
        timeSeriesName: string,
        timestamp: string,
        measures: unknown[]
    ) => void;
}

export interface ChartOptions {
    theme?: ThemeType;
    legend?: 'shown' | 'compact' | 'hidden';
    tooltip?: boolean;
    grid?: boolean;
    interpolationFunction?: string;
    yAxisState?: 'stacked' | 'shared' | 'overlap';
    includeEnvelope?: boolean;
    includeDots?: boolean;
    isArea?: boolean;
    stacked?: boolean;
    canDownload?: boolean;
    timestamp?: string;
    offset?: number | string;
    brushContextMenuActions?: BrushContextMenuAction[];
    spMeasures?: string[];
    isTemporal?: boolean;
    spAxisLabels?: string[];
}

export interface BrushContextMenuAction {
    name: string;
    action: (fromTime: Date, toTime: Date) => void;
}

export interface GroupContextMenuAction {
    name: string;
    action: (
        dataGroupName: string,
        timeSeriesName: string,
        timestamp: string
    ) => void;
}
