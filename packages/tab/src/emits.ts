/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) is licensed under the MIT License.
 *
 * License for 蓝鲸智云PaaS平台 (BlueKing PaaS):
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
import { TabPanelProps } from './props';

export const emits = {
  add: (_value: { e: MouseEvent }) => true,
  'add-panel': (_value: { e: MouseEvent }) => true,
  change: (_name: string) => true,
  'tab-change': (_name: string) => true,
  'update:active': (_name: string) => true,
  remove: (_index: number, _panel: TabPanelProps) => true,
  'remove-panel': (_index: number, _panel: TabPanelProps) => true,
  sort: (_oldIndex: number, _newIndex: number, _sortType: string) => true,
  'sort-change': (_oldIndex: number, _newIndex: number, _sortType: string) => true,
  drag: (_index: number, _event: DragEvent) => true,
  'on-drag-tab': (_index: number, _event: DragEvent) => true,
};

export type TabEmits = typeof emits;
