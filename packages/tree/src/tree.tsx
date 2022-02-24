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
import { defineComponent, watch, reactive, computed } from 'vue';
import {
  getFlatdata,
  getLabel,
  getNodeItemStyle,
  getNodeItemClass,
  getTreeStyle,
} from './util';
import { Folder, FolderShapeOpen, TextFile, DownShape, RightShape } from '@bkui-vue/icon/';
import { treeProps, TreePropTypes as defineTypes } from './props';
import VirtualRender from '@bkui-vue/virtual-render';

export type TreePropTypes = defineTypes;

export default defineComponent({
  name: 'Tree',
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
      const formatData = getFlatdata(props, newData);
      flatData.data = formatData[0] as Array<any>;
      flatData.schema = formatData[1] as any;
      computeLevelHeight();
    }, {
      deep: true,
    });

    watch(() => [props.levelLine], () => {
      computeLevelHeight();
    });

    // 计算当前需要渲染的节点信息
    const renderData = computed(() => flatData.data
      .filter(item => checkNodeIsOpen(item)));

    // 当前渲染节点路径集合
    const renderNodePathColl = computed(() => renderData.value.map(node => node.__path));

    const isItemOpen = (item: any) => {
      if (typeof item === 'object') {
        return (flatData.schema[item.__path] || {}).__isOpen;
      }

      if (typeof item === 'string') {
        return (flatData.schema[item] || {}).__isOpen;
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
     * 根据节点状态获取节点操作Icon
     * @param item
     * @returns
     */
    const getActionIcon = (item: any) => {
      if (item.__hasChild) {
        return isItemOpen(item) ? <DownShape /> : <RightShape />;
      }

      return null;
    };

    /**
     * 节点点击
     * @param item
     */
    const hanldeTreeNodeClick = (item: any) => {
      if (item.__hasChild) {
        const newVal = !isItemOpen(item);
        Object.assign(item, { __isOpen: newVal });
        renderData.value.filter(node => String.prototype.startsWith.call(node.__path, item.__path))
          .forEach(filterNode => Object.assign(flatData.schema[filterNode.__path], { __isOpen: newVal }));
        computeLevelHeight();
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

          const setDefaultNodeSchema = (path: string, lastNode = null, isLeaf = false) => {
            if (!Object.prototype.hasOwnProperty.call(nodeSchema, path)) {
              Object.assign(nodeSchema, {
                [path]: {
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
            const parentPath = getParentNodePath(node);
            const isLeaf = !renderNodePathColl.value.includes(`${node.__path}-0`);

            setDefaultNodeSchema(node.__path, null, isLeaf);
            setDefaultNodeSchema(parentPath, node.__path);

            const parentSchema = nodeSchema[parentPath];
            const currentNodeSchema = nodeSchema[node.__path];
            const { childNodeCount = 0 } = currentNodeSchema;
            currentNodeSchema.childNodeCount = childNodeCount + 1;
            currentNodeSchema.isLastNode = parentSchema.lastNode === node.__path;
            parentSchema.childNodeCount += currentNodeSchema.childNodeCount;
          }

          flatData.levelLineSchema = nodeSchema;
        });
      } else {
        flatData.levelLineSchema = {};
      }
    };

    /**
     * 获取当前节点的父级节点Path
     * @param node
     * @returns
     */
    const getParentNodePath = (node: any) => {
      if (node.__isRoot) {
        return null;
      }
      const nodePathLen = `-${node.__index}`.length;
      return String.prototype.substring.call(node.__path, 0, node.__path.length - nodePathLen);
    };

    /**
     * 过滤当前状态为Open的节点
     * 页面展示只会展示Open的节点
     * @param item
     * @returns
     */
    const checkNodeIsOpen = (node: any) => node.__isRoot || isItemOpen(node) || isItemOpen(getParentNodePath(node));

    const filterNextNode = (depth: number, node: any) => {
      if (node.__isRoot) {
        return false;
      }

      const paths = `${node.__path}`.split('-').slice(0, depth + 1);
      const currentPath = paths.join('-');

      // 如果是判定当前节点，则必须要有一条线
      if (currentPath === node.__path) {
        return true;
      }

      const lastLevel = paths.pop();
      const nextLevel = parseInt(lastLevel, 10);
      paths.push(`${nextLevel + 1}`);
      const nextNodePath = paths.join('-');
      const exist  = Object.prototype.hasOwnProperty.call(flatData.schema, nextNodePath);
      console.log('nextNodePath', nextNodePath, node.__path, exist);
      return exist;
    };

    const getVirtualLines = (node: any) => {
      if (!props.virtualRender) {
        return null;
      }

      const getNodeLineStyle = (dpth: number) => ({
        '--depth': dpth,
      });

      const maxDeep = node.__depth + 1;
      return new Array(maxDeep ?? 0).fill('')
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
    };
  },

  render() {
    const props = this.$props;
    const renderTreeNode = (item: any) => <div
      class={getNodeItemClass(item, this.flatData.schema, props)}
      style={getNodeItemStyle(item, props, this.flatData.levelLineSchema)}
      onClick={() => this.hanldeTreeNodeClick(item)}>
      {
        [
          this.getActionIcon(item),
          item.__isRoot ? this.getRootIcon(item) : <TextFile class="bk-tree-icon" />,
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
