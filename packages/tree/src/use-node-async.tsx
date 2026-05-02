/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2025 Tencent.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) is licensed under the MIT License.
 */
import { EVENTS, NODE_ATTRIBUTES, NODE_SOURCE_ATTRS } from './constant';
import { TreeDataChangePayload, TreeNode } from './props';
import useNodeAttribute from './use-node-attribute';
import { cloneTreeData, mutateTreeById } from './util';

export type UseNodeAsyncOptions = {
  getTreeData?: () => TreeNode[];
  onTreeDataChange?: (payload: TreeDataChangePayload) => void;
};

export default (props, flatData, ctx?, options: UseNodeAsyncOptions = {}) => {
  const { setNodeAttr, getNodeId, getNodePath, getNodeAttr, resolveScopedSlotParam, setTreeNodeLoading } =
    useNodeAttribute(flatData, props);
  const requestVersionMap = new Map<string, number>();

  const emitTreeDataChange = (payload: TreeDataChangePayload) => {
    options.onTreeDataChange?.(payload);
    ctx?.emit(EVENTS.NODE_ASYNC_LOAD, payload);
  };

  const setNodeRemoteLoad = (resp: Record<string, unknown>, item: TreeNode, requestVersion?: number) => {
    if (typeof resp === 'object' && resp !== null) {
      const nodeId = getNodeId(item);
      if (requestVersion !== undefined && requestVersionMap.get(nodeId) !== requestVersion) {
        return Promise.resolve(resp);
      }

      setNodeAttr(item, NODE_ATTRIBUTES.IS_OPEN, true);
      const nodeValue = Array.isArray(resp) ? resp : [resp];
      if (!options.onTreeDataChange) {
        mutateTreeById(props.data, nodeId, props.nodeKey || NODE_ATTRIBUTES.UUID, props.children, targetNode => {
          targetNode[props.children] = nodeValue;
        });
        if (!props.nodeKey && getNodePath(item)) {
          // nodeKey 缺失时保留旧版按 path 写入的兜底行为。
          const paths = `${getNodePath(item)}`.split('-');
          const targetNode = paths.reduce((pre: TreeNode | TreeNode[], nodeIndex: string) => {
            const index = Number(nodeIndex);
            return Array.isArray(pre) ? pre[index] : pre[props.children][index];
          }, props.data);
          Object.assign(targetNode, { [props.children]: nodeValue });
        }
        return Promise.resolve(resp);
      }

      const nextTreeData = cloneTreeData(options.getTreeData?.() ?? props.data, props.children);
      mutateTreeById(nextTreeData, nodeId, props.nodeKey || NODE_ATTRIBUTES.UUID, props.children, targetNode => {
        targetNode[props.children] = nodeValue;
      });

      emitTreeDataChange({
        trigger: 'async',
        data: nextTreeData,
        node: item,
        parentNode: item,
      });
      return Promise.resolve(resp);
    }

    return Promise.resolve(resp);
  };

  const asyncNodeClick = (item: TreeNode) => {
    const { callback = null, cache = true } = props.async || {};
    if (typeof callback === 'function' && getNodeAttr(item, NODE_ATTRIBUTES.IS_ASYNC)) {
      const nodeId = getNodeId(item);
      const requestVersion = (requestVersionMap.get(nodeId) || 0) + 1;
      requestVersionMap.set(nodeId, requestVersion);

      setNodeAttr(item, NODE_ATTRIBUTES.IS_ASYNC_INIT, true);
      if (!getNodeAttr(item, NODE_ATTRIBUTES.IS_CACHED)) {
        setNodeAttr(item, NODE_ATTRIBUTES.IS_CACHED, cache);
        const dataAttr = resolveScopedSlotParam(item);
        const callbackResult = callback(
          item,
          (resp: Record<string, unknown>) => setNodeRemoteLoad(resp, item, requestVersion),
          dataAttr,
        );

        if (typeof callbackResult === 'object' && callbackResult !== null) {
          setTreeNodeLoading(item, true);
          if (callbackResult instanceof Promise) {
            return Promise.resolve(
              callbackResult
                .then((resp: Record<string, unknown>) => setNodeRemoteLoad(resp, item, requestVersion))
                .catch((error: Record<string, unknown>) => {
                  if (requestVersionMap.get(nodeId) === requestVersion) {
                    ctx?.emit(EVENTS.NODE_ASYNC_LOAD_ERROR, { node: item, error, requestVersion });
                  }
                  return false;
                })
                .finally(() => {
                  if (requestVersionMap.get(nodeId) === requestVersion) {
                    setTreeNodeLoading(item, false);
                    setNodeAttr(item, NODE_ATTRIBUTES.IS_CACHED, true);
                  }
                }),
            );
          }

          setNodeRemoteLoad(callbackResult, item, requestVersion);
          setTreeNodeLoading(item, false);
          return Promise.resolve(true);
        }
      }
      return Promise.resolve(true);
    }

    return Promise.resolve(true);
  };

  const deepAutoOpen = () => {
    const autoOpenNodes = flatData.data.filter(
      (item: TreeNode) =>
        getNodeAttr(item, NODE_ATTRIBUTES.IS_ASYNC) &&
        item[NODE_SOURCE_ATTRS[NODE_ATTRIBUTES.IS_OPEN]] &&
        !getNodeAttr(item, NODE_ATTRIBUTES.IS_ASYNC_INIT),
    );

    if (autoOpenNodes.length) {
      Promise.all(autoOpenNodes.map(item => asyncNodeClick(item)))
        .then(() => {
          deepAutoOpen();
        })
        .catch(err => {
          console.warn(err);
        });
    }
  };

  return {
    asyncNodeClick,
    deepAutoOpen,
  };
};
