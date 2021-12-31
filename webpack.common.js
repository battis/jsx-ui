const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    index: "./index.ts",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: path.resolve(__dirname, "tsconfig.dist.json"),
            },
          },
        ],
        exclude: [/node_modules/, /tests/, /\.(test|unit|fixture)\.tsx?$/],
      },
      {
        test: /\.svg$/,
        use: "raw-loader",
      },
      {
        test: /\.(jpe?g|gif|png)/,
        loader: "file-loader",
        options: {
          name: "[name].[contenthash].[ext]",
          outputPath: path.join("assets", "images"),
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      path: require.resolve("path-browserify"),
      stream: false,
    },
  },
  plugins: [new CleanWebpackPlugin()],
};
