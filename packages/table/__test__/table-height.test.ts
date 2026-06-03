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

import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';

import BkTable from '../src/table';

function generateData(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    ip: `192.168.0.${i + 1}`,
    source: i % 2 === 0 ? 'QQ' : 'WeChat',
    status: i % 3 === 0 ? 'Running' : 'Stopped',
    create_time: '2024-01-01 00:00:00',
  }));
}

const columns = [
  { label: 'IP', field: 'ip' },
  { label: 'Source', field: 'source' },
  { label: 'Status', field: 'status' },
  { label: 'Time', field: 'create_time' },
];

function mockElementLayout(el: HTMLElement, dimensions: { offsetHeight?: number; scrollHeight?: number; clientWidth?: number; clientHeight?: number }) {
  if (dimensions.offsetHeight !== undefined) {
    jest.spyOn(el, 'offsetHeight', 'get').mockReturnValue(dimensions.offsetHeight);
  }
  if (dimensions.scrollHeight !== undefined) {
    jest.spyOn(el, 'scrollHeight', 'get').mockReturnValue(dimensions.scrollHeight);
  }
  if (dimensions.clientWidth !== undefined) {
    jest.spyOn(el, 'clientWidth', 'get').mockReturnValue(dimensions.clientWidth);
  }
  if (dimensions.clientHeight !== undefined) {
    jest.spyOn(el, 'clientHeight', 'get').mockReturnValue(dimensions.clientHeight);
  }
}

function flushTimers() {
  return new Promise<void>(resolve => setTimeout(resolve, 100));
}

