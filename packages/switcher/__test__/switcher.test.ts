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
import Switcher from '../src/index';
import { nextTick } from 'vue';

jest.useFakeTimers();
/** 传入template 其他配置*/
const Mount = (config: any) => mount({
  components: {
    'bk-switcher': Switcher,
  },
  ...config,
}, {});

describe('Switcher.tsx', () => {
  test('switcher render with default checked', () => {
    const wrapper = Mount({
      template: '<bk-switcher :value="value"></bk-switcher>',
      data() {
        return {
          value: true,
        };
      },
    });
    expect(wrapper.classes()).toContain('is-checked');
  });

  test('value correctly update', async () => {
    const wrapper = Mount({
      template: `
        <bk-switcher v-model="value"></bk-switcher>
      `,
      data() {
        return {
          value: false,
        };
      },
    });
    const { vm } = wrapper;
    expect(wrapper.classes()).toContain('is-unchecked');
    await wrapper.trigger('click');
    expect(vm.value).toEqual(true);
  });

  test('change event', async () => {
    const wrapper = Mount({
      template: `
          <bk-switcher
            :value='value'
            @change="handleChange">
          </bk-switcher>
      `,
      methods: {
        handleChange(val: Boolean) {
          wrapper.setData({
            value: val,
          });
        },
      },
      data() {
        return {
          value: false,
        };
      },
    });
    const { vm } = wrapper;
    wrapper.trigger('click');
    wrapper.vm.$emit('change', true);
    expect(vm.value).toEqual(true);
  });

  test('switcher render with default disabled', () => {
    const wrapper = Mount({
      template: '<bk-switcher :value="value" :disabled="disabled"></bk-switcher>',
      data() {
        return {
          value: true,
          disabled: true,
        };
      },
    });
    expect(wrapper.classes()).toContain('is-checked');
    expect(wrapper.classes()).toContain('is-disabled');
  });

  test('disabled switch should not respond to user click', async () => {
    const wrapper = Mount({
      template: `
          <bk-switcher disabled v-model="value"></bk-switcher>
        `,
      data() {
        return {
          value: true,
        };
      },
    });
    const { vm } = wrapper;
    expect(vm.value).toEqual(true);
    await wrapper.trigger('click');
    expect(vm.value).toEqual(true);
  });

  test('expand switch value', async () => {
    const wrapper = Mount({
      template: `
          <bk-switcher
            v-model="value"
            :trueValue="trueValue"
            :falseValue="falseValue">
          </bk-switcher>
        `,
      data() {
        return {
          value: '100',
          trueValue: '100',
          falseValue: '0',
        };
      },
    });
    const { vm } = wrapper;
    await wrapper.trigger('click');
    expect(vm.value).toEqual('0');
  });

  test('switcher size test', () => {
    const wrapper = Mount({
      template: '<bk-switcher :size="size"></bk-switcher>',
      data() {
        return {
          size: 'small',
        };
      },
    });

    const wrapper1 = Mount({
      template: '<bk-switcher :size="size"></bk-switcher>',
      data() {
        return {
          size: 'large',
        };
      },
    });
    expect(wrapper.classes()).toContain('bk-switcher-small');
    expect(wrapper1.classes()).toContain('bk-switcher-large');
  });

  test('switcher theme test', () => {
    const wrapper = Mount({
      template: '<bk-switcher :theme="theme"></bk-switcher>',
      data() {
        return {
          theme: 'primary',
        };
      },
    });
    expect(wrapper.classes()).toContain('primary');
  });

  test('switcher ext-cls test', () => {
    const wrapper = Mount({
      template: '<bk-switcher :extCls="extCls"></bk-switcher>',
      data() {
        return {
          extCls: 'ext-cls-test',
        };
      },
    });
    expect(wrapper.classes()).toContain('ext-cls-test');
  });

  test('switcher is-outline,is-square  test', () => {
    const wrapper = Mount({
      template: '<bk-switcher :isOutline="isOutline" :isSquare="isSquare"></bk-switcher>',
      data() {
        return {
          isOutline: true,
          isSquare: true,
        };
      },
    });
    expect(wrapper.classes()).toContain('bk-switcher-outline');
    expect(wrapper.classes()).toContain('bk-switcher-square');
  });

  test('switcher show-text  test', () => {
    const wrapper1 = Mount({
      template: '<bk-switcher :showText="showText"></bk-switcher>',
      data() {
        return {
          showText: false,
        };
      },
    });

    const wrapper2 = Mount({
      template: '<bk-switcher :showText="showText"></bk-switcher>',
      data() {
        return {
          showText: true,
        };
      },
    });

    expect(wrapper1.find('.switcher-label').exists()).toBe(false);
    expect(wrapper2.find('.switcher-label').exists()).toBe(true);
  });

  test('switcher on-text,off-text  test', () => {
    const wrapper1 = Mount({
      template: '<bk-switcher :showText="showText"></bk-switcher>',
      data() {
        return {
          showText: true,
        };
      },
    });

    const wrapper2 = Mount({
      template: '<bk-switcher :showText="showText" :onText="onText" :offText="offText"></bk-switcher>',
      data() {
        return {
          onText: '开',
          offText: '关',
          showText: true,
        };
      },
    });
    const onText1 = wrapper1.find('.on-text');
    const offText1 = wrapper1.find('.off-text');
    const onText2 = wrapper2.find('.on-text');
    const offText2 = wrapper2.find('.off-text');

    expect(onText1.text()).toContain('ON');
    expect(offText1.text()).toContain('OFF');
    expect(onText2.text()).toContain('开');
    expect(offText2.text()).toContain('关');
  });

  test('preCheck function return promise', async () => {
    const wrapper = Mount({
      template: `
          <bk-switcher
            v-model="value"
            :preCheck="preCheck"
          />
        `,
      data() {
        return {
          value: true,
        };
      },
      methods: {
        preCheck(lastValue: any) {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(lastValue);
            }, 3000);
          });
        },
      },
    });
    const { vm } = wrapper;

    wrapper.trigger('click');
    jest.runAllTimers();
    await nextTick();
    expect(vm.value).toEqual(false);
  });
});
