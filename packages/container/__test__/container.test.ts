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

import { h } from 'vue';

import { mount } from '@vue/test-utils';

import BkContainer, { BkCol, BkRow } from '../src';

describe('Container.tsx', () => {
  it('renders col when passed', async () => {
    const wrapper = await mount(BkContainer, {
      col: 5,
      slots: {
        default: [
          h(BkRow, {}, {
            default: [
              h(BkCol),
              h(BkCol),
              h(BkCol),
              h(BkCol),
              h(BkCol),
            ],
          }),
        ],
      },
    });
    // todo
    expect(wrapper.findAll('.bk-grid-col').length).toEqual(5);
  });

  it('renders gutter when passed', async () => {
    const wrapper = await mount(BkContainer, {
      props: {
        gutter: 30,
      },
      slots: {
        default: [
          h(BkRow, {}, {
            default: [
              h(BkCol),
              h(BkCol),
              h(BkCol),
              h(BkCol),
              h(BkCol),
            ],
          }),
        ],
      },
    });

    expect(wrapper.find('.bk-grid-col').html()).toContain('padding-right: 15px;');
  });

  it('renders extCls when passed', async () => {
    const wrapper = await mount(BkContainer, {
      props: {
        extCls: 'test',
      },
      slots: {
        default: [
          h(BkRow),
        ],
      },
    });

    expect(wrapper.find('.bk-grid-container').classes()).toContain('test');
  });

  it('renders flex when passed', async () => {
    const wrapper = await mount(BkContainer, {
      props: {
        flex: true,
      },
      slots: {
        default: [
          h(BkRow),
        ],
      },
    });

    expect(wrapper.find('.bk-grid-row').html()).toContain('display: flex;');
  });
});
