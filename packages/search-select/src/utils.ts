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
export interface ICommonItem {
  id: string;
  name: string;
}

export interface ISearchValue extends ICommonItem {
  values: ICommonItem[];
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
}

export type SearchItemType = 'text' | 'default';
export class SeletedItem {
  id: string;
  name: string;
  values: ICommonItem[] = [];
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
  get inputInnerHtml() {
    if (this.type === 'text') return this.name;
    return `${this.keyInnerHtml}${this.values?.map(item => item.name).join('|') || ''}`;
  }
  get inputInnerText() {
    if (this.type === 'text') return this.name;
    return `${this.keyInnerText}${this.values?.map(item => item.name).join('|') || ''}`;
  }
  get keyInnerHtml() {
    if (this.type === 'text') return this.name;
    return this.name ? `${this.name}:&nbsp;`  : '';
  }
  get keyInnerText() {
    if (this.type === 'text') return this.name;
    return this.keyInnerHtml.replace(/&nbsp;/gmi, ' ');
  }

  addValue(item: ICommonItem) {
    this.values.push(item);
  }
  updateValue(item: ICommonItem) {
    if (this.multiple) {
      const index = this.values.findIndex(val => val.id === item.id);
      if (index > -1) {
        this.values.splice(index, 1);
        return;
      }
    }
    this.addValue(item);
  }
}
