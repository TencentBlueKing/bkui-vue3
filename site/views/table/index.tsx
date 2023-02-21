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

import { defineAsyncComponent, defineComponent } from 'vue';

import DemoBox from '../../components/demo-box';
import DemoTitle from '../../components/demo-title';
import PropsBox from '../../components/props-box';
import i18n from '../../language/i18n';
import { getCookie } from '../utils/cookie';

// import basic from './basic.vue';
// import basicFilter from './basic-filter.vue';
// import basicSort from './basic-sort.vue';
// import BasicSpan from './basic-span.vue';
// import bordered from './bordered.vue';
import CellRender from './cell-render';
// import ColumnTemplate from './column-template.vue';
import configList from './config';
// import DataEmpty from './data-empty.vue';
// import event from './event.vue';
// import Expand from './expand.vue';
// import filterScope from './filter-scope.vue';
// import fixed from './fixed.vue';
import * as TABLE_DATA from './options';
// import pagination from './pagination.vue';
// import RemotePagination from './remotePagination.vue';
// import ScrollLoading from './scroll-loading.vue';
// import ScrollLoadingSlot from './scroll-loading-slot.vue';
// import Selection from './selection.vue';
// import virtualRender from './virtual-render.vue';

const lang = getCookie('blueking_language');

const BaseDemo = defineAsyncComponent(() => import(`./demo/${lang}/basic.vue`));
const BasicFilter = defineAsyncComponent(() => import(`./demo/${lang}/basic-filter.vue`));
const BasicSort = defineAsyncComponent(() => import(`./demo/${lang}/basic-sort.vue`));
const BasicSpan = defineAsyncComponent(() => import(`./demo/${lang}/basic-span.vue`));
const Bordered = defineAsyncComponent(() => import(`./demo/${lang}/bordered.vue`));
const ColumnTemplate = defineAsyncComponent(() => import(`./demo/${lang}/column-template.vue`));
const DataEmpty = defineAsyncComponent(() => import(`./demo/${lang}/data-empty.vue`));
const Pagination = defineAsyncComponent(() => import(`./demo/${lang}/pagination.vue`));
const RemotePagination = defineAsyncComponent(() => import(`./demo/${lang}/remotePagination.vue`));
const ScrollLoading = defineAsyncComponent(() => import(`./demo/${lang}/scroll-loading.vue`));
const ScrollLoadingSlot = defineAsyncComponent(() => import(`./demo/${lang}/scroll-loading-slot.vue`));
const Selection = defineAsyncComponent(() => import(`./demo/${lang}/selection.vue`));
const virtualRender = defineAsyncComponent(() => import(`./demo/${lang}/virtual-render.vue`));
const Events = defineAsyncComponent(() => import(`./demo/${lang}/event.vue`));
const Fixed = defineAsyncComponent(() => import(`./demo/${lang}/fixed.vue`));
const Expand = defineComponent(() => import(`./demo/${lang}/expand.vue`));
const FilterScope = defineAsyncComponent(() => import(`./demo/${lang}/filter-scope.vue`));

const { t } = i18n.global;

