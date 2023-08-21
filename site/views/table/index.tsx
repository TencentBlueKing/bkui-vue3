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

import DemoBox from '../../components/demo-box';
import DemoTitle from '../../components/demo-title';
import PropsBox from '../../components/props-box';

import basic from './basic.vue';
import basicFilter from './basic-filter.vue';
import basicSort from './basic-sort.vue';
import BasicSpan from './basic-span.vue';
import bordered from './bordered.vue';
import cellRender from './cell-render';
import TableTplTsx from './column-template';
import ColumnTemplate from './column-template.vue';
import ColumnTplIndex from './column-template-index.vue';
import configList from './config';
import CustomHead from './custom-head.vue';
import DataEmpty from './data-empty.vue';
import event from './event.vue';
import Expand from './expand.vue';
import filterScope from './filter-scope.vue';
import fixed from './fixed.vue';
import * as TABLE_DATA from './options';
import pagination from './pagination.vue';
import RemotePagination from './remotePagination.vue';
import ScrollLoading from './scroll-loading.vue';
import ScrollLoadingSlot from './scroll-loading-slot.vue';
import Selection from './selection.vue';
import virtualRender from './virtual-render.vue';

export default defineComponent({
  components: {
    basic,
    bordered,
    virtualRender,
    cellRender,
    event,
    pagination,
    RemotePagination,
    DataEmpty,
    fixed,
    ScrollLoading,
    ScrollLoadingSlot,
    Expand,
    basicFilter,
    basicSort,
    filterScope,
    ColumnTemplate,
    Selection,
    BasicSpan,
    ColumnTplIndex,
    TableTplTsx,
    CustomHead,
  },
  render() {
    const configs = [
      {
        attrs: {
          title: '基础用法',
          subtitle: '基础用法，用于表单内容的录入',
          desc: '通过 stripe 设置是否为斑马纹',
          componentName: 'table',
          demoName: 'basic',
        },
        /**
         * Table
         * @returns
         */
        component: () => <basic></basic>,
      },
      {
        attrs: {
          title: '基础用法-模板方式调用 bk-column',
          subtitle: '基础用法，用于表单内容的录入',
          desc: 'props: 支持 `field` 和 `prop`两种配置，配置效果一样',
          componentName: 'table',
          demoName: 'column-template',
        },
        /**
         * Table
         * @returns
         */
        component: () => <ColumnTemplate></ColumnTemplate>,
      },
      {
        attrs: {
          title: '自定义Column index渲染',
          subtitle: 'column.index <bk-table-column></bk-table-column>',
          desc: '如果需要通过<bk-table-column></bk-table-column>方式渲染列表，但是列是动态可变的，可以通过指定列的index来保证表格列的排序，一般情况组件会自动获取排序，如果是深度定制的表格组件，可以通过指定index保证排序的正确性',
          componentName: 'table',
          demoName: 'column-template-index',
          suffix: '.vue',
        },
        /**
         * Table
         * @returns
         */
        component: () => <ColumnTplIndex></ColumnTplIndex>,
      },
      {
        attrs: {
          title: '自定义Column index渲染',
          subtitle: 'column.index <bk-table-column></bk-table-column>',
          desc: '如果需要通过<bk-table-column></bk-table-column>方式渲染列表，但是列是动态可变的，可以通过指定列的index来保证表格列的排序，一般情况组件会自动获取排序，如果是深度定制的表格组件，可以通过指定index保证排序的正确性',
          componentName: 'table',
          demoName: 'column-template',
          suffix: '.tsx',
        },
        /**
         * Table
         * @returns
         */
        component: () => <TableTplTsx></TableTplTsx>,
      },
      {
        attrs: {
          title: '设置边框',
          subtitle: '设置边框显示样式',
          desc: 'props: border',
          componentName: 'table',
          demoName: 'bordered',
        },
        /**
         * Table
         * @returns
         */
        component: () => <bordered></bordered>,
      }, {
        attrs: {
          title: '自定义头部',
          subtitle: 'custom head',
          desc: 'props: border',
          componentName: 'table',
          demoName: 'custom-head',
        },
        /**
         * Table
         * @returns
         */
        component: () => <CustomHead></CustomHead>,
      },
      {
        attrs: {
          title: '启用虚拟滚动-渲染大数据表格',
          subtitle: '大数据模式启用虚拟滚动',
          desc: 'props: virtual-enabled',
          componentName: 'table',
          demoName: 'virtual-render',
        },
        /**
         * Table
         * @returns
         */
        component: () => <virtual-render></virtual-render>,
      },
      {
        attrs: {
          title: '自定义Column渲染',
          subtitle: '自定义Column渲染',
          desc: 'props: column.render',
          componentName: 'table',
          demoName: 'cell-render',
          suffix: '.tsx',
        },
        /**
         * Table
         * @returns
         */
        component: () => <cell-render></cell-render>,
      },

      {
        attrs: {
          title: 'Events',
          subtitle: '自定义Column渲染',
          desc: 'props: column.render',
          componentName: 'table',
          demoName: 'event',
        },
        /**
         * Table
         * @returns
         */
        component: () => <event></event>,
      },
      {
        attrs: {
          title: 'Pagination - Local',
          subtitle: '分页配置',
          desc: 'props: pagination',
          componentName: 'table',
          demoName: 'pagination',
        },
        /**
         * Table
         * @returns
         */
        component: () => <pagination></pagination>,
      },
      {
        attrs: {
          title: 'Pagination - Remote',
          subtitle: '分页配置: remote-pagination = true',
          desc: 'props: pagination',
          componentName: 'table',
          demoName: 'remotePagination',
        },
        /**
         * Table
         * @returns
         */
        component: () => <RemotePagination></RemotePagination>,
      },
      {
        attrs: {
          title: 'Empty - 空数据提示',
          subtitle: '',
          desc: 'props: --',
          componentName: 'table',
          demoName: 'data-empty',
        },
        /**
         * Table
         * @returns
         */
        component: () => <data-empty></data-empty>,
      },
      {
        attrs: {
          title: '固定列',
          subtitle: '横纵内容过多时，可选择固定列',
          desc: 'props: column - fixed',
          componentName: 'table',
          demoName: 'fixed',
        },
        /**
         * Table
         * @returns
         */
        component: () => <fixed></fixed>,
      },
      {
        attrs: {
          title: '底部加载',
          subtitle: '配置底部加载更多',
          desc: '配置scroll-loading属性设置表格底部加载样式，结合scroll-end监听表格滚动至底部事件进行分页加载',
          componentName: 'table',
          demoName: 'scroll-loading',
        },
        /**
         * Table
         * @returns
         */
        component: () => <ScrollLoading></ScrollLoading>,
      },
      {
        attrs: {
          title: '底部加载插槽',
          subtitle: '自定义配置底部加载更多,需要设置 scroll-loading = true',
          desc: '配置scroll-loading属性设置表格底部加载样式，结合scroll-end监听表格滚动至底部事件进行分页加载',
          componentName: 'table',
          demoName: 'scroll-loading-slot',
        },
        /**
         * Table
         * @returns
         */
        component: () => <ScrollLoadingSlot></ScrollLoadingSlot>,
      },
      {
        attrs: {
          title: '折叠功能',
          subtitle: '结合slot expandRow',
          desc: '',
          componentName: 'table',
          demoName: 'expand',
        },
        /**
         * Table
         * @returns
         */
        component: () => <Expand></Expand>,
      },
      {
        attrs: {
          title: '自定义过滤配置',
          subtitle: '自定义保存 & 重置按钮',
          desc: '',
          componentName: 'table',
          demoName: 'basic-filter',
        },
        /**
         * Table
         * @returns
         */
        component: () => <basicFilter></basicFilter>,
      },
      {
        attrs: {
          title: '过滤范围',
          subtitle: '通过设置filterScope设置过滤范围为当前页面还是全部数据，如果是all，则过滤完毕会重置分页为首页',
          desc: '',
          componentName: 'table',
          demoName: 'filter-scope',
        },
        /**
         * Table
         * @returns
         */
        component: () => <filterScope></filterScope>,
      },
      {
        attrs: {
          title: '排序范围',
          subtitle: '通过设置sortScope设置排序范围为当前页面还是全部数据',
          desc: '',
          componentName: 'table',
          demoName: 'basic-sort',
        },
        /**
         * basicSort
         * @returns
         */
        component: () => <basicSort></basicSort>,
      },
      {
        attrs: {
          title: 'Selection',
          subtitle: '内置选择功能',
          desc: '',
          componentName: 'table',
          demoName: 'selection',
        },
        /**
         * basicSort
         * @returns
         */
        component: () => <Selection></Selection>,
      },
      {
        attrs: {
          title: '表格合并',
          subtitle: 'colspan & rowspan',
          desc: '',
          componentName: 'table',
          demoName: 'basic-span',
        },
        /**
         * basicSort
         * @returns
         */
        component: () => <BasicSpan></BasicSpan>,
      },
    ];

    /**
     * eventColumnMap
     * @returns
     */
    const eventColumnMap = {
      name: '名称',
      desc: '说明',
      params: '参数',
    };

    const QAColumMap = {
      name: '问题',
      desc: '说明',
    };


    const renderMap = {
      QA: QAColumMap,
      events: eventColumnMap,
    };
    return (
      <div>
        <DemoTitle
          name="Table"
          desc="Table组件， 为页面和功能提供列表。"
          designLink="https://bkdesign.bk.tencent.com/design/35"/>
        {
          configs.map(cfg => <DemoBox { ...cfg.attrs } optionData={ TABLE_DATA }>
            {
              cfg.component()
            }
            </DemoBox>
          )
        }
        {
          configList.map(cfg => <div>
            <PropsBox
              title={ cfg.title }
              columnMap={ renderMap[cfg.type] }
              subtitle={ cfg.subTile }
              propsData={ cfg.config }/>
          </div>)
        }
      </div>
    );
  },
});
