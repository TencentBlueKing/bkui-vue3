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
import {
  computed,
  defineComponent,
  ExtractPropTypes,
  nextTick,
  onBeforeMount,
  reactive,
  ref,
  Transition,
  watch,
} from 'vue';
import { toType } from 'vue-types';

import { usePrefix } from '@bkui-vue/config-provider';
import { clickoutside } from '@bkui-vue/directives';
import { AngleUp } from '@bkui-vue/icon';
import { classes, PropTypes, useFormItem } from '@bkui-vue/shared';

import PickerDropdown from '../../date-picker/src/base/picker-dropdown';

import ColorInput from './components/color-input';
import HueSlider from './components/hue-slider';
import RecommendColors from './components/recommend-colors';
import SaturationPanel from './components/saturation-panel';
import { formatColor, toRGBAString } from './utils';

enum ColorPickSizeEnum {
  UNKNOWN = '',
  SMALL = 'small',
  LARGE = 'large',
}
const colorPickerProps = {
  modelValue: PropTypes.string.def(''),
  disabled: PropTypes.bool.def(false),
  readonly: PropTypes.bool.def(false),
  transfer: PropTypes.bool.def(false), // 控制面板是否出现在 body 内
  size: toType<`${ColorPickSizeEnum}`>('colorPickSize', {}).def(ColorPickSizeEnum.UNKNOWN),
  showValue: PropTypes.bool.def(true), // 是否在颜色选择器上显示色值
  // true 展示组件内置预设值
  // false 不展示预设值
  // 数组 自定义预设值
  recommend: PropTypes.oneOfType([PropTypes.array.def(() => []), PropTypes.bool.def(true)]).def(true),
  extCls: PropTypes.string.def(''),
  withValidate: PropTypes.bool.def(true),
};
const whiteColorObj = formatColor('#FFFFFF');

export type ColorPickerPropTypes = ExtractPropTypes<typeof colorPickerProps>;

