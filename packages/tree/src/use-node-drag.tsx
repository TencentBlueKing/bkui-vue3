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

import { EVENTS, NODE_ATTRIBUTES } from './constant';
import { TreePropTypes } from './props';
import useNodeAttribute from './use-node-attribute';

export default (props: TreePropTypes, ctx, root?, flatData?) => {
  const {
    getSourceNodeByUID,
    getNodeParentIdById,
    getParentNodeData,
    extendNodeAttr,
    getNodeAttr,
    getNodePath,
    isRootNode,
  } = useNodeAttribute(flatData, props);
  const { resolveClassName } = usePrefix();
  const isNeedCheckDraggable = computed(() => typeof props.disableDrag === 'function');
  const isNeedCheckDroppable = computed(() => typeof props.disableDrop === 'function');
  let dragNodeId = '';
  const getTargetTreeNode = (e: MouseEvent) => {
    const target = (e.target as HTMLElement);
    return target.closest('[data-tree-node]') as HTMLElement;
  };
  const getNodeByTargetTreeNode = (targetNode) => {
    const uid = targetNode?.dataset?.treeNode;
    return getSourceNodeByUID(uid);
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

  const handleTreeNodeDragover = (e: DragEvent) => {
    e.preventDefault();
    const targetNode = getTargetTreeNode(e);
    const data = extendNodeAttr(getNodeByTargetTreeNode(targetNode));

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
  };

  const handleTreeNodeDragStart = (e: DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.dropEffect = 'move';
    const targetNode = getTargetTreeNode(e);
    e.dataTransfer.setData('text/plain', '');
    const nodeId = targetNode.getAttribute('data-tree-node');
    dragNodeId = nodeId;
    e.dataTransfer.setData('node-id', nodeId);
    ctx.emit(EVENTS.NODE_DRAG_START, e, targetNode);
  };

  const handleTreeNodeDrop = (e: DragEvent) => {
    /** firefox的drop事件必须调用preventDefault()和stopPropagation(), 否则会自动重定向 */
    e.preventDefault();
    e.stopPropagation();
    const targetNode = getTargetTreeNode(e);
    targetNode.classList.remove(`${resolveClassName('tree-drop-active')}`, `${resolveClassName('tree-drop-disabled')}`);
    const data = extendNodeAttr(getNodeByTargetTreeNode(targetNode));
    if (isNeedCheckDroppable.value && props.disableDrop(data)) {
      return;
    }
    const sourceNodeId = dragNodeId; // e.dataTransfer.getData('node-id');
    const targetNodeId = targetNode.getAttribute('data-tree-node');
    Reflect.apply(props.dragSort ? dragSortData : dragAsChildNode, this, [sourceNodeId, targetNodeId]);
    ctx.emit(EVENTS.NODE_DROP, e, targetNode, data);
  };

  const isNodeSortable = (sourceId: string, targetId: string) => {
    const sourcePath: string = getNodePath({ [NODE_ATTRIBUTES.UUID]: sourceId });
    const targetPath: string = getNodePath({ [NODE_ATTRIBUTES.UUID]: targetId });
    // if (!sourcePath || targetPath) {
    //   return false;
    // }
    const sourceParentNodeId = getNodeParentIdById(sourceId);
    const targetParentNode = getNodeParentIdById(targetId);

    if (sourceParentNodeId === targetParentNode) {
      return true;
    }

    return sourcePath.indexOf(targetPath) === -1 && targetPath.indexOf(sourcePath) === -1;
  };

  const dragSortData = (sourceId: string, targetId: string) => {
    if (!isNodeSortable(sourceId, targetId)) {
      return;
    }

    const sourceNodeData = JSON.parse(JSON.stringify(getSourceNodeByUID(sourceId)));
    const targetNodeData = JSON.parse(JSON.stringify(getSourceNodeByUID(targetId)));

    const sourceNodeParent = getParentNodeData(sourceId);
    const targetNodeParent = getParentNodeData(targetId);

    const sourceNodeIndex = getNodeAttr({ [NODE_ATTRIBUTES.UUID]: sourceId }, NODE_ATTRIBUTES.INDEX);
    const targetNodeIndex = getNodeAttr({ [NODE_ATTRIBUTES.UUID]: targetId }, NODE_ATTRIBUTES.INDEX);

    sourceNodeParent?.[props.children].splice(sourceNodeIndex, 1, targetNodeData);
    targetNodeParent?.[props.children].splice(targetNodeIndex, 1, sourceNodeData);
  };

  const dragAsChildNode = (sourceNodeId: string, targetNodeId: string) => {
    const sourceNodeData = getSourceNodeByUID(sourceNodeId);
    const targetNodeData = getSourceNodeByUID(targetNodeId);

    let parentNode = null;
    if (isRootNode({ [NODE_ATTRIBUTES.UUID]: sourceNodeId })) {
      parentNode = props.data;
    } else {
      const sourceNodeParentId = getNodeParentIdById(sourceNodeId);
      if (sourceNodeParentId !== undefined && sourceNodeParentId !== null) {
        parentNode = getSourceNodeByUID(sourceNodeParentId);
        const sourceNodeIndex = getNodeAttr({ [NODE_ATTRIBUTES.UUID]: sourceNodeId }, NODE_ATTRIBUTES.INDEX);
        parentNode?.[props.children].splice(sourceNodeIndex, 1);
      }
    }

    if (!targetNodeData[props.children]) {
      targetNodeData[props.children] = [];
    }

    targetNodeData[props.children].unshift(sourceNodeData);
  };
  const handleTreeNodeDragLeave = (e: DragEvent) => {
    e.preventDefault();
    const targetNode = getTargetTreeNode(e);
    targetNode.classList.remove(`${resolveClassName('tree-drop-active')}`, `${resolveClassName('tree-drop-disabled')}`);
    ctx.emit(EVENTS.NODE_DRAG_LEAVE, e, targetNode);
  };

  onMounted(() => {
    if (props.draggable && root.value) {
      const rootTree = (root.value.$el as HTMLElement);
      rootTree.addEventListener('mousedown', handleTreeNodeMousedown);
      rootTree.addEventListener('dragstart', handleTreeNodeDragStart);
      rootTree.addEventListener('dragover', handleTreeNodeDragover);
      rootTree.addEventListener('dragleave', handleTreeNodeDragLeave);
      rootTree.addEventListener('drop', handleTreeNodeDrop);
    }
  });

  onUnmounted(() => {
    if (props.draggable && root.value) {
      const rootTree = (root.value.$el as HTMLElement);
      rootTree.removeEventListener('mousedown', handleTreeNodeMousedown);
      rootTree.removeEventListener('dragstart', handleTreeNodeDragStart);
      rootTree.removeEventListener('dragover', handleTreeNodeDragover);
      rootTree.removeEventListener('dragleave', handleTreeNodeDragLeave);
      rootTree.removeEventListener('drop', handleTreeNodeDrop);
    }
  });
};
