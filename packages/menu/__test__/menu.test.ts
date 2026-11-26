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

import Menu from '../src/menu';
import MenuItem from '../src/menu-item';
import Submenu from '../src/submenu';

describe('Menu.tsx', () => {
  it('disabled submenu does not toggle, existing submenus still do', async () => {
    const wrapper = mount({
      components: { Menu, Submenu, MenuItem },
      template: `
        <Menu>
          <Submenu key="数字" title="数字">
            <MenuItem key="腾讯微视">腾讯微视</MenuItem>
          </Submenu>
          <Submenu key="内容" title="内容">
            <MenuItem key="腾讯影业">腾讯影业</MenuItem>
          </Submenu>
          <Submenu key="未开放" title="未开放" disabled>
            <MenuItem key="暂未开放">暂未开放</MenuItem>
          </Submenu>
        </Menu>
      `,
    });

    const menus = wrapper.findAll('.bk-menu-submenu');
    const headers = wrapper.findAll('.submenu-header');
    const [numberMenu, contentMenu, closedMenu] = menus;
    const [numberHeader, contentHeader, closedHeader] = headers;

    expect(numberMenu.classes()).not.toContain('is-disabled');
    expect(contentMenu.classes()).not.toContain('is-disabled');
    expect(numberHeader.attributes('aria-disabled')).toBeUndefined();
    expect(contentHeader.attributes('aria-disabled')).toBeUndefined();
    expect(numberHeader.attributes('tabindex')).toBeUndefined();
    expect(contentHeader.attributes('tabindex')).toBeUndefined();

    expect(closedMenu.classes()).toContain('is-disabled');
    expect(closedMenu.attributes('aria-disabled')).toBe('true');
    expect(closedHeader.attributes('aria-disabled')).toBe('true');
    expect(closedMenu.text()).toContain('未开放');

    await closedHeader.trigger('click');
    await closedHeader.trigger('keydown', { key: 'Enter' });
    await closedHeader.trigger('keydown', { key: ' ' });
    expect(closedMenu.classes()).not.toContain('is-opened');
    expect(wrapper.findComponent(Menu).emitted('openChange')).toBeUndefined();
    expect(wrapper.findAllComponents(Submenu)[2].emitted('collapse')).toBeUndefined();

    await numberHeader.trigger('click');
    expect(numberMenu.classes()).toContain('is-opened');
    expect(contentMenu.classes()).not.toContain('is-opened');
    expect(closedMenu.classes()).not.toContain('is-opened');

    await numberHeader.trigger('click');
    expect(numberMenu.classes()).not.toContain('is-opened');

    await contentHeader.trigger('click');
    expect(contentMenu.classes()).toContain('is-opened');
    expect(numberMenu.classes()).not.toContain('is-opened');

    await contentHeader.trigger('click');
    expect(contentMenu.classes()).not.toContain('is-opened');

    await closedHeader.trigger('click');
    expect(closedMenu.classes()).not.toContain('is-opened');
    expect(wrapper.findAllComponents(Submenu)[2].emitted('collapse')).toBeUndefined();
    const openChanges = wrapper.findComponent(Menu).emitted('openChange') || [];
    expect(openChanges).toHaveLength(4);
  });
});
