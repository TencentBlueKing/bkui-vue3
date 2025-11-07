/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) is licensed under the MIT License.
 *
 * License for 蓝鲸智云PaaS平台 (BlueKing PaaS):
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

import { NavGroupMeta, type IComponentWiki } from '@bkui-vue/shared';

const NEW_STR = `
  Vue.component('app-exception', Exception)
  Vue.component('app-auth', AuthComponent)

  auth.requestCurrentUser().then(user => {
      injectCSRFTokenToHeaders();
      if (!user.isAuthenticated) {
          auth.redirectToLogin();
      } else {
          global.bus = bus;
          global.mainComponent = new Vue({
              el: '#app',
              router,
              store,
              template: '<App/>',
              components: {
                  App
              }
          })
      }
  }, err => {
      let message;
      if (err.status === 403) {
          message = 'Sorry，您的权限不足!';
          if (err.data && err.data.msg) {
              message = err.data.msg;
          }
      } else {
          message = '无法连接到后端服务，请稍候再试。'
      }

      const divStyle = ''
          + 'text-align: left;'
          + 'width: 400px;'
          + 'margin: auto;'
          + 'position: absolute;'
          + 'left: 50%;'
          + 'transform: translate(-50%, -50%);'

      const h2Style = 'font-size: 20px;color: #979797; margin: 32px 0;font-weight: normal'
  })
`;

const OLD_STR = `
  Vue.component('app-exception', Exception)
  // Vue.component('app-auth', AuthComponent)

  auth.requestCurrentUser().then(user => {
      injectCSRFTokenToHeaders();
      if (!user.isAuthenticated) {
          auth.redirectToLogin()
      } else {
          global.bus = bus
          global.mainComponent = new Vue({
              el: '#app',
              router,
              store,
              template: '<App/>',
              components: {
                  App
              }
          })
      }
  }, err => {
      let message;
      if (err.status === 403) {
          message = 'Sorry，您的权限不足!'
          if (err.data && err.data.msg) {
              message = err.data.msg;
          }
      } else {
          message = '服务暂时未响应，请稍后再试。'
      }

      const divStyle = ''
          + 'text-align: center;'
          + 'width: 400px;'
          + 'margin: auto;'
          + 'position: absolute;'
          + 'top: 50%;'
          + 'left: 50%;'
          + 'transform: translate(-50%, -50%);'

      const h2Style = 'font-size: 20px;color: #979797; margin: 32px 0;font-weight: normal'
  })
`;

// 组件示例
const presets = [
  {
    title: '基础代码对比',
    description: '展示新旧代码的差异对比',
    props: {
      oldContent: OLD_STR,
      newContent: NEW_STR,
      language: 'javascript',
      theme: 'light',
      diffFormat: 'line-by-line',
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'oldContent',
    description: '旧代码内容',
    type: 'string',
    default: '',
  },
  {
    name: 'newContent',
    description: '新代码内容',
    type: 'string',
    default: '',
  },
  {
    name: 'diffFormat',
    description: '差异展示格式',
    type: 'string',
    options: ['side-by-side', 'line-by-line'],
    default: 'line-by-line',
  },
  {
    name: 'diffContext',
    description: '差异上下文行数，控制不同地方间隔多少行不隐藏',
    type: 'number',
    default: '',
  },
  {
    name: 'theme',
    description: '主题',
    type: 'string',
    options: ['dark', 'light'],
    default: 'light',
  },
  {
    name: 'language',
    description: '代码语言类型',
    type: 'string',
    options: [
      'css',
      'java',
      'javascript',
      'json',
      'scss',
      'less',
      'stylus',
      'shell',
      'bash',
      'cpp',
      'go',
      'xml',
      'python',
      'typescript',
      'sql',
      'ruby',
      'vim',
      'php',
      'perl',
      'powershell',
      'makefile',
    ],
    default: 'javascript',
  },
  {
    name: 'hljs',
    description: 'highlight.js 实例，用于代码高亮（必填）',
    type: 'any',
    default: '',
  },
];

// 组件事件，用来自动生成事件文档
const emits = [];

// 组件插槽，用来自动生成插槽文档
const slots = [];

// 组件分组
const group = NavGroupMeta.Data;

// 组件名称
const name = 'code-diff';

// 组件标签
const title = 'CodeDiff';

// 组件中文标签
const titleCN = '代码对比';

// 组件描述
const description = '代码差异对比组件，用于展示新旧代码的差异';

const wiki: IComponentWiki = {
  group,
  name,
  title,
  titleCN,
  props,
  emits,
  slots,
  presets,
  description,
};

export default wiki;
