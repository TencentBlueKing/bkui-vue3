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
import { computed, onMounted, onUnmounted } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import throttle from 'lodash/throttle';

import { EVENTS, NODE_ATTRIBUTES } from './constant';
import { TreeNode, TreePropTypes } from './props';
import useNodeAttribute from './use-node-attribute';

export default (props: TreePropTypes, ctx, root?, flatData?) => {
  const {
    getSourceNodeByUID,
    getParentNodeData,
    getNodeParentIdById,
    extendNodeAttr,
    getNodeAttrById,
    isRootNode,
    setNodeAttrById,
  } = useNodeAttribute(flatData, props);
  const { resolveClassName } = usePrefix();
  const isNeedCheckDraggable = computed(() => typeof props.disableDrag === 'function');
  const isNeedCheckDroppable = computed(() => typeof props.disableDrop === 'function');
  const dragThreshold = props.dragThreshold || 0.2; // 新增配置项，默认值为 0.2
  let dragNodeId = '';
  let draggedItem = null;

  let nodeRectMap = new WeakMap();

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
    if (data.draggable === false || (isNeedCheckDraggable.value && props.disableDrag(data))) {
      targetNode.classList.add(`${resolveClassName('tree-drag-disabled')}`);
      return;
    }
    targetNode.setAttribute('draggable', 'true');
    targetNode.addEventListener('mouseup', handleTreeNodeMouseup);
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
    if (isNeedCheckDroppable.value && props?.disableDrop(data)) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.dropEffect = 'none';
      targetNode.classList.add(`${resolveClassName('tree-drop-disabled')}`);
      return;
    }
    targetNode.classList.add(`${resolveClassName('tree-drop-active')}`);
    let sourceNodeId = e.dataTransfer.getData('node-id');
    sourceNodeId = dragNodeId;

    const targetNodeId = targetNode.getAttribute('data-tree-node');

    const transferEffect = isNodeSortable(sourceNodeId, targetNodeId) ? 'move' : 'none';
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
    const data = extendNodeAttr(getNodeByTargetTreeNode(targetNode));
    if (isNeedCheckDroppable.value && props.disableDrop(data)) {
      return;
    }

    const sourceNodeId = dragNodeId;
    const targetNodeId = targetNode.getAttribute('data-tree-node');

    if (sourceNodeId !== targetNodeId) {
      if (dragOverItem?.classList.contains(dropInner)) {
        Reflect.apply(dragAsChildNode, this, [sourceNodeId, targetNodeId]);
      } else if (dragOverItem?.classList.contains(dropAfter) || dragOverItem?.classList.contains(dropBefore)) {
        Reflect.apply(dragSortData, this, [sourceNodeId, targetNodeId]);
      }
      ctx.emit(EVENTS.NODE_DROP, e, targetNode, data);
    }

    nodeRectMap = new WeakMap();
    dragOverItem?.classList.remove(dropAfter, dropBefore, dropInner);
    dragOverItem = null;
  };

  const isNodeSortable = (sourceId: string, targetId: string) => {
    return sourceId !== targetId;
  };

  const dragSortData = (sourceId: string, targetId: string) => {
    if (!props.dragSort || !isNodeSortable(sourceId, targetId)) {
      return;
    }

    const sourceNodeData = getSourceNodeByUID(sourceId);
    const targetNodeData = getSourceNodeByUID(targetId);
    if (!sourceNodeData || !targetNodeData) return;

    const sourceNodeParent = getParentNodeData(sourceId);
    const targetNodeParent = getParentNodeData(targetId);
    if (!sourceNodeParent || !targetNodeParent) return;

    // 只允许同父节点下排序
    if (props.dragSortMode === 'next') {
      if (sourceNodeParent !== targetNodeParent) return;
    }

    const childrenKey = props.children;
    const sourceSiblings = sourceNodeParent[childrenKey];
    const targetSlibings = targetNodeParent[childrenKey];

    if (!Array.isArray(sourceSiblings)) return;

    let sourceNodeIndex = sourceSiblings.findIndex(item => item === sourceNodeData);
    let targetNodeIndex = targetSlibings.findIndex(item => item === targetNodeData);
    if (sourceNodeIndex === -1 || targetNodeIndex === -1) return;

    // 先移除源节点
    sourceSiblings.splice(sourceNodeIndex, 1);

    // 计算插入位置
    if (dragOverItem?.classList.contains(dropAfter)) {
      // 如果源节点在目标节点前面，移除后 targetNodeIndex 需要减 1
      if (sourceNodeIndex < targetNodeIndex) {
        targetNodeIndex = targetNodeIndex - 1;
      }
      targetNodeIndex = targetNodeIndex + 1;
    } else if (dragOverItem?.classList.contains(dropBefore)) {
      // 如果源节点在目标节点后面，移除后 targetNodeIndex 不变
      if (sourceNodeIndex > targetNodeIndex) {
        // do nothing
      }
    }

    // 插入节点
    targetSlibings.splice(targetNodeIndex, 0, sourceNodeData);

    // 更新所有兄弟节点的 INDEX
    targetSlibings.forEach((item, idx) => {
      const nodeId = getNodeAttrById(item[NODE_ATTRIBUTES.UUID], NODE_ATTRIBUTES.UUID) || item[NODE_ATTRIBUTES.UUID];
      if (nodeId) {
        setNodeAttrById(nodeId, NODE_ATTRIBUTES.INDEX, idx);
      }
    });

    sourceSiblings.forEach((item, idx) => {
      const nodeId = getNodeAttrById(item[NODE_ATTRIBUTES.UUID], NODE_ATTRIBUTES.UUID) || item[NODE_ATTRIBUTES.UUID];
      if (nodeId) {
        setNodeAttrById(nodeId, NODE_ATTRIBUTES.INDEX, idx);
      }
    });

    // 触发更新
    ctx.emit(EVENTS.NODE_DRAG_SORT, {
      sourceNode: sourceNodeData,
      targetNode: targetNodeData,
      sourceIndex: sourceNodeIndex,
      targetIndex: targetNodeIndex,
      targetSlibings,
    });
  };

  const dragAsChildNode = (sourceNodeId: string, targetNodeId: string) => {
    const sourceNodeData = getSourceNodeByUID(sourceNodeId);
    const targetNodeData = getSourceNodeByUID(targetNodeId);

    let parentNode = null;
    if (isRootNode(sourceNodeId)) {
      parentNode = props.data;
    } else {
      const sourceNodeParentId = getNodeParentIdById(sourceNodeId);
      if (sourceNodeParentId !== undefined && sourceNodeParentId !== null) {
        parentNode = getSourceNodeByUID(sourceNodeParentId);
        const sourceNodeIndex = getNodeAttrById(sourceNodeId, NODE_ATTRIBUTES.INDEX);
        parentNode?.[props.children].splice(sourceNodeIndex, 1);
      }
    }

    if (!targetNodeData[props.children]) {
      targetNodeData[props.children] = [];
    }

    (targetNodeData[props.children] as TreeNode[]).unshift(sourceNodeData);
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
