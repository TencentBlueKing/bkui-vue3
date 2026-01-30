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
import { VNode, isVNode, unref, toRaw, isRef, RendererNode, VNodeNormalizedChildren } from 'vue';

import { v4 as uuidv4 } from 'uuid';

import { ITableColumn } from '../components/table-column';
import { Column } from '../props';

/**
 * VNode 解析方式的列模板解析器
 *
 * 此方法作为列注册表（use-column-registry）的降级方案，用于以下场景：
 * 1. 使用 props.columns 配置方式
 * 2. SSR 场景
 * 3. 动态组件场景
 * 4. 旧版本兼容
 *
 * 新的 TableColumn 组件优先使用列注册表进行增量更新，
 * 当列注册表不可用时，会回退到此方法进行全量 VNode 解析。
 *
 * @see use-column-registry.tsx 列注册表（增量更新模式）
 */
export default () => {
  // 使用 WeakMap 缓存节点的 uniqueId，避免重复生成
  const columnCache = new WeakMap<object, string>();

  /**
   * 获取原始属性值，处理 ref 和 reactive
   */
  const getPropRawData = (prop: unknown) => {
    if (isRef(prop)) {
      return unref(prop);
    }
    return toRaw(prop);
  };

  /**
   * 复制并转换 props，将 kebab-case 转为 camelCase
   */
  const copyProps = (props: { [key: string]: Record<string, object> } | ITableColumn) => {
    return Object.keys(props ?? {}).reduce((result, key) => {
      const target = key.replace(/-(\w)/g, (_, letter) => letter.toUpperCase());
      return Object.assign(result, { [target]: getPropRawData(props[key]) });
    }, {}) as Column;
  };

  /**
   * 获取节点的唯一标识，使用 WeakMap 缓存
   */
  const getNodeCtxUid = (ctx: object) => {
    if (!columnCache.has(ctx)) {
      columnCache.set(ctx, uuidv4());
    }
    return columnCache.get(ctx);
  };

  /**
   * 解析列模板
   * @param children VNode 子节点
   */
  const resolveColumns = (children: VNode[] | VNodeNormalizedChildren) => {
    // 将状态变量移入函数内部，避免多实例冲突
    const columns: Column[] = [];
    let columnIndex = 0;
    // 使用 Set 替代 some() 进行唯一性检查，O(1) 复杂度
    const processedIds = new Set<string>();

    /**
     * 递归解析子节点（修正拼写：resolveNodeChilren -> resolveNodeChildren）
     */
    const resolveNodeChildren = (node: RendererNode, rootNode?: Column, isColumnRoot?: boolean) => {
      if (node?.component?.subTree) {
        resolveChildNode(node?.component?.subTree, rootNode);
        return;
      }

      if (typeof node === 'function') {
        return node();
      }

      if (Array.isArray(node)) {
        node.forEach(c => resolveChildNode(c, rootNode));
        return;
      }

      if (Array.isArray(node?.children)) {
        node.children.forEach(c => resolveChildNode(c, rootNode));
        return;
      }

      if (!isColumnRoot && isVNode(node) && node?.children && typeof node?.children === 'object') {
        Object.keys(node.children).forEach(key => resolveChildNode(node.children[key], rootNode));
        return;
      }
    };

    /**
     * 解析单个子节点
     */
    const resolveChildNode = (node: RendererNode, parent?: Column) => {
      const rootNode = parent;
      if (!node || node.type?.name === 'Table') {
        return;
      }

      if (node.type?.name === 'TableColumn') {
        const uniqueId = getNodeCtxUid(node);

        // 使用 Set 进行 O(1) 唯一性检查
        if (processedIds.has(uniqueId)) {
          return;
        }

        const resolveProp = Object.assign({ index: columnIndex }, copyProps(node.props), {
          field: node.props.prop || node.props.field,
          render: node.props.render ?? node.children?.default,
          uniqueId,
          children: [],
        });

        const targetColumns = parent?.children ?? columns;
        targetColumns.push(resolveProp);
        processedIds.add(uniqueId);
        columnIndex = columnIndex + 1;

        if (node.children) {
          resolveNodeChildren(node, resolveProp, true);
        }

        return;
      }

      resolveNodeChildren(node, rootNode);
    };

    // 查找 GhostBody 节点并解析
    const ghostBody = (children as VNode[])?.find(node => (node.type as RendererNode)?.name === 'GhostBody');
    if (ghostBody) {
      if (ghostBody.component?.subTree) {
        resolveChildNode(ghostBody.component?.subTree);
      } else {
        ((ghostBody.children as { [key: string]: () => VNode[] })?.default?.() ?? []).forEach(c => resolveChildNode(c));
      }
    }

    // 按 index 排序保证顺序
    columns.sort((col1, col2) => col1.index - col2.index);
    return columns;
  };

  return {
    resolveColumns,
  };
};
