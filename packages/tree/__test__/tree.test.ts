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

import { nextTick } from 'vue';

import { mount } from '@vue/test-utils';

import BKTree from '../src';
import { NODE_ATTRIBUTES } from '../src/constant';
import { DropType, TreeNode } from '../src/props';

type TreeTestVm = {
  asyncNodeClick: (node: TreeNode) => Promise<unknown>;
  getNodeAttr: (node: TreeNode, attr: string) => unknown;
  isIndeterminate: (node: TreeNode) => boolean;
  setOpen: (item: TreeNode, isOpen?: boolean, autoOpenParents?: boolean) => void;
  setChecked: (item: Array<number | string> | number | string, checked?: boolean) => void;
  setCheckedById: (id: Array<number | string> | number | string, checked?: boolean) => void;
};

type SortableOptions = {
  onEnd: (evt: { item: HTMLElement; related?: HTMLElement }) => void;
  onMove: (
    evt: { dragged: HTMLElement; related: HTMLElement; willInsertAfter?: boolean },
    originalEvent: MouseEvent,
  ) => void;
  onStart: (evt: { item: HTMLElement }) => void;
  onUnchoose: (evt: { item: HTMLElement }) => void;
};

type TreeDataChangeEvent = {
  data: Array<{ children?: TreeNode[]; id: number | string }>;
};

let sortableOptions: SortableOptions | null = null;
const mockSortableCreate = jest.fn();

jest.mock('sortablejs', () => ({
  __esModule: true,
  default: {
    create: mockSortableCreate,
  },
}));

