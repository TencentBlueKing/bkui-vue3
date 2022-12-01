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

import { defineComponent } from 'vue';

import { treeProps } from '../../../packages/tree/src/props';
import DemoBox from '../../components/demo-box';
import DemoTitle from '../../components/demo-title';
import PropsBox from '../../components/props-box';
import { resolvePropsToDesData } from '../utils/index';

import async from './async.vue';
import autoConfig from './auto-config.vue';
import basic from './basic.vue';
import customNode from './custom-node.vue';
import draggable from './draggable.vue';
import draggableFunction from './draggable-function.vue';
import levelLine from './level-line.vue';
import * as TREE_DATA from './options';
import prefixIcon from './prefix-icon.vue';
import prefixIconJsx from './prefix-icon-jsx';
import search from './search.vue';
import selected from './selected.vue';
import virtualRender from './virtual-render.vue';

export default defineComponent({
  components: {
    basic,
    virtualRender,
    levelLine,
    prefixIcon,
    async,
    prefixIconJsx,
    autoConfig,
    customNode,
    search,
    draggable,
    draggableFunction,
    selected,
  },
  render() {
    const propsJson = resolvePropsToDesData(treeProps);

    const configs = [
      {
        attrs: {
          title: '基础用法',
          subtitle: '基础用法，用于表单内容的录入',
          desc: 'props: --',
          componentName: 'tree',
          demoName: 'basic',
        },
        component: () => <basic></basic>,
      },
      {
        attrs: {
          title: '启用虚拟滚动',
          subtitle: '启用虚拟滚动',
          desc: 'props: virtual-render',
          componentName: 'tree',
          demoName: 'virtual-render',
        },
        component: () => <virtual-render></virtual-render>,
      },
      {
        attrs: {
          title: '启用连线',
          subtitle: '启用连线',
          desc: 'props: level-line',
          componentName: 'tree',
          demoName: 'level-line',
        },
        component: () => <level-line></level-line>,
      },
      {
        attrs: {
          title: '自定义节点Icon',
          subtitle: '自定义节点Icon',
          desc: 'props: prefix-icon',
          componentName: 'tree',
          demoName: 'prefix-icon',
        },
        component: () => <prefix-icon></prefix-icon>,
      },
      {
        attrs: {
          title: '自定义节点Icon-jsx',
          subtitle: '自定义节点Icon',
          desc: 'props: prefix-icon',
          componentName: 'tree',
          demoName: 'prefix-icon-jsx',
          suffix: '.tsx',
        },
        component: () => <prefix-icon-jsx></prefix-icon-jsx>,
      },
      {
        attrs: {
          title: '自定义节点内容',
          subtitle: '自定义节点Icon',
          desc: 'props: prefix-icon',
          componentName: 'tree',
          demoName: 'custom-node',
        },
        component: () => <custom-node></custom-node>,
      },
      {
        attrs: {
          title: '异步加载节点数据',
          subtitle: '异步加载节点数据',
          desc: 'props: async',
          componentName: 'tree',
          demoName: 'async',
        },
        component: () => <async></async>,
      },
      {
        attrs: {
          title: '设置默认行为',
          subtitle: '默认连线 | 默认选中 | 默认展开',
          desc: 'props: --',
          componentName: 'tree',
          demoName: 'auto-config',
        },
        component: () => <auto-config></auto-config>,
      },
      {
        attrs: {
          title: '搜索配置',
          subtitle: '配置搜索行为',
          desc: 'props: --',
          componentName: 'tree',
          demoName: 'search',
        },
        component: () => <search></search>,
      },
      {
        attrs: {
          title: '可拖拽',
          subtitle: '通过 draggable 属性可让节点变为可拖拽。',
          desc: 'props: draggable',
          componentName: 'tree',
          demoName: 'draggable',
        },
        component: () => <draggable></draggable>,
      },
      {
        attrs: {
          title: '可拖拽限制',
          subtitle: '通过 disableDrag(nodeData)、disableDrop(nodeData) 函数返回值 限制drag与drop,比如目录不能drop',
          desc: 'props: draggable',
          componentName: 'tree',
          demoName: 'draggable-function',
        },
        component: () => <draggableFunction></draggableFunction>,
      },
      {
        attrs: {
          title: '设置默认选中',
          subtitle: '配置搜索行为',
          desc: 'props: --',
          componentName: 'tree',
          demoName: 'selected',
        },
        component: () => <selected></selected>,
      }];

    return (
      <div>
        <DemoTitle
          name="Tree"
          desc="Tree组件， 为页面和功能提供列表。"
          link="https://www.google.com.hk/"/>
          {
            configs.map(cfg => <DemoBox { ...cfg.attrs } optionData={ { ...TREE_DATA } }>
                 {
                   cfg.component()
                 }
              </DemoBox>)
          }
        <PropsBox propsData={propsJson}/>
      </div>
    );
  },
});
