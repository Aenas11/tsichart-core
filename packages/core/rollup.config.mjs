import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import postcssUrl from 'postcss-url';
import autoExternal from 'rollup-plugin-auto-external';
import { visualizer } from 'rollup-plugin-visualizer';
import dts from 'rollup-plugin-dts';
import del from 'rollup-plugin-delete';
import terser from '@rollup/plugin-terser';

// Default to production unless explicitly set to development
const isProduction = process.env.NODE_ENV !== 'development';

// Plugin to ignore SCSS imports in type definitions
const ignoreScss = {
    name: 'ignore-scss',
    resolveId(source) {
        if (source.endsWith('.scss') || source.endsWith('.css')) {
            return { id: source, external: true };
        }
        return null;
    }
};

const commonPlugins = [
    nodeResolve(), // Resolve node_module imports
    typescript({ 
        check: false,
        clean: true,
        tsconfigOverride: {
            compilerOptions: {
                declaration: false,
                declarationMap: false,
                sourceMap: !isProduction,
                inlineSourceMap: false,
                inlineSources: false,
                noEmitOnError: false,
                skipLibCheck: true,
                strict: false,
                strictNullChecks: false,
                noImplicitAny: false
            },
            exclude: ['__tests__/**', '**/*.test.ts', '**/*.spec.ts']
        }
    }), 
    autoExternal({
        // Only externalize peerDependencies (d3), bundle everything else
        dependencies: false,
        peerDependencies: true
    }), 
    commonjs(), // Convert cjs imports to esm
    json(), // Handle json file imports
];

const postcssPlugin = postcss({
    extract: 'styles/index.css',
    plugins: [
        postcssUrl({
            url: 'inline',
        })
    ],
    minimize: isProduction,
    sourceMap: !isProduction,
    use: {
        sass: {
            api: 'modern-compiler',
            silenceDeprecations: ['legacy-js-api'],
        },
    },
});

export default [
    // ESM and CJS builds
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/index.mjs',
                format: 'esm',
                sourcemap: !isProduction,
            },
            {
                file: 'dist/index.js',
                format: 'cjs',
                sourcemap: !isProduction,
                exports: 'named',
            }
        ],
        context: 'window',
        plugins: [
            del({ targets: 'dist/*' }),
            ...commonPlugins,
            postcssPlugin,
            isProduction && terser(),
            visualizer({ 
                filename: '../../build_artifacts/core-bundle-stats.html',
                gzipSize: true
            })
        ].filter(Boolean)
    },
    // UMD build for browser usage - bundle all dependencies
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.umd.js',
            format: 'umd',
            name: 'TsiClient',
            sourcemap: !isProduction,
            exports: 'named',
        },
        context: 'window',
        plugins: [
            nodeResolve({
                browser: true,
                preferBuiltins: false
            }),
            typescript({ 
                check: false,
                clean: true,
                tsconfigOverride: {
                    compilerOptions: {
                        declaration: false,
                        declarationMap: false,
                        sourceMap: !isProduction,
                        inlineSourceMap: false,
                        inlineSources: false,
                        noEmitOnError: false,
                        skipLibCheck: true,
                        strict: false,
                        strictNullChecks: false,
                        noImplicitAny: false
                    },
                    exclude: ['__tests__/**', '**/*.test.ts', '**/*.spec.ts']
                }
            }),
            commonjs(),
            json(),
            postcss({
                extract: false, // Don't extract CSS for UMD build
                inject: false,  // Don't inject CSS
                plugins: [
                    postcssUrl({
                        url: 'inline',
                    })
                ],
                minimize: isProduction,
                sourceMap: !isProduction,
                use: {
                    sass: {
                        api: 'modern-compiler',
                        silenceDeprecations: ['legacy-js-api'],
                    },
                },
            }),
            isProduction && terser(),
        ].filter(Boolean)
    },
    // Type definitions
    {
        input: 'src/index.ts',
        output: { 
            file: 'dist/index.d.ts', 
            format: 'esm' 
        },
        external: [/\.scss$/, /\.css$/],
        plugins: [
            ignoreScss,
            dts(),
        ],
    }
];
