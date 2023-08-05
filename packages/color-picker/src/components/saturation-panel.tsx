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

import { computed, defineComponent, ExtractPropTypes, ref } from 'vue';

import { PropTypes } from '@bkui-vue/shared';
import { usePrefix } from '@bkui-vue/config-provider';
import { clamp, getTouches } from '../utils';

const colorPickerProps = {
  colorObj: PropTypes.object.isRequired,
};

export type ColorPickerPropTypes = ExtractPropTypes<typeof colorPickerProps>;

export default defineComponent({
  props: colorPickerProps,
  emits: ['change'],
  setup(props, { emit }) {
    const containerRef = ref<HTMLElement>(null);
    const backgroundStyle = computed(() => ({ background: `hsl(${props.colorObj.hsv.h}, 100%, 50%)` }));
    const pointerStyle = computed(() => ({ top: `${(1 - props.colorObj.hsv.v) * 100}%`, left: `${props.colorObj.hsv.s * 100}%` }));

    const handleMouseDown = (e) => {
      containerRef.value.focus();
      handlePointChange(e);
      window.addEventListener('mousemove', handlePointChange, { passive: true });
      window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handlePointChange);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    const handleArrowKeydown = (e) => {
      const { clientWidth, clientHeight } = containerRef.value;
      let left = props.colorObj.hsv.s * clientWidth;
      let top = (1 - props.colorObj.hsv.v) * clientHeight;
      const step = 10;
      switch (e.code) {
        case 'ArrowLeft':
          e.preventDefault();
          left = clamp(left - step, 0, clientWidth);
          break;
        case 'ArrowRight':
          e.preventDefault();
          left = clamp(left + step, 0, clientWidth);
          break;
        case 'ArrowUp':
          e.preventDefault();
          top = clamp(top - step, 0, clientHeight);
          break;
        case 'ArrowDown':
          e.preventDefault();
          top = clamp(top + step, 0, clientHeight);
          break;
        default:
          return;
      }
      handlePointChange(null, left, top);
    };

    /**
     * 饱和度面板变化
     * @param {MouseEvent|null} e - 鼠标滑动事件
     * @param {Number} [appointedLeft] - 键盘事件对应坐标，如果有就优先使用
     * @param {Number} [appointedTop] - 键盘事件对应坐标，如果有就优先使用
     */
    const handlePointChange = (e, appointedLeft?, appointedTop?) => {
      const { clientWidth, clientHeight } = containerRef.value;
      const left = appointedLeft !== undefined ? appointedLeft : getLeft(e);
      const top = appointedTop !== undefined ? appointedTop : getTop(e);
      const saturation = left / clientWidth;
      const bright = 1 - top / clientHeight;

      changeColor(props.colorObj.hsv.h, saturation, bright, props.colorObj.hsv.a);
    };

    const getLeft = (e) => {
      const xOffset = containerRef.value.getBoundingClientRect().left + window.pageXOffset;
      const pageX = e.pageX || getTouches(e, 'PageX');

      return clamp(pageX - xOffset, 0, containerRef.value.clientWidth);
    };

    const getTop = (e) => {
      const yOffset = containerRef.value.getBoundingClientRect().top + window.pageYOffset;
      const pageY = e.pageY || getTouches(e, 'PageY');

      return clamp(pageY - yOffset, 0, containerRef.value.clientHeight);
    };

    const changeColor = (h, s, v, a) => {
      emit('change', { h, s, v, a });
    };

    const { resolveClassName } = usePrefix();

    return () => (
      <div ref={containerRef}
        tabindex="0"
        class={`${resolveClassName('color-picker-saturation')}`}
        style={backgroundStyle.value}
        onKeydown={handleArrowKeydown}
        onMousedown={(e) => {
          e.stopPropagation();
          handleMouseDown(e);
        }}
      >
        {/* 从左到右饱和度 saturation 增大 */}
        <div class={`${resolveClassName('color-picker-saturation-white')}`}></div>
        {/* 从上到下明度 value(brightness) 减小 */}
        <div class={`${resolveClassName('color-picker-saturation-black')}`}></div>
        <div class={`${resolveClassName('color-picker-pointer')}`} style={pointerStyle.value}>
          <div class={`${resolveClassName('color-picker-circle')}`}></div>
        </div>
      </div>
    );
  },
});
