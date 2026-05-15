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

import {
  Comment,
  computed,
  CSSProperties,
  defineComponent,
  Fragment,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  Teleport,
  Text,
  toRefs,
  useAttrs,
  VNode,
  watch,
} from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { bkZIndexManager, RenderType } from '@bkui-vue/shared';

import { useDelay, usePopoverFloating, useTrigger } from './composables';
import { PopoverProps } from './props';

import type { TriggerType, PopoverPlacement, IAxesOffsets, VirtualElement } from './types';

/**
 * 全局 Popover 注册表（用于处理“弹层里再弹弹层”的 clickoutside / hover-leave 场景）
 *
 * 典型问题：父 Popover 的内容区里包含一个会 Teleport 到 body 的子 Popover（如 Select 下拉）。
 * 此时点击/移入子 Popover，会被父 Popover 当作“外部”交互从而收起。
 *
 * 解决思路：当事件命中某个子 Popover 的 floating 节点时，如果该子 Popover 的 reference 节点位于父 Popover 的 floating 内，
 * 则认为这是父内容区的延伸交互，不触发父 popover 的 hide。
 */
type PopoverRegistryEntry = {
  id: string;
  floatingEl: HTMLElement | null;
  referenceEl: HTMLElement | null;
  referenceWrapperEl: HTMLElement | null;
};

let __bkPopoverIdSeed = 0;
const __bkPopoverRegistry = new Map<string, PopoverRegistryEntry>();

const findPopoverIdInEventPath = (event: Event): null | string => {
  const anyEvent = event as any;
  const path = (typeof anyEvent.composedPath === 'function' ? anyEvent.composedPath() : []) as unknown[];
  for (const node of path) {
    if (!(node instanceof HTMLElement)) continue;
    const id = (node as HTMLElement).dataset?.bkPopoverId;
    if (id) return id;
  }
  return null;
};

const findPopoverIdFromElement = (target: EventTarget | null): null | string => {
  if (!(target instanceof HTMLElement)) return null;
  let el: HTMLElement | null = target;
  while (el) {
    const id = el.dataset?.bkPopoverId;
    if (id) return id;
    el = el.parentElement;
  }
  return null;
};

const isChildPopoverInteractionFor = (parentId: string, event: Event): boolean => {
  const childId = findPopoverIdInEventPath(event);
  if (!childId || childId === parentId) return false;

  const parent = __bkPopoverRegistry.get(parentId);
  const child = __bkPopoverRegistry.get(childId);
  if (!parent?.floatingEl || !child) return false;

  const childRef = child.referenceEl;
  const childWrapper = child.referenceWrapperEl;
  // 只在“子 popover 的 reference 在父 popover 内容里”时才认为是关联交互
  return (
    (!!childRef && parent.floatingEl.contains(childRef)) || (!!childWrapper && parent.floatingEl.contains(childWrapper))
  );
};

// 事件类型定义
const EMIT_EVENTS = {
  AFTER_SHOW: 'afterShow',
  AFTER_HIDDEN: 'afterHidden',
  CLICK_OUTSIDE: 'clickoutside',
  CONTENT_MOUSEENTER: 'contentMouseenter',
  CONTENT_MOUSELEAVE: 'contentMouseleave',
  UPDATE_IS_SHOW: 'update:isShow',
} as const;

