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

import { computed, defineComponent, nextTick, onBeforeUnmount, onMounted, ref, toRefs, withModifiers } from 'vue';

import { AngleLeft, AngleRight } from '@bkui-vue/icon';
import { PropTypes } from '@bkui-vue/shared';

export default defineComponent({
  name: 'ResizeLayout',
  props: {
    placement: PropTypes.placement().def('left'),
    min: PropTypes.number.def(3),
    max: PropTypes.number.def(Infinity),
    triggerWidth: PropTypes.number.def(5),
    triggerOffset: PropTypes.number.def(3),
    initialDivide: PropTypes.oneOfType([String, Number]).def('20%'),
    immediate: PropTypes.bool,
    disabled: PropTypes.bool,
    collapsible: PropTypes.bool,
    autoMinimize: PropTypes.oneOfType([Boolean, Number]).def(false),
    border: PropTypes.bool.def(true),
  },
  emits: ['before-resize', 'resizing', 'after-resize', 'collapse-change'],
  setup(props, { emit }) {
    const { placement, initialDivide, triggerOffset, triggerWidth, max, min, immediate, autoMinimize } = toRefs(props);
    const collapsed = ref(false);
    const asideContentVisible = ref(true);
    const minimized = ref(false);
    const limitMax = ref(null);
    const state = ref<any>({});
    const bkResizeLayoutRef = ref<HTMLElement>(null);
    const resizeProxyRef = ref<HTMLElement>(null);
    const resizeMaskRef = ref<HTMLElement>(null);
    const asideRef = ref<HTMLElement>(null);

    const vertical = computed(() => ['left', 'right'].includes(placement.value));
    const cssPropKey = computed(() => (vertical.value ? 'width' : 'height'));
    const asideStyle = computed(() => {
      let divide = initialDivide.value;
      if (typeof divide === 'number') {
        divide = `${divide}px`;
      }
      return {
        [cssPropKey.value]: divide,
      };
    });
    const triggerStyle = computed(() => {
      const style = {
        [`margin-${placement.value}`]: `${triggerOffset.value - triggerWidth.value}px`,
        [cssPropKey.value]: `${triggerWidth.value}px`,
      };
      return style;
    });
    const parseAutoMinimize = computed(() => {
      if (autoMinimize.value) {
        return typeof autoMinimize.value === 'boolean' ? 50 : autoMinimize.value;
      }
      return 0;
    });

    const setMaxLimit = () => {
      const rect = bkResizeLayoutRef.value.getBoundingClientRect();
      limitMax.value = vertical.value ? rect.width : rect.height;
    };
    const observer = new ResizeObserver(setMaxLimit);

    const updateResizeProxyStyle = () => {
      resizeProxyRef.value.style.visibility = 'visible';
      switch (placement.value) {
        case 'left':
          resizeProxyRef.value.style.inset = `0 auto auto ${state.value.aside.width}px`;
          break;
        case 'right':
          resizeProxyRef.value.style.inset = `0  ${state.value.aside.width}px auto auto`;
          break;
        case 'top':
          resizeProxyRef.value.style.inset = `${state.value.aside.height}px auto auto 0`;
          break;
        case 'bottom':
          resizeProxyRef.value.style.inset = `auto auto ${state.value.aside.height}px 0`;
          break;
      }
    };

    const updateResizeMaskStyle = () => {
      resizeMaskRef.value.style.display = 'block';
      resizeMaskRef.value.style.cursor = vertical.value ? 'col-resize' : 'row-resize';
    };

    const getRealValue = current => Math.min(
      max.value,
      Math.max(min.value, current), limitMax.value - triggerWidth.value,
    );

    const handleMousedown = (event) => {
      emit('before-resize', event);
      const asideRect = asideRef.value.getBoundingClientRect();
      state.value = Object.freeze({
        mouse: {
          clientX: event.clientX,
          clientY: event.clientY,
        },
        aside: {
          width: asideRect.width,
          height: asideRect.height,
        },
      });
      updateResizeMaskStyle();
      if (!immediate.value) {
        updateResizeProxyStyle();
      }
      document.onselectstart = () => false;
      document.ondragstart = () => false;

      const resizingCallback = (value) => {
        emit('resizing', value);
      };
      const handleMouseMove = (event) => {
        let delta;
        switch (placement.value) {
          case 'top':
            delta = event.clientY - state.value.mouse.clientY;
            break;
          case 'right':
            delta = state.value.mouse.clientX - event.clientX;
            break;
          case 'bottom':
            delta = state.value.mouse.clientY - event.clientY;
            break;
          case 'left':
            delta = event.clientX - state.value.mouse.clientX;
        }
        const current = state.value.aside[cssPropKey.value] + delta;
        const realValue = getRealValue(current) + triggerOffset.value;
        const pixel = `${realValue}px`;
        if (immediate.value) {
          asideRef.value.style[cssPropKey.value] = pixel;
        } else {
          resizeProxyRef.value.style[placement.value] = pixel;
        }
        resizingCallback(realValue);
      };
      const handleMouseUp = () => {
        resizeProxyRef.value.style.visibility = 'hidden';
        resizeMaskRef.value.style.display = 'none';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.onselectstart = null;
        document.ondragstart = null;
        nextTick(() => {
          setupAutoMinimize();
          emit('after-resize', parseFloat(resizeProxyRef.value.style[placement.value]));
        });
        if (immediate.value) {
          return false;
        }
        asideRef.value.style[cssPropKey.value] = resizeProxyRef.value.style[placement.value];
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const setupAutoMinimize = () => {
      if (!autoMinimize.value) {
        return false;
      }
      const asideRect = asideRef.value.getBoundingClientRect();
      // 最小化同时设置为已折叠，此时展开以初始化initial-divide数据为参考
      // eslint-disable-next-line no-multi-assign
      minimized.value = collapsed.value = asideRect[cssPropKey.value] <= parseAutoMinimize.value;
      if (!minimized.value) {
        asideContentVisible.value = true;
        return false;
      }
      setupAsideAnimation();
      nextTick(() => {
        asideRef.value.setAttribute(`data-${cssPropKey.value}`, asideStyle.value[cssPropKey.value]);
      });
    };

    const setCollapse = (collapse) => {
      collapsed.value = typeof collapse === 'boolean' ? collapse : !collapsed.value;
      setupAsideAnimation();
      emit('collapse-change', collapsed.value);
    };

    const setupAsideAnimation = () => {
      const asideRect = asideRef.value.getBoundingClientRect();
      setupAsideListener(!collapsed.value);
      if (collapsed.value) {
        asideRef.value.setAttribute(`data-${cssPropKey.value}`, `${asideRect[cssPropKey.value]}px`);
        asideRef.value.style[cssPropKey.value] = '5px';
      } else {
        asideContentVisible.value = true;
        asideRef.value.style[cssPropKey.value] = asideRef.value.getAttribute(`data-${cssPropKey.value}`);
      }
    };

    const setupAsideListener = (visible) => {
      const removeClass = () => {
        asideContentVisible.value = visible;
        asideRef.value.style.transition = '';
        asideRef.value.removeEventListener('transitionend', removeClass);
      };
      asideRef.value.addEventListener('transitionend', removeClass);
      asideRef.value.style.transition = `${cssPropKey.value} cubic-bezier(0.4, 0, 0.2, 1) .3s`;
    };

    onMounted(() => {
      observer.observe(bkResizeLayoutRef.value);
    });
    onBeforeUnmount(() => {
      observer.unobserve(bkResizeLayoutRef.value);
    });
    return {
      collapsed,
      asideContentVisible,
      minimized,
      limitMax,
      state,
      vertical,
      cssPropKey,
      bkResizeLayoutRef,
      resizeProxyRef,
      resizeMaskRef,
      asideRef,
      triggerStyle,
      asideStyle,
      handleMousedown,
      setCollapse,
    };
  },
  render() {
    const bkResizeLayoutClass = [
      'bk-resize-layout',
      `bk-resize-layout-${this.placement}`,
      {
        'bk-resize-layout-collapsed': this.collapsed,
        'bk-resize-layout-border': this.border,
      },
    ];

    return (
      <div ref="bkResizeLayoutRef" class={bkResizeLayoutClass}>
        <aside class="bk-resize-layout-aside" ref="asideRef" style={this.asideStyle}>
          <div class="bk-resize-layout-aside-content" v-show={this.asideContentVisible}>
            {this.$slots.aside?.()}
          </div>
          <i class="bk-resize-trigger"
            v-show={!this.disabled && (!this.collapsed || this.autoMinimize)}
            style={this.triggerStyle}
            onMousedown={withModifiers(this.handleMousedown, ['left'])}>
          </i>
          <i class={['bk-resize-proxy', this.placement]}
            ref="resizeProxyRef" v-show={!this.collapsed || this.autoMinimize}></i>
          {
            this.collapsible
            && (
              this.$slots['collapse-trigger']?.()
              || (
                this.collapsed
                  ? <AngleRight class="bk-resize-collapse" onClick={this.setCollapse}></AngleRight>
                  : <AngleLeft class="bk-resize-collapse" onClick={this.setCollapse}></AngleLeft>
              )
            )
          }
        </aside>
        <main class="bk-resize-layout-main">
          {this.$slots.main?.()}
        </main>
        <div class="bk-resize-mask" ref="resizeMaskRef"></div>
      </div>
    );
  },
});
