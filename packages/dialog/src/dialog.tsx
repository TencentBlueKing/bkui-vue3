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

import { defineComponent } from 'vue';

import BkButton from '@bkui-vue/button';
import BkModal, { propsMixin } from '@bkui-vue/modal';

export default defineComponent({
  name: 'Dialog',
  components: {
    BkModal,
    BkButton,
  },
  props: {
    ...propsMixin,
    width: {
      type: [Number, String],
      default: null,
    },
    height: {
      type: [Number, String],
      default: null,
    },
    // 确认按钮文字
    confirmText: {
      type: String,
      default: '确定',
    },
    // 取消按钮文字
    cancelText: {
      type: String,
      default: '取消',
    },
    // 弹框的标题
    title: {
      type: String,
      default: 'Title',
    },
    // 显示 header 的位置
    headerAlign: {
      type: String,
      default: 'left',
      validator: (value: string) => {
        const textAlign = ['left', 'center', 'right'];
        if (textAlign.indexOf(value) < 0) {
          console.error(`headerAlign property is not valid: '${value}',【${textAlign.join(' | ')}】`);
          return false;
        }
        return true;
      },
    },
    // 显示 footer 的位置
    footerAlign: {
      type: String,
      default: 'right',
      validator: (value: string) => {
        const textAlign = ['left', 'center', 'right'];
        if (textAlign.indexOf(value) < 0) {
          console.error(`footerAlign property is not valid: '${value}',【${textAlign.join(' | ')}】`);
          return false;
        }
        return true;
      },
    },
    // 颜色 按钮类型
    theme: {
      type: String,
      default: 'primary',
      validator: (value: string) => {
        if (['primary', 'warning', 'success', 'danger'].indexOf(value) < 0) {
          console.error(`theme property is not valid: '${value}'`);
          return false;
        }
        return true;
      },
    },
  },
  emits: ['closed', 'update:isShow', 'confirm'],
  data() {
    return {
      positionX: 0,
      positionY: 0,
      moveStyle: {
        top: '',
        left: '',
      },
    };
  },
  computed: {
    // 如果 fullscreen 为 true，那么 draggable 配置无效
    isDraggable(): boolean {
      if (!this.fullscreen) {
        return this.draggable;
      }
      return false;
    },
  },
  mounted() {
    if (this.escClose) {
      addEventListener('keydown', this.escCloseHandler);
    }
  },
  beforeDestory() {
    if (this.escClose) {
      removeEventListener('keydown', this.escCloseHandler);
    }
  },
  methods: {
    // 关闭弹框
    handleClose() {
      this.$emit('update:isShow', false);
      this.$emit('closed');
    },
    handleConfirm() {
      this.$emit('update:isShow', false);
      this.$emit('confirm');
    },
    // 按 esc 关闭弹框
    escCloseHandler(e) {
      if (this.isShow && this.closeIcon) {
        if (e.keyCode === 27) {
          this.handleClose();
        }
      }
    },
    // 拖拽事件
    moveHandler(e) {
      if (!this.isDraggable) {
        return false;
      }
      const odiv = e.target;
      const parentHeight = e.currentTarget.parentNode.parentNode.offsetHeight;
      const parentWidth = e.currentTarget.parentNode.parentNode.offsetWidth;
      let disX;
      let disY;
      if (this.positionX !== 0 && this.positionY !== 0) {
        disX = e.clientX - this.positionX;
        disY = e.clientY - this.positionY;
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
        this.positionX = left;
        this.positionY = top;
        this.moveStyle.left = `calc(50% + ${left}px)`;
        this.moveStyle.top = `calc(50% + ${top}px)`;
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
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
            <BkButton onClick={this.handleConfirm} theme={this.theme}>{this.confirmText}</BkButton>
            <BkButton style='margin-left: 8px;' onClick={this.handleClose}>{this.cancelText}</BkButton>
          </>
        }
      </div>,
    };

    const className = `bk-dialog-wrapper ${this.scrollable ? 'scroll-able' : ''}`;
    return <BkModal {...this.$props} class={[className, this.fullscreen ? 'bk-model-fullscreen' : '']}
      style={this.moveStyle}>
      {dialogSlot}
    </BkModal>;
  },
});
