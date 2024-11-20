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
import { computed, defineComponent, inject, onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { bkTooltips } from '@bkui-vue/directives';
import { OverflowTitle } from '@bkui-vue/overflow-title';
import { classes, InputBehaviorType, PropTypes, TagThemeType } from '@bkui-vue/shared';
import Tag from '@bkui-vue/tag';
import debounce from 'lodash/debounce';
import { PropType } from 'vue-types/dist/types';

import { selectKey } from './common';
import { ISelected } from './type';

export default defineComponent({
  name: 'SelectTagInput',
  directives: {
    bkTooltips,
  },
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
    behavior: InputBehaviorType(),
  },
  emits: ['update:modelValue', 'remove', 'enter', 'keydown'],
  setup(props, { emit }) {
    const { resolveClassName } = usePrefix();
    const select = inject(selectKey, null);
    const { modelValue, collapseTags, selected } = toRefs(props);
    const value = ref(modelValue.value);
    const inputRef = ref<HTMLElement>();
    const overflowTagIndex = ref<null | number>(null);
    const overflowContent = computed(() =>
      selected.value
        .slice(overflowTagIndex.value, selected.value.length)
        .map(item => select?.handleGetLabelByValue(item.value))
        .join(', '),
    );

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
    const blur = () => {
      inputRef.value?.blur();
    };
    const updateModelValue = (data: string) => {
      emit('update:modelValue', data);
    };
    const handleInput = e => {
      emit('update:modelValue', e.target.value);
    };
    const handleKeydown = e => {
      switch (e.code) {
        case 'Enter': {
          emit('enter', e.target.value, e);
          break;
        }
      }
      emit('keydown', e.target.value, e);
    };
    const tagsRefs = ref([]);
    const collapseTagRef = ref();
    const getTagDOM = (index?: number) => {
      const tagDomList = tagsRefs.value.map(item => item?.$el).filter(item => !!item);
      return typeof index === 'number' ? tagDomList[index] : tagDomList;
    };
    // 计算出现换行的索引
    const calcOverflow = () => {
      if (!collapseTags.value) return;

      overflowTagIndex.value = null;
      setTimeout(() => {
        const tags = getTagDOM();
        // 出现换行的Index位置
        const tagIndexInSecondRow = tags.findIndex((currentTag, index) => {
          if (!index) {
            return false;
          }
          const previousTag = tags[index - 1];
          return previousTag.offsetTop !== currentTag.offsetTop;
        });
        overflowTagIndex.value = tagIndexInSecondRow > 0 ? tagIndexInSecondRow : null;
        // 剩余位置能否放下数字tag
        if (tags[overflowTagIndex.value]?.offsetTop !== collapseTagRef.value?.offsetTop && overflowTagIndex.value > 1) {
          overflowTagIndex.value -= 1;
        }
      });
    };

    // 监听Dom元素变化
    const debounceFn = debounce(calcOverflow, 150);
    const tagWrapperRef = ref();
    const resizeObserver = new ResizeObserver(() => {
      debounceFn();
    });

    onMounted(() => {
      tagWrapperRef.value && resizeObserver.observe(tagWrapperRef.value);
    });

    onBeforeUnmount(() => {
      tagWrapperRef.value && resizeObserver.unobserve(tagWrapperRef.value);
    });

    return {
      collapseTagRef,
      tagWrapperRef,
      tagsRefs,
      select,
      overflowTagIndex,
      value,
      inputRef,
      overflowContent,
      handleRemoveTag,
      focus,
      blur,
      updateModelValue,
      handleInput,
      handleKeydown,
      resolveClassName,
    };
  },
  render() {
    const prefix = this.$slots?.prefix?.();
    const selectTagClass = classes({
      [this.resolveClassName('select-tag')]: true,
      [this.resolveClassName('select-tag--default')]: true,
      'is-disabled': this.disabled,
      'collapse-tag': this.collapseTags,
      'has-prefix': !!prefix,
      'is-simplicity': this.behavior === 'simplicity',
    });
    const tagWrapperClass = classes({
      [this.resolveClassName('select-tag-wrapper')]: true,
    });
    const inputStyle = {
      display: this.selected.length && !this.filterable ? 'none' : '',
    };

    return (
      <div
        ref='tagWrapperRef'
        class={selectTagClass}
      >
        {this.$slots?.prefix?.()}
        <div class={tagWrapperClass}>
          {this.$slots.default?.() ??
            this.selected.map((item, index) => (
              <Tag
                key={item.value}
                ref={el => (this.tagsRefs[index] = el)}
                style={{
                  display: this.collapseTags && this.overflowTagIndex && index >= this.overflowTagIndex ? 'none' : '',
                }}
                theme={this.tagTheme}
                closable
                onClose={() => this.handleRemoveTag(item.value)}
              >
                {this.$slots.tagRender?.(item) ?? (
                  <OverflowTitle type='tips'>{this.select?.handleGetLabelByValue(item.value)}</OverflowTitle>
                )}
              </Tag>
            ))}
          <Tag
            ref='collapseTagRef'
            style={{
              display: !!this.overflowTagIndex && this.collapseTags ? '' : 'none',
            }}
            class={this.resolveClassName('select-overflow-tag')}
            v-bk-tooltips={{
              content: this.overflowContent,
              disabled: !this.overflowTagIndex || !this.collapseTags,
              extCls: this.resolveClassName('select-tooltips'),
            }}
          >
            +{this.selected.length - this.overflowTagIndex}
          </Tag>
          <input
            ref='inputRef'
            style={inputStyle}
            class={this.resolveClassName('select-tag-input')}
            disabled={this.disabled}
            placeholder={!this.selected.length ? this.placeholder : ''}
            readonly={!this.filterable}
            type='text'
            value={!this.filterable ? '' : this.value}
            onInput={this.handleInput}
            onKeydown={this.handleKeydown}
          />
        </div>
        {this.$slots?.suffix?.()}
      </div>
    );
  },
});
