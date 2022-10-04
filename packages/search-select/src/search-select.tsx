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
import { computed, defineComponent, onBeforeUnmount, onMounted, PropType, ref, watchEffect } from 'vue';

import { clickoutside } from '@bkui-vue/directives';
import { Close, Search } from '@bkui-vue/icon';
import Popover from '@bkui-vue/popover2';
import { debounce } from '@bkui-vue/shared';

import { defaultData } from './mock';
import SearchSelectMenu from './search-select-menu';
import { ICommonItem, IMenuFooterItem, ISearchItem, ISearchValue, SearchItemType, SeletedItem } from './utils';
;
export const SearchSelectProps = {
  data: {
    type: Array as PropType<ISearchItem[]>,
    default: () => defaultData,
  },
  value: {
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
  setup(props) {
    // refs
    const inputRef = ref<HTMLDivElement>(null);
    const popoverRef = ref<HTMLDivElement>(null);
    const wrapRef = ref<HTMLDivElement>(null);

    // vars
    const isFocus = ref(false);
    const showPopover = ref(false);
    const selectedList = ref<SeletedItem[]>([]);
    const keyword = ref('');
    const usingItem = ref<SeletedItem>();
    const showNoSelectValueError = ref(false);
    const overflowIndex = ref(-1);
    const debounceResize = debounce(32, handleResize);

    // computeds
    const menuList = computed(() => {
      if (!usingItem?.value) return props.data.filter(item => item.name.toLocaleLowerCase()
        .includes(keyword.value.toLocaleLowerCase()));
      if (!usingItem.value.values?.length || usingItem.value.multiple) return usingItem.value.children
        .filter(item => item.name.toLocaleLowerCase()
          .includes(keyword.value.toLocaleLowerCase()));
      return [];
    });

    // effects
    watchEffect(() => {
      if (!keyword.value) {
        setInputText();
      }
    }, { flush: 'pre' });

    // life hooks
    onMounted(() => {
      addListener(wrapRef.value.querySelector('.bk-search-select') as HTMLElement, debounceResize);
    });
    onBeforeUnmount(() => {
      removeListener(wrapRef.value.querySelector('.bk-search-select') as HTMLElement, debounceResize);
    });

    // events
    function handleResize() {
      if (isFocus.value || selectedList.value.length < 1) {
        overflowIndex.value = -1;
        return;
      }
      const inputEl = wrapRef.value.querySelector('.bk-search-select');
      const maxWidth = wrapRef.value.querySelector('.search-input').clientWidth - 8;
      const tagList = inputEl.querySelectorAll('.search-input-chip:not(.overflow-chip)');
      let width = 0;
      let index = 0;
      let i = 0;
      while (width <= maxWidth - 40 && i <= tagList.length - 1) {
        const el = tagList[i];
        if (el.clientHeight > props.minHeight) {
          overflowIndex.value = i;
          return;
        }
        width += el ? el.clientWidth + 6 : 0;
        i += 1;
        if (width <= maxWidth - 40) index = i;
      }

      if (index === tagList.length - 1 && width <= maxWidth) {
        overflowIndex.value = -1;
        return;
      }
      overflowIndex.value = width >= maxWidth - 40 ? index : index - 1;
    }
    function handleWrapClick() {
      handleInputFocus();
    }
    function handleInputFocus() {
      isFocus.value = true;
      showPopover.value = true;
      overflowIndex.value = -1;
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
    function handleInputChange(event: Event) {
      clearInput();
      let text = (event.target as HTMLDivElement).innerText;
      if (/(\r|\n)/gm.test(text) || /\s{2}/gm.test(text)) {
        event.preventDefault();
        text = text.replace(/(\r|\n)/gm, '|').replace(/\s{2}/gm, '');
        inputRef.value.innerText = text;
        handleInputFocus();
      } else if (!keyword.value && text.length < (usingItem.value?.inputInnerText?.length || 1)) {
        usingItem.value = null;
        keyword.value = text;
      } else if (!usingItem.value?.values?.length) {
        keyword.value = text
          .replace('\u00A0', '\u0020')
          .replace(usingItem.value?.keyInnerText.replace('\u00A0', '\u0020') || '', '')
          .trim();
        handleInputFocus();
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
        default:
          showNoSelectValueError.value = false;
          break;
      }
    }
    function handleKeyBackspace(event: KeyboardEvent) {
      // 删除已选择项
      if (!usingItem.value && !keyword.value) {
        selectedList.value.length && selectedList.value.splice(selectedList.value.length - 1, 1);
        return;
      }
      // 删除可多选项
      if (usingItem.value?.multiple && usingItem.value?.values.length) {
        usingItem.value.values.splice(-1, 1);
        keyword.value = '';
        handleInputFocus();
        return;
      }
      const inputText = (event.target as HTMLDivElement).innerText;
      if (!keyword.value && inputText.length < (usingItem.value?.inputInnerText?.length || 1)) {
        // event.preventDefault();
        // const { anchorOffset, focusOffset } = window.getSelection();
        // const startIndex = Math.min(anchorOffset, focusOffset);
        // const endIndex = Math.max(anchorOffset, focusOffset);
        // const list =  inputText.split('');
        // list.splice(startIndex, Math.max(endIndex - startIndex, 1));
        // keyword.value = list.join('').trim();
        // usingItem.value = null;
        // setInputText(keyword.value);
        // handleInputFocus();
      }
    }
    function handleKeyEnter(event?: KeyboardEvent) {
      event?.preventDefault();
      if (!usingItem.value) {
        if (!keyword.value) return;
        selectedList.value.push(new SeletedItem({
          id: keyword.value,
          name: keyword.value,
        }, 'text'));
        keyword.value = '';
        return;
      }
      const { values } = usingItem.value;
      if (!values?.length) {
        if (keyword.value?.length) {
          usingItem.value.addValue({
            id: keyword.value,
            name: keyword.value,
          });
          selectedList.value.push(usingItem.value);
          keyword.value = '';
          usingItem.value = null;
          return;
        }
        showNoSelectValueError.value = true;
        return;
      }
      setSelectedItem();
    }
    function handleSelectItem(item: ISearchItem, type?: SearchItemType) {
      if (!usingItem.value || !inputRef?.value?.innerText) {
        usingItem.value = new SeletedItem(item, type);
        keyword.value = '';
        const isCondition = type === 'condition';
        isCondition && setSelectedItem();
        showPopover.value = isCondition || !!usingItem.value.children.length;
        handleInputFocus();
        return;
      }
      usingItem.value.addValue(item);
      !usingItem.value.multiple && setSelectedItem();
    }
    function handleSelectCondtionItem(item: ICommonItem) {
      handleSelectItem(item, 'condition');
    }
    function handleMenuFooterClick(item: IMenuFooterItem) {
      switch (item.id) {
        case 'confirm':
          handleKeyEnter();
          break;
        case 'cancel':
          usingItem.value.values = [];
          handleInputFocus();
          break;
      }
    }
    function handleDeleteItem(item: SeletedItem, index: number) {
      if (selectedList.value?.length < index) return;
      selectedList.value.splice(index, 1);
    }
    function handleClickOutside(e: MouseEvent) {
      if (!popoverRef.value?.contains(e.target as Node) && !wrapRef.value?.contains(e.target as Node)) {
        showPopover.value = false;
        isFocus.value = false;
      }
    }
    function handleClearAll() {
      usingItem.value = null;
      selectedList.value = [];
      keyword.value = '';
      overflowIndex.value = -1;
    }

    // methods
    function setSelectedItem(item?: SeletedItem) {
      selectedList.value.push(item ?? usingItem.value);
      usingItem.value = null;
      keyword.value = '';
      handleInputFocus();
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
    function setInputText(text = '') {
      if (inputRef.value) {
        inputRef.value.innerHTML = text || usingItem.value?.inputInnerHtml || '';
      }
    }

    return {
      inputRef,
      popoverRef,
      wrapRef,
      usingItem,
      menuList,
      isFocus,
      selectedList,
      overflowIndex,
      keyword,
      showPopover,
      showNoSelectValueError,
      setInputText,
      clearInput,
      handleWrapClick,
      handleInputFocus,
      handleInputChange,
      handleInputKeyup,
      handleSelectItem,
      handleSelectCondtionItem,
      handleMenuFooterClick,
      handleDeleteItem,
      handleClickOutside,
      handleResize,
      handleClearAll,
    };
  },
  render() {
    // vars
    const { multiple, values, placeholder, inputInnerHtml } = this.usingItem || {};
    const maxHeight = `${!this.shrink || this.isFocus ?  this.maxHeight : this.minHeight}px`;
    const showInputBefore = !this.selectedList.length && !this.keyword?.length;
    const showInpitAfter = !this.keyword?.length && !values?.length && placeholder;
    const showCondition = !this.usingItem && this.selectedList.length && this.selectedList.slice(-1)[0].type !== 'condition';
    const showPopover = this.showNoSelectValueError || (this.showPopover && !!this.menuList?.length);

    // common elements
    const inputContent = () => <div
      ref="inputRef"
      class={{
        'div-input': true,
        'input-before': showInputBefore,
        'input-after': showInpitAfter,
      }}
      contenteditable={true}
      data-placeholder={!inputInnerHtml && !this.keyword ? '请选择' : ''}
      data-tips={placeholder || ''}
      spellcheck="false"
      v-clickoutside={this.handleClickOutside}
      onFocus={this.handleInputFocus}
      onInput={this.handleInputChange}
      onKeydown={this.handleInputKeyup}/>;
    const popoverContent = () => {
      if (this.showNoSelectValueError) {
        return <div>包含键值的过滤查询必须有一个值</div>;
      }
      return this.menuList?.length ? <div ref="popoverRef" class="popover-content">
      <SearchSelectMenu
        list={this.menuList}
        keyword={this.keyword}
        multiple={!!multiple}
        selected={values?.map(item => item.id) || []}
        conditions={showCondition ? this.conditions : []}
        onSelectItem={this.handleSelectItem}
        onSelectCondition={this.handleSelectCondtionItem}
        onFooterClick={this.handleMenuFooterClick}/>
    </div> : undefined;
    };
    const selectedContent = () => <>
      {

        this.selectedList.map((item, index) => [
          this.overflowIndex >= 0
          && index === this.overflowIndex
          && <div class="search-input-chip overflow-chip">
                +{this.selectedList.length - this.overflowIndex}
              </div>,
          <li
            class={`search-input-chip ${!(this.overflowIndex >= 0 ? index < this.overflowIndex : index >= 0) ? 'hidden-chip' : ''}`}
            key={item.id}>
            <span class="chip-name">
              {item.inputInnerText}
            </span>
            <Close class="chip-clear" onClick={() => this.handleDeleteItem(item, index)}/>
          </li>,
        ])
      }
    </>;
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
        {selectedContent()}
        <div class="search-input-input">
          <Popover
            trigger='manual'
            theme='light'
            placement='bottom-start'
            arrow={false}
            disableOutsideClick={true}
            isShow={showPopover}>
              {{
                default: inputContent,
                content: popoverContent,
              }}
          </Popover>
        </div>
      </div>
      <div class="search-nextfix">
        { this.clearable && (!!this.selectedList.length || !!this.usingItem?.values?.length) && <Close
          class="search-clear"
          onClick={this.handleClearAll}/>
        }
        { this.$slots.nextfix
          ? this.$slots.nextfix()
          : <Search class={`search-nextfix-icon ${this.isFocus ? 'is-focus'  : ''}`}></Search>
        }
      </div>
    </div>
  </div>;
  },
});
