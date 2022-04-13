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

import Alert from '../src';

const components = {
  Alert,
};

describe('Alert', () => {
  it('theme', () => {
    const wrapper = mount({
      components,
      template: '<Alert theme="info" title="这是一个 alter" />',
    });

    expect(wrapper.classes()).toContain('bk-alert-info');
  });

  it('title', () => {
    const title = '这是一个 alter';
    const wrapper = mount({
      components,
      template: `<Alert title="${title}" />`,
    });

    expect(wrapper.find('.bk-alert-title').text()).toMatch(title);
  });

  it('closeText', () => {
    const closeText = '关闭';
    const wrapper = mount({
      components,
      template: `<Alert title="这是一个 alter" closeText="${closeText}" />`,
    });

    expect(wrapper.find('.bk-alert-close').text()).toMatch(closeText);
  });

  it('showIcon', () => {
    const wrapper = mount({
      components,
      template: `
        <div>
          <Alert id="testTrue" title="这是一个 alter" />
          <Alert id="testFalse" title="这是一个 alter" :showIcon="false" />
        </div>
      `,
    });

    expect(wrapper.findAll('.bk-alert-icon-info')).toHaveLength(1);
  });
});
