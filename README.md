# 构建 library

webpack 除了打包应用程序代码，还可以用于打包 JavaScript library

## 应用场景

1.提炼高可服用工具类 code

2.构建 UI 库

3.根据业务需求，在其他 UI 库的基础上做业务组件封装

...

## 兼容性

用户应该能够通过以下方式访问 library

- ES2015 模块

      	- import webpackNumbers from 'webpack-numbers'

- CommonJS 模块

      	- require('webpack-numbers')

- AMD
- CMD
- 全局变量，当通过 script 脚本引入时
- Nodejs

## output

跟 webpack 打包部署代码最大的不同点就在于 output 输出属性的配置上，webpack 为构建 lib 提供了 library，libraryTarget, libraryExport 等属性

```javascript
output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'myLib.js',
      library: 'myLib', // 暴露出去的变量的名字
      libraryTarget: 'umd'
    }
```

- library

      	暴露的模块名称。取决于 libraryTarget 的值,当 libraryTarget:commonjs2 时无效

- libraryTarget

      	暴露library的方式

1. 变量，以 script 方式引用， 默认值。 node 环境不支持

   - var
   - assign

   这两个属性，都是在全局创建一个变量，只有定义与未定义的区别，并不能在 nodejs 中得的支持，并且存在变量冲突的可能性

```javascript
module.exports = {
  mode: "production",
  entry: "./q-library/index.js",
  output: {
    path: path.resolve(process.cwd(), "./lib"),
    filename: "q-library.js",
    library: "qlibrary", // 模块名称
    libraryTarget: "assign",
  },
};
```

输出代码示例
![Image text](https://github.com/qinzhiwei1993/webpack-npmlib/raw/master/docs/images/WX20200529-230205%402x.png)

2. 对象属性
   - window。在 window 对象上定一个 library 设置的变量，不支持 node。
   - global。在 global 对象上定义一个 library 设置的变量。受 target 属性影响，当 target 为默认值 web 时，会在 window 上注册，如果你想在 global 上注册，必须修改 target 为 node
   - this。在当前 this 对象上定义一个 library 设置的变量。如果 this 是 window，就在 window。在 node 的环境中，如果没指定 require 赋值的变量，并不会在指向 global。

```javascript
module.exports = {
  mode: "production",
  entry: "./q-library/index.js",
  target: "node", // 默认值为 web， 如果想导出属性绑定在 gloabl 对象上，必须修改此属性为 node
  output: {
    path: path.resolve(process.cwd(), "./lib"),
    filename: "q-library2.js",
    library: "qlibrary2", // 模块名称
    libraryTarget: "global",
  },
};
```

输出代码示例
![Image text](https://github.com/qinzhiwei1993/webpack-npmlib/raw/master/docs/images/WX20200529-232244@2x.png)

3. 模块定义
   - commonjs。在 export 对象上定义 library 设置的变量，不支持浏览器。
   - commonjs2。直接用 module.export 导出 export，会忽略 library 设置的变量。不支持浏览器
   - amd。在 define 方法上定义 library 设置的变量，不能用 script 直接引用，必须通过第三方模块 RequireJS 来时用
   - umd。兼容的模块化定义。该方案支持 commonjs、commonjs2、amd，可以在浏览器、node 中通用。但是如果你想做到这一点，必须要额外设置，umdNamedDefine: true，globalObject: ‘this’，umdNamedDefine 为设置 amd 前置名称使用 library 设置的变量，globalObject 为改变全局指向。当然便捷的引入一定会带来一定的冗余，这就看你如何取舍了。最后建议，如果目标明确，我只是兼容 nodejs，那么选择 commonjs/commonjs2，如果只兼容浏览器，那就选择暴露变量的方式，如果想通用，那就选择 umd 的方式，对于不同的情况做多种处理方式，是非常明智的选择。

```javascript
module.exports = {
  mode: "production",
  entry: "./q-library/index.js",
  // target: 'node',// 默认值为 web， 如果想导出属性绑定在 gloabl 对象上，必须修改此属性为 node
  output: {
    path: path.resolve(process.cwd(), "./lib"),
    filename: "q-library3.js",
    library: "qlibrary3", // 模块名称
    libraryTarget: "umd",
    globalObject: "this",
    umdNamedDefine: true,
  },
};
```

输出代码示例
![Image text](https://github.com/qinzhiwei1993/webpack-npmlib/raw/master/docs/images/WX20200529-232630@2x.png)

![Image text](https://github.com/qinzhiwei1993/webpack-npmlib/raw/master/docs/images/WX20200529-232811@2x.png)

- libraryExport

配置哪个或者哪些模块将通过 libraryTarget 暴露出来

这个属性的常用方式是和 libraryTarget 一起使用

```javascript
// 将mudule.exports 的default直接导出
{
	libraryTarget: 'commonjs2',
	libraryExport: 'default'
}
```

## externals

- 如果构建的 library 依赖第三方 library，但是又不想把这个依赖打包到自己的 library 中。把依赖的主动权交给用户
- 这意味着你的 library 需要一个名为 lodash 的依赖，这个依赖在用户的环境中必须存在且可用

```javascript
externals: {
  lodash: {
  commonjs: 'lodash',
  commonjs2: 'lodash',
  amd: 'lodash',
  root: '\_'
  }
}
```
