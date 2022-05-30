
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
import { computed, reactive, watch } from 'vue';

import { NODE_ATTRIBUTES, NODE_SOURCE_ATTRS } from './constant';
import { TreePropTypes } from './props';
import useNodeAsync from './use-node-async';

export default (props: TreePropTypes) => {
  /**
 * 扁平化当前数据
 * @param arrData
 * @returns
 */
  const getFlatdata = (props: TreePropTypes, treeData: Array<any> = undefined, cachedSchema: any[] = []) => {
    const { data, children } = props;
    const outputData = [];
    let order = 0;
    const schema = new Map<string, any>();

    function loopUpdateNodeAttr(uuid: string, attrName: string, attrValue: any, callFn: Function) {
      if (uuid === undefined || uuid === null) {
        return;
      }

      if (schema.has(uuid) && !([NODE_ATTRIBUTES.UUID, NODE_ATTRIBUTES.PARENT_ID] as string[]).includes(attrName)) {
        const target = schema.get(uuid);
        if (Object.prototype.hasOwnProperty.call(target, attrName)) {
          if (typeof callFn === 'function' && Reflect.apply(callFn, self, [target, attrName, attrValue])) {
            Object.assign(target, { [attrName]: attrValue });
            loopUpdateNodeAttr(target[NODE_ATTRIBUTES.PARENT_ID], attrName, attrValue, callFn);
          }
        }
      }
    }

    function getUid(item: any) {
      let uid = null;
      if (typeof props.nodeKey === 'string') {
        uid = item[props.nodeKey] || uuidv4();
      }

      return uid || item[NODE_ATTRIBUTES.UUID] || uuidv4();
    }


    const cachedDefaultVal = {
      [NODE_ATTRIBUTES.IS_OPEN]: () => false,
      [NODE_ATTRIBUTES.IS_CHECKED]: () => false,
      [NODE_ATTRIBUTES.IS_MATCH]: () => true,
      [NODE_ATTRIBUTES.IS_SELECTED]: (uuid: string) => props.selected === uuid,
      [NODE_ATTRIBUTES.IS_CACHED]: () => false,
      [NODE_ATTRIBUTES.IS_ASYNC]: () => null,
      [NODE_ATTRIBUTES.IS_LOADING]: () => false,
    };

    function getCachedTreeNodeAttr(uuid: string, node: any, cachedAttr: string, defVal = undefined) {
      let defaultValue = defVal;
      if (defVal === undefined && typeof cachedDefaultVal[cachedAttr] === 'function') {
        defaultValue = cachedDefaultVal[cachedAttr](uuid, node);
      }
      const sourceAttr = NODE_SOURCE_ATTRS[cachedAttr];
      if (Object.prototype.hasOwnProperty.call(node, sourceAttr)) {
        return node[sourceAttr];
      }

      const cached = (cachedSchema || []).find((item: any) => item[NODE_ATTRIBUTES.UUID] === uuid);
      let result = undefined;
      if (cached) {
        result = cached[cachedAttr];
      }

      if (result === undefined || result === null) {
        result = defaultValue;
      }

      return result;
    }

    function isCachedTreeNodeSelected(uuid: string, node: any) {
      if (!props.selectable) {
        return false;
      }

      return getCachedTreeNodeAttr(uuid, node, NODE_ATTRIBUTES.IS_SELECTED, props.selected === uuid);
    }

    function isNodeOpend(uuid, item, parent) {
      const isItemOpened = getCachedTreeNodeAttr(uuid, item, NODE_ATTRIBUTES.IS_OPEN);
      const isParentOpened = schema.has(parent) ? schema.get(parent)?.[NODE_ATTRIBUTES.IS_OPEN] : true;
      return isItemOpened && isParentOpened;
    }

    function validateIsOpenLoopFn(target: any) {
      return !target[NODE_ATTRIBUTES.IS_OPEN];
    }

    function flatten(array: Array<any>, depth = 0, parent = null, path = null) {
      const arrLength = array.length;
      for (let i = 0; i < arrLength; i++) {
        const item = array[i];
        if (Array.isArray(item)) {
          flatten(item, depth, parent, path);
        } else {
          if (typeof item === 'object' && item !== null) {
            const uuid = `${getUid(item)}`;
            const currentPath = path !== null ? `${path}-${i}` : `${i}`;
            const hasChildren = !!(item[children] || []).length;
            /**
             * 当前节点设置是否为展开状态
             */
            let isOpened = getCachedTreeNodeAttr(uuid, item, NODE_ATTRIBUTES.IS_OPEN);

            /**
             * 如果初始化发现当前属性为展开或者选中 & 设置了 autoOpenParentNode = true
             * 此时需要设置当前节点的所有父级节点都为展开状态
             */
            if (props.autoOpenParentNode) {
              isOpened && loopUpdateNodeAttr(parent, NODE_ATTRIBUTES.IS_OPEN, true, validateIsOpenLoopFn);
            } else {
              /**
               * 如果没有设置自动展开所有父级
               * 此时需要判定当前节点是否可以展开状态需要同时判定父级是否展开
               * 如果父级不是展开状态，此节点不能展示，应该也是关闭状态，只有当父级展开时，此节点才为展开状态
               */
              isOpened = isNodeOpend(uuid, item, parent);
            }

            const attrs = {
              [NODE_ATTRIBUTES.DEPTH]: depth,
              [NODE_ATTRIBUTES.INDEX]: i,
              [NODE_ATTRIBUTES.UUID]: uuid,
              [NODE_ATTRIBUTES.PARENT_ID]: parent,
              [NODE_ATTRIBUTES.HAS_CHILD]: hasChildren,
              [NODE_ATTRIBUTES.PATH]: currentPath,
              [NODE_ATTRIBUTES.IS_ROOT]: parent === null,
              [NODE_ATTRIBUTES.ORDER]: order,
              [NODE_ATTRIBUTES.IS_SELECTED]: isCachedTreeNodeSelected(uuid, item),
              [NODE_ATTRIBUTES.IS_MATCH]: getCachedTreeNodeAttr(uuid, item, NODE_ATTRIBUTES.IS_MATCH),
              [NODE_ATTRIBUTES.IS_OPEN]: isOpened,
              [NODE_ATTRIBUTES.IS_CHECKED]: getCachedTreeNodeAttr(uuid, item, NODE_ATTRIBUTES.IS_CHECKED),
              [NODE_ATTRIBUTES.IS_CACHED]: getCachedTreeNodeAttr(uuid, item, NODE_ATTRIBUTES.IS_CACHED),
              [NODE_ATTRIBUTES.IS_ASYNC]: getCachedTreeNodeAttr(uuid, item, NODE_ATTRIBUTES.IS_ASYNC),
              [NODE_ATTRIBUTES.IS_LOADING]: getCachedTreeNodeAttr(uuid, item, NODE_ATTRIBUTES.IS_LOADING),
              [children]: null,
            };
            Object.assign(item, { [NODE_ATTRIBUTES.UUID]: uuid });
            schema.set(uuid, attrs);
            order += 1;
            outputData.push({
              ...item,
              [children]: null,
            });

            if (Object.prototype.hasOwnProperty.call(item, children)) {
              flatten(item[children] || [], depth + 1, uuid, currentPath);
            }
          }
        }
      }
    }
    flatten(treeData ? treeData : data);
    return [outputData, schema];
  };

  const formatData = getFlatdata(props);

  const nextLoopEvents: Map<string, any> = new Map();
  const afterSelectEvents = [];
  const afterSelectWatch = [];

  /**
   * 扁平化数据
   * schema: 需要展示连线时，用于计算连线高度
   */
  const flatData = reactive({
    data: formatData[0] as Array<any>,
    schema: formatData[1],
    levelLineSchema: {},
  });

  const schemaValues = computed(() => Array.from(flatData.schema.values()));

  const { asyncNodeClick, deepAutoOpen } = useNodeAsync(props, flatData);

  /**
   * 抛出缓存函数，用于注册selected watch
   * @param event
   */
  const onSelected = (event: (d: any) => void) => {
    afterSelectEvents.push(event);
  };

  const registerNextLoop = (key: string, event: any, reset = true) => {
    if (reset && nextLoopEvents.has(key)) {
      nextLoopEvents.delete(key);
    }

    nextLoopEvents.set(key, event);
  };


  const resolveEventOption = (event: any) => {
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

  const executeFn = (event: any | null) => {
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
        target.forEach((event: any, index: number) => {
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
  watch(() => [props.data], (newData) => {
    console.log('watch data changed');
    const formatData = getFlatdata(props, newData, schemaValues.value);
    flatData.data = formatData[0] as Array<any>;
    flatData.schema = formatData[1] as any;
    if (props.async?.callback && props.async?.deepAutoOpen === 'every') {
      deepAutoOpen();
    }

    /**
     * 执行缓存下来的周期函数
     * 保证data改变之后执行相关操作
     */
    executeNextEvent();
  }, {
    deep: true,
  });


  if (props.selectable) {
    watch(() => props.selected, (newData) => {
      console.log('watch selected changed');
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
    }, { immediate: true });
  }

  const afterDataUpdate = (callFn: (d: any) => any) => {
    registerNextLoop('afterDataUpdate', callFn);
  };

  /** 如果设置了异步请求 */
  if (props.async?.callback) {
    deepAutoOpen();
  }

  return {
    flatData,
    schemaValues,
    asyncNodeClick,
    deepAutoOpen,
    afterDataUpdate,
    registerNextLoop,
    onSelected,
  };
};
