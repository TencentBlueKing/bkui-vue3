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
import { defineComponent, ExtractPropTypes, inject, onMounted, onBeforeUnmount, watch, toRaw, h, getCurrentInstance } from 'vue';

import { PropTypes } from '@bkui-vue/shared';

import { COL_MIN_WIDTH, PROVIDE_KEY_INIT_COL, PROVIDE_KEY_COLUMN_REGISTRY } from '../const';
import { generateColumnId, ColumnRegistry } from '../hooks/use-column-registry';
import {
  columnType,
  fixedType,
  IFilterType,
  IOverflowTooltipPropType,
  ISortType,
  LabelFunctionStringType,
  RenderFunctionStringType,
  RowClassFunctionStringType,
  SpanFunctionStringType,
  StringNumberType,
  TableAlign,
} from '../props';

const TableColumnProp = {
  label: LabelFunctionStringType,
  field: LabelFunctionStringType,
  render: RenderFunctionStringType,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  minWidth: StringNumberType(COL_MIN_WIDTH),
  columnKey: PropTypes.string.def(''),
  showOverflowTooltip: IOverflowTooltipPropType,
  type: columnType,
  resizable: PropTypes.bool.def(true),
  fixed: PropTypes.oneOfType([PropTypes.bool, fixedType]).def(false),
  sort: ISortType,
  filter: IFilterType,
  colspan: SpanFunctionStringType.def(1),
  rowspan: SpanFunctionStringType.def(1),
  align: TableAlign,
  className: RowClassFunctionStringType,
  prop: LabelFunctionStringType,
  index: PropTypes.number.def(undefined),
};

export type ITableColumn = Partial<ExtractPropTypes<typeof TableColumnProp>>;

/**
 * 从 props 构建列配置
 */
const buildColumnConfig = (props: ITableColumn, slots?: Record<string, unknown>) => {
  return {
    label: props.label,
    field: props.field || props.prop,
    render: props.render ?? slots?.default,
    width: props.width,
    minWidth: props.minWidth,
    columnKey: props.columnKey,
    showOverflowTooltip: props.showOverflowTooltip,
    type: props.type,
    resizable: props.resizable,
    fixed: props.fixed,
    sort: props.sort,
    filter: props.filter,
    colspan: props.colspan,
    rowspan: props.rowspan,
    align: props.align,
    className: props.className,
    prop: props.prop,
  };
};

export default defineComponent({
  name: 'TableColumn',
  props: TableColumnProp,
  setup(props: ITableColumn, { slots }) {
    // 注入列注册表（新模式）
    const columnRegistry = inject<ColumnRegistry | null>(PROVIDE_KEY_COLUMN_REGISTRY, null);
    // 注入旧的初始化函数（降级模式）
    const initTableColumns = inject(PROVIDE_KEY_INIT_COL, () => {});

    // 获取父 TableColumn 的 ID（用于嵌套列）
    const instance = getCurrentInstance();
    const parentColumnId = (instance?.parent?.type as { name?: string })?.name === 'TableColumn'
      ? (instance?.parent as unknown as { columnId?: string })?.columnId
      : undefined;

    // 生成列 ID
    const columnId = generateColumnId();
    // 将 columnId 暴露到组件实例，供子列获取
    if (instance) {
      (instance as unknown as { columnId: string }).columnId = columnId;
    }

    // 标记是否使用注册表模式
    const useRegistryMode = !!columnRegistry;

    if (useRegistryMode) {
      // === 新模式：使用列注册表 ===

      // mounted 时注册列
      onMounted(() => {
        columnRegistry.registerColumn(columnId, buildColumnConfig(props, slots), parentColumnId);
      });

      // 监听关键 props 变化（不使用 deep: true，提升性能）
      watch(
        () => [
          props.label,
          props.field,
          props.prop,
          props.width,
          props.minWidth,
          props.fixed,
          props.sort,
          props.filter,
          props.type,
          props.resizable,
          props.colspan,
          props.rowspan,
          props.align,
          props.className,
          props.showOverflowTooltip,
        ],
        () => {
          columnRegistry.updateColumn(columnId, buildColumnConfig(props, slots));
        },
      );

      // unmounted 前注销列
      onBeforeUnmount(() => {
        columnRegistry.unregisterColumn(columnId);
      });
    } else {
      // === 降级模式：使用旧的全量解析 ===
      let lastPropsSnapshot = '';

      /**
       * 生成 props 快照用于比较
       */
      const getPropsSnapshot = () => {
        const rawProps = toRaw(props);
        // 只比较关键属性，忽略函数和 children
        const keyProps = {
          label: rawProps.label,
          field: rawProps.field,
          prop: rawProps.prop,
          width: rawProps.width,
          minWidth: rawProps.minWidth,
          fixed: rawProps.fixed,
          type: rawProps.type,
          resizable: rawProps.resizable,
          colspan: rawProps.colspan,
          rowspan: rawProps.rowspan,
          align: rawProps.align,
          className: typeof rawProps.className === 'string' ? rawProps.className : undefined,
        };
        return JSON.stringify(keyProps);
      };

      watch(
        () => [
          props.label,
          props.field,
          props.prop,
          props.width,
          props.minWidth,
          props.fixed,
          props.sort,
          props.filter,
          props.type,
          props.resizable,
          props.colspan,
          props.rowspan,
          props.align,
        ],
        () => {
          const snapshot = getPropsSnapshot();
          if (snapshot !== lastPropsSnapshot) {
            initTableColumns();
            lastPropsSnapshot = snapshot;
          }
        },
        { immediate: true },
      );

      onBeforeUnmount(() => {
        initTableColumns();
      });
    }
  },

  render() {
    try {
      const renderDefault = this.$slots.default?.({
        row: {},
        column: {},
        $index: -1,
      });
      const children = [renderDefault];

      const vnode = h('div', children);
      return vnode;
    } catch {
      return h('div', []);
    }
  },
});
