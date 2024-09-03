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
  onMounted,
  onUnmounted,
  reactive,
  ref,
  type SetupContext,
  SlotsType,
  watch,
  nextTick,
  Ref,
} from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { VirtualElement } from '@bkui-vue/scrollbar';

import { type VirtualRenderProps, virtualRenderProps } from './props';
import useFixTop from './use-fix-top';
import useScrollbar from './use-scrollbar';
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
    default?: Record<string, object>;
    beforeContent?: Record<string, object>;
    afterContent?: Record<string, object>;
    afterSection?: Record<string, object>;
  }>,
  setup(props: VirtualRenderProps, ctx: SetupContext) {
    const { renderAs } = props;

    const resolvePropClassName = (prop: Record<string, object> | Record<string, object>[] | string | string[]) => {
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

    const refRoot = ref(null);

    /** 如果有分组状态，计算总行数 */
    const listLength = ref(0);

    /** 实际高度，根据行高和总行数计算出来的实际高度 */
    const innerHeight = ref(0);

    const contentHeight = ref(0);

    const virtualRoot: Ref<VirtualElement> = ref(null);

    const getRowHeightArgs = startIndex => {
      let start = startIndex * props.groupItemCount;
      let end = (startIndex + 1) * props.groupItemCount;

      if (end > listLength.value) {
        const count = end - start;
        end = listLength.value;
        start = end - count;
      }

      return {
        index: start,
        rows: props.list.slice(start, end),
        items: [start, end],
        type: 'virtual',
      };
    };

    const getLineHeight = () => {
      if (typeof props.lineHeight === 'function') {
        return ({ index }) => {
          return props.lineHeight(getRowHeightArgs(index));
        };
      }

      return props.lineHeight;
    };

    const binding = computed(() => ({
      lineHeight: getLineHeight(),
      handleScrollCallback,
      pagination,
      throttleDelay: props.throttleDelay,
      scrollbar: props.scrollbar,
    }));

    const { init, scrollTo, updateScrollHeight, update } = useScrollbar(props);

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
    const getOffsetHeight = () => {
      if (typeof props.height === 'number') {
        return props.height;
      }

      // @ts-ignore
      return virtualRoot.value.offsetHeight;
    };

    const getLastPageIndex = () => {
      const elHeight = getOffsetHeight();
      let startIndex = Math.ceil(listLength.value / props.groupItemCount);
      let rowsHeight = 0;
      let lastHeight = 0;
      let diffHeight = 0;
      for (; startIndex > 0; startIndex--) {
        lastHeight = props.lineHeight(getRowHeightArgs(startIndex));

        rowsHeight = rowsHeight + lastHeight;

        if (rowsHeight > elHeight) {
          diffHeight = rowsHeight - elHeight;
          break;
        }
      }

      return {
        diffHeight,
        startIndex,
      };
    };

    /** 指令触发Scroll事件，计算当前startIndex & endIndex & scrollTop & translateY */
    const handleScrollCallback = (event, startIndex, endIndex, scrollTop, translateY, scrollLeft, pos) => {
      const translateX = scrollLeft;
      Object.assign(pagination, { startIndex, endIndex, scrollTop, translateX, translateY, scrollLeft, pos });
      let start = pagination.startIndex * props.groupItemCount;
      let end = pagination.endIndex * props.groupItemCount;
      const total = localList.value.length;
      if (total < end) {
        end = total;

        if (typeof props.lineHeight === 'function') {
          start = getLastPageIndex().startIndex;
        } else {
          start = end - Math.floor(refRoot.value.offsetHeight / props.lineHeight);
          start = start < 0 ? 0 : start;
        }
      }

      const value = localList.value.slice(start, end);
      calcList.value = value;
      if (event) {
        ctx.emit('content-scroll', [event, pagination, value]);
      }
    };

    onMounted(() => {
      instance = new VisibleRender(binding, refRoot.value);

      if (props.scrollbar?.enabled) {
        virtualRoot.value = new VirtualElement({
          delegateElement: refRoot.value,
          scrollHeight: innerHeight.value,
          onScollCallback: handleScrollBarCallback,
        });
        init(virtualRoot as Ref<Partial<Element> & Partial<VirtualElement>>);
        updateScrollHeight(contentHeight.value);
        instance.executeThrottledRender.call(instance, { offset: { x: 0, y: 0 } });
        return;
      }

      instance.install();
    });

    onUnmounted(() => {
      instance?.uninstall();
    });

    const handleChangeListConfig = () => {
      /** 数据改变时激活当前表单，使其渲染DOM */
      handleListChanged(props.list as Record<string, object>[]);
    };

    /**
     * 列表数据改变时，处理相关参数
     */
    const handleListChanged = (list: Record<string, object>[]) => {
      listLength.value = Math.ceil((list || []).length / props.groupItemCount);
      pagination.count = listLength.value;

      const isAuto = typeof props.abosuteHeight === 'string' && props.abosuteHeight === 'auto';
      if (isAuto) {
        if (typeof props.lineHeight === 'function') {
          innerHeight.value = 0;
          let fnValue = 0;
          const rowsLength = Math.ceil(listLength.value / props.groupItemCount);
          for (let i = 0; i < rowsLength; i++) {
            const fnVal = props.lineHeight.apply(this, [getRowHeightArgs(i)]);
            fnValue += typeof fnVal === 'number' ? fnVal : 0;
          }
          innerHeight.value = fnValue;
        } else {
          innerHeight.value = props.lineHeight * listLength.value;
        }
      } else {
        innerHeight.value = props.abosuteHeight as number;
      }

      setContentHeight();
    };

    /** 列表数据重置之后的处理事项 */
    const afterListDataReset = (_scrollToOpt = { left: 0, top: 0 }) => {
      const el = refRoot.value as HTMLElement;
      const container =
        typeof props.height === 'number' ? { scrollHeight: innerHeight.value, offsetHeight: props.height } : el;
      computedVirtualIndex(props.lineHeight, handleScrollCallback, pagination, container, { target: el });
    };

    /** 映射传入的数组为新的数组，增加 $index属性，用来处理唯一Index */
    const localList = computed(() => {
      if (props.rowKey !== undefined || !props.autoIndex) {
        return props.list;
      }

      return ((props.list || []) as Record<string, object>[]).map((item, index) => ({ ...item, $index: index }));
    });

    /** 展示列表内容区域样式 */
    const innerContentStyle = computed(() => (props.scrollPosition === 'content' ? {} : {}));

    /** 虚拟渲染外层容器样式 */
    const wrapperStyle = computed(() => {
      const height = typeof props.height === 'number' ? `${props.height}px` : props.height;
      return {
        height,
        width: typeof props.width === 'number' ? `${props.width}px` : props.width,
        display: 'inline-block',
        maxHeight: props.maxHeight ? `${props.maxHeight}px` : false,
        minHeight: props.minHeight ? `${props.minHeight}px` : false,
        ...(props.scrollPosition === 'container' ? innerContentStyle.value : {}),
        ...props.wrapperStyle,
      };
    });

    const setContentHeight = () => {
      contentHeight.value = innerHeight.value < props.minHeight ? props.minHeight : innerHeight.value;
    };

    const { resolveClassName } = usePrefix();

    /** 外层样式列表 */
    const wrapperClass = computed(() => [
      resolveClassName('virtual-render'),

      ...resolvePropClassName(props.className),
      props.scrollPosition === 'container' ? resolveClassName('virtual-content') : '',
    ]);

    /**
     * 重置当前配置
     * @param keepLastPostion
     */
    const reset = () => {
      handleChangeListConfig();
      afterListDataReset();
      instance?.executeThrottledRender.call(instance, { offset: { x: 0, y: 0 } });
    };

    const { fixToTop } = useFixTop(props, scrollTo);

    const setDelegateEl = () => {
      const el = refRoot.value as HTMLElement;
      const container =
        typeof props.height === 'number' ? { scrollHeight: innerHeight.value, offsetHeight: props.height } : el;
      instance?.setDelegateWrapper(container);
    };

    const updateVirtualInstance = () => {
      instance?.setBinding(binding);
      handleChangeListConfig();
      updateScrollHeight(contentHeight.value);
      setDelegateEl();
      update();
      afterListDataReset();
      nextTick(() => {
        instance?.executeThrottledRender.call(instance, {
          offset: { x: pagination.scrollLeft, y: pagination.scrollTop },
        });
      });
    };

    watch(
      () => props.height,
      () => {
        updateVirtualInstance();
      },
    );

    watch(
      () => [props.list, props.list.length],
      () => {
        updateVirtualInstance();
      },
      {
        immediate: true,
      },
    );

    ctx.expose({
      reset,
      scrollTo,
      fixToTop,
      updateScroll: update,
      refRoot,
      refContent: refRoot,
    });

    const handleScrollBarCallback = args => {
      instance.executeThrottledRender.call(instance, args);
    };

    return () =>
      h(
        // @ts-ignore:next-line
        renderAs || 'div',
        {
          ref: refRoot,
          class: [...wrapperClass.value],
          style: wrapperStyle.value,
        },
        [
          ctx.slots.beforeContent?.() ?? '',
          ctx.slots.default?.({
            data: calcList.value,
          }) ?? '',
          ctx.slots.afterContent?.() ?? '',
          ctx.slots.afterSection?.() ?? '',
        ],
      );
  },
});
