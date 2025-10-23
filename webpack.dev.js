const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

/* Used to run hot-reloading development server */
module.exports = merge(common, {
  mode: "development",
  devtool: "source-map", // Better for debugging TypeScript with proper source maps
  devServer: {
    static: [
      {
        directory: "pages/examples",
        watch: true, // Watch for changes in static files
      },
      {
        directory: "packages",
        publicPath: "/packages",
        watch: true,
      }
    ],
    server: "http",
    hot: true, // Enable hot module replacement
    port: 8080,
    liveReload: true, // Enable live reload as fallback
    watchFiles: {
      paths: ['packages/core/src/**/*', 'pages/**/*'], // Watch source and example files
      options: {
        usePolling: false, // Set to true if on Windows or networked filesystem
      },
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "tsiclient.css",
    }),
  ],
  output: {
    pathinfo: true,
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
  },
});
