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
import { defineComponent, getCurrentInstance, inject, ref, toRefs, watch } from 'vue';
import { PropType } from 'vue-types/dist/types';

import { classes, PropTypes, resolveClassName, TagThemeType } from '@bkui-vue/shared';
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
    tagTheme: TagThemeType(),
    placeholder: PropTypes.string.def(''),
    filterable: PropTypes.bool.def(false), // 是否支持搜索
    allowCreate: PropTypes.bool.def(false),
    disabled: PropTypes.bool.def(false),
    modelValue: PropTypes.any,
    collapseTags: PropTypes.bool.def(false),
  },
  emits: ['update:modelValue', 'remove', 'enter', 'keydown'],
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const select = inject(selectKey, null);
    const { modelValue, collapseTags, selected } = toRefs(props);
    const value = ref(modelValue.value);
    const inputRef = ref<HTMLElement>();
    const overflowTagIndex = ref<number|null>(null);

    watch(modelValue, () => {
      value.value = modelValue.value;
    });
    watch(
      [selected, collapseTags],
      () => {
        calcOverflow();
      },
      { flush: 'post' },
    );
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
      emit('keydown', e.target.value, e);
    };
    const getTagDOM = (index?: number) => {
      const tags = [...proxy.$el.querySelectorAll('.bk-tag')];
      return typeof index === 'number' ? tags[index] : tags;
    };
    // 计算出现换行的索引
    const calcOverflow = () => {
      if (!collapseTags.value) return;

      overflowTagIndex.value = null;
      setTimeout(() => {
        const tags = getTagDOM();
        const tagIndexInSecondRow = tags.findIndex((currentTag, index) => {
          if (!index) {
            return false;
          }
          const previousTag = tags[index - 1];
          return previousTag.offsetTop !== currentTag.offsetTop;
        });
        overflowTagIndex.value = tagIndexInSecondRow > 0 ? tagIndexInSecondRow : null;
      });
    };
    return {
      select,
      overflowTagIndex,
      value,
      inputRef,
      handleRemoveTag,
      focus,
      handleInput,
      handleKeydown,
    };
  },
  render() {
    const selectTagClass = classes({
      [resolveClassName('select-tag')]: true,
      [resolveClassName('select-tag--default')]: true,
      'is-disabled': this.disabled,
      'collapse-tag': this.collapseTags,
    });
    const tagWrapperClass = classes({
      [resolveClassName('select-tag-wrapper')]: true,
    });
    const inputStyle = {
      display: this.selected.length && !this.filterable ? 'none' : '',
    };
    return (
      <div class={selectTagClass}>
        {this.$slots?.prefix?.()}
        <span class={tagWrapperClass}>
          {
            this.$slots.default?.() ?? this.selected.map((item, index) => (
              <Tag
                closable
                theme={this.tagTheme}
                style={{
                  display: this.collapseTags && this.overflowTagIndex && index >= this.overflowTagIndex ? 'none' : '',
                }}
                onClose={() => this.handleRemoveTag(item.value)}>
                {this.select?.handleGetLabelByValue(item.value)}
              </Tag>
            ))
          }
          {
            !!this.overflowTagIndex && this.collapseTags && (
              <Tag class={resolveClassName('select-overflow-tag')}>+{this.selected.length - this.overflowTagIndex}</Tag>
            )
          }
        </span>
        <input
          class={resolveClassName('select-tag-input')}
          ref="inputRef"
          type="text"
          style={inputStyle}
          placeholder={!this.selected.length ? this.placeholder : ''}
          readonly={!this.filterable}
          disabled={this.disabled}
          value={!this.filterable ? '' : this.value}
          onInput={this.handleInput}
          onKeydown={this.handleKeydown}/>
        {this.$slots?.suffix?.()}
      </div>
    );
  },
});