describe('tree.tsx', () => {
  beforeEach(() => {
    sortableOptions = null;
    mockSortableCreate.mockImplementation((_container: HTMLElement, options: SortableOptions) => {
      sortableOptions = options;
      return {
        destroy: jest.fn(),
      };
    });
  });

  it('renders slot default when passed', async () => {
    const wrapper = await mount(BKTree, {
      props: {
        data: [
          {
            label: 'Node-0',
            children: [
              { label: 'Node-0-0', children: [] },
              { label: 'Node-0-1', children: [] },
            ],
          },
          { label: 'Node-1', children: [] },
          { label: 'Node-2', children: [] },
        ],
        levelLine: true,
      },
    });
    expect(wrapper.classes()).toContain('bk-tree');
    expect(wrapper.findAll('.bk-tree-node').length).toEqual(3);

    const firstNode = wrapper.find('.bk-tree-node');
    firstNode.trigger('click');
    wrapper.vm.$nextTick(() => {
      expect(wrapper.findAll('.bk-tree-node').length).toEqual(5);
    });
  });

  it('marks top-level parent indeterminate when a deep child is checked', async () => {
    const data = [
      {
        id: 'root',
        label: 'Root',
        children: [
          {
            id: 'parent',
            label: 'Parent',
            children: [
              { id: 'leaf-1', label: 'Leaf 1', children: [] },
              { id: 'leaf-2', label: 'Leaf 2', children: [] },
            ],
          },
        ],
      },
    ];
    const wrapper = await mount(BKTree, {
      props: {
        data,
        label: 'label',
        nodeKey: 'id',
        showCheckbox: true,
      },
    });
    const treeVm = wrapper.vm as unknown as TreeTestVm;

    treeVm.setChecked('leaf-1');
    await nextTick();

    expect(treeVm.getNodeAttr(data[0], NODE_ATTRIBUTES.IS_CHECKED)).toBe(false);
    expect(treeVm.getNodeAttr(data[0], NODE_ATTRIBUTES.IS_INDETERMINATE)).toBe(true);
  });

  it('syncs indeterminate parents from controlled checked values', async () => {
    const data = [
      {
        id: 'root',
        label: 'Root',
        children: [
          {
            id: 'parent',
            label: 'Parent',
            children: [
              { id: 'leaf-1', label: 'Leaf 1', children: [] },
              { id: 'leaf-2', label: 'Leaf 2', children: [] },
            ],
          },
        ],
      },
    ];
    const wrapper = await mount(BKTree, {
      props: {
        checked: ['leaf-1'],
        data,
        label: 'label',
        nodeKey: 'id',
        showCheckbox: true,
      },
    });
    await nextTick();
    const treeVm = wrapper.vm as unknown as TreeTestVm;

    expect(treeVm.getNodeAttr(data[0], NODE_ATTRIBUTES.IS_INDETERMINATE)).toBe(true);

    await wrapper.setProps({ checked: ['leaf-1', 'leaf-2'] });

    expect(treeVm.getNodeAttr(data[0], NODE_ATTRIBUTES.IS_CHECKED)).toBe(true);
    expect(treeVm.getNodeAttr(data[0], NODE_ATTRIBUTES.IS_INDETERMINATE)).toBe(false);
  });

  it('keeps parent indeterminate after unchecking one child from a checked branch', async () => {
    const data = [
      {
        id: 'root',
        label: 'Root',
        children: [
          { id: 'leaf-1', label: 'Leaf 1', children: [] },
          { id: 'leaf-2', label: 'Leaf 2', children: [] },
          { id: 'leaf-3', label: 'Leaf 3', children: [] },
        ],
      },
    ];
    const wrapper = await mount(BKTree, {
      props: {
        data,
        label: 'label',
        nodeKey: 'id',
        showCheckbox: true,
      },
    });
    const treeVm = wrapper.vm as unknown as TreeTestVm;

    treeVm.setChecked('root');
    treeVm.setChecked('leaf-1', false);
    await nextTick();

    expect(treeVm.getNodeAttr(data[0], NODE_ATTRIBUTES.IS_CHECKED)).toBe(false);
    expect(treeVm.isIndeterminate(data[0])).toBe(true);
  });

  it('supports array ids in setCheckedById', async () => {
    const data = [
      {
        id: 1,
        label: 'Root',
        children: [
          { id: 2, label: 'Leaf 1', children: [] },
          { id: 3, label: 'Leaf 2', children: [] },
        ],
      },
    ];
    const wrapper = await mount(BKTree, {
      props: {
        data,
        label: 'label',
        nodeKey: 'id',
        showCheckbox: true,
      },
    });
    const treeVm = wrapper.vm as unknown as TreeTestVm;

    treeVm.setCheckedById([2, 3]);
    await nextTick();

    expect(treeVm.getNodeAttr(data[0], NODE_ATTRIBUTES.IS_CHECKED)).toBe(true);
    expect(treeVm.getNodeAttr(data[0], NODE_ATTRIBUTES.IS_INDETERMINATE)).toBe(false);
  });

  it('emits nodeDataChange with next tree data after drag sorting', async () => {
    const data = [
      { id: 'a', label: 'A', children: [] },
      { id: 'b', label: 'B', children: [] },
      { id: 'c', label: 'C', children: [] },
    ];
    const wrapper = await mount(BKTree, {
      props: {
        data,
        dragSort: true,
        draggable: true,
        label: 'label',
        nodeKey: 'id',
      },
    });
    await nextTick();
    expect(sortableOptions).toBeTruthy();
    const options = sortableOptions as SortableOptions;

    const sourceEl = wrapper.find('[data-tree-node="a"]').element as HTMLElement;
    const targetEl = wrapper.find('[data-tree-node="c"]').element as HTMLElement;
    targetEl.getBoundingClientRect = () => ({
      bottom: 32,
      height: 32,
      left: 0,
      right: 120,
      top: 0,
      width: 120,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    options.onStart({ item: sourceEl });
    options.onMove(
      {
        dragged: sourceEl,
        related: targetEl,
        willInsertAfter: true,
      },
      new MouseEvent('mousemove', { clientY: 31 }),
    );
    options.onEnd({ item: sourceEl });

    const eventPayload = wrapper.emitted('nodeDataChange')?.[0]?.[0] as TreeDataChangeEvent;
    expect(eventPayload.data.map(node => node.id)).toEqual(['b', 'c', 'a']);
  });

  it('drag sorts numeric nodeKey values', async () => {
    const data = [
      { id: 1, label: 'A', children: [] },
      { id: 2, label: 'B', children: [] },
      { id: 3, label: 'C', children: [] },
    ];
    const wrapper = await mount(BKTree, {
      props: {
        data,
        dragSort: true,
        draggable: true,
        label: 'label',
        nodeKey: 'id',
      },
    });
    await nextTick();
    const options = sortableOptions as SortableOptions;
    const sourceEl = wrapper.find('[data-tree-node="1"]').element as HTMLElement;
    const targetEl = wrapper.find('[data-tree-node="3"]').element as HTMLElement;
    targetEl.getBoundingClientRect = () => ({
      bottom: 32,
      height: 32,
      left: 0,
      right: 120,
      top: 0,
      width: 120,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    options.onStart({ item: sourceEl });
    options.onMove(
      {
        dragged: sourceEl,
        related: targetEl,
        willInsertAfter: true,
      },
      new MouseEvent('mousemove', { clientY: 31 }),
    );
    options.onEnd({ item: sourceEl, related: targetEl });

    const eventPayload = wrapper.emitted('nodeDataChange')?.[0]?.[0] as TreeDataChangeEvent;
    expect(eventPayload.data.map(node => node.id)).toEqual([2, 3, 1]);
  });

  it('uses the latest internal tree for consecutive drag changes without external data writeback', async () => {
    const data = [
      { id: 'a', label: 'A', children: [] },
      { id: 'b', label: 'B', children: [] },
      { id: 'c', label: 'C', children: [] },
    ];
    const wrapper = await mount(BKTree, {
      props: {
        data,
        dragSort: true,
        draggable: true,
        label: 'label',
        nodeKey: 'id',
      },
    });
    await nextTick();
    const options = sortableOptions as SortableOptions;
    const getNodeEl = (id: string) => wrapper.find(`[data-tree-node="${id}"]`).element as HTMLElement;
    const mockRect = (el: HTMLElement) => {
      el.getBoundingClientRect = () => ({
        bottom: 32,
        height: 32,
        left: 0,
        right: 120,
        top: 0,
        width: 120,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });
    };

    mockRect(getNodeEl('c'));
    options.onStart({ item: getNodeEl('a') });
    options.onMove(
      { dragged: getNodeEl('a'), related: getNodeEl('c'), willInsertAfter: true },
      new MouseEvent('mousemove', { clientY: 31 }),
    );
    options.onEnd({ item: getNodeEl('a'), related: getNodeEl('c') });
    await nextTick();

    mockRect(getNodeEl('a'));
    options.onStart({ item: getNodeEl('b') });
    options.onMove(
      { dragged: getNodeEl('b'), related: getNodeEl('a'), willInsertAfter: true },
      new MouseEvent('mousemove', { clientY: 31 }),
    );
    options.onEnd({ item: getNodeEl('b'), related: getNodeEl('a') });

    const eventPayload = wrapper.emitted('nodeDataChange')?.[1]?.[0] as TreeDataChangeEvent;
    expect(eventPayload.data.map(node => node.id)).toEqual(['c', 'a', 'b']);
  });

  it('moves a node as target child when dropped in the middle area', async () => {
    const data = [
      { id: 'a', label: 'A', children: [] },
      { id: 'b', label: 'B', children: [] },
    ];
    const wrapper = await mount(BKTree, {
      props: {
        data,
        draggable: true,
        label: 'label',
        nodeKey: 'id',
      },
    });
    await nextTick();
    const options = sortableOptions as SortableOptions;
    const sourceEl = wrapper.find('[data-tree-node="a"]').element as HTMLElement;
    const targetEl = wrapper.find('[data-tree-node="b"]').element as HTMLElement;
    targetEl.getBoundingClientRect = () => ({
      bottom: 32,
      height: 32,
      left: 0,
      right: 120,
      top: 0,
      width: 120,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    options.onStart({ item: sourceEl });
    options.onMove(
      { dragged: sourceEl, related: targetEl, willInsertAfter: true },
      new MouseEvent('mousemove', { clientY: 16 }),
    );
    options.onEnd({ item: sourceEl, related: targetEl });

    const eventPayload = wrapper.emitted('nodeDataChange')?.[0]?.[0] as TreeDataChangeEvent;
    expect(eventPayload.data.map(node => node.id)).toEqual(['b']);
    expect(eventPayload.data[0].children?.map(node => node.id)).toEqual(['a']);
  });

  it('keeps an expanded target open after dropping a child into it', async () => {
    const data = [
      { id: 'a', label: 'A', children: [] },
      { id: 'b', label: 'B', children: [{ id: 'b-1', label: 'B-1', children: [] }] },
    ];
    const wrapper = await mount(BKTree, {
      props: {
        data,
        draggable: true,
        label: 'label',
        nodeKey: 'id',
      },
    });
    const treeVm = wrapper.vm as unknown as TreeTestVm;
    treeVm.setOpen(data[1], true);
    await nextTick();

    const options = sortableOptions as SortableOptions;
    const sourceEl = wrapper.find('[data-tree-node="a"]').element as HTMLElement;
    const targetEl = wrapper.find('[data-tree-node="b"]').element as HTMLElement;
    targetEl.getBoundingClientRect = () => ({
      bottom: 32,
      height: 32,
      left: 0,
      right: 120,
      top: 0,
      width: 120,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    options.onStart({ item: sourceEl });
    options.onMove(
      { dragged: sourceEl, related: targetEl, willInsertAfter: true },
      new MouseEvent('mousemove', { clientY: 16 }),
    );
    options.onEnd({ item: sourceEl, related: targetEl });
    await nextTick();

    expect(wrapper.find('[data-tree-node="b-1"]').exists()).toBe(true);
    expect(wrapper.find('[data-tree-node="a"]').exists()).toBe(true);
  });

  it('opens an empty target after dropping a child into it', async () => {
    const data = [
      { id: 'a', label: 'A', children: [] },
      { id: 'b', label: 'B', children: [] },
    ];
    const wrapper = await mount(BKTree, {
      props: {
        data,
        draggable: true,
        label: 'label',
        nodeKey: 'id',
      },
    });
    await nextTick();

    const options = sortableOptions as SortableOptions;
    const sourceEl = wrapper.find('[data-tree-node="a"]').element as HTMLElement;
    const targetEl = wrapper.find('[data-tree-node="b"]').element as HTMLElement;
    targetEl.getBoundingClientRect = () => ({
      bottom: 32,
      height: 32,
      left: 0,
      right: 120,
      top: 0,
      width: 120,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    options.onStart({ item: sourceEl });
    options.onMove(
      { dragged: sourceEl, related: targetEl, willInsertAfter: true },
      new MouseEvent('mousemove', { clientY: 16 }),
    );
    options.onEnd({ item: sourceEl, related: targetEl });
    await nextTick();

    const eventPayload = wrapper.emitted('nodeDataChange')?.[0]?.[0] as TreeDataChangeEvent;
    expect(eventPayload.data[0].children?.map(node => node.id)).toEqual(['a']);
    expect(wrapper.find('[data-tree-node="a"]').exists()).toBe(true);
  });

  it('drops a node as child in the middle area when dragSort is enabled', async () => {
    const data = [
      { id: 'a', label: 'A', children: [] },
      { id: 'b', label: 'B', children: [] },
      { id: 'c', label: 'C', children: [] },
    ];
    const wrapper = await mount(BKTree, {
      props: {
        data,
        dragSort: true,
        draggable: true,
        label: 'label',
        nodeKey: 'id',
      },
    });
    await nextTick();

    const options = sortableOptions as SortableOptions;
    const sourceEl = wrapper.find('[data-tree-node="a"]').element as HTMLElement;
    const targetEl = wrapper.find('[data-tree-node="b"]').element as HTMLElement;
    targetEl.getBoundingClientRect = () => ({
      bottom: 32,
      height: 32,
      left: 0,
      right: 120,
      top: 0,
      width: 120,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    options.onStart({ item: sourceEl });
    options.onMove(
      { dragged: sourceEl, related: targetEl, willInsertAfter: true },
      new MouseEvent('mousemove', { clientY: 16 }),
    );
    options.onEnd({ item: sourceEl, related: targetEl });
    await nextTick();

    const eventPayload = wrapper.emitted('nodeDataChange')?.[0]?.[0] as TreeDataChangeEvent;
    expect(eventPayload.data.map(node => node.id)).toEqual(['b', 'c']);
    expect(eventPayload.data[0].children?.map(node => node.id)).toEqual(['a']);
    expect(wrapper.emitted('nodeDragSort')).toBeFalsy();
    expect(wrapper.find('[data-tree-node="a"]').exists()).toBe(true);
  });

  it('respects disableDrop while dragging', async () => {
    const data = [
      { id: 'a', label: 'A', children: [] },
      { id: 'b', label: 'B', disabled: true, children: [] },
    ];
    const wrapper = await mount(BKTree, {
      props: {
        data,
        disableDrop: (_node: TreeNode, _type: DropType, target: TreeNode) => !!target.disabled,
        draggable: true,
        label: 'label',
        nodeKey: 'id',
      },
    });
    await nextTick();
    const options = sortableOptions as SortableOptions;
    const sourceEl = wrapper.find('[data-tree-node="a"]').element as HTMLElement;
    const targetEl = wrapper.find('[data-tree-node="b"]').element as HTMLElement;
    targetEl.getBoundingClientRect = () => ({
      bottom: 32,
      height: 32,
      left: 0,
      right: 120,
      top: 0,
      width: 120,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    options.onStart({ item: sourceEl });
    const moveResult = options.onMove(
      { dragged: sourceEl, related: targetEl, willInsertAfter: true },
      new MouseEvent('mousemove', { clientY: 16 }),
    );
    options.onEnd({ item: sourceEl, related: targetEl });

    expect(moveResult).toBe(-1);
    expect(wrapper.emitted('nodeDataChange')).toBeFalsy();
  });

  it('emits async load events when asyncNodeClick resolves', async () => {
    const data = [{ id: 'root', label: 'Root', async: true, children: [] }];
    const wrapper = await mount(BKTree, {
      props: {
        async: {
          callback: () => Promise.resolve([{ id: 'child', label: 'Child', children: [] }]),
          cache: true,
        },
        data,
        label: 'label',
        nodeKey: 'id',
      },
    });
    const treeVm = wrapper.vm as unknown as TreeTestVm;

    await treeVm.asyncNodeClick(data[0]);
    await nextTick();

    expect(wrapper.emitted('nodeAsyncLoad')).toBeTruthy();
    const eventPayload = wrapper.emitted('nodeDataChange')?.[0]?.[0] as TreeDataChangeEvent;
    expect(eventPayload.data[0].children).toEqual([{ id: 'child', label: 'Child', children: [] }]);
    expect(wrapper.find('[data-tree-node="child"]').exists()).toBe(true);
  });
});
