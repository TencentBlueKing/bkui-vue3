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

import { computed, defineComponent, PropType, ref, watchEffect } from 'vue';

import { clickoutside } from '@bkui-vue/directives';
import { Close } from '@bkui-vue/icon';
import Popover from '@bkui-vue/popover2';

import { defaultData } from './mock';
import SearchSelectMenu from './search-select-menu';
import { ISearchItem, ISearchValue, SeletedItem } from './utils';;
export const SearchSelectProps = {
  data: {
    type: Object as PropType<ISearchItem[]>,
    default: () => defaultData,
  },
  value: {
    type: Object as PropType<ISearchValue[]>,
    default: () => [],
  },
  shrink: {
    type: Boolean,
    default: false,
  },
  maxHeight: {
    type: Number,
    default: 120,
  },
  minHeight: {
    type: Number,
    default: 26,
  },
};
export default defineComponent({
  name: 'SearchSelect',
  directives: {
    clickoutside,
  },
  props: SearchSelectProps,
  setup(props) {
    const isFocus = ref(false);
    const showPopover = ref(false);
    const selectedList = ref<SeletedItem[]>([]);
    const searchValue = ref('');
    const usingItem = ref<SeletedItem>();
    const inputRef = ref<HTMLDivElement>(null);
    const popoverRef = ref<HTMLDivElement>(null);
    const showNoSelectValueError = ref(false);
    const menuList = computed(() => {
      console.info('11111111');
      if (!usingItem?.value) return props.data.filter(item => item.name.toLocaleLowerCase()
        .includes(searchValue.value.toLocaleLowerCase()));
      if (!usingItem.value.values?.length || usingItem.value.multiple) return usingItem.value.children
        .filter(item => item.name.toLocaleLowerCase()
          .includes(searchValue.value.toLocaleLowerCase()));
      return [];
    });
    watchEffect(() => {
      console.info('222222222');
      if (!searchValue.value) {
        setInputText();
      }
    }, {
      flush: 'pre',
    });
    function handleWrapClick() {

    }
    function handleInputClick() {
      handleInputFocus();
    }
    function handleInputCut() {

    }
    function handleInputFocus() {
      isFocus.value = true;
      showPopover.value = true;
      showNoSelectValueError.value = false;
      const timer = setTimeout(() => {
        if (inputRef.value) {
          inputRef.value.focus(); // 光标移至最后
          const selection = window.getSelection();
          if (selection.focusOffset === 0) {
            selection.selectAllChildren(inputRef.value);
            selection.collapseToEnd();
          }
        }
        window.clearTimeout(timer);
      }, 0);
    }
    function handleInputChange() {
      if (!usingItem.value?.values?.length) {
        searchValue.value = inputRef.value?.innerText.replace(usingItem.value?.keyInnerText || '', '').trim();
      }
    }
    function clearInput() {
      const text = inputRef.value.innerText;
      if (text[text.length - 1] === '\n' || text[0] === '\r') {
        setInputText(text.slice(0, -1));
        clearInput();
      } else if (text[0] === '\n' || text[0] === '\r') {
        setInputText(text.slice(1));
        clearInput();
      }
    }
    function handleInputKeyup(event: KeyboardEvent) {
      switch (event.code) {
        case 'Enter':
        case 'NumpadEnter':
          handleKeyEnter(event);
          break;
        case 'Backspace':
          handleKeyBackspace(event);
          break;
      }
    }
    function handleKeyBackspace(event: KeyboardEvent) {
      // 删除已选择项
      if (!usingItem.value && !searchValue.value) {
        selectedList.value.length && selectedList.value.splice(selectedList.value.length - 1, 1);
        return;
      }
      // 删除可多选项
      if (usingItem.value?.searchItem?.multiple && usingItem.value?.values.length) {
        usingItem.value.values.splice(-1, 1);
        searchValue.value = '';
        handleInputFocus();
        return;
      }
      const inputText = (event.target as HTMLDivElement).innerText;
      if (!searchValue.value && inputText.length <= (usingItem.value?.inputInnerText?.length || 1)) {
        event.preventDefault();
        searchValue.value = inputText.trim().slice(0, -1);
        usingItem.value = null;
        setInputText(searchValue.value);
        handleInputFocus();
      }
    }
    function handleKeyEnter(event: KeyboardEvent) {
      event.preventDefault();
      if (!usingItem.value) {
        if (!searchValue.value) return;
        selectedList.value.push(new SeletedItem({
          id: searchValue.value,
          name: searchValue.value,
        }, 'text'));
        searchValue.value = '';
        return;
      }
      const { values } = usingItem.value;
      if (!values?.length) {
        if (searchValue.value?.length) {
          usingItem.value.addValue({
            id: searchValue.value,
            name: searchValue.value,
          });
          selectedList.value.push(usingItem.value);
          searchValue.value = '';
          usingItem.value = null;
          return;
        }
        showNoSelectValueError.value = true;
        return;
      }
      selectedList.value.push(usingItem.value);
      usingItem.value = null;
    }
    function handleSelectItem(item: ISearchItem) {
      if (!usingItem.value || !inputRef?.value?.innerText) {
        usingItem.value = new SeletedItem(item);
        searchValue.value = '';
        showPopover.value = !!usingItem.value.children.length;
        return;
      }
      usingItem.value.updateValue(item);
      if (!usingItem.value.multiple) {
        selectedList.value.push(usingItem.value);
        usingItem.value = null;
        searchValue.value = '';
      }
    }
    function handleDeleteItem(item: SeletedItem, index: number) {
      if (selectedList.value?.length < index) return;
      selectedList.value.splice(index, 1);
    }
    function handleClickOutside(e: MouseEvent) {
      if (!popoverRef.value.contains(e.target as Node)) {
        showPopover.value = false;
        isFocus.value = false;
      }
    }
    function setInputText(text = '') {
      if (inputRef.value) {
        inputRef.value.innerHTML = text || usingItem.value?.inputInnerHtml || '';
      }
    }
    return {
      inputRef,
      popoverRef,
      usingItem,
      menuList,
      isFocus,
      selectedList,
      searchValue,
      showPopover,
      showNoSelectValueError,
      setInputText,
      clearInput,
      handleWrapClick,
      handleInputClick,
      handleInputFocus,
      handleInputCut,
      handleInputChange,
      handleInputKeyup,
      handleSelectItem,
      handleDeleteItem,
      handleClickOutside,
    };
  },
  render() {
    const { multiple, values, placeholder, inputInnerHtml } = this.usingItem || {};
    const maxHeight = `${!this.shrink || this.isFocus ?  this.maxHeight : this.minHeight}px`;
    const showInputBefore = !this.selectedList.length && !this.searchValue?.length;
    const showInpitAfter = !this.searchValue?.length && !values?.length && placeholder;
    const inputContent = () => <div
      ref="inputRef"
      class={{
        'div-input': true,
        'input-before': showInputBefore,
        'input-after': showInpitAfter,
      }}
      contenteditable={true}
      data-placeholder={!inputInnerHtml && !this.searchValue ? '请选择' : ''}
      data-tips={placeholder || ''}
      spellcheck="false"
      v-clickoutside={this.handleClickOutside}
      onClick={this.handleInputClick}
      onFocus={this.handleInputFocus}
      onCut={this.handleInputCut}
      onInput={this.handleInputChange}
      onKeydown={this.handleInputKeyup}/>;
    const popoverContent = () => {
      if (this.showNoSelectValueError) {
        return <div>包含键值的过滤查询必须有一个值</div>;
      }
      return this.menuList?.length ? <div ref="popoverRef" class="popover-content">
      <SearchSelectMenu
        list={this.menuList}
        keyword={this.searchValue}
        multiple={!!multiple}
        selected={values?.map(item => item.id) || []}
        onSelectItem={this.handleSelectItem}/>
    </div> : undefined;
    };
    const selectedContent = () => <ul>
      {
        this.selectedList.map((item, index) => <li
          class="search-input-chip"
          key={item.id}>
          <span class="chip-name">
            {item.inputInnerText}
          </span>
          <Close class="chip-clear" onClick={() => this.handleDeleteItem(item, index)}/>
        </li>)
      }
    </ul>;
    return <div class="search-select-wrap">
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
        {selectedContent()}
      <div class="search-input-input">
          <Popover
            trigger='manual'
            theme='light'
            placement='bottom-start'
            arrow={false}
            isShow={this.showNoSelectValueError || (this.showPopover && !!this.menuList?.length)}>
              {{
                default: inputContent,
                content: popoverContent,
              }}
          </Popover>
        </div>
      </div>
    </div>
  </div>;
  },
});
