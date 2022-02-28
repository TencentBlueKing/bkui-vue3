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

import { mount } from '@vue/test-utils';
import FixedNavbar from '../src';
describe('FixedNavbar.tsx', () => {
  it('test fixed-navbar render', async () => {
    const extCls = 'text-bar-class';
    const wrapper = await mount(FixedNavbar, {
      props: {
        extCls,
      },
    });
    expect(wrapper.classes()).toContain(extCls);
  });

  it('test position props', async () => {
    const positions = ['middle', 'top', 'bottom'];
    const { validator } = FixedNavbar.props.position;
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    positions.forEach(async (position) => {
      const wrapper = await mount(FixedNavbar, {
        props: {
          position,
        },
      });
      expect(validator(position)).toBe(true);
      expect(wrapper.classes()).toContain(position);
    });
    expect(validator('left')).toBe(false);
  });

  it('test click event', async () => {
    const handleClick = () => true;
    const wrapper = await mount(FixedNavbar, {
      props: {
        navItems: [{
          text: 'test',
          icon: 'icon',
          action: handleClick,
        }],
      },
    });

    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });
});
