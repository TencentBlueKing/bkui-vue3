/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2025 Tencent.  All rights reserved.
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

import { markRaw, onMounted, shallowReactive, toRaw, watch } from 'vue';

import { v4 as uuidv4 } from 'uuid';

import { NODE_ATTRIBUTES, NODE_SOURCE_ATTRS } from './constant';
import { TreeNode, TreePropTypes } from './props';
import useNodeAsync from './use-node-async';
import { resolvePropIsMatched, showCheckbox } from './util';

const toRawStore = <T extends object>(value: T): T => markRaw(value);

const SOURCE_IS_OPEN = NODE_SOURCE_ATTRS[NODE_ATTRIBUTES.IS_OPEN];
const SOURCE_IS_CHECKED = NODE_SOURCE_ATTRS[NODE_ATTRIBUTES.IS_CHECKED];
const SOURCE_IS_SELECTED = NODE_SOURCE_ATTRS[NODE_ATTRIBUTES.IS_SELECTED];
const SOURCE_IS_ASYNC = NODE_SOURCE_ATTRS[NODE_ATTRIBUTES.IS_ASYNC];
const SOURCE_IS_MATCH = NODE_SOURCE_ATTRS[NODE_ATTRIBUTES.IS_MATCH];
const SOURCE_IS_CACHED = NODE_SOURCE_ATTRS[NODE_ATTRIBUTES.IS_CACHED];
const SOURCE_IS_LOADING = NODE_SOURCE_ATTRS[NODE_ATTRIBUTES.IS_LOADING];

