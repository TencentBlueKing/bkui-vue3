# 使用用 bkui-vue

`bkui-vue` 支持两种引用方式，一种是 ` 完整引用`，一种是 `按需引入 `部分组件。

## 完整引用

在您的项目入口如下配置：

```js
import { createApp } from 'vue';
import App from './App.vue';
// 全量引入 bkui-vue
import bkui from 'bkui-vue';
// 全量引入 bkui-vue 样式
import 'bkui-vue/dist/style.css';

createApp(App).use(bkui).mount('#app');
```

## 按需引用

`bkui-vue`是天然支持 `import { Button } from 'bkui-vue'` 这种语法实现按需引入的。

如果在使用中遇到 `less` 文件没有被loader解析情况 则需要对应安装 `less-loader`并配置到您的项目构建中即可

之后就可以用如下语法形式来实现按需引用了

```js
import { Button } from 'bkui-vue';
```

## 构建配置

:::info
如果您的项目很早就使用了`bkui-vue` 同时也使用了完整引入方式
或者您项目只想使用完整引入但是需要使用到 类似`import { Button } from 'bkui-vue' `按需语法引入 `dts `组件类型文件
或者 您并不想安装 `less` 解析器
那么您可以在您的项目构建工具 加上下面一行简单的配置即可完整使用了
:::

- [Webpack 配置](https://webpack.js.org/configuration/resolve/#resolvealias)

  ```js
  // webpack config 配置
  {
    ...
    resolve: {
      alias: {
        'bkui-vue': 'bkui-vue/dist/index.esm.js'
      }
    }
  }
  ```

- [Vite 配置](https://vitejs.dev/config/shared-options#resolve-alias)

  ```js
  // vite config 配置
  {
    ...
    resolve: {
      alias: {
        'bkui-vue': 'bkui-vue/dist/index.esm.js'
      }
    }
  }
  ```

## 组件库暴露出来的一些工具方法

组件库暴露出了内部一些与组件逻辑无关的、通用的方法。目前暴露出来的有1个，如下：

:::info
无论是全量引入还是按需引入组件库或者是根本没有引入组件库，都可以使用如下方式使用组件库提供的工具方法
:::

```js
// 单独使用图标组件使用，可以使用如下方式引入
import Info from 'bkui-vue/lib/icon/info';
```