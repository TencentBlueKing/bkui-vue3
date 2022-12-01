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

import { bkEllipsisInstance } from '@bkui-vue/directives';
import { isElement, PropTypes  } from '@bkui-vue/shared';

import { IOverflowTooltip } from '../props';
import { getElementTextWidth, observerResize } from '../utils';
export default defineComponent({
  name: 'TableCell',
  props: {
    column: PropTypes.any.def({}),
    row: PropTypes.any.def({}),
    parentSetting: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape<IOverflowTooltip>({
      content: PropTypes.string.def(''),
      disabled: PropTypes.bool.def(false),
      watchCellResize: PropTypes.bool.def(true),
      mode: PropTypes.string.def('auto'),
    })]).def(undefined),
    title: PropTypes.string.def(undefined),
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
    let observerIns = null;
    let bkEllipsisIns = null;

    const resolveTooltipOption = () => {
      let disabled = true;
      let content = refRoot.value.innerText;
      let mode = 'auto';
      if (typeof showOverflowTooltip === 'boolean') {
        disabled = !showOverflowTooltip;
      }

      if (typeof showOverflowTooltip === 'object') {
        disabled = showOverflowTooltip.disabled;
        if (typeof showOverflowTooltip.content === 'function') {
          content = showOverflowTooltip.content(props.column, props.row);
        }
        content = showOverflowTooltip.content || refRoot.value.innerText;
        mode = showOverflowTooltip.mode || 'auto';
      }

      return { disabled, content, mode };
    };

    const resolveOverflowTooltip = () => {
      if (!refRoot.value || /selection|index|expand/.test(props.column.type) || !isElement(refRoot.value)) {
        return;
      }

      const { content, mode } = resolveTooltipOption();
      if (mode === 'auto') {
        const textWidth = getElementTextWidth(refRoot.value, content);
        const cellWidth = (refRoot.value as HTMLElement).clientWidth;
        const computedStyle = window.getComputedStyle(refRoot.value);
        const paddingWidth = ['padding-left', 'padding-right'].reduce((width, prop) => width + Number(computedStyle.getPropertyValue(prop).replace('px', '')), 0);
        const cellInnerWidth = cellWidth - paddingWidth;

        isTipsEnabled.value = textWidth > cellInnerWidth;
      }

      if (mode === 'static') {
        isTipsEnabled.value = true;
      }

      if (isTipsEnabled.value) {
        const bindings = ref(resolveTooltipOption());
        if (bkEllipsisIns === null) {
          bkEllipsisIns = bkEllipsisInstance(refRoot.value, bindings);
        }
      } else {
        bkEllipsisIns?.destroyInstance(refRoot.value);
        bkEllipsisIns = null;
      }
    };

    onMounted(() => {
      const { disabled } = resolveTooltipOption();
      if (!disabled) {
        resolveOverflowTooltip();

        if (props.column.showOverflowTooltip?.watchCellResize !== false) {
          observerIns = observerResize(refRoot.value, () => {
            resolveOverflowTooltip();
          }, 60, true);

          observerIns.start();
        }
      }
    });

    onBeforeUnmount(() => {
      observerIns?.stop();
      bkEllipsisIns?.destroyInstance(refRoot.value);
    });

    return () => <div class="cell" ref={ refRoot } title={ props.title }>
      { slots.default?.() }
    </div>;
  },
});
