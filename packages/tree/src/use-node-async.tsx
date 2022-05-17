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
import { NODE_ATTRIBUTES } from './constant';
import useNodeAttribute from './use-node-attribute';
import { updateTreeNode } from './util';;
export default (props, flatData) => {
  const {
    setNodeAttr,
    getNodePath,
    getNodeAttr,
    isNodeOpened,
    resolveScopedSlotParam,
    setTreeNodeLoading,
  } = useNodeAttribute(flatData, props);

  /**
     * 处理异步加载节点数据返回结果
     * @param resp 异步请求返回结果
     * @param item 当前节点
     */
  const setNodeRemoteLoad = (resp: any, item: any) => {
    if (typeof resp === 'object' && resp !== null) {
      setNodeAttr(item, NODE_ATTRIBUTES.IS_OPENED, true);
      const nodeValue = Array.isArray(resp) ? resp : [resp];
      updateTreeNode(getNodePath(item), props.data, props.children, props.children, nodeValue);
      return Promise.resolve(resp);
    }

    return Promise.resolve(resp);
  };

  const asyncNodeClick = (item: any) => {
    const { callback = null, cache = true } = props.async || {};
    /** 如果是异步请求加载 */
    if (typeof callback === 'function' && getNodeAttr(item, NODE_ATTRIBUTES.IS_ASYNC) !== false) {
      const isAsyncInit = getNodeAttr(item, NODE_ATTRIBUTES.IS_ASYNC_INIT);
      /** 用于注释当前节点是否已经初始化过 */
      setNodeAttr(item, NODE_ATTRIBUTES.IS_ASYNC_INIT, true);
      if (!getNodeAttr(item, NODE_ATTRIBUTES.IS_CACHED)) {
        setNodeAttr(item, NODE_ATTRIBUTES.IS_CACHED, cache);
        if (isNodeOpened(item) && isAsyncInit) {
          return Promise.resolve(true);
        }

        const dataAttr = resolveScopedSlotParam(item);
        const callbackResult = callback(item, (resp: any) => setNodeRemoteLoad(resp, item), dataAttr);
        if (typeof callbackResult === 'object' && callbackResult !== null) {
          setTreeNodeLoading(item, true);
          if (callbackResult instanceof Promise) {
            return Promise.resolve(callbackResult
              .then((resp: any) => setNodeRemoteLoad(resp, item))
              .catch((err: any) => console.error('load remote data error:', err))
              .finally(() => {
                setTreeNodeLoading(item, false);
                setNodeAttr(item, NODE_ATTRIBUTES.IS_CACHED, true);
              }));
          }

          setNodeRemoteLoad(callbackResult, item);
          setTreeNodeLoading(item, false);
          return Promise.resolve(true);
        }
      }
      return Promise.resolve(true);
    }

    return Promise.resolve(true);
  };

  const deepAutoOpen = () => {
    /** 过滤节点为异步加载 & 默认为展开 & 没有初始化过的节点 */
    const autoOpenNodes = flatData.data.filter((item: any) => getNodeAttr(item, NODE_ATTRIBUTES.IS_ASYNC)
      && item.isOpen
      && !getNodeAttr(item, NODE_ATTRIBUTES.IS_ASYNC_INIT));

    if (autoOpenNodes.length) {
      Promise.all(autoOpenNodes.map(item => asyncNodeClick(item)))
        .then(() => {
          deepAutoOpen();
        })
        .catch((err) => {
          console.warn(err);
        });
    }
  };

  return {
    asyncNodeClick,
    deepAutoOpen,
  };
};
