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
import { defineComponent, PropType, Ref, ref, watch, watchEffect } from 'vue';

import { clickoutside } from '@bkui-vue/directives';
import Popover from '@bkui-vue/popover';
import { debounce, random } from '@bkui-vue/shared';

import SearchSelectMenu from './menu';
import { GetMenuListFunc, ICommonItem, IMenuFooterItem, ISearchItem, MenuSlotParams, SearchInputMode, SearchItemType, SelectedItem, useSearchSelectInject, ValidateValuesFunc } from './utils';
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
      type: String as PropType<SearchInputMode>,
      default: SearchInputMode.DEFAULT,
    },
    geMenuList: Function as PropType<GetMenuListFunc>,
    validateValues: Function as PropType<ValidateValuesFunc>,
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
    const debounceSetMenuList = debounce(300, setMenuList);
    // const selectMenuList = ref<ICommonItem[]>([]);
    let isBindEvent = false;

    const remoteMenuList = ref<ICommonItem[]>([]);
    const menuList: Ref<ISearchItem[]> = ref([]);


    const { editKey, onValidate } = useSearchSelectInject();
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
      inputRef.value?.blur();
      const len = menuList.value.length;
      let i = len;
      let index = menuList.value.findIndex(set => set.id === menuHoverId.value);
      while (i >= 0) {
        index = e.code === 'ArrowDown' ? index + 1 : index - 1;
        // eslint-disable-next-line no-nested-ternary
        index = index > len - 1 ? 0 : (index < 0 ? len - 1 : index);
        const item = menuList.value[index];
        if (!item.disabled) {
          i = -1;
          const dom = document.getElementById(item.id);
          dom?.focus();
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
    function handleInputFocus(e: FocusEvent) {
      setInputFocus();
      e && setMenuList();
    }
    function handleInputChange(event: Event) {
      clearInput();
      let text = (event.target as HTMLDivElement).innerText;
      if (/(\r|\n)/gm.test(text) || /\s{2}/gm.test(text)) {
        event.preventDefault();
        text = text.replace(/(\r|\n)/gm, '|').replace(/\s{2}/gm, '');
        inputRef.value.innerText = text;
        setInputFocus();
        keyword.value = text;
        debounceSetMenuList();
      } else if (!keyword.value && text.length < (usingItem.value?.inputInnerText?.length || 1)) {
        const outerText = text
          .replace('\u00A0', '\u0020')
          .replace(usingItem.value?.keyInnerText.replace('\u00A0', '\u0020').trim() || '', '')
          .trim();
        outerText && (usingItem.value = null);
        keyword.value = outerText ? text : '';
        debounceSetMenuList();
      } else if (!usingItem.value?.values?.length) {
        keyword.value = text
          .replace('\u00A0', '\u0020')
          .replace(usingItem.value?.keyInnerText.replace('\u00A0', '\u0020') || '', '')
          .trim();
        setInputFocus();
        debounceSetMenuList();
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
    async function handleKeyEnter(event?: KeyboardEvent) {
      event?.preventDefault();
      if (!usingItem.value) {
        if (!keyword.value) return;
        const value = {
          id: keyword.value,
          name: keyword.value,
        };
        const res = await validateUsingItemValues(value);
        if (!res) return;
        emit('add', new SelectedItem(value, 'text'));
        keyword.value = '';
        setMenuList();
        return;
      }
      const { values } = usingItem.value;
      if (!values?.length) {
        if (keyword.value?.length) {
          const value = { id: keyword.value, name: keyword.value };
          const res = await validateUsingItemValues(value);
          if (!res) return;
          usingItem.value.addValue(value);
          emit('add', usingItem.value);
          keyword.value = '';
          usingItem.value = null;
          return;
        }
        showNoSelectValueError.value = true;
        return;
      }
      const res = await validateUsingItemValues();
      if (!res) return;
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
          setInputFocus();
          return;
        }
      }
      onValidate('');
    }
    async function handleSelectItem(item: ICommonItem, type?: SearchItemType) {
      // 快捷选中
      if (item.value?.id) {
        const seleted = new SelectedItem({ ...item, id: item.realId ?? item.id }, type);
        seleted.addValue(item.value);
        setSelectedItem(seleted);
        return;
      }
      if (!usingItem.value || !inputRef?.value?.innerText) {
        usingItem.value = new SelectedItem(item, type);
        keyword.value = '';
        const isCondition = type === 'condition';
        isCondition && setSelectedItem();
        showPopover.value = isCondition || !!usingItem.value.children.length;
        setInputFocus();
        return;
      } if (usingItem.value?.type === 'condition') {
        usingItem.value = new SelectedItem(item, type);
        setSelectedItem();
        return;
      }
      usingItem.value.addValue(item);
      const res = await validateUsingItemValues(item);
      if (!res) return;
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
          setInputFocus();
          break;
      }
    }

    // functions
    async function validateUsingItemValues(value?: ICommonItem) {
      if (!usingItem.value) {
        return await validateValues(null, [value]);
      }
      const { searchItem, validate, values } = usingItem.value;
      if (validate && typeof props.validateValues === 'function') {
        return await validateValues(searchItem, value ? [value] : values);
      }
      onValidate('');
      return true;
    }
    async function validateValues(searchItem?: ISearchItem, value?: ICommonItem[]) {
      const validateStr =  await props.validateValues?.(searchItem ?? null, value).catch(() => false);
      if (typeof validateStr === 'string' || validateStr === false) {
        onValidate(validateStr || '校验错误');
        return false;
      }
      onValidate('');
      return true;
    }
    function setInputFocus() {
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
    async function setMenuList() {
      let list = [];
      if (typeof props.geMenuList === 'function' && !usingItem.value?.searchItem?.async) {
        loading.value = true;
        list = await props.geMenuList(usingItem.value?.searchItem, keyword.value).catch(() => []);
        loading.value = false;
      } else if (!usingItem?.value) {
        if (!keyword.value?.length) {
          list = props.data.slice();
        } else props.data.forEach((item) => {
          const isMatched = item.name.toLocaleLowerCase().includes(keyword.value.toLocaleLowerCase());
          if (isMatched) {
            list.push(item);
            item.children?.forEach((child) => {
              list.push({
                ...item,
                realId: item.id,
                id: random(10),
                value: child,
              });
            });
            list.push({
              ...item,
              realId: item.id,
              id: random(10),
              value: {
                id: keyword.value,
                name: keyword.value,
              },
            });
          } else {
            item.children?.forEach((child) => {
              if (child.name.toLocaleLowerCase().includes(keyword.value.toLocaleLowerCase())) {
                list.push({
                  ...item,
                  realId: item.id,
                  id: random(10),
                  value: child,
                });
              }
            });
            list.push({
              ...item,
              value: {
                id: keyword.value,
                name: keyword.value,
              },
            });
          }
        });
      }  else if (usingItem.value.type === 'condition') {
        list = props.conditions;
      } else if (!usingItem.value.values?.length
        || usingItem.value.multiple
        || props.mode === SearchInputMode.EDIT) {
        list = usingItem.value.children
          .filter(item => item.name.toLocaleLowerCase().includes(keyword.value.toLocaleLowerCase()));
      }
      menuList.value = list;
    }
    function setSelectedItem(item?: SelectedItem) {
      emit('add', item ?? usingItem.value);
      usingItem.value = null;
      keyword.value = '';
      setInputFocus();
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
      loading,
      remoteMenuList,
      menuList,
      menuHoverId,
      isFocus,
      usingItem,
      showPopover,
      showNoSelectValueError,
      debounceSetMenuList,
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
    const showPopover = this.loading || this.showNoSelectValueError || (this.showPopover && !!this.menuList?.length);
    const showCondition = !this.usingItem && this.showCondition;
    const menuSlots = Object.assign({}, this.$slots.menu ? {
      default: (data: MenuSlotParams) => this.$slots.menu?.(data),
    } : {});
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
      if (this.loading) {
        return <div>加载中...</div>;
      }
      if (this.showNoSelectValueError) {
        return <div>包含键值的过滤查询必须有一个值</div>;
      }
      return this.menuList?.length ? <div ref="popoverRef" class="bk-search-select-popover">
      <SearchSelectMenu
        list={this.menuList}
        keyword={this.keyword}
        multiple={!!multiple}
        hoverId={this.menuHoverId}
        selected={values?.map(item => item.id) || []}
        conditions={showCondition ? this.conditions : []}
        onSelectItem={this.handleSelectItem}
        onSelectCondition={this.handleSelectCondtionItem}
        onFooterClick={this.handleMenuFooterClick}
        v-slots={{ ...menuSlots }}
        />
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
