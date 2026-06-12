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
  Fragment,
  computed,
  defineComponent,
  getCurrentInstance,
  isVNode,
  reactive,
  ref,
  useAttrs,
  useSlots,
} from 'vue';

import Button from '@bkui-vue/button';
import { useLocale, usePrefix } from '@bkui-vue/config-provider';
import { Error } from '@bkui-vue/icon';
import Modal from '@bkui-vue/modal';

import { emits } from './emits';
import { props } from './props';

export default defineComponent({
  name: 'Dialog',
  inheritAttrs: false,
  props,
  emits,
  setup(props, { emit }) {
    const t = useLocale('dialog');

    const attrs = useAttrs();
    const slots = useSlots();
    const { resolveClassName } = usePrefix();
    const instance = getCurrentInstance();

    const isMoveing = ref(false);

    const positionData = reactive({
      moveStyle: {
        top: '50%',
        left: '50%',
      },
    });

    const localConfirmText = computed(() => {
      if (props.confirmText === undefined) {
        return t.value.ok;
      }
      return props.confirmText;
    });
    const localCancelText = computed(() => {
      if (props.cancelText === undefined) {
        return t.value.cancel;
      }
      return props.cancelText;
    });
    const localPrevText = computed(() => {
      if (props.prevText === undefined) {
        return t.value.prev;
      }
      return props.prevText;
    });
    const localNextText = computed(() => {
      if (props.nextText === undefined) {
        return t.value.next;
      }
      return props.nextText;
    });

    // 关闭弹框
    const handleClose = async () => {
      let shouldClose = true;
      if (typeof props.beforeClose === 'function') {
        shouldClose = await props.beforeClose();
      }

      if (shouldClose) {
        emit('update:isShow', false);
        emit('closed');
      }
    };

    const handleConfirm = () => {
      emit('update:isShow', false);
      emit('confirm');
    };

    const handleShown = () => {
      emit('shown');
    };

    const handleHidden = () => {
      emit('hidden');
    };

    // 上一步
    const handlePrevStep = () => {
      emit('prev');
    };
    // 下一步
    const handleNextStep = () => {
      emit('next');
    };

    // 拖拽事件
    const handleMousedown = e => {
      if (props.fullscreen) {
        return false;
      }
      if (!props.draggable) {
        return false;
      }
      const clientRect = e.currentTarget.parentNode.parentNode.getBoundingClientRect();
      const boxLeft = clientRect.left + clientRect.width / 2;
      const boxTop = clientRect.top + clientRect.height / 2;

      isMoveing.value = true;
      const startX = e.clientX;
      const startY = e.clientY;

      document.onmousemove = evt => {
        const diffX = evt.clientX - startX;
        const diffY = evt.clientY - startY;

        positionData.moveStyle.left = `${boxLeft + diffX}px`;
        positionData.moveStyle.top = `${boxTop + diffY}px`;
      };

      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
        isMoveing.value = false;
      };
    };

    const isSlotContentEmpty = (content: unknown): boolean => {
      if (!content) return true;
      if (Array.isArray(content)) return content.every(isSlotContentEmpty);
      if (!isVNode(content)) return false;
      if (content.type === Comment) return true;
      if (content.type === Fragment) return isSlotContentEmpty(content.children);
      return false;
    };

    return () => {
      const headerSlotContent = slots.header?.();
      const hasHeaderSlot = !!slots.header;
      const shouldRenderHeader = hasHeaderSlot ? !isSlotContentEmpty(headerSlotContent) : Boolean(props.title);

      const dialogSlot = {
        header: () => {
          if (!shouldRenderHeader) {
            return null;
          }
          return (
            <>
              {!props.fullscreen && props.draggable && (
                <div
                  class={resolveClassName('dialog-tool')}
                  onMousedown={handleMousedown}
                >
                  {slots.tools?.()}
                </div>
              )}
              <div class={resolveClassName('dialog-header')}>
                <span
                  style={`text-align: ${props.headerAlign}`}
                  class={resolveClassName('dialog-title')}
                >
                  {hasHeaderSlot ? headerSlotContent : props.title}
                </span>
              </div>
            </>
          );
        },
        default: () => {
          if (!slots.default) {
            return null;
          }
          const defaultSlotContent = slots.default();
          if (!props.showContentClass) {
            return defaultSlotContent;
          }
          return <div class={resolveClassName('dialog-content')}>{defaultSlotContent}</div>;
        },
        footer: () => {
          if (slots.footer) {
            return (
              <div
                style={`text-align: ${props.footerAlign}`}
                class={resolveClassName('dialog-footer')}
              >
                {slots.footer()}
              </div>
            );
          }

          if (!['process', 'operation', 'confirm'].includes(props.dialogType)) {
            return null;
          }
          const renderFooterAction = () => {
            if (props.dialogType === 'operation') {
              return (
                <>
                  <Button
                    loading={props.isLoading}
                    theme={props.confirmButtonTheme}
                    onClick={handleConfirm}
                  >
                    {localConfirmText.value}
                  </Button>
                  <Button
                    class={resolveClassName('dialog-cancel')}
                    disabled={props.isLoading}
                    onClick={handleClose}
                  >
                    {localCancelText.value}
                  </Button>
                </>
              );
            }
            if (props.dialogType === 'confirm') {
              return (
                <Button
                  loading={props.isLoading}
                  theme={props.confirmButtonTheme}
                  onClick={handleConfirm}
                >
                  {localConfirmText.value}
                </Button>
              );
            }
            if (props.dialogType === 'process') {
              return (
                <>
                  {props.current > 1 && (
                    <Button
                      class={resolveClassName('dialog-perv')}
                      onClick={handlePrevStep}
                    >
                      {localPrevText.value}
                    </Button>
                  )}
                  {props.current >= 1 && props.current < props.totalStep && (
                    <Button
                      class={resolveClassName('dialog-next')}
                      onClick={handleNextStep}
                    >
                      {localNextText.value}
                    </Button>
                  )}
                  {props.current >= 1 && props.current === props.totalStep && (
                    <Button
                      loading={props.isLoading}
                      theme={props.confirmButtonTheme}
                      onClick={handleConfirm}
                    >
                      {localConfirmText.value}
                    </Button>
                  )}
                  <Button
                    class={resolveClassName('dialog-cancel')}
                    disabled={props.isLoading}
                    onClick={handleClose}
                  >
                    {localCancelText.value}
                  </Button>
                </>
              );
            }
          };
          return (
            <div
              style={`text-align: ${props.footerAlign}`}
              class={resolveClassName('dialog-footer')}
            >
              {renderFooterAction()}
            </div>
          );
        },
        close: () => <Error />,
      };

      const inheritAttrs = { ...attrs };
      if (instance.vnode.scopeId) {
        inheritAttrs[instance.vnode.scopeId] = '';
      }

      return (
        <Modal
          {...inheritAttrs}
          width={props.fullscreen ? 'auto' : props.width}
          class={{
            [resolveClassName('dialog')]: true,
            'is-fullscreen': props.fullscreen,
          }}
          animateType='fadein'
          beforeClose={props.beforeClose}
          closeIcon={props.closeIcon}
          escClose={props.escClose}
          fullscreen={props.fullscreen}
          isShow={props.isShow}
          left={props.fullscreen ? '0px' : positionData.moveStyle.left}
          quickClose={props.quickClose}
          renderDirective={props.renderDirective}
          showMask={props.showMask}
          top={props.fullscreen ? '0px' : positionData.moveStyle.top}
          transfer={props.transfer}
          zIndex={props.zIndex}
          onClose={handleClose}
          onHidden={handleHidden}
          onShown={handleShown}
        >
          {dialogSlot}
        </Modal>
      );
    };
  },
});
