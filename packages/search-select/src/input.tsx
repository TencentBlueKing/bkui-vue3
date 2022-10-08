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
import { computed, defineComponent, PropType, ref, watch, watchEffect } from 'vue';

import { clickoutside } from '@bkui-vue/directives';
import Popover from '@bkui-vue/popover2';

import SearchSelectMenu from './menu';
import { ICommonItem, IMenuFooterItem, ISearchItem, SearchInputMode, SearchItemType, SelectedItem, useSearchSelectInject } from './utils';
export default defineComponent({
  name: 'SearchSelectInput',
  directives: {
    clickoutside,
  },
  props: {
    data: {
      type: Array as PropType<ISearchItem[]>,
      required: true,
    },
    showInputBefore: Boolean,
    showCondition: Boolean,
    clickOutside: Function,
    conditions: {
      type: Array as PropType<ICommonItem[]>,
      default: () => [{ id: 'or', name: '或', disabled: true }, { id: 'and', name: '且' }],
    },
    defautUsingItem: Object as PropType<SelectedItem>,
    mode: {
      type: Object as PropType<SearchInputMode>,
      default: SearchInputMode.DEFAULT,
    },
  },
  emits: ['focus', 'add', 'delete'],
  setup(props, { emit, expose }) {
    const inputRef = ref<HTMLDivElement>(null);
    const popoverRef = ref<HTMLDivElement>(null);

    const keyword = ref('');
    const showNoSelectValueError = ref(false);
    const isFocus = ref(false);
    const showPopover = ref(false);
    const usingItem = ref<SelectedItem>(props.defautUsingItem);

    const { editKey } = useSearchSelectInject();
    watch(editKey, () => {
      if (props.mode === SearchInputMode.DEFAULT && editKey.value) {
        showPopover.value = false;
      }
    });
    // effects
    watchEffect(() => {
      if (!keyword.value) {
        setInputText();
      }
    }, { flush: 'pre' });
    const menuList = computed(() => {
      if (!usingItem?.value) return props.data.filter(item => item.name.toLocaleLowerCase()
        .includes(keyword.value.toLocaleLowerCase()));
      if (!usingItem.value.values?.length
        || usingItem.value.multiple
        || props.mode === SearchInputMode.EDIT) return usingItem.value.children
        .filter(item => item.name.toLocaleLowerCase()
          .includes(keyword.value.toLocaleLowerCase()));
      return [];
    });
    function handleClickOutside(e: MouseEvent) {
      if (!popoverRef.value?.contains(e.target as Node) && props.clickOutside?.(e.target, popoverRef.value)) {
        showPopover.value = false;
        isFocus.value = false;
        emit('focus', isFocus.value);
      }
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
      emit('focus', isFocus.value);
    }
    function handleInputChange(event: Event) {
      clearInput();
      let text = (event.target as HTMLDivElement).innerText;
      if (/(\r|\n)/gm.test(text) || /\s{2}/gm.test(text)) {
        event.preventDefault();
        text = text.replace(/(\r|\n)/gm, '|').replace(/\s{2}/gm, '');
        inputRef.value.innerText = text;
        handleInputFocus();
        keyword.value = text;
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
          handleKeyBackspace();
        default:
          showNoSelectValueError.value = false;
          break;
      }
    }
    function handleKeyEnter(event?: KeyboardEvent) {
      event?.preventDefault();
      if (!usingItem.value) {
        if (!keyword.value) return;
        emit('add', new SelectedItem({
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
          emit('add', usingItem.value);
          keyword.value = '';
          usingItem.value = null;
          return;
        }
        showNoSelectValueError.value = true;
        return;
      }
      setSelectedItem();
    }
    function handleKeyBackspace() {
      // 删除已选择项
      if (!usingItem.value && !keyword.value) {
        emit('delete');
        return;
      }
      // 删除可多选项
      if (usingItem.value?.multiple && usingItem.value?.values.length) {
        usingItem.value.values.splice(-1, 1);
        keyword.value = '';
        handleInputFocus();
        return;
      }
    }
    function handleSelectItem(item: ISearchItem, type?: SearchItemType) {
      if (!usingItem.value || !inputRef?.value?.innerText) {
        usingItem.value = new SelectedItem(item, type);
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
    function setSelectedItem(item?: SelectedItem) {
      emit('add', item ?? usingItem.value);
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
    expose({
      handleInputFocus,
      isFocus,
    });
    return {
      popoverRef,
      inputRef,
      keyword,
      menuList,
      isFocus,
      usingItem,
      showPopover,
      showNoSelectValueError,
      handleClickOutside,
      handleInputFocus,
      handleInputChange,
      handleInputKeyup,
      handleSelectItem,
      handleSelectCondtionItem,
      handleMenuFooterClick,
    };
  },
  render() {
    const { multiple, values, placeholder, inputInnerHtml } = this.usingItem || {};
    const showInputAfter = !this.keyword?.length && !values?.length && placeholder;
    const showPopover = this.showNoSelectValueError || (this.showPopover && !!this.menuList?.length);
    const showCondition = !this.usingItem && this.showCondition;
    const inputContent = () => <div
    ref="inputRef"
    class={{
      'div-input': true,
      'input-before': this.showInputBefore && !this.keyword?.length,
      'input-after': showInputAfter,
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

    return <Popover
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
  </Popover>;
  },
});
