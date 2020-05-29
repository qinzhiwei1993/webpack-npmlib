const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin"); // 打包进度
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 提取css至单独文件
module.exports = {
  mode: "production",
  entry: {
    app: ["./packages/index.js"],
  },
  output: {
    path: path.resolve(__dirname, "./lib"),
    filename: "my-libui.common.js",
    library: "MyLibUI",
    libraryTarget: "commonjs2",
    libraryExport: "default",
  },
  externals: {
    // 不将依赖模块lodash打包在lib内，将主动权交给业务项目
    lodash: {
      root: '_',
      commonjs: 'lodash',
      commonjs2: 'lodash',
      umd: 'lodash',
    }
  },
  //   performance: {
  //     hints: false
  //   },
  //   stats: {
  //     children: false
  //   },
  //   resolve: {
  //     extensions: ['.js', '.vue', '.json'],
  //     // alias: config.alias,
  //     alias: {
  //       '@': path.resolve('src')
  //     },
  //     modules: ['node_modules']
  //   },
  module: {
    rules: [
      {
        test: /\.(jsx?|babel|es6)$/,
        include: process.cwd(),
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: "vue-loader",
            options: {
              compilerOptions: {
                preserveWhitespace: false,
              },
            },
          },
          //   {
          //     loader: "element-loader",
          //   },
        ],
      },
      {
        test: /\.(le|c)ss/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
          "less-loader"
        ],
      },
      {
        test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
        loader: "url-loader",
        query: {
          limit: 100000,
          name: path.posix.join("static", "[name].[hash:7].[ext]"),
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/mylib.css",
    }),
    new ProgressBarPlugin(),
    new VueLoaderPlugin(),
  ],
};
