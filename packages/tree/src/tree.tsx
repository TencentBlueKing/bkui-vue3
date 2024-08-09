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
import { computed, defineComponent, nextTick, onMounted, reactive, ref, watch } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { debounce } from '@bkui-vue/shared';
import VirtualRender from '@bkui-vue/virtual-render';

import { EVENTS, NODE_ATTRIBUTES, TreeEmitEventsType } from './constant';
import { treeProps, TreePropTypes as defineTypes, TreeNode } from './props';
import useEmpty from './use-empty';
import useIntersectionObserver from './use-intersection-observer';
import useNodeAction from './use-node-action';
import useNodeAttribute from './use-node-attribute';
import useNodeDrag from './use-node-drag';
import useSearch from './use-search';
import useTreeInit from './use-tree-init';
import { getLabel, getTreeStyle, resolveNodeItem } from './util';

export type TreePropTypes = defineTypes;

export type ITreeScrollTopOption = {
  id?: string;
  index?: number;
};

export default defineComponent({
  name: 'Tree',
  props: treeProps,
  emits: TreeEmitEventsType,
  setup(props, ctx) {
    const root = ref();

    const { flatData, onSelected, registerNextLoop } = useTreeInit(props);

    const {
      checkNodeIsOpen,
      isRootNode,
      isNodeOpened,
      isNodeChecked,
      isNodeMatched,
      hasChildNode,
      getNodePath,
      getNodeId,
      getNodeAttr,
      getParentNode,
      getIntersectionResponse,
    } = useNodeAttribute(flatData, props);

    const { searchFn, isSearchActive, refSearch, isSearchDisabled, isTreeUI, showChildNodes } = useSearch(props);
    const matchedNodePath = reactive([]);

    const filterFn = (item: TreeNode) => {
      if (isSearchActive.value) {
        if (showChildNodes) {
          const itemPath = getNodePath(item) ?? '';
          const asParentPath = `${itemPath}-`;
          return (
            checkNodeIsOpen(item) &&
            (isNodeMatched(item) || matchedNodePath.some(path => asParentPath.indexOf(`${path}-`) === 0))
          );
        }

        return checkNodeIsOpen(item) && isNodeMatched(item);
      }

      return checkNodeIsOpen(item);
    };

    // 计算当前需要渲染的节点信息
    const renderData = computed(() => flatData.data.filter(item => filterFn(item)));
    const { getLastVisibleElement, intersectionObserver } = useIntersectionObserver(props);

    const {
      renderTreeNode,
      handleTreeNodeClick,
      setOpen,
      setNodeAction,
      setSelect,
      asyncNodeClick,
      setNodeAttribute,
      isIndeterminate,
    } = useNodeAction(props, ctx, flatData, renderData, { registerNextLoop });

    const handleSearch = debounce(120, () => {
      matchedNodePath.length = 0;
      flatData.data.forEach((item: TreeNode) => {
        const isMatch = searchFn(getLabel(item, props), item);
        if (isMatch) {
          matchedNodePath.push(getNodePath(item));
        }

        setNodeAttribute(item, [NODE_ATTRIBUTES.IS_MATCH], [isMatch], isTreeUI.value && isMatch);
      });
    });

    if (!isSearchDisabled) {
      watch(
        [refSearch],
        () => {
          handleSearch();
        },
        { deep: true, immediate: true },
      );
    }

    onMounted(() => {
      if (props.virtualRender) {
        nextTick(() => {
          scrollToTop();
        });
      }
    });

    /**
     * 设置指定节点是否选中
     * @param item Node item | Node Id
     * @param checked
     * @param triggerEvent 是否触发抛出事件
     */
    const setChecked = (item: TreeNode | TreeNode[], checked = true, triggerEvent = false) => {
      setNodeAction(resolveNodeItem(item as TreeNode), NODE_ATTRIBUTES.IS_CHECKED, checked);
      if (triggerEvent) {
        ctx.emit(
          EVENTS.NODE_CHECKED,
          flatData.data.filter(t => isNodeChecked(t)),
          flatData.data.filter(t => isIndeterminate(t)),
        );
      }
    };

    onSelected((newData: TreeNode) => {
      setSelect(newData, true, props.autoOpenParentNode, true);
    });

    const getData = () => flatData;

    watch(
      () => [props.checked],
      () => {
        setChecked(props.checked, true);
      },
    );

    const reset = () => {
      root.value?.reset();
    };

    /**
     * 将制定元素滚动到顶部
     * @param option
     */
    const scrollToTop = (option?: ITreeScrollTopOption) => {
      if (option === undefined || option === null) {
        root.value.fixToTop({ index: 1 });
        return;
      }

      if (props.nodeKey && Object.prototype.hasOwnProperty.call(option, props.nodeKey)) {
        root.value.fixToTop({
          index: renderData.value.findIndex(node => node[props.nodeKey] === option[props.nodeKey]) + 1,
        });
        return;
      }

      if (option.id !== undefined && option.id !== null) {
        root.value.fixToTop({
          index: renderData.value.findIndex(node => node[props.nodeKey] === option.id) + 1,
        });
        return;
      }

      if (option.index >= 0) {
        root.value.fixToTop({ index: option.index });
        return;
      }

      const id = getNodeId(option as TreeNode);
      if (id) {
        root.value.fixToTop({
          index: renderData.value.findIndex(node => getNodeId(node) === id) + 1,
        });
        return;
      }
    };

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
      setNodeOpened: setOpen,
      setSelect,
      scrollToTop,
      asyncNodeClick,
      getData,
      reset,
      getNodeAttr,
      getParentNode,
    });

    const { renderEmpty } = useEmpty(props);
    useNodeDrag(props, ctx, root, flatData);
    const renderTreeContent = (scopedData: TreeNode[]) => {
      if (scopedData.length) {
        return scopedData.map(d => renderTreeNode(d, !isSearchActive.value || isTreeUI.value));
      }

      const emptyType = isSearchActive.value ? 'search-empty' : 'empty';
      return ctx.slots.empty?.() ?? renderEmpty(emptyType);
    };

    /**
     * 如果启用了虚拟渲染 & 虚拟滚动
     * @param param0
     */
    const handleContentScroll = ([scroll, _pagination, list]) => {
      if (intersectionObserver.value.enabled) {
        if (scroll.offset.y > 5) {
          if (!props.virtualRender) {
            const lastElement = getLastVisibleElement(scroll.offset.y, root.value.refRoot);
            const result = getIntersectionResponse(lastElement[0]);
            intersectionObserver.value?.callback?.(result);
            ctx.emit(EVENTS.NODE_ENTER_VIEW, result);
            return;
          }

          const resp = getIntersectionResponse(list.slice(-1)[0]);
          intersectionObserver.value?.callback?.(resp);
          ctx.emit(EVENTS.NODE_ENTER_VIEW, resp);
          return;
        }
      }
    };

    const { resolveClassName } = usePrefix();

    return () => (
      <VirtualRender
        ref={root}
        style={getTreeStyle(null, props)}
        height={props.height}
        class={resolveClassName('tree')}
        contentClassName={resolveClassName('container')}
        enabled={props.virtualRender}
        keepAlive={true}
        lineHeight={props.lineHeight}
        list={renderData.value}
        rowKey={NODE_ATTRIBUTES.UUID}
        throttleDelay={0}
        onContentScroll={handleContentScroll}
      >
        {{
          default: (scoped: { data: TreeNode[] }) => renderTreeContent(scoped.data || []),
        }}
      </VirtualRender>
    );
  },
});
