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

export enum EVENTS {
  NODE_CLICK = 'nodeClick',
  NODE_COLLAPSE = 'nodeCollapse',
  NODE_EXPAND = 'nodeExpand',
  NODE_CHECKED = 'nodeChecked',
  NODE_DRAG_START = 'nodeDragStart',
  NODE_DRAG_OVER = 'nodeDragOver',
  NODE_DRAG_LEAVE = 'nodeDragLeave',
  NODE_DROP = 'nodeDrop',
}
const EMPTY = (..._args) => true;
export const TreeEmitEventsType = {
  [EVENTS.NODE_CLICK]: EMPTY,
  [EVENTS.NODE_COLLAPSE]: EMPTY,
  [EVENTS.NODE_EXPAND]: EMPTY,
  [EVENTS.NODE_CHECKED]: EMPTY,
  [EVENTS.NODE_DRAG_START]: EMPTY,
  [EVENTS.NODE_DRAG_OVER]: EMPTY,
  [EVENTS.NODE_DRAG_LEAVE]: EMPTY,
  [EVENTS.NODE_DROP]: EMPTY,
};

/**
 * 节点扩展属性
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const enum NODE_ATTRIBUTES {
  DEPTH = '__depth',
  INDEX = '__index',
  UUID = '__uuid',
  PARENT_ID = '__parent_id',
  HAS_CHILD = '__has_child',
  PATH = '__path',
  IS_ROOT = '__is_root',
  ORDER = '__order',
  IS_OPEN = '__is_open',
  IS_CHECKED = '__is_checked',
  IS_SELECTED = '__is_selected',
  IS_ASYNC_INIT = '__is_async_init',
  IS_MATCH = '__is_match',
  IS_NULL = '__IS_NULL',
  IS_CACHED = '__is_cached',
  IS_ASYNC = '__is_async',
  IS_LOADING = '__is_loading',
  TREE_NODE_ATTR = '__attr__',
  SOURCE_ITEM = '__source_item__',
}

export const NODE_SOURCE_ATTRS = {
  [NODE_ATTRIBUTES.IS_OPEN]: 'isOpen',
  [NODE_ATTRIBUTES.IS_SELECTED]: 'selected',
  [NODE_ATTRIBUTES.IS_MATCH]: 'isMatch',
  [NODE_ATTRIBUTES.HAS_CHILD]: 'hasChild',
  [NODE_ATTRIBUTES.IS_CHECKED]: 'checked',
  [NODE_ATTRIBUTES.IS_ASYNC]: 'async',
  [NODE_ATTRIBUTES.IS_LOADING]: 'loading',
  [NODE_ATTRIBUTES.IS_ROOT]: 'isRoot',
};

/**
 * 节点点击可执行行为配置
 */
export enum NodeContentActionEnum {
  CLICK = 'click',
  SELECTED = 'selected',
  EXPAND = 'expand',
  COLLAPSE = 'collapse',
}
