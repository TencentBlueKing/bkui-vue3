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
import { arrayEqual, filterProperty } from '@bkui-vue/shared';

import { INode } from './interface';
import Node from './node';

const flatNodes = (data, leafOnly) => data.reduce((acc: INode[], node: INode) => {
  if (node.isLeaf) {
    acc.push(node);
  } else {
    !leafOnly && acc.push(node);
    // eslint-disable-next-line no-param-reassign
    acc = acc.concat(flatNodes(node.children, leafOnly));
  }
  return acc;
}, []);

class Store {
  constructor(props) {
    const { list } = props;
    this.data = list;
    this.config = filterProperty(props, ['list']);
    this.nodes = this.data.map(node => new Node(node, this.config));
  }

  getFlattedNodes(leafOnly = false) {
    return flatNodes(this.nodes, leafOnly);
  }

  getNodes() {
    return this.nodes;
  }

  getNodeByValue(value: string[]): INode {
    const nodes = this.getFlattedNodes().filter((node: INode) => arrayEqual(node.path, value));
    return nodes[0] ?? null;
  }
}

export default Store;
