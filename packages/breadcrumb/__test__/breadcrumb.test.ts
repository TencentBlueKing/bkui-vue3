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

import Breadcrumb, { BkBreadcrumbItem } from '../src';

const Mount = (template: string) => mount({
  components: {
    'bk-breadcrumb': Breadcrumb,
    'bk-breadcrumb-item': BkBreadcrumbItem,
  },
  template,
}, {
  global: {
    provide: {
      breadcrumb: {},
    },
  },
});

describe('breadcrumb.tsx', () => {
  test('slot', () => {
    const wrapper = Mount(`
    <bk-breadcrumb separator="|">
      <bk-breadcrumb-item>
        <input/>
      </bk-breadcrumb-item>
    </bk-breadcrumb>
  `);
    expect(wrapper.find('input').exists()).toBe(true);
  });

  test('custom prefix slot', async () => {
    const wrapper = Mount(`
      <bk-breadcrumb separator="|">
        <bk-breadcrumb-item>
        </bk-breadcrumb-item>
        <template #prefix>
         <span class="custom-prefix"></span>
       </template>
      </bk-breadcrumb>
    `);

    expect(wrapper.find('.bk-breadcrumb-goback').exists()).toBe(true);
    expect(wrapper.find('.custom-prefix').exists()).toBe(true);
  });

  test('separator', () => {
    const wrapper = Mount(`
      <bk-breadcrumb separator="|">
        <bk-breadcrumb-item>Separator</bk-breadcrumb-item>
      </bk-breadcrumb>
    `);
    expect(wrapper.find('.bk-breadcrumb-separator').text()).toBe('|');
  });

  test('separatorClass', () => {
    const wrapper = Mount(`
      <bk-breadcrumb separator="|" separatorClass="separator-class">
        <bk-breadcrumb-item>separatorClass</bk-breadcrumb-item>
      </bk-breadcrumb>
    `);
    expect(wrapper.find('.bk-breadcrumb-separator').text()).toBe('');
    expect(wrapper.find('.bk-breadcrumb-separator').classes()).toContain('separator-class');
  });

  test('to', () => {
    const wrapper = Mount(`
      <bk-breadcrumb separator="/">
        <bk-breadcrumb-item to="/home">Home</bk-breadcrumb-item>
      </bk-breadcrumb>
    `);
    expect(wrapper.find('.bk-breadcrumb-item-inner').classes()).toContain('is-link');
  });

  test('link click', async () => {
    const wrapper = mount(BkBreadcrumbItem, {
      props: {
        to: '/test',
      },
      global: {
        provide: {
          breadcrumb: {},
        },
      },
    });
    await wrapper.find('.bk-breadcrumb-item-inner').trigger('click');
  });

  test('backRouter click', async () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        backRouter: { path: '/test' },
      },
      global: {
        provide: {
          breadcrumb: {},
        },
      },
    });
    expect(wrapper.find('.bk-breadcrumb-goback').exists()).toBe(true);
    expect(wrapper.find('svg').exists()).toBe(true);
    await wrapper.find('.bk-breadcrumb-goback').find('span')
      .trigger('click');
  });
});
