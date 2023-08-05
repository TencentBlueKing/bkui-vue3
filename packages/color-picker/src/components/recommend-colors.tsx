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

import tinycolor from 'tinycolor2';
import { computed, defineComponent, ExtractPropTypes, nextTick, ref, watch } from 'vue';

import { classes, PropTypes } from '@bkui-vue/shared';
import { usePrefix } from '@bkui-vue/config-provider';

import { clamp } from '../utils';

const colorPickerProps = {
  colorObj: PropTypes.object.isRequired,
  recommend: PropTypes.oneOfType([PropTypes.array.def(() => []), PropTypes.bool.def(true)]).isRequired,
};

export type ColorPickerPropTypes = ExtractPropTypes<typeof colorPickerProps>;

export default defineComponent({
  props: colorPickerProps,
  emits: ['change', 'tab'],
  setup(props, { emit }) {
    const isFocused = ref(false);
    const selectedIndex = ref(-1);
    const selectedColor = ref(null);

    watch(() => props.colorObj, () => {
      // 每次在外部修改颜色后预设面板都会取消预设选择的样式，即便预设和当前色一样
      // 预设里面修改颜色会在 $nextTick 恢复状态
      selectedIndex.value = -1;
      selectedColor.value = null;
    }, { deep: true });

    const colors = computed(() => getColorsFromRecommend(props.recommend));

    const { resolveClassName } = usePrefix();

    const getColorClass = (color, index) => (classes({
      [`${resolveClassName('color-picker-empty')}`]: color === '',
      [`${resolveClassName('color-picker-recommend-selected-color')}`]: isFocused.value && selectedIndex.value === index,
    }, `${resolveClassName('color-picker-recommend-color')}`));

    const handleKeydown = (e) => {
      if (e.code === 'Tab') {
        emit('tab', e);
      } else {
        let index = 0;
        const rowNum = 10; // 每行展示的颜色块个数，和样式相关联
        const max = colors.value.length - 1;
        switch (e.code) {
          case 'ArrowLeft':
            e.preventDefault();
            index = clamp(selectedIndex.value - 1, 0, max);
            break;
          case 'ArrowRight':
            e.preventDefault();
            index = clamp(selectedIndex.value + 1, 0, max);
            break;
          case 'ArrowUp':
            e.preventDefault();
            index = clamp(selectedIndex.value - rowNum, 0, max);
            break;
          case 'ArrowDown':
            e.preventDefault();
            index = clamp(selectedIndex.value + rowNum, 0, max);
            break;
          default:
            return;
        }
        selectColor(index);
      }
    };
    const selectColor = (index) => {
      const color = colors.value[index];
      emit('change', color);
      // 预设里面修改颜色不重置状态（恢复状态）
      nextTick(() => {
        selectedIndex.value = index;
        selectedColor.value = color;
      });
    };
    /**
     * 校验、处理预设值
     * @param {Boolean|String[]} recommend
     * @returns {String[]}
     */
    const getColorsFromRecommend = (recommend) => {
      if (recommend === true) {
        return [
          '',
          '#ff4500',
          '#ff8c00',
          '#ffd700',
          '#90ee90',
          '#ddffff',
          '#00ced1',
          '#3a84ff',
          '#a933f5',
          '#db7093',
          '#000000',
          '#494949',
          '#9B9B9B',
          '#ffffff',
        ];
      } if (Array.isArray(recommend)) {
        // 如果预设值是无效的，这里按空字符串处理以显示提示用户，应该输入正确的色值
        return recommend.map(color => (tinycolor(color).isValid() ? color : ''));
      }
    };

    return () => (
      <div tabindex="0"
        class={`${resolveClassName('color-picker-recommend')} `}
        onFocus={() => (isFocused.value = true)}
        onBlur={() => (isFocused.value = false)}
        onKeydown={handleKeydown}>
        {colors.value.map((color, index) => (
          <div style={`background: ${color || '#fff'}`}
            class={getColorClass(color, index)}
            onClick={() => selectColor(index)}>
            {selectedIndex.value === index ? (
              <div class={`${resolveClassName('color-picker-pointer')}`}>
                <div class={`${resolveClassName('color-picker-circle')}`}></div>
              </div>
            ) : undefined}
          </div>
        ))}
      </div>
    );
  },
});
