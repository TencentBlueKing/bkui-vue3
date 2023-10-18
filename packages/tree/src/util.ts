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

import { resolveClassName } from '@bkui-vue/shared';

import { NODE_ATTRIBUTES } from './constant';
import { TreePropTypes } from './props';

const DEFAULT_LEVLE_LINE = '1px dashed #c3cdd7';
export type IFlatData = { data: any[]; schema: WeakMap<Object, any> };

/**
 * 获取配置项可为Bool|String|Function类型，如果为Bool则配置默认值
 * @param props
 * @param key
 * @param item
 * @param defaultTrueValue
 * @param defaultFalseValue
 * @returns
 */
const getPropsOneOfBoolValueWithDefault = (
  props: TreePropTypes,
  key: string,
  item: any = null,
  defaultTrueValue: any = null,
  defaultFalseValue: any = null,
  args: Array<any> = [],
) => {
  const prop = props[key];
  if (typeof prop === 'boolean') {
    return prop ? defaultTrueValue : defaultFalseValue;
  }

  return getStringOrFuncStr(item, props, key, args);
};

/**
 * 处理Props中用户给定的配置项（返回值为String或者Function）
 * @param item 当前渲染数据（当item为Object时，返回当前Object中通过Props指定Key的Value，否则返回Props中指定的值）
 * @param props Props
 * @param key 配置项关键字
 * @param args 其他参数
 * @returns
 */
const getStringOrFuncStr = (item: any, props: TreePropTypes, key: string, args: any[] = []) => {
  const value = props[key];
  if (typeof value === 'string') {
    if (typeof item === 'object' && item !== null) {
      if (!Object.prototype.hasOwnProperty.call(item, value)) {
        console.error(`cannot find node label with key ${value}`);
      }
      return item[value];
    }

    return value;
  }

  if (typeof value === 'function') {
    const txt = value.apply(this, [item, ...args]);
    if (typeof txt === 'string') {
      return txt;
    }
    console.error('props label with function return value is not string, please check and return string');
    return undefined;
  }

  return undefined;
};

/**
 * 获取当前节点显示Label
 * @param item 当前节点
 * @param props Props
 */
export const getLabel = (item: any, props: TreePropTypes) => getStringOrFuncStr(item, props, 'label');

/**
 * 根据Props获取Tree样式设置
 * @param item
 * @param props
 * @returns
 */
export const getTreeStyle = (item: any, props: TreePropTypes) => {
  // 处理Props回调函数，参数 [tree] 表示 levelLine 回调参数第二个，此次渲染请求为Tree外层样式
  const levelLine: any = getPropsOneOfBoolValueWithDefault(props, 'levelLine', item, DEFAULT_LEVLE_LINE, null, [
    'tree',
  ]);
  return {
    '--level-line': levelLine,
    '--lineHeight': `${props.lineHeight}px`,
    '--indent': `${props.indent}px`,
    '--offset-left': `${props.offsetLeft}px`,
  };
};

/**
 * 获取节点样式配置
 * @param item
 * @param props
 * @returns
 */
export const getNodeItemStyle: any = (item: any, props: TreePropTypes, flatData: IFlatData) => {
  const { schema } = flatData;
  const depth = schema.get(item)?.[NODE_ATTRIBUTES.DEPTH];
  return {
    '--depth': depth,
    ...(typeof props.levelLine === 'function'
      ? {
          '--level-line': getPropsOneOfBoolValueWithDefault(props, 'levelLine', item, DEFAULT_LEVLE_LINE, null, [
            'node',
          ]),
        }
      : {}),
  };
};

/**
 * 获取当前渲染节点Class List
 * @param item
 * @returns
 */
export const getNodeItemClass = (item: any, schema: WeakMap<Object, any>, props: TreePropTypes) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { __is_root, __is_open } = schema.get(item) || {};
  return {
    'is-root': __is_root,
    'bk-tree-node': true,
    'is-open': __is_open,
    'is-virtual-render': props.virtualRender,
    'level-line': props.levelLine,
  };
};

/**
 * 获取当前渲染节点Class List
 * @param item
 * @returns
 */
export const getNodeRowClass = (item: any, schema: WeakMap<Object, any>) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { __is_checked, __is_selected } = schema.get(item) || {};
  return {
    'is-checked': __is_checked,
    'is-selected': __is_selected,
    'node-folder': item.is_folder,
    'node-leaf': item.is_leaf,
    [resolveClassName('node-row')]: true,
  };
};

/**
 * 根据路径更新指定节点Child-Data
 * @param path 节点路径
 * @param treeData Tree Data
 * @param childKey Child Key
 * @param nodekey 节点key
 * @param nodeValue 节点值
 */
export const updateTreeNode = (path: string, treeData: any[], childKey: string, nodekey: string, nodeValue: any) => {
  assignTreeNode(path, treeData, childKey, { [nodekey]: nodeValue });
};

/**
 * 根据路径更新指定节点Child-Data
 * @param path 节点路径
 * @param treeData Tree Data
 * @param childKey Child Key
 * @param assignVal value
 */
export const assignTreeNode = (path: string, treeData: any[], childKey: string, assignVal: any) => {
  const paths = path.split('-');
  const targetNode = paths.reduce((pre: any, nodeIndex: string) => {
    const index = Number(nodeIndex);
    return Array.isArray(pre) ? pre[index] : pre[childKey][index];
  }, treeData);

  Object.assign(targetNode, assignVal || {});
};

export const resolveNodeItem = (node: any) => {
  if (node === undefined || node === null) {
    return { __IS_NULL: true };
  }

  return node;
};

export const resolvePropIsMatched = (node, prop, id) => {
  if (Array.isArray(prop)) {
    return prop.some(item => resolvePropIsMatched(node, item, id));
  }

  if (typeof prop === 'string' || typeof prop === 'number') {
    return prop === id;
  }

  return node === prop;
};
