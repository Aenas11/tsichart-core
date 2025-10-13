const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { terser } = require("@rollup/plugin-terser");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin"); // Replaces OptimizeCSSAssetsPlugin
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

/* Used to build UMD bundle, associated typings in dist/types, and minified css */
module.exports = [
  // UMD Development Bundle
  merge(common, {
    mode: "production",
    output: {
      filename: "tsiclient.umd.js",
      libraryTarget: "umd",
    },
    devtool: "source-map",
  }),
  // UMD Minified Bundle
  merge(common, {
    mode: "production",
    output: {
      filename: "tsiclient.umd.min.js",
      libraryTarget: "umd",
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
    devtool: "source-map",
  }),
  // ESM Bundle
  merge(common, {
    mode: "production",
    output: {
      filename: "tsiclient.esm.js",
      libraryTarget: "module",
      module: true,
    },
    experiments: {
      outputModule: true,
    },
    devtool: "source-map",
  }),
  // CJS Bundle
  merge(common, {
    mode: "production",
    output: {
      filename: "tsiclient.cjs.js",
      libraryTarget: "commonjs2",
    },
    devtool: "source-map",
  }),
  //   merge(common, {
  //   mode: "production",
  //   output: {
  //     filename: "tsiclient.umd.js",
  //     libraryTarget: "umd",
  //   },
  //   devtool: "source-map",
  //   plugins: [
  //     new BundleAnalyzerPlugin({
  //       generateStatsFile: true,
  //       analyzerMode: "disabled",
  //       statsFilename: "../build_artifacts/umd_stats.json",
  //     }),
  //     new MiniCssExtractPlugin({
  //       filename: "tsiclient.min.css",
  //     }),
  //   ],
  //   optimization: {
  //     minimize: true,
  //     minimizer: [
  //       new TerserPlugin(),
  //       new CssMinimizerPlugin(), // New CSS minification plugin
  //     ],
  //     moduleIds: "deterministic", // Webpack 5 optimization for consistent build hashes
  //     chunkIds: "deterministic",
  //   },
  // })
];