export default defineComponent({
  name: 'ColorPicker',
  directives: {
    clickoutside,
  },
  props: colorPickerProps,
  emits: ['update:modelValue', 'change'],
  setup(props, { emit, slots }) {
    const formItem = useFormItem();
    const showDropdown = ref(false);
    // 当前颜色的色值，如果为空字符串显示：默认白色背景 + 中间一个叉
    const colorStr = ref('');
    // 储存当前颜色的相关信息
    const colorObj = reactive(JSON.parse(JSON.stringify(whiteColorObj)));
    const dropRef = ref<any>(null);
    const saturationPanelRef = ref<any>(null);
    const referenceRef = ref<any>(null);

    const { resolveClassName } = usePrefix();

    const colorPickerCls = computed(() =>
      classes(
        {
          [`${resolveClassName(`color-picker-${props.size}`)}`]: props.size,
          [`${resolveClassName('color-picker-show-dropdown')}`]: showDropdown.value,
          [`${resolveClassName('color-picker-show-value')}`]: props.showValue,
          [`${resolveClassName('color-picker-disabled')}`]: props.disabled || props.readonly,
        },
        `${resolveClassName('color-picker')} ${props.extCls}`,
      ),
    );

    // 是否渲染预设值
    const isRenderRecommend = computed(() =>
      Boolean(props.recommend === true || (Array.isArray(props.recommend) && props.recommend.length)),
    );

    onBeforeMount(() => {
      // 1. 组件初始化时，如果计算的色值和传入的值不一样，显示计算的色值
      changeColorFromProps({ isCreated: true });
    });

    watch(
      () => props.modelValue,
      () => {
        // 2. 如果组件绑定值被外部修改，自动根据绑定至更新组件色值
        changeColorFromProps();
        if (props.withValidate) {
          formItem?.validate?.('change');
        }
      },
    );

    const handleTriggerKeydown = e => {
      if (e.code === 'Enter' || e.code === 'NumpadEnter') {
        toggleDropdown();
      } else if (e.code === 'Escape') {
        closeDropdown();
      }
    };

    const handleDropdownKeydown = e => {
      if (props.transfer) {
        handleTriggerKeydown(e);
      }
    };

    const toggleDropdown = () => {
      if (props.disabled || props.readonly) {
        return;
      }
      showDropdown.value ? closeDropdown() : openDropdown();
    };

    // 如果未开启预设则此 tab 事件为颜色选择器最后一个表单 tab 事件，重新聚焦于饱和度面板
    const handleTabInput = e => {
      if (!isRenderRecommend.value) {
        e.preventDefault();
        saturationPanelRef.value.$el.focus();
      }
    };

    // 颜色选择器最后一个表单 tab 事件，重新聚焦于饱和度面板
    const handleTabRecommend = e => {
      e.preventDefault();

      saturationPanelRef.value.$el.focus();
    };

    const openDropdown = () => {
      showDropdown.value = true;
      dropRef.value?.updateDropdown();
      // 展开后默认聚焦于 HEX 输入框，setTimeout 等 transfer 出现
      setTimeout(() => {
        const hexInput = dropRef.value.$el.querySelector(
          `.${resolveClassName('color-picker-input-hex')} .${resolveClassName('color-picker-input-value')}`,
        );
        hexInput.select();
      }, 100);
    };

    const closeDropdown = () => {
      if (showDropdown.value) {
        nextTick(() => referenceRef.value.focus());
        showDropdown.value = false;
        dropRef.value?.destoryDropdown();

        // 3. 关闭组件时如果绑定值与组件内部选择的值不一致（比如既没有使用 v-model 也没有监听 change 事件）显示绑定值
        changeColorFromProps();
      }
    };

    /**
     * created 时、props.value 变化时、每次关闭组件时调用
     * @param {Object} option
     * @param {Boolean} [option.isCreated = false] - 是否是实例创建完成后的第一次调用
     */
    const changeColorFromProps = ({ isCreated = false } = {}) => {
      // 空字符串为默认值且合法
      if (props.modelValue === '') {
        // 颜色选择器有色值，用户手动修改为空字符串；或用户关闭组件时绑定的value为空字符串（没有使用组件传递的值）
        if (colorStr.value !== '') {
          colorStr.value = '';
          Object.assign(colorObj, whiteColorObj);
          emit('update:modelValue', colorStr.value);
        }
        return;
      }

      // 根据 props 计算色值
      const propsColorObj = formatColor(props.modelValue);
      const propsColorStr = propsColorObj.rgba.a === 1 ? propsColorObj.hex : toRGBAString(propsColorObj.rgba);

      // 根据 props 计算的色值和组件内部色值不一致，有几种情况
      if (propsColorStr !== colorStr.value) {
        // 传入的值是否是合法的色值
        const isValid = tinycolor(props.modelValue).isValid();
        // 实例挂载之前
        if (isCreated) {
          // 传入了非法的色值，按空字符串处理并触发 change 事件
          if (!isValid) {
            Object.assign(colorObj, whiteColorObj);
            emit('change', '');
          } else {
            // 到了这里，说明传入的色值已经计算出来了，是合法的，但可能存在格式上的偏差，如用户传入 #fff 计算得 #FFFFFF
            colorStr.value =
              propsColorStr.toLowerCase() === props.modelValue.toLowerCase()
                ? props.modelValue // 如果只是大小写不一致，显示用户传入的字符
                : propsColorStr; // 其它格式上的不一致，以本组件计算值为准
            Object.assign(colorObj, propsColorObj);
          }
        } else {
          // 实例挂载之后
          // 用户在实例挂载之后在组件外面修改色值 组件内部只是跟着 props 变化色值 并不触发 change 事件
          if (!isValid) {
            colorStr.value = '';
            Object.assign(colorObj, whiteColorObj);
          } else if (propsColorStr.toLowerCase() !== colorStr.value.toLowerCase()) {
            // 如果只是外部传入的值和当前组件显示的的值大小写不一致，不作处理
            // 比如 this.value === '#ffffff'，计算值为 '#FFFFFF'，不进行下面的处理直接显示 '#ffffff'
            // 反之显示内部计算值：
            Object.assign(colorObj, propsColorObj);
            colorStr.value = propsColorStr;
          }
        }
      }
    };

    /**
     * 组件内部选择颜色处理
     * @param {String|Object} val - hex,rgba,hsla,hsva
     */
    const handleColorChange = val => {
      // 组件内拿到的色值都是合法的，空字符串特殊处理
      if (val === '') {
        colorStr.value = '';
        Object.assign(colorObj, whiteColorObj);
        emit('update:modelValue', '');
        emit('change', '');
        return;
      }

      const handleColorObj = formatColor(val);
      const handleColorStr = handleColorObj.rgba.a === 1 ? handleColorObj.hex : toRGBAString(handleColorObj.rgba);
      colorStr.value = handleColorStr;
      Object.assign(colorObj, handleColorObj);
      emit('update:modelValue', colorStr.value);
      emit('change', handleColorStr);
    };

    const hideDropDown = () => {
      showDropdown.value = false;
    };

    return () => (
      <div
        ref={referenceRef}
        tabindex='0'
        class={colorPickerCls.value}
        onKeydown={handleTriggerKeydown}
        v-clickoutside={hideDropDown}
        onClick={toggleDropdown}
      >
        {typeof slots.trigger === 'function' ? (
          slots.trigger({ value: colorStr.value, isShowDropdown: showDropdown.value })
        ) : (
          <>
            <div class={`${resolveClassName('color-picker-color')}`}>
              {/* 如果传入的色值为空字符串或者没有传值默认白色背景 + 中间一个叉 */}
              <span
                class={`${resolveClassName('color-picker-color-square')} ${
                  !colorStr.value && `${resolveClassName('color-picker-empty')}`
                }`}
                style={`background: ${colorStr.value || '#FFF'}`}
              ></span>
            </div>
            {props.showValue ? (
              <div class={`${resolveClassName('color-picker-text')}`}>
                <span>{colorStr.value}</span>
              </div>
            ) : undefined}
            <div class={`${resolveClassName('color-picker-icon')}`}>
              <AngleUp class='icon-angle-down'></AngleUp>
            </div>
          </>
        )}
        <Transition name='bk-fade-down-transition'>
          <PickerDropdown
            ref={dropRef}
            v-show={showDropdown.value}
            triggerRef={referenceRef.value}
          >
            <div class={`${resolveClassName('color-dropdown-container')}`}>
              <div
                class={`${resolveClassName('color-picker-dropdown')}`}
                onClick={e => {
                  e.stopPropagation();
                }}
                onMousedown={e => {
                  e.stopPropagation();
                }}
                onKeydown={handleDropdownKeydown}
              >
                {/* 饱和度面板 */}
                <SaturationPanel
                  ref={saturationPanelRef}
                  colorObj={colorObj}
                  onChange={handleColorChange}
                ></SaturationPanel>
                {/* 色彩条 */}
                <HueSlider
                  colorObj={colorObj}
                  onChange={handleColorChange}
                ></HueSlider>
                {/* 色彩值 */}
                <ColorInput
                  colorObj={colorObj}
                  onTab={handleTabInput}
                  onChange={handleColorChange}
                ></ColorInput>
                {/* 预设值 */}
                {isRenderRecommend.value ? (
                  <div class={`${resolveClassName('color-picker-recommend-container')}`}>
                    <RecommendColors
                      colorObj={colorObj}
                      recommend={props.recommend}
                      onTab={handleTabRecommend}
                      onChange={handleColorChange}
                    ></RecommendColors>
                  </div>
                ) : undefined}
              </div>
            </div>
          </PickerDropdown>
        </Transition>
      </div>
    );
  },
});
