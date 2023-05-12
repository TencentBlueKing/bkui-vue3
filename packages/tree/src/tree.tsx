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
import { computed, defineComponent, ref, watch } from 'vue';

import { resolveClassName } from '@bkui-vue/shared';
import VirtualRender from '@bkui-vue/virtual-render';

import { NODE_ATTRIBUTES, TreeEmitEventsType } from './constant';
import { treeProps, TreePropTypes as defineTypes } from './props';
import useEmpty from './use-empty';
import useNodeAction from './use-node-action';
import useNodeAttribute from './use-node-attribute';
import useNodeDrag from './use-node-drag';
import useSearch from './use-search';
import useTreeInit from './use-tree-init';
import {
  getLabel,
  getTreeStyle,
  resolveNodeItem,
} from './util';

export type TreePropTypes = defineTypes;
export default defineComponent({
  name: 'Tree',
  props: treeProps,
  emits: TreeEmitEventsType,
  setup(props, ctx) {
    const { flatData, schemaValues, onSelected, registerNextLoop } = useTreeInit(props);
    const {
      setNodeAttr,
      checkNodeIsOpen,
      getNodeAttr,
      getNodePath,
      isRootNode,
      isNodeOpened,
      isNodeChecked,
      isNodeMatched,
      hasChildNode,
    } = useNodeAttribute(flatData, props);

    const { searchFn, isSearchActive, refSearch, openResultNode, isTreeUI, isSearchDisabled } = useSearch(props);
    if (!isSearchDisabled) {
      watch([refSearch], () => {
        flatData.data.forEach((item: any) => {
          const isMatch = searchFn(getLabel(item, props), item);
          setNodeAttr(item, NODE_ATTRIBUTES.IS_MATCH, isMatch);
          if (openResultNode) {
            setOpen(item, true, true);
          }
        });
      });
    }

    const filterFn = (item: any) => {
      if (isSearchActive.value) {
        const treeUiFilter = () => (isTreeUI ? schemaValues.value
          .some((schema: any) => schema[NODE_ATTRIBUTES.PATH]?.startsWith(getNodePath(item))
            && schema[NODE_ATTRIBUTES.IS_MATCH]) : false);

        return getNodeAttr(item, NODE_ATTRIBUTES.IS_MATCH) || treeUiFilter();
      }

      return true;
    };

    // 计算当前需要渲染的节点信息
    const renderData = computed(() => flatData.data
      .filter(item => checkNodeIsOpen(item) && filterFn(item)));

    const {
      renderTreeNode,
      handleTreeNodeClick,
      setNodeOpened,
      setOpen,
      setNodeAction,
      setSelect,
      asyncNodeClick,
    } = useNodeAction(props, ctx, flatData, renderData, schemaValues, { registerNextLoop });

    /**
     * 设置指定节点是否选中
     * @param item Node item | Node Id
     * @param checked
     */
    const setChecked = (item: any[] | any, checked = true) => {
      setNodeAction(resolveNodeItem(item), NODE_ATTRIBUTES.IS_CHECKED, checked);
    };

    onSelected((newData: any) => {
      setSelect(newData, true, props.autoOpenParentNode);
    });

    const getData = () => flatData;

    ctx.expose({
      handleTreeNodeClick,
      isNodeChecked,
      isRootNode,
      isNodeOpened,
      isNodeMatched,
      hasChildNode,
      setOpen,
      setChecked,
      setNodeAction,
      setNodeOpened,
      setSelect,
      asyncNodeClick,
      getData,
    });

    const root = ref();
    const { renderEmpty } = useEmpty(props, ctx);
    useNodeDrag(props, ctx, root, flatData);
    const renderTreeContent = (scopedData: any[]) => {
      if (scopedData.length) {
        return scopedData.map(renderTreeNode);
      }

      const emptyType = isSearchActive.value ? 'search-empty' : 'empty';
      return ctx.slots.empty?.() ?? renderEmpty(emptyType);
    };

    return () => (
      <VirtualRender class={resolveClassName('tree')}
        style={getTreeStyle(null, props)}
        list={renderData.value}
        lineHeight={props.lineHeight}
        enabled={props.virtualRender}
        contentClassName={resolveClassName('container')}
        throttleDelay={0}
        ref={root}>
        {
          {
            default: (scoped: any) => renderTreeContent(scoped.data || []),
          }
        }
      </VirtualRender>
    );
  },
});
