/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2025 Tencent.  All rights reserved.
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
  h,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  type SetupContext,
  SlotsType,
  watch,
  nextTick,
} from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';

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

    const refRoot = ref<HTMLElement>(null);

    /** 如果有分组状态，计算总行数 */
    const listLength = ref(0);

    /** 实际高度，根据行高和总行数计算出来的实际高度 */
    const innerHeight = ref(0);

    const contentHeight = ref(0);

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
    }));

    const { init, scrollTo } = useScrollbar();

    let instance: VisibleRender = null;
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

    /** 计算 startIndex 对应的 Y 轴偏移量 */
    const getStartOffset = (startIndex: number) => {
      if (typeof props.lineHeight === 'function') {
        let offset = 0;
        for (let i = 0; i < startIndex; i++) {
          offset += props.lineHeight(getRowHeightArgs(i));
        }
        return offset;
      }
      return startIndex * props.lineHeight;
    };

    const getOffsetHeight = () => {
      if (typeof props.height === 'number') {
        return props.height;
      }

      return refRoot.value?.offsetHeight ?? 0;
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

      // 计算实际的数据起止索引
      let start = startIndex * props.groupItemCount;
      let end = endIndex * props.groupItemCount;
      const total = localList.value.length;

      // 处理预加载，避免空白闪烁
      start = Math.max(0, start - props.preloadItemCount);
      end = Math.min(total, end + props.preloadItemCount);

      // 边界处理
      if (end > total) {
        end = total;
      }
      if (start < 0) {
        start = 0;
      }

      const value = localList.value.slice(start, end);
      calcList.value = value;

      // 更新 pagination 的 startIndex（用于 transform 定位）
      pagination.startIndex = Math.floor(start / props.groupItemCount);

      if (event) {
        ctx.emit('content-scroll', [event, pagination, value]);
      }
    };

    onMounted(() => {
      instance = new VisibleRender(binding, refRoot.value);

      // 在执行渲染前，先设置正确的容器尺寸
      // 当 props.height 是数字时，使用 props.height 作为 offsetHeight
      // 避免 popover 首次显示时 DOM 元素 offsetHeight 为 0 导致计算错误
      setDelegateEl();

      // 初始化原生滚动
      init(refRoot);

      // 安装滚动事件监听
      instance.install();

      // 初始渲染
      instance.executeThrottledRender({ offset: { x: 0, y: 0 } });
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
      // 传递正确的 offset 参数
      computedVirtualIndex(getLineHeight(), handleScrollCallback, pagination, container, {
        offset: { x: el?.scrollLeft ?? 0, y: el?.scrollTop ?? 0 },
      });
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
        // maxHeight 支持 number（px）与 string（如 50%、calc(...)）
        maxHeight: props.maxHeight ? (typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight) : false,
        minHeight: props.minHeight ? `${props.minHeight}px` : false,
        overflow: 'auto', // 使用原生滚动
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
     * 重置当前配置，将滚动位置重置到顶部
     */
    const reset = () => {
      // 重置 pagination 状态
      Object.assign(pagination, {
        startIndex: 0,
        endIndex: 0,
        scrollTop: 0,
        scrollLeft: 0,
        translateY: 0,
        translateX: 0,
      });

      // 重置 DOM 滚动位置
      if (refRoot.value) {
        refRoot.value.scrollTop = 0;
        refRoot.value.scrollLeft = 0;
      }

      handleChangeListConfig();
      setDelegateEl();

      // 立即计算初始数据，确保 calcList 有值
      const container =
        typeof props.height === 'number' ? { scrollHeight: innerHeight.value, offsetHeight: props.height } : refRoot.value;
      computedVirtualIndex(getLineHeight(), handleScrollCallback, pagination, container, {
        offset: { x: 0, y: 0 },
      });

      // 触发渲染更新
      nextTick(() => {
        instance?.executeThrottledRender({ offset: { x: 0, y: 0 } });
      });
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
      setDelegateEl();
      afterListDataReset();
      nextTick(() => {
        instance?.executeThrottledRender({
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
      refRoot,
      refContent: refRoot,
    });

    /** 内容区域样式，使用 transform 定位到正确位置 */
    const contentWrapperStyle = computed(() => ({
      transform: `translateY(${getStartOffset(pagination.startIndex)}px)`,
      ...props.contentStyle,
    }));

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
          // 占位元素，撑起完整的滚动高度
          h('div', {
            class: resolveClassName('virtual-section'),
            style: {
              height: `${contentHeight.value}px`,
              position: 'absolute',
              width: '1px',
              pointerEvents: 'none',
            },
          }),
          ctx.slots.beforeContent?.() ?? '',
          // 内容容器，使用 transform 定位到正确位置
          h(
            'div',
            {
              class: [resolveClassName('virtual-content'), ...resolvePropClassName(props.contentClassName)],
              style: contentWrapperStyle.value,
            },
            ctx.slots.default?.({
              data: calcList.value,
              pagination,
            }) ?? '',
          ),
          ctx.slots.afterContent?.() ?? '',
          ctx.slots.afterSection?.() ?? '',
        ],
      );
  },
});
