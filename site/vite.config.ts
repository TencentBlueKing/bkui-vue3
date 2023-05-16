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

import { resolve } from 'path';
import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

import md from './vite-md';
const base = process.env.PUBLIC_PATH || '/';
export default defineConfig({
  base,
  resolve: {
    alias: [
      // {
      //   find: '@bkui-vue',
      //   replacement: resolve(__dirname, '../packages')
      // },
      // {
      //   find: '@',
      //   replacement: resolve(__dirname, 'src')
      // }
      {
        find: '@site',
        replacement: resolve(__dirname, '.'),
      },
      {
        find: /^@?bkui-vue\/lib\/icon/,
        replacement: resolve(__dirname, '../packages/icon/src/index'),
      },
      {
        find: /^bkui-vue$/,
        replacement: resolve(__dirname, '../packages/bkui-vue/index'),
      },
      {
        find: /^@?bkui-vue\/(icon\/)/,
        replacement: resolve(__dirname, '../packages/$1'),
      },
      {
        find: /^@?bkui-vue\/([^/]*)/,
        replacement: resolve(__dirname, '../packages/$1/src'),
      },
    ],
  },
  plugins: [
    vueJsx(),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    md,
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    fs: {
      strict: false,
    },
  },
});
