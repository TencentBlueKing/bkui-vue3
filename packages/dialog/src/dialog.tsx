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

import { defineComponent, onBeforeUnmount, onMounted, reactive, watch } from 'vue';

import BkButton from '@bkui-vue/button';
import BkModal, { propsMixin } from '@bkui-vue/modal';
import { PropTypes } from '@bkui-vue/shared';

export default defineComponent({
  name: 'Dialog',
  components: {
    BkModal,
    BkButton,
  },
  props: {
    ...propsMixin,
    width: PropTypes.string.def('null') || PropTypes.number.def(),
    height: PropTypes.string.def('null') || PropTypes.number.def(),
    // 确认按钮文字
    confirmText: PropTypes.string.def('确定'),
    // 取消按钮文字
    cancelText: PropTypes.string.def('取消'),
    // 弹框的标题
    title: PropTypes.string.def('title'),
    // 显示 header 的位置
    headerAlign: PropTypes.commonType(['left', 'center', 'right'], 'headerAlign').def('left'),
    // 显示 footer 的位置
    footerAlign: PropTypes.commonType(['left', 'center', 'right'], 'footerAlign').def('right'),
    // 颜色 按钮类型
    theme: PropTypes.commonType(['primary', 'warning', 'success', 'danger'], 'theme').def('primary'),
    // 按钮loading
    isLoading: PropTypes.bool.def(false),
  },
  emits: ['closed', 'update:isShow', 'confirm'],
  setup(props: any, { emit }) {
    const data = reactive({
      positionX: 0,
      positionY: 0,
      moveStyle: {
        top: '',
        left: '',
      },
    });
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
        data.moveStyle = {
          top: '50%',
          left: '50%',
        };
        data.positionX = 0;
        data.positionY = 0;
      }
    });
    // 关闭弹框
    const handleClose = () => {
      emit('update:isShow', false);
      emit('closed');
    };
    const handleConfirm = () => {
      emit('update:isShow', false);
      emit('confirm');
    };
    // 按 esc 关闭弹框
    const escCloseHandler = (e) => {
      if (props.isShow && props.closeIcon) {
        if (e.keyCode === 27) {
          handleClose();
        }
      }
    };
    // 拖拽事件
    const moveHandler = (e) => {
      if (props.fullscreen) {
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
    };
  },

  render() {
    const dialogSlot = {
      header: () => [
        <div class={['bk-dialog-tool', this.fullscreen || !this.draggable ? '' : 'move', this.draggable ? 'content-dragging' : '']}
          onMousedown={this.moveHandler}>
          <span class={['bk-dialog-close', this.closeIcon ? '' : 'close-icon']} onClick={this.handleClose}>+</span>
        </div>,
        <div class="bk-dialog-header">
          <span class="bk-dialog-title" style={`text-align: ${this.headerAlign}`}>
            {this.$slots.header?.() ?? this.title}
          </span>
        </div>,
      ],
      default: () => this.$slots.default?.() ?? 'default',
      footer: () => <div class="bk-dialog-footer" style={`text-align: ${this.footerAlign}`}>
        {
          this.$slots.footer?.() ?? <>
            <BkButton onClick={this.handleConfirm} theme={this.theme}
            loading={this.isLoading}>{this.confirmText}</BkButton>
            <BkButton style='margin-left: 8px;' onClick={this.handleClose}>{this.cancelText}</BkButton>
          </>
        }
      </div>,
    };

    const className = `bk-dialog-wrapper ${this.scrollable ? 'scroll-able' : ''}`;
    return <BkModal {...this.$props} class={[className, this.fullscreen ? 'bk-model-fullscreen' : this.size]}
      style={this.data.moveStyle}>
      {dialogSlot}
    </BkModal>;
  },
});
