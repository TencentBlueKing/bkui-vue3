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
import { defineComponent, ref } from 'vue';

import BkButton from '@bkui-vue/button';
import { useLocale, usePrefix } from '@bkui-vue/config-provider';
import BkPopover from '@bkui-vue/popover';

import props from './props';

export default defineComponent({
  name: 'PopConfirm',
  components: { BkPopover, BkButton },
  props,
  emits: ['confirm', 'cancel'],
  setup(props, { emit, slots }) {
    const visible = ref(false);
    const t = useLocale('popConfirm');

    function ensure(e: Event) {
      visible.value = false;
      emit('confirm');
      e.stopPropagation();
    }

    function cancel(e: Event) {
      visible.value = false;
      emit('cancel');
      e.stopPropagation();
    }

    function renderIcon() {
      if (typeof slots.icon === 'function') {
        return slots.icon();
      }
      return props.icon;
    }

    const icon = renderIcon();

    const { resolveClassName } = usePrefix();

    const popoverRef = ref(null);

    return {
      popoverRef,
      visible,
      t,
      icon,
      resolveClassName,
      ensure,
      cancel,
    };
  },

  render() {
    return (
      <BkPopover
        ref='popoverRef'
        isShow={this.visible}
        trigger={this.trigger}
        theme={this.theme}
        width={this.width}
        onAfterShow={() => (this.visible = true)}
        extCls={`${this.resolveClassName('pop-confirm-box')}`}
      >
        {{
          default: () => this.$slots.default(),
          content: () => (
            <div class={`${this.resolveClassName('pop-confirm')}`}>
              {typeof this.$slots.content === 'function' ? (
                this.$slots.content()
              ) : (
                <>
                  {this.title ? (
                    <div class={`${this.resolveClassName('pop-confirm-title')}`}>
                      {this.icon ? <span class={`${this.resolveClassName('pop-confirm-icon')}`}>{this.icon}</span> : ''}
                      <span>{this.title}</span>
                    </div>
                  ) : (
                    ''
                  )}
                  <div class={`${this.resolveClassName('pop-confirm-content')}`}>
                    {!this.title ? this.icon : ''}
                    {this.content}
                  </div>
                </>
              )}
              <div class={`${this.resolveClassName('pop-confirm-footer')}`}>
                <BkButton
                  onClick={this.ensure}
                  size='small'
                  theme='primary'
                  loading={this.loading}
                >
                  {this.confirmText || this.t.ok}
                </BkButton>
                <BkButton
                  onClick={this.cancel}
                  size='small'
                  disabled={this.loading}
                >
                  {this.cancelText || this.t.cancel}
                </BkButton>
              </div>
            </div>
          ),
        }}
      </BkPopover>
    );
  },
});
