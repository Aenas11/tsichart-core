const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  entry: "./packages/core/src/UXClient.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: {
                declaration: false,
                sourceMap: true,
              },
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              api: "modern-compiler", // Use modern Sass API
              sassOptions: {
                // Silence deprecation warnings if needed
                silenceDeprecations: ['legacy-js-api'],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // Convert images < 8kb to base64 strings
          },
        },
        generator: {
          filename: "images/[hash][ext][query]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "tsiclient.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/dist/",
    libraryTarget: "umd",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'tsiclient.min.css',
    }),
  ],
    optimization: {
    minimize: true,
    minimizer: [
      `...`,
      new CssMinimizerPlugin(),
    ],
  },
  // New Webpack 5 caching for improved performance
  cache: {
    type: "filesystem",
  },
  // Performance hints configuration - library bundles are typically larger
  performance: {
    hints: false, // Disable warnings, or use 'warning' to keep them as warnings
    maxEntrypointSize: 5000000, // 5MB - increase if you want warnings at a higher threshold
    maxAssetSize: 5000000, // 5MB
  },
};
