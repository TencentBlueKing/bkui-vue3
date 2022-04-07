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

import { IPanel } from './interface';
class Node {
  constructor(node: IPanel, config: any, parent: any) {
    this.data = node;
    this.config = config;
    this.parent = parent || null;
    this.level = !this.parent ? 1 : this.parent.level + 1;

    this.initState(parent);
  }

  initState() {
    const { idKey, nameKey, childrenKey } = this.config;
    this.id = this.data[idKey];
    this.name = this.data[nameKey];

    this.loading = false;
    this.checked = false;

    const childrenData = this.data[childrenKey];
    this.children = (childrenData || []).map(child => new Node(child, this.config, this));
    this.hasChildren = this.children?.length !== 0;

    this.calculateNodesPath();
  }

  get isLeaf() {
    return !this.hasChildren;
  }

  get isDisabled() {
    return this.data.disabled;
  }

  setNodeCheck(status: boolean) {
    this.checked = status;
  }

  calculateNodesPath() {
    const path = [this.id];
    let { parent } = this;
    while (parent) {
      path.unshift(parent.id);
      parent = parent.parent;
    }
    this.path = path;
  }
}

export default Node;