export default (props: TreePropTypes) => {
  /**
   * 扁平化当前数据
   * @param treeData 树形结构数据
   * @param cachedSchema 缓存数据
   * @returns
   */
  const getFlatdata = (
    treeData: Array<TreeNode> = undefined,
    cachedSchema: WeakMap<TreeNode, Record<string, unknown>> = null,
  ) => {
    const { data, children } = props;
    const checkedList = [];
    const outputData = [];
    let order = 0;
    let openCount = 0;
    const treeSchema = new WeakMap();
    const nodeMap = new Map<string, TreeNode>();
    const childMap = new WeakMap<TreeNode, TreeNode[]>();
    const rootNodes: TreeNode[] = [];

    /**
     * 递归更新节点属性
     * @param node 当前节点
     * @param attrName 需要更新的节点属性名称
     * @param attrValue 需要更新的节点属性值
     * @param callFn 回调函数
     * @returns
     */
    function loopUpdateNodeAttr(
      node: TreeNode,
      attrName: string,
      attrValue: Record<string, unknown> | boolean | number | string,
      callFn: (...args) => boolean,
    ) {
      if (node === undefined || node === null) {
        return;
      }

      if (treeSchema.has(node)) {
        const target = treeSchema.get(node);
        if (Object.prototype.hasOwnProperty.call(target, attrName)) {
          if (typeof callFn === 'function' && Reflect.apply(callFn, self, [target, attrName, attrValue, node])) {
            if (target[attrName] === attrValue) {
              return;
            }

            if (attrName === NODE_ATTRIBUTES.IS_OPEN) {
              const prevOpen = !!target[attrName];
              const nextOpen = !!attrValue;
              if (prevOpen !== nextOpen) {
                openCount += nextOpen ? 1 : -1;
              }
            }

            target[attrName] = attrValue;
            loopUpdateNodeAttr(target[NODE_ATTRIBUTES.PARENT], attrName, attrValue, callFn);
          }
        }
      }
    }

    const nodeKey = props.nodeKey;
    const expandAll = !!props.expandAll;
    const autoOpenParentNode = !!props.autoOpenParentNode;
    const selectable = !!props.selectable;
    const hasCheckedProp = props.checked !== undefined && props.checked !== null && props.checked !== false;
    const hasSelectedProp = props.selected !== undefined && props.selected !== null && props.selected !== false;
    const checkboxEnabled = props.showCheckbox !== false && !!props.showCheckbox;
    const useCache = !!cachedSchema;

    function getUid(item: TreeNode) {
      if (typeof nodeKey === 'string') {
        const keyVal = item[nodeKey];
        if (keyVal !== undefined && keyVal !== null && keyVal !== '') {
          return keyVal;
        }
      }
      return item[NODE_ATTRIBUTES.UUID] || uuidv4();
    }

    function resolveAttr(node: TreeNode, sourceAttr: string, cachedAttr: string, defaultValue: unknown) {
      if (sourceAttr in node) {
        return node[sourceAttr];
      }
      if (useCache) {
        const cached = cachedSchema.get(node);
        if (cached) {
          const cachedVal = cached[cachedAttr];
          if (cachedVal !== undefined && cachedVal !== null) {
            return cachedVal;
          }
        }
      }
      return defaultValue;
    }

    function validateIsOpenLoopFn(targetAttr: Record<string, unknown>) {
      return !(targetAttr?.[NODE_ATTRIBUTES.IS_OPEN] ?? false);
    }

    function loopUpdateCheckedEvent(target, _attrName, _attrValue, node) {
      target[NODE_ATTRIBUTES.IS_INDETERMINATE] = (node[children] || []).some(
        child => !(treeSchema.get(child)?.[NODE_ATTRIBUTES.IS_CHECKED] ?? false),
      );
      return true;
    }

    function flatten(array: Array<TreeNode>, depth = 0, parent = null, path = null) {
      const arrLength = array.length;
      for (let i = 0; i < arrLength; i++) {
        const item = array[i];
        if (item === null || item === undefined) {
          continue;
        }
        if (Array.isArray(item)) {
          flatten(item, depth, parent, path);
          continue;
        }
        if (typeof item !== 'object') {
          continue;
        }

        // 统一用 raw 作为 WeakMap key，避免 Proxy/raw 不一致导致 schema 全量失效
        const rawItem = toRaw(item) as TreeNode;
        const currentPath = path !== null ? `${path}-${i}` : `${i}`;
        const uuid = `${getUid(rawItem)}`;
        const childList = rawItem[children] as TreeNode[] | undefined;
        const hasChildren = !!(childList && childList.length);
        if (!nodeKey) {
          rawItem[NODE_ATTRIBUTES.UUID] = uuid;
        }

        let isOpened = !!resolveAttr(rawItem, SOURCE_IS_OPEN, NODE_ATTRIBUTES.IS_OPEN, expandAll);
        if (autoOpenParentNode) {
          if (isOpened && parent) {
            loopUpdateNodeAttr(parent, NODE_ATTRIBUTES.IS_OPEN, true, validateIsOpenLoopFn);
          }
        } else if (parent) {
          const parentOpened = !!treeSchema.get(parent)?.[NODE_ATTRIBUTES.IS_OPEN];
          isOpened = isOpened && parentOpened;
        }

        let isSelected = false;
        if (selectable) {
          const selectedDefault = hasSelectedProp ? resolvePropIsMatched(rawItem, props.selected, uuid) : false;
          isSelected = !!resolveAttr(rawItem, SOURCE_IS_SELECTED, NODE_ATTRIBUTES.IS_SELECTED, selectedDefault);
        }

        let isChecked = false;
        if (checkboxEnabled) {
          const canCheck = showCheckbox(props, { data: rawItem });
          if (canCheck) {
            const checkedDefault = hasCheckedProp ? resolvePropIsMatched(rawItem, props.checked, uuid) : false;
            isChecked = !!resolveAttr(rawItem, SOURCE_IS_CHECKED, NODE_ATTRIBUTES.IS_CHECKED, checkedDefault);
          }
        }

        const attributes = {
          [NODE_ATTRIBUTES.DEPTH]: depth,
          [NODE_ATTRIBUTES.INDEX]: order,
          [NODE_ATTRIBUTES.UUID]: uuid,
          [NODE_ATTRIBUTES.PARENT]: parent,
          [NODE_ATTRIBUTES.HAS_CHILD]: hasChildren,
          [NODE_ATTRIBUTES.PATH]: currentPath,
          [NODE_ATTRIBUTES.IS_ROOT]: parent === null,
          [NODE_ATTRIBUTES.ORDER]: order,
          [NODE_ATTRIBUTES.IS_SELECTED]: isSelected,
          [NODE_ATTRIBUTES.IS_MATCH]: !!resolveAttr(rawItem, SOURCE_IS_MATCH, NODE_ATTRIBUTES.IS_MATCH, false),
          [NODE_ATTRIBUTES.IS_OPEN]: isOpened,
          [NODE_ATTRIBUTES.IS_CHECKED]: isChecked,
          [NODE_ATTRIBUTES.IS_CACHED]: !!resolveAttr(rawItem, SOURCE_IS_CACHED, NODE_ATTRIBUTES.IS_CACHED, false),
          [NODE_ATTRIBUTES.IS_ASYNC]: resolveAttr(rawItem, SOURCE_IS_ASYNC, NODE_ATTRIBUTES.IS_ASYNC, null),
          [NODE_ATTRIBUTES.IS_LOADING]: !!resolveAttr(rawItem, SOURCE_IS_LOADING, NODE_ATTRIBUTES.IS_LOADING, false),
          [NODE_ATTRIBUTES.IS_INDETERMINATE]: false,
        };

        if (isChecked) {
          checkedList.push(rawItem);
        }
        if (isOpened) {
          openCount += 1;
        }

        treeSchema.set(rawItem, attributes);
        nodeMap.set(uuid, rawItem);
        if (parent === null) {
          rootNodes.push(rawItem);
        } else {
          let siblings = childMap.get(parent);
          if (!siblings) {
            siblings = [];
            childMap.set(parent, siblings);
          }
          siblings.push(rawItem);
        }
        outputData.push(rawItem);
        order += 1;

        if (hasChildren) {
          flatten(childList, depth + 1, rawItem, currentPath);
        }
      }
    }

    flatten(treeData ?? data);
    if (checkboxEnabled && props.checkStrictly) {
      checkedList.forEach(value => {
        loopUpdateNodeAttr(value, NODE_ATTRIBUTES.IS_CHECKED, true, loopUpdateCheckedEvent);
      });
    }
    return [outputData, treeSchema, nodeMap, childMap, rootNodes, openCount, checkedList];
  };

  const formatData = getFlatdata();

  const nextLoopEvents: Map<string, (...args) => void> = new Map();
  const afterSelectEvents = [];
  const afterSelectWatch = [];

  /**
   * 扁平化数据
   * shallowReactive：只跟踪 data/rootNodes 等字段替换，避免百万节点被深代理
   * schema/nodeMap/childMap 使用 markRaw，避免 WeakMap get/set 进入依赖收集
   */
  const flatData = shallowReactive({
    data: formatData[0] as Array<TreeNode>,
    schema: toRawStore(formatData[1] as WeakMap<TreeNode, Record<string, unknown>>),
    nodeMap: toRawStore(formatData[2] as Map<string, TreeNode>),
    childMap: toRawStore(formatData[3] as WeakMap<TreeNode, TreeNode[]>),
    rootNodes: formatData[4] as TreeNode[],
    openCount: (formatData[5] as number) || 0,
    checkedList: (formatData[6] as TreeNode[]) || [],
    levelLineSchema: {},
  });

  const { asyncNodeClick, deepAutoOpen } = useNodeAsync(props, flatData);

  /**
   * 抛出缓存函数，用于注册selected watch
   * @param event
   */
  const onSelected = (event: (d) => void) => {
    afterSelectEvents.push(event);
  };

  const registerNextLoop = (key: string, event, reset = true) => {
    if (reset && nextLoopEvents.has(key)) {
      nextLoopEvents.delete(key);
    }

    nextLoopEvents.set(key, event);
  };

  const resolveEventOption = event => {
    if (typeof event === 'function') {
      return {
        type: 'loop',
        fn: event,
      };
    }

    if (typeof event === 'object' && typeof event.type === 'string' && typeof event.fn === 'function') {
      return event;
    }

    console.error('loop event error', event);
    return null;
  };

  const executeFn = event => {
    const resoveEvent = resolveEventOption(event);
    if (resoveEvent !== null) {
      Reflect.apply(resoveEvent.fn, this, []);
    }

    return resoveEvent?.type ?? 'once';
  };

  const executeNextEvent = () => {
    Array.from(nextLoopEvents.keys()).forEach((key: string) => {
      const target = nextLoopEvents.get(key);
      if (Array.isArray(target)) {
        const clearList = [];
        target.forEach((event, index: number) => {
          const result = executeFn(event);
          if (result === 'once') {
            clearList.unshift(index);
          }
        });

        if (clearList.length) {
          clearList.forEach((index: number) => target.splice(index, 1));
        }

        if (target.length === 0) {
          nextLoopEvents.delete(key);
        }
      } else {
        const result = executeFn(target);
        if (result === 'once') {
          nextLoopEvents.delete(key);
        }
      }
    });
  };

  /**
   * 监听组件配置Data改变
   */
  const afterRebuildCallbacks: Array<() => void> = [];
  const onAfterRebuild = (callback: () => void) => {
    afterRebuildCallbacks.push(callback);
  };

  const rebuildData = (treeData: TreeNode[], cachedSchema = flatData.schema) => {
    const next = getFlatdata(treeData, cachedSchema);
    // 先替换 schema/maps，再替换 data，避免 data watcher 读到旧 schema
    flatData.schema = toRawStore(next[1] as WeakMap<TreeNode, Record<string, unknown>>);
    flatData.nodeMap = toRawStore(next[2] as Map<string, TreeNode>);
    flatData.childMap = toRawStore(next[3] as WeakMap<TreeNode, TreeNode[]>);
    flatData.rootNodes = next[4] as TreeNode[];
    flatData.openCount = (next[5] as number) || 0;
    flatData.checkedList = (next[6] as TreeNode[]) || [];
    flatData.data = next[0] as Array<TreeNode>;
    afterRebuildCallbacks.forEach(callback => callback());
  };

  // watchDataDeep=false（默认）：仅监听 data 引用变化，大数据量友好
  // watchDataDeep=true：深度监听原地变更；百万节点下会明显变慢，仅建议小数据使用
  // 组件内部拖拽/异步仍走 onTreeDataChange → rebuildData
  watch(
    () => props.data,
    newData => {
      rebuildData(newData as TreeNode[], flatData.schema);
      if (props.async?.callback && props.async?.deepAutoOpen === 'every') {
        deepAutoOpen();
      }
      executeNextEvent();
    },
    {
      deep: !!props.watchDataDeep,
    },
  );

  if (props.selectable) {
    onMounted(() => {
      watch(
        () => props.selected,
        newData => {
          // console.log('watch selected changed');
          afterSelectWatch.length = 0;
          afterSelectEvents.forEach((event: () => void) => {
            Reflect.apply(event, this, [newData]);

            /**
             * selected设置生效有可能会在props.data 改变之前
             * 此时需要缓存当前执行函数，保证在watch data change 之后执行
             */
            afterSelectWatch.push(() => Reflect.apply(event, this, [newData]));
          });
          registerNextLoop('afterSelectWatch', afterSelectWatch);
        },
        { immediate: true },
      );
    });
  }

  const afterDataUpdate = (callFn: (d) => void) => {
    registerNextLoop('afterDataUpdate', callFn);
  };

  /** 如果设置了异步请求 */
  if (props.async?.callback) {
    deepAutoOpen();
  }

  return {
    flatData,
    asyncNodeClick,
    deepAutoOpen,
    afterDataUpdate,
    registerNextLoop,
    rebuildData,
    onAfterRebuild,
    onSelected,
  };
};
