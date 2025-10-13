const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

/* Used to run hot-reloading development server */
module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: "pages/examples", // contentBase is replaced by static in Webpack 5    
    server: "http",
    hot: true, // Enable hot module replacement
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "tsiclient.css",
    }),
  ],
});
