/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2025 Tencent.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) is licensed under the MIT License.
 */
import { computed, nextTick, onMounted, onUnmounted, Ref, ref, SetupContext, watch } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';

import { EVENTS, NODE_ATTRIBUTES, TreeEmitEventsType } from './constant';
import {
  DropType,
  TreeDataChangePayload,
  TreeDragSortPayload,
  TreeDropPayload,
  TreeNode,
  TreePropTypes,
} from './props';
import useNodeAttribute from './use-node-attribute';
import { IFlatData, moveTreeNodeById } from './util';

type TreeContext = {
  emit: SetupContext<typeof TreeEmitEventsType>['emit'];
};

type TreeRoot = {
  $el: HTMLElement;
};

type UseNodeDragOptions = {
  getTreeData?: () => TreeNode[];
  onTreeDataChange?: (payload: TreeDataChangePayload) => void;
};

type DragPosition = 'after' | 'before' | 'inside';

export default (
  props: TreePropTypes,
  ctx: TreeContext,
  root: Ref<TreeRoot>,
  flatData: IFlatData,
  options: UseNodeDragOptions = {},
) => {
  const { getSourceNodeByUID, getParentNode, extendNodeAttr, getNodeId } = useNodeAttribute(flatData, props);
  const { resolveClassName } = usePrefix();
  const isNeedCheckDraggable = computed(() => typeof props.disableDrag === 'function');
  const isNeedCheckDroppable = computed(() => typeof props.disableDrop === 'function');

  let dragNodeId = '';
  let currentDropType: DropType = 'move';
  let currentRelatedEl: HTMLElement | null = null;
  let currentWillInsertAfter = true;

  const isDragging = ref(false);

  const getContainer = () => root.value?.$el as HTMLElement | undefined;

  const getNodeEl = (eventTarget: EventTarget | null) => {
    if (!(eventTarget instanceof HTMLElement)) return null;
    const container = getContainer();
    const nodeEl = eventTarget.closest('[data-tree-node]') as HTMLElement | null;
    if (!nodeEl || !container?.contains(nodeEl)) return null;
    return nodeEl;
  };

  const getNodeContentEl = (targetEl: HTMLElement) =>
    (targetEl.querySelector(`.${resolveClassName('tree-node')}`) as HTMLElement) ?? targetEl;

  const getNodeRect = (targetEl: HTMLElement) => {
    const nodeRect = getNodeContentEl(targetEl).getBoundingClientRect();
    return nodeRect.height ? nodeRect : targetEl.getBoundingClientRect();
  };

  const getDropPosition = (dragEvent: DragEvent, targetEl: HTMLElement): DragPosition => {
    const rect = getNodeRect(targetEl);
    const offsetY = dragEvent.pageY - (window.scrollY + rect.top);
    const gapHeight = rect.height / 4;

    if (offsetY < gapHeight) {
      return 'before';
    }
    if (offsetY < rect.height - gapHeight) {
      return 'inside';
    }
    return 'after';
  };

  const getDropInfo = (dropPosition: DragPosition): { dropType: DropType; willInsertAfter: boolean } => ({
    dropType: dropPosition === 'inside' ? 'child' : props.dragSort ? 'sort' : 'move',
    willInsertAfter: dropPosition === 'after',
  });

  const getNodeIdByEl = (nodeEl: HTMLElement | null) => nodeEl?.getAttribute('data-tree-node') ?? '';

  const isDragDisabled = (nodeId: string) => {
    const nodeData = getSourceNodeByUID(nodeId);
    if (!nodeData) return true;
    if (isNeedCheckDraggable.value && props.disableDrag?.(nodeData)) return true;
    return nodeData.draggable === false;
  };

  const isDescendantTarget = (draggedData: TreeNode, relatedData: TreeNode) => {
    let parent = getParentNode(relatedData) as TreeNode | null;
    while (parent) {
      if (parent === draggedData) return true;
      parent = getParentNode(parent) as TreeNode | null;
    }
    return false;
  };

  const isDropDisabled = (draggedId: string, relatedId: string, dropType: DropType) => {
    const draggedData = getSourceNodeByUID(draggedId);
    const relatedData = extendNodeAttr(getSourceNodeByUID(relatedId));
    if (!draggedData || !relatedData) return true;
    return !!(isNeedCheckDroppable.value && props.disableDrop?.(draggedData, dropType, relatedData));
  };

  const clearDropClasses = () => {
    getContainer()
      ?.querySelectorAll(
        [
          `.${resolveClassName('tree-drop-before')}`,
          `.${resolveClassName('tree-drop-after')}`,
          `.${resolveClassName('tree-drop-inner')}`,
          `.${resolveClassName('tree-drop-disabled')}`,
        ].join(','),
      )
      .forEach((el: Element) => {
        el.classList.remove(
          resolveClassName('tree-drop-before'),
          resolveClassName('tree-drop-after'),
          resolveClassName('tree-drop-inner'),
          resolveClassName('tree-drop-disabled'),
        );
        (el as HTMLElement).style.removeProperty('--drop-line-left');
      });
  };

  const getDropLineLeft = (targetEl: HTMLElement) => {
    const targetRect = targetEl.getBoundingClientRect();
    const nodeRect = getNodeContentEl(targetEl).getBoundingClientRect();
    return Math.max(nodeRect.left - targetRect.left, 0);
  };

  const updateDropClass = (targetEl: HTMLElement, dropPosition: DragPosition, disabled = false) => {
    clearDropClasses();
    targetEl.style.setProperty('--drop-line-left', `${getDropLineLeft(targetEl)}px`);
    if (disabled) {
      targetEl.classList.add(resolveClassName('tree-drop-disabled'));
      return;
    }
    const className =
      dropPosition === 'before'
        ? resolveClassName('tree-drop-before')
        : dropPosition === 'after'
          ? resolveClassName('tree-drop-after')
          : resolveClassName('tree-drop-inner');
    targetEl.classList.add(className);
  };

  const emitTreeDataChange = (payload: TreeDataChangePayload | null) => {
    if (!payload) return null;
    options.onTreeDataChange?.(payload);
    return payload;
  };

  const moveNode = (sourceNodeData: TreeNode, targetNodeData: TreeNode, dropType: DropType, willInsertAfter = true) =>
    emitTreeDataChange(
      moveTreeNodeById(
        options.getTreeData?.() ?? props.data,
        `${getNodeId(sourceNodeData)}`,
        `${getNodeId(targetNodeData)}`,
        props.nodeKey || NODE_ATTRIBUTES.UUID,
        props.children,
        { dropType, willInsertAfter },
      ),
    );

  const cleanup = () => {
    dragNodeId = '';
    currentDropType = 'move';
    currentRelatedEl = null;
    currentWillInsertAfter = true;
    isDragging.value = false;
    clearDropClasses();
  };

  const canDrop = (draggedId: string, relatedId: string, dropType: DropType) => {
    const draggedData = getSourceNodeByUID(draggedId);
    const relatedData = getSourceNodeByUID(relatedId);
    if (!draggedData || !relatedData || draggedId === relatedId || isDescendantTarget(draggedData, relatedData)) {
      return false;
    }
    if (
      dropType === 'sort' &&
      props.dragSortMode === 'next' &&
      getParentNode(draggedData) !== getParentNode(relatedData)
    ) {
      return false;
    }
    return !isDropDisabled(draggedId, relatedId, dropType);
  };

  const handleDragStart = (event: DragEvent) => {
    if (!(props.draggable || props.dragSort)) return;

    const nodeEl = getNodeEl(event.target);
    const nodeId = getNodeIdByEl(nodeEl);
    if (!nodeEl || !nodeId || isDragDisabled(nodeId)) {
      event.preventDefault();
      nodeEl?.classList.add(resolveClassName('tree-drag-disabled'));
      return;
    }

    event.stopPropagation();
    dragNodeId = nodeId;
    currentDropType = props.dragSort ? 'sort' : 'move';
    currentRelatedEl = null;
    currentWillInsertAfter = true;
    isDragging.value = true;
    nodeEl.classList.add(resolveClassName('tree-drag'));

    try {
      event.dataTransfer?.setData('text/plain', '');
      event.dataTransfer?.setDragImage(nodeEl, 0, 0);
    } catch (e) {
      // empty
    }

    ctx.emit(EVENTS.NODE_DRAG_START, extendNodeAttr(getSourceNodeByUID(nodeId)), event);
  };

  const handleDragOver = (event: DragEvent) => {
    if (!dragNodeId) return;

    const relatedEl = getNodeEl(event.target);
    const relatedId = getNodeIdByEl(relatedEl);
    if (!relatedEl || !relatedId) return;

    const dropPosition = getDropPosition(event, relatedEl);
    const { dropType, willInsertAfter } = getDropInfo(dropPosition);
    const droppable = canDrop(dragNodeId, relatedId, dropType);

    event.stopPropagation();
    event.preventDefault();
    updateDropClass(relatedEl, dropPosition, !droppable);

    if (!droppable) return;

    currentDropType = dropType;
    currentRelatedEl = relatedEl;
    currentWillInsertAfter = willInsertAfter;
    ctx.emit(EVENTS.NODE_DRAG_OVER, extendNodeAttr(getSourceNodeByUID(relatedId)), event, relatedEl);
  };

  const handleDragLeave = (event: DragEvent) => {
    if (!dragNodeId) return;

    const nodeEl = getNodeEl(event.target);
    if (!nodeEl) return;

    const relatedTarget = event.relatedTarget;
    if (relatedTarget instanceof Node && nodeEl.contains(relatedTarget)) return;

    const nodeId = getNodeIdByEl(nodeEl);
    clearDropClasses();
    if (nodeId) {
      ctx.emit(EVENTS.NODE_DRAG_LEAVE, extendNodeAttr(getSourceNodeByUID(nodeId)), event);
    }
  };

  const handleDrop = (event: DragEvent) => {
    if (!dragNodeId) return;

    const targetEl = getNodeEl(event.target) ?? currentRelatedEl;
    const targetId = getNodeIdByEl(targetEl);
    event.stopPropagation();
    event.preventDefault();

    const dropPosition = targetEl ? getDropPosition(event, targetEl) : 'inside';
    const { dropType, willInsertAfter } = getDropInfo(dropPosition);
    const sourceNodeData = getSourceNodeByUID(dragNodeId);
    const targetNodeData = getSourceNodeByUID(targetId);
    if (!sourceNodeData || !targetNodeData || !targetEl || !canDrop(dragNodeId, targetId, dropType)) {
      cleanup();
      return;
    }

    currentDropType = dropType;
    currentWillInsertAfter = willInsertAfter;
    const payload = moveNode(sourceNodeData, targetNodeData, currentDropType, currentWillInsertAfter);
    if (!payload) {
      cleanup();
      return;
    }

    if (currentDropType === 'sort') {
      const dragSortPayload: TreeDragSortPayload = {
        sourceNode: sourceNodeData,
        targetNode: targetNodeData,
        sourceIndex: payload.sourceIndex,
        targetIndex: payload.targetIndex,
        data: payload.data,
        parentNode: payload.parentNode,
        oldParentNode: payload.oldParentNode,
        dropType: payload.dropType,
      };
      ctx.emit(EVENTS.NODE_DRAG_SORT, dragSortPayload);
    }

    const dropPayload: TreeDropPayload = {
      event,
      element: targetEl,
      targetNode: extendNodeAttr(targetNodeData),
      sourceNode: sourceNodeData,
      data: payload.data,
      parentNode: payload.parentNode,
      oldParentNode: payload.oldParentNode,
      dropType: payload.dropType,
      sourceIndex: payload.sourceIndex,
      targetIndex: payload.targetIndex,
    };
    ctx.emit(EVENTS.NODE_DROP, dropPayload);
    cleanup();
  };

  const handleDragEnd = (event: DragEvent) => {
    if (!dragNodeId) return;

    const nodeEl = getNodeEl(event.target);
    const nodeId = getNodeIdByEl(nodeEl) || dragNodeId;
    event.stopPropagation();
    nodeEl?.classList.remove(resolveClassName('tree-drag'));

    if (nodeId) {
      ctx.emit(EVENTS.NODE_DRAG_LEAVE, extendNodeAttr(getSourceNodeByUID(nodeId)), event);
    }
    cleanup();
  };

  const bindNativeDragEvents = () => {
    const container = getContainer();
    if (!container) return;
    container.addEventListener('dragstart', handleDragStart);
    container.addEventListener('dragover', handleDragOver);
    container.addEventListener('dragleave', handleDragLeave);
    container.addEventListener('drop', handleDrop);
    container.addEventListener('dragend', handleDragEnd);
  };

  const unbindNativeDragEvents = () => {
    const container = getContainer();
    if (!container) return;
    container.removeEventListener('dragstart', handleDragStart);
    container.removeEventListener('dragover', handleDragOver);
    container.removeEventListener('dragleave', handleDragLeave);
    container.removeEventListener('drop', handleDrop);
    container.removeEventListener('dragend', handleDragEnd);
  };

  const syncNativeDragEvents = () => {
    unbindNativeDragEvents();
    clearDropClasses();
    if (props.draggable || props.dragSort) {
      bindNativeDragEvents();
    }
  };

  onMounted(() => {
    nextTick(() => syncNativeDragEvents());
  });

  watch(
    () => [props.draggable, props.dragSort],
    () => nextTick(() => syncNativeDragEvents()),
  );

  onUnmounted(() => {
    unbindNativeDragEvents();
    clearDropClasses();
  });

  return {
    isDragging,
  };
};
