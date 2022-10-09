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
import { computed, ComputedRef, defineComponent, PropType, Ref, ref, watch, watchEffect } from 'vue';

import { clickoutside } from '@bkui-vue/directives';
import Popover from '@bkui-vue/popover2';

import SearchSelectMenu from './menu';
import { GetMenuListFunc, ICommonItem, IMenuFooterItem, ISearchItem, SearchInputMode, SearchItemType, SelectedItem, useSearchSelectInject } from './utils';
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
      default: () => [],
    },
    defautUsingItem: Object as PropType<SelectedItem>,
    mode: {
      type: Object as PropType<SearchInputMode>,
      default: SearchInputMode.DEFAULT,
    },
    geMenuList: Function as PropType<GetMenuListFunc>,
  },
  emits: ['focus', 'add', 'delete'],
  setup(props, { emit, expose }) {
    const inputRef = ref<HTMLDivElement>(null);
    const popoverRef = ref<HTMLDivElement>(null);

    const keyword = ref('');
    const showNoSelectValueError = ref(false);
    const isFocus = ref(false);
    const showPopover = ref(false);
    const usingItem: Ref<SelectedItem> = ref(props.defautUsingItem);
    const menuHoverId = ref('');
    const loading = ref<boolean>(false);
    // const selectMenuList = ref<ICommonItem[]>([]);
    let isBindEvent = false;

    const remoteMenuList = ref<ICommonItem[]>([]);
    const menuList: ComputedRef<ICommonItem[]> = computed(() => {
      if (!usingItem?.value) return props.data
        .filter(item => item.name.toLocaleLowerCase().includes(keyword.value.toLocaleLowerCase()));
      // .map(item => ({ ...item, hover: false }));
      if (usingItem.value.type === 'condition') {
        return props.conditions;
      }
      if (!usingItem.value.values?.length
        || usingItem.value.multiple
        || props.mode === SearchInputMode.EDIT) return usingItem.value.children
        .filter(item => item.name.toLocaleLowerCase().includes(keyword.value.toLocaleLowerCase()));
      return [];
    });


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

    watch([menuList, showPopover], () => {
      if (menuList.value?.some(item => !item.disabled) && showPopover.value) {
        if (!isBindEvent) {
          // menuHoverId.value = menuList.value.find(item => !item.disabled).id;
          menuHoverId.value = '';
          isBindEvent = true;
          document.addEventListener('keydown', handleDocumentKeydown);
        }
      } else {
        document.removeEventListener('keydown', handleDocumentKeydown);
        isBindEvent = false;
        menuHoverId.value = '';
      }
    });

    // events
    function handleDocumentKeydown(e: KeyboardEvent) {
      switch (e.code) {
        case 'ArrowDown':
        case 'ArrowUp':
          documentArrowEvent(e);
          break;
        case 'Enter':
        case 'NumpadEnter':
          documentEnterEvent(e);
          break;
      }
    }
    function documentArrowEvent(e: KeyboardEvent) {
      e.preventDefault();
      inputRef.value.blur();
      const len = menuList.value.length;
      let i = len;
      let curIndex = menuList.value.findIndex(set => set.id === menuHoverId.value);
      while (i >= 0) {
        curIndex = e.code === 'ArrowDown' ? curIndex + 1 : curIndex - 1;
        // eslint-disable-next-line no-nested-ternary
        curIndex = curIndex > len - 1 ? 0 : (curIndex < 0 ? len - 1 : curIndex);
        const item = menuList.value[curIndex];
        if (!item.disabled) {
          i = -1;
          menuHoverId.value = item.id;
          return;
        }
        i -= 1;
      }
    }
    function documentEnterEvent(e: KeyboardEvent) {
      if (isBindEvent) {
        e.preventDefault();
        const item = menuList.value.find(item => item.id === menuHoverId.value);
        item && handleSelectItem(item);
      }
    }
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
        getMenuList();
      } else if (!keyword.value && text.length < (usingItem.value?.inputInnerText?.length || 1)) {
        usingItem.value = null;
        keyword.value = text;
        getMenuList();
      } else if (!usingItem.value?.values?.length) {
        keyword.value = text
          .replace('\u00A0', '\u0020')
          .replace(usingItem.value?.keyInnerText.replace('\u00A0', '\u0020') || '', '')
          .trim();
        getMenuList();
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
      if (usingItem.value?.values.length) {
        // 删除选项
        if (usingItem.value?.multiple || usingItem.value.isInValueList(usingItem.value.values[0])) {
          usingItem.value.values.splice(-1, 1);
          keyword.value = '';
          handleInputFocus();
          return;
        }
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
      } if (usingItem.value?.type === 'condition') {
        usingItem.value = new SelectedItem(item, type);
        setSelectedItem();
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

    // functions
    async function getMenuList() {
      if (typeof props.geMenuList === 'function') {
        loading.value = true;
        const list = await props.geMenuList(usingItem.value.searchItem, keyword.value).catch(() => []);
        loading.value = false;
        return list;
      }
      if (!usingItem?.value) return props.data
        .filter(item => item.name.toLocaleLowerCase().includes(keyword.value.toLocaleLowerCase()));
      if (usingItem.value.type === 'condition') {
        return props.conditions;
      }
      if (!usingItem.value.values?.length
        || usingItem.value.multiple
        || props.mode === SearchInputMode.EDIT) return usingItem.value.children
        .filter(item => item.name.toLocaleLowerCase().includes(keyword.value.toLocaleLowerCase()));
      return [];
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

    // expose
    expose({
      handleInputFocus,
      isFocus,
    });

    return {
      popoverRef,
      inputRef,
      keyword,
      remoteMenuList,
      menuList,
      menuHoverId,
      isFocus,
      usingItem,
      showPopover,
      showNoSelectValueError,
      documentArrowEvent,
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
    // const menuList = typeof this.geMenuList === 'function' ? this.remoteMenuList : this.menuList;
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
        hoverId={this.menuHoverId}
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
