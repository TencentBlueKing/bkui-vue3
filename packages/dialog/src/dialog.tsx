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
import BkModal, { propsMixin } from '@bkui-vue/modal';
import BkButton from '@bkui-vue/button';

export default defineComponent({
  name: 'Dialog',
  components: {
    BkModal,
    BkButton,
  },
  emits: ['closed', 'update:isShow'],
  props: {
    ...propsMixin,
    confirmText: {
      type: String,
      default: '确定',
    },
    cancelText: {
      type: String,
      default: '取消',
    },
    Title: {
      type: String,
      default: 'Title',
    },
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
  },

  methods: {
    handleClose() {
      this.$emit('update:isShow', false);
      this.$emit('closed');
    },
  },

  render() {
    const dialogSlot = {
      header: () => <>
        <div class="bk-dialog-tool">
          <span class="bk-dialog-close" onClick={this.handleClose}>+</span>
        </div>
        <div class="bk-dialog-header">
          <span class="bk-dialog-title" style={`text-align: ${this.headerAlign}`}>
            {this.$slots.header?.() ?? this.Title}
          </span>
        </div>
      </>,
      default: () => this.$slots.default?.() ?? 'default',
      footer: () => <div class="bk-dialog-footer" style={`text-align: ${this.footerAlign}`}>
        {
          this.$slots.footer?.() ?? <>
            <BkButton onClick={this.handleClose} theme="primary">{this.confirmText}</BkButton>
            <BkButton onClick={this.handleClose}>{this.cancelText}</BkButton>
          </>
        }
      </div>,
    };

    const className = `bk-dialog-wrapper ${this.scrollable ? 'scroll-able' : ''}`;
    return <BkModal {...this.$props} class={className}>
      {dialogSlot}
    </BkModal>;
  },
});
