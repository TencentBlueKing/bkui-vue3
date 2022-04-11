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
import { defineComponent, watch, reactive, computed, h } from 'vue';
import {
  getFlatdata,
  getLabel,
  getNodeItemStyle,
  getNodeItemClass,
  getTreeStyle,
  updateTreeNode,
} from './util';
import { Folder, FolderShapeOpen, TextFile, DownShape, RightShape, Spinner } from '@bkui-vue/icon/';
import { treeProps, TreePropTypes as defineTypes } from './props';
import VirtualRender from '@bkui-vue/virtual-render';

export type TreePropTypes = defineTypes;

export default defineComponent({
  name: 'BkTree',
  props: treeProps,

  setup(props: TreePropTypes) {
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

    /**
     * 监听组件配置Data改变
     */
    watch(() => [props.data], (newData) => {
      console.log('props.data changed');
      const formatData = getFlatdata(props, newData, schemaValues.value);
      flatData.data = formatData[0] as Array<any>;
      flatData.schema = formatData[1] as any;
      computeLevelHeight();
    }, {
      deep: true,
    });

    watch(() => [props.levelLine], () => {
      computeLevelHeight();
    });

    const schemaValues = computed(() => Array.from(flatData.schema.values()));

    const getSchemaVal = (key: string) => ((flatData.schema as Map<string, any>).get(key));

    const getNodeAttr = (node: any, attr: string) => (getSchemaVal(node.__uuid) || {})[attr];

    const setNodeAttr = (node: any, attr: string, val: any) => (flatData.schema as Map<string, any>).set(node.__uuid, {
      ...getSchemaVal(node.__uuid),
      [attr]: val,
    });

    const getNodePath = (node: any) => getNodeAttr(node, '__path');
    const isRootNode = (node: any) => getNodeAttr(node, '__isRoot');
    const isNodeOpened = (node: any) => getNodeAttr(node, '__isOpen');
    const hasChildNode = (node: any) => getNodeAttr(node, '__hasChild');

    // 计算当前需要渲染的节点信息
    const renderData = computed(() => flatData.data
      .filter(item => checkNodeIsOpen(item)));

    // 当前渲染节点路径集合
    const renderNodePathColl = computed(() => renderData.value.map(node => getNodePath(node)));

    const isItemOpen = (item: any) => {
      if (typeof item === 'object') {
        return isNodeOpened(item);
      }

      if (typeof item === 'string') {
        return (getSchemaVal(item) || {}).__isOpen;
      }

      return false;
    };

    /**
     * 根据当前节点状态获取节点类型Icon
     * @param item
     * @returns
     */
    const getRootIcon = (item: any) => (isItemOpen(item)
      ? <FolderShapeOpen class="bk-tree-icon" />
      : <Folder class="bk-tree-icon" />);


    /**
     * 渲染动态设置的节点样式
     * @param val
     * @returns
     */
    const renderPrefixVal = (val: string | { node: string, className: string, text: string, style: any }) => {
      if (typeof val === 'string') {
        return val;
      }

      if (typeof val === 'object' && val !== null) {
        const { node, className, text, style } = val;
        return h(node, { class: className, style }, text);
      }

      return null;
    };

    /**
     * 根据节点状态获取节点操作Icon
     * @param item
     * @returns
     */
    const getActionIcon = (item: any) => {
      let prefixFnVal = null;

      if (typeof props.prefixIcon === 'function') {
        prefixFnVal = props.prefixIcon(isRootNode(item), hasChildNode(item) || item.async, isItemOpen(item), 'action', item);
        if (prefixFnVal !== 'default') {
          return renderPrefixVal(prefixFnVal);
        }
      }

      if (prefixFnVal === 'default' || (typeof props.prefixIcon === 'boolean' && props.prefixIcon)) {
        if (hasChildNode(item) || item.async) {
          return isItemOpen(item) ? <DownShape /> : <RightShape />;
        }
      }

      return null;
    };

    /**
     * 获取节点类型Icon
     * @param item
     * @returns
     */
    const getNodePrefixIcon = (item: any) => {
      let prefixFnVal = null;

      if (typeof props.prefixIcon === 'function') {
        prefixFnVal = props.prefixIcon(isRootNode(item), hasChildNode(item) || item.async, isItemOpen(item), 'node_type', item);

        if (prefixFnVal !== 'default') {
          return renderPrefixVal(prefixFnVal);
        }
      }

      if (prefixFnVal === 'default' || (typeof props.prefixIcon === 'boolean' && props.prefixIcon)) {
        return isRootNode(item) ? getRootIcon(item) : <TextFile class="bk-tree-icon" />;
      }

      return null;
    };

    const getLoadingIcon = (item: any) => (item.loading ? <Spinner></Spinner> : '');

    /**
     * 设置指定节点是否展开
     * @param item
     */
    const setNodeOpened = (item: any) => {
      const newVal = !isItemOpen(item);
      setNodeAttr(item, '__isOpen', newVal);
      computeLevelHeight();
    };

    /**
     * 处理异步加载节点数据返回结果
     * @param resp 异步请求返回结果
     * @param item 当前节点
     */
    const setNodeRemoteLoad = (resp: any, item: any) => {
      if (typeof resp === 'object' && resp !== null) {
        setNodeAttr(item, '__isOpen', true);
        const nodeValue = Array.isArray(resp) ? resp : [resp];
        updateTreeNode(getNodePath(item), props.data, props.children, props.children, nodeValue);
      }
    };

    /**
     * 节点点击
     * @param item
     */
    const hanldeTreeNodeClick = (item: any) => {
      /** 如果是异步请求加载 */
      if (item.async) {
        if (typeof props.asyncLoad === 'function') {
          Object.assign(item, { loading: true });
          props.asyncLoad(item, (resp: any) => setNodeRemoteLoad(resp, item))
            .then((resp: any) => setNodeRemoteLoad(resp, item))
            .catch((err: any) => console.error('load remote data error:', err))
            .finally(() => {
              updateTreeNode(getNodePath(item), props.data, props.children, 'loading', false);
            });
        } else {
          console.error('async need to set prop: asyncLoad with function wich will return promise object');
        }
      }

      if (hasChildNode(item)) {
        setNodeOpened(item);
      }
    };

    /**
     * 当需要显示连线时，计算每个节点范围连线高度
     * TODO: 如果启用虚拟渲染，虚拟连线需要重新设计，此方案会存在缺陷
     */
    const computeLevelHeight = () => {
      if (!!props.levelLine) {
        setTimeout(() => {
          let showNodeCount = renderData.value.length;
          const nodeSchema = {};

          const setDefaultNodeSchema = (uuid: string, lastNode = null, isLeaf = false) => {
            if (!Object.prototype.hasOwnProperty.call(nodeSchema, uuid)) {
              Object.assign(nodeSchema, {
                [uuid]: {
                  childNodeCount: 0,
                  isLastNode: false,
                  ...(lastNode !== null ? { lastNode } : {}),
                  ...(isLeaf !== null ? { isLeaf } : {}),
                },
              });
            }
          };

          for (; showNodeCount > 0; showNodeCount--) {
            const node = renderData.value[showNodeCount - 1];
            const parentId = getNodeAttr(node, '__parentId');
            const nodepath = getNodePath(node);
            const isLeaf = !renderNodePathColl.value.includes(`${nodepath}-0`);

            setDefaultNodeSchema(node.__uuid, null, isLeaf);
            setDefaultNodeSchema(parentId, node.__uuid);

            const parentSchema = nodeSchema[parentId];
            const currentNodeSchema = nodeSchema[node.__uuid];
            const { childNodeCount = 0 } = currentNodeSchema;
            currentNodeSchema.childNodeCount = childNodeCount + 1;
            currentNodeSchema.isLastNode = parentSchema.lastNode === node.__uuid;
            parentSchema.childNodeCount += currentNodeSchema.childNodeCount;
          }

          flatData.levelLineSchema = nodeSchema;
        });
      } else {
        flatData.levelLineSchema = {};
      }
    };

    /**
     * 过滤当前状态为Open的节点
     * 页面展示只会展示Open的节点
     * @param item
     * @returns
     */
    const checkNodeIsOpen = (node: any) => isRootNode(node) || isItemOpen(node) || isItemOpen(getNodeAttr(node, '__parentId'));

    const filterNextNode = (depth: number, node: any) => {
      if (isRootNode(node)) {
        return false;
      }

      const nodepath = getNodePath(node);
      const paths = `${nodepath}`.split('-').slice(0, depth + 1);
      const currentPath = paths.join('-');

      // 如果是判定当前节点，则必须要有一条线
      if (currentPath === nodepath) {
        return true;
      }

      const lastLevel = paths.pop();
      const nextLevel = parseInt(lastLevel, 10);
      paths.push(`${nextLevel + 1}`);
      const nextNodePath = paths.join('-');
      return schemaValues.value.some((val: any) => val.__path === nextNodePath);
    };

    const getVirtualLines = (node: any) => {
      if (!props.virtualRender) {
        return null;
      }

      const getNodeLineStyle = (dpth: number) => ({
        '--depth': dpth,
      });

      const maxDeep = getNodeAttr(node, '__depth') + 1;
      return new Array(maxDeep).fill('')
        .map((_, index: number) => index)
        .filter((depth: number) => filterNextNode(depth, node))
        .filter((depth: number) => depth > 0)
      // @ts-ignore:next-line
        .map((index: number) => <span class="node-virtual-line" style={ getNodeLineStyle(maxDeep - index) }></span>);
    };

    computeLevelHeight();
    return {
      renderData,
      flatData,
      hanldeTreeNodeClick,
      getActionIcon,
      getRootIcon,
      getVirtualLines,
      getNodePrefixIcon,
      getLoadingIcon,
    };
  },

  render() {
    const props = this.$props;
    const renderTreeNode = (item: any) => <div
      class={getNodeItemClass(item, this.flatData.schema, props)}
      style={getNodeItemStyle(item, props, this.flatData)}
      onClick={() => this.hanldeTreeNodeClick(item)}>
      {
        [
          this.getActionIcon(item),
          this.getNodePrefixIcon(item),
          this.getLoadingIcon(item),
        ]
      }
      <span>{getLabel(item, props)}</span>
      {
        this.getVirtualLines(item)
      }
    </div>;

    return <VirtualRender class="bk-tree"
    style={getTreeStyle(null, props)}
    list={this.renderData}
    lineHeight={props.lineHeight}
    enabled={props.virtualRender}>
    {
      {
        default: (scoped: any) => (scoped.data || []).map(renderTreeNode),
      }
    }
  </VirtualRender>;
  },
});
