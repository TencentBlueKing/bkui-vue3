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

import { computed, defineComponent, PropType, ref } from 'vue';

import BkPopover from '@bkui-vue/popover';
import { PlacementEnum } from '@bkui-vue/shared';

import { off, on } from './slider';

interface Params {
  vertical: boolean,
  showTip: boolean,
  disable: boolean,
  maxValue: number,
  minValue: number,
  step: number,
  precision: number,
  showButtonLabel: boolean,
  formatterButtonLabel: Function,
  showIntervalLabel: boolean,
  customContent: { [propName: string]: { label?: string, tip?: string } },
  sliderSize: number,
  formatterTipLabel: Function,
}

export default defineComponent({
  name: 'SliderButton',
  props: {
    modelValue: { type: Number, default: 0 },
    params: { type: Object as PropType<Params>, default: () => ({}) },
  },
  emits: ['emitChange', 'resetSize', 'update:modelValue'],
  setup(props, { emit }) {
    const dragging = ref(false);
    const isClick = ref(false);
    const startY = ref(0);
    const startX = ref(0);
    const startPosition = ref(0);
    const newPosition = ref(null);
    const oldValue = ref(props.modelValue);
    const currentY = ref(0);
    const currentX = ref(0);
    const isMove = ref(false);
    const button = ref(null);

    const tip = computed(() => {
      let tip = '';
      if (props.params.customContent?.[props.modelValue]) {
        const customContent = props.params.customContent[props.modelValue];
        tip = customContent.tip || customContent.label || '';
      }
      const placement = props.params.vertical ? PlacementEnum.RIGHT : PlacementEnum.TOP;
      if (props.params?.showTip) {
        return { content: props.params.formatterTipLabel(`${tip || props?.modelValue || '0'}`), placement };
      }
      return { content: '', placement };
    });
    const currentPosition = computed(() => `${(props.modelValue - props.params.minValue) / (props.params.maxValue - props.params.minValue) * 100}%`);
    const wrapperStyle = computed(() => (props.params.vertical
      ? { bottom: currentPosition.value } : { left: currentPosition.value }));
    const buttonLabel = computed(() => props.params.formatterButtonLabel(props.modelValue));

    const onButtonDown = (event: MouseEvent) => {
      if (props.params.disable) return;
      event.preventDefault();
      onDragStart(event);
      on(window, 'mousemove', onDragging);
      on(window, 'touchmove', onDragging);
      on(window, 'mouseup', onDragEnd);
      on(window, 'touchend', onDragEnd);
    };
    const onDragStart = (event: MouseEvent) => {
      dragging.value = true;
      isClick.value = true;
      if (props.params.vertical) {
        startY.value = event.clientY;
      } else {
        startX.value = event.clientX;
      }
      startPosition.value = parseFloat(currentPosition.value);
      newPosition.value = startPosition.value;
    };
    const onDragging = (event: MouseEvent) => {
      if (dragging.value) {
        isClick.value = false;
        emit('resetSize');
        let diff = 0;
        if (props.params.vertical) {
          currentY.value = event.clientY;
          diff = (startY.value - currentY.value) / props.params.sliderSize * 100;
        } else {
          currentX.value = event.clientX;
          diff = (currentX.value - startX.value) / props.params.sliderSize * 100;
        }
        newPosition.value = startPosition.value + diff;
        setPosition(newPosition.value);
      }
    };
    const onDragEnd = () => {
      isMove.value = false;
      if (dragging.value) {
        setTimeout(() => {
          dragging.value = false;
          if (!isClick.value) {
            setPosition(newPosition.value);
            emit('emitChange');
          }
        }, 0);
        off(window, 'mousemove', onDragging);
        off(window, 'touchmove', onDragging);
        off(window, 'mouseup', onDragEnd);
        off(window, 'touchend', onDragEnd);
      }
    };
    const setPosition = (position: number) => {
      if (position === null || isNaN(position)) return;
      if (position < 0) {
        newPosition.value = 0;
      } else if (position > 100) {
        newPosition.value = 100;
      }
      const lengthPerStep = 100 / ((props.params.maxValue - props.params.minValue) / props.params.step);
      const steps = Math.round(position / lengthPerStep);
      let value = steps * lengthPerStep
        * (props.params.maxValue - props.params.minValue) * 0.01 + props.params.minValue;
      value = parseFloat(value.toFixed(props.params.precision));
      emit('update:modelValue', value);
      if (!dragging.value && props.modelValue !== oldValue.value) {
        oldValue.value = props.modelValue;
      }
    };
    const renderDom = () => (
      <div class={['bk-slider-button', props.params.vertical ? 'vertical' : 'horizontal', { grabbing: dragging.value }]}
        ref={button}
        tabindex="0"
        style={wrapperStyle.value}
        onClick={(event: MouseEvent) => event.stopPropagation()}
        onMousedown={onButtonDown}>
          {Boolean(tip.value.content)
            ? <BkPopover
              content={tip.value.content}
              theme={'dark'}
              placement={tip.value.placement}
              boundary={document.body}>
              <div class={['slider-button', { 'slider-button-disable': props.params.disable }]}></div>
            </BkPopover>
            : <div class={['slider-button', { 'slider-button-disable': props.params.disable }]}></div>}
          {props.params.showButtonLabel && !props.params.showIntervalLabel
            ? <div class={['slider-button-label', props.params.vertical ? 'vertical' : 'horizontal']}>
              {buttonLabel.value}
            </div> : undefined}
      </div>
    );
    return {
      renderDom,
      setPosition,
      tip,
    };
  },
  render() {
    return this.renderDom();
  },
});
