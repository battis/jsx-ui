const path = require("path-browserify");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    index: "./index.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    library: {
      name: "BattisJsxUi",
      type: "umd",
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: { configFile: "tsconfig.dist.json" },
        },
      },
      {
        test: /\.s?[ac]ss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { importLoaders: 2 },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: ["postcss-preset-env"],
              },
            },
          },
          {
            loader: "sass-loader",
            options: { implementation: require("sass") },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: "raw-loader",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./src/stylesheets",
          filter: (filePath) =>
            /stylesheets\/(_[^\/]+|ui).s?[ac]ss$/.test(filePath),
          to: "./sass",
        },
      ],
    }),
  ],
  devtool: "inline-source-map",
  externals: [
    "@battis/jsx-components",
    "@battis/jsx-factory",
    "@battis/jsx-lib",
    "@battis/jsx-routing",
    "@battis/monkey-patches",
    "path-browserify",
    "uuid",
  ],
};