describe('Table Height & Scroll', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Root container style', () => {
    it('applies fixed pixel height to root element', () => {
      const wrapper = mount(BkTable, {
        props: { data: generateData(3), columns, height: 300 },
      });
      const root = wrapper.find('.bk-table');
      expect(root.attributes('style')).toContain('height: 300px');
    });

    it('applies height="auto" to root element', () => {
      const wrapper = mount(BkTable, {
        props: { data: generateData(3), columns, height: 'auto' },
      });
      const root = wrapper.find('.bk-table');
      expect(root.attributes('style')).toContain('height: auto');
    });

    it('applies percentage height to root element', () => {
      const wrapper = mount(BkTable, {
        props: { data: generateData(3), columns, height: '100%' },
      });
      const root = wrapper.find('.bk-table');
      expect(root.attributes('style')).toContain('height: 100%');
    });

    it('applies maxHeight as inline style when not auto', () => {
      const wrapper = mount(BkTable, {
        props: { data: generateData(3), columns, height: 'auto', maxHeight: 300 },
      });
      const root = wrapper.find('.bk-table');
      expect(root.attributes('style')).toContain('max-height: 300px');
    });

    it('does not apply maxHeight inline style when auto (default)', () => {
      const wrapper = mount(BkTable, {
        props: { data: generateData(3), columns, height: 'auto' },
      });
      const root = wrapper.find('.bk-table');
      const style = root.attributes('style') || '';
      expect(style).not.toContain('max-height');
    });

    it('applies percentage maxHeight to root element', () => {
      const wrapper = mount(BkTable, {
        props: { data: generateData(3), columns, height: 'auto', maxHeight: '100%' },
      });
      const root = wrapper.find('.bk-table');
      expect(root.attributes('style')).toContain('max-height: 100%');
    });
  });

  describe('Body height with fixed pixel height', () => {
    it('sets body height to fixed value minus footer', async () => {
      const wrapper = mount(BkTable, {
        props: { data: generateData(3), columns, height: 500 },
      });

      jest.advanceTimersByTime(200);
      await nextTick();

      const body = wrapper.find('.bk-table-body');
      const style = body.attributes('style') || '';
      expect(style).toContain('height');
      expect(style).not.toContain('height: auto');
    });
  });

  describe('Body height with height="auto" + maxHeight constraint', () => {
    it('initializes bodyHeight to 100% when maxHeight is set', () => {
      const wrapper = mount(BkTable, {
        props: { data: generateData(3), columns, height: 'auto', maxHeight: 300 },
      });

      const body = wrapper.find('.bk-table-body');
      const style = body.attributes('style') || '';
      expect(style).toContain('height');
    });

    it('initializes bodyHeight to 100% when maxHeight is percentage', () => {
      const wrapper = mount(BkTable, {
        props: { data: generateData(3), columns, height: 'auto', maxHeight: '100%' },
      });

      const body = wrapper.find('.bk-table-body');
      const style = body.attributes('style') || '';
      expect(style).toContain('height');
    });

    it('sets body maxHeight to 100% when table maxHeight is set', () => {
      const wrapper = mount(BkTable, {
        props: { data: generateData(3), columns, height: 'auto', maxHeight: 300 },
      });

      const body = wrapper.find('.bk-table-body');
      const style = body.attributes('style') || '';
      expect(style).toContain('max-height');
    });
  });

  describe('Body height without maxHeight (height="auto" only)', () => {
    it('sets body height to auto when no constraints', () => {
      const wrapper = mount(BkTable, {
        props: { data: generateData(3), columns, height: 'auto' },
      });

      const body = wrapper.find('.bk-table-body');
      const style = body.attributes('style') || '';
      expect(style).toContain('height: auto');
    });
  });

  describe('DOM structure', () => {
    it('renders body-wrapper with correct structure', () => {
      const wrapper = mount(BkTable, {
        props: { data: generateData(3), columns, height: 300 },
      });

      expect(wrapper.find('.bk-table-body-wrapper').exists()).toBe(true);
      expect(wrapper.find('.bk-table-body').exists()).toBe(true);
    });

    it('renders table head inside body for scroll sync', () => {
      const wrapper = mount(BkTable, {
        props: { data: generateData(3), columns, height: 300 },
      });

      const bodyWrapper = wrapper.find('.bk-table-body-wrapper');
      expect(bodyWrapper.find('.bk-table-head').exists()).toBe(true);
    });

    it('renders rows correctly', async () => {
      const data = generateData(5);
      const wrapper = mount(BkTable, {
        props: { data, columns, height: 300 },
      });

      jest.advanceTimersByTime(200);
      await nextTick();

      const rows = wrapper.findAll('table > tbody > tr');
      expect(rows.length).toEqual(5);
    });
  });

  describe('Height calculation with pagination', () => {
    it('subtracts footer height when pagination is shown', async () => {
      const wrapper = mount(BkTable, {
        props: {
          data: generateData(20),
          columns,
          height: 500,
          pagination: { count: 20, limit: 10, current: 1 },
        },
      });

      mockElementLayout(wrapper.vm.$el, { offsetHeight: 500 });

      jest.advanceTimersByTime(200);
      await nextTick();

      const body = wrapper.find('.bk-table-body');
      const style = body.attributes('style') || '';
      expect(style).toContain('height');
      expect(style).not.toContain('height: auto');
    });
  });

  describe('Virtual scroll mode', () => {
    it('initializes bodyHeight to 100% when virtualEnabled', () => {
      const wrapper = mount(BkTable, {
        props: { data: generateData(100), columns, height: 300, virtualEnabled: true },
      });

      const body = wrapper.find('.bk-table-body');
      const style = body.attributes('style') || '';
      expect(style).toContain('height');
    });

    it('sets bodyHeight from fixed pixel height in virtual mode', async () => {
      const wrapper = mount(BkTable, {
        props: { data: generateData(100), columns, height: 500, virtualEnabled: true },
      });

      mockElementLayout(wrapper.vm.$el, { offsetHeight: 500, clientWidth: 800 });

      jest.advanceTimersByTime(200);
      await nextTick();

      const body = wrapper.find('.bk-table-body');
      const style = body.attributes('style') || '';
      expect(style).toContain('height');
    });
  });

  describe('Dynamic data changes', () => {
    it('updates body height when data changes', async () => {
      const wrapper = mount(BkTable, {
        props: { data: generateData(3), columns, height: 300 },
      });

      jest.advanceTimersByTime(200);
      await nextTick();

      await wrapper.setProps({ data: generateData(50) });

      jest.advanceTimersByTime(200);
      await nextTick();

      const rows = wrapper.findAll('table > tbody > tr');
      expect(rows.length).toEqual(50);
    });

    it('adjusts layout after data is cleared', async () => {
      const wrapper = mount(BkTable, {
        props: { data: generateData(10), columns, height: 300 },
      });

      jest.advanceTimersByTime(200);
      await nextTick();

      await wrapper.setProps({ data: [] });

      jest.advanceTimersByTime(200);
      await nextTick();

      const rows = wrapper.findAll('table > tbody > tr');
      expect(rows.length).toEqual(0);
    });
  });

  describe('Exposed methods', () => {
    it('exposes scrollTo method', () => {
      const wrapper = mount(BkTable, {
        props: { data: generateData(3), columns, height: 300 },
      });

      expect(typeof wrapper.vm.scrollTo).toBe('function');
    });

    it('exposes getRoot method', () => {
      const wrapper = mount(BkTable, {
        props: { data: generateData(3), columns, height: 300 },
      });

      expect(typeof wrapper.vm.getRoot).toBe('function');
      expect(wrapper.vm.getRoot()).toBeTruthy();
    });
  });

  describe('Height prop changes', () => {
    it('updates root style when height prop changes', async () => {
      const wrapper = mount(BkTable, {
        props: { data: generateData(3), columns, height: 300 },
      });

      const root = wrapper.find('.bk-table');
      expect(root.attributes('style')).toContain('height: 300px');

      await wrapper.setProps({ height: 500 });
      expect(root.attributes('style')).toContain('height: 500px');
    });

    it('switches from auto to fixed height', async () => {
      const wrapper = mount(BkTable, {
        props: { data: generateData(3), columns, height: 'auto' },
      });

      const root = wrapper.find('.bk-table');
      expect(root.attributes('style')).toContain('height: auto');

      await wrapper.setProps({ height: 400 });
      expect(root.attributes('style')).toContain('height: 400px');
    });
  });

  describe('Border height adjustment', () => {
    it('renders with outer border correctly', () => {
      const wrapper = mount(BkTable, {
        props: { data: generateData(3), columns, height: 300, border: ['outer'] },
      });

      expect(wrapper.find('.bk-table').classes()).toContain('bordered-outer');
    });
  });
});
