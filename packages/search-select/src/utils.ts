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

import { ComputedRef, inject, InjectionKey, provide, Ref } from 'vue';

import { random } from '@bkui-vue/shared';
/**
 * @description: 获取menu list方法
 * @param {ISearchItem} item 已选择的key字段 为空则代表当前并未选择key字段
 * @param {string} keyword 已输入的文本
 * @return {*} menu list用于渲染选择弹层列表
 */
export enum ValueBehavior {
  ALL = 'all',
  NEED_KEY = 'need-key',
}
export enum DeleteBehavior {
  CHAR = 'delete-char',
  VALUE = 'delete-value',
}
export type GetMenuListFunc = (item: ISearchItem, keyword: string) => Promise<ISearchItem[]>;
export type ValidateValuesFunc = (item: ISearchItem, values: ICommonItem[]) => Promise<string | true>;
export type MenuSlotParams = {
  value: ICommonItem;
  id: string;
  name: string;
  onSubmit: (value: string) => void;
};
export interface ISearchSelectProvider {
  onEditClick: (item: SelectedItem, index: number) => void;
  onEditEnter: (item: SelectedItem, index: number) => void;
  onEditBlur: () => void;
  onValidate: (str: string) => void;
  editKey: Ref<string>;
  searchData: ComputedRef<ISearchItem[]>;
  isClickOutside: (target: Node) => boolean;
}
export const SEARCH_SELECT_PROVIDER_KEY: InjectionKey<ISearchSelectProvider> = Symbol('SEARCH_SELECT_PROVIDER_KEY');
export const useSearchSelectProvider = (data: ISearchSelectProvider) => {
  provide(SEARCH_SELECT_PROVIDER_KEY, data);
};
export const useSearchSelectInject = () => inject(SEARCH_SELECT_PROVIDER_KEY);

export enum SearchInputMode {
  'DEFAULT' = 'default',
  'EDIT' = 'edit',
}
export interface ICommonItem {
  id: string;
  name: string;
  disabled?: boolean;
  realId?: string;
  value?: Omit<ICommonItem, 'disabled' | 'value'>;
  // 是否已选中
  isSelected?: boolean;
  logical?: SearchLogical;
}
export interface ISearchValue extends Omit<ICommonItem, 'disabled' | 'value'> {
  type?: SearchItemType;
  values?: Omit<ICommonItem, 'disabled' | 'logical'>[];
}
export const ValueSplitRegex = /(\||,|、|\r\n|\n)/gm;
export const ValueSplitTestRegex = /^(\||,|、|\r\n|\n)$/;

