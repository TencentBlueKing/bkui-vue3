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
import Steps from '../src/';

const Mount = (template: string) => mount({
  components: {
    BkSteps: Steps,
  },
  template,
}, {
  global: {
    provide: {
      Steps: {},
    },
  },
});

describe('Steps.tsx', () => {
  it('test curStep', async () => {
    const wrapper = await mount(Steps, {
      props: { curStep: 1 },
    });
    expect(wrapper.findAll('.done').length).toEqual(0);
  });

  it('test direction', async () => {
    const direction = 'horizontal';
    const wrapper = await mount(Steps, {
      props: { direction },
    });
    expect(wrapper.findAll(`.bk-steps-${direction}`).length).toEqual(1);
  });

  it('test controllable', async () => {
    const controllable = true;
    const wrapper = await mount(Steps, {
      props: { controllable },
    });
    expect(wrapper.vm.controllable).toBe(true);
  });

  it('test theme', async () => {
    const themes = ['primary', 'success', 'warning', 'danger'];
    const { validator } = Steps.props.theme;
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    themes.forEach(async (theme: string) => {
      const wrapper = await mount(Steps, {
        props: {
          theme,
        },
      });
      expect(validator(theme)).toBe(true);
      expect(wrapper.findAll(`.bk-steps-${theme}`).length).toEqual(1);
    });
  });

  it('test steps size', async () => {
    const size = 'small';
    const wrapper = await mount(Steps, {
      props: { size },
    });
    expect(wrapper.findAll(`.bk-steps-${size}`).length).toEqual(1);
  });

  it('test steps status', async () => {
    const status = ['error', 'loading'];
    const { validator } = Steps.props.status;
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    status.forEach(async (statu: string) => {
      const wrapper = await mount(Steps, {
        props: {
          statu,
        },
      });
      expect(validator(statu)).toBe(true);
      expect(wrapper.findAll(`.bk-steps-${statu}`).length).toEqual(1);
    });
  });

  it('test steps extCls', async () => {
    const wrapper = Mount(`
      <BkSteps extCls="bk-steps-test">
      </BkSteps>
    `);

    expect(wrapper.findAll('.bk-steps-test').length).toEqual(1);
    expect(wrapper.find('.bk-steps-test').exists()).toBe(true);
  });


  it('test steps', async () => {
    const steps = [
      { title: '测试一', icon: 1, description: '这是描述' },
      { title: '测试二', icon: 2, description: '这是描述2', status: 'error' },
      { title: '测试三', icon: 3 },
      { title: '测试四', icon: 4 },
    ];
    const wrapper = await mount(Steps, {
      props: {
        steps,
      },
    });
    expect(wrapper.findAll('.bk-step-no-content').length).toEqual(0);
  });
});
