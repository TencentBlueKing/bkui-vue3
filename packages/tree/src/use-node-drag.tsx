/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2025 Tencent.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) is licensed under the MIT License.
 */
import { computed, nextTick, onMounted, onUnmounted, Ref, ref, watch } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import Sortable from 'sortablejs';

import { EVENTS, NODE_ATTRIBUTES } from './constant';
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
  emit: (event: EVENTS, ...args: unknown[]) => void;
};

type TreeRoot = {
  $el: HTMLElement;
};

type UseNodeDragOptions = {
  getTreeData?: () => TreeNode[];
  onTreeDataChange?: (payload: TreeDataChangePayload) => void;
};

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
  const dragThreshold = props.dragThreshold || 0.2;

  let sortableInstance: Sortable.Instance | null = null;
  let dragNodeId = '';
  let currentDropType: DropType = 'move';
  let currentRelatedId = '';
  let currentRelatedEl: HTMLElement | null = null;
  let currentWillInsertAfter = true;
  let indicatorEl: HTMLDivElement | null = null;

  const isDragging = ref(false);

  const createIndicator = () => {
    if (indicatorEl) return indicatorEl;
    indicatorEl = document.createElement('div');
    indicatorEl.className = resolveClassName('tree-drop-indicator');
    document.body.appendChild(indicatorEl);
    return indicatorEl;
  };

  const removeIndicator = () => {
    indicatorEl?.remove();
    indicatorEl = null;
  };

  const hideIndicator = () => {
    if (indicatorEl) {
      indicatorEl.style.display = 'none';
    }
  };

  const updateIndicator = (targetEl: HTMLElement, dropType: DropType, willInsertAfter: boolean) => {
    const indicator = createIndicator();
    const rect = targetEl.getBoundingClientRect();

    if (dropType === 'child') {
      indicator.className = `${resolveClassName('tree-drop-indicator')} ${resolveClassName('tree-drop-inner')}`;
      Object.assign(indicator.style, {
        display: '',
        position: 'fixed',
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        pointerEvents: 'none',
        zIndex: '9999',
      });
      return;
    }

    const lineTop = willInsertAfter ? rect.bottom : rect.top;
    indicator.className = `${resolveClassName('tree-drop-indicator')} ${resolveClassName('tree-drop-line')}`;
    Object.assign(indicator.style, {
      display: '',
      position: 'fixed',
      left: `${rect.left}px`,
      top: `${lineTop - 1}px`,
      width: `${rect.width}px`,
      height: '2px',
      pointerEvents: 'none',
      zIndex: '9999',
    });
  };

  const calcDropType = (clientY: number, targetEl: HTMLElement): DropType => {
    if (props.dragSort) {
      return 'sort';
    }

    const rect = targetEl.getBoundingClientRect();
    const offsetY = clientY - rect.top;
    const threshold = rect.height * dragThreshold;
    if (offsetY < threshold || offsetY > rect.height - threshold) {
      return 'move';
    }
    return 'child';
  };

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

  const restoreSortableDOM = (evt: Sortable.SortableEvent) => {
    const { item, from, to, oldIndex, newIndex } = evt;
    if (oldIndex === undefined || !from) return;

    const sameContainer = from === to;
    if (sameContainer && oldIndex === newIndex) return;

    if (!sameContainer && to && item.parentNode === to) {
      to.removeChild(item);
    }

    if (sameContainer && newIndex !== undefined && newIndex < oldIndex) {
      from.insertBefore(item, from.children[oldIndex + 1] || null);
    } else {
      from.insertBefore(item, from.children[oldIndex] || null);
    }
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
    currentRelatedId = '';
    currentRelatedEl = null;
    currentWillInsertAfter = true;
    isDragging.value = false;
    removeIndicator();
  };

  const destroySortable = () => {
    sortableInstance?.destroy();
    sortableInstance = null;
  };

  const initSortable = () => {
    if (!root.value) return;
    const container = root.value.$el as HTMLElement;
    if (!container) return;

    destroySortable();
    sortableInstance = Sortable.create(container, {
      animation: 200,
      draggable: '[data-tree-node]',
      ghostClass: resolveClassName('tree-ghost'),
      chosenClass: resolveClassName('tree-chosen'),
      dragClass: resolveClassName('tree-drag'),
      filter: `.${resolveClassName('tree-drag-disabled')}`,
      onStart: (evt: Sortable.SortableEvent) => {
        const nodeId = (evt.item as HTMLElement).getAttribute('data-tree-node');
        if (!nodeId || isDragDisabled(nodeId)) {
          return;
        }

        dragNodeId = nodeId;
        currentDropType = props.dragSort ? 'sort' : 'move';
        currentRelatedId = '';
        currentRelatedEl = null;
        currentWillInsertAfter = true;
        isDragging.value = true;
        ctx.emit(EVENTS.NODE_DRAG_START, extendNodeAttr(getSourceNodeByUID(nodeId)), evt);
      },
      onMove: (evt: Sortable.MoveEvent, originalEvent: Event): -1 | boolean | void => {
        const relatedEl = evt.related as HTMLElement;
        const draggedEl = evt.dragged as HTMLElement;
        const relatedId = relatedEl?.getAttribute('data-tree-node');
        const draggedId = draggedEl?.getAttribute('data-tree-node');
        if (!relatedId || !draggedId) return -1;

        const draggedData = getSourceNodeByUID(draggedId);
        const relatedData = getSourceNodeByUID(relatedId);
        if (!draggedData || !relatedData || draggedId === relatedId || isDescendantTarget(draggedData, relatedData)) {
          return -1;
        }

        const dropType = calcDropType((originalEvent as MouseEvent).clientY, relatedEl);
        if (
          dropType === 'sort' &&
          props.dragSortMode === 'next' &&
          getParentNode(draggedData) !== getParentNode(relatedData)
        ) {
          return -1;
        }
        if (isDropDisabled(draggedId, relatedId, dropType)) return -1;

        currentDropType = dropType;
        currentRelatedId = relatedId;
        currentRelatedEl = relatedEl;
        currentWillInsertAfter = evt.willInsertAfter ?? true;
        updateIndicator(relatedEl, dropType, currentWillInsertAfter);
        ctx.emit(EVENTS.NODE_DRAG_OVER, extendNodeAttr(relatedData), originalEvent, relatedEl);
        return true;
      },
      onEnd: (evt: Sortable.SortableEvent) => {
        restoreSortableDOM(evt);
        hideIndicator();

        const sourceNodeData = getSourceNodeByUID(dragNodeId);
        const targetNodeData = getSourceNodeByUID(currentRelatedId);
        const targetEl = currentRelatedEl;
        if (!sourceNodeData || !targetNodeData || !targetEl || dragNodeId === currentRelatedId) {
          cleanup();
          return;
        }
        if (isDropDisabled(dragNodeId, currentRelatedId, currentDropType)) {
          cleanup();
          return;
        }

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
          event: evt,
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
      },
      onUnchoose: (evt: Sortable.SortableEvent) => {
        const nodeId = (evt.item as HTMLElement)?.getAttribute('data-tree-node') || dragNodeId;
        const nodeData = nodeId ? getSourceNodeByUID(nodeId) : null;
        if (nodeData) {
          ctx.emit(EVENTS.NODE_DRAG_LEAVE, extendNodeAttr(nodeData), evt);
        }
      },
    });
  };

  const syncSortable = () => {
    if (props.draggable || props.dragSort) {
      initSortable();
    } else {
      destroySortable();
      removeIndicator();
    }
  };

  onMounted(() => {
    if (props.draggable || props.dragSort) {
      nextTick(() => initSortable());
    }
  });

  watch(
    () => [props.draggable, props.dragSort],
    () => nextTick(() => syncSortable()),
  );

  onUnmounted(() => {
    destroySortable();
    removeIndicator();
  });

  return {
    isDragging,
  };
};
