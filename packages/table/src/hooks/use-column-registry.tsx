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

import { ref, Ref } from 'vue';

import { Column, RenderFunctionString } from '../props';

/**
 * 列配置接口（带内部元数据）
 */
export interface ColumnConfig {
  /** 列唯一标识 */
  id: string;
  /** 父列 ID（用于嵌套列） */
  parentId?: string;
  /** 注册顺序（用于排序） */
  order: number;
  /** 列标签 */
  label?: Column['label'];
  /** 字段名 */
  field?: Column['field'];
  /** 渲染函数 */
  render?: RenderFunctionString | ((...args: unknown[]) => unknown);
  /** 宽度 */
  width?: Column['width'];
  /** 最小宽度 */
  minWidth?: Column['minWidth'];
  /** 列唯一键 */
  columnKey?: Column['columnKey'];
  /** 溢出提示 */
  showOverflowTooltip?: Column['showOverflowTooltip'];
  /** 列类型 */
  type?: Column['type'];
  /** 固定列 */
  fixed?: Column['fixed'];
  /** 是否可调整大小 */
  resizable?: Column['resizable'];
  /** 排序配置 */
  sort?: Column['sort'];
  /** 过滤配置 */
  filter?: Column['filter'];
  /** 列合并 */
  colspan?: Column['colspan'];
  /** 行合并 */
  rowspan?: Column['rowspan'];
  /** 对齐方式 */
  align?: Column['align'];
  /** 自定义类名 */
  className?: Column['className'];
  /** 兼容 prop */
  prop?: Column['prop'];
  /** 说明 */
  explain?: Column['explain'];
  /** 跨页选择 */
  acrossPage?: Column['acrossPage'];
  /** 子列 */
  children?: Column[];
}

/**
 * 列注册表接口
 */
export interface ColumnRegistry {
  /** 注册新列 */
  registerColumn: (id: string, config: Omit<ColumnConfig, 'id' | 'order'>, parentId?: string) => void;
  /** 更新列配置 */
  updateColumn: (id: string, config: Partial<Omit<ColumnConfig, 'id' | 'order'>>) => void;
  /** 注销列 */
  unregisterColumn: (id: string) => void;
  /** 获取所有列（有序） */
  getColumns: () => Column[];
  /** 检查是否有注册的列 */
  hasColumns: () => boolean;
  /** 清空所有列 */
  clear: () => void;
  /** 版本号（用于触发更新） */
  version: Ref<number>;
}

/**
 * 列 ID 生成器种子
 */
let columnIdSeed = 1;

/**
 * 生成列 ID
 */
export const generateColumnId = (): string => {
  return `col_${columnIdSeed++}`;
};

/**
 * 重置列 ID 种子（仅用于测试）
 */
export const resetColumnIdSeed = (): void => {
  columnIdSeed = 1;
};

/**
 * 创建列注册表
 * 负责管理所有列的注册、更新和注销，支持增量操作
 */
export default function useColumnRegistry(): ColumnRegistry {
  // 列配置存储
  const columnMap = new Map<string, ColumnConfig>();
  // 列顺序计数器
  let orderCounter = 0;
  // 版本号，用于触发更新
  const version = ref(0);
  // 批量更新标记
  let batchUpdateScheduled = false;

  /**
   * 调度批量更新
   * 收集一帧内的所有操作，统一触发版本更新
   */
  const scheduleBatchUpdate = () => {
    if (batchUpdateScheduled) return;
    batchUpdateScheduled = true;

    // 使用 requestAnimationFrame 在下一帧统一更新
    // 如果不支持（如 SSR），使用 setTimeout
    const schedule = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : setTimeout;
    schedule(() => {
      batchUpdateScheduled = false;
      version.value++;
    });
  };

  /**
   * 注册新列
   * @param id 列唯一标识
   * @param config 列配置
   * @param parentId 父列 ID（用于嵌套列）
   */
  const registerColumn = (id: string, config: Omit<ColumnConfig, 'id' | 'order'>, parentId?: string) => {
    // 如果已存在，先更新
    if (columnMap.has(id)) {
      updateColumn(id, config);
      return;
    }

    const columnConfig: ColumnConfig = {
      ...config,
      id,
      parentId,
      order: orderCounter++,
    };

    columnMap.set(id, columnConfig);
    scheduleBatchUpdate();
  };

  /**
   * 更新列配置
   * @param id 列唯一标识
   * @param config 要更新的配置（部分）
   */
  const updateColumn = (id: string, config: Partial<Omit<ColumnConfig, 'id' | 'order'>>) => {
    const existing = columnMap.get(id);
    if (!existing) {
      return;
    }

    // 合并配置，保留 id 和 order
    const updated: ColumnConfig = {
      ...existing,
      ...config,
      id: existing.id,
      order: existing.order,
    };

    columnMap.set(id, updated);
    scheduleBatchUpdate();
  };

  /**
   * 注销列
   * @param id 列唯一标识
   */
  const unregisterColumn = (id: string) => {
    if (!columnMap.has(id)) {
      return;
    }

    columnMap.delete(id);

    // 同时删除所有子列
    columnMap.forEach((col, colId) => {
      if (col.parentId === id) {
        columnMap.delete(colId);
      }
    });

    scheduleBatchUpdate();
  };

  /**
   * 构建嵌套列结构
   * @param columns 扁平化的列配置数组
   */
  const buildNestedColumns = (columns: ColumnConfig[]): Column[] => {
    const rootColumns: Column[] = [];
    const childrenMap = new Map<string, Column[]>();

    // 按 order 排序
    const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

    // 分组：根列和子列
    sortedColumns.forEach(col => {
      // 创建输出列对象（移除内部元数据）
      const outputCol: Column = {
        label: col.label,
        field: col.field,
        render: col.render as RenderFunctionString | undefined,
        width: col.width,
        minWidth: col.minWidth,
        columnKey: col.columnKey,
        showOverflowTooltip: col.showOverflowTooltip,
        type: col.type,
        fixed: col.fixed,
        resizable: col.resizable,
        sort: col.sort,
        filter: col.filter,
        colspan: col.colspan,
        rowspan: col.rowspan,
        align: col.align,
        className: col.className,
        prop: col.prop,
        index: col.order,
        explain: col.explain,
        acrossPage: col.acrossPage,
        children: [],
      };

      if (col.parentId) {
        // 子列：添加到父列的 children 映射
        if (!childrenMap.has(col.parentId)) {
          childrenMap.set(col.parentId, []);
        }
        childrenMap.get(col.parentId)!.push(outputCol);
      } else {
        // 根列
        rootColumns.push(outputCol);
      }
    });

    // 将子列挂载到父列
    rootColumns.forEach(col => {
      const colConfig = sortedColumns.find(c => c.order === col.index);
      if (colConfig && childrenMap.has(colConfig.id)) {
        col.children = childrenMap.get(colConfig.id);
      }
    });

    return rootColumns;
  };

  /**
   * 获取所有列（有序）
   * 返回构建好的嵌套列结构
   */
  const getColumns = (): Column[] => {
    const columns = Array.from(columnMap.values());
    return buildNestedColumns(columns);
  };

  /**
   * 检查是否有注册的列
   */
  const hasColumns = (): boolean => {
    return columnMap.size > 0;
  };

  /**
   * 清空所有列
   */
  const clear = () => {
    columnMap.clear();
    orderCounter = 0;
    scheduleBatchUpdate();
  };

  return {
    registerColumn,
    updateColumn,
    unregisterColumn,
    getColumns,
    hasColumns,
    clear,
    version,
  };
}

export type UseColumnRegistry = ReturnType<typeof useColumnRegistry>;
