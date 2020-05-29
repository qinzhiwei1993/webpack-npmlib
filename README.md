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

	- 变量，以 script 方式引用， 默认值。 node 环境不支持 
		- var 
		- assign

    	这两个属性，都是在全局创建一个变量，只有定义与未定义的区别，并不能在nodejs中得的支持，并且存在变量冲突的可能性

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

![Image text](https://github.com/qinzhiwei1993/webpack-npmlib/WX20200529-230205@2x.png)


    - 对象属性

    	- window

    		- 在window对象上定一个library设置的变量
    		- 不支持node

    	- global

    		- 在global对象上定义一个library设置的变量
    		- 受target属性影响，当target为默认值web时，会在window上注册，如果你想在global上注册，必须修改target为node

    	- this

    		- 在当前this对象上定义一个library设置的变量
    		- 如果this是window，就在window。在node的环境中，如果没指定require赋值的变量，并不会在指向global

    	- 生成代码示例

    		- https://pic4.zhimg.com/80/v2-132dbbbb3ae57ef1a1e5b16682471233_1440w.jpg

    	- demo

    		- const path = require("path");

// 定义在对象的属性上

// 1 定义在 window 属性上 以 script 方式引用

// 2 定义在 global 属性上

// 3 绑定在 this 上

module.exports = {
mode: "production",
entry: "./q-library/index.js",
target: 'node',// 默认值为 web， 如果想导出属性绑定在 gloabl 对象上，必须修改此属性为 node
output: {
path: path.resolve(process.cwd(), "./lib"),
filename: "q-library2.js",
library: "qlibrary2", // 模块名称
libraryTarget: 'global',
},
// externals: {
// lodash: {
// commonjs: "lodash",
// commonjs2: "lodash",
// amd: "lodash",
// root: "\_",
// },
// },
};

    - 模块定义

    	- commonjs

    		- 在export对象上定义library设置的变量
    		- 不支持浏览器

    	- commonjs2

    		- 直接用module.export导出export，会忽略library设置的变量
    		- 不支持浏览器

    	- amd

    		- 在define方法上定义library设置的变量，不能用script直接引用，必须通过第三方模块RequireJS来时用
    		- amd的依赖前置方案在浏览器、node中都必须额外引入RequireJS来使用

    	- umd

    		- 兼容的模块化定义

    			- 但是如果你想做到这一点，必须要额外设置，umdNamedDefine: true，globalObject: ‘this’，umdNamedDefine为设置amd前置名称使用library设置的变量，globalObject为改变全局指向

    		- 该方案支持commonjs、commonjs2、amd，可以在浏览器、node中通用
    		- 当然便捷的引入一定会带来一定的冗余，这就看你如何取舍了

    	- 最后建议，如果目标明确，我只是兼容nodejs，那么选择commonjs/commonjs2，如果只兼容浏览器，那就选择暴露变量的方式，如果想通用，那就选择umd的方式，对于不同的情况做多种处理方式，是非常明智的选择
    	- demo

    		- const path = require("path");

// 模块定义

// 1 commonjs 通过 exports 导出

// 2 commonjs2 通过 module.export 导出。会忽略 library 的值

// 3 amd 依赖前置， 无论在浏览器还是 node 中，必须通过 requirejs 使用。

// 4 umd 兼容 commonjs、commonjs2、amd、node 环境、浏览器环境的方案

module.exports = {
mode: "production",
entry: "./q-library/index.js",
// target: 'node',// 默认值为 web， 如果想导出属性绑定在 gloabl 对象上，必须修改此属性为 node
output: {
path: path.resolve(process.cwd(), "./lib"),
filename: "q-library3.js",
library: "qlibrary3", // 模块名称
libraryTarget: 'umd',
globalObject: 'this',
umdNamedDefine: true

},
// externals: {
// lodash: {
// commonjs: "lodash",
// commonjs2: "lodash",
// amd: "lodash",
// root: "\_",
// },
// },
};

    - 统计表格

    	- https://pic2.zhimg.com/80/v2-ee0dd359758d187d06abe280eb29f121_1440w.jpg

    - 在 webpack 3.5.5 中，使用 libraryTarget: { root:'_' } 将无法正常工作（参考 issue 4824) 所述）。然而，可以设置 libraryTarget: { var: '_' } 来将 library 作为全局变量。
    - 支持的属性

    	- var - 默认值

assign
this
window
global
commonjs
commonjs2
amd
umd
jsonp

- libraryExport

      	- 配置哪个或者那些模块将通过libraryTarget暴露出来
      	- default

      		- 配合commonjs2使用，直接获取导出的模块内容

### externals

- 如果构建的 library 依赖第三方 library，但是又不想把这个依赖打包到自己的 library 中。把依赖的主动权交给用户
- 这意味着你的 library 需要一个名为 lodash 的依赖，这个依赖在用户的环境中必须存在且可用
- externals: {
  lodash: {
  commonjs: 'lodash',
  commonjs2: 'lodash',
  amd: 'lodash',
  root: '\_'
  }
  }

### 外部扩展限制

- 对于从一个依赖目录中，调用多个文件的 library

      - import A from 'library/one';

  import B from 'library/two';

- 无法通过在 externals 中指定 library 目录的方式，将它们从 bundle 中排除。你需要逐个排除它们，或者使用正则表达式排除

      - externals: [

  'library/one',
  'library/two',
  // Everything that starts with "library/"
  /^library\/.+\$/
  ]

_XMind - Trial Version_
