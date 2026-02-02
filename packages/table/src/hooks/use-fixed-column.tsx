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

import { computed, CSSProperties, reactive, Ref } from 'vue';

import { Column, TablePropTypes } from '../props';
import { UseColumns } from './use-columns';

/**
 * 固定列位置枚举
 */
export enum FixedPosition {
  LEFT = 'left',
  RIGHT = 'right',
}

/**
 * 固定区域样式接口
 */
export interface FixedAreaStyle {
  left?: number;
  right?: number;
  width: string;
}

/**
 * 阴影状态接口
 */
export interface ShadowState {
  /** 是否显示左侧阴影 */
  showLeftShadow: boolean;
  /** 是否显示右侧阴影 */
  showRightShadow: boolean;
}

/**
 * 固定列 Hook 返回值接口
 */
export interface UseFixedColumnReturn {
  /** 左固定列列表 */
  fixedLeftColumns: Ref<Column[]>;
  /** 右固定列列表 */
  fixedRightColumns: Ref<Column[]>;
  /** 左固定区域样式 */
  fixedLeftStyle: FixedAreaStyle;
  /** 右固定区域样式 */
  fixedRightStyle: FixedAreaStyle;
  /** 左固定区域总宽度 */
  fixedLeftWidth: Ref<number>;
  /** 右固定区域总宽度 */
  fixedRightWidth: Ref<number>;
  /** 阴影状态 */
  shadowState: ShadowState;
  /** 是否有固定列 */
  hasFixedColumns: Ref<boolean>;
  /** 计算并更新所有固定列的样式 */
  resolveFixedColumnStyle: () => void;
  /** 更新阴影状态 */
  updateShadowState: (scrollLeft: number, scrollWidth: number, clientWidth: number) => void;
  /** 渲染固定列阴影层 */
  renderFixedRows: () => JSX.Element[];
  /** 判断列是否为左固定列的最后一列 */
  isLastLeftFixed: (column: Column) => boolean;
  /** 判断列是否为右固定列的第一列 */
  isFirstRightFixed: (column: Column) => boolean;
  /** 获取列的固定 class */
  getFixedColumnClass: (column: Column) => Record<string, boolean>;
}

/**
 * 固定列 Hook
 *
 * 实现原理：
 * 1. 通过 position: sticky 实现固定效果
 * 2. 左固定列：从左到右累加 left 偏移量
 * 3. 右固定列：从右到左累加 right 偏移量
 * 4. 通过 CSS 变量控制阴影显示
 *
 * 流程：
 * ```
 * 1. 列配置解析
 *    ├─ 分离左固定列 (fixed='left' 或 fixed=true)
 *    └─ 分离右固定列 (fixed='right')
 *
 * 2. 样式计算 (resolveFixedColumnStyle)
 *    ├─ 左固定列：从左到右累加 left 偏移
 *    │   col1: left: 0px
 *    │   col2: left: col1.width
 *    │   col3: left: col1.width + col2.width
 *    │
 *    └─ 右固定列：从右到左累加 right 偏移
 *        colN:   right: 0px
 *        colN-1: right: colN.width
 *
 * 3. 阴影控制 (updateShadowState)
 *    ├─ scrollLeft > 0 → 显示左固定列右边阴影
 *    └─ scrollLeft + clientWidth < scrollWidth → 显示右固定列左边阴影
 * ```
 *
 * @param props Table 组件 props
 * @param columns useColumns 返回值
 */
