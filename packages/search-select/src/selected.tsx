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
import { defineComponent, PropType, ref } from 'vue';

import { Error } from '@bkui-vue/icon';

import SearchSelectInput from './input';
import { GetMenuListFunc, ICommonItem, ISearchItem, SearchInputMode, SelectedItem, useSearchSelectInject, ValidateValuesFunc, ValueBehavior } from './utils';
;
export default defineComponent({
  name: 'SearchSelected',
  props: {
    data: {
      type: Array as PropType<ISearchItem[]>,
      required: true,
    },
    selectedList: {
      type: Array as PropType<SelectedItem[]>,
      required: true,
    },
    overflowIndex: {
      type: Number,
      default: -1,
    },
    conditions: {
      type: Array as PropType<ICommonItem[]>,
      default: () => [],
    },
    getMenuList: Function as PropType<GetMenuListFunc>,
    validateValues: Function as PropType<ValidateValuesFunc>,
    valueBehavior: String as PropType<ValueBehavior>,
  },
  emits: ['delete'],
  setup(_props, { emit }) {
    const inputRef = ref<typeof SearchSelectInput>(null);
    const { onEditClick, onEditEnter, onEditBlur, editKey, valueSplitCode } = useSearchSelectInject();
    function handleDeleteSelected(index: number) {
      emit('delete', index);
    }
    function handleEditSeleted(e: MouseEvent, item: SelectedItem, index: number) {
      e.preventDefault();
      e.stopPropagation();
      onEditClick(item, index);
      // magic code
      setTimeout(() => inputRef.value.handleInputFocus(), 200);
    };
    function handleAddSelected(item: SelectedItem, index: number) {
      onEditEnter(item, index);
    }
    function handleInputFocus(isFocus: boolean) {
      if (isFocus) return;
      onEditBlur();
    }
    function handleInputOutside() {
      return true;
    }
    function copySeletedItem(item: SelectedItem): SelectedItem {
      const newItem = new SelectedItem(item.searchItem, item.type, valueSplitCode.value);
      newItem.values = item.values.slice();
      return newItem;
    }
    return {
      inputRef,
      editKey,
      copySeletedItem,
      handleDeleteSelected,
      handleEditSeleted,
      handleInputOutside,
      handleAddSelected,
      handleInputFocus,
    };
  },
  render() {
    const contentComponent = (item: SelectedItem, index: number) => (this.editKey === `${item.id}_${index}`
      ? <div class="selected-input" key={this.editKey.toString()}>
          <SearchSelectInput ref="inputRef"
            key={ this.editKey.toString()}
            mode={SearchInputMode.EDIT}
            data={this.data}
            showCondition={false}
            conditions={this.conditions}
            defautUsingItem={this.copySeletedItem(item)}
            clickOutside={this.handleInputOutside}
            getMenuList={this.getMenuList}
            validateValues={this.validateValues}
            valueBehavior={this.valueBehavior}
            onAdd={v => this.handleAddSelected(v, index)}
            onFocus={this.handleInputFocus}/>
        </div>
      : <li
            class={`search-container-selected ${!(this.overflowIndex >= 0 ? index < this.overflowIndex : index >= 0) ? 'hidden-selected' : ''}`}
            key={`${item.id}_${index}`}>
            <span class="selected-name" onClick={e => this.handleEditSeleted(e, item, index)}>
              {item.inputInnerText}
            </span>
            <Error class="selected-clear" onClick={() => this.handleDeleteSelected(index)}/>
          </li>);
    return <>
      {
        this.selectedList.map((item, index) => [
          this.overflowIndex >= 0
          && index === this.overflowIndex
          && <div class="search-container-selected overflow-selected">
                +{this.selectedList.length - this.overflowIndex}
              </div>,
          contentComponent(item, index),
        ])
      }
    </>;
  },
});
