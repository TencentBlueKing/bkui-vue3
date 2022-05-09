
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
import { onMounted, onUnmounted } from 'vue';

import { NODE_ATTRIBUTES } from './constant';
import { TreePropTypes } from './props';
import useNodeAttribute from './use-node-attribute';

export default (props: TreePropTypes, root?, flatData?) => {
  const {
    getSourceNodeByUID,
    getNodeParentIdById,
    getParentNodeData,
    getNodeAttr,
    isRootNode,
  } = useNodeAttribute(flatData, props);

  const getTargetTreeNode = (e: MouseEvent) => {
    const target = (e.target as HTMLElement);
    return target.closest('[data-tree-node]') as HTMLElement;
  };

  const handleTreeNodeMouseup = (e: MouseEvent) => {
    const targetNode = getTargetTreeNode(e);
    targetNode.removeEventListener('mouseup', handleTreeNodeMouseup);
  };

  const handleTreeNodeMousedown = (e: MouseEvent) => {
    const targetNode = getTargetTreeNode(e);
    targetNode.setAttribute('draggable', 'true');
    targetNode.addEventListener('mouseup', handleTreeNodeMouseup);
  };

  const handleTreeNodeDragover = (e: DragEvent) => {
    e.preventDefault();

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.dropEffect = 'move';
  };

  const handleTreeNodeDragStart = (e: DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.dropEffect = 'move';
    const targetNode = getTargetTreeNode(e);
    e.dataTransfer.setData('text/plain', '');
    e.dataTransfer.setData('node-id', targetNode.getAttribute('data-tree-node'));
  };

  const handleTreeNodeDrop = (e: DragEvent) => {
    /** firefox的drop事件必须调用preventDefault()和stopPropagation(), 否则会自动重定向 */
    e.preventDefault();
    e.stopPropagation();
    const targetNode = getTargetTreeNode(e);

    const sourceNodeId = e.dataTransfer.getData('node-id');
    const targetNodeId = targetNode.getAttribute('data-tree-node');

    Reflect.apply(props.dragSort ? dragSortData : dragAsChildNode, this, [sourceNodeId, targetNodeId]);
  };

  const dragSortData = (sourceId: string, tartgetId: string) => {
    const sourceNodeData = JSON.parse(JSON.stringify(getSourceNodeByUID(sourceId)));
    const targetNodeData = JSON.parse(JSON.stringify(getSourceNodeByUID(tartgetId)));

    const sourceNodeParent = getParentNodeData(sourceId);
    const targetNodeParent = getParentNodeData(tartgetId);

    const sourceNodeIndex = getNodeAttr({ [NODE_ATTRIBUTES.UUID]: sourceId }, NODE_ATTRIBUTES.INDEX);
    const targetNodeIndex = getNodeAttr({ [NODE_ATTRIBUTES.UUID]: tartgetId }, NODE_ATTRIBUTES.INDEX);

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

  onMounted(() => {
    if (props.draggable && root.value) {
      const rootTree = (root.value.$el as HTMLElement);
      rootTree.addEventListener('mousedown', handleTreeNodeMousedown);
      rootTree.addEventListener('dragstart', handleTreeNodeDragStart);
      rootTree.addEventListener('dragover', handleTreeNodeDragover);
      rootTree.addEventListener('drop', handleTreeNodeDrop);
    }
  });

  onUnmounted(() => {
    if (props.draggable && root.value) {
      const rootTree = (root.value.$el as HTMLElement);
      rootTree.removeEventListener('mousedown', handleTreeNodeMousedown);
      rootTree.removeEventListener('dragstart', handleTreeNodeDragStart);
      rootTree.removeEventListener('dragover', handleTreeNodeDragover);
      rootTree.removeEventListener('drop', handleTreeNodeDrop);
    }
  });
};