export default defineComponent({
  name: 'Popover',
  inheritAttrs: false,
  props: PopoverProps,
  emits: [
    EMIT_EVENTS.AFTER_SHOW,
    EMIT_EVENTS.AFTER_HIDDEN,
    EMIT_EVENTS.CLICK_OUTSIDE,
    EMIT_EVENTS.CONTENT_MOUSEENTER,
    EMIT_EVENTS.CONTENT_MOUSELEAVE,
    EMIT_EVENTS.UPDATE_IS_SHOW,
  ],

  setup(props, { slots, emit, expose }) {
    const attrs = useAttrs();
    const { resolveClassName } = usePrefix();

    // 当前实例 id（用于注册表与事件路径识别）
    const popoverId = `bk-popover-${++__bkPopoverIdSeed}`;

    // 元素引用
    // 默认 slot 的包裹元素（仅用于渲染与事件冒泡承载）
    const referenceWrapperRef = ref<HTMLElement | null>(null);
    // 提供给 floating-ui 的实际定位 reference（可能是 wrapper，也可能是 slot 内部元素）
    const floatingReferenceRef = ref<HTMLElement | VirtualElement | null>(null);
    const floatingRef = ref<HTMLElement | null>(null);
    const arrowRef = ref<HTMLElement | null>(null);

    // 解构 props
    const {
      isShow,
      always,
      disabled,
      trigger,
      placement,
      offset,
      padding,
      arrow,
      autoPlacement,
      autoVisibility,
      disableTransform,
      boundary,
      disableTeleport,
      renderDirective,
      renderType,
      theme,
      extCls,
      referenceCls,
      width,
      height,
      maxWidth,
      maxHeight,
      zIndex,
      popoverDelay,
      allowHtml,
      content,
      clickContentAutoHide,
      disableOutsideClick,
      hideIgnoreReference,
      forceClickoutside,
      componentEventDelay,
      reference,
      target,
      floatingReference,
    } = toRefs(props);

    // 判断是否为虚拟元素
    const isVirtualElement = (el: unknown): el is VirtualElement => {
      return (
        el !== null &&
        typeof el === 'object' &&
        'getBoundingClientRect' in el &&
        typeof (el as Record<string, unknown>).getBoundingClientRect === 'function'
      );
    };

    // 解析自定义 reference 元素
    const resolveReferenceElement = (ref: unknown): HTMLElement | VirtualElement | null => {
      if (!ref) return null;
      // 虚拟元素
      if (isVirtualElement(ref)) {
        return ref;
      }
      if (typeof ref === 'string') {
        return document.querySelector(ref) as HTMLElement | null;
      }
      if (ref instanceof HTMLElement) {
        return ref;
      }
      return null;
    };

    // 是否使用自定义 reference
    const useCustomReference = computed(() => {
      return !!reference.value || !!target.value;
    });

    // 是否为虚拟元素模式（虚拟元素不需要绑定事件）
    const isVirtualReferenceMode = computed(() => {
      if (reference.value && isVirtualElement(reference.value)) {
        return true;
      }
      return false;
    });

    // 获取实际的 reference 元素（用于事件绑定，只返回 HTMLElement）
    const getActualReferenceElement = (): HTMLElement | null => {
      // 优先使用 reference prop
      if (reference.value) {
        const resolved = resolveReferenceElement(reference.value);
        // 虚拟元素不能绑定事件
        if (resolved && resolved instanceof HTMLElement) {
          return resolved;
        }
        return null;
      }
      // 其次使用 target prop（兼容 PointerEvent）
      if (target.value) {
        if (target.value instanceof PointerEvent) {
          // 对于 PointerEvent，使用事件目标元素
          return target.value.target as HTMLElement;
        }
        return resolveReferenceElement(target.value as HTMLElement | string) as HTMLElement | null;
      }
      return null;
    };

    // 获取用于 floating-ui 定位的 reference（可以是 HTMLElement 或 VirtualElement）
    const getFloatingReference = (): HTMLElement | VirtualElement | null => {
      if (reference.value) {
        return resolveReferenceElement(reference.value);
      }
      if (target.value) {
        if (target.value instanceof PointerEvent) {
          return target.value.target as HTMLElement;
        }
        return resolveReferenceElement(target.value);
      }
      return null;
    };

    /**
     * 解析默认 slot reference 元素
     *
     * referenceWrapperRef 使用 display: contents，自身无布局尺寸，
     * 因此需要从子元素中找到实际的 reference 元素。
     *
     * 策略：优先使用第一个元素子节点作为 reference；否则向下寻找第一个具有可见尺寸的 HTMLElement。
     */
    const resolveDefaultReferenceElement = (): HTMLElement | null => {
      const wrapper = referenceWrapperRef.value;
      if (!wrapper) return null;

      // display: contents 的元素自身尺寸为 0，直接查找子元素
      const firstChild = wrapper.firstElementChild;
      if (firstChild instanceof HTMLElement) {
        return firstChild;
      }

      const descendants = wrapper.querySelectorAll('*');
      for (const node of Array.from(descendants)) {
        if (!(node instanceof HTMLElement)) continue;
        const rect = node.getBoundingClientRect();
        if (rect.width > 0 || rect.height > 0) {
          return node;
        }
      }

      // 兜底仍返回 wrapper，保证类型与行为一致
      return wrapper;
    };

    // 延迟控制
    const delayOptions = computed(() => ({
      isShow: isShow.value,
      popoverDelay: popoverDelay.value,
      disabled: disabled.value,
      always: always.value,
      trigger: trigger.value,
    }));

    const { isOpen, show, hide, toggle, stopHide, clearTimers } = useDelay(delayOptions, (event, payload) => {
      if (event === 'afterShow') {
        emit(EMIT_EVENTS.AFTER_SHOW, payload);
        // 避免循环更新：只有当 isShow 与当前状态不一致时才 emit
        if (!isShow.value) {
          emit(EMIT_EVENTS.UPDATE_IS_SHOW, true);
        }
      } else if (event === 'afterHidden') {
        emit(EMIT_EVENTS.AFTER_HIDDEN, payload);
        // 避免循环更新：只有当 isShow 与当前状态不一致时才 emit
        if (isShow.value) {
          emit(EMIT_EVENTS.UPDATE_IS_SHOW, false);
        }
      }
    });

    const resolveBoundary = () => {
      const b = boundary.value;
      return typeof b === 'function' ? b() : b;
    };

    const floatingStrategy = computed<'absolute' | 'fixed'>(() => {
      if (disableTeleport.value) return 'absolute';

      const b = resolveBoundary();
      if (typeof b === 'string') {
        return (b === 'body' || b === 'parent') ? 'fixed' : 'absolute';
      }
      if (b === document.body) return 'fixed';
      return 'absolute';
    });

    // 浮动定位
    const floatingProps = computed(() => ({
      placement: placement.value as PopoverPlacement,
      offset: offset.value as IAxesOffsets | number,
      padding: padding.value,
      arrow: arrow.value,
      autoPlacement: autoPlacement.value,
      autoVisibility: autoVisibility.value,
      disableTransform: disableTransform.value,
      strategy: floatingStrategy.value,
      isOpen: isOpen.value,
    }));

    // 更新 floating-ui 定位 reference（避免 computed 缓存导致 DOM 布局变化时 reference 解析不生效）
    const updateFloatingReference = () => {
      // 优先使用 floatingReference（仅定位，不影响 slot 渲染）
      if (floatingReference.value) {
        const resolved = resolveReferenceElement(floatingReference.value);
        if (resolved) {
          floatingReferenceRef.value = resolved;
          return;
        }
      }
      // 其次使用 reference/target（会影响 slot 渲染）
      if (useCustomReference.value) {
        floatingReferenceRef.value = getFloatingReference();
        return;
      }
      floatingReferenceRef.value = resolveDefaultReferenceElement();
    };

    // wrapper/props/展开状态变化时，重新解析 reference
    watch(
      () => referenceWrapperRef.value,
      () => {
        nextTick(updateFloatingReference);
      },
      { immediate: true },
    );
    watch([() => reference.value, () => target.value, () => floatingReference.value], () =>
      nextTick(updateFloatingReference),
    );
    watch(isOpen, val => {
      if (val) {
        nextTick(updateFloatingReference);
      }
    });

    const { floatingStyles, arrowStyles, update, arrowSide } = usePopoverFloating(
      floatingProps,
      floatingReferenceRef,
      floatingRef,
      arrowRef,
    );

    // 触发事件管理
    const triggerProps = computed(() => ({
      trigger: trigger.value as TriggerType,
      disabled: disabled.value,
      always: always.value,
      hideIgnoreReference: hideIgnoreReference.value,
      isOpen: isOpen.value,
    }));

    const { referenceListeners, floatingListeners } = useTrigger(triggerProps, {
      show,
      hide,
      toggle,
      stopHide,
      emitContentMouseenter: (e: MouseEvent) => emit(EMIT_EVENTS.CONTENT_MOUSEENTER, e),
      emitContentMouseleave: (e: MouseEvent) => emit(EMIT_EVENTS.CONTENT_MOUSELEAVE, e),
    });

    // hover 模式：把“子弹层”视为内容区的延伸（避免 PopConfirm 内 Select 下拉导致父弹层收起）
    let hoverTrackMoveHandler: ((e: MouseEvent) => void) | null = null;
    const stopHoverTrack = () => {
      if (!hoverTrackMoveHandler) return;
      document.removeEventListener('mousemove', hoverTrackMoveHandler, true);
      hoverTrackMoveHandler = null;
    };

    const isTargetInSelfOrChildren = (targetEl: HTMLElement): boolean => {
      const actualRef = floatingReferenceRef.value;
      if (
        (actualRef instanceof HTMLElement && actualRef.contains(targetEl)) ||
        referenceWrapperRef.value?.contains(targetEl)
      ) {
        return true;
      }
      if (floatingRef.value?.contains(targetEl)) {
        return true;
      }
      const childId = findPopoverIdFromElement(targetEl);
      if (!childId || childId === popoverId) return false;
      const parent = __bkPopoverRegistry.get(popoverId);
      const child = __bkPopoverRegistry.get(childId);
      if (!parent?.floatingEl || !child) return false;
      const childRef = child.referenceEl;
      const childWrapper = child.referenceWrapperEl;
      return (
        (!!childRef && parent.floatingEl.contains(childRef)) ||
        (!!childWrapper && parent.floatingEl.contains(childWrapper))
      );
    };

    const startHoverTrack = () => {
      if (hoverTrackMoveHandler) return;
      hoverTrackMoveHandler = (e: MouseEvent) => {
        if (disabled.value || always.value) return;
        const t = e.target;
        if (!(t instanceof HTMLElement)) return;
        if (isTargetInSelfOrChildren(t)) return;
        stopHoverTrack();
        if (isOpen.value) {
          hide();
        }
      };
      document.addEventListener('mousemove', hoverTrackMoveHandler, true);
    };

    const isMouseleaveToChildPopover = (e: MouseEvent): boolean => {
      const rt = e.relatedTarget;
      const childId = findPopoverIdFromElement(rt);
      if (!childId || childId === popoverId) return false;
      const parent = __bkPopoverRegistry.get(popoverId);
      const child = __bkPopoverRegistry.get(childId);
      if (!parent?.floatingEl || !child) return false;
      const childRef = child.referenceEl;
      const childWrapper = child.referenceWrapperEl;
      return (
        (!!childRef && parent.floatingEl.contains(childRef)) ||
        (!!childWrapper && parent.floatingEl.contains(childWrapper))
      );
    };

    const guardedFloatingListeners = computed(() => {
      const base = floatingListeners.value;
      if (trigger.value !== 'hover') return base;
      return {
        ...base,
        onMouseenter: (e: Event) => {
          stopHoverTrack();
          base.onMouseenter?.(e);
        },
        onMouseleave: (e: Event) => {
          const me = e as MouseEvent;
          if (isMouseleaveToChildPopover(me)) {
            // 进入子弹层时保持显示，并开始跟踪鼠标离开“父 + 子”的整体区域
            startHoverTrack();
            return;
          }
          base.onMouseleave?.(e);
        },
      };
    });

    // 计算样式
    const resolvePixelValue = (val: number | string): string => {
      if (typeof val === 'number' || /^\d+$/.test(String(val))) {
        return `${val}px`;
      }
      return String(val);
    };

    // 内容样式
    const contentStyles = computed<CSSProperties>(() => {
      const styles: CSSProperties = {
        ...floatingStyles.value,
        width: width.value !== 'auto' ? resolvePixelValue(width.value) : undefined,
        height: height.value !== 'auto' ? resolvePixelValue(height.value) : undefined,
        maxWidth: maxWidth.value !== 'auto' ? resolvePixelValue(maxWidth.value) : undefined,
        maxHeight: maxHeight.value !== 'auto' ? resolvePixelValue(maxHeight.value) : undefined,
      };

      // 设置 z-index
      if (isOpen.value) {
        styles.zIndex = zIndex.value ?? bkZIndexManager.getPopperIndex();
      }

      // 隐藏时设置 display: none
      if (!isOpen.value && renderDirective.value === 'show') {
        styles.display = 'none';
      }

      return styles;
    });

    // 解析 theme 中的额外类名
    // theme 可能包含 "light bk-select-popover" 这样的格式，需要提取出额外的类名
    const parseTheme = (themeValue: string) => {
      const parts = themeValue.trim().split(/\s+/);
      const baseTheme = parts[0]; // 'dark' 或 'light'
      const extraClasses = parts.slice(1); // 额外的类名
      return { baseTheme, extraClasses };
    };

    // 内容类名
    const contentClass = computed(() => {
      const { extraClasses } = parseTheme(theme.value);
      const classes = [
        resolveClassName('popover'),
        resolveClassName('pop2-content'),
        extCls.value,
        ...extraClasses, // 添加 theme 中的额外类名
      ];

      if (!isOpen.value) {
        classes.push('hidden');
      }

      return classes.filter(Boolean);
    });

    // 计算 data-theme 属性（与旧版保持一致，完整 theme 字符串写入 data-theme）
    const dataTheme = computed(() => theme.value);

    const filterEmptyNodes = (children: VNode[] = []): VNode[] => {
      const nodes: VNode[] = [];
      children.forEach(child => {
        if (Array.isArray(child)) {
          nodes.push(...filterEmptyNodes(child));
          return;
        }
        if (child.type === Fragment) {
          nodes.push(...filterEmptyNodes(child.children as VNode[]));
          return;
        }
        nodes.push(child);
      });
      return nodes.filter(
        child =>
          !(
            child &&
            (child.type === Comment ||
              (child.type === Fragment && Array.isArray(child.children) && child.children.length === 0) ||
              (child.type === Text && `${child.children ?? ''}`.trim() === ''))
          ),
      );
    };

    const hasElementNode = (nodes: VNode[]) =>
      nodes.some(node => node.type !== Text && node.type !== Comment);

    // 处理 clickoutside
    const handleClickOutside = (event: MouseEvent) => {
      if (disabled.value || always.value) {
        return;
      }

      // 命中“子弹层”且其 reference 位于本 popover 内容区内：不视为外部点击
      if (isChildPopoverInteractionFor(popoverId, event)) {
        return;
      }

      const target = event.target as HTMLElement;

      // 点击在 reference 内（包括自定义 reference 和默认 reference）
      const actualRef = floatingReferenceRef.value;
      const isInReference =
        (actualRef instanceof HTMLElement && actualRef.contains(target)) || referenceWrapperRef.value?.contains(target);
      if (isInReference) {
        // 对于 click 和 hover 模式，点击 reference 的行为由 referenceListeners 处理
        if (trigger.value === 'click' || trigger.value === 'hover') {
          return;
        }
        // hideIgnoreReference 为 true 时，点击 reference 不触发 clickoutside
        if (hideIgnoreReference.value) {
          return;
        }
      }

      // 点击在 floating 内
      if (floatingRef.value?.contains(target)) {
        return;
      }

      // 触发 clickoutside 事件（让调用者决定如何处理）
      emit(EMIT_EVENTS.CLICK_OUTSIDE, { isShow: isOpen.value, event });

      // 决定是否自动隐藏 popover
      // manual 模式下不自动隐藏（除非 forceClickoutside）
      if (trigger.value === 'manual' && !forceClickoutside.value) {
        return;
      }

      // disableOutsideClick 为 true 时不自动隐藏（除非 forceClickoutside）
      if (disableOutsideClick.value && !forceClickoutside.value) {
        return;
      }

      // 隐藏 popover
      if (isOpen.value) {
        hide();
      }
    };

    // 处理点击内容区
    const handleClickContent = () => {
      if (clickContentAutoHide.value && trigger.value !== 'manual' && !always.value) {
        hide();
      }
    };

    // 处理 componentEventDelay
    const contentPointerEvents = ref<'auto' | 'none'>('auto');
    let eventDelayTimer: ReturnType<typeof setTimeout> | undefined;

    watch(isOpen, newVal => {
      if (newVal && componentEventDelay.value > 0) {
        contentPointerEvents.value = 'none';
        eventDelayTimer = setTimeout(() => {
          contentPointerEvents.value = 'auto';
        }, componentEventDelay.value);
      }
    });

    // 渲染内容
    const renderContent = () => {
      if (allowHtml.value && typeof content.value === 'string') {
        return <span innerHTML={content.value}></span>;
      }
      return content.value;
    };

    // 是否应该渲染内容
    const shouldRenderContent = computed(() => {
      if (renderDirective.value === 'show') {
        return true;
      }

      if (renderType.value === RenderType.AUTO) {
        return true;
      }

      return isOpen.value;
    });

    // 为自定义 reference 元素添加事件监听（仅对 HTMLElement 有效，虚拟元素不绑定事件）
    const bindCustomReferenceEvents = () => {
      if (!useCustomReference.value || isVirtualReferenceMode.value) return;

      const customRef = getActualReferenceElement();
      if (!customRef) return;

      const listeners = referenceListeners.value;
      Object.keys(listeners).forEach(eventName => {
        // 将 onMouseenter 转换为 mouseenter
        const nativeEventName = eventName.replace(/^on/, '').toLowerCase();
        customRef.addEventListener(nativeEventName, listeners[eventName] as EventListener);
      });
    };

    const unbindCustomReferenceEvents = () => {
      if (!useCustomReference.value || isVirtualReferenceMode.value) return;

      const customRef = getActualReferenceElement();
      if (!customRef) return;

      const listeners = referenceListeners.value;
      Object.keys(listeners).forEach(eventName => {
        const nativeEventName = eventName.replace(/^on/, '').toLowerCase();
        customRef.removeEventListener(nativeEventName, listeners[eventName] as EventListener);
      });
    };

    // 监听自定义 reference 变化
    watch([() => reference.value, () => target.value], () => {
      unbindCustomReferenceEvents();
      nextTick(() => {
        bindCustomReferenceEvents();
      });
    });

    // 挂载时添加 clickoutside 监听
    onMounted(() => {
      document.addEventListener('click', handleClickOutside, true);

      // 绑定自定义 reference 事件
      bindCustomReferenceEvents();

      // 如果 always 为 true，立即显示
      if (always.value) {
        nextTick(() => {
          show();
        });
      }
    });

    // 卸载时清理
    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside, true);
      unbindCustomReferenceEvents();
      clearTimers();
      if (eventDelayTimer) {
        clearTimeout(eventDelayTimer);
      }
      __bkPopoverRegistry.delete(popoverId);
      stopHoverTrack();
    });

    // 注册到全局表（用于父子弹层交互判定）
    const updateRegistry = () => {
      const referenceEl =
        // 自定义 reference（仅 HTMLElement 可用）
        getActualReferenceElement() ||
        // 默认 reference（wrapper 尺寸为 0 时会解析到真实触发器）
        resolveDefaultReferenceElement();

      __bkPopoverRegistry.set(popoverId, {
        id: popoverId,
        floatingEl: floatingRef.value,
        referenceEl,
        referenceWrapperEl: referenceWrapperRef.value,
      });
    };

    watch([floatingRef, floatingReferenceRef, referenceWrapperRef], () => updateRegistry(), { immediate: true });

    // 暴露公共方法
    // updatePopover 保持与旧 API 兼容，接受可选参数但实际上使用 @floating-ui/vue 自动更新
    const updatePopover = (_virtualEl?: unknown, _props?: unknown, callFn?: () => void) => {
      update();
      if (typeof callFn === 'function') {
        nextTick(callFn);
      }
    };

    const resetPopover = () => {
      clearTimers();
      isOpen.value = false;
      nextTick(() => {
        update();
      });
    };

    expose({
      show,
      hide,
      updatePopover,
      resetPopover,
      stopHide,
      handleClickOutside,
      isOpen,
      localIsShow: isOpen, // 兼容旧 API
    });

    const teleportTo = computed(() => {
      const boundaryVal = resolveBoundary();
      if (typeof boundaryVal === 'string') {
        if (boundaryVal === 'body' || boundaryVal === 'parent') {
          return 'body';
        }
        try {
          const target = document.querySelector(boundaryVal);
          if (target) {
            return boundaryVal;
          }
        } catch {
          // 无效选择器
        }
        return 'body';
      }
      return boundaryVal instanceof HTMLElement ? boundaryVal : 'body';
    });

    return () => {
      // 渲染 floating content
      const floatingNode = shouldRenderContent.value ? (
        <div
          ref={floatingRef}
          style={{
            ...contentStyles.value,
            pointerEvents: contentPointerEvents.value,
          }}
          class={contentClass.value}
          data-arrow={arrowSide.value}
          data-bk-popover-id={popoverId}
          data-theme={dataTheme.value}
          onClick={handleClickContent}
          {...guardedFloatingListeners.value}
        >
          {/* 箭头 */}
          {arrow.value && (
            <div
              ref={arrowRef}
              style={arrowStyles.value}
              class={resolveClassName('pop2-arrow')}
              data-arrow={arrowSide.value}
            >
              {slots.arrow?.()}
            </div>
          )}
          {/* 内容 */}
          {slots.content?.() ?? renderContent()}
        </div>
      ) : null;

      // 如果使用自定义 reference（虚拟元素或外部 HTMLElement），只渲染 Teleport 内容
      if (useCustomReference.value) {
        return (
          <Teleport
            disabled={disableTeleport.value}
            to={teleportTo.value}
          >
            {floatingNode}
          </Teleport>
        );
      }

      const defaultSlotNodes = (slots.default?.() ?? []) as VNode[];
      const useContentsWrapper = hasElementNode(filterEmptyNodes(defaultSlotNodes));

      // 默认情况：渲染 reference 和 floating content
      // 元素触发器使用 display: contents 避免影响布局；纯文本触发器使用 inline-block 提供可定位尺寸
      return (
        <>
          <span
            ref={referenceWrapperRef}
            style={useContentsWrapper ? { display: 'contents' } : { display: 'inline-block' }}
            class={[referenceCls.value, attrs.class as string]}
            {...referenceListeners.value}
          >
            {defaultSlotNodes}
          </span>
          <Teleport
            disabled={disableTeleport.value}
            to={teleportTo.value}
          >
            {floatingNode}
          </Teleport>
        </>
      );
    };
  },
});
