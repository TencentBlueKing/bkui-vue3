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

import {
  computed,
  defineComponent,
  type ExtractPropTypes,
  nextTick,
  onBeforeUnmount,
  ref,
  Transition,
  watch,
} from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { bkZIndexManager, getFullscreenRoot, isElement, isPromise, mask } from '@bkui-vue/shared';

import { useContentResize } from './hooks';
import { propsMixin } from './props.mixin';

export type ModalProps = Readonly<ExtractPropTypes<typeof propsMixin>>;

export default defineComponent({
  name: 'Modal',
  props: {
    ...propsMixin,
  },
  emits: ['quick-close', 'quickClose', 'hidden', 'shown', 'close'],
  setup(props, ctx) {
    const refRoot = ref<HTMLElement>();
    const refMask = ref<HTMLElement>();
    const resizeTargetRef = ref<HTMLElement>();
    const teleportTo = ref<string | HTMLElement>('body');
    const visible = ref(false);
    const zIndex = ref(props.zIndex);
    const enableTeleport = ref(!!props.transfer);
    const backgroundColor = ref('rgba(0,0,0,0.6)');
    let closeTimer;

    const { contentStyles, isContentScroll } = useContentResize(refRoot, resizeTargetRef, props);

    const modalWrapperStyles = computed(() => {
      const baseStyles = {
        display: visible.value ? 'inherit' : 'none',
      };
      if (props.fullscreen) {
        return baseStyles;
      }
      return Object.assign(baseStyles, {
        width: /^\d+\.?\d*$/.test(`${props.width}`) ? `${props.width}px` : props.width,
        left: props.left,
        top: props.top,
        [props.direction]: 0,
      });
    });

    const resolveTransfer = () => {
      if (props.transfer) {
        if (typeof props.transfer === 'boolean') {
          teleportTo.value = getFullscreenRoot();
          return;
        }

        teleportTo.value = getFullscreenRoot(props.transfer);
      }
    };

    const { resolveClassName } = usePrefix();

    const resolveClosetModal = () => {
      resolveTransfer();
      if (enableTeleport.value) {
        if (typeof teleportTo.value === 'string') {
          const target = document.querySelector(teleportTo.value as string);
          target?.appendChild(refRoot.value);
          return;
        }

        if (isElement(teleportTo.value)) {
          (teleportTo.value as HTMLElement).appendChild(refRoot.value);
          return;
        }
      }

      const className = `.${resolveClassName('modal-ctx')}`;
      const parentNode = refRoot.value?.parentElement?.closest(className);
      if (parentNode) {
        enableTeleport.value = true;
        teleportTo.value = 'body';
        const target = document.querySelector(teleportTo.value);
        target?.appendChild(refRoot.value);
      }
    };

    const close = () => {
      if (visible.value) {
        visible.value = false;
        mask.hideMask({
          el: refRoot.value,
          mask: refMask.value,
          showMask: props.showMask,
          backgroundColor: backgroundColor.value,
        });

        ctx.emit('hidden');
        if (enableTeleport.value) {
          refRoot.value?.remove();
        }
      }
    };

    const closeModal = () => {
      mask.hideMask({
        el: refRoot.value,
        mask: refMask.value,
        showMask: props.showMask,
        backgroundColor: backgroundColor.value,
      });

      closeTimer = setTimeout(() => {
        // 直接设为false会失去离开的动画效果，这里延迟设置
        ctx.emit('hidden'); // 为false直接触发hidden事件，在上层有200ms的延时
        if (enableTeleport.value) {
          refRoot.value?.remove();
        }
      }, props.hiddenDelay);
    };

    watch(
      () => props.isShow,
      val => {
        if (val) {
          closeTimer && clearTimeout(closeTimer);
          closeTimer = null;
          if (!props.zIndex) {
            zIndex.value = bkZIndexManager.getModalNextIndex();
          }
          visible.value = true;
          nextTick(() => {
            ctx.emit('shown');
            resolveClosetModal();
            mask.showMask({
              el: refRoot.value,
              mask: refMask.value,
              showMask: props.showMask,
              backgroundColor: backgroundColor.value,
            });
          });
          return;
        }

        visible.value = false;
        closeModal();
      },
      {
        immediate: true,
      },
    );

    const handleBeforeClose = async callbackFn => {
      if (typeof props.beforeClose === 'function') {
        let shouldClose = true;
        const execRet = props.beforeClose();
        if (isPromise(execRet)) {
          shouldClose = await execRet;
        } else {
          shouldClose = execRet;
        }
        if (shouldClose !== true) {
          return;
        }
      }

      callbackFn?.();
    };

    const handleClickOutSide = (e: MouseEvent) => {
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();

      if (props.quickClose) {
        handleBeforeClose(() => {
          ctx.emit('close');
          ctx.emit('quick-close');
          ctx.emit('quickClose');
        });
      }
    };

    onBeforeUnmount(() => {
      close();
    });

    return {
      zIndex,
      visible,
      contentStyles,
      isContentScroll,
      modalWrapperStyles,
      handleClickOutSide,
      refRoot,
      refMask,
      resolveClassName,
      close,
      resizeTargetRef,
    };
  },
  render() {
    return (
      <div
        ref='refRoot'
        class={{
          [this.resolveClassName('modal-ctx')]: true,
          '--show': this.visible,
          '--hide': !this.visible,
        }}
        style={{ zIndex: this.zIndex }}
      >
        {this.showMask && (
          <div
            ref='refMask'
            class={{
              [this.resolveClassName('modal-ctx-mask')]: true,
            }}
            onClick={this.handleClickOutSide}
          />
        )}
        <div
          class={{
            [this.resolveClassName('modal-wrapper')]: true,
            'scroll-able': this.scrollable,
            'multi-instance': this.multiInstance,
          }}
          style={this.modalWrapperStyles}
        >
          <Transition name={this.animateType}>
            {this.visible && (
              <div
                class={{
                  [this.resolveClassName('modal-body')]: true,
                  [this.direction]: this.animateType === 'slide',
                }}
              >
                <div class={this.resolveClassName('modal-header')}>{this.$slots.header?.()}</div>
                <div
                  class={this.resolveClassName('modal-content')}
                  style={this.contentStyles}
                >
                  <div style='position: relative; display: table-cell;'>
                    {this.$slots.default?.()}
                    <div
                      ref='resizeTargetRef'
                      style='position: absolute; top: 0; bottom: 0;'
                    />
                  </div>
                </div>
                <div
                  class={{
                    [this.resolveClassName('modal-footer')]: true,
                    'is-fixed': this.isContentScroll,
                  }}
                >
                  {this.$slots.footer?.()}
                </div>
                {this.closeIcon && <div class={this.resolveClassName('modal-close')}>{this.$slots.close?.()}</div>}
              </div>
            )}
          </Transition>
        </div>
      </div>
    );
  },
});
