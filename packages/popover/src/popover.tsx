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
  computed,
  CSSProperties,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  Teleport,
  toRefs,
  watch,
} from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { bkZIndexManager, RenderType } from '@bkui-vue/shared';

import { useDelay, usePopoverFloating, useTrigger } from './composables';
import { PopoverProps } from './props';
import type { TriggerType, PopoverPlacement, IAxesOffsets, VirtualElement } from './types';

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
    const { resolveClassName } = usePrefix();

    // 元素引用
    const referenceRef = ref<HTMLElement | null>(null);
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
    } = toRefs(props);

    // 判断是否为虚拟元素
    const isVirtualElement = (el: unknown): el is VirtualElement => {
      return el !== null && typeof el === 'object' && 'getBoundingClientRect' in el && typeof (el as any).getBoundingClientRect === 'function';
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
        return resolveReferenceElement(target.value as string | HTMLElement) as HTMLElement | null;
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

    // 浮动定位
    const floatingProps = computed(() => ({
      placement: placement.value as PopoverPlacement,
      offset: offset.value as number | IAxesOffsets,
      padding: padding.value,
      arrow: arrow.value,
      autoPlacement: autoPlacement.value,
      autoVisibility: autoVisibility.value,
      disableTransform: disableTransform.value,
      isOpen: isOpen.value,
    }));

    // 计算实际使用的 reference 元素（用于 floating-ui 定位）
    const actualReferenceRef = computed(() => {
      if (useCustomReference.value) {
        return getFloatingReference();
      }
      return referenceRef.value;
    });

    const {
      floatingStyles,
      arrowStyles,
      update,
      arrowSide,
    } = usePopoverFloating(floatingProps, actualReferenceRef, floatingRef, arrowRef);

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

    // 计算样式
    const resolvePixelValue = (val: string | number): string => {
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

    // 计算 data-theme 属性（只取基础主题部分）
    const dataTheme = computed(() => {
      const { baseTheme } = parseTheme(theme.value);
      return baseTheme;
    });

    // 处理 clickoutside
    const handleClickOutside = (event: MouseEvent) => {
      if (disabled.value || always.value) {
        return;
      }

      const target = event.target as HTMLElement;

      // 点击在 reference 内（包括自定义 reference 和默认 reference）
      const actualRef = actualReferenceRef.value;
      const isInReference = (
        (actualRef instanceof HTMLElement && actualRef.contains(target)) ||
        referenceRef.value?.contains(target)
      );
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

    watch(isOpen, (newVal) => {
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
    watch(
      [() => reference.value, () => target.value],
      () => {
        unbindCustomReferenceEvents();
        nextTick(() => {
          bindCustomReferenceEvents();
        });
      },
    );

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
    });

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

    // 计算 boundary（移到 render 函数外）
    const teleportTo = computed(() => {
      if (typeof boundary.value === 'string') {
        // 特殊值直接返回
        if (boundary.value === 'body' || boundary.value === 'parent') {
          return 'body';
        }
        // 检查选择器对应的元素是否存在
        try {
          const target = document.querySelector(boundary.value);
          if (target) {
            return boundary.value;
          }
        } catch {
          // 无效选择器
        }
        // 元素不存在，回退到 body
        return 'body';
      }
      // HTMLElement 直接返回，如果无效则回退到 body
      return boundary.value || 'body';
    });

    return () => {
      // 渲染 floating content
      const floatingNode = shouldRenderContent.value ? (
        <div
          ref={floatingRef}
          class={contentClass.value}
          style={{
            ...contentStyles.value,
            pointerEvents: contentPointerEvents.value,
          }}
          data-theme={dataTheme.value}
          data-arrow={arrowSide.value}
          onClick={handleClickContent}
          {...floatingListeners.value}
        >
          {/* 箭头 */}
          {arrow.value && (
            <div
              ref={arrowRef}
              class={resolveClassName('pop2-arrow')}
              style={arrowStyles.value}
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
          <Teleport to={teleportTo.value} disabled={disableTeleport.value}>
            {floatingNode}
          </Teleport>
        );
      }

      // 默认情况：渲染 reference 和 floating content
      return (
        <>
          <span
            ref={referenceRef}
            class={referenceCls.value}
            style={{ display: 'inline-block' }}
            {...referenceListeners.value}
          >
            {slots.default?.()}
          </span>
          <Teleport to={teleportTo.value} disabled={disableTeleport.value}>
            {floatingNode}
          </Teleport>
        </>
      );
    };
  },
});
