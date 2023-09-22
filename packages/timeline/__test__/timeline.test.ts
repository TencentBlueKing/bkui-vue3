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

import Timeline from '../src/index';

const Mount = (template: string) =>
  mount(
    {
      components: {
        BkTimeline: Timeline,
      },
      template,
    },
    {
      global: {
        provide: {
          Timeline: {},
        },
      },
    },
  );

describe('Timeline.tsx', () => {
  it('test timeline icon', async () => {
    const wrapper = await mount(Timeline, {
      props: {
        list: [
          {
            tag: '步骤1',
            content: '内容1',
          },
          {
            tag: '步骤2',
            content: '内容2',
          },
        ],
      },
    });
    expect(wrapper.findAll('.bk-timeline-icon').length).toEqual(0);
  });

  it('test timeline default', async () => {
    const wrapper = await mount(Timeline, {
      props: {
        list: [
          {
            tag: '步骤1',
            content: '内容1',
          },
          {
            tag: '步骤2',
            content: '内容2',
          },
        ],
      },
    });
    expect(wrapper.findAll('.bk-timeline-default').length).toEqual(2);
  });

  it('test theme', async () => {
    const wrapper = await mount(Timeline, {
      props: {
        list: [
          {
            tag: '步骤1',
            content: '内容1',
            type: 'warning',
          },
          {
            tag: '步骤2',
            content: '内容2',
            type: 'success',
          },
        ],
      },
    });
    expect(wrapper.findAll('.bk-timeline-success').length).toEqual(1);
    expect(wrapper.findAll('.bk-timeline-warning').length).toEqual(1);
  });

  it('test timeline size', async () => {
    const wrapper = await mount(Timeline, {
      props: {
        list: [
          {
            tag: '步骤1',
            content: '内容1',
            type: 'warning',
            size: 'large',
          },
          {
            tag: '步骤2',
            content: '内容2',
            type: 'success',
          },
        ],
      },
    });
    expect(wrapper.findAll('.bk-timeline-large').length).toEqual(1);
    expect(wrapper.find('.bk-timeline-large').exists()).toBe(true);
  });

  it('test timeline filled', async () => {
    const wrapper = await mount(Timeline, {
      props: {
        list: [
          {
            tag: '步骤1',
            content: '内容1',
            type: 'warning',
            size: 'large',
            filled: true,
          },
          {
            tag: '步骤2',
            content: '内容2',
            type: 'success',
          },
        ],
      },
    });
    expect(wrapper.findAll('.bk-timeline-filled').length).toEqual(1);
    expect(wrapper.find('.bk-timeline-filled').exists()).toBe(true);
  });

  it('test timeline color', async () => {
    const wrapper = await mount(Timeline, {
      props: {
        list: [
          {
            tag: '步骤1',
            content: '内容1',
            type: 'warning',
            size: 'large',
            filled: true,
            color: 'green',
          },
          {
            tag: '步骤2',
            content: '内容2',
            type: 'success',
            color: 'yellow',
          },
        ],
      },
    });
    expect(wrapper.findAll('.bk-timeline-green').length).toEqual(1);
    expect(wrapper.findAll('.bk-timeline-yellow').length).toEqual(1);
  });

  it('test timeline extCls', async () => {
    const wrapper = Mount(`
      <BkTimeline extCls="bk-timeline-test">
      </BkTimeline>
    `);

    expect(wrapper.findAll('.bk-timeline-test').length).toEqual(1);
    expect(wrapper.find('.bk-timeline-test').exists()).toBe(true);
  });
});
