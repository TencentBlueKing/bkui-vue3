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

/**
 * @file virtual-render
 *
 * Copyright © 2012-2019 Tencent BlueKing. All Rights Reserved. 蓝鲸智云 版权所有
 */
import {
  computed,
  defineComponent,
  // EmitsOptions,
  h,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  type SetupContext,
  SlotsType,
  watch,
} from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';

import { type VirtualRenderProps, virtualRenderProps } from './props';
import useTagRender from './use-tag-render';
import virtualRender, { computedVirtualIndex, VisibleRender } from './v-virtual-render';

export default defineComponent({
  name: 'VirtualRender',
  directives: {
    bkVirtualRender: virtualRender,
  },
  props: virtualRenderProps,
  emits: ['content-scroll' as string],
  slots: Object as SlotsType<{
    default?: any;
    beforeContent?: any;
    afterContent?: any;
    afterSection?: any;
  }>,
  setup(props: VirtualRenderProps, ctx: SetupContext) {
    const { renderAs, contentAs } = props;

    const resolvePropClassName = (prop: string | string[] | any[] | any) => {
      if (typeof prop === 'string') {
        return [prop];
      }

      if (typeof prop === 'object' && !Array.isArray(prop)) {
        return [prop];
      }

      return prop;
    };

    if (!props.enabled) {
      const { rendAsTag } = useTagRender(props, ctx);
      return rendAsTag;
    }

    const binding = computed(() => ({
      lineHeight: props.lineHeight,
      handleScrollCallback,
      pagination,
      throttleDelay: props.throttleDelay,
    }));

    const refRoot = ref(null);
    let instance = null;
    const pagination = reactive({
      startIndex: 0,
      endIndex: 0,
      scrollTop: 1,
      scrollLeft: 0,
      translateY: 0,
      translateX: 0,
      count: 0,
      pos: {},
      groupItemCount: props.groupItemCount,
    });

    const calcList = ref([]);

    /** 指令触发Scroll事件，计算当前startIndex & endIndex & scrollTop & translateY */
    const handleScrollCallback = (event, startIndex, endIndex, scrollTop, translateY, scrollLeft, pos) => {
      const translateX = scrollLeft;
      Object.assign(pagination, { startIndex, endIndex, scrollTop, translateX, translateY, scrollLeft, pos });
      let start = pagination.startIndex * props.groupItemCount;
      let end = (pagination.endIndex + props.preloadItemCount) * props.groupItemCount;
      const total = localList.value.length;
      if (total < end) {
        const contentLength = end - start;
        calcList.value = localList.value.slice(start, total);
        end = total + 1;
        start = end - contentLength;
        start = start < 0 ? 0 : start;
      }
      const value = localList.value.slice(start, end + 10);
      calcList.value = value;
      if (event) {
        ctx.emit('content-scroll', [event, pagination]);
      }
    };

    onMounted(() => {
      instance = new VisibleRender(binding, refRoot.value);
      instance.install();
    });

    onUnmounted(() => {
      instance?.uninstall();
    });

    watch(
      () => [props.lineHeight, props.height, props.list, props.maxHeight],
      () => {
        instance?.setBinding(binding);
        handleChangeListConfig();
        nextTick(() => {
          afterListDataReset();
        });
      },
      { deep: true },
    );

    const handleChangeListConfig = () => {
      /** 数据改变时激活当前表单，使其渲染DOM */
      handleListChanged(props.list);
    };

    /** 如果有分组状态，计算总行数 */
    const listLength = ref(0);

    /** 实际高度，根据行高和总行数计算出来的实际高度 */
    const innerHeight = ref(0);

    /**
     * 列表数据改变时，处理相关参数
     */
    const handleListChanged = (list: any[]) => {
      listLength.value = Math.ceil((list || []).length / props.groupItemCount);
      pagination.count = listLength.value;

      const isAuto = typeof props.abosuteHeight === 'string' && props.abosuteHeight === 'auto';
      if (isAuto) {
        if (typeof props.lineHeight === 'function') {
          innerHeight.value = 0;
          let fnValue = 0;
          for (let i = 0; i < listLength.value; i++) {
            const fnVal = props.lineHeight.call(this, i, list.slice(i * props.groupItemCount, props.groupItemCount));
            fnValue += typeof fnVal === 'number' ? fnVal : 0;
          }
          innerHeight.value = fnValue;
        } else {
          innerHeight.value = props.lineHeight * listLength.value;
        }
      } else {
        innerHeight.value = props.abosuteHeight as number;
      }
    };

    /** 列表数据重置之后的处理事项 */
    const afterListDataReset = (_scrollToOpt = { left: 0, top: 0 }) => {
      const el = refRoot.value as HTMLElement;
      nextTick(() => {
        computedVirtualIndex(props.lineHeight, handleScrollCallback, pagination, el, { target: el });
      });
    };

    /** 映射传入的数组为新的数组，增加 $index属性，用来处理唯一Index */
    const localList = computed(() => {
      if (props.rowKey !== undefined) {
        return props.list;
      }

      return (props.list || []).map((item: any, index) => ({ ...item, $index: index }));
    });

    /** 展示列表内容区域样式 */
    const innerContentStyle = computed(() =>
      props.scrollPosition === 'content'
        ? {
            top: `${pagination.scrollTop + props.scrollOffsetTop}px`,
            transform: `translateY(-${pagination.translateY}px)`,
          }
        : {},
    );

    /** 虚拟渲染外层容器样式 */
    const wrapperStyle = computed(() => {
      const height = typeof props.height === 'number' ? `${props.height}px` : props.height;
      return {
        height,
        width: typeof props.width === 'number' ? `${props.width}px` : props.width,
        display: 'inline-block',
        maxHeight: props.maxHeight ?? height,
        ...(props.scrollPosition === 'container' ? innerContentStyle.value : {}),
        ...props.wrapperStyle,
      };
    });

    /** 虚拟渲染区域内置占位区域样式，用来撑起总高度，出现滚动条 */
    const innerStyle = computed(() => {
      const isHidden = typeof props.abosuteHeight === 'number' && props.abosuteHeight === 0;
      return {
        height: `${innerHeight.value < props.minHeight ? props.minHeight : innerHeight.value}px`,
        display: isHidden ? 'none' : 'block',
      };
    });

    const { resolveClassName } = usePrefix();

    /** 外层样式列表 */
    const wrapperClass = computed(() => [
      resolveClassName('virtual-render'),
      props.scrollXName,
      props.scrollYName,
      ...resolvePropClassName(props.className),
      props.scrollPosition === 'container' ? resolveClassName('virtual-content') : '',
    ]);

    /** 内容区域样式列表 */
    const innerClass = computed(() => [
      props.scrollPosition === 'content' ? resolveClassName('virtual-content') : '',
      ...resolvePropClassName(props.contentClassName),
    ]);

    /**
     * 重置当前配置
     * @param keepLastPostion
     */
    const reset = () => {
      handleChangeListConfig();
      afterListDataReset();
    };

    const scrollTo = (option = { left: 0, top: 0 }) => {
      const { left, top } = option;
      refRoot.value.scrollTo(left, top);
    };

    ctx.expose({
      reset,
      scrollTo,
    });

    return () =>
      h(
        // @ts-ignore:next-line
        renderAs || 'div',
        {
          ref: refRoot,
          class: wrapperClass.value,
          style: wrapperStyle.value,
        },
        [
          ctx.slots.beforeContent?.() ?? '',
          h(
            contentAs || 'div',
            {
              class: innerClass.value,
              style: {
                ...innerContentStyle.value,
                ...props.contentStyle,
              },
            },
            [
              ctx.slots.default?.({
                data: calcList.value,
              }) ?? '',
            ],
          ),
          ctx.slots.afterContent?.() ?? '',
          h('div', {
            class: [resolveClassName('virtual-section')],
            style: innerStyle.value,
          }),
          ctx.slots.afterSection?.() ?? '',
        ],
      );
  },
});
