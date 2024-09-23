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
import {
  GetMenuListFunc,
  ICommonItem,
  ISearchItem,
  SearchInputMode,
  SearchLogical,
  SelectedItem,
  useSearchSelectInject,
  ValidateValuesFunc,
  ValueBehavior,
} from './utils';
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
    maxHeight: {
      type: Number,
      default: () => 392,
    },
    conditions: {
      type: Array as PropType<ICommonItem[]>,
      default: () => [],
    },
    getMenuList: Function as PropType<GetMenuListFunc>,
    validateValues: Function as PropType<ValidateValuesFunc>,
    valueBehavior: String as PropType<ValueBehavior>,
  },
  emits: ['delete', 'selectKey'],
  setup(_props, { emit }) {
    const inputRef = ref<InstanceType<typeof SearchSelectInput>>(null);
    const selectedInputRef = ref<HTMLDivElement>(null);
    const { onEditClick, onEditEnter, onEditBlur, editKey } = useSearchSelectInject();
    function handleDeleteSelected(index: number) {
      emit('delete', index);
    }
    function handleEditSelected(e: MouseEvent, item: SelectedItem, index: number) {
      e.preventDefault();
      e.stopPropagation();
      onEditClick(item, index);
      emit('selectKey', {
        id: item.id,
        name: item.name,
        values: item.values.slice(),
      });
      // magic code
      setTimeout(() => inputRef.value.handleInputFocus(), 200);
    }
    function handleAddSelected(item: SelectedItem, index: number) {
      onEditEnter(item, index);
    }
    function handleInputFocus(isFocus: boolean) {
      if (isFocus) return;
      onEditBlur();
    }
    function handleInputOutside(target: Node) {
      return !selectedInputRef.value?.contains(target);
    }
    function copySelectedItem(item: SelectedItem): SelectedItem {
      const newItem = new SelectedItem(item.searchItem, item.type);
      newItem.values = item.values.slice();
      newItem.logical = item.logical || SearchLogical.OR;
      return newItem;
    }
    return {
      inputRef,
      selectedInputRef,
      editKey,
      copySelectedItem,
      handleDeleteSelected,
      handleEditSelected,
      handleInputOutside,
      handleAddSelected,
      handleInputFocus,
    };
  },
  render() {
    const contentComponent = (item: SelectedItem, index: number) =>
      this.editKey === `${item.id}_${index}` ? (
        <div
          key={this.editKey.toString()}
          ref='selectedInputRef'
          class='selected-input'
        >
          <SearchSelectInput
            key={this.editKey.toString()}
            ref='inputRef'
            v-slots={{ ...this.$slots }}
            clickOutside={this.handleInputOutside}
            conditions={this.conditions}
            data={this.data}
            defaultUsingItem={this.copySelectedItem(item)}
            getMenuList={this.getMenuList}
            maxHeight={this.maxHeight}
            mode={SearchInputMode.EDIT}
            showCondition={false}
            validateValues={this.validateValues}
            valueBehavior={this.valueBehavior}
            onAdd={v => this.handleAddSelected(v, index)}
            onFocus={this.handleInputFocus}
          />
        </div>
      ) : (
        <li
          key={`${item.id}_${index}`}
          class={`search-container-selected ${
            !(this.overflowIndex >= 0 ? index < this.overflowIndex : index >= 0) ? 'hidden-selected' : ''
          }`}
        >
          <span
            class='selected-name'
            onClick={e => this.handleEditSelected(e, item, index)}
          >
            {item.inputInnerText}
          </span>
          <Error
            class='selected-clear'
            onClick={() => this.handleDeleteSelected(index)}
          />
        </li>
      );
    return (
      <>
        {this.selectedList.map((item, index) => [
          this.overflowIndex >= 0 && index === this.overflowIndex && (
            <div class='search-container-selected overflow-selected'>
              +{this.selectedList.length - this.overflowIndex}
            </div>
          ),
          contentComponent(item, index),
        ])}
      </>
    );
  },
});
