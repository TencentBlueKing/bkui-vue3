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

import { computed, defineComponent, nextTick, ref, Transition, watch } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { bkZIndexManager, isElement, mask } from '@bkui-vue/shared';

import { propsMixin } from './props.mixin';

export default defineComponent({
  name: 'Modal',
  props: {
    ...propsMixin,
  },
  emits: ['quick-close', 'quickClose', 'hidden', 'shown', 'close'],
  setup(props, ctx) {
    const visible = ref(false);
    const zIndex = ref(props.zIndex);
    const refRoot = ref<HTMLElement>();
    const refMask = ref<HTMLElement>();
    const backgroundColor = ref('rgba(0,0,0,0.6)');
    let closeTimer;
    const dialogWidth = computed(() => {
      return /^\d+\.?\d*$/.test(`${props.width}`) ? `${props.width}px` : props.width;
    });
    const dialogHeight = computed(() => {
      return /^\d+\.?\d*$/.test(`${props.height}`) ? `${props.height}px` : props.height;
    });

    const compStyle = computed(() => {
      return {
        width: dialogWidth.value,
        height: dialogHeight.value,
        minHeigth: `${200}px`,
        display: visible.value ? 'inherit' : 'none',
        zIndex: zIndex.value || 'inherit',
        left: props.left,
        top: props.top,
        [props.direction]: 0,
      };
    });
    const enableTeleport = ref(!!props.transfer);
    const teleportTo = ref<string | HTMLElement>('body');

    const resolveTransfer = () => {
      if (props.transfer) {
        if (typeof props.transfer === 'boolean') {
          teleportTo.value = 'body';
          return;
        }

        teleportTo.value = props.transfer;
      }
    };

    resolveTransfer();
    const { resolveClassName } = usePrefix();
    const resolveClosetModal = () => {
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

    const fullscreenStyle = computed(() => {
      return {
        width: `${100}%`,
        height: `${100}%`,
      };
    });

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
      }, 250);
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
      { immediate: true },
    );

    const handleBeforeClose = callbackFn => {
      if (typeof props.beforeClose === 'function') {
        if (props.beforeClose() !== true) {
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

    return {
      visible,
      compStyle,
      fullscreenStyle,
      handleClickOutSide,
      refRoot,
      refMask,
      showMask: props.showMask,
    };
  },
  render() {
    const { resolveClassName } = usePrefix();
    const maxHeight = this.maxHeight ? { maxHeight: this.maxHeight } : {};
    const bodyClass = `${resolveClassName('modal-body')} ${this.animateType === 'slide' ? this.direction : ''}`;
    return (
      <div
        ref='refRoot'
        class={[resolveClassName('modal-ctx'), this.visible ? '--show' : '--hide']}
        style={{ zIndex: this.compStyle.zIndex }}
      >
        {this.showMask ? (
          <div
            ref='refMask'
            class={[resolveClassName('modal-ctx-mask'), this.visible ? '--show' : '--hide']}
            onClick={this.handleClickOutSide}
            style={{ zIndex: this.compStyle.zIndex }}
          ></div>
        ) : (
          ''
        )}

        <div
          class={[resolveClassName('modal-wrapper'), this.extCls ?? '', this.size, this.fullscreen ? 'fullscreen' : '']}
          style={[this.compStyle, this.fullscreen ? this.fullscreenStyle : '']}
        >
          <Transition name={this.animateType}>
            {this.visible ? (
              <div class={bodyClass}>
                <div class={resolveClassName('modal-header')}>{this.$slots.header?.() ?? ''}</div>
                <div
                  class={resolveClassName('modal-content')}
                  style={[this.dialogType === 'show' ? 'padding-bottom: 20px' : '', { ...maxHeight }]}
                >
                  {this.$slots.default?.() ?? ''}
                </div>
                {this.dialogType === 'show' ? (
                  ''
                ) : (
                  <div class={resolveClassName('modal-footer')}>{this.$slots.footer?.() ?? ''}</div>
                )}
                {this.closeIcon && <div class={resolveClassName('modal-close')}>{this.$slots.close?.() ?? ''}</div>}
              </div>
            ) : (
              ''
            )}
          </Transition>
        </div>
      </div>
    );
  },
});
