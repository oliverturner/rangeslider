const path = require("path");

console.log("hello", path.resolve(__dirname, "src"));

const config = {
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        include: [
          path.resolve(__dirname, "src"),
          path.resolve(__dirname, "../../src")
        ]
      }
    ]
  }
};

module.exports = config;
