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
import { computed, onMounted, onUnmounted } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import throttle from 'lodash/throttle';

import { EVENTS, NODE_ATTRIBUTES } from './constant';
import { TreeNode, TreePropTypes } from './props';
import { useArrayMove } from './use-array-move';
import useNodeAttribute from './use-node-attribute';

export default (props: TreePropTypes, ctx, root?, flatData?) => {
  const {
    getSourceNodeByUID,
    getParentNode,
    extendNodeAttr,
    getNodeIndexByNode,
    setNodeAttr,
    getNodeAttr,
    getRootNodeList,
  } = useNodeAttribute(flatData, props);
  const { resolveClassName } = usePrefix();
  const isNeedCheckDraggable = computed(() => typeof props.disableDrag === 'function');
  const isNeedCheckDroppable = computed(() => typeof props.disableDrop === 'function');
  const dragThreshold = props.dragThreshold || 0.2; // 新增配置项，默认值为 0.2
  let dragNodeId = '';
  let draggedItem = null;
  let moveData = null;

  let nodeRectMap = new WeakMap();
  const { moveElement } = useArrayMove();

  /**
   * 保存所有节点的展开状态
   */
  const saveAllOpenStates = (): Map<TreeNode, boolean> => {
    const openStates = new Map<TreeNode, boolean>();
    flatData.data.forEach(node => {
      const isOpen = getNodeAttr(node, NODE_ATTRIBUTES.IS_OPEN);
      openStates.set(node, isOpen);
    });
    return openStates;
  };

  /**
   * 恢复所有节点的展开状态
   */
  const restoreAllOpenStates = (openStates: Map<TreeNode, boolean>) => {
    openStates.forEach((isOpen, node) => {
      if (flatData.schema.has(node)) {
        setNodeAttr(node, NODE_ATTRIBUTES.IS_OPEN, isOpen);
      }
    });
  };

  /**
   * 从父节点的 children 数组中移除指定节点
   */
  const removeFromParentChildren = (node: TreeNode, parent: TreeNode | null) => {
    if (!parent) {
      // 根节点，从 props.data 中移除
      const index = props.data.indexOf(node);
      if (index > -1) {
        props.data.splice(index, 1);
      }
    } else {
      const children = parent[props.children] as TreeNode[];
      if (children) {
        const index = children.indexOf(node);
        if (index > -1) {
          children.splice(index, 1);
        }
      }
    }
  };

  /**
   * 更新节点的 HAS_CHILD 属性
   */
  const updateHasChildAttr = (node: TreeNode | null) => {
    if (!node) return;
    const children = node[props.children] as TreeNode[];
    const hasChildren = children && children.length > 0;
    setNodeAttr(node, NODE_ATTRIBUTES.HAS_CHILD, hasChildren);
  };

  const getTargetTreeNode = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    return target.closest('[data-tree-node]') as HTMLElement;
  };

  const getNodeByTargetTreeNode = targetNode => {
    const uid = targetNode?.dataset?.treeNode;
    return getSourceNodeByUID(uid);
  };

  const updateDropStyles = (targetNode: HTMLElement, stylesToAdd: string[], stylesToRemove: string[]) => {
    stylesToRemove.forEach(style => targetNode.classList.remove(style));
    stylesToAdd.forEach(style => targetNode.classList.add(style));
  };

  const handleTreeNodeMouseup = (e: MouseEvent) => {
    const targetNode = getTargetTreeNode(e);
    targetNode.removeEventListener('mouseup', handleTreeNodeMouseup);
  };

  const handleTreeNodeMousedown = (e: MouseEvent) => {
    const targetNode = getTargetTreeNode(e);
    const data = getNodeByTargetTreeNode(targetNode);
    if (data?.draggable === false || (isNeedCheckDraggable.value && props.disableDrag?.(data))) {
      targetNode?.classList.add(`${resolveClassName('tree-drag-disabled')}`);
      return;
    }
    targetNode?.setAttribute('draggable', 'true');
    targetNode?.addEventListener('mouseup', handleTreeNodeMouseup);
  };

  const dropBefore = 'drop-before';
  const dropAfter = 'drop-after';
  const dropInner = 'drop-inner';
  let dragOverItem: HTMLElement = null;

  const handleTreeNodeDragover = throttle((e: DragEvent) => {
    e.preventDefault();

    if (!draggedItem) return;

    const targetNode = getTargetTreeNode(e);

    if (dragOverItem !== targetNode) {
      dragOverItem?.classList.remove(dropBefore, dropAfter, dropInner);
      dragOverItem = targetNode;
    }

    const data = extendNodeAttr(getNodeByTargetTreeNode(targetNode));

    // 如果目标节点不在缓存中，重新计算并缓存
    if (!nodeRectMap.has(targetNode)) {
      nodeRectMap.set(targetNode, targetNode.getBoundingClientRect());
    }

    const clientY = e.clientY;
    const { top, height } = nodeRectMap.get(targetNode);
    const threshold = height * dragThreshold; // 使用配置项
    const offsetY = clientY - top;

    if (offsetY < threshold) {
      updateDropStyles(targetNode, [dropBefore], [dropAfter, dropInner]);
    } else if (offsetY > height - threshold) {
      updateDropStyles(targetNode, [dropAfter], [dropBefore, dropInner]);
    } else {
      updateDropStyles(targetNode, [dropInner], [dropBefore, dropAfter]);
    }

    ctx.emit(EVENTS.NODE_DRAG_OVER, e, targetNode, data);
    if (isNeedCheckDroppable.value && props?.disableDrop(moveData, 'move', data)) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.dropEffect = 'none';
      targetNode.classList.add(`${resolveClassName('tree-drop-disabled')}`);
      return;
    }
    targetNode.classList.add(`${resolveClassName('tree-drop-active')}`);
    const targetNodeId = targetNode.getAttribute('data-tree-node');

    const transferEffect = isNodeSortable(dragNodeId, targetNodeId) ? 'move' : 'none';
    e.dataTransfer.effectAllowed = transferEffect;
    e.dataTransfer.dropEffect = transferEffect;
  });

  const handleTreeNodeDragStart = (e: DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.dropEffect = 'move';
    const targetNode = getTargetTreeNode(e);
    e.dataTransfer.setData('text/plain', '');
    const nodeId = targetNode.getAttribute('data-tree-node');
    dragNodeId = nodeId;
    draggedItem = targetNode;
    moveData = getSourceNodeByUID(nodeId);
    e.dataTransfer.setData('node-id', nodeId);
    ctx.emit(EVENTS.NODE_DRAG_START, e, targetNode);
  };

  const handleTreeNodeDrop = (e: DragEvent) => {
    /** firefox的drop事件必须调用preventDefault()和stopPropagation(), 否则会自动重定向 */
    e.preventDefault();
    e.stopPropagation();

    const targetNode = getTargetTreeNode(e);
    if (!targetNode) return;

    targetNode.classList.remove(`${resolveClassName('tree-drop-active')}`, `${resolveClassName('tree-drop-disabled')}`);
    const isInsertAsChild = dragOverItem?.classList.contains(dropInner);
    const isDropBefore = dragOverItem?.classList.contains(dropBefore);
    const isDropAfter = dragOverItem?.classList.contains(dropAfter);

    // 确定操作类型：child（作为子节点）、sort（排序）、move（同级移动）
    let dropType: 'child' | 'sort' | 'move' = 'child';
    if (isInsertAsChild) {
      dropType = 'child';
    } else if (isDropBefore || isDropAfter) {
      dropType = props.dragSort ? 'sort' : 'move';
    }

    const data = extendNodeAttr(getNodeByTargetTreeNode(targetNode));
    if (isNeedCheckDroppable.value && props.disableDrop(moveData, dropType, data)) {
      return;
    }

    const sourceNodeId = dragNodeId;
    const targetNodeId = targetNode.getAttribute('data-tree-node');

    if (sourceNodeId !== targetNodeId) {
      // 保存所有节点的展开状态
      const savedOpenStates = saveAllOpenStates();

      if (isInsertAsChild) {
        // 作为目标节点的子节点
        Reflect.apply(dragAsChildNode, this, [sourceNodeId, targetNodeId, savedOpenStates]);
      } else if (isDropBefore || isDropAfter) {
        if (props.dragSort) {
          // 排序模式：在同父节点下排序
          Reflect.apply(dragSortData, this, [sourceNodeId, targetNodeId, savedOpenStates]);
        } else {
          // 非排序模式：作为目标节点的同级节点插入
          Reflect.apply(dragAsSiblingNode, this, [sourceNodeId, targetNodeId, savedOpenStates]);
        }
      }
      ctx.emit(EVENTS.NODE_DROP, e, targetNode, data);
    }

    nodeRectMap = new WeakMap();
    dragOverItem?.classList.remove(dropAfter, dropBefore, dropInner);
    dragOverItem = null;
    moveData = null;
  };

  const isNodeSortable = (sourceId: string, targetId: string) => {
    return sourceId !== targetId;
  };

  const getChildNodeList = (nodeData: TreeNode) => {
    const childList = [];
    const getNodeChild = (rootNode: TreeNode) => {
      const children = flatData.data.filter(item => getParentNode(item) === rootNode) as TreeNode[];
      children.forEach((item: TreeNode) => {
        childList.push(item);
        getNodeChild(item);
      });
    };
    getNodeChild(nodeData);
    return childList;
  };

  /**
   * 排序节点列表
   * @param sourceNodeData 源节点
   * @param targetNodeData 目标节点
   * @returns
   */
  const sortNodeList = (sourceNodeData: TreeNode, targetNodeData: TreeNode) => {
    let sourceNodeIndex = getNodeIndexByNode(sourceNodeData);
    let targetNodeIndex = getNodeIndexByNode(targetNodeData);

    const sourceNodeChildNodes = getChildNodeList(sourceNodeData);
    const targetNodeChildNodes = getChildNodeList(targetNodeData);

    const position = dragOverItem?.classList.contains(dropBefore) ? 'insertBefore' : 'insertAfter';
    const newData = moveElement(
      flatData.data,
      sourceNodeIndex,
      targetNodeIndex,
      sourceNodeChildNodes.length,
      targetNodeChildNodes.length,
      position,
    );
    flatData.data = newData;

    return {
      sourceNodeIndex,
      targetNodeIndex,
    };
  };

  const updateTreeData = (sourceNodeData: TreeNode, targetNodeParent: TreeNode) => {
    const nextLevel = (getNodeAttr(targetNodeParent, NODE_ATTRIBUTES.DEPTH) ?? -1) + 1;

    setNodeAttr(sourceNodeData, NODE_ATTRIBUTES.PARENT, targetNodeParent);
    setNodeAttr(sourceNodeData, NODE_ATTRIBUTES.DEPTH, nextLevel);
    setNodeAttr(sourceNodeData, NODE_ATTRIBUTES.IS_ROOT, nextLevel === 0);

    let orderIndex = 0;
    const setNodeAttribute = (nodeList: TreeNode[], level = 0, parentPath = '') => {
      for (let i = 0; i < nodeList.length; i++) {
        const node = nodeList[i];
        const path = parentPath !== '' ? `${parentPath}-${i}` : `${i}`;
        setNodeAttr(node, NODE_ATTRIBUTES.INDEX, orderIndex);
        setNodeAttr(node, NODE_ATTRIBUTES.ORDER, orderIndex);
        setNodeAttr(node, NODE_ATTRIBUTES.DEPTH, level);
        setNodeAttr(node, NODE_ATTRIBUTES.PATH, path);
        orderIndex += 1;
        const children = flatData.data.filter(item => getParentNode(item) === node) as TreeNode[];
        if (children.length > 0) {
          setNodeAttribute(children, level + 1, path);
        }
      }
    };

    const rootNodeList = getRootNodeList();
    setNodeAttribute(rootNodeList);
  };

  const dragSortData = (sourceId: string, targetId: string, savedOpenStates?: Map<TreeNode, boolean>) => {
    if (!props.dragSort || !isNodeSortable(sourceId, targetId)) {
      return;
    }

    const sourceNodeData = getSourceNodeByUID(sourceId);
    const targetNodeData = getSourceNodeByUID(targetId);

    if (!sourceNodeData || !targetNodeData) return;

    const sourceNodeParent = getParentNode(sourceNodeData);
    const targetNodeParent = getParentNode(targetNodeData);

    // 只允许同父节点下排序
    if (props.dragSortMode === 'next') {
      if (sourceNodeParent !== targetNodeParent) return;
    }

    const position = dragOverItem?.classList.contains(dropBefore) ? 'before' : 'after';

    // 1. 更新原始数据的 children 数组
    // 从源父节点移除
    removeFromParentChildren(sourceNodeData, sourceNodeParent);

    // 获取目标父节点的 children 数组
    let targetChildren: TreeNode[];
    if (!targetNodeParent) {
      targetChildren = props.data as TreeNode[];
    } else {
      if (!targetNodeParent[props.children]) {
        targetNodeParent[props.children] = [];
      }
      targetChildren = targetNodeParent[props.children] as TreeNode[];
    }

    // 在目标位置插入
    const targetIndexInParent = targetChildren.indexOf(targetNodeData);
    const insertIndex = position === 'before' ? targetIndexInParent : targetIndexInParent + 1;
    targetChildren.splice(insertIndex, 0, sourceNodeData);

    // 2. 更新 flatData 中的顺序
    const { sourceNodeIndex, targetNodeIndex } = sortNodeList(sourceNodeData, targetNodeData);

    // 3. 更新源父节点的 HAS_CHILD 属性
    updateHasChildAttr(sourceNodeParent);

    // 4. 重新计算节点属性
    updateTreeData(sourceNodeData, targetNodeParent);

    // 5. 恢复所有节点的展开状态
    if (savedOpenStates) {
      restoreAllOpenStates(savedOpenStates);
    }

    // 触发更新
    ctx.emit(EVENTS.NODE_DRAG_SORT, {
      sourceNode: sourceNodeData,
      targetNode: targetNodeData,
      sourceIndex: sourceNodeIndex,
      targetIndex: targetNodeIndex,
    });
  };

  /**
   * 将源节点作为目标节点的子节点
   */
  const dragAsChildNode = (sourceNodeId: string, targetNodeId: string, savedOpenStates?: Map<TreeNode, boolean>) => {
    const sourceNodeData = getSourceNodeByUID(sourceNodeId);
    const targetNodeData = getSourceNodeByUID(targetNodeId);

    if (!sourceNodeData || !targetNodeData) return;

    // 获取源节点的原父节点
    const sourceParent = getParentNode(sourceNodeData);

    // 1. 从源节点的原父节点 children 中移除
    removeFromParentChildren(sourceNodeData, sourceParent);

    // 2. 初始化目标节点的 children 数组（如果不存在）
    if (!targetNodeData[props.children]) {
      targetNodeData[props.children] = [];
    }

    // 3. 将源节点添加到目标节点的 children 末尾
    (targetNodeData[props.children] as TreeNode[]).push(sourceNodeData);

    // 4. 更新 flatData 中的顺序
    const sourceIndex = getNodeIndexByNode(sourceNodeData);
    const sourceChildNodes = getChildNodeList(sourceNodeData);

    // 从 flatData.data 中移除源节点及其子节点
    const elementsToMove = flatData.data.splice(sourceIndex, sourceChildNodes.length + 1);

    // 计算新的插入位置：目标节点之后，目标节点的所有子节点之后
    let newTargetIndex = flatData.data.indexOf(targetNodeData);
    const targetChildNodes = getChildNodeList(targetNodeData);
    const insertIndex = newTargetIndex + targetChildNodes.length + 1;

    // 插入到新位置
    flatData.data.splice(insertIndex, 0, ...elementsToMove);

    // 5. 更新源父节点的 HAS_CHILD 属性
    updateHasChildAttr(sourceParent);

    // 6. 更新目标节点的 HAS_CHILD 属性
    setNodeAttr(targetNodeData, NODE_ATTRIBUTES.HAS_CHILD, true);

    // 7. 重新计算所有节点的属性（深度、路径、索引等）
    updateTreeData(sourceNodeData, targetNodeData);

    // 8. 恢复所有节点的展开状态（不自动展开或收起任何节点）
    if (savedOpenStates) {
      restoreAllOpenStates(savedOpenStates);
    }
  };

  /**
   * 将源节点作为目标节点的同级节点插入
   */
  const dragAsSiblingNode = (sourceNodeId: string, targetNodeId: string, savedOpenStates?: Map<TreeNode, boolean>) => {
    const sourceNodeData = getSourceNodeByUID(sourceNodeId);
    const targetNodeData = getSourceNodeByUID(targetNodeId);

    if (!sourceNodeData || !targetNodeData) return;

    const sourceParent = getParentNode(sourceNodeData);
    const targetParent = getParentNode(targetNodeData);
    const position = dragOverItem?.classList.contains(dropBefore) ? 'before' : 'after';

    // 1. 从源节点的原父节点 children 中移除
    removeFromParentChildren(sourceNodeData, sourceParent);

    // 2. 获取目标父节点的 children 数组
    let targetChildren: TreeNode[];
    if (!targetParent) {
      // 目标是根节点
      targetChildren = props.data as TreeNode[];
    } else {
      if (!targetParent[props.children]) {
        targetParent[props.children] = [];
      }
      targetChildren = targetParent[props.children] as TreeNode[];
    }

    // 3. 计算插入位置并插入
    const targetIndexInParent = targetChildren.indexOf(targetNodeData);
    const insertIndex = position === 'before' ? targetIndexInParent : targetIndexInParent + 1;
    targetChildren.splice(insertIndex, 0, sourceNodeData);

    // 4. 更新 flatData 中的顺序
    const sourceIndex = getNodeIndexByNode(sourceNodeData);
    const sourceChildNodes = getChildNodeList(sourceNodeData);

    // 从 flatData.data 中移除源节点及其子节点
    const elementsToMove = flatData.data.splice(sourceIndex, sourceChildNodes.length + 1);

    // 重新获取目标节点在 flatData 中的索引（因为已经移除了源节点，索引可能变化）
    let newTargetIndex = flatData.data.indexOf(targetNodeData);
    const targetChildNodes = getChildNodeList(targetNodeData);

    // 计算插入位置
    let flatInsertIndex: number;
    if (position === 'before') {
      flatInsertIndex = newTargetIndex;
    } else {
      flatInsertIndex = newTargetIndex + targetChildNodes.length + 1;
    }

    // 插入到新位置
    flatData.data.splice(flatInsertIndex, 0, ...elementsToMove);

    // 5. 更新源父节点的 HAS_CHILD 属性
    updateHasChildAttr(sourceParent);

    // 6. 重新计算所有节点的属性
    updateTreeData(sourceNodeData, targetParent);

    // 7. 恢复所有节点的展开状态（不自动展开或收起任何节点）
    if (savedOpenStates) {
      restoreAllOpenStates(savedOpenStates);
    }
  };

  const handleTreeNodeDragLeave = (e: DragEvent) => {
    e.preventDefault();
    const targetNode = getTargetTreeNode(e);

    // 移除目标节点的缓存
    if (nodeRectMap.has(targetNode)) {
      nodeRectMap.delete(targetNode);
    }

    targetNode.classList.remove(`${resolveClassName('tree-drop-active')}`, `${resolveClassName('tree-drop-disabled')}`);
    targetNode.classList.remove(dropAfter, dropBefore, dropInner);
    ctx.emit(EVENTS.NODE_DRAG_LEAVE, e, targetNode);
  };

  onMounted(() => {
    if ((props.draggable || props.dragSort) && root.value) {
      const rootTree = root.value.$el as HTMLElement;
      rootTree.addEventListener('mousedown', handleTreeNodeMousedown);
      rootTree.addEventListener('dragstart', handleTreeNodeDragStart);
      rootTree.addEventListener('dragover', handleTreeNodeDragover);
      rootTree.addEventListener('dragleave', handleTreeNodeDragLeave);
      rootTree.addEventListener('drop', handleTreeNodeDrop);
    }
  });

  onUnmounted(() => {
    if ((props.draggable || props.dragSort) && root.value) {
      const rootTree = root.value.$el as HTMLElement;
      rootTree.removeEventListener('mousedown', handleTreeNodeMousedown);
      rootTree.removeEventListener('dragstart', handleTreeNodeDragStart);
      rootTree.removeEventListener('dragover', handleTreeNodeDragover);
      rootTree.removeEventListener('dragleave', handleTreeNodeDragLeave);
      rootTree.removeEventListener('drop', handleTreeNodeDrop);
    }
  });
};
