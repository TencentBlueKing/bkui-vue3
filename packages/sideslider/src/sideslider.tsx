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

import { defineComponent, getCurrentInstance, nextTick, onBeforeUnmount, ref, useAttrs, useSlots, watch, withModifiers } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { AngleLeft, AngleRight } from '@bkui-vue/icon';
import Modal, { propsMixin } from '@bkui-vue/modal';
import { PropTypes } from '@bkui-vue/shared';
import cloneDeep from 'lodash/cloneDeep';

const sliderProps = cloneDeep(propsMixin);
sliderProps.width.default = '400';

export default defineComponent({
  name: 'Sideslider',
  inheritAttrs: false,
  props: {
    ...sliderProps,
    title: PropTypes.string.def(''),
    direction: {
      type: String,
      default: 'right',
      validator: (value: string) => {
        const textAlign = ['left', 'right'];
        if (textAlign.indexOf(value) < 0) {
          console.error(`direction property is not valid: '${value}',【${textAlign.join(' | ')}】`);
          return false;
        }
        return true;
      },
    },
    resizable: PropTypes.bool.def(false), // 是否可以拖拽调整大小
    minWidth: PropTypes.number.def(400), // 最小宽度
    maxWidth: PropTypes.number.def(Infinity), // 最大宽度
    triggerWidth: PropTypes.number.def(5), // 拖拽触发区域宽度
    immediate: PropTypes.bool.def(false), // 是否实时拖拽（拖拽时立即改变宽度）
  },

  emits: ['closed', 'update:isShow', 'shown', 'hidden', 'animation-end', 'before-resize', 'resizing', 'after-resize'],

  setup(props, { emit }) {
    const attrs = useAttrs();
    const slots = useSlots();
    const instance = getCurrentInstance();
    const { resolveClassName } = usePrefix();

    // 拖拽相关状态
    const currentWidth = ref<number>(typeof props.width === 'number' ? props.width : parseInt(props.width) || 400);
    // 代理线
    const resizeProxyRef = ref<HTMLElement>(null);
    // 遮罩
    const resizeMaskRef = ref<HTMLElement>(null);
    // modalWrapper
    const modalWrapperRef = ref<HTMLElement>(null);
    // content
    const contentRef = ref<HTMLElement>(null);
    // trigger
    const triggerRef = ref<HTMLElement>(null);
    // state
    const state = ref<any>({});

    const handleClose = async () => {
      let shouldClose = true;
      if (typeof props.beforeClose === 'function') {
        shouldClose = await props.beforeClose();
      }
      if (shouldClose) {
        emit('update:isShow', false);
        emit('closed');
        emit('animation-end');
      }
    };

    const handleShown = () => {
      emit('shown');
      // 当侧边栏显示后，获取 modalWrapper 的引用
      if (props.resizable && contentRef.value) {
        nextTick(() => {
          // 从当前实例的 content 元素向上查找 modal-wrapper，避免多个实例冲突
          let element = contentRef.value?.parentElement;
          while (element) {
            if (element.classList.contains(resolveClassName('modal-wrapper'))) {
              modalWrapperRef.value = element as HTMLElement;
              break;
            }
            element = element.parentElement;
          }
        });
      }
    };

    const handleHidden = () => {
      emit('hidden');
      // 清理引用
      if (props.resizable) {
        modalWrapperRef.value = null;
      }
    };

    // 获取实际宽度值（限制在 min 和 max 之间）
    const getRealValue = (current: number) => {
      const screenWidth = window.innerWidth;
      const maxAllowed = Math.min(props.maxWidth, screenWidth - 100); // 至少留100px空间
      return Math.min(maxAllowed, Math.max(props.minWidth, current));
    };

    // 更新 resizeProxy 的样式
    const updateResizeProxyStyle = (width: number) => {
      if (!resizeProxyRef.value) return;
      resizeProxyRef.value.style.visibility = 'visible';
      if (props.direction === 'left') {
        resizeProxyRef.value.style.inset = `0 auto 0 ${width}px`;
      } else {
        resizeProxyRef.value.style.inset = `0 ${width}px 0 auto`;
      }
    };

    // 更新遮罩的样式
    const updateResizeMaskStyle = (show: boolean) => {
      if (!resizeMaskRef.value) return;
      resizeMaskRef.value.style.display = show ? 'block' : 'none';
      resizeMaskRef.value.style.cursor = 'col-resize';
    };

    // mousedown 事件处理
    const handleMousedown = (event: Event) => {
      const mouseEvent = event as MouseEvent;
      if (!props.resizable) return;
      
      emit('before-resize', mouseEvent);
      
      const rect = modalWrapperRef.value?.getBoundingClientRect();
      if (!rect) return;

      // 在 immediate 模式下，先同步 currentWidth 为实际宽度，避免闪动
      if (props.immediate) {
        currentWidth.value = rect.width;
      }

      state.value = Object.freeze({
        mouse: {
          clientX: mouseEvent.clientX,
        },
        sidebar: {
          width: rect.width,
        },
      });

      updateResizeMaskStyle(true);

      // 非 immediate 模式下显示代理线
      if (!props.immediate) {
        updateResizeProxyStyle(rect.width);
      }

      let finalWidth = rect.width;

      const handleMouseMove = (event: MouseEvent) => {
        let delta: number;
        if (props.direction === 'left') {
          delta = event.clientX - state.value.mouse.clientX;
        } else {
          delta = state.value.mouse.clientX - event.clientX;
        }
        
        const newWidth = state.value.sidebar.width + delta;
        finalWidth = getRealValue(newWidth);
        
        // immediate 模式：直接更新宽度
        if (props.immediate) {
          currentWidth.value = finalWidth;
        } else {
          // 非 immediate 模式：更新代理线位置
          updateResizeProxyStyle(finalWidth);
        }
        
        emit('resizing', finalWidth);
      };

      const handleMouseUp = () => {
        if (resizeProxyRef.value) {
          resizeProxyRef.value.style.visibility = 'hidden';
        }
        updateResizeMaskStyle(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        // 只在非 immediate 模式下才需要最后更新宽度
        if (!props.immediate) {
          currentWidth.value = finalWidth;
        }

        emit('after-resize', finalWidth);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    // 监听 width prop 变化
    watch(() => props.width, (newWidth) => {
      const width = typeof newWidth === 'number' ? newWidth : parseInt(newWidth) || 400;
      currentWidth.value = width;
    });


    return () => {
      const modelSlot = {
        header: () => (
          <>
            <div class={`${resolveClassName('sideslider-header')}`}>
              <div
                class={`${resolveClassName('sideslider-close')}`}
                onClick={() => void handleClose()}
              >
                {props.direction === 'left' ? <AngleLeft /> : <AngleRight />}
              </div>
              <div class={`${resolveClassName('sideslider-title')}`}>{slots.header?.() ?? props.title}</div>
            </div>
          </>
        ),
        default: () => (
          <div 
            ref={contentRef}
            class={`${resolveClassName('sideslider-content')}`}
          >
            {slots.default?.()}
            {/* 拖拽触发区域 */}
            {props.resizable && (
              <>
                <i
                  ref={triggerRef}
                  style={`width: ${props.triggerWidth}px;`}
                  class={`${resolveClassName('sideslider-resize-trigger')}`}
                  onMousedown={withModifiers(handleMousedown, ['left'])}
                ></i>
                <i
                  ref={resizeProxyRef}
                  class={[`${resolveClassName('sideslider-resize-proxy')}`, props.direction]}
                ></i>
              </>
            )}
          </div>
        ),
      };

      if (slots.footer) {
        Object.assign(modelSlot, {
          footer: () => {
            return <div class={`${resolveClassName('sideslider-footer')}`}>{slots.footer()}</div>;
          },
        });
      }

      const inheritAttrs = { ...attrs };
      if (instance.vnode.scopeId) {
        inheritAttrs[instance.vnode.scopeId] = '';
      }

      return (
        <>
          <Modal
            {...inheritAttrs}
            width={currentWidth.value}
            class={{
              [resolveClassName('sideslider')]: true,
              [`is-position-${props.direction}`]: props.direction,
              [`${resolveClassName('sideslider-resizable')}`]: props.resizable,
            }}
            extCls={props.extCls}
            animateType={props.direction}
            backgroundColor={props.backgroundColor}
            closeIcon={false}
            escClose={props.escClose}
            isShow={props.isShow}
            quickClose={props.quickClose}
            renderDirective={props.renderDirective}
            showMask={props.showMask}
            transfer={props.transfer}
            zIndex={props.zIndex}
            onClose={handleClose}
            onHidden={handleHidden}
            onShown={handleShown}
          >
            {modelSlot}
          </Modal>
          {/* 拖拽遮罩 */}
          {props.resizable && (
            <div
              ref={resizeMaskRef}
              class={`${resolveClassName('sideslider-resize-mask')}`}
            ></div>
          )}
        </>
      );
    };
  },
});
