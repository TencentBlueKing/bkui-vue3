
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

import { NODE_ATTRIBUTES } from './constant';
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
            console.log('loopUpdateNodeAttr', attrName, attrValue);
            Object.assign(target, { [attrName]: attrValue });
            loopUpdateNodeAttr(target[NODE_ATTRIBUTES.PARENT_ID], attrName, attrValue, callFn);
          }
        }
      }
    }

    function getUid(item: any) {
      let uid = null;
      if (typeof props.nodeKey === 'string') {
        uid = item[props.nodeKey];
      }

      return uid || item[NODE_ATTRIBUTES.UUID] || uuidv4();
    }

    function getCachedTreeNodeAttr(uuid: string, node: any, attr: string, cachedAttr: string, defVal = undefined) {
      const cached = (cachedSchema || []).find((item: any) => item[NODE_ATTRIBUTES.UUID] === uuid);
      let result = undefined;
      if (cached) {
        result = cached[cachedAttr];
      } else {
        result = node[attr];
      }

      if (result === undefined) {
        result = defVal;
      }
      return result;
    }

    function isCachedTreeNodeOpened(uuid: string, node: any) {
      return getCachedTreeNodeAttr(uuid, node, 'isOpen', NODE_ATTRIBUTES.IS_OPENED, false);
    }

    function isCachedTreeNodeChecked(uuid: string, node: any) {
      return getCachedTreeNodeAttr(uuid, node, 'checked', NODE_ATTRIBUTES.IS_CHECKED, false);
    }

    function isCachedTreeNodeMatch(uuid: string, node: any) {
      return getCachedTreeNodeAttr(uuid, node, 'isMatch', NODE_ATTRIBUTES.IS_MATCH, true);
    }

    function isCachedTreeNodeSelected(uuid: string, node: any) {
      return getCachedTreeNodeAttr(uuid, node, 'isSelected', NODE_ATTRIBUTES.IS_SELECTED, false);
    }

    function isCachedTreeNodeHasCached(uuid: string, node: any) {
      return getCachedTreeNodeAttr(uuid, node, 'cached', NODE_ATTRIBUTES.IS_CACHED, false);
    }

    function isCachedTreeNodeAsync(uuid: string, node: any) {
      return getCachedTreeNodeAttr(uuid, node, 'async', NODE_ATTRIBUTES.IS_ASYNC, false);
    }

    function validateIsOpenLoopFn(target: any) {
      return !target[NODE_ATTRIBUTES.IS_OPENED];
    }

    function flatten(array: Array<any>, depth = 0, parent = null, path = null) {
      const arrLength = array.length;
      for (let i = 0; i < arrLength; i++) {
        const item = array[i];
        if (Array.isArray(item)) {
          flatten(item, depth, parent, path);
        } else {
          if (typeof item === 'object' && item !== null) {
            const uuid = getUid(item);
            const currentPath = path !== null ? `${path}-${i}` : `${i}`;
            const hasChildren = !!(item[children] || []).length;
            const attrs = {
              [NODE_ATTRIBUTES.DEPTH]: depth,
              [NODE_ATTRIBUTES.INDEX]: i,
              [NODE_ATTRIBUTES.UUID]: uuid,
              [NODE_ATTRIBUTES.PARENT_ID]: parent,
              [NODE_ATTRIBUTES.HAS_CHILD]: hasChildren,
              [NODE_ATTRIBUTES.PATH]: currentPath,
              [NODE_ATTRIBUTES.IS_ROOT]: parent === null,
              [NODE_ATTRIBUTES.ORDER]: order,
              [NODE_ATTRIBUTES.IS_SELECTED]: props.selectable ? isCachedTreeNodeSelected(uuid, item) : false,
              [NODE_ATTRIBUTES.IS_MATCH]: isCachedTreeNodeMatch(uuid, item),
              [NODE_ATTRIBUTES.IS_OPENED]: isCachedTreeNodeOpened(uuid, item),
              [NODE_ATTRIBUTES.IS_CHECKED]: isCachedTreeNodeChecked(uuid, item),
              [NODE_ATTRIBUTES.IS_CACHED]: isCachedTreeNodeHasCached(uuid, item),
              [NODE_ATTRIBUTES.IS_ASYNC]: isCachedTreeNodeAsync(uuid, item),
              [children]: null,
            };
            Object.assign(item, { [NODE_ATTRIBUTES.UUID]: uuid });
            schema.set(uuid, attrs);
            order += 1;
            outputData.push({
              ...item,
              [children]: null,
            });

            /**
             * 如果初始化发现当前属性为展开或者选中
             * 此时需要设置当前节点的所有父级节点都为展开状态
             */
            if (attrs[NODE_ATTRIBUTES.IS_OPENED] || attrs[NODE_ATTRIBUTES.IS_SELECTED]) {
              loopUpdateNodeAttr(parent, NODE_ATTRIBUTES.IS_OPENED, true, validateIsOpenLoopFn);
            }

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
     * 监听组件配置Data改变
     */
  watch(() => [props.data], (newData) => {
    const formatData = getFlatdata(props, newData, schemaValues.value);
    flatData.data = formatData[0] as Array<any>;
    flatData.schema = formatData[1] as any;
    if (props.async?.callback && props.async?.deepAutoOpen === 'every') {
      deepAutoOpen();
    }
  }, {
    deep: true,
  });

  /** 如果设置了异步请求 */
  if (props.async?.callback) {
    deepAutoOpen();
  }

  return {
    flatData,
    schemaValues,
    asyncNodeClick,
    deepAutoOpen,
  };
};
