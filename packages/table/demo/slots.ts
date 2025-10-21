/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2025 Tencent.  All rights reserved.
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

export default [
  {
    name: 'prepend',
    description: '插入至表格第一行之前的内容，会被固定在第一行',
  },
  {
    name: 'expandRow',
    description: '展开收起一行',
    params: [
      {
        name: 'row',
        type: 'Record<string, object>',
      },
    ],
  },
  {
    name: 'expandCell',
    description: '自定义展开收起单元格',
    params: [
      {
        name: 'args',
        type: '{ row: Record<string, object>; column: Column; index: number; rows: Array<Record<string, object>> }',
        link: '/component/table/api#Column',
      },
    ],
  },
  {
    name: 'expandContent',
    description: '自定义展开收起单元格内容（展开收起ICON内置）',
    params: [
      {
        name: 'row',
        type: 'Record<string, object>',
      },
    ],
  },
  {
    name: 'empty',
    description: '自定义空数据-empty插槽',
  },
  {
    name: 'default',
    description:
      '<bk-column />模板使用自定义显示默认插槽, 这里面参数 data & row 在使用时要注意，data是原始数据，在组件中没有被代理监听，这个数据主要是回传给调用方使用，例如接口调用；如果要绑定数据实现实时更新请使用 row，row是组件内被监听数据，包含一些组件内置属性和方法',
    params: [
      {
        name: '_args',
        type: '{ data: any; row: Record<string, object>; column: Column; index: number; rows: Array<Record<string, object>> }',
        link: '/component/table/api#Column',
      },
    ],
  },
  {
    name: 'fixedBottom',
    description: '底部加载插槽,此插槽内容会一直固定在底部, 可以结合 props.fixedBottom 进行详细配置',
  },
  {
    name: 'appendLastRow',
    description:
      '追加到最后一行插槽，区别于 #fixedBottom, 此插槽内容会追加最后一行数据之后，可以滚动，而fixedBottom内容固定底部（如果是虚拟滚动，这里暂时不支持）；注意：如果设置 append-last-row type=default时，会优先渲染 append-last-row 中配置的cellRender函数；',
  },
  {
    name: 'setting',
    description: '表格设置中间自定义插槽',
  },
];
