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

import { capitalize } from '@bkui-vue/shared';

import { IConfig, IData, INode } from './interface';;

/** 除了节点本身的disabled，如果父级是disabled，直接点也必须是disabled */
function isNodeDisabled(node: INode) {
  if (node.data.disabled) {
    return true;
  } if (node.level !== 1) {
    return isNodeDisabled(node.parent);
  }
  return node.data.disabled;
}

class Node implements INode {
  data: IData;
  config: IConfig;
  parent: INode;
  level: number;
  id: string;
  name: string;
  loading: boolean;
  loaded: boolean;
  checked: boolean;
  isIndeterminate: boolean; // 是否是半选状态
  children?: null[];
  leaf: boolean;
  pathNodes: INode[];
  path: string[];
  pathNames: string[];
  nodes: INode[];

  constructor(node: IData, config: any, parent?: any) {
    this.data = node;
    this.config = config;
    this.parent = parent || null;
    this.leaf = node.leaf;
    this.level = !this.parent ? 1 : this.parent.level + 1;

    this.initState();
  }

  initState() {
    const { idKey, nameKey, childrenKey } = this.config;
    this.id = this.data[idKey];
    this.name = this.data[nameKey];

    this.loading = false;
    this.loaded = false;
    this.checked = false;

    const childrenData = this.data[childrenKey];
    this.children = (childrenData || []).map(child => new Node(child, this.config, this));

    this.pathNodes = this.calculateNodesPath();
    this.path = this.pathNodes.map(node => node.id);
    this.pathNames = this.pathNodes.map(node => node.name);
  }

  get isLeaf() {
    if (this.config.isRemote) {
      const isLeaf = this.leaf || (this.loaded ? !this.children.length : false);
      return isLeaf;
    }
    return !(Array.isArray(this.children) && this.children?.length !== 0);
  }

  get isDisabled() {
    return isNodeDisabled(this);
  }

  broadcast(event: string, checkStatus: boolean) {
    const handlerName = `onParent${capitalize(event)}`;

    this.children.forEach((child: INode) => {
      if (child) {
        // bottom up
        child.broadcast(event, checkStatus);
        child[handlerName]?.(checkStatus);
      }
    });
  }

  emit(event: string) {
    const { parent } = this;
    const handlerName = `onChild${capitalize(event)}`;
    if (parent) {
      parent[handlerName]?.();
      parent.emit(event);
    }
  }

  onParentCheck(checked: boolean) {
    if (!this.isDisabled) {
      this.setCheckState(checked);
    }
  }

  onChildCheck() {
    const { children } = this;
    const validChildren = children.filter((child: INode) => !child.isDisabled);
    const checked = validChildren.length
      ? validChildren.every((child: INode) => child.checked)
      : false;

    this.setCheckState(checked);
  }

  setCheckState(checked: boolean) {
    const totalNum = this.children.length;
    const checkedNum = this.children.reduce((c: number, p: INode) => {
      const tempNum = p.isIndeterminate ? 0.5 : 0;
      const num = p.checked ? 1 : tempNum;
      return c + num;
    }, 0);

    this.checked = checked;
    this.isIndeterminate = checkedNum !== totalNum && checkedNum > 0;
  }

  setNodeCheck(status: boolean) {
    if (this.checked !== status) {
      if (this.config.checkAnyLevel) {
        this.checked = status;
        return;
      }
      this.broadcast('check', status);
      this.setCheckState(status);
      this.emit('check');
    }
  }

  calculateNodesPath() {
    const nodes: INode[] = [this];
    let { parent } = this;
    while (parent) {
      nodes.unshift(parent);
      parent = parent.parent;
    }

    return nodes;
  }
}

export default Node;
