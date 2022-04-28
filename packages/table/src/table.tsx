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

import { defineComponent, onBeforeUnmount, onMounted, reactive, ref, watchEffect } from 'vue';

import { resolveClassName } from '@bkui-vue/shared';
import VirtualRender from '@bkui-vue/virtual-render';

import useActiveColumns from './plugins/use-active-columns';
import userPagination from './plugins/use-pagination';
import { tableProps } from './props';
import TableRender, { EVENTS } from './render';
import { useClass } from './use-common';
import {
  observerResize,
  resolveColumnWidth,
} from './utils';

export default defineComponent({
  name: 'Table',
  props: tableProps,
  emits: ['columnPick', 'rowClick', 'rowDblClick', 'pageLimitChange', 'pageValueChange'],
  setup(props, ctx) {
    const colgroups = reactive(props.columns.map(col => ({ ...col, calcWidth: null })));
    let columnSortFn: any = null;
    let columnFilterFn: any = null;

    let observerIns = null;
    const root = ref();
    const refVirtualRender = ref();

    const { activeColumns } = useActiveColumns(props);
    const { pageData, localPagination, resolvePageData, watchEffectFn } = userPagination(props);
    const {
      tableClass,
      headClass,
      contentClass,
      footerClass,
      wrapperStyle,
      contentStyle,
      headStyle,
      resetTableHeight,
    } = useClass(props);

    const reactiveProp = reactive({
      scrollTranslateY: 0,
      activeColumns,
      setting: {
        size: null,
        height: null,
      },
    });
    const tableRender = new TableRender(props, ctx, reactiveProp, colgroups);

    watchEffect(() => {
      watchEffectFn(columnFilterFn, columnSortFn);
    });

    /**
     * 监听Table 派发的相关事件
     */
    tableRender.on(EVENTS.ON_SORT_BY_CLICK, (args: any) => {
      const { sortFn } = args;
      columnSortFn = sortFn;
      pageData.sort(columnSortFn);
    }).on(EVENTS.ON_FILTER_CLICK, (args: any) => {
      const { filterFn } = args;
      columnFilterFn = filterFn;
      resolvePageData(columnFilterFn, columnSortFn);
    })
      .on(EVENTS.ON_SETTING_CHANGE, (args: any) => {
        const { checked = [] } = args;
        checked.length && resolveColumnWidth(root.value, colgroups, 20);
        refVirtualRender.value?.reset?.();
      });


    const handleScrollChanged = (args: any[]) => {
      const pagination = args[1];
      reactiveProp.scrollTranslateY = pagination.translateY;
    };

    onMounted(() => {
      observerIns = observerResize(root.value, () => {
        resolveColumnWidth(root.value, colgroups, 20);
        resetTableHeight(root.value);
      }, 60, true);

      observerIns.start();
    });

    onBeforeUnmount(() => {
      observerIns.stop();
      observerIns = null;
      tableRender.destroy();
    });

    ctx.expose({
      plugins: tableRender.plugins,
    });

    return () => <div class={tableClass.value} style={wrapperStyle.value} ref={root}>
      {
        // @ts-ignore:next-line
        <div class={ headClass } style={headStyle}>
        {
          tableRender.renderTableHeadSchema()
        }
      </div>
      }
      <VirtualRender
        ref={refVirtualRender}
        lineHeight={tableRender.getRowHeight}
        class={ contentClass }
        style={ contentStyle.value }
        list={pageData}
        onContentScroll={ handleScrollChanged }
        throttleDelay={0}
        enabled={props.virtualEnabled}>
          {
            {
              default: (scope: any) => tableRender.renderTableBodySchema(scope.data || props.data),
              afterContent: () => <div class={ resolveClassName('table-fixed') }></div>,
            }
          }
      </VirtualRender>
      <div class={ footerClass.value }>
        {
          props.pagination && props.data.length && tableRender.renderTableFooter(localPagination.value)
        }
      </div>
    </div>;
  },
});