export interface ISearchItem {
  id: string;
  name: string;
  // 子选项列表
  children?: ICommonItem[];
  // 是否多选
  multiple?: boolean;
  // 是否远程获取子列表 需配合组件属性 getMenuList使用
  // true 默认 如果配置了属性 getMenuList 则通过 getMenuList来获取子列表
  // false 则是直接拿到 children字段来获取子列表
  async?: boolean;
  // 是校验
  noValidate?: boolean;
  // placeholder
  placeholder?: string;
  // disable
  disabled?: boolean;
  // 选中后立即生成tag
  value?: ICommonItem;
  // 是否已选中
  isSelected?: boolean;
  // 添加推荐选项字符时 是否只匹配children数据
  onlyRecommendChildren?: boolean;
  // 多选值时 逻辑符号
  logical?: SearchLogical;
  // 是否显示逻辑符号选项列表 默认不显示 仅在多选时生效
  showLogicalPanel?: boolean;
  // 是否配置了自定义子项menu
  isCustomMenu?: boolean;
}
export enum SearchLogical {
  AND = '&',
  OR = '|',
}
export interface IMenuFooterItem {
  id: 'cancel' | 'confirm';
  name: string;
  disabled?: boolean;
}
export type SearchItemType = 'condition' | 'default' | 'text';
export class SelectedItem {
  id: string;
  name: string;
  values: ICommonItem[] = [];
  condition: string;
  logical: SearchLogical;
  nameRenderKey = random(4);
  constructor(
    public searchItem: ISearchItem,
    public type: SearchItemType = 'default',
  ) {
    this.id = searchItem.id;
    this.name = searchItem.name;
    this.logical = searchItem.logical || SearchLogical.OR;
    this.type = type;
  }
  get multiple() {
    return !!this.searchItem.multiple;
  }
  get placeholder() {
    return this.searchItem.placeholder || '';
  }
  get children() {
    return this.searchItem.children || [];
  }
  get validate() {
    return !this.searchItem.noValidate;
  }
  get inputInnerHtml() {
    if (this.isSpecialType()) return this.name;
    return `${this.keyInnerHtml}${this.values?.map(item => item.name).join(` ${this.logical} `) || ''}`;
  }
  get inputInnerText() {
    if (this.isSpecialType()) return this.name;
    return `${this.keyInnerText}${this.values?.map(item => item.name).join(` ${this.logical} `) || ''}`;
  }
  get keyInnerHtml() {
    if (this.isSpecialType()) return this.name;
    return this.name ? `${this.name}:\u00A0` : '';
  }
  get keyInnerText() {
    if (this.isSpecialType()) return this.name;
    return this.name ? `${this.name}: ` : '';
  }
  get showLogical() {
    return !!this.searchItem.showLogicalPanel;
  }
  get isCustomMenu() {
    return this.searchItem.isCustomMenu;
  }
  isSpecialType() {
    return ['text', 'condition'].includes(this.type);
  }
  addValue(item: ICommonItem) {
    this.nameRenderKey = random(4);
    if (this.multiple) {
      const index = this.values.findIndex(val => val.id === item.id);
      if (index > -1) {
        this.values.splice(index, 1);
        return;
      }
      this.values.push(item);
      return;
    }
    this.values = [item];
  }
  str2Values(str: string): ICommonItem[] {
    const list = str
      ?.split(this.logical)
      .map(v => v.trim())
      .filter(v => v);
    if (!list?.length) return [];
    const findChildByName = (name: string) => this.children.find(item => item.name === name);
    if (!this.multiple) {
      const val = list.join(` ${this.logical} `).trim();
      const item = findChildByName(val);
      return [
        {
          id: item ? item.id : val,
          name: item ? item.name : val,
          disabled: !!item?.disabled,
        },
      ];
    }
    // 对于多选情况，处理整个列表
    return list.map(val => {
      const existing = this.values.find(item => item.name === val);
      if (existing) return existing;
      const item = findChildByName(val);
      return {
        id: item ? item.id : val,
        name: item ? item.name : val,
        disabled: !!item?.disabled,
      };
    });
  }
  addValues(str: string, mergeValues = true) {
    const valuesFromStr = str.split(ValueSplitRegex).filter(v => v.trim() && !ValueSplitTestRegex.test(v));
    const currentValues = mergeValues ? this.values.map(item => item.name) : [];
    const combinedValues = [...valuesFromStr, ...currentValues];
    const logicalString = combinedValues.filter(v => v.trim()).join(this.logical);
    this.values = this.str2Values(logicalString);
  }
  getValue(str: string) {
    return this.values.find(item => item.id === str) || this.values.find(item => item.name === str);
  }
  toValue(): ISearchValue {
    const value: ISearchValue = {
      id: this.id,
      name: this.name,
    };
    if (this.values?.length) {
      value.values = this.values.map(item => ({ id: item.id, name: item.name }));
      if (this.multiple && this.logical !== SearchLogical.OR) {
        value.logical = this.logical;
      }
    }
    if (this.type && this.type !== 'default') {
      value.type = this.type;
    }
    return value;
  }
  toValueKey() {
    return JSON.stringify(this.toValue());
  }
  isInValueList(item: ICommonItem) {
    return this.children.some(v => v.id === item?.id);
  }
}
