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

import { computed, defineComponent, onBeforeUnmount, onMounted, Ref, ref, toRefs, watch } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { PropTypes } from '@bkui-vue/shared';

interface IRenderData {
  link?: String;
  url?: String;
  color?: String;
  class?: String;
}

export default defineComponent({
  name: 'Swiper',

  props: {
    isLoop: PropTypes.bool.def(true),
    loopTime: PropTypes.number.def(8000),
    pics: PropTypes.array.def([]),
    list: PropTypes.array.def([]),
    height: PropTypes.number,
    width: PropTypes.number,
  },

  emits: ['index-change'],

  setup(props, { emit, slots }) {
    // 属性
    const { isLoop, loopTime, pics, list, height, width } = toRefs(props);

    // 声明变量
    const swiperRef: Ref<HTMLElement> = ref();
    const swiperIndex: Ref<number> = ref(0);
    const renderWidth: Ref<number> = ref(0);
    const renderHeight: Ref<number> = ref(0);
    const loopId: Ref<number> = ref(0);
    let resizeObserver;

    const { resolveClassName } = usePrefix();

    // 计算属性
    const computedRenderDataList = computed<IRenderData[]>(() => (list.value?.length > 0 ? list.value : pics.value));
    const computedSwiperTranslateStyle = computed(() => ({
      width: `${renderWidth.value * computedRenderDataList.value.length}px`,
      transform: `translateX(-${renderWidth.value * swiperIndex.value}px)`,
    }));
    const computedSwiperRenderStyle = computed(() => ({
      width: `${renderWidth.value}px`,
      height: `${renderHeight.value}px`,
    }));

    // 方法
    const changeIndex = index => {
      let showIndex = index;
      // 边界处理
      if (index >= computedRenderDataList.value.length) {
        showIndex = 0;
      }
      if (index < 0) {
        showIndex = computedRenderDataList.value.length - 1;
      }
      swiperIndex.value = showIndex;
      emit('index-change', showIndex);
    };

    const goToLink = link => {
      if (!link) return;
      window.open(link, '_blank');
    };

    const getRenderItemClass = renderData => [
      `${resolveClassName('swiper-img')}`,
      { [`${resolveClassName('swiper-link')}`]: renderData.link },
      renderData.class,
    ];

    const getRenderItemStyle = renderData => ({
      'background-image': `url(${renderData.url})`,
      'background-color': renderData.color,
    });

    const getRenderIndexStyle = index => ({
      [`${resolveClassName('current-index')}`]: swiperIndex.value === index,
    });

    const startLoop = () => {
      if (isLoop.value) {
        loopId.value = window.setTimeout(() => {
          changeIndex(swiperIndex.value + 1);
          startLoop();
        }, loopTime.value);
      }
    };

    const endLoop = () => {
      window.clearTimeout(loopId.value);
    };

    // 如果没有传递高宽属性，组件的高宽需要随着父元素的变化而变化
    const watchParentSizeChange = () => {
      const parentEle = swiperRef.value?.parentElement;
      if (!parentEle || !window.ResizeObserver) {
        return;
      }
      resizeObserver = new ResizeObserver(() => {
        calcSize();
      });
      resizeObserver.observe(parentEle);
    };

    const endWatchParentSizeChange = () => {
      resizeObserver.disconnect?.();
    };

    const getElementSize = node => {
      if (node === undefined) {
        return {
          height: 0,
          width: 0,
        };
      }
      const computedStyle = getComputedStyle(node);
      const width = node.clientWidth - parseFloat(computedStyle.paddingTop) - parseFloat(computedStyle.paddingBottom);
      const height = node.clientHeight - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight);
      return {
        height,
        width,
      };
    };

    // 计算组件的高宽 & 宽度
    const calcSize = () => {
      const swiperParentSize = getElementSize(swiperRef.value?.parentElement);
      renderWidth.value = +width.value > 0 ? width.value : swiperParentSize.width;
      renderHeight.value = +height.value > 0 ? height.value : swiperParentSize.height;
    };

    watch([height, width], calcSize);

    onMounted(() => {
      calcSize();
      startLoop();
      watchParentSizeChange();
    });

    onBeforeUnmount(() => {
      endLoop();
      endWatchParentSizeChange();
    });

    // render
    return () => (
      <section
        class={`${resolveClassName('swiper-home')}`}
        ref={swiperRef}
        style={computedSwiperRenderStyle.value}
      >
        <hgroup
          style={computedSwiperTranslateStyle.value}
          class={`${resolveClassName('transition')} ${resolveClassName('swiper-main')}`}
        >
          {computedRenderDataList.value.map(renderData => (
            <h3
              class={`${resolveClassName('swiper-card')}`}
              style={computedSwiperRenderStyle.value}
            >
              {slots.default?.(renderData) ?? (
                <span
                  class={getRenderItemClass(renderData)}
                  style={getRenderItemStyle(renderData)}
                  onClick={() => goToLink(renderData.link)}
                ></span>
              )}
            </h3>
          ))}
        </hgroup>
        <ul class={`${resolveClassName('swiper-index')}`}>
          {computedRenderDataList.value.map((_, index) => (
            <li
              class={getRenderIndexStyle(index)}
              onMouseover={() => changeIndex(index)}
            ></li>
          ))}
        </ul>
        <span
          class={`${resolveClassName('swiper-nav')} ${resolveClassName('nav-prev')}`}
          onClick={() => changeIndex(swiperIndex.value - 1)}
        >
          <i class={`${resolveClassName('swiper-nav-icon')}`}></i>
        </span>
        <span
          class={`${resolveClassName('swiper-nav')} ${resolveClassName('nav-next')}`}
          onClick={() => changeIndex(swiperIndex.value + 1)}
        >
          <i class={`${resolveClassName('swiper-nav-icon')}`}></i>
        </span>
      </section>
    );
  },
});
