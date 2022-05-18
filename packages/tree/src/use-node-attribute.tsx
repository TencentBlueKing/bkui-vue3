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

import { NODE_ATTRIBUTES, NODE_SOURCE_ATTRS } from './constant';
import { TreePropTypes } from './props';

export default (flatData, props?: TreePropTypes) => {
  /**
   * 获取Schema中指定的对象值
   * @param key
   * @returns
   */
  const getSchemaVal = (key: string) => ((flatData.schema as Map<string, any>).get(key));

  /**
   * 获取节点属性
   * @param node 当前节点
   * @param attr 节点属性
   * @returns
   */
  const getNodeAttr = (node: any, attr: string) => getSchemaVal(node[NODE_ATTRIBUTES.UUID])?.[attr];

  /**
   * 设置节点属性
   * @param node 指定节点
   * @param attr 节点属性
   * @param val 属性值
   * @returns
   */
  const setNodeAttr = (node: any, attr: string, val: any) => {
    (flatData.schema as Map<string, any>)
      .set(node[NODE_ATTRIBUTES.UUID], {
        ...getSchemaVal(node[NODE_ATTRIBUTES.UUID]),
        [attr]: val,
      });
  };

  const getNodePath = (node: any) => getNodeAttr(node, NODE_ATTRIBUTES.PATH);
  const getNodeId = (node: any) => getNodeAttr(node, NODE_ATTRIBUTES.UUID);
  const isRootNode = (node: any) => getNodeAttr(node, NODE_ATTRIBUTES.IS_ROOT);
  const isNodeOpened = (node: any) => getNodeAttr(node, NODE_ATTRIBUTES.IS_OPEN);
  const hasChildNode = (node: any) => getNodeAttr(node, NODE_ATTRIBUTES.HAS_CHILD);
  const isNodeMatched = (node: any) => getNodeAttr(node, NODE_ATTRIBUTES.IS_MATCH);
  const isNodeChecked = (node: any) => getNodeAttr(node, NODE_ATTRIBUTES.IS_CHECKED);
  const getNodeParentId = (node: any) => getNodeAttr(node, NODE_ATTRIBUTES.PARENT_ID);
  const getNodeParentIdById = (id: string) => getNodeAttr({ [NODE_ATTRIBUTES.UUID]: id }, NODE_ATTRIBUTES.PARENT_ID);
  const isNodeLoading = (node: any) => getNodeAttr(node, NODE_ATTRIBUTES.IS_LOADING);

  const setTreeNodeLoading = (node: any, value: boolean) => {
    setNodeAttr(node, NODE_ATTRIBUTES.IS_LOADING, value);
  };

  const deleteNodeSchema = (id: string) => (flatData.schema as Map<string, any>).delete(id);

  /**
   * 判定指定节点是否为展开状态
   * @param item 节点或者节点 UUID
   * @returns
   */
  const isItemOpen = (item: any) => {
    if (typeof item === 'object') {
      return isNodeOpened(item);
    }

    if (typeof item === 'string') {
      return getSchemaVal(item)?.[NODE_ATTRIBUTES.IS_OPEN];
    }

    return false;
  };

  /**
   * 过滤当前状态为Open的节点
   * 页面展示只会展示Open的节点
   * @param item
   * @returns
   */
  const checkNodeIsOpen = (node: any) => isRootNode(node)
    || isItemOpen(node)
    || isItemOpen(getNodeAttr(node, NODE_ATTRIBUTES.PARENT_ID));

  /**
     * 根据节点path返回源数据中节点信息
     * @param path
     * @returns
     */
  const getSourceNodeByPath = (path: string) => {
    const paths = path.split('-');

    return  paths.reduce((pre: any, nodeIndex: string) => {
      const index = Number(nodeIndex);
      return  Array.isArray(pre) ? pre[index] : pre[props.children][index];
    }, props.data);
  };

  const getSourceNodeByUID = (uid: string) => getSourceNodeByPath(getNodePath({ [NODE_ATTRIBUTES.UUID]: uid }));

  const getParentNodeData = (uid: string) => {
    if (isRootNode({ [NODE_ATTRIBUTES.UUID]: uid })) {
      return { [props.children]: props.data };
    }

    return getSourceNodeByUID(getNodeParentIdById(uid));
  };

  /**
   * 处理scoped slot 透传数据
   * @param item 当前节点数据
   * @returns
   */
  const resolveScopedSlotParam = (item: any) => ({
    [NODE_SOURCE_ATTRS[NODE_ATTRIBUTES.IS_LOADING]]: getNodeAttr(item, NODE_ATTRIBUTES.IS_LOADING),
    [NODE_SOURCE_ATTRS[NODE_ATTRIBUTES.HAS_CHILD]]: hasChildNode(item),
    [NODE_SOURCE_ATTRS[NODE_ATTRIBUTES.IS_MATCH]]: isNodeMatched(item),
    [NODE_SOURCE_ATTRS[NODE_ATTRIBUTES.IS_CHECKED]]: isNodeChecked(item),
    [NODE_SOURCE_ATTRS[NODE_ATTRIBUTES.IS_OPEN]]: isNodeOpened(item),
    [NODE_SOURCE_ATTRS[NODE_ATTRIBUTES.IS_ROOT]]: isRootNode(item),
    fullPath: getNodeAttr(item, NODE_ATTRIBUTES.PATH),
    uuid: getNodeId(item),
    parentId: getNodeAttr(item, NODE_ATTRIBUTES.PARENT_ID),
  });

  const extendNodeAttr = (item: any) => ({
    ...item,
    [NODE_ATTRIBUTES.TREE_NODE_ATTR]: resolveScopedSlotParam(item),
  });

  return {
    getSchemaVal,
    getNodeAttr,
    getNodeId,
    getNodeParentId,
    getNodeParentIdById,
    getParentNodeData,
    setNodeAttr,
    getNodePath,
    isRootNode,
    isNodeOpened,
    hasChildNode,
    isItemOpen,
    isNodeChecked,
    isNodeMatched,
    isNodeLoading,
    checkNodeIsOpen,
    getSourceNodeByPath,
    getSourceNodeByUID,
    deleteNodeSchema,
    resolveScopedSlotParam,
    setTreeNodeLoading,
    extendNodeAttr,
  };
};
