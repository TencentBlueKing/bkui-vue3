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
import { defineComponent, ExtractPropTypes, inject, reactive, ref, unref } from 'vue';

import { PropTypes } from '@bkui-vue/shared';

import { BK_COLUMN_UPDATE_DEFINE, COL_MIN_WIDTH, PROVIDE_KEY_INIT_COL, PROVIDE_KEY_TB_CACHE } from '../const';
import {
  Column,
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

export default defineComponent({
  name: 'TableColumn',
  props: TableColumnProp,
  setup(props: ITableColumn) {
    const initColumns = inject(PROVIDE_KEY_INIT_COL, (_col: Column | Column[], _rm = false) => {}, false);
    const bkTableCache = inject(PROVIDE_KEY_TB_CACHE, { queueStack: (_, fn) => fn?.() });
    const column = reactive(Object.assign({}, props, { field: props.prop || props.field }));
    const isIndexPropChanged = ref(false);
    const setIsIndexChanged = (val: boolean) => {
      isIndexPropChanged.value = val;
    };

    return {
      isIndexPropChanged,
      setIsIndexChanged,
      initColumns,
      bkTableCache,
      column,
    };
  },
  watch: {
    index: {
      handler() {
        this.setIsIndexChanged(!this.isIndexPropChanged);
      },
      deep: true,
    },
  },
  unmounted() {
    this.updateColumnDefine(true);
  },
  mounted() {
    this.updateColumnDefine();
  },
  updated() {
    if (this.isIndexPropChanged) {
      this.updateColumnDefineByParent();
      this.setIsIndexChanged(!this.isIndexPropChanged);
    }
  },
  methods: {
    updateColumnDefine(unmounted = false) {
      if (unmounted) {
        this.unmountColumn();
        return;
      }

      this.updateColumnDefineByParent();
    },
    copyProps(props: ITableColumn) {
      return Object.keys(props ?? {}).reduce((result, key) => {
        const target = key.replace(/-(\w)/g, (_, letter) => letter.toUpperCase());
        return Object.assign(result, { [target]: props[key] });
      }, {});
    },
    updateColumnDefineByParent() {
      const fn = () => {
        // @ts-ignore
        const selfVnode = (this as any)._;
        const getTableNode = () => {
          const parentVnode = selfVnode.parent;
          if (parentVnode.type?.name === 'Table') {
            return parentVnode.vnode;
          }
          return getTableNode();
        };

        const tableNode = getTableNode();
        if (!tableNode) {
          return;
        }

        const colList = tableNode.children.default() || [];

        const sortColumns = [];
        let index = 0;
        const reduceColumns = nodes => {
          if (!Array.isArray(nodes)) {
            return;
          }
          nodes.forEach((node: any) => {
            if (Array.isArray(node)) {
              reduceColumns(node);
              return;
            }

            let skipValidateKey0 = true;
            if (node.type?.name === 'TableColumn') {
              skipValidateKey0 = Object.hasOwnProperty.call(node.props || {}, 'key');
              const resolveProp = Object.assign({ index }, this.copyProps(node.props), {
                field: node.props.prop || node.props.field,
                render: node.children?.default,
              });
              sortColumns.push(unref(resolveProp));
              index = index + 1;
            }

            if (node.children?.length && skipValidateKey0 && node.type?.name !== 'Table') {
              reduceColumns(node.children);
            }
          });
        };
        reduceColumns(colList);
        this.initColumns(sortColumns);
      };

      if (typeof this.bkTableCache.queueStack === 'function') {
        this.bkTableCache.queueStack(BK_COLUMN_UPDATE_DEFINE, fn);
      }
    },
    unmountColumn() {
      const resolveProp = Object.assign({}, this.copyProps(this.$props), {
        field: this.$props.prop || this.$props.field,
        render: this.$slots.default,
      });
      this.initColumns(resolveProp as any, true);
    },
  },
  render() {
    return <>{this.$slots.default?.({ row: {} })}</>;
  },
});
