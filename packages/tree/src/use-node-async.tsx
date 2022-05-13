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
import { assignTreeNode, updateTreeNode } from './util';;
export default (props, flatData) => {
  const {
    setNodeAttr,
    getNodePath,
    getNodeAttr,
  } = useNodeAttribute(flatData);

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

    return Promise.reject(resp);
  };

  const asyncNodeClick = (item: any) => {
    /** 如果是异步请求加载 */
    if (getNodeAttr(item, NODE_ATTRIBUTES.IS_ASYNC)) {
      const { callback = null, cache = true } = props.async || {};
      /** 用于注释当前节点是否已经初始化过 */
      setNodeAttr(item, NODE_ATTRIBUTES.IS_ASYNC_INIT, true);
      if (typeof callback === 'function') {
        if (!getNodeAttr(item, NODE_ATTRIBUTES.IS_CACHED)) {
          Object.assign(item, { loading: true });
          return Promise.resolve(callback(item, (resp: any) => setNodeRemoteLoad(resp, item))
            .then((resp: any) => setNodeRemoteLoad(resp, item))
            .catch((err: any) => console.error('load remote data error:', err))
            .finally(() => {
              setNodeAttr(item, NODE_ATTRIBUTES.IS_CACHED, cache);
              assignTreeNode(getNodePath(item), props.data, props.children, {
                loading: false,
                ...(cache ? { cached: true } : {}),
              });
            }));
        }
        return Promise.resolve(true);
      }
      return Promise.reject('async need to set prop: asyncLoad with function wich will return promise object');
    }

    return Promise.resolve(true);
  };

  const deepAutoOpen = () => {
    /** 过滤节点为异步加载 & 默认为展开 & 没有初始化过的节点 */
    const autoOpenNodes = flatData.data.filter((item: any) => item.async
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
