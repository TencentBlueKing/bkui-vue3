/*
* Tencent is pleased to support the open source community by making
* 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
*
* Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
*
* 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) is licensed under the MIT License.
*
* License for 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition):
*
* ---------------------------------------------------
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
* documentation files (the "Software"), to deal in the Software without restriction, including without limitation
* the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
* to permit persons to whom the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of
* the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
* THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
* CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
* IN THE SOFTWARE.
*/
import orgPkg from '../../package.json';

export const htmlContent = `
<div id="app"></div>
<script type="module" src="/src/main.js"></script>
`;

export const mainJsContent = `
import { createApp } from 'vue';
import bkui from 'bkui-vue';
import Demo from './demo.vue';

// 引入组件库全局样式资源
import 'bkui-vue/dist/style.css'
import './index.css';

const app = createApp(Demo);

app.use(bkui).mount('#app');
`;

export const styleContent = `
body {
  margin: 8px;
}
`;

export const stackblitzRc = `
  {
    "installDependencies": false,
    "startCommand": "turbo && turbo dev"
  }
`;

export const viteConfigContent = `
  import { defineConfig } from 'vite';
  import vue from '@vitejs/plugin-vue';
  import vueJsx from '@vitejs/plugin-vue-jsx';

  export default defineConfig({
    plugins: [vue(), vueJsx()],
  });
`;

export const packageJSONContent = JSON.stringify(
  {
    name: 'bkui-vue-demo',
    version: '0.0.0',
    private: true,
    scripts: {
      dev: 'vite',
      build: 'vite build',
      serve: 'vite preview',
    },
    dependencies: {
      vue: orgPkg.devDependencies.vue,
      less: '^4.1.2',
      'bkui-vue': orgPkg.version,
    },
    devDependencies: {
      vite: orgPkg.devDependencies.vite,
      '@vue/compiler-sfc': orgPkg.devDependencies['@vue/compiler-sfc'],
      '@vitejs/plugin-vue': orgPkg.devDependencies['@vitejs/plugin-vue'],
      '@vitejs/plugin-vue-jsx': orgPkg.devDependencies['@vitejs/plugin-vue-jsx'],
    },
  },
  null,
  2,
);
