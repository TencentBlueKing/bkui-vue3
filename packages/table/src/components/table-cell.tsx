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
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import { toType } from 'vue-types';

import { bkEllipsisInstance } from '@bkui-vue/directives';
import { hasOverflowEllipsis, isElement, PropTypes } from '@bkui-vue/shared';

import { IOverflowTooltip, overflowModeType, ResizerWay } from '../props';
import { observerResize } from '../utils';
// import
export default defineComponent({
  name: 'TableCell',
  props: {
    column: PropTypes.any.def({}),
    row: PropTypes.any.def({}),
    parentSetting: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape<IOverflowTooltip>({
      content: PropTypes.string.def(''),
      disabled: PropTypes.bool.def(false),
      watchCellResize: PropTypes.bool.def(true),
      mode: overflowModeType,
    })]).def(undefined),
    title: PropTypes.string.def(undefined),
    observerResize: PropTypes.bool.def(true),
    resizerWay: toType<`${ResizerWay}`>('ResizerWay', {
      default: ResizerWay.DEBOUNCE,
    }),
  },

  setup(props, { slots }) {
    const refRoot = ref();
    const isTipsEnabled = ref(false);

    const resolveSetting = () => {
      if (/boolean|object/.test(typeof props.column.showOverflowTooltip) && props.column.showOverflowTooltip !== null) {
        return props.column;
      }

      return { showOverflowTooltip: props.parentSetting };
    };

    const { showOverflowTooltip = false } = resolveSetting();
    let bkEllipsisIns = null;

    const resolveTooltipOption = () => {
      let disabled = true;
      let { resizerWay } = props;
      let content = refRoot.value.innerText;
      let mode = 'auto';
      let watchCellResize = true;
      if (typeof showOverflowTooltip === 'boolean') {
        disabled = !showOverflowTooltip;
      }

      if (typeof showOverflowTooltip === 'object') {
        disabled = showOverflowTooltip.disabled;
        resizerWay = showOverflowTooltip.resizerWay || 'debounce';
        content = showOverflowTooltip.content || refRoot.value.innerText;
        if (typeof showOverflowTooltip.content === 'function') {
          content = showOverflowTooltip.content(props.column, props.row);
        }

        watchCellResize = showOverflowTooltip.watchCellResize;
        mode = showOverflowTooltip.mode || 'auto';
      }

      if (typeof disabled === 'function') {
        disabled = Reflect.apply(disabled, this, [props.column, props.row]);
      }

      return { disabled, content, mode, resizerWay, watchCellResize };
    };

    const resolveOverflowTooltip = () => {
      if (!refRoot.value || !isElement(refRoot.value)) {
        return;
      }

      const { mode, disabled } = resolveTooltipOption();
      isTipsEnabled.value = !disabled;

      if (mode === 'auto') {
        isTipsEnabled.value = hasOverflowEllipsis(refRoot.value);
      }

      if (mode === 'static') {
        isTipsEnabled.value = true;
      }

      if (isTipsEnabled.value) {
        const bindings = ref(resolveTooltipOption());
        if (bkEllipsisIns === null) {
          bkEllipsisIns = bkEllipsisInstance(refRoot.value, {
            disabled: bindings.value.disabled,
            content: bindings.value.content,
            mode: bindings.value.mode,
          });
        }
      } else {
        bkEllipsisIns?.destroyInstance(refRoot.value);
        bkEllipsisIns = null;
      }
    };

    onMounted(() => {
      const { disabled, resizerWay, watchCellResize } = resolveTooltipOption();
      if (!disabled) {
        resolveOverflowTooltip();

        if (watchCellResize !== false && props.observerResize) {
          let observerIns = observerResize(refRoot.value, () => {
            resolveOverflowTooltip();
          }, 60, true, resizerWay);

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

    return () => <div class={['cell', props.column.type]} ref={ refRoot } title={ props.title }>
      { slots.default?.() }
    </div>;
  },
});
