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
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import { toType } from 'vue-types';

import { bkEllipsisInstance } from '@bkui-vue/directives';
import { hasOverflowEllipsis, isElement, PropTypes } from '@bkui-vue/shared';

import { IColumnType, IOverflowTooltipPropType, ResizerWay } from '../props';
import { observerResize, resolvePropVal } from '../utils';
// import
export default defineComponent({
  name: 'TableCell',
  props: {
    column: IColumnType,
    row: PropTypes.any.def({}),
    parentSetting: IOverflowTooltipPropType,
    title: PropTypes.string.def(undefined),
    observerResize: PropTypes.bool.def(true),
    isHead: PropTypes.bool.def(false),
    headExplain: PropTypes.string,
    resizerWay: toType<`${ResizerWay}`>('ResizerWay', {
      default: ResizerWay.DEBOUNCE,
    }),
  },

  setup(props, { slots }) {
    const refRoot = ref();
    const isTipsEnabled = ref(false);

    const cellStyle = computed(() => ({
      textAlign: props.column.textAlign as any,
    }));

    const resolveSetting = () => {
      if (/boolean|object/.test(typeof props.column.showOverflowTooltip) && props.column.showOverflowTooltip !== null) {
        const result = {
          showOverflowTooltip: {
            content: '',
            disabled: !props.column.showOverflowTooltip,
            mode: undefined,
            resizerWay: undefined,
            watchCellResize: undefined,
            popoverOption: {},
          },
        };
        if (props.parentSetting !== null && typeof props.parentSetting === 'object') {
          Object.assign(result.showOverflowTooltip, props.parentSetting);
          Object.assign(result.showOverflowTooltip, { disabled: !props.column.showOverflowTooltip });

          if (typeof props.column.showOverflowTooltip === 'object') {
            Object.assign(result.showOverflowTooltip, props.column.showOverflowTooltip);
          }
        }

        return result;
      }

      return { showOverflowTooltip: props.parentSetting };
    };

    const { showOverflowTooltip = false } = resolveSetting();
    let bkEllipsisIns = null;

    const resolveTooltipOption = () => {
      let disabled = true;
      let { resizerWay } = props;
      let content = refRoot.value.innerText;
      let popoverOption = {};
      let mode = 'auto';
      let watchCellResize = true;
      if (typeof showOverflowTooltip === 'boolean') {
        disabled = !showOverflowTooltip;
      }

      if (typeof showOverflowTooltip === 'object') {
        disabled = (showOverflowTooltip as any).disabled;
        popoverOption = (showOverflowTooltip as any).popoverOption;
        resizerWay = (showOverflowTooltip as any).resizerWay || 'debounce';
        content = (showOverflowTooltip as any).content || refRoot.value.innerText;
        if (typeof (showOverflowTooltip as any).content === 'function') {
          content = (showOverflowTooltip as any).content(props.column, props.row);
        }

        watchCellResize = (showOverflowTooltip as any).watchCellResize;
        mode = (showOverflowTooltip as any).mode || 'auto';
      }

      if (typeof disabled === 'function') {
        disabled = Reflect.apply(disabled, this, [props.column, props.row]);
      }

      if (props.isHead) {
        disabled = false;
        mode = 'auto';
        content = getEllipsisTarget()?.innerHTML;

        if (props.headExplain) {
          mode = 'static';
          content = props.headExplain;
        }
      }

      /**
       * 当表格中的字段或数据需要做解释说明时，可增加 [下划线] 提示，hover 可查看解释说明的 tooltips
       */
      if (props.column.explain) {
        disabled = false;
        mode = 'static';

        if (typeof props.column.explain === 'object') {
          content = resolvePropVal(props.column.explain, 'content', [props.column, props.row]);
        }
      }

      return { disabled, content, mode, resizerWay, watchCellResize, popoverOption };
    };

    const getEllipsisTarget = () => {
      if (props.isHead) {
        return refRoot.value?.querySelector?.('.head-text');
      }

      return refRoot.value;
    };

    const resolveOverflowTooltip = () => {
      const target = getEllipsisTarget();
      if (!target || !isElement(target)) {
        return;
      }

      const { mode, disabled } = resolveTooltipOption();
      isTipsEnabled.value = !disabled;

      if (mode === 'auto') {
        isTipsEnabled.value = hasOverflowEllipsis(target);
      }

      if (mode === 'static') {
        isTipsEnabled.value = true;
      }

      if (isTipsEnabled.value) {
        const bindings = ref(resolveTooltipOption());
        if (bkEllipsisIns === null) {
          bkEllipsisIns = bkEllipsisInstance(target, {
            disabled: bindings.value.disabled,
            content: bindings.value.content,
            mode: bindings.value.mode,
            popoverOption: bindings.value.popoverOption,
          });
        }
      } else {
        bkEllipsisIns?.destroyInstance(target);
        bkEllipsisIns = null;
      }
    };

    onMounted(() => {
      const { disabled, resizerWay, watchCellResize } = resolveTooltipOption();
      if (!disabled) {
        resolveOverflowTooltip();
        if (watchCellResize !== false && props.observerResize) {
          let observerIns = observerResize(
            refRoot.value,
            () => {
              resolveOverflowTooltip();
            },
            60,
            true,
            resizerWay,
          );
          observerIns.start();
          onBeforeUnmount(() => {
            observerIns.disconnect();
            observerIns = null;
          });
        }
      }
    });

    onBeforeUnmount(() => {
      bkEllipsisIns?.destroyInstance(refRoot.value);
    });

    const hasExplain = props.headExplain || props.column.explain;
    return () => (
      <div
        class={['cell', props.column.type, hasExplain ? 'explain' : '']}
        style={cellStyle.value}
        ref={refRoot}
        title={props.title}
      >
        {slots.default?.()}
      </div>
    );
  },
});
