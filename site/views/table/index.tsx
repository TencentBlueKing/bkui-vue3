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

import { defineComponent } from 'vue';

import DemoBox from '../../components/demo-box';
import DemoTitle from '../../components/demo-title';
import PropsBox from '../../components/props-box';
import basic from './basic.vue';
import basicFilter from './basic-filter.vue';
import basicSort from './basic-sort.vue';
import basicSortBehavior from './basic-sort-behavior.vue';
import BasicSpan from './basic-span.vue';
import bordered from './bordered.vue';
import cellRender from './cell-render';
import ColumnTemplate from './column-template.vue';
import configList from './config';
import CustomHead from './custom-head.vue';
import DataEmpty from './data-empty.vue';
import DataEmptyCell from './data-empty-cell.vue';
import event from './event.vue';
import Expand from './expand.vue';
import filterScope from './filter-scope.vue';
import fixed from './fixed.vue';
import MultiHeader from './multi-header.vue';
import * as TABLE_DATA from './options';
import pagination from './pagination.vue';
import RemotePagination from './remotePagination.vue';
import ScrollHorizontal from './scroll-horizontal.vue';
import ScrollLoading from './scroll-loading.vue';
import ScrollLoadingSlot from './scroll-loading-slot.vue';
import Selection from './selection.vue';
import virtualRender from './virtual-render.vue';
import heightTest from './height-test.vue';

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
    DataEmptyCell,
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
    CustomHead,
    basicSortBehavior,
    ScrollHorizontal,
    MultiHeader,
    heightTest,
  },
  render() {
    const configs = [
      // ==================== 数据与列 (data, columns, stripe) ====================
      {
        attrs: {
          title: '基础用法',
          subtitle: 'data / columns / stripe / height',
          desc: '通过 data 绑定数据源，columns 配置列。height 设置固定高度，数据超出时出现纵向滚动；stripe 设置斑马纹。',
          componentName: 'table',
          demoName: 'basic',
        },
        component: () => <basic></basic>,
      },

      // ==================== bk-table-column 模板模式 ====================
      {
        attrs: {
          title: 'bk-table-column 模板模式',
          subtitle: '<bk-table-column> 声明式用法',
          desc: '通过 <bk-table-column> 子组件声明列配置，支持 field / prop 绑定字段，支持 #default 插槽自定义渲染。',
          componentName: 'table',
          demoName: 'column-template',
        },
        component: () => <ColumnTemplate></ColumnTemplate>,
      },

      // ==================== 多级表头 (children, append-last-row) ====================
      {
        attrs: {
          title: '多级表头 & 统计行',
          subtitle: 'column.children / append-last-row',
          desc: '通过 column.children 实现多级表头分组；append-last-row 配置 type="summary" 实现表尾统计行。',
          componentName: 'table',
          demoName: 'multi-header',
        },
        component: () => <MultiHeader></MultiHeader>,
      },

      // ==================== 自定义渲染 (column.render) ====================
      {
        attrs: {
          title: '自定义列渲染',
          subtitle: 'column.render',
          desc: '通过 column.render 函数自定义单元格内容渲染。',
          componentName: 'table',
          demoName: 'cell-render',
          suffix: '.tsx',
        },
        component: () => <cellRender></cellRender>,
      },

      // ==================== 自定义表头 (thead, renderHead, label) ====================
      {
        attrs: {
          title: '自定义表头',
          subtitle: 'thead / column.label(Function)',
          desc: '通过 thead.cellFn 或 column.label 函数自定义表头渲染内容。',
          componentName: 'table',
          demoName: 'custom-head',
        },
        component: () => <CustomHead></CustomHead>,
      },

      // ==================== 边框 (border) ====================
      {
        attrs: {
          title: '边框设置',
          subtitle: 'border',
          desc: '通过 border 属性设置表格边框样式，支持 row / col / outer / none 组合。',
          componentName: 'table',
          demoName: 'bordered',
        },
        component: () => <bordered></bordered>,
      },

      // ==================== 列宽 (width, minWidth) ====================
      {
        attrs: {
          title: '列宽与最小宽度',
          subtitle: 'column.width / column.minWidth',
          desc: '通过 column.minWidth 设置最小列宽，当容器不足时出现横向滚动。',
          componentName: 'table',
          demoName: 'scroll-horizontal',
        },
        component: () => <ScrollHorizontal></ScrollHorizontal>,
      },

      // ==================== 固定列 (fixed) ====================
      {
        attrs: {
          title: '固定列',
          subtitle: 'column.fixed',
          desc: '通过 column.fixed 将列固定在左侧或右侧，横向滚动时固定列不随之移动。',
          componentName: 'table',
          demoName: 'fixed',
        },
        component: () => <fixed></fixed>,
      },

      // ==================== 虚拟滚动 (virtual-enabled) ====================
      {
        attrs: {
          title: '虚拟滚动',
          subtitle: 'virtual-enabled',
          desc: '通过 virtual-enabled 启用虚拟渲染，适用于大数据量场景。',
          componentName: 'table',
          demoName: 'virtual-render',
        },
        component: () => <virtualRender></virtualRender>,
      },

      // ==================== 分页 (pagination, remote-pagination) ====================
      {
        attrs: {
          title: '本地分页',
          subtitle: 'pagination',
          desc: '通过 pagination 配置分页参数，组件内部自动处理数据分页。',
          componentName: 'table',
          demoName: 'pagination',
        },
        component: () => <pagination></pagination>,
      },
      {
        attrs: {
          title: '远程分页',
          subtitle: 'remote-pagination',
          desc: '设置 remote-pagination=true 由外部控制数据请求和分页逻辑。',
          componentName: 'table',
          demoName: 'remotePagination',
        },
        component: () => <RemotePagination></RemotePagination>,
      },

      // ==================== 空数据 (empty-text, empty-cell-text) ====================
      {
        attrs: {
          title: '空数据提示',
          subtitle: 'empty-text / #empty',
          desc: '当 data 为空时展示空状态提示，支持 empty-text 配置或 #empty 插槽自定义。',
          componentName: 'table',
          demoName: 'data-empty',
        },
        component: () => <DataEmpty></DataEmpty>,
      },
      {
        attrs: {
          title: '单元格空数据',
          subtitle: 'empty-cell-text / is-empty-cell',
          desc: '通过 empty-cell-text 设置单元格数据为空时的展示内容，is-empty-cell 自定义空判定逻辑。',
          componentName: 'table',
          demoName: 'data-empty-cell',
        },
        component: () => <DataEmptyCell></DataEmptyCell>,
      },

      // ==================== 排序 (sort, sortScope, col-sort-behavior) ====================
      {
        attrs: {
          title: '排序',
          subtitle: 'column.sort / sort.sortScope',
          desc: '通过 column.sort 启用列排序，sortScope 控制排序范围为当前页或全部数据。',
          componentName: 'table',
          demoName: 'basic-sort',
        },
        component: () => <basicSort></basicSort>,
      },
      {
        attrs: {
          title: '列排序行为',
          subtitle: 'col-sort-behavior',
          desc: 'independent：列排序互斥，同时只有一列排序生效；interdependent：列排序可叠加。',
          componentName: 'table',
          demoName: 'basic-sort-behavior',
        },
        component: () => <basicSortBehavior></basicSortBehavior>,
      },

      // ==================== 过滤 (filter, filterScope) ====================
      {
        attrs: {
          title: '过滤',
          subtitle: 'column.filter',
          desc: '通过 column.filter 配置列过滤，支持自定义过滤函数、保存和重置按钮。',
          componentName: 'table',
          demoName: 'basic-filter',
        },
        component: () => <basicFilter></basicFilter>,
      },
      {
        attrs: {
          title: '过滤范围',
          subtitle: 'filter.filterScope',
          desc: '通过 filterScope 设置过滤范围：current 仅当前页；all 全部数据（过滤后分页重置为首页）。',
          componentName: 'table',
          demoName: 'filter-scope',
        },
        component: () => <filterScope></filterScope>,
      },

      // ==================== 选择 (selection) ====================
      {
        attrs: {
          title: '行选择',
          subtitle: 'column.type="selection"',
          desc: '通过设置 column.type="selection" 启用行选择功能，支持 selection-key、checked、is-row-select-enable 等配置。',
          componentName: 'table',
          demoName: 'selection',
        },
        component: () => <Selection></Selection>,
      },

      // ==================== 展开/折叠 (expand) ====================
      {
        attrs: {
          title: '行展开',
          subtitle: 'column.type="expand" / #expandRow',
          desc: '通过 column.type="expand" 添加展开列，结合 #expandRow 插槽自定义展开内容。',
          componentName: 'table',
          demoName: 'expand',
        },
        component: () => <Expand></Expand>,
      },

      // ==================== 合并单元格 (colspan, rowspan) ====================
      {
        attrs: {
          title: '合并单元格',
          subtitle: 'column.colspan / column.rowspan',
          desc: '通过 column.colspan 和 column.rowspan 实现单元格合并。',
          componentName: 'table',
          demoName: 'basic-span',
        },
        component: () => <BasicSpan></BasicSpan>,
      },

      // ==================== 滚动加载 (scroll-loading) ====================
      {
        attrs: {
          title: '底部滚动加载',
          subtitle: 'scroll-loading / @scroll-bottom',
          desc: '通过 scroll-loading 配置底部加载效果，结合 scroll-bottom 事件实现滚动分页加载。',
          componentName: 'table',
          demoName: 'scroll-loading',
        },
        component: () => <ScrollLoading></ScrollLoading>,
      },
      {
        attrs: {
          title: '底部加载插槽',
          subtitle: '#scrollLoading',
          desc: '设置 scroll-loading=true 后，通过插槽自定义底部加载区域内容。',
          componentName: 'table',
          demoName: 'scroll-loading-slot',
        },
        component: () => <ScrollLoadingSlot></ScrollLoadingSlot>,
      },

      // ==================== 事件 (Events) ====================
      {
        attrs: {
          title: '事件',
          subtitle: 'Events',
          desc: '表格支持 row-click、cell-click、select、select-all 等事件。',
          componentName: 'table',
          demoName: 'event',
        },
        component: () => <event></event>,
      },
      // {
      //   attrs: {
      //     title: '高度测试',
      //     subtitle: 'height-test',
      //     desc: '测试表格高度相关的功能。',
      //     componentName: 'table',
      //     demoName: 'height-test',
      //   },
      //   component: () => <heightTest></heightTest>,
      // },
    ];

    const eventColumnMap = {
      name: '名称',
      desc: '说明',
      params: '参数',
    };

    const qAColumMap = {
      name: '问题',
      desc: '说明',
    };

    const renderMap = {
      QA: qAColumMap,
      events: eventColumnMap,
    };
    return (
      <div>
        <DemoTitle
          desc='Table组件， 为页面和功能提供列表。'
          designLink='https://bkdesign.bk.tencent.com/design/35'
          name='Table'
        />
        {configs.map(cfg => (
          <DemoBox
            {...cfg.attrs}
            optionData={TABLE_DATA}
          >
            {cfg.component()}
          </DemoBox>
        ))}
        {configList.map(cfg => (
          <div>
            <PropsBox
              columnMap={renderMap[cfg.type]}
              propsData={cfg.config}
              subtitle={cfg.subTile}
              title={cfg.title}
            />
          </div>
        ))}
      </div>
    );
  },
});
