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

import { throttle } from 'lodash';
import { computed, defineComponent, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

import { classes, PropTypes } from '@bkui-vue/shared';
const on = (() => {
  if (document.addEventListener) {
    return (element, event, handler) => {
      if (element && event && handler) {
        element.addEventListener(event, handler, true);
      }
    };
  }
  return (element, event, handler) => {
    if (element && event && handler) {
      element.attachEvent(`on${event}`, handler);
    }
  };
})();
// 兼容浏览器，移除事件监听器
const off = (() => {
  if (document.removeEventListener) {
    return (element, event, handler) => {
      if (element && event) {
        element.removeEventListener(event, handler, true);
      }
    };
  }
  return (element, event, handler) => {
    if (element && event) {
      element.detachEvent(`on${event}`, handler);
    }
  };
})();
export default defineComponent({
  name: 'Affix',
  props: {
    offsetTop: PropTypes.number.def(0),
    offsetBottom: PropTypes.number,
    target: PropTypes.string.def(''),
    zIndex: PropTypes.number.def(1000),
  },
  emits: ['change'],
  setup(props, { emit, slots }) {
    const point = ref(null);
    const root = ref(null);
    const targetEl = ref();
    const styles = ref({});
    const { proxy } = getCurrentInstance();
    const affixWidth = ref(0);
    const offsetStyles = computed(() => ({
      ...styles.value,
      'z-index': props.zIndex,
    }));
    onMounted(() => {
      affixWidth.value = proxy.$el.offsetWidth;
      targetEl.value = props.target ? document.querySelector(props.target) : window;
      on(targetEl.value, 'scroll', listenScroll);
      on(targetEl.value, 'resize', listenScroll);
      nextTick(() => {
        handleScroll();
      });
    });
    const affix = ref(false);
    const pointClass = computed(() => classes({
      'bk-affix': affix.value,
    }));
    const offsetType = computed(() => (props.offsetBottom >= 0 ? 'bottom' : 'top'));
    const setTargetLoop = () => {
      if (offsetType.value === 'top') {
        styles.value = {
          top: `${targetEl.value.getBoundingClientRect().top + props.offsetTop}px`,
        };
      } else {
        styles.value = {
          bottom: `${window.innerHeight - targetEl.value.getBoundingClientRect().bottom + props.offsetBottom}px`,
        };
      }
    };
    const listenScroll = throttle(() => {
      handleScroll();
    }, 100);
    // 获取元素到浏览器边缘的距离
    const getOffset = (element) => {
      const rect = element.value.getBoundingClientRect();
      const rect2 = targetEl.value === window ? { top: 0, left: 0 } : targetEl.value.getBoundingClientRect();
      const clientTop = targetEl.value.clientTop || 0;
      const clientLeft = targetEl.value.clientLeft || 0;
      return {
        top: rect.top - rect2.top - clientTop,
        left: rect.left - rect2.left - clientLeft,
      };
    };
    const handleScroll = () => {
      const rect = targetEl.value === window ? {
        top: 0,
        left: 0,
        bottom: window.innerHeight,
      } : targetEl.value.getBoundingClientRect();
      const elOffset = getOffset(root);
      const windowHeight = targetEl.value === window ? targetEl.value.innerHeight : targetEl.value.clientHeight;
      const elHeight = point.value.offsetHeight;
      // Fixed Top
      if (elOffset.top < props.offsetTop && offsetType.value === 'top' && !affix.value) {
        affix.value = true;
        styles.value = {
          position: 'fixed',
          top: `${rect.top + props.offsetTop}px`,
          left: `${rect.left + elOffset.left}px`,
          width: `${affixWidth.value}px`,
        };
        if (targetEl.value !== window) {
          on(window, 'scroll', setTargetLoop);
        }
        emit('change', true);
      } else if (elOffset.top > props.offsetTop && offsetType.value === 'top' && affix.value) {
        affix.value = false;
        styles.value = null;
        emit('change', false);
      }
      // Fixed Bottom
      if ((elOffset.top + props.offsetBottom + elHeight) > windowHeight && offsetType.value === 'bottom' && !affix.value) {
        affix.value = true;
        styles.value = {
          bottom: `${window.innerHeight - rect.bottom + props.offsetBottom}px`,
          left: `${rect.left + elOffset.left}px`,
          width: `${affixWidth.value}px`,
        };
        if (targetEl.value !== window) {
          on(window, 'scroll', setTargetLoop);
        }
        emit('change', true);
      } else if ((elOffset.top + props.offsetBottom + elHeight) < windowHeight && offsetType.value === 'bottom' && affix.value) {
        affix.value = false;
        styles.value = null;
        emit('change', false);
      }
    };
    onBeforeUnmount(() => {
      off(targetEl.value, 'scroll', listenScroll);
      off(targetEl.value, 'resize', listenScroll);
      off(window, 'scroll', setTargetLoop);
    });
    return () => <div ref={root}>
        <div ref={point} class={pointClass.value} style={offsetStyles.value}>
          {slots.default?.()}
        </div>
    </div>;
  },
});

