// import typescript from '@wessberg/rollup-plugin-ts';
// import typescript from 'rollup-plugin-typescript2';
// import { nodeResolve } from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';
// import json from '@rollup/plugin-json';
// import postcss from 'rollup-plugin-postcss'
// import postcssUrl from "postcss-url";
// import autoExternal from 'rollup-plugin-auto-external';
// import visualizer from 'rollup-plugin-visualizer';
// import dts from "rollup-plugin-dts";
const typescript = require('rollup-plugin-typescript2');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const postcss = require('rollup-plugin-postcss');
const postcssUrl = require('postcss-url');
const autoExternal = require('rollup-plugin-auto-external');
const visualizer = require('rollup-plugin-visualizer').default;
const dts = require('rollup-plugin-dts').default;
const del = require('rollup-plugin-delete').default;

const directImports = {
    // TsiClient core    
    UXClient: 'src/UXClient/index.ts',
    Utils: 'src/UXClient/Utils/index.ts',
    tsiclient: 'src/TsiClient.ts', // Used to generated correctly referenced tsiclient.d.ts file.  

    // TsiClient models
    TsqExpression: 'src/UXClient/Models/TsqExpression.ts',
    AggregateExpression: 'src/UXClient/Models/AggregateExpression.ts',
    
    // Component imports 
    LineChart: 'src/UXClient/Components/LineChart/index.ts',
    AvailabilityChart: 'src/UXClient/Components/AvailabilityChart/index.ts',
    PieChart: 'src/UXClient/Components/PieChart/index.ts',
    ScatterPlot: 'src/UXClient/Components/ScatterPlot/index.ts',
    GroupedBarChart: 'src/UXClient/Components/GroupedBarChart/index.ts',
    Grid: 'src/UXClient/Components/Grid/index.ts',
    Slider: 'src/UXClient/Components/Slider/index.ts',
    Hierarchy: 'src/UXClient/Components/Hierarchy/index.ts',
    Heatmap: 'src/UXClient/Components/Heatmap/index.ts',
    EventsTable: 'src/UXClient/Components/EventsTable/index.ts',
    ModelSearch: 'src/UXClient/Components/ModelSearch/index.ts',
    DateTimePicker: 'src/UXClient/Components/DateTimePicker/index.ts',
    TimezonePicker: 'src/UXClient/Components/TimezonePicker/index.ts',
    EllipsisMenu: 'src/UXClient/Components/EllipsisMenu/index.ts',
    ModelAutocomplete: 'src/UXClient/Components/ModelAutocomplete/index.ts',
    HierarchyNavigation: 'src/UXClient/Components/HierarchyNavigation/index.ts',
    SingleDateTimePicker:'src/UXClient/Components/SingleDateTimePicker/index.ts',
    DateTimeButtonSingle: 'src/UXClient/Components/DateTimeButtonSingle/index.ts',
    DateTimeButtonRange: 'src/UXClient/Components/DateTimeButtonRange/index.ts',
    ProcessGraphic: 'src/UXClient/Components/ProcessGraphic/index.ts',
    PlaybackControls: 'src/UXClient/Components/PlaybackControls/index.ts',
    ColorPicker: 'src/UXClient/Components/ColorPicker/index.ts',
    GeoProcessGraphic: 'src/UXClient/Components/GeoProcessGraphic/index.ts' 
}

const commonPlugins = [
    nodeResolve(), // Resolve node_module imports
    typescript({ // Compile typescript, but leave declaration generatation to dts package
        tsconfigOverride: {
            compilerOptions: {
                declaration: false,
            }
        },
        exclude: 'src/packages'
    }), 
    autoExternal(), // Auto mark prod dependencies as external
    commonjs(), // Convert cjs imports to esm
    json(), // Handle json file imports
    postcss({ // Convert scss to css and inline svg's
        extract:'tsiclient.css',
        plugins: [
            postcssUrl({
                url: 'inline',
            })
        ],
        minimize: false,
        sourceMap: false,
        use: {
            sass: {
                api: 'modern-compiler', // Use modern Sass API
                silenceDeprecations: ['legacy-js-api'], // Silence deprecation warnings
            },
        },
    }),
]

/* Used to generate direct import bundle for each component, associated types, and unminified css */
module.exports = [
    // Generate .js bundles
    {
        input: {
            ...directImports
        },
        output: {
            dir: 'dist',
            format: 'esm',
            sourcemap: false,
        },
        context: "window",
        plugins: [
            del({ targets: 'dist/*' }),
            ...commonPlugins,
            visualizer({filename: 'build_artifacts/esm_stats.html'})  // Generate esm bundle stats
        ]
    },
    // Generate 'rolled-up' .d.ts definition files
    {
        input: {
            ...directImports
        },
        output: { dir: 'dist', format: 'esm' },
        plugins: [
            ...commonPlugins,
            dts(),
        ],
    }
];