/**
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

import { computed, defineComponent, nextTick, onMounted, ref, watch } from 'vue';

import Input from '@bkui-vue/input';
import { PropTypes } from '@bkui-vue/shared';

import SliderButton from './slider-button';


export const on = (element: Element | Window, event: string, handler) => {
  if (element && event && handler) {
    element.addEventListener(event, handler, false);
  }
};
export const off = (element: Element | Window, event: string, handler) => {
  if (element && event && handler) {
    element.removeEventListener(event, handler, false);
  }
};

export default defineComponent({
  name: 'Slider',
  props: {
    modelValue: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.number]),
    extCls: { type: String, default: '' }, // 自定义class
    vertical: { type: Boolean, default: false }, // 是否为垂直模式
    height: { type: String, default: '200px' }, // 滑动选择器高度 vertical为true时使用
    disable: { type: Boolean, default: false }, // 是否禁用
    showTip: { type: Boolean, default: false }, // 是否显示tip
    maxValue: { type: [Number], default: 100 }, // 最大值
    minValue: { type: [Number], default: 0 }, // 最小值
    step: { type: [Number], default: 1 }, // 每一步的距离
    range: { type: Boolean, default: false }, // 是否为分段式滑块
    showInterval: { type: Boolean, default: false }, // 是否显示间断点
    showIntervalLabel: { type: Boolean, default: false }, // 是否显示间断点下的文字
    showButtonLabel: { type: Boolean, default: false }, // 滑块下是否显示值不可与间断点下的文字同时使用
    showBetweenLabel: { type: Boolean, default: false }, // 是否只显示首尾刻度
    showInput: { type: Boolean, default: false }, // 是否显示输入框
    customContent: { type: Object, default: null }, // 自定义内容
    formatterLabel: { type: Function, default: (value: number) => value }, // 自定义间断点下文字格式
    formatterButtonLabel: { type: Function, default: (value: number) => value }, // 自定义滑块下文字格式
    formatterTipLabel: { type: Function, default: (value: number) => value }, // 自定义tip格式
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { slots, emit }) {
    /* 滑动选择器长度 */
    const sliderSize = ref(1);
    /* 第一个滑块与第二个滑块的值 */
    const firstValue = ref<number | null>(null);
    const secondValue = ref<number | null>(null);
    const oldValue = ref(null);
    /* 第一个输入框与第二个输入框的值 */
    const firstInput = ref<number | null>(0);
    const secondInput = ref<number | null>(0);
    /* 以下为refDom */
    const slider = ref(null);
    const firstbutton = ref(null);
    const secondbutton = ref(null);
    const curButtonRef = ref(null);

    // 小数点后最大位数
    const precision = computed(() => {
      const precisions = [props.minValue, props.maxValue, props.step].map((item) => {
        const decimal = (`${item}`).split('.')[1];
        return decimal ? decimal.length : 0;
      });
      return Math.max.apply(null, precisions);
    });
    /* 当前滑块的最小值与最大值 */
    const rangeMinValue = computed(() => Math.min(firstValue.value, secondValue.value));
    const rangeMaxValue = computed(() => Math.max(firstValue.value, secondValue.value));
    const barSize = computed(() => (props.range
      ? `${100 * (rangeMaxValue.value - rangeMinValue.value) / (props.maxValue - props.minValue)}%`
      : `${100 * (firstValue.value - props.minValue) / (props.maxValue - props.minValue)}%`));
    const barStart = computed(() => (props.range
      ? `${100 * (rangeMinValue.value - props.minValue) / (props.maxValue - props.minValue)}%`
      : '0%'));
    /* 当前滑动区域的位置与长度 */
    const barStyle = computed(() => (props.vertical
      ? {
        height: barSize.value,
        bottom: barStart.value,
      } : {
        width: barSize.value,
        left: barStart.value,
      }));
    /* 断点 */
    const intervals = computed(() => {
      if (!props.showInterval || props.minValue > props.maxValue) return [];
      if (props.step === 0) {
        console.warn('WARNNING:step should not be 0');
        return [];
      }
      const stopCount = (props.maxValue - props.minValue) / props.step;
      const stepWidth = 100 * props.step / (props.maxValue - props.minValue);
      const result = [];
      for (let i = 1; i < stopCount; i++) {
        result.push(i * stepWidth);
      }
      if (props.range) {
        // eslint-disable-next-line max-len
        return result.filter(step => step < 100 * (rangeMinValue.value - props.minValue) / (props.maxValue - props.minValue)
                  || step > 100 * (rangeMaxValue.value - props.minValue) / (props.maxValue - props.minValue));
      }
      // eslint-disable-next-line max-len
      return result.filter(step => step > 100 * (firstValue.value - props.minValue) / (props.maxValue - props.minValue));
    });
    /* 可滑动区域的样式 */
    const runwayStyle = computed(() => (props.vertical ? { height: props.height, width: '4px' } : {}));
    /* 断点下方的文案 */
    const intervalLabels = computed(() => {
      if (!props.showIntervalLabel) return [];
      if (props.step === 0) {
        console.warn('WARNNING:step should not be 0');
        return [];
      }
      const stepWidth = 100 * props.step / (props.maxValue - props.minValue);
      const result = [];
      for (let i = props.minValue, j = 0; i <= props.maxValue; i += props.step, j++) {
        const item = {
          stepWidth: j * stepWidth,
          stepLabel: props.formatterLabel(i),
        };
        result.push(item);
      }
      return result;
    });
    /* 是否显示第二个输入框 */
    const showSecondInput = computed(() => Array.isArray(props.modelValue));
    /* 自定义断点 */
    const customList = computed(() => {
      if (!props.customContent) {
        return [];
      }
      return Object.keys(props.customContent)
        .sort((a, b) => Number(a) - Number(b))
        .filter(value => Number(value) >= props.minValue && Number(value) <= props.maxValue)
        .map((item) => {
          const { tip } = props.customContent[item];
          const { label } = props.customContent[item];
          return {
            tip: tip || label || '',
            label: label || '',
            percent: (Number(item) - props.minValue) / (props.maxValue - props.minValue) * 100,
          };
        });
    });
    /* 传入到滑块的参数 */
    const buttonParms = computed(() => ({
      vertical: props.vertical,
      showTip: props.showTip,
      disable: props.disable,
      maxValue: props.maxValue,
      minValue: props.minValue,
      step: props.step,
      precision: precision.value,
      showButtonLabel: props.showButtonLabel,
      formatterButtonLabel: props.formatterButtonLabel,
      showIntervalLabel: props.showIntervalLabel,
      customContent: props.customContent,
      sliderSize: sliderSize.value,
      formatterTipLabel: props.formatterTipLabel,
    }));

    // 监听
    watch(() => props.modelValue, () => {
      setValues();
    });
    watch(() => firstValue.value, (val) => {
      if (props.range) {
        emit('update:modelValue', [rangeMinValue.value, rangeMaxValue.value]);
      } else {
        emit('update:modelValue', val);
      }
      firstInput.value = val;
    });
    watch(() => secondValue.value, (val) => {
      emit('update:modelValue', [rangeMinValue.value, rangeMaxValue.value]);
      secondInput.value = val;
    });
    /* 初始化 */
    onMounted(() => {
      if (props.range) {
        if (Array.isArray(props.modelValue)) {
          firstValue.value = Math.max(props.minValue, Number(props.modelValue[0]));
          secondValue.value = Math.min(props.maxValue, Number(props.modelValue[1]));
        } else {
          firstValue.value = props.minValue;
          secondValue.value = props.maxValue;
        }
        oldValue.value = [firstValue.value, secondValue.value];
      } else {
        if (typeof props.modelValue !== 'number' || isNaN(props.modelValue)) {
          firstValue.value = props.minValue;
        } else {
          firstValue.value = Math.min(props.maxValue, Math.max(props.minValue, props.modelValue));
        }
        oldValue.value = firstValue.value;
      }
      resetSize();
      on(window, 'resize', resetSize());
    });
    const resetSize = () => {
      if (slider.value) {
        sliderSize.value = slider.value[`client${props.vertical ? 'Height' : 'Width'}`];
      }
    };
    /* 点击容器时设置滑块位置 */
    const setButtonPos = (event: MouseEvent) => {
      event.stopPropagation();
      if (props.disable) return;
      resetSize();
      if (props.vertical) {
        const offsetBottom = slider.value?.getBoundingClientRect().bottom;
        setPosition((offsetBottom - event.clientY) / sliderSize.value * 100);
      } else {
        const offsetLeft = slider.value?.getBoundingClientRect().left;
        setPosition((event.clientX - offsetLeft) / sliderSize.value * 100);
      }
      emitChange();
    };
    /* 是否更改了值 */
    const valueChanged = (): boolean => {
      if (props.range) {
        return ![rangeMinValue.value, rangeMaxValue.value].every((item, index) => item === oldValue.value[index]);
      }
      return props.modelValue !== oldValue.value;
    };
    /* emit */
    const setValues = () => {
      if (props.minValue > props.maxValue) {
        console.error('min should not be greater than max.');
        return;
      }
      const val = props.modelValue;
      if (props.range && Array.isArray(val)) {
        if (val[1] < props.minValue) {
          emit('update:modelValue', [props.minValue, props.minValue]);
        } else if (val[0] > props.maxValue) {
          emit('update:modelValue', [props.maxValue, props.maxValue]);
        } else if (val[0] < props.minValue) {
          emit('update:modelValue', [props.minValue, val[1]]);
        } else if (val[1] > props.maxValue) {
          emit('update:modelValue', [val[0], props.maxValue]);
        } else {
          firstValue.value = Number(val[0]);
          secondValue.value = Number(val[1]);
          if (valueChanged()) {
            oldValue.value = val.slice();
          }
        }
      } else if (!props.range && typeof val === 'number' && !isNaN(val)) {
        if (val < props.minValue) {
          emit('update:modelValue', props.minValue);
        } else if (val > props.maxValue) {
          emit('update:modelValue', props.maxValue);
        } else {
          firstValue.value = val;
          if (valueChanged()) {
            oldValue.value = val;
          }
        }
      }
    };
    /* 派出事件 */
    const emitChange = async () => {
      await nextTick();
      emit('change', props.range ? [rangeMinValue.value, rangeMaxValue.value] : props.modelValue);
    };
    /* 断点样式 */
    const getIntervalStyle = (position: number) => (props.vertical ? { bottom: `${position}%` } : { left: `${position}%` });
    /* 设置滑块位置 */
    const setPosition = (percent: number) => {
      if (!props.range) {
        firstbutton.value.setPosition(percent);
        return;
      }
      const targetValue = props.minValue + percent * (props.maxValue - props.minValue) / 100;
      // 绝对值
      if (Math.abs(rangeMinValue.value - targetValue) < Math.abs(rangeMaxValue.value - targetValue)) {
        curButtonRef.value = firstValue.value < secondValue.value ? firstbutton.value : secondbutton.value;
      } else {
        curButtonRef.value = firstValue.value > secondValue.value ? firstbutton.value : secondbutton.value;
      }
      curButtonRef.value.setPosition(percent);
    };
    const firstInputChange = (v) => {
      if (v === '') {
        return;
      }
      const val = parseFloat(v);
      if (val < props.minValue) {
        firstInput.value = props.minValue;
        firstValue.value = props.minValue;
      } else if (val > props.maxValue) {
        firstInput.value = props.maxValue;
        firstValue.value = props.maxValue;
      } else {
        firstValue.value = val;
      }
    };
    const secondInputChange = (v: number | string) => {
      if (v === '') {
        return;
      }
      const val = parseFloat(v.toString());
      if (val < props.minValue) {
        secondInput.value = props.minValue;
        secondValue.value = props.minValue;
      } else if (val > props.maxValue) {
        secondInput.value = props.maxValue;
        secondValue.value = props.maxValue;
      } else {
        secondValue.value = val;
      }
    };
    const betweenLabelStyle = (postion: 'start' | 'end') => {
      let value = 0;
      if (postion === 'start') {
        value = props.vertical ? props.maxValue : props.minValue;
      } else {
        value = props.vertical ? props.minValue : props.maxValue;
      }
      if (props.showButtonLabel && [firstValue.value, secondValue.value].includes(value)) {
        return '0';
      }
      return '1';
    };

    const renderDom = () => (
      <div class={ ['bk-slider', props.extCls] }>
        { slots.start?.() }
        <div class="bk-slider-runway"
          ref={slider}
          style={runwayStyle.value}
          onClick={setButtonPos}>
          <div class={['bk-slider-bar', props.vertical ? 'vertical' : 'horizontal', { disable: props.disable }]}
            style={barStyle.value}></div>
            {props.showInterval ? intervals.value.map((interval, index) => (
              <div key={index}
                class={['bk-slider-interval', { vertical: props.vertical }]}
                style={getIntervalStyle(interval)}></div>
            )) : undefined}
            {props.customContent ? customList.value.map((custom, index) => (
              <div key={index}
              class={['bk-slider-interval', { vertical: props.vertical }]}
              style={getIntervalStyle(custom.percent)}></div>
            )) : undefined}
            {(props.showBetweenLabel || props.showIntervalLabel || props.customContent)
              ? <div class={['bk-slider-labels', props.vertical ? 'vertical' : 'horizontal']}>
                {(function () {
                  if (props.showBetweenLabel) {
                    return [
                    <div class="label-start"
                      style={[{ opacity: betweenLabelStyle('start') }]}>
                      {props.formatterLabel(props.minValue)}
                    </div>,
                    <div class="label-end"
                      style={[{ opacity: betweenLabelStyle('end') }]}>
                      {props.formatterLabel(props.maxValue)}
                    </div>];
                  }
                  if (props.showIntervalLabel) {
                    return (
                      intervalLabels.value.map((intervalLabel, index) => (
                        <div class={['bk-slider-label', props.vertical ? 'vertical' : 'horizontal']}
                          key={index}
                          style={getIntervalStyle(intervalLabel.stepWidth)}>
                            {intervalLabel.stepLabel}
                          </div>
                      ))
                    );
                  }
                  if (props.customContent) {
                    return (
                      customList.value.map((item, index) => (
                        <div class={['bk-slider-label', props.vertical ? 'vertical' : 'horizontal']}
                        key={index}
                        style={getIntervalStyle(item.percent)}>
                          {item.label}
                        </div>
                      ))
                    );
                  }
                  return undefined;
                }())}</div>
              : undefined}
            <SliderButton
              v-model={firstValue.value}
              ref={firstbutton}
              params={buttonParms.value}
              onEmitChange={emitChange}
              onResetSize={resetSize}></SliderButton>
            { props.range
              ? <SliderButton
              v-model={secondValue.value}
              ref={secondbutton}
              params={buttonParms.value}
              onEmitChange={emitChange}
              onResetSize={resetSize}></SliderButton> : undefined}
        </div>
        {(props.showInput && !props.vertical) ? <div class="bk-slider-input">
          <div class="input-item">
            <Input type="number"
              modelValue={firstInput.value}
              max={props.maxValue}
              min={props.minValue}
              onChange={firstInputChange}>

              </Input>
          </div>
          {showSecondInput.value && secondValue.value ? [
            <div class="input-center">～</div>,
            <div class="input-item">
              <Input type="number"
                modelValue={secondInput.value}
                max={props.maxValue}
                min={props.minValue}
                onChange={secondInputChange}
                ></Input>
            </div>,
          ] : undefined}
        </div> : undefined }
        { slots.end?.() }
      </div>
    );

    return {
      renderDom,
    };
  },
  render() {
    return this.renderDom();
  },
});
