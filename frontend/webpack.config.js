const path = require("path");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production", // Ensure production mode for minification
  optimization: {
    minimize: true, // Enable minification
    minimizer: [
      new TerserPlugin(), // Minify JavaScript
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css", // Minify and hash CSS files
      }),
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: "bundle-report.html",
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename: "stats.json",
      statsOptions: { source: false },
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
  ],
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist/frontend"),
  },
};
