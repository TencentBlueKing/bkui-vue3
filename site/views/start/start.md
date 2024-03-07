### 引入 bkui-vue

`bkui-vue` 支持两种引入方式，一种是全量引入，一种是按需引入部分组件。我们先介绍如何完整引入 `bkui-vue`。

### 完整引入

在 `webpack` 入口 `main.js` 中如下配置：

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 全量引入 bkui-vue
import bkui from 'bkui-vue'
// 全量引入 bkui-vue 样式
import 'bkui-vue/dist/style.css'

createApp(App)
.use(store)
.use(router)
.use(bkui)
.mount('#app')
```

### 按需引入

按需引入`bkui-vue`是天然支持 `import { Button } from 'bkui-vue'` 这种语法实现按需引入的。

如果在使用中遇到 `less` 文件没有被loader解析情况 则需要对应安装 `less-loader`并配置到您的项目构建中即可

之后就可以用如下语法形式来实现按需引用了

```js
import { Button } from 'bkui-vue'
import { Button as cc } from 'bkui-vue'
import { Button, Input } from 'bkui-vue'
import { Button as cc, Input as dd } from 'bkui-vue'
```
### 全局配置

全局引入组件库，具体使用如下：

完整引入：

```js
import { createApp } from 'vue'
import App from './App.vue'
import bkUi from 'bkui-vue'

createApp(App).use(bkUi)
```

按需引入：

```js
import Vue from 'vue'
import { Button } from 'bkui-vue'
```
### 组件库暴露出来的一些工具方法

组件库暴露出了内部一些与组件逻辑无关的、通用的方法。目前暴露出来的有1个，如下：

:::info
无论是全量引入还是按需引入组件库或者是根本没有引入组件库，都可以使用如下方式使用组件库提供的工具方法
:::

```js
// 单独使用图标组件使用，可以使用如下方式引入
import Info from 'bkui-vue/lib/icon/info'
```
