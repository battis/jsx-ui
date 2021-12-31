const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.s?[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: "postcss-Loader",
            options: {
              postcssOptions: {
                plugins: ["postcss-preset-env", "autoprefixer"],
              },
            },
          },
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./css/[name].css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./src/stylesheets",
          filter: (path) => /stylesheets\/_[^\/]+\.s?[ac]ss$/.test(path),
          to: "./sass",
        },
        {
          from: "./index.scss",
          to: "./sass/ui.scss",
        },
      ],
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [`...`, new CssMinimizerPlugin()],
    splitChunks: {
      chunks: "all",
    },
  },
});