export default defineComponent({
  components: {
    BasicSpan,
    BasicSort,
    BasicFilter,
    Bordered,
    virtualRender,
    Events,
    Pagination,
    RemotePagination,
    DataEmpty,
    Fixed,
    ScrollLoading,
    ScrollLoadingSlot,
    FilterScope,
    ColumnTemplate,
    Selection,
    Expand,
    CellRender,
  },
  render() {
    const configs = [
      {
        attrs: {
          title: '基础用法',
          subtitle: '基础用法，用于表单内容的录入',
          desc: 'props: --',
          componentName: 'table',
          demoName: `demo/${lang}/basic`,
        },
        /**
         * Table
         * @returns
         */
        component: () => <BaseDemo />,
      },
      {
        attrs: {
          title: '基础用法-模板方式调用 bk-column',
          subtitle: '基础用法，用于表单内容的录入',
          desc: t('props: 支持 `field` 和 `prop`两种配置，配置效果一样'),
          componentName: 'table',
          demoName: `demo/${lang}/column-template`,
        },
        /**
         * Table
         * @returns
         */
        component: () => <ColumnTemplate />,
      },
      {
        attrs: {
          title: '设置边框',
          subtitle: '设置边框显示样式',
          desc: 'props: border',
          componentName: 'table',
          demoName: `demo/${lang}/bordered`,
        },
        /**
         * Table
         * @returns
         */
        component: () => <Bordered />,
      },
      {
        attrs: {
          title: '启用虚拟滚动-渲染大数据表格',
          subtitle: '大数据模式启用虚拟滚动',
          desc: 'props: virtual-enabled',
          componentName: 'table',
          demoName: `demo/${lang}/virtual-render`,
        },
        /**
         * Table
         * @returns
         */
        component: () => <virtual-render />,
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
        component: () => <cell-render />,
      },
      {
        attrs: {
          title: 'Events',
          subtitle: '自定义Column渲染',
          desc: 'props: column.render',
          componentName: 'table',
          demoName: `demo/${lang}/event`,
        },
        /**
         * Table
         * @returns
         */
        component: () => <Events />,
      },
      {
        attrs: {
          title: 'Pagination - Local',
          subtitle: '分页配置',
          desc: 'props: pagination',
          componentName: 'table',
          demoName: `demo/${lang}/pagination`,
        },
        /**
         * Table
         * @returns
         */
        component: () => <Pagination />,
      },
      {
        attrs: {
          title: 'Pagination - Remote',
          subtitle: '分页配置: remote-pagination = true',
          desc: 'props: pagination',
          componentName: 'table',
          demoName: `demo/${lang}/remotePagination`,
        },
        /**
         * Table
         * @returns
         */
        component: () => <RemotePagination />,
      },
      {
        attrs: {
          title: 'Empty - 空数据提示',
          subtitle: '',
          desc: 'props: --',
          componentName: 'table',
          demoName: `demo/${lang}/data-empty`,
        },
        /**
         * Table
         * @returns
         */
        component: () => <data-empty />,
      },
      {
        attrs: {
          title: '固定列',
          subtitle: '横纵内容过多时，可选择固定列',
          desc: 'props: column - fixed',
          componentName: 'table',
          demoName: `demo/${lang}/fixed`,
        },
        /**
         * Table
         * @returns
         */
        component: () => <Fixed />,
      },
      {
        attrs: {
          title: '底部加载',
          subtitle: '配置底部加载更多',
          desc: t('配置scroll-loading属性设置表格底部加载样式，结合scroll-end监听表格滚动至底部事件进行分页加载'),
          componentName: 'table',
          demoName: `demo/${lang}/scroll-loading`,
        },
        /**
         * Table
         * @returns
         */
        component: () => <ScrollLoading />,
      },
      {
        attrs: {
          title: '底部加载插槽',
          subtitle: '自定义配置底部加载更多,需要设置 scroll-loading = true',
          desc: t('配置scroll-loading属性设置表格底部加载样式，结合scroll-end监听表格滚动至底部事件进行分页加载'),
          componentName: 'table',
          demoName: `demo/${lang}/scroll-loading-slot`,
        },
        /**
         * Table
         * @returns
         */
        component: () => <ScrollLoadingSlot />,
      },
      {
        attrs: {
          title: '折叠功能',
          subtitle: '结合slot expandRow',
          desc: '',
          componentName: 'table',
          demoName: `demo/${lang}/expand`,
        },
        /**
         * Table
         * @returns
         */
        component: () => <Expand />,
      },
      {
        attrs: {
          title: '自定义过滤配置',
          subtitle: '自定义保存 & 重置按钮',
          desc: '',
          componentName: 'table',
          demoName: `demo/${lang}/basic-filter`,
        },
        /**
         * Table
         * @returns
         */
        component: () => <basicFilter />,
      },
      {
        attrs: {
          title: '过滤范围',
          subtitle: '通过设置filterScope设置过滤范围为当前页面还是全部数据，如果是all，则过滤完毕会重置分页为首页',
          desc: '',
          componentName: 'table',
          demoName: `demo/${lang}/filter-scope`,
        },
        /**
         * Table
         * @returns
         */
        component: () => <filterScope />,
      },
      {
        attrs: {
          title: '排序范围',
          subtitle: '通过设置sortScope设置排序范围为当前页面还是全部数据',
          desc: '',
          componentName: 'table',
          demoName: `demo/${lang}/basic-sort`,
        },
        /**
         * basicSort
         * @returns
         */
        component: () => <basicSort />,
      },
      {
        attrs: {
          title: 'Selection',
          subtitle: '内置选择功能',
          desc: '',
          componentName: 'table',
          demoName: `demo/${lang}/selection`,
        },
        /**
         * basicSort
         * @returns
         */
        component: () => <Selection />,
      },
      {
        attrs: {
          title: '表格合并',
          subtitle: 'colspan & rowspan',
          desc: '',
          componentName: 'table',
          demoName: `demo/${lang}/basic-span`,
        },
        /**
         * basicSort
         * @returns
         */
        component: () => <BasicSpan />,
      },
    ].map((item) => {
      if (Object.prototype.hasOwnProperty.call(item, 'attrs')) {
        const result = Object.assign(item, {
          attrs: {
            ...item.attrs,
            title: item?.attrs?.title?.length > 0 ? t(item.attrs.title) : item.attrs.title,
            subtitle: item?.attrs?.subtitle?.length > 0 ? t(item.attrs.subtitle) : item.attrs.subtitle,
            // desc:
            //   item?.attrs?.desc?.length > 0 ? t(item.attrs.desc) : item.attrs.desc,
          },
        });
        return result;
      }
      return item;
    });

    /**
     * eventColumnMap
     * @returns
     */
    const eventColumnMap = {
      name: t('名称'),
      desc: t('说明'),
      params: t('参数'),
    };

    return (
      <div>
        <DemoTitle name="Table" desc={t('Table组件， 为页面和功能提供列表')} link="https://www.google.com.hk/" />
        {configs.map(cfg => (
          <DemoBox {...cfg.attrs} optionData={TABLE_DATA}>
            {cfg.component()}
          </DemoBox>
        ))}
        {configList.map(cfg => (
          <div>
            {cfg.type === 'events' ? (
              <PropsBox title={cfg.title} columnMap={eventColumnMap} subtitle={cfg.subTile} propsData={cfg.config} />
            ) : (
              <PropsBox title={cfg.title} subtitle={cfg.subTile} propsData={cfg.config} />
            )}
          </div>
        ))}
      </div>
    );
  },
});
