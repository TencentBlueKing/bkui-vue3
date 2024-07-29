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
import { computed, defineComponent, nextTick, PropType, Ref, ref, SlotsType, watch } from 'vue';

import { useLocale, usePrefix } from '@bkui-vue/config-provider';
import { clickoutside } from '@bkui-vue/directives';
import Popover from '@bkui-vue/popover';
import { debounce, random } from '@bkui-vue/shared';

import SearchSelectMenu from './menu';
import {
  GetMenuListFunc,
  ICommonItem,
  IMenuFooterItem,
  ISearchItem,
  MenuSlotParams,
  SearchInputMode,
  SearchItemType,
  SearchLogical,
  SelectedItem,
  useSearchSelectInject,
  ValidateValuesFunc,
  ValueBehavior,
  ValueSplitRegex,
  ValueSplitTestRegex,
} from './utils';
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
    placeholder: String,
    conditions: {
      type: Array as PropType<ICommonItem[]>,
      default: () => [],
    },
    defaultUsingItem: Object as PropType<SelectedItem>,
    mode: {
      type: String as PropType<SearchInputMode>,
      default: SearchInputMode.DEFAULT,
    },
    getMenuList: Function as PropType<GetMenuListFunc>,
    validateValues: Function as PropType<ValidateValuesFunc>,
    valueBehavior: String as PropType<ValueBehavior>,
  },
  emits: ['focus', 'add', 'delete', 'selectKey'],
  slots: Object as SlotsType<{
    menu: MenuSlotParams;
  }>,
  setup(props, { emit, expose }) {
    const t = useLocale('searchSelect');
    const { resolveClassName } = usePrefix();
    const inputRef = ref<HTMLDivElement>(null);
    const popoverRef = ref<HTMLDivElement>(null);

    const keyword = ref('');
    const showNoSelectValueError = ref(false);
    const isFocus = ref(false);
    const showPopover = ref(false);
    const usingItem: Ref<SelectedItem> = ref(props.defaultUsingItem);
    const menuHoverId = ref('');
    const loading = ref<boolean>(false);
    const debounceSetMenuList = debounce(100, setMenuList);
    // const selectMenuList = ref<ICommonItem[]>([]);
    let isBindEvent = false;

    const remoteMenuList = ref<ICommonItem[]>([]);
    const menuList: Ref<ISearchItem[]> = ref([]);

    const { editKey, onValidate, searchData } = useSearchSelectInject();
    const valueLogic = computed(() => usingItem.value?.logical || SearchLogical.OR);

    watch(editKey, () => {
      if (props.mode === SearchInputMode.DEFAULT && editKey.value) {
        showPopover.value = false;
      }
    });

    // effects
    // watchEffect(
    //   () => {
    //     if (!keyword.value) {
    //       setInputText();
    //     }
    //   },
    //   { flush: 'pre' },
    // );

    watch([menuList, showPopover], () => {
      const shouldBindEvent = showPopover.value && menuList.value?.some(item => !item.disabled);
      if (shouldBindEvent) {
        if (!isBindEvent) {
          menuHoverId.value =
            props.valueBehavior === ValueBehavior.NEED_KEY ? menuList.value.find(item => !item.disabled)?.id || '' : '';
          isBindEvent = true;
          document.addEventListener('keydown', handleDocumentKeydown);
        }
      } else {
        document.removeEventListener('keydown', handleDocumentKeydown);
        isBindEvent = false;
        if (props.valueBehavior !== ValueBehavior.NEED_KEY) {
          menuHoverId.value = '';
        }
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
      let index = menuList.value.findIndex(set => set.id === menuHoverId.value);
      for (let tries = 0; tries < len; tries++) {
        index = (index + (e.code === 'ArrowDown' ? 1 : -1) + len) % len;
        const item = menuList.value[index];
        if (item && !item.disabled) {
          const dom = document.getElementById(item.id);
          dom?.focus();
          menuHoverId.value = item.id;
          break;
        }
      }
    }
    function documentEnterEvent(e: KeyboardEvent) {
      if (!isBindEvent) return;
      e.preventDefault();
      const item = menuList.value?.find(item => item.id === menuHoverId.value);
      item && handleSelectItem(item);
    }

    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.value?.contains(e.target as Node) || !props.clickOutside?.(e.target, popoverRef.value)) {
        return;
      }
      if (usingItem.value?.isCustomMenu) {
        if (props.mode === SearchInputMode.EDIT) {
          handleKeyEnter().then(v => v && clearInput());
          showPopover.value = false;
        }
        return;
      }
      if (props.mode === SearchInputMode.EDIT || usingItem.value) {
        usingItem.value && handleKeyEnter().then(v => v && clearInput());
        if (!usingItem.value) {
          emit('focus', false);
        }
        return;
      }
      isFocus.value = false;
      showPopover.value = false;
      emit('focus', isFocus.value);
    }
    let isOriginFocus = false;
    function handleInputFocus(event?: FocusEvent) {
      if (isOriginFocus) return;
      showNoSelectValueError.value = false;
      if (props.mode === SearchInputMode.EDIT && usingItem.value && !isFocus.value) {
        const nodeList = Array.from(
          inputRef.value.querySelectorAll(
            `[data-type="${usingItem.value.values.length ? 'value' : usingItem.value.type}"]`,
          ),
        );
        if (!nodeList.length) return;
        event?.preventDefault();
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(nodeList.at(-1));
        selection?.removeAllRanges();
        isOriginFocus = true;
        setTimeout(() => {
          isOriginFocus = false;
        }, 200);
        selection.addRange(range); // 注意这里会触发focus事件
        setInputFocus(true, false);
        return;
      }
      setMenuList();
      setInputFocus(false, !isFocus.value);
    }
    function handleInputPaste(event: ClipboardEvent) {
      event.preventDefault();
      const formattedText = event.clipboardData.getData('text').trim();
      if (!usingItem.value) {
        const formateItem = str2SelectedItem(formattedText);
        if (formateItem) {
          usingItem.value = formateItem;
          setInputFocus(true, true);
          return;
        }
        keyword.value = formattedText
          .split(ValueSplitRegex)
          .filter(v => v.trim() && !ValueSplitTestRegex.test(v))
          .join(` ${valueLogic.value} `);
        inputRef.value.innerText = keyword.value;
        setInputFocus();
        debounceSetMenuList();
        return;
      }
      usingItem.value.addValues(formattedText);
      debounceSetMenuList();
    }
    function handleInputChange(event: Event) {
      const text = (event.target as HTMLDivElement).innerText.trim();
      if (!usingItem.value) {
        keyword.value = text;
        debounceSetMenuList();
        return;
      }
      keyword.value = usingItem.value.isSpecialType()
        ? text
        : text.replace(usingItem.value.name, '').replace(':', '').trim();
      debounceSetMenuList();
    }
    function handleInputKeyup(event: KeyboardEvent) {
      switch (event.code) {
        case 'Enter':
        case 'NumpadEnter':
          if (
            props.valueBehavior === ValueBehavior.NEED_KEY &&
            menuList.value.some(item => item.id === menuHoverId.value)
          ) {
            if (!usingItem.value && keyword.value?.length) {
              event.preventDefault();
            }
            return;
          }
          handleKeyEnter(event).then(v => v && clearInput());
          break;
        case 'Backspace':
          handleKeyBackspace(event);
        default:
          showNoSelectValueError.value = false;
          break;
      }
    }
    async function handleKeyEnter(event?: KeyboardEvent) {
      event?.preventDefault();
      // 异步延迟解决确保响应时机问题
      await new Promise(resolve => setTimeout(resolve, 0));
      if (!usingItem.value) {
        if (!keyword.value || props.valueBehavior === ValueBehavior.NEED_KEY) {
          return;
        }
        return await enterNewItemSelected();
      }
      if (keyword.value) {
        return await enterExistingItemSelected();
      }
      // 处理没有特殊类型且值为空的情况
      if (!usingItem.value?.isSpecialType() && usingItem.value?.values.length < 1) {
        showNoSelectValueError.value = !showNoSelectValueError.value;
        return false;
      }
      // 最终验证
      const isValid = await validateUsingItemValues();
      if (!isValid) {
        return false;
      }
      if (usingItem.value?.isCustomMenu) {
        showPopover.value = false;
      }
      setSelectedItem();
      return false;
    }
    function handleKeyBackspace(event: KeyboardEvent) {
      // 删除已选择项
      if (!usingItem.value && !keyword.value) {
        menuHoverId.value = '';
        emit('delete');
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        setTimeout(setMenuList, 16);
        return;
      }
      if (usingItem.value?.values.length) {
        if (usingItem.value.type === 'text' || !usingItem.value.children?.length) return;
        event.preventDefault();
        const selection = window.getSelection();
        if (selection?.rangeCount > 0) {
          const range: Range = selection.getRangeAt(0);
          const startPos = range.startContainer;
          let node: HTMLSpanElement | Node = startPos;
          while (node && node.parentNode !== inputRef.value) {
            node = node.parentNode;
          }
          const editIndex: number | string = (node as HTMLSpanElement)?.dataset?.index || -1;
          usingItem.value.values.splice(+editIndex, 1);
          keyword.value = '';
          setInputFocus(false, false);
          return;
        }
      } else if (!keyword.value) {
        usingItem.value = null;
        keyword.value = '';
        setMenuList();
      }
      onValidate('');
    }
    async function handleSelectItem(item: ICommonItem, type?: SearchItemType) {
      // 快捷选中
      if (item.value?.id) {
        const selectedItem = new SelectedItem({ ...item, id: item.realId ?? item.id }, type);
        selectedItem.addValues(item.value.name, false);
        if (props.valueBehavior === ValueBehavior.NEED_KEY && menuHoverId.value) {
          setSelectedItem(selectedItem);
          setInputFocus(true);
          menuHoverId.value = '';
          return;
        }
        usingItem.value = selectedItem;
        if (!(await validateUsingItemValues(usingItem.value.values))) {
          usingItem.value = null;
          return;
        }
        setSelectedItem(usingItem.value);
        setInputFocus(true);
        menuHoverId.value = '';
        return;
      }
      if (!usingItem.value || usingItem.value?.type === 'condition') {
        usingItem.value = new SelectedItem(item, type ?? usingItem.value?.type);
        keyword.value = '';
        const isCondition = usingItem.value?.type === 'condition';
        if (!isCondition) {
          emit('selectKey', {
            id: item.id,
            name: item.name,
            values: [],
          });
        }
        if (isCondition) {
          setSelectedItem();
        }
        showPopover.value = isCondition || !!usingItem.value.children.length;
        setInputFocus(props.valueBehavior === ValueBehavior.NEED_KEY && !!menuHoverId.value);
        return;
      }
      if (usingItem.value) {
        usingItem.value.addValue(item);
        nextTick(deleteInputTextNode);
      }
      if (!(await validateUsingItemValues(usingItem.value.values))) return;
      if (!usingItem.value.multiple) {
        setSelectedItem();
      }
      if (props.valueBehavior === ValueBehavior.NEED_KEY && usingItem.value?.multiple) {
        setInputFocus();
      }
    }
    function handleSelectConditionItem(item: ICommonItem) {
      handleSelectItem(item, 'condition');
    }
    function handleMenuFooterClick(item: IMenuFooterItem) {
      switch (item.id) {
        case 'confirm':
          if (!usingItem.value?.values.length) return;
          keyword.value = '';
          handleKeyEnter();
          break;
        case 'cancel':
          usingItem.value.values = [];
          showPopover.value = false;
          break;
      }
    }
    function handleLogicalChange(logical: SearchLogical) {
      if (!usingItem.value) return;
      usingItem.value.logical = logical;
    }

    // functions
    async function validateValues(searchItem?: ISearchItem, value?: ICommonItem[]) {
      if (typeof props.validateValues === 'function') {
        let validateStr: boolean | string = '';
        try {
          validateStr = await props.validateValues(searchItem ?? null, value);
        } catch {
          validateStr = false;
        }
        if (typeof validateStr === 'string' || validateStr === false) {
          onValidate(validateStr || '校验错误');
          return false;
        }
      }
      onValidate('');
      return true;
    }
    async function validateUsingItemValues(preValues?: ICommonItem[]) {
      if (!usingItem.value) {
        return await validateValues(null, preValues);
      }
      const { searchItem, validate, values } = usingItem.value;
      if (validate && typeof props.validateValues === 'function') {
        return await validateValues(searchItem, preValues ?? values);
      }
      onValidate('');
      return true;
    }
    async function setMenuList() {
      let list = [];
      if (
        typeof props.getMenuList === 'function' &&
        ((!props.data?.length && !usingItem.value) ||
          (usingItem.value &&
            usingItem.value.type !== 'condition' &&
            (usingItem.value.searchItem?.async === undefined || usingItem.value.searchItem.async === true)))
      ) {
        loading.value = true;
        list = await props.getMenuList(usingItem.value?.searchItem, keyword.value).catch(() => []);
        loading.value = false;
      } else if (!usingItem?.value) {
        if (!keyword.value?.length) {
          list = props.data.filter(item => !item.isSelected).slice();
        } else
          props.data
            .filter(item => !item.isSelected)
            .forEach(item => {
              const isMatched = item.name.toLocaleLowerCase().includes(keyword.value.toLocaleLowerCase());
              if (isMatched) {
                list.push(item);
                const filterList = [];
                item.children?.forEach(child => {
                  filterList.push({
                    ...item,
                    realId: item.id,
                    id: random(10),
                    value: child,
                  });
                });
                !filterList.length &&
                  !item.onlyRecommendChildren &&
                  filterList.push({
                    ...item,
                    realId: item.id,
                    id: random(10),
                    value: {
                      id: keyword.value,
                      name: keyword.value,
                    },
                  });
                list.push(...filterList);
              } else {
                const filterList = [];
                item.children?.forEach(child => {
                  if (child.name.toLocaleLowerCase().includes(keyword.value.toLocaleLowerCase())) {
                    filterList.push({
                      ...item,
                      realId: item.id,
                      id: random(10),
                      value: child,
                    });
                  }
                });
                !filterList.length &&
                  !item.onlyRecommendChildren &&
                  filterList.push({
                    ...item,
                    value: {
                      id: keyword.value,
                      name: keyword.value,
                    },
                  });
                list.push(...filterList);
              }
            });
      } else if (usingItem.value.type === 'condition') {
        list = props.conditions;
      } else if (!usingItem.value.values?.length || usingItem.value.multiple || props.mode === SearchInputMode.EDIT) {
        list = usingItem.value.children.filter(item =>
          item.name.toLocaleLowerCase().includes(keyword.value.toLocaleLowerCase()),
        );
      }
      menuList.value = list;
      if (props.valueBehavior === ValueBehavior.NEED_KEY) {
        const hoverItem = list.find(item => !item.disabled);
        if (
          hoverItem &&
          (!menuHoverId.value || (menuHoverId.value && !list.some(item => item.id === menuHoverId.value)))
        ) {
          menuHoverId.value = hoverItem.id;
        }
      }
    }
    async function enterNewItemSelected() {
      const formatItem = str2SelectedItem(keyword.value);
      const valueList = formatItem?.values || [{ id: keyword.value, name: keyword.value }];
      const res = await validateUsingItemValues(valueList);
      if (!res) return;
      emit('add', formatItem || new SelectedItem({ ...valueList[0] }, 'text'));
      keyword.value = '';
      setMenuList();
      return true;
    }
    async function enterExistingItemSelected() {
      let valueList: ICommonItem[] = [];
      if (usingItem.value.isSpecialType()) {
        const formatItem = str2SelectedItem(keyword.value);
        if (formatItem) {
          usingItem.value = formatItem;
          valueList = formatItem.values;
        }
      }
      valueList = valueList.length ? valueList : usingItem.value.str2Values(keyword.value);
      const isValid = await validateUsingItemValues(valueList);
      if (!isValid) return;
      if (usingItem.value.type === 'text') {
        usingItem.value.name = keyword.value;
        usingItem.value.id = keyword.value;
      } else {
        usingItem.value.values = valueList;
      }
      emit('add', usingItem.value);
      keyword.value = '';
      usingItem.value = null;
      setInputFocus(true);
      return true;
    }
    function setCursorToEnd() {
      if (!inputRef.value) return;
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(inputRef.value);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    function setInputFocus(refreshMenuList = false, needCursorToEnd = true) {
      if (refreshMenuList) {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        setTimeout(setMenuList, 16);
      }
      isFocus.value = true;
      showPopover.value = true;
      showNoSelectValueError.value = false;
      !props.getMenuList && needCursorToEnd && nextTick(setCursorToEnd);
      emit('focus', isFocus.value);
    }
    function setSelectedItem(item?: SelectedItem) {
      emit('add', item ?? usingItem.value);
      const needCursorToEnd = !usingItem.value?.isCustomMenu;
      usingItem.value = null;
      keyword.value = '';
      if (needCursorToEnd) {
        setInputFocus(true, needCursorToEnd);
        nextTick(clearInput);
      }
    }
    function clearInput() {
      if (!inputRef.value) return;
      keyword.value = '';
      nextTick(() => (inputRef.value.innerText = ''));
    }
    function str2SelectedItem(str: string) {
      const [key, value] = str.split(':');
      if (key?.trim()) {
        const selectedItem = searchData.value.find(item => item.name === key.trim());
        if (selectedItem) {
          const item = new SelectedItem(
            {
              ...selectedItem,
            },
            'default',
          );
          item.addValues(value);
          return item;
        }
      }
      return undefined;
    }
    function deleteInputTextNode() {
      if (keyword.value?.length) {
        keyword.value = '';
        const nodes = Array.from(inputRef.value.childNodes);
        nodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
            inputRef.value.removeChild(node);
          }
        });
      }
    }
    function inputFocusForWrapper() {
      inputRef.value?.focus();
    }
    async function inputEnterForWrapper() {
      await handleKeyEnter().then(v => v && clearInput());
      showPopover.value = false;
      inputRef.value.blur();
    }
    function inputClearForWrapper() {
      keyword.value = '';
      showNoSelectValueError.value = false;
      showPopover.value = false;
      usingItem.value = null;
      nextTick(clearInput);
    }
    function customPanelSubmit(value: string) {
      usingItem.value.values = [{ id: value, name: value }];
      handleKeyEnter().then(v => v && clearInput());
    }
    function refleshMenuHover() {
      if (!usingItem.value) {
        menuHoverId.value = '';
      }
    }
    // expose
    expose({
      inputFocusForWrapper,
      inputEnterForWrapper,
      inputClearForWrapper,
      handleInputFocus,
      isFocus,
      refleshMenuHover,
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
      handleInputPaste,
      handleLogicalChange,
      handleInputKeyup,
      handleSelectItem,
      handleSelectConditionItem,
      handleMenuFooterClick,
      resolveClassName,
      inputFocusForWrapper,
      inputEnterForWrapper,
      inputClearForWrapper,
      deleteInputTextNode,
      customPanelSubmit,
      refleshMenuHover,
      t,
    };
  },
  render() {
    const { multiple, values, placeholder, inputInnerHtml, isCustomMenu } = this.usingItem || {};
    const showInputAfter = !this.keyword?.length && !values?.length && placeholder;
    const showPopover =
      this.loading || this.showNoSelectValueError || (this.showPopover && (!!isCustomMenu || !!this.menuList?.length));
    const showCondition = !this.usingItem && this.showCondition;
    const inputContent = () => (
      <div
        ref='inputRef'
        class={{
          'div-input': true,
          'input-before': this.showInputBefore && !this.keyword?.length,
          'input-after': showInputAfter,
        }}
        v-clickoutside={this.handleClickOutside}
        contenteditable={true}
        data-placeholder={!inputInnerHtml && !this.keyword ? this.placeholder : ''}
        data-tips={placeholder || ''}
        spellcheck='false'
        onFocus={this.handleInputFocus}
        onInput={this.handleInputChange}
        onKeydown={this.handleInputKeyup}
        onPaste={this.handleInputPaste}
      >
        {this.usingItem?.name &&
          (!this.usingItem.isSpecialType() ? (
            <span
              key={this.usingItem.nameRenderKey}
              style={{ color: '#979BA5' }}
              contenteditable={false}
              data-key={this.usingItem.name}
              data-type={this.usingItem.type}
              onMousedown={e => e.preventDefault()}
            >
              {this.usingItem.name}:&nbsp;
            </span>
          ) : (
            <span
              key={this.usingItem.nameRenderKey}
              data-key={this.usingItem.name}
              data-type={this.usingItem.type}
            >
              {this.usingItem.name}
            </span>
          ))}
        {this.usingItem?.values?.map((item, index) => (
          <span
            key={index}
            data-id={item.id}
            data-index={index}
            data-key={item.name}
            data-type='value'
          >
            {item.name}
            {index < this.usingItem.values.length - 1 ? ` ${this.usingItem.logical} ` : ''}
          </span>
        ))}
      </div>
    );
    const popoverContent = () => {
      if (this.loading) {
        return <div>{this.t.loading}</div>;
      }
      if (this.showNoSelectValueError) {
        return <div>{this.t.filterQueryMustHasValue}</div>;
      }
      if (this.usingItem?.isCustomMenu && this.$slots.menu) {
        return (
          <div
            ref='popoverRef'
            class={this.resolveClassName('search-select-popover')}
          >
            {this.$slots.menu({
              value: this.usingItem.values?.[0],
              id: this.usingItem.id,
              name: this.usingItem.name,
              onSubmit: this.customPanelSubmit,
            })}
          </div>
        );
      }
      return this.menuList?.length ? (
        <div
          ref='popoverRef'
          class={this.resolveClassName('search-select-popover')}
        >
          <SearchSelectMenu
            conditions={showCondition ? this.conditions : []}
            hoverId={this.menuHoverId}
            keyword={this.keyword}
            list={this.menuList}
            logical={this.usingItem?.logical}
            multiple={!!multiple}
            selected={values?.map(item => item.id) || []}
            showLogical={this.usingItem?.showLogical}
            onFooterClick={this.handleMenuFooterClick}
            onSelectCondition={this.handleSelectConditionItem}
            onSelectItem={this.handleSelectItem}
            onUpdate:logical={this.handleLogicalChange}
          />
        </div>
      ) : undefined;
    };

    return (
      <Popover
        arrow={false}
        disableOutsideClick={true}
        isShow={showPopover}
        placement='bottom-start'
        theme='light'
        trigger='manual'
      >
        {{
          default: inputContent,
          content: popoverContent,
        }}
      </Popover>
    );
  },
});
