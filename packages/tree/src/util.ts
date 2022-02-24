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

import { v4 as uuidv4 } from 'uuid';
import { TreePropTypes } from './props';

const DEFAULT_LEVLE_LINE = '1px dashed #c3cdd7';

/**
 * 扁平化当前数据
 * @param arrData
 * @returns
 */
export const getFlatdata = (props: TreePropTypes, treeData: Array<any> | undefined = undefined) => {
  const { data, children } = props;
  const outputData = [];
  let order = 0;
  const schema = {};
  function flatten(array: Array<any>, depth = 0, parent = null, path = null) {
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      if (Array.isArray(item)) {
        flatten(item, depth, parent, path);
      } else {
        // 复制当前对象，避免操作源数据，污染传入的Props.data
        const copyItem = { ...item };
        if (typeof copyItem === 'object' && copyItem !== null) {
          const uuid = uuidv4();
          const currentPath = path !== null ? `${path}-${i}` : `${i}`;
          const attrs = {
            __depth: depth,
            __index: i,
            __uuid: uuid,
            __parentId: parent,
            __parentPath: path,
            __hasChild: !!(item[children] || []).length,
            __path: currentPath,
            __isRoot: parent === null,
            __order: order,
            [children]: null,
          };
          Object.assign(copyItem, attrs);
          Object.assign(schema, { [currentPath]: { __isOpen: false, __showLines: 0, __isRoot: parent === null } });
          order += 1;
          outputData.push(copyItem);
          if (Object.prototype.hasOwnProperty.call(item, children)) {
            flatten(item[children], depth + 1, uuid, currentPath);
          }
        }
      }
    }
  }
  flatten(treeData ? treeData : data);
  return [outputData, schema];
};

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
  const levelLine = getPropsOneOfBoolValueWithDefault(props, 'levelLine', item, DEFAULT_LEVLE_LINE, null, ['tree']);
  return {
    '--level-line': levelLine,
    '--lineHeight': `${props.lineHeight}px`,
    '--indent': `${props.indent}px`,
    padding: 0,
  };
};

/**
 * 获取节点样式配置
 * @param item
 * @param props
 * @returns
 */
export const getNodeItemStyle = (item: any, props: TreePropTypes, schema: any = {}) => {
  const { childNodeCount = 0, isLeaf = false, lastNode = null } = schema[item.__path] || {};
  const lastNodeCount = isLeaf ? 0 : (schema[lastNode] || { childNodeCount: 0 }).childNodeCount;
  return {
    '--depth': item.__depth,
    paddingLeft: 0,
    '--lines': childNodeCount - lastNodeCount,
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
export const getNodeItemClass = (item: any, schema: any, props: TreePropTypes) => ({
  'is-root': item.__isRoot,
  'bk-tree-node': true,
  'is-open': schema[item.__path].__isOpen,
  'is-virtual-render': props.virtualRender,
});
