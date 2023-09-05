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
import { computed, defineComponent, ref, Fragment } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { PropTypes } from '@bkui-vue/shared';
import { watch } from 'vue';

export default defineComponent({
  name: 'PopContent',
  props: {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def('auto'),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def('auto'),
    maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def('auto'),
    extCls: PropTypes.string.def(''),
    visible: PropTypes.bool.def(false),
    eventDelay: PropTypes.number.def(300)
  },
  setup(props) {
    const resolveValToPix = (val: string | number) => {
      if (/^\d+\.?\d*$/.test(`${val}`)) {
        return `${val}px`;
      }

      return val;
    };
    const style = computed(() => ({
      width: resolveValToPix(props.width),
      height: resolveValToPix(props.height),
      maxHeight: resolveValToPix(props.maxHeight),
    }));

    const refContent = ref(null);

    watch(() => props.visible, () => {
      if (props.visible) {
        setTimeout(() => {
          (refContent.value as HTMLElement)?.style.setProperty('pointer-events', 'all');
        }, props.eventDelay ?? 300);
      }
    });

    const { resolveClassName } = usePrefix();

    return {
      style,
      refContent,
      resolveClassName
    };
  },
  render() {
    const className = [this.resolveClassName('popover'), this.resolveClassName('pop2-content'), this.extCls];

    const resolveContentStyle = (slot) => {
      if (Fragment === slot?.[0]?.type) {
        return Object.assign({}, this.style, { 'pointer-events': 'none' as const });
      }

      return this.style;
    };

    const style = resolveContentStyle(this.$slots.default?.());
    return <div class={ className } tabindex="-1" style={ style } ref="refContent">
      { this.$slots.arrow?.() ?? '' }
      { this.$slots.default?.() ?? '' }
    </div>;
  },
});