export default function useFixedColumn(
  _props: TablePropTypes,
  columns: UseColumns,
): UseFixedColumnReturn {
  /**
   * 左固定列（fixed='left' 或 fixed=true）
   * 按照在 visibleColumns 中的顺序排列
   */
  const fixedLeftColumns = computed(() =>
    columns.visibleColumns.filter(column => {
      const fixed = column.fixed;
      return fixed === true || fixed === FixedPosition.LEFT || (fixed && fixed !== FixedPosition.RIGHT);
    }),
  );

  /**
   * 右固定列（fixed='right'）
   * 按照在 visibleColumns 中的顺序排列
   */
  const fixedRightColumns = computed(() =>
    columns.visibleColumns.filter(column => column.fixed === FixedPosition.RIGHT),
  );

  /**
   * 左固定区域总宽度
   */
  const fixedLeftWidth = computed(() =>
    fixedLeftColumns.value.reduce((sum, col) => sum + (columns.getColumnWidth(col) || 0), 0),
  );

  /**
   * 右固定区域总宽度
   */
  const fixedRightWidth = computed(() =>
    fixedRightColumns.value.reduce((sum, col) => sum + (columns.getColumnWidth(col) || 0), 0),
  );

  /**
   * 是否有固定列
   */
  const hasFixedColumns = computed(() =>
    fixedLeftColumns.value.length > 0 || fixedRightColumns.value.length > 0,
  );

  /**
   * 左固定区域样式（用于阴影层）
   */
  const fixedLeftStyle = reactive<FixedAreaStyle>({
    left: 0,
    width: '0',
  });

  /**
   * 右固定区域样式（用于阴影层）
   */
  const fixedRightStyle = reactive<FixedAreaStyle>({
    right: 0,
    width: '0',
  });

  /**
   * 阴影状态
   * 根据滚动位置动态控制阴影显示
   */
  const shadowState = reactive<ShadowState>({
    showLeftShadow: false,
    showRightShadow: true, // 初始状态，右侧可能有滚动内容
  });

  /**
   * 计算并更新所有固定列的样式
   *
   * 算法说明：
   * - 左固定列：从左到右遍历，累加 left 偏移量
   * - 右固定列：从右到左遍历，累加 right 偏移量
   * - 同时更新列的 rect 信息和 fixedStyle
   */
  const resolveFixedColumnStyle = () => {
    // === 计算右固定列样式（从右到左）===
    let rightOffset = 0;
    const rightLength = fixedRightColumns.value.length;

    for (let i = rightLength - 1; i >= 0; i--) {
      const col = fixedRightColumns.value[i];
      const width = columns.getColumnWidth(col) || 0;

      // 更新列的位置信息
      columns.setColumnRect(col, { right: rightOffset, width });
      // 设置 sticky 定位样式
      columns.setFixedStyle(col, { right: `${rightOffset}px` });

      rightOffset += width;
    }

    // === 计算左固定列样式（从左到右）===
    let leftOffset = 0;

    fixedLeftColumns.value.forEach(col => {
      const width = columns.getColumnWidth(col) || 0;

      // 更新列的位置信息
      columns.setColumnRect(col, { left: leftOffset, width });
      // 设置 sticky 定位样式
      columns.setFixedStyle(col, { left: `${leftOffset}px` });

      leftOffset += width;
    });

    // 更新阴影层宽度
    fixedLeftStyle.width = `${leftOffset}px`;
    fixedRightStyle.width = `${rightOffset}px`;
  };

  /**
   * 更新阴影状态
   *
   * @param scrollLeft 当前横向滚动位置
   * @param scrollWidth 滚动内容总宽度
   * @param clientWidth 可视区域宽度
   */
  const updateShadowState = (scrollLeft: number, scrollWidth: number, clientWidth: number) => {
    // 左侧有滚动内容时，显示左固定列的右边阴影
    shadowState.showLeftShadow = scrollLeft > 0;
    // 右侧有滚动内容时，显示右固定列的左边阴影
    // 减 1 是为了处理浮点数精度问题
    shadowState.showRightShadow = scrollLeft + clientWidth < scrollWidth - 1;
  };

  /**
   * 判断列是否为左固定列的最后一列
   */
  const isLastLeftFixed = (column: Column): boolean => {
    const leftCols = fixedLeftColumns.value;
    return leftCols.length > 0 && leftCols[leftCols.length - 1] === column;
  };

  /**
   * 判断列是否为右固定列的第一列
   */
  const isFirstRightFixed = (column: Column): boolean => {
    const rightCols = fixedRightColumns.value;
    return rightCols.length > 0 && rightCols[0] === column;
  };

  /**
   * 获取列的固定相关 class
   */
  const getFixedColumnClass = (column: Column): Record<string, boolean> => {
    if (!column.fixed) {
      return {};
    }

    const isLeft = column.fixed !== FixedPosition.RIGHT;
    const isRight = column.fixed === FixedPosition.RIGHT;

    return {
      column_fixed: true,
      column_fixed_left: isLeft,
      column_fixed_right: isRight,
      'is-last-left-fixed': isLastLeftFixed(column),
      'is-first-right-fixed': isFirstRightFixed(column),
      'show-left-shadow': isLastLeftFixed(column) && shadowState.showLeftShadow,
      'show-right-shadow': isFirstRightFixed(column) && shadowState.showRightShadow,
    };
  };

  /**
   * 渲染左固定区域阴影层
   * 阴影显示由父级 .has-left-shadow class 控制
   */
  const renderFixedLeft = () => {
    if (fixedLeftColumns.value.length === 0) {
      return null;
    }

    const style: CSSProperties = {
      width: fixedLeftStyle.width,
      left: `${fixedLeftStyle.left ?? 0}px`,
    };

    return (
      <div
        style={style}
        class='column_fixed column_fixed_left'
      />
    );
  };

  /**
   * 渲染右固定区域阴影层
   * 阴影显示由父级 .has-right-shadow class 控制
   */
  const renderFixedRight = () => {
    if (fixedRightColumns.value.length === 0) {
      return null;
    }

    const style: CSSProperties = {
      width: fixedRightStyle.width,
      right: `${fixedRightStyle.right ?? 0}px`,
    };

    return (
      <div
        style={style}
        class='column_fixed column_fixed_right'
      />
    );
  };

  /**
   * 渲染固定列阴影层
   * 包含左右两个阴影区域
   */
  const renderFixedRows = () => {
    return [renderFixedLeft(), renderFixedRight()];
  };

  return {
    // 固定列列表
    fixedLeftColumns: computed(() => fixedLeftColumns.value),
    fixedRightColumns: computed(() => fixedRightColumns.value),
    // 固定区域样式
    fixedLeftStyle,
    fixedRightStyle,
    // 固定区域宽度
    fixedLeftWidth,
    fixedRightWidth,
    // 阴影状态
    shadowState,
    // 是否有固定列
    hasFixedColumns,
    // 方法
    resolveFixedColumnStyle,
    updateShadowState,
    renderFixedRows,
    isLastLeftFixed,
    isFirstRightFixed,
    getFixedColumnClass,
  };
}

export type UseFixedColumn = ReturnType<typeof useFixedColumn>;
