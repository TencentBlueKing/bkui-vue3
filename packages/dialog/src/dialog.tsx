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

import { computed, defineComponent, reactive, ref, useAttrs, useSlots, getCurrentInstance } from 'vue';

import Button from '@bkui-vue/button';
import { useLocale, usePrefix } from '@bkui-vue/config-provider';
import { Error } from '@bkui-vue/icon';
import Modal from '@bkui-vue/modal';

import props from './props';

export default defineComponent({
  name: 'Dialog',
  inheritAttrs: false,
  props,
  emits: {
    closed: () => true,
    shown: () => true,
    hidden: () => true,
    'update:isShow': (value: boolean) => value !== undefined,
    confirm: () => true,
    prev: () => true,
    next: () => true,
  },
  setup(props, { emit }) {
    const t = useLocale('dialog');

    const attrs = useAttrs();
    const slots = useSlots();
    const { resolveClassName } = usePrefix();
    const instance = getCurrentInstance();

    const isMoveing = ref(false);

    const positionData = reactive({
      positionX: 0,
      positionY: 0,
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
      const odiv = e.target;
      const parentHeight = e.currentTarget.parentNode.parentNode.offsetHeight;
      const parentWidth = e.currentTarget.parentNode.parentNode.offsetWidth;
      let disX;
      let disY;
      if (positionData.positionX !== 0 && positionData.positionY !== 0) {
        disX = e.clientX - positionData.positionX;
        disY = e.clientY - positionData.positionY;
      } else {
        disX = e.clientX - odiv.offsetLeft;
        disY = e.clientY - odiv.offsetTop;
      }
      isMoveing.value = true;

      document.onmousemove = e => {
        const boxLeft = window.innerWidth - parentWidth;
        const boxTop = window.innerHeight - parentHeight;
        let left = e.clientX - disX;
        let top = e.clientY - disY;
        if (boxLeft / 2 - left <= 0) {
          left = boxLeft / 2;
        } else if (boxLeft / 2 + left <= 0) {
          left = -boxLeft / 2;
        }
        if (boxTop / 2 - top <= 0) {
          top = boxTop / 2;
        } else if (boxTop / 2 + top <= 0) {
          top = -boxTop / 2;
        }
        positionData.positionX = left;
        positionData.positionY = top;
        positionData.moveStyle.left = `calc(50% + ${left}px)`;
        positionData.moveStyle.top = `calc(50% + ${top}px)`;
      };

      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
        isMoveing.value = false;
      };
    };

    return () => {
      const dialogSlot = {
        header: () => (
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
                class={resolveClassName('dialog-title')}
                style={`text-align: ${props.headerAlign}`}
              >
                {slots.header?.() ?? props.title}
              </span>
            </div>
          </>
        ),
        default: () => <div class={resolveClassName('dialog-content')}>{slots.default()}</div>,
        footer: () => {
          if (slots.footer) {
            return (
              <div
                class={resolveClassName('dialog-footer')}
                style={`text-align: ${props.footerAlign}`}
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
                    onClick={handleConfirm}
                    theme={props.confirmButtonTheme}
                    loading={props.isLoading}
                  >
                    {localConfirmText.value}
                  </Button>
                  <Button
                    class={resolveClassName('dialog-cancel')}
                    onClick={handleClose}
                    disabled={props.isLoading}
                  >
                    {localCancelText.value}
                  </Button>
                </>
              );
            }
            if (props.dialogType === 'confirm') {
              return (
                <Button
                  onClick={handleConfirm}
                  theme={props.confirmButtonTheme}
                  loading={props.isLoading}
                >
                  {localConfirmText.value}
                </Button>
              );
            }
            if (props.dialogType === 'process') {
              const renderFirstStepBtn = () => {
                if (props.current === 1) {
                  return (
                    <Button
                      class={resolveClassName('dialog-perv')}
                      onClick={handlePrevStep}
                    >
                      {localPrevText.value}
                    </Button>
                  );
                }
              };
              const renderStepBtn = () => {
                if (props.current === props.totalStep) {
                  return (
                    <>
                      <Button
                        class={resolveClassName('dialog-next')}
                        onClick={handleNextStep}
                      >
                        {localNextText.value}
                      </Button>
                      <Button
                        onClick={handleConfirm}
                        theme={props.confirmButtonTheme}
                        loading={props.isLoading}
                      >
                        {localConfirmText.value}
                      </Button>
                    </>
                  );
                }
              };

              return (
                <>
                  {renderFirstStepBtn()}
                  {renderStepBtn()}
                  <Button
                    class={resolveClassName('dialog-cancel')}
                    onClick={handleClose}
                    disabled={props.isLoading}
                  >
                    {localCancelText.value}
                  </Button>
                </>
              );
            }
          };
          return (
            <div
              class={resolveClassName('dialog-footer')}
              style={`text-align: ${props.footerAlign}`}
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
          class={{
            [resolveClassName('dialog')]: true,
            'is-fullscreen': props.fullscreen,
          }}
          isShow={props.isShow}
          fullscreen={props.fullscreen}
          width={props.fullscreen ? 'auto' : props.width}
          animateType='fadein'
          beforeClose={props.beforeClose}
          closeIcon={props.closeIcon}
          escClose={props.escClose}
          quickClose={props.quickClose}
          showMask={props.showMask}
          transfer={props.transfer}
          left={props.fullscreen ? '0px' : positionData.moveStyle.left}
          top={props.fullscreen ? '0px' : positionData.moveStyle.top}
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
