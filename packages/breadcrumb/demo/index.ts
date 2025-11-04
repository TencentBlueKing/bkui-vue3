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

// 组件示例
const presets = [
    {
        title: '基础用法',
        description: '垂直菜单，子菜单内嵌在菜单区域。',
        props: {
            replace: true,
        },
        slots: {
            default: 
            `
            <bk-breadcrumb-item to='demo'>
                组件示例
            </bk-breadcrumb-item>
            <bk-breadcrumb-item to='api'>
                API文档
            </bk-breadcrumb-item>
            <bk-breadcrumb-item to='design'>
                设计规范
            </bk-breadcrumb-item>
            `,
        },
    },
];
// 组件属性，用来自动生成属性文档
const props = [
    {
        name: 'separator',
        description: '分隔符',
        type: 'string',
        default: '/',
    },
    {
        name: 'separator-class',
        description: '图标分隔符 class',
        type: 'string',
        default: '',
    },
    {
        name: 'back-router',
        description: '点击回退按钮自定义的路由(路由跳转对象，同 vue-router 的 to)',
        type: 'string | object',
        default: '',
    },
    {
        name: 'replace',
        description: '开启backRouter并使用默认的icon跳转时，是否替换当前路由历史',
        type: 'Boolean',
        default: false,
    },
    {
        name: 'ext-cls',
        description: '自定义样式类名',
        type: 'string',
        default: '',
    },
];

// 组件事件，用来自动生成事件文档
const emits = [
    {
        name: 'click',
        description: '点击时触发事件',
        type: 'function',
    },
];


const slots = [
    {
        name: 'default',
        description: '默认插槽，放置 BreadcrumbItem 组件',
        type: 'function',
    },
    {
        name: 'prefix',
        description: '插槽，用于替换默认回退按钮',
        type: 'slot',
    },
];

// 组件分组
const group = NavGroupMeta.Nav;

// 组件名称
const name = 'breadcrumb';

// 组件标签
const title = 'Breadcrumb';

// 组件中文标签
const titleCN = '面包屑';

// 组件描述
const description = 'Breadcrumb组件， 显示当前页面的路径，快速返回之前的任意页面';

const wiki: IComponentWiki = {
    group,
    name,
    slots,
    title,
    titleCN,
    props,
    emits,
    presets,
    description,
    children: [
        {
            name: 'Breadcrumb Item',
            props: [
                {
                    name: 'ext-cls',
                    description: '自定义样式类名',
                    type: 'string',
                },
                {
                    name: 'to',
                    description: '点击后跳转的链接，可以是一个路径或一个描述目标位置的对象',
                    type: 'string',
                },
                {
                    name: 'replace',
                    description: '是否替换当前的历史记录',
                    type: 'Boolean',
                },
            ],
            emits: [],
        },
        {
            name: 'dropdown-item',
            emits: [
                {
                    name: 'default',
                    description: '默认插槽，放置面包屑项的内容',
                    type: 'Slot'
                },
                {
                    name: 'separator',
                    description: '自定义分隔符插槽',
                    type: 'Slot'
                },
            ],
        },
    ],
};

export default wiki;
