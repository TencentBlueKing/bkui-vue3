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
import { computed, defineComponent, reactive, ref, watch } from 'vue';

import { resolveClassName } from '@bkui-vue/shared';
import VirtualRender from '@bkui-vue/virtual-render';

import { treeProps, TreePropTypes as defineTypes } from './props';
import useEmpty from './use-empty';
import useNodeAction from './use-node-action';
import useNodeAttribute from './use-node-attribute';
import useSearch from './use-search';
import {
  getFlatdata,
  getLabel,
  getTreeStyle,
  NODE_ATTRIBUTES,
} from './util';

export type TreePropTypes = defineTypes;

export default defineComponent({
  name: 'Tree',
  props: treeProps,
  emits: ['check'],

  setup(props, ctx) {
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

    const {
      schemaValues,
      setNodeAttr,
      checkNodeIsOpen,
      getNodeAttr,
      getNodePath,
      isRootNode,
      isChecked,
    } = useNodeAttribute(flatData);

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
          .some((schema: any) => schema[NODE_ATTRIBUTES.PATH].startsWith(getNodePath(item))
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
      hanldeTreeNodeClick,
      deepAutoOpen,
      setNodeOpened,
    } = useNodeAction(props, ctx, flatData, renderData);

    /** 如果设置了异步请求 */
    if (props.async?.callback) {
      deepAutoOpen();
    }


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

    const resolveNodeItem = (node: any) => {
      if (typeof node === 'string') {
        return { [NODE_ATTRIBUTES.UUID]: node };
      }

      if (Object.prototype.hasOwnProperty.call(node, NODE_ATTRIBUTES.UUID)) {
        return node;
      }

      console.error('setNodeAction Error: node id cannot found');
      return node;
    };

    /**
     * 设置指定节点行为 checked isOpen
     * @param args
     * @param action
     * @param value
     * @returns
     */
    const setNodeAction = (args: any | any[], action: string, value: any) => {
      if (Array.isArray(args)) {
        args.forEach((node: any) => setNodeAttr(resolveNodeItem(node), action, value));
        return;
      }

      setNodeAttr(resolveNodeItem(args), action, value);
    };

    /**
     * 指定节点展开
     * @param item 节点数据 | Node Id
     * @param isOpen 是否展开
     * @param autoOpenParents 如果是 isOpen = true，是否自动设置所有父级展开
     * @returns
     */
    const setOpen = (item: any[] | any, isOpen = true, autoOpenParents = false) => {
      const resolvedItem = resolveNodeItem(item);
      if (autoOpenParents) {
        if (isOpen) {
          setNodeAction(resolvedItem, NODE_ATTRIBUTES.IS_OPEN, isOpen);
          if (!isRootNode(resolvedItem)) {
            const parentId = getNodeAttr(resolvedItem, NODE_ATTRIBUTES.PARENT_ID);
            setOpen(parentId, true, true);
          }
        } else {
          setNodeOpened(resolvedItem, false);
        }
      } else {
        setNodeAction(resolvedItem, NODE_ATTRIBUTES.IS_OPEN, isOpen);
      }
    };

    /**
     * 设置指定节点是否选中
     * @param item Node item | Node Id
     * @param checked
     */
    const setChecked = (item: any[] | any, checked = true) => {
      setNodeAction(resolveNodeItem(item), NODE_ATTRIBUTES.CHECKED, checked);
    };

    /**
     * 选中指定的节点
     * @param item 指定节点
     * @param fireOther 是否释放其他已选中节点 默认为 true
     */
    const select = (item: string | any, fireOther = true) => {
      if (fireOther) {
        setChecked(schemaValues.value.filter((item: any) => isChecked(item)) ?? [], false);
      }

      setChecked(item, true);
    };

    ctx.expose({
      hanldeTreeNodeClick,
      setOpen,
      setChecked,
      setNodeAction,
      select,
    });

    const root = ref();
    const { renderEmpty } = useEmpty(props, ctx);
    const renderTreeContent = (scopedData: any[]) =>  {
      if (scopedData.length) {
        return scopedData.map(renderTreeNode);
      }

      const emptyType = isSearchActive.value ? 'search-empty' : 'empty';
      return renderEmpty(emptyType);
    };

    return () => <VirtualRender class={ resolveClassName('tree') }
      style={getTreeStyle(null, props)}
      list={renderData.value}
      lineHeight={props.lineHeight}
      enabled={props.virtualRender}
      contentClassName={ resolveClassName('container') }
      throttleDelay={0}
      ref={root}>
      {
        {
          default: (scoped: any) => renderTreeContent(scoped.data || []),
        }
      }
    </VirtualRender>;
  },
});
