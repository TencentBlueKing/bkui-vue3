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

import { computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';

import BkButton from '@bkui-vue/button';
import { useLocale } from '@bkui-vue/config-provider';
import { Close, Error, Spinner, Success, Warn } from '@bkui-vue/icon';
import BkModal from '@bkui-vue/modal';
import { resolveClassName } from '@bkui-vue/shared';

import props from './props';

export default defineComponent({
  name: 'Dialog',
  components: {
    BkModal,
    BkButton,
  },
  props,
  emits: ['closed', 'update:isShow', 'confirm', 'prev', 'next', 'value-change'],
  setup(props, { emit }) {
    const t = useLocale('dialog');
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

    const data = reactive({
      positionX: 0,
      positionY: 0,
      moveStyle: {
        top: '',
        left: '',
      },
    });
    const isModalShow = ref(props.isShow);
    onMounted(() => {
      if (props.escClose) {
        addEventListener('keydown', escCloseHandler);
      }
    });
    onBeforeUnmount(() => {
      if (props.escClose) {
        removeEventListener('keydown', escCloseHandler);
      }
    });
    watch(() => props.isShow, (val: Boolean) => {
      if (!val) {
        setTimeout(() => {
          data.moveStyle = {
            top: '50%',
            left: '50%',
          };
          data.positionX = 0;
          data.positionY = 0;
          isModalShow.value = false;
        }, 250);
      } else {
        isModalShow.value = true;
      }
      emit('value-change', val);
    });
    // 关闭弹框
    const handleClose = () => {
      emit('update:isShow', false);
      emit('closed');
      isModalShow.value = false;
    };
    const handleConfirm = () => {
      emit('update:isShow', false);
      emit('confirm');
      // isModalShow.value = false; 影响异步关闭
    };

    const hasFooter = computed(() => ['process', 'operation', 'confirm'].includes(props.dialogType));
    // 按 esc 关闭弹框
    const escCloseHandler = (e) => {
      if (props.isShow && props.closeIcon) {
        if (e.keyCode === 27) {
          handleClose();
        }
      }
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
    const moveHandler = (e) => {
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
      if (data.positionX !== 0 && data.positionY !== 0) {
        disX = e.clientX - data.positionX;
        disY = e.clientY - data.positionY;
      } else {
        disX = e.clientX - odiv.offsetLeft;
        disY = e.clientY - odiv.offsetTop;
      }
      document.onmousemove = (e) => {
        const boxLeft = window.innerWidth - parentWidth;
        const boxTop = window.innerHeight - parentHeight;
        let left = e.clientX - disX;
        let top = e.clientY - disY;
        if ((boxLeft / 2) - left <= 0) {
          left = boxLeft / 2;
        } else if ((boxLeft / 2) + left <= 0) {
          left = -boxLeft / 2;
        }
        if ((boxTop / 2) - top <= 0) {
          top = boxTop / 2;
        } else if ((boxTop / 2) + top <= 0) {
          top = -boxTop / 2;
        }
        data.positionX = left;
        data.positionY = top;
        data.moveStyle.left = `calc(50% + ${left}px)`;
        data.moveStyle.top = `calc(50% + ${top}px)`;
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
    return {
      data,
      handleClose,
      handleConfirm,
      escCloseHandler,
      moveHandler,
      handlePrevStep,
      handleNextStep,
      hasFooter,
      isModalShow,
      localConfirmText,
      localCancelText,
      localPrevText,
      localNextText,
    };
  },

  render() {
    const renderIcon = () => {
      const iconMap = {
        loading: <Spinner class={[resolveClassName('info-icon'), 'primary']}></Spinner>,
        warning: <Warn class={[resolveClassName('info-icon'), 'warning']}></Warn>,
        success: <Success class={[resolveClassName('info-icon'), 'success']}></Success>,
        danger: <Close class={[resolveClassName('info-icon'), 'danger']}></Close>,
      };
      return iconMap[this.infoType];
    };

    const dialogSlot = {
      header: () => [
        <div class={[resolveClassName('dialog-tool'), this.fullscreen || !this.draggable ? '' : 'move', this.draggable ? 'content-dragging' : '']}
          onMousedown={this.moveHandler}>
          {this.$slots.tools?.() ?? ''}
        </div>,
        <div class={resolveClassName('dialog-header')}>
          <div class={resolveClassName('header-icon')}>
            {this.infoType ? renderIcon() : <slot name="info-icon" />}
          </div>
          <span class={resolveClassName('dialog-title')} style={`text-align: ${this.headerAlign}`}>
            {this.$slots.header?.() ?? this.title}
          </span>
        </div>,
      ],
      default: () => this.$slots.default?.() ?? 'default',
      footer: () => <div class={resolveClassName('dialog-footer')} style={`text-align: ${this.footerAlign}`}>
        {this.dialogType === 'process' ? (
          this.$slots.footer?.() ?? <>
            {this.current === 1 ? '' : (
              <BkButton class={resolveClassName('dialog-perv')} onClick={this.handlePrevStep}>
                {this.localPrevText}
              </BkButton>
            )}
            {this.current === this.totalStep ? '' : (
              <BkButton class={resolveClassName('dialog-next')} onClick={this.handleNextStep}>{this.localNextText}</BkButton>
            )}
            {this.current === this.totalStep ? (
              <BkButton onClick={this.handleConfirm} theme={this.theme}
                loading={this.isLoading}>{this.localConfirmText}</BkButton>
            ) : ''}
            <BkButton class={resolveClassName('dialog-cancel')} onClick={this.handleClose}
              disabled={this.isLoading}>{this.localCancelText}</BkButton>
          </>
        ) : ''}
        {this.dialogType === 'operation' ? (
          this.$slots.footer?.() ?? <>
            <BkButton onClick={this.handleConfirm} theme={this.theme}
              loading={this.isLoading}>{this.localConfirmText}</BkButton>
            <BkButton class={resolveClassName('dialog-cancel')} onClick={this.handleClose}
              disabled={this.isLoading}>{this.localCancelText}</BkButton>
          </>
        ) : ''}
        {this.dialogType === 'confirm' ? (
          this.$slots.footer?.() ?? <>
            <BkButton onClick={this.handleConfirm} theme={this.theme}
              loading={this.isLoading}>{this.localConfirmText}</BkButton>
          </>
        ) : ''}
      </div>,
      close: () => <Error onClick={this.handleClose}/>,
    };

    const className = `${resolveClassName('dialog-wrapper ')} ${this.scrollable ? 'scroll-able' : ''} ${this.multiInstance ? 'multi-instance' : ''} ${this.hasFooter ? 'has-footer' : 'no-footer'}`;
    return <BkModal {...this.$props} class={className}
      onClose={this.handleClose}
      isShow={this.isModalShow}
      style={this.data.moveStyle}>
      {dialogSlot}
    </BkModal>;
  },
});
