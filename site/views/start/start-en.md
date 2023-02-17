###  Import bkui-vue

`bkui-vue` Two import methods are supported, one is full import, and the other is to import some components as required. Let's first introduce how to fully introduce `bkui-vue`。

### Full import

Configure the following in the 'webpack' entry 'main. js':

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// Full import bkui-vue
import bkui from 'bkui-vue'
// Full import bkui-vue style
import 'bkui-vue/dist/style.css'

createApp(App)
.use(store)
.use(router)
.use(bkui)
.mount('#app')
```

###  Imported on demand

:::info
In particular, it is important to note that on-demand import is done during use, that is, just import `import { bkButton } from 'bkui-vue'` component,However, if no 'bkButton' component is used, the 'bkButton' component will not be imported.
:::

Imported on demand We need to use [babel-plugin-import-bkui-vue](https://www.npmjs.com/package/babel-plugin-import-bkui-vue) To achieve.

First, install ` babel-plugin-import`

```bash
npm i babel-plugin-import-bkui-vue -D
```

Then you need to add a line of configuration to the 'plugins' in the'. babelrc 'file of the project

```js
{
  "presets": ...,
  "plugins": [
    ...
    [
      "import-bkui-vue",
      {
        "libraryName": "bkui-vue",
        "style": true
      }
    ]
  ]
}
```

Then you can use the following syntax to imported on-demand reference

```js
import { Button } from 'bkui-vue'
import { Button as cc } from 'bkui-vue'
import { Button, Input } from 'bkui-vue'
import { Button as cc, Input as dd } from 'bkui-vue'
console.log(Button)
console.log(cc)
console.log(DropdownMenu)
console.log(dd)
```
### Global configuration

The component library is imported globally. The specific use is as follows:

Full import:

```js
import { createApp } from 'vue'
import App from './App.vue'
import bkUi from 'bkui-vue'

createApp(App).use(bkUi)
```

Imported on demand:

```js
import Vue from 'vue'
import { Button } from 'bkui-vue'
```
###Some tool methods exposed by component library

The component library exposes some general methods that are independent of the component logic. At present, one is exposed, as follows:

:::info
Whether the component library is imported in full or on demand or not at all, the tools and methods provided by the component library can be used in the following ways
:::

```js
// Use the icon component alone, which can be imported in the following ways
import Info from 'bkui-vue/lib/icon/info'
```
