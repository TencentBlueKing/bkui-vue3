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
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
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
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import Sortable from 'sortablejs';

import { EVENTS, NODE_ATTRIBUTES } from './constant';
import { DropType, TreeNode, TreePropTypes } from './props';
import useNodeAttribute from './use-node-attribute';

export default (props: TreePropTypes, ctx, root?, flatData?) => {
  const { getSourceNodeByUID, getParentNode, extendNodeAttr, setNodeAttr, getNodeAttr, getRootNodeList } =
    useNodeAttribute(flatData, props);
  const { resolveClassName } = usePrefix();
  const isNeedCheckDraggable = computed(() => typeof props.disableDrag === 'function');
  const isNeedCheckDroppable = computed(() => typeof props.disableDrop === 'function');
  const dragThreshold = props.dragThreshold || 0.2;

  let sortableInstance: Sortable | null = null;
  let dragNodeId = '';

  /** 当前拖拽的放置类型，在 onMove 中实时计算，onEnd 中消费 */
  let currentDropType: DropType = 'move';
  /** 当前拖拽目标节点 ID，在 onMove 中实时计算，onEnd 中消费 */
  let currentRelatedId = '';
  /** sortablejs 的 willInsertAfter，在 onMove 中记录，onEnd 中消费 */
  let currentWillInsertAfter = true;

  const isDragging = ref(false);

  /**
   * 放置指示器 DOM 元素（动态创建的线条/高亮）
   */
  let indicatorEl: HTMLDivElement | null = null;

  /**
   * 创建放置指示器元素
   */
  const createIndicator = () => {
    if (indicatorEl) return indicatorEl;
    indicatorEl = document.createElement('div');
    indicatorEl.className = resolveClassName('tree-drop-indicator');
    document.body.appendChild(indicatorEl);
    return indicatorEl;
  };

  /**
   * 移除放置指示器元素
   */
  const removeIndicator = () => {
    if (indicatorEl) {
      indicatorEl.remove();
      indicatorEl = null;
    }
  };

  /**
   * 更新指示器位置和样式
   * - sort/move: 显示水平线（两端圆点），指示插入位置
   * - child: 显示在目标节点内部的高亮边框，指示嵌入为子节点
   */
  const updateIndicator = (targetEl: HTMLElement, dropType: DropType, willInsertAfter: boolean) => {
    const indicator = createIndicator();
    const rect = targetEl.getBoundingClientRect();

    if (dropType === 'child') {
      // 作为子节点：显示在目标节点内部的高亮边框
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
    } else {
      // 作为同级（sort/move）：显示水平线 + 两端圆点
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
    }
  };

  /**
   * 隐藏指示器
   */
  const hideIndicator = () => {
    if (indicatorEl) {
      indicatorEl.style.display = 'none';
    }
  };

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

  /**
   * 根据 onMove 中的鼠标位置计算放置类型
   *
   * 两种模式：
   * 1. dragSort 模式（仅排序，不支持改变层级）：
   *    - 上方/下方区域 → sort（同级排序）
   *    - 中间区域 → sort（同级排序，不支持 child）
   *
   * 2. draggable 模式（支持排序和改变层级）：
   *    - 上方/下方区域 → move（作为同级节点）
   *    - 中间区域 → child（作为子节点）
   */
  const calcDropType = (clientY: number, targetEl: HTMLElement): DropType => {
    const rect = targetEl.getBoundingClientRect();
    const offsetY = clientY - rect.top;
    const threshold = rect.height * dragThreshold;

    if (props.dragSort) {
      // dragSort 模式：仅支持同级排序，不支持改变层级
      return 'sort';
    }

    // draggable 模式：支持排序和改变层级
    if (offsetY < threshold) {
      return 'move';
    } else if (offsetY > rect.height - threshold) {
      return 'move';
    }
    return 'child';
  };

  /**
   * 将源数据树结构重新展开为 flatData（BFS 顺序）
   * 这是唯一需要的 flatData 更新方式：修改 children 后重新展平
   */
  const rebuildFlatData = () => {
    const newFlatData: TreeNode[] = [];

    const traverse = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        newFlatData.push(node);
        const children = node[props.children] as TreeNode[];
        if (children && children.length > 0) {
          traverse(children);
        }
      });
    };

    traverse(props.data as TreeNode[]);
    flatData.data = newFlatData;
  };

  /**
   * 重新计算所有节点属性（深度、路径、索引等）
   */
  const recalculateNodeAttributes = () => {
    let orderIndex = 0;
    const setNodeAttribute = (nodeList: TreeNode[], level: number, parentPath: string, parent: TreeNode | null) => {
      for (let i = 0; i < nodeList.length; i++) {
        const node = nodeList[i];
        const path = parentPath !== '' ? `${parentPath}-${i}` : `${i}`;

        setNodeAttr(node, NODE_ATTRIBUTES.INDEX, orderIndex);
        setNodeAttr(node, NODE_ATTRIBUTES.ORDER, orderIndex);
        setNodeAttr(node, NODE_ATTRIBUTES.DEPTH, level);
        setNodeAttr(node, NODE_ATTRIBUTES.PATH, path);
        setNodeAttr(node, NODE_ATTRIBUTES.IS_ROOT, level === 0);
        setNodeAttr(node, NODE_ATTRIBUTES.PARENT, parent);

        if (!parent) {
          // 根节点：检查是否有子节点
          const children = node[props.children] as TreeNode[];
          setNodeAttr(node, NODE_ATTRIBUTES.HAS_CHILD, !!(children && children.length > 0));
        }

        orderIndex += 1;

        const children = node[props.children] as TreeNode[];
        if (children && children.length > 0) {
          setNodeAttribute(children, level + 1, path, node);
        }
      }
    };

    const rootNodeList = getRootNodeList();
    setNodeAttribute(rootNodeList, 0, '', null);
  };

  /**
   * 拖拽排序：同级节点间排序（dragSort 模式）
   * 直接操作 children 数组：移除源节点 -> 插入到目标节点前/后
   */
  const dragSortData = (
    sourceNodeData: TreeNode,
    targetNodeData: TreeNode,
    willInsertAfter: boolean,
    savedOpenStates: Map<TreeNode, boolean>,
  ) => {
    const sourceParent = getParentNode(sourceNodeData);
    const targetParent = getParentNode(targetNodeData);

    // 只允许同父节点下排序
    if (props.dragSortMode === 'next' && sourceParent !== targetParent) return;

    // 1. 从原位置移除
    removeFromParentChildren(sourceNodeData, sourceParent);

    // 2. 获取目标所在的 children 数组
    let targetChildren: TreeNode[];
    if (!targetParent) {
      targetChildren = props.data as TreeNode[];
    } else {
      targetChildren = targetParent[props.children] as TreeNode[];
      if (!targetChildren) {
        targetParent[props.children] = [];
        targetChildren = targetParent[props.children] as TreeNode[];
      }
    }

    // 3. 在目标节点前/后插入源节点
    const targetIndexInParent = targetChildren.indexOf(targetNodeData);
    const insertIndex = willInsertAfter ? targetIndexInParent + 1 : targetIndexInParent;
    targetChildren.splice(insertIndex, 0, sourceNodeData);

    // 4. 重新构建 flatData 并计算属性
    rebuildFlatData();
    recalculateNodeAttributes();

    // 5. 更新源父节点的 HAS_CHILD
    updateHasChildAttr(sourceParent);

    // 6. 恢复展开状态
    restoreAllOpenStates(savedOpenStates);

    ctx.emit(EVENTS.NODE_DRAG_SORT, {
      sourceNode: sourceNodeData,
      targetNode: targetNodeData,
    });
  };

  /**
   * 将源节点作为目标节点的子节点
   * 直接操作 children 数组：移除源节点 -> push 到目标节点 children
   */
  const dragAsChildNode = (
    sourceNodeData: TreeNode,
    targetNodeData: TreeNode,
    savedOpenStates: Map<TreeNode, boolean>,
  ) => {
    const sourceParent = getParentNode(sourceNodeData);

    // 1. 从原位置移除
    removeFromParentChildren(sourceNodeData, sourceParent);

    // 2. 初始化目标节点的 children 并 push
    if (!targetNodeData[props.children]) {
      targetNodeData[props.children] = [];
    }
    (targetNodeData[props.children] as TreeNode[]).push(sourceNodeData);

    // 3. 重新构建 flatData 并计算属性
    rebuildFlatData();
    recalculateNodeAttributes();

    // 4. 更新属性
    updateHasChildAttr(sourceParent);
    setNodeAttr(targetNodeData, NODE_ATTRIBUTES.HAS_CHILD, true);

    // 5. 恢复展开状态
    restoreAllOpenStates(savedOpenStates);

    ctx.emit(EVENTS.NODE_DROP, sourceNodeData, targetNodeData, 'child');
  };

  /**
   * 将源节点作为目标节点的同级节点插入（可跨级）
   * 直接操作 children 数组：移除源节点 -> 在目标节点前/后插入
   */
  const dragAsSiblingNode = (
    sourceNodeData: TreeNode,
    targetNodeData: TreeNode,
    willInsertAfter: boolean,
    savedOpenStates: Map<TreeNode, boolean>,
  ) => {
    const sourceParent = getParentNode(sourceNodeData);
    const targetParent = getParentNode(targetNodeData);

    // 1. 从原位置移除
    removeFromParentChildren(sourceNodeData, sourceParent);

    // 2. 获取目标所在的 children 数组
    let targetChildren: TreeNode[];
    if (!targetParent) {
      targetChildren = props.data as TreeNode[];
    } else {
      targetChildren = targetParent[props.children] as TreeNode[];
      if (!targetChildren) {
        targetParent[props.children] = [];
        targetChildren = targetParent[props.children] as TreeNode[];
      }
    }

    // 3. 在目标节点前/后插入源节点
    const targetIndexInParent = targetChildren.indexOf(targetNodeData);
    const insertIndex = willInsertAfter ? targetIndexInParent + 1 : targetIndexInParent;
    targetChildren.splice(insertIndex, 0, sourceNodeData);

    // 4. 重新构建 flatData 并计算属性
    rebuildFlatData();
    recalculateNodeAttributes();

    // 5. 更新属性
    updateHasChildAttr(sourceParent);
    updateHasChildAttr(targetParent);

    // 6. 恢复展开状态
    restoreAllOpenStates(savedOpenStates);

    ctx.emit(EVENTS.NODE_DROP, sourceNodeData, targetNodeData, 'move');
  };

  /**
   * 检查是否禁止拖拽
   */
  const isDragDisabled = (nodeId: string): boolean => {
    const nodeData = getSourceNodeByUID(nodeId);
    if (!nodeData) return true;
    if (isNeedCheckDraggable.value && props.disableDrag?.(nodeData)) return true;
    if (nodeData.draggable === false) return true;
    return false;
  };

  /**
   * 检查是否禁止放置
   */
  const isDropDisabled = (draggedId: string, relatedId: string, dropType: DropType): boolean => {
    const draggedData = getSourceNodeByUID(draggedId);
    const relatedData = extendNodeAttr(getSourceNodeByUID(relatedId));
    if (isNeedCheckDroppable.value && props.disableDrop?.(draggedData, dropType, relatedData)) return true;
    return false;
  };

  /**
   * 恢复 sortablejs 的 DOM 操作
   * 因为我们由数据驱动 Vue 更新，需要先恢复 sortablejs 已做的 DOM 移动
   */
  const restoreSortableDOM = (evt: Sortable.SortableEvent) => {
    const { item, from, oldIndex, newIndex } = evt;
    if (oldIndex === undefined || newIndex === undefined || !from || oldIndex === newIndex) return;

    if (newIndex < oldIndex) {
      from.insertBefore(item, from.children[oldIndex + 1] || null);
    } else {
      from.insertBefore(item, from.children[oldIndex] || null);
    }
  };

  /**
   * 初始化 Sortable 实例
   */
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
        if (!nodeId || isDragDisabled(nodeId)) return;

        dragNodeId = nodeId;
        isDragging.value = true;
        currentDropType = props.dragSort ? 'sort' : 'move';
        currentRelatedId = '';
        currentWillInsertAfter = true;

        ctx.emit(EVENTS.NODE_DRAG_START, evt, evt.item);
      },

      onEnd: (evt: Sortable.SortableEvent) => {
        // 恢复 sortablejs 的 DOM 移动，由数据驱动 Vue 更新
        restoreSortableDOM(evt);

        // 隐藏指示器
        hideIndicator();

        // 使用 onMove 中实时计算的放置信息
        const targetNodeId = currentRelatedId;
        if (!targetNodeId || !dragNodeId || dragNodeId === targetNodeId) {
          cleanup();
          return;
        }

        const sourceNodeData = getSourceNodeByUID(dragNodeId);
        const targetNodeData = getSourceNodeByUID(targetNodeId);

        if (!sourceNodeData || !targetNodeData) {
          cleanup();
          return;
        }

        if (isDropDisabled(dragNodeId, targetNodeId, currentDropType)) {
          cleanup();
          return;
        }

        // 保存展开状态
        const savedOpenStates = saveAllOpenStates();

        // 根据放置类型执行对应操作
        if (currentDropType === 'child') {
          dragAsChildNode(sourceNodeData, targetNodeData, savedOpenStates);
        } else if (currentDropType === 'sort') {
          dragSortData(sourceNodeData, targetNodeData, currentWillInsertAfter, savedOpenStates);
        } else {
          // move: 跨级移动为同级节点
          dragAsSiblingNode(sourceNodeData, targetNodeData, currentWillInsertAfter, savedOpenStates);
        }

        const targetData = extendNodeAttr(targetNodeData);
        ctx.emit(EVENTS.NODE_DROP, evt, evt.item, targetData);
        cleanup();
      },

      onMove: (evt: Sortable.MoveEvent, originalEvent: Event): -1 | boolean | void => {
        const relatedEl = evt.related as HTMLElement;
        const draggedEl = evt.dragged as HTMLElement;
        const relatedId = relatedEl.getAttribute('data-tree-node');
        const draggedId = draggedEl.getAttribute('data-tree-node');

        if (!relatedId || !draggedId) return -1;

        // 不能拖到自己的子节点中
        const draggedData = getSourceNodeByUID(draggedId);
        if (draggedData) {
          const relatedData = getSourceNodeByUID(relatedId);
          let parent = getParentNode(relatedData);
          while (parent) {
            if (parent === draggedData) return -1;
            parent = getParentNode(parent);
          }
        }

        // 使用 originalEvent 坐标实时计算放置类型
        const clientY = (originalEvent as MouseEvent).clientY;
        const dropType = calcDropType(clientY, relatedEl);

        // dragSort 模式下：如果源节点和目标节点不同父且 dragSortMode === 'next'，禁止放置
        if (dropType === 'sort' && props.dragSortMode === 'next') {
          const sourceParent = getParentNode(getSourceNodeByUID(draggedId));
          const targetParent = getParentNode(getSourceNodeByUID(relatedId));
          if (sourceParent !== targetParent) return -1;
        }

        // 检查是否禁止放置
        if (isDropDisabled(draggedId, relatedId, dropType)) return -1;

        // 记录当前放置信息，供 onEnd 消费
        // evt.willInsertAfter 是 sortablejs 提供的原生属性，
        // 表示拖拽元素将被插入到目标元素之后（true）还是之前（false）
        currentDropType = dropType;
        currentRelatedId = relatedId;
        currentWillInsertAfter = evt.willInsertAfter ?? true;

        // 使用 overlay 指示器显示放置位置
        updateIndicator(relatedEl, dropType, currentWillInsertAfter);

        ctx.emit(EVENTS.NODE_DRAG_OVER, originalEvent, relatedEl, extendNodeAttr(getSourceNodeByUID(relatedId)));

        return true;
      },
    });
  };

  /**
   * 销毁 Sortable 实例
   */
  const destroySortable = () => {
    if (sortableInstance) {
      sortableInstance.destroy();
      sortableInstance = null;
    }
  };

  /**
   * 清理拖拽状态
   * 拖拽结束后移除节点的选中状态，避免拖拽完毕节点保持选中
   */
  const cleanup = () => {
    if (dragNodeId) {
      const dragNode = getSourceNodeByUID(dragNodeId);
      if (dragNode) {
        setNodeAttr(dragNode, NODE_ATTRIBUTES.IS_SELECTED, false);
      }
    }
    dragNodeId = '';
    currentDropType = 'move';
    currentRelatedId = '';
    currentWillInsertAfter = true;
    isDragging.value = false;
    removeIndicator();
  };

  onMounted(() => {
    if ((props.draggable || props.dragSort) && root.value) {
      nextTick(() => {
        initSortable();
      });
    }
  });

  onUnmounted(() => {
    destroySortable();
    removeIndicator();
  });

  return {
    isDragging,
  };
};
