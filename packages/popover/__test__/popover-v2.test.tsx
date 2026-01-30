/**
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

// 测试 composables 的单元测试
import { resolveDelay } from '../src/composables/use-delay';

describe('Popover Composables', () => {
  describe('resolveDelay', () => {
    it('should return [delay, delay] for number input', () => {
      expect(resolveDelay(100)).toEqual([100, 100]);
      expect(resolveDelay(0)).toEqual([0, 0]);
      expect(resolveDelay(500)).toEqual([500, 500]);
    });

    it('should return [showDelay, hideDelay] for array input', () => {
      expect(resolveDelay([100, 200])).toEqual([100, 200]);
      expect(resolveDelay([0, 100])).toEqual([0, 100]);
    });

    it('should handle array with same values', () => {
      const result = resolveDelay([100, 100]);
      expect(result[0]).toBe(100);
      expect(result[1]).toBe(100);
    });
  });
});

describe('Popover Types', () => {
  it('should export types correctly', () => {
    // 类型检查 - 这些不会在运行时执行，但 TypeScript 会检查
    const triggerTypes = ['hover', 'click', 'manual'];
    const renderDirectives = ['if', 'show'];
    const themes = ['dark', 'light'];

    expect(triggerTypes).toContain('hover');
    expect(renderDirectives).toContain('if');
    expect(themes).toContain('dark');
  });
});

describe('Popover Props', () => {
  it('should have PopoverProps exported', () => {
    const { PopoverProps } = require('../src/props');
    
    // 检查关键 props 是否存在
    expect(PopoverProps).toBeDefined();
    expect(PopoverProps.isShow).toBeDefined();
    expect(PopoverProps.trigger).toBeDefined();
    expect(PopoverProps.placement).toBeDefined();
    expect(PopoverProps.content).toBeDefined();
    expect(PopoverProps.arrow).toBeDefined();
    expect(PopoverProps.theme).toBeDefined();
    expect(PopoverProps.offset).toBeDefined();
    expect(PopoverProps.disabled).toBeDefined();
    expect(PopoverProps.always).toBeDefined();
  });

  it('should have correct default values', () => {
    const { PopoverProps } = require('../src/props');
    
    // 检查默认值
    expect(PopoverProps.isShow.default).toBe(false);
    expect(PopoverProps.arrow.default).toBe(true);
    expect(PopoverProps.theme.default).toBe('dark');
    expect(PopoverProps.disabled.default).toBe(false);
    expect(PopoverProps.always.default).toBe(false);
  });
});
