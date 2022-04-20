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
import BkModal from '@bkui-vue/modal';
const { propsMixin } = BkModal;
const sliderPops = Object.assign({}, propsMixin);
sliderPops.width.default = '400';
sliderPops.height.default = '100%';

export default defineComponent({
  name: 'Sideslider',
  components: {
    BkModal,
    BkButton,
  },
  props: {
    ...sliderPops,
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
  },
  emits: ['closed', 'update:isShow'],
  methods: {
    handleClose() {
      this.$emit('update:isShow', false);
      this.$emit('closed');
    },
  },

  render() {
    const dialogSlot = {
      header: () => [
        <div class="bk-sideslider-header">
          <span class={`bk-sideslider-close ${this.direction}`} onClick={this.handleClose}></span>
          <span class={`bk-sideslider-title ${this.direction}`}>
            {this.$slots.header?.() ?? 'Header'}
          </span>
        </div>,
      ],
      default: () => this.$slots.default?.() ?? 'Content',
      footer: () => <div class="bk-sideslider-footer"></div>,
    };

    const className = `bk-sideslider-wrapper ${this.scrollable ? 'scroll-able' : ''}`;
    return <BkModal {...this.$props} class={className} style={`${this.direction}: 0`}>
      {dialogSlot}
    </BkModal>;
  },
});
