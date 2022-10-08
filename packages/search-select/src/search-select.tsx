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

import { addListener, removeListener } from 'resize-detector';
import {  defineComponent, onBeforeUnmount, onMounted, PropType, ref, watch } from 'vue';

import { clickoutside } from '@bkui-vue/directives';
import { Close, Search } from '@bkui-vue/icon';
import { debounce } from '@bkui-vue/shared';

import SearchSelectInput from './input';
import { defaultData } from './mock';
import SearchSelected from './selected';
import { ICommonItem, ISearchItem, ISearchValue,  SearchItemType,  SelectedItem, useSearchSelectProvider } from './utils';
const INPUT_PADDING_WIDTH = 40;
const SELETED_MARGING_RIGHT = 6;
export const SearchSelectProps = {
  data: {
    type: Array as PropType<ISearchItem[]>,
    default: () => defaultData,
  },
  modelValue: {
    type: Array as PropType<ISearchValue[]>,
    default: () => [],
  },
  shrink: {
    type: Boolean,
    default: true,
  },
  maxHeight: {
    type: Number,
    default: 120,
  },
  minHeight: {
    type: Number,
    default: 26,
  },
  conditions: {
    type: Array as PropType<ICommonItem[]>,
    default: () => [{ id: 'or', name: '或', disabled: true }, { id: 'and', name: '且' }],
  },
  clearable: {
    type: Boolean,
    default: true,
  },
};
export default defineComponent({
  name: 'SearchSelect',
  directives: {
    clickoutside,
  },
  props: SearchSelectProps,
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    // refs
    const inputRef = ref<typeof SearchSelectInput>(null);
    const wrapRef = ref<HTMLDivElement>(null);

    // vars
    const isFocus = ref(false);
    const selectedList = ref<SelectedItem[]>([]);
    const overflowIndex = ref(-1);
    const debounceResize = debounce(32, handleResize);
    const editKey = ref('');

    // effects
    watch(
      () => props.modelValue,
      (v: ISearchValue[]) => {
        if (!v?.length) {
          selectedList.value = [];
          return;
        }
        const list = [];
        v.forEach((item) => {
          const seleted = selectedList.value.find(set => set.id === item.id && set.name === item.name);
          if (seleted?.toValueKey() === JSON.stringify(item)) {
            seleted.values = item.values || [];
            list.push(seleted);
          } else {
            let searchItem = props.data.find(set => set.id === item.id);
            let searchType: SearchItemType = 'default';
            if (!searchItem) {
              searchItem = props.conditions.find(set => set.id === item.id);
              searchItem && (searchType = 'condition');
            }
            if (!searchItem && !item.values?.length) {
              searchType = 'text';
            }
            const newSelected = new SelectedItem(searchItem || item, searchType);
            newSelected.values = item.values || [];
            list.push(newSelected);
          }
        });
        selectedList.value = list;
      },
      {
        immediate: true,
        deep: true,
      },
    );

    // life hooks
    onMounted(() => {
      addListener(wrapRef.value.querySelector('.bk-search-select') as HTMLElement, debounceResize);
    });
    onBeforeUnmount(() => {
      removeListener(wrapRef.value.querySelector('.bk-search-select') as HTMLElement, debounceResize);
    });
    // edit item
    useSearchSelectProvider({
      onEditClick,
      onEditEnter,
      editKey,
    });
    function onEditClick(item: SelectedItem, index: number) {
      editKey.value = `${item.id}_${index}`;
    }
    function onEditEnter(item: SelectedItem, index: number) {
      const list = selectedList.value.slice();
      list.splice(index, 1, item);
      emit('update:modelValue', list.map(item => item.toValue()));
      editKey.value = '';
    }

    // events
    function handleResize() {
      if (isFocus.value || selectedList.value.length < 1) {
        overflowIndex.value = -1;
        return;
      }
      const inputEl = wrapRef.value.querySelector('.bk-search-select');
      const maxWidth = wrapRef.value.querySelector('.search-input').clientWidth - SELETED_MARGING_RIGHT - 2;
      const tagList = inputEl.querySelectorAll('.search-input-chip:not(.overflow-chip)');
      let width = 0;
      let index = 0;
      let i = 0;
      while (width <= maxWidth - INPUT_PADDING_WIDTH && i <= tagList.length - 1) {
        const el = tagList[i];
        if (el.clientHeight > props.minHeight) {
          overflowIndex.value = i;
          return;
        }
        width += el ? el.clientWidth + SELETED_MARGING_RIGHT : 0;
        i += 1;
        if (width <= maxWidth - INPUT_PADDING_WIDTH) index = i;
      }

      if (index === tagList.length - 1 && width <= maxWidth) {
        overflowIndex.value = -1;
        return;
      }
      overflowIndex.value = width >= maxWidth - INPUT_PADDING_WIDTH ? index : index - 1;
    }
    function handleWrapClick() {
      if (!editKey.value) {
        inputRef.value.handleInputFocus();
      }
    }
    function handleClearAll() {
      selectedList.value = [];
      overflowIndex.value = -1;
      emit('update:modelValue', []);
    }
    function handleInputOutside(target: Node) {
      return !wrapRef.value?.contains(target);
    }
    function handleAddSelected(item: SelectedItem) {
      const list = selectedList.value.slice();
      list.push(item);
      emit('update:modelValue', list.map(item => item.toValue()));
    }
    function handleDeleteSelected(index?: number) {
      const list = selectedList.value.slice();
      list.splice(typeof index === 'number' ? index : selectedList.value.length - 1, 1);
      emit('update:modelValue', list.map(item => item.toValue()));
    }
    function handleInputFocus(v: boolean) {
      v && (overflowIndex.value = -1);
      isFocus.value = v;
    }
    return {
      inputRef,
      wrapRef,
      isFocus,
      selectedList,
      overflowIndex,
      onEditClick,
      onEditEnter,
      handleWrapClick,
      handleInputFocus,
      handleResize,
      handleClearAll,
      handleInputOutside,
      handleAddSelected,
      handleDeleteSelected,
    };
  },
  render() {
    // vars
    const maxHeight = `${!this.shrink || this.isFocus ?  this.maxHeight : this.minHeight}px`;
    const showCondition = this.selectedList.length && this.selectedList.slice(-1)[0].type !== 'condition';
    // render
    return <div class="search-select-wrap" ref="wrapRef">
    <div
      class={{
        'bk-search-select': true,
        'is-focus': this.isFocus,
      }}
      onClick={this.handleWrapClick}>
      <div class="search-prefix">
        {this.$slots.prefix?.()}
      </div>
      <div class="search-input" style={{ maxHeight }}>
        <SearchSelected
          data={this.data}
          selectedList={this.selectedList}
          overflowIndex={this.overflowIndex}
          onDelete={this.handleDeleteSelected}
          />
        <div class="search-input-input">
          <SearchSelectInput
           ref="inputRef"
           data={this.data}
           showInputBefore={!this.selectedList.length}
           showCondition={showCondition}
           conditions={this.conditions}
           clickOutside={this.handleInputOutside}
           onAdd={this.handleAddSelected}
           onDelete={this.handleDeleteSelected}
           onFocus={this.handleInputFocus}
           />
        </div>
      </div>
      <div class="search-nextfix">
        { this.clearable && (!!this.selectedList.length) && <Close
          class="search-clear"
          onClick={this.handleClearAll}/>
        }
        {
          this.$slots.nextfix
            ? this.$slots.nextfix()
            : <Search class={`search-nextfix-icon ${this.isFocus ? 'is-focus'  : ''}`}></Search>
        }
      </div>
    </div>
  </div>;
  },
});
