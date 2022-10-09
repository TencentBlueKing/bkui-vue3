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

import { inject, InjectionKey, provide, Ref } from 'vue';
/**
 * @description: 获取menu list方法
 * @param {ISearchItem} item 已选择的key字段 为空则代表当前并未选择key字段
 * @param {string} keyword 已输入的文本
 * @return {*} menu list用于渲染选择弹层列表
 */
export type GetMenuListFunc = (item: ISearchItem, keyword: string) => Promise<ISearchItem[]>;
export interface ISearchSelectProvider {
  onEditClick: (item: SelectedItem, index: number) => void;
  onEditEnter: (item: SelectedItem, index: number) => void;
  onEditBlur: () => void;
  editKey: Ref<String>;
}
export const SEARCH_SLECT_PROVIDER_KEY: InjectionKey<ISearchSelectProvider> =  Symbol('SEARCH_SLECT_PROVIDER_KEY');
export const useSearchSelectProvider = (data: ISearchSelectProvider) => {
  provide(SEARCH_SLECT_PROVIDER_KEY, data);
};
export const useSearchSelectInject = () => inject(SEARCH_SLECT_PROVIDER_KEY);

export enum SearchInputMode {
  'DEFAULT',
  'EDIT'
}
export interface ICommonItem {
  id: string;
  name: string;
  disabled?: boolean;
}
export interface ISearchValue extends Omit<ICommonItem, 'disabled'> {
  type?: SearchItemType;
  values?: Omit<ICommonItem, 'disabled'>[];
}

export interface ISearchItem {
  id: string;
  name: string;
  // 子选项列表
  children?: ICommonItem[];
  // 是否多选
  multiple?: boolean;
  // 是否远程获取子列表
  remote?: boolean;
  // 条件列表
  conditions?: ICommonItem[]
  // 校验
  validate?: (values: ISearchItem, item: ISearchItem) => boolean;
  // placeholder
  placeholder?: string;
  disabled?: boolean;
}
export interface IMenuFooterItem {
  id: 'confirm' | 'cancel';
  name: string;
  disabled?: boolean;
}
export type SearchItemType = 'text' | 'default' | 'condition';
export class SelectedItem {
  id: string;
  name: string;
  values: ICommonItem[] = [];
  condition: string;
  constructor(public searchItem: ISearchItem, public type: SearchItemType = 'default') {
    this.id = searchItem.id;
    this.name = searchItem.name;
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
  get conditions() {
    return this.searchItem.conditions?.length ? this.searchItem.conditions : undefined;
  }
  get inputInnerHtml() {
    if (this.isSpecialType()) return this.name;
    return `${this.keyInnerHtml}${this.values?.map(item => item.name).join('|') || ''}`;
  }
  get inputInnerText() {
    if (this.isSpecialType()) return this.name;
    return `${this.keyInnerText}${this.values?.map(item => item.name).join('|') || ''}`;
  }
  get keyInnerHtml() {
    if (this.isSpecialType()) return this.name;
    return this.name ? `${this.name}:\u00A0`  : '';
  }
  get keyInnerText() {
    if (this.isSpecialType()) return this.name;
    return this.name ? `${this.name}: `  : '';
  }
  isSpecialType() {
    return ['text', 'condition'].includes(this.type);
  }
  addValue(item: ICommonItem) {
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
  toValue(): ISearchValue {
    const value: ISearchValue = {
      id: this.id,
      name: this.name,
    };
    if (this.values?.length) {
      value.values = this.values.map(item => ({ id: item.id, name: item.name }));
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
