// Constants and default configurations for the test app

export const CHART_THEMES = {
    DARK: 'dark',
    LIGHT: 'light',
} as const;

export const DEFAULT_CHART_OPTIONS = {
    theme: CHART_THEMES.LIGHT,
    legend: 'shown',
    tooltip: true,
    grid: true,
    interpolationFunction: '',
    yAxisState: 'stacked',
    includeEnvelope: false,
    includeDots: false,
    isArea: false,
    stacked: false,
    canDownload: true,
};

export const COLOR_PALETTE = [
    '#008272',
    '#D869CB',
    '#FF8C00',
    '#4286f4',
    '#FD625E',
    '#F2C80F',
    '#3599B8',
    '#A66999',
    '#5F9B3E',
    '#E67C73',
];

export const CATEGORICAL_VALUE_MAPPING = {
    idle: { color: '#3599B8' },
    running: { color: '#5F9B3E' },
    maintenance: { color: '#F2C80F' },
    error: { color: '#FD625E' },
};

export const EVENT_VALUE_MAPPING = {
    Alert: { color: '#F2C80F' },
    Warning: { color: '#FF8C00' },
    Info: { color: '#3599B8' },
    Critical: { color: '#FD625E' },
};

export const NAVIGATION_ITEMS = [
    {
        title: 'Home',
        path: '/',
    },
    {
        title: 'Charts',
        items: [
            { title: 'Line Chart', path: '/charts/line' },
            { title: 'Bar Chart', path: '/charts/bar' },
            { title: 'Pie Chart', path: '/charts/pie' },
            { title: 'Heatmap', path: '/charts/heatmap' },
            { title: 'Scatter Plot', path: '/charts/scatter' },
        ],
    },
    {
        title: 'Interactive',
        items: [
            { title: 'Multi-Type Chart', path: '/interactive/multi-type' },
            { title: 'Brush Actions', path: '/interactive/brush' },
            { title: 'Group Actions', path: '/interactive/group' },
            { title: 'Zoom & Pan', path: '/interactive/zoom-pan' },
        ],
    },
    {
        title: 'UI Components',
        items: [
            { title: 'Date Time Picker', path: '/components/datetime-picker' },
            { title: 'Availability Chart', path: '/components/availability' },
            { title: 'Events Grid', path: '/components/events-grid' },
            { title: 'Slider', path: '/components/slider' },
        ],
    },
    {
        title: 'Advanced',
        items: [
            { title: 'Themes', path: '/advanced/themes' },
            { title: 'Data Formats', path: '/advanced/data-formats' },
            { title: 'Tree Shaking', path: '/advanced/tree-shaking' },
            { title: 'Custom Styling', path: '/advanced/custom-styling' },
        ],
    },
    {
        title: 'Playground',
        path: '/playground',
    },
];
