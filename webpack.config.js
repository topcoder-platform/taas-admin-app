/* global __dirname */
/* global process */
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");
const path = require("path");
const autoprefixer = require("autoprefixer");

const IS_DEV = process.env.APPMODE !== "production";

const cssLocalIdent = IS_DEV
  ? "taas_admin_[path][name]___[local]___[hash:base64:6]"
  : "[hash:base64:6]";

const srcDir = path.resolve(__dirname, "src");

module.exports = (webpackConfigEnv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "topcoder",
    projectName: "micro-frontends-taas-admin-app",
    webpackConfigEnv,
  });

  return webpackMerge.smart(defaultConfig, {
    output: {
      publicPath: "/taas-admin-app",
    },
    // modify the webpack config however you'd like to by adding to this object
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            { loader: "style-loader" },
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: cssLocalIdent,
                  auto: true,
                },
              },
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [autoprefixer],
                },
              },
            },
            // { loader: "resolve-url-loader" },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true,
                sassOptions: {
                  outputStyle: IS_DEV ? "expanded" : "compressed",
                  precision: 8,
                  includePaths: [path.join(srcDir, "styles")],
                },
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.(gif|jpg|png|svg)$/,
          include: /.*assets[/\\]images.+/,
          use: {
            loader: "url-loader",
            options: {
              limit: 4096,
            },
          },
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx", ".json", ".scss"],
      modules: [srcDir, "node_modules"],
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          APPMODE: JSON.stringify(process.env.APPMODE),
          APPENV: JSON.stringify(process.env.APPENV),
        },
      }),
      // ignore moment locales to reduce bundle size by 64kb gzipped
      // see solution details https://stackoverflow.com/questions/25384360/how-to-prevent-moment-js-from-loading-locales-with-webpack/25426019#25426019
      new webpack.IgnorePlugin(/^\.[/\\]locale$/, /moment$/),
    ],
  });
};
