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
import { defineComponent, inject, ref, toRefs, watch } from 'vue';
import { PropType } from 'vue-types/dist/types';

import { PropTypes } from '@bkui-vue/shared';
import Tag from '@bkui-vue/tag';

import { selectKey } from './common';
import { ISelected } from './type';


export default defineComponent({
  name: 'SelectTagInput',
  props: {
    selected: {
      type: Array as PropType<ISelected[]>,
      default: () => [],
    },
    tagTheme: PropTypes.theme(['success', 'info', 'warning', 'danger']).def(''),
    placeholder: PropTypes.string.def(''),
    filterable: PropTypes.bool.def(false), // 是否支持搜索
    allowCreate: PropTypes.bool.def(false),
    modelValue: PropTypes.any,
  },
  emits: ['update:modelValue', 'remove', 'enter'],
  setup(props, { emit }) {
    const select = inject(selectKey, null);
    const { modelValue } = toRefs(props);
    const value = ref(modelValue.value);
    const inputRef = ref<HTMLElement>();

    watch(modelValue, () => {
      value.value = modelValue.value;
    });
    const handleRemoveTag = (val: string) => {
      emit('remove', val);
    };
    const focus = () => {
      inputRef.value?.focus();
    };
    const handleInput = (e) => {
      emit('update:modelValue', e.target.value);
    };
    const handleKeydown = (e) => {
      switch (e.code) {
        case 'Enter': {
          emit('enter', e.target.value, e);
          break;
        }
      }
    };
    const handleGetLabelByValue = select?.handleGetLabelByValue;
    return {
      value,
      inputRef,
      handleRemoveTag,
      focus,
      handleInput,
      handleKeydown,
      handleGetLabelByValue,
    };
  },
  render() {
    return (
      <div class="bk-select-tag">
        {this.$slots?.prefix?.()}
        {
          this.selected.map(item => (
              <Tag
                closable
                theme={this.tagTheme}
                onClose={() => this.handleRemoveTag(item.value)}>
                {this.handleGetLabelByValue(item)}
              </Tag>
          ))
        }
        <input
          class="bk-select-tag-input"
          ref="inputRef"
          type="text"
          placeholder={!this.selected.length ? this.placeholder : ''}
          readonly={!this.filterable}
          value={!this.filterable ? '' : this.value}
          onInput={this.handleInput}
          onKeydown={this.handleKeydown}/>

        {this.$slots?.suffix?.()}
      </div>
    );
  },
});
