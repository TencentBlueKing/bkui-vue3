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

import type { ExtractPropTypes } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import BkButton from '@bkui-vue/button';

const confirmProps = {
  showTime: {
    type: Boolean,
    required: true,
  },
  isTime: {
    type: Boolean,
    default: false,
  },
  timeDisabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
} as const;

export type ConfirmProps = Readonly<ExtractPropTypes<typeof confirmProps>>;

export default defineComponent({
  props: confirmProps,
  emits: ['pick-clear', 'pick-success', 'pick-toggle-time'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const labels = computed(() => ({
      time: t(props.isTime ? '选择日期' : '选择时间'),
      clear: t('清除'),
      ok: t('确定'),
    }));

    const handleClear = () => {
      emit('pick-clear');
    };

    const handleSuccess = () => {
      emit('pick-success');
    };

    const handleToggleTime = () => {
      if (props.timeDisabled) {
        return;
      }
      emit('pick-toggle-time');
      // this.dispatch('bk-date-picker', 'focus-input');
    };


    const elRef = ref(null);

    const handleTab = (e) => {
      const tabbables = [...elRef.value.children];
      const expectedFocus = tabbables[e.shiftKey ? 'shift' : 'pop']();

      if (document.activeElement === expectedFocus) {
        e.preventDefault();
        e.stopPropagation();
        // this.dispatch('bk-date-picker', 'focus-input')
      }
    };

    return {
      labels,
      handleClear,
      handleSuccess,
      handleToggleTime,
      handleTab,
    };
  },
  render() {
    return (
      <div class="bk-picker-confirm" ref="elRef" onKeydown={this.handleTab}>
        {
          this.showTime
            ? (
              // <a href="javascript: void(0);" class="bk-picker-confirm-time" disabled onClick={this.handleToggleTime}>
              //   {this.labels.time}
              // </a>
              <BkButton text class="bk-picker-confirm-time" disabled={this.timeDisabled} onClick={this.handleToggleTime}>
                {this.labels.time}
              </BkButton>
            )
            : ''
        }
        {
          this.$slots.confirm?.() ?? (
            <div class="bk-picker-confirm-action">
              {
                this.clearable
                  ? (
                    <a href="javascript: void(0);" onClick={this.handleClear} onKeydown={this.handleClear}>
                      {this.labels.clear}
                    </a>
                  )
                  : ''
              }
              <a href="javascript: void(0);" class="confirm" onClick={this.handleSuccess} onKeydown_enter={this.handleSuccess}>
                {this.labels.ok}
              </a>
            </div>
          )
        }
        {/* <div class="bk-picker-confirm-action">
          {
            this.clearable
              ? (
                <a href="javascript: void(0);" onClick={this.handleClear} onKeydown={this.handleClear}>
                  {this.labels.clear}
                </a>
              )
              : ''
          }
          <a href="javascript: void(0);" class="confirm" onClick={this.handleSuccess}
            onKeydown_enter={this.handleSuccess}>
            {this.labels.ok}
          </a>
        </div> */}
      </div>
    );
  },
});
