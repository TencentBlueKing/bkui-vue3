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

// 自定义业务组件列表（非组件库内置，单独维护元信息）
export const customComponentList = [
  {
    name: '@blueking/date-picker',
    title: 'DatePicker',
    titleCN: '时间选择器',
    description: '业务组件 Date Picker， 用于页面上更复杂的时间选择使用，支持 Vue2/Vue3 版本 无差别使用',
  },
  {
    name: '@blueking/log-search',
    title: 'LogSearch',
    titleCN: '日志检索',
    description:
      '业务组件 Log Search， 由索引集选择、查询语句输入、过滤条件选择等多方检索条件组合而成，还包含了自动解析查询语句，切换自动查询或手动查询能力等。支持 Vue2/Vue3 版本 无差别使用',
  },
  {
    name: '@blueking/functional-dependency',
    title: 'FunctionalDeps',
    titleCN: '功能依赖展示',
    description:
      '业务组件 Functional Dependency， 用于蓝鲸平台下各个应用中功能依赖项展示使用，支持 Vue2/Vue3 版本 无差别使用',
  },
  {
    name: '@blueking/ediatable',
    title: 'Ediatable',
    titleCN: '可编辑表格',
    description: '业务组件 Ediatable， 用于可编辑表格的场景，支持 Vue2/Vue3 版本 无差别使用',
  },
  {
    name: '@blueking/release-note',
    title: 'ReleaseNote',
    titleCN: '版本日志',
    description: '业务组件 Release， 用于呈现产品版本更新明细的组件',
  },
  {
    name: '@blueking/crontab',
    title: 'Cronatb',
    titleCN: '周期选择器',
    description: 'Liunx 定时任务表达',
  },
  {
    name: '@blueking/status-tag',
    title: 'StatusTag',
    titleCN: '状态标签',
    description: '业务组件 Status Tag， 用于呈现状态标签的组件',
  },
];

// 文档「开始」分组列表
export const startList = [
  {
    name: 'start',
    title: '',
    titleCN: '快速上手',
    description: '本组件库基于Vue3研发，本节介绍如何在项目中结合 webpack 一起使用 @blueking/bkui-vue。',
  },
  {
    name: 'changelog',
    title: '',
    titleCN: '版本日志',
    description: '本组件库版本日志',
  },
];
