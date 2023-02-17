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

import { defineComponent } from 'vue';

import DemoBox from '../../components/demo-box';
import DemoTitle from '../../components/demo-title';
import PropsBox from '../../components/props-box';
import i18n from '../../language/i18n';
import { IPropsTableItem } from '../../typings';

import BaseDemo from './base-demo.vue';
import PresetDemo from './preset-demo.vue';
import SizeDemo from './size-demo.vue';

const { t } = i18n.global;

const colorPickerPropsJson: IPropsTableItem[] = [
  {
    name: 'v-model',
    type: 'String',
    default: '#3A84FF',
    desc: t('当前选择的RGB颜色值'),
    optional: [],
  },
  {
    name: 'size',
    type: 'String',
    default: '""',
    desc: t('有三种尺寸：大、默认（中）、小。'),
    optional: ['large', 'small'],
  },
  {
    name: 'show-value',
    type: 'Boolean',
    default: 'true',
    desc: t('是否显示当前选择的RGB颜色值'),
    optional: ['true', 'false'],
  },
  {
    name: 'transfer',
    type: 'Boolean',
    default: 'false',
    desc: t('控制颜色面板是否出现在 body 内'),
    optional: ['true', 'false'],
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: t('是否禁用'),
    optional: ['true', 'false'],
  },
  {
    name: 'readonly',
    type: 'Boolean',
    default: 'false',
    desc: t('是否只读'),
    optional: ['true', 'false'],
  },
  {
    name: 'recommend',
    type: 'Boolean/Array',
    default: 'true',
    desc: t('是否显示预设值'),
    optional: [],
  },
  {
    name: 'ext-cls',
    type: 'String',
    default: '',
    desc: t('配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-color-picker 上'),
    optional: [],
  },
];

const colorPickerChangePropsJson: IPropsTableItem[] = [
  {
    name: 'change',
    type: 'Function',
    default: '',
    desc: t('当前选择的RGB颜色值变化时调用'),
    optional: [],
  },
];

export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          name={t('ColorPicker 颜色选择器')}
          desc={t('用于颜色选择，支持多种颜色格式，支持颜色预设。')}
          link="https://www.google.com.hk/"
        />

        <DemoBox
          title={t('基础用法')}
          desc={t('使用 bk-color-picker 标签配置颜色选择器组件')}
          componentName="color-picker"
          demoName="base-demo"
        >
          <BaseDemo></BaseDemo>
        </DemoBox>

        <DemoBox
          title={t('不同尺寸')}
          desc={t('选择器有三种尺寸：大、默认（中）、小。')}
          componentName="color-picker"
          demoName="size-demo"
        >
          <SizeDemo></SizeDemo>
        </DemoBox>

        <DemoBox
          title={t('颜色预设')}
          desc={t('当 recommend 属性为 true 时显示推荐的颜色预设，为 false 时关闭预设，也可传入数组自定义预设。')}
          componentName="color-picker"
          demoName="preset-demo"
        >
          <PresetDemo></PresetDemo>
        </DemoBox>

        <PropsBox title={t('BkColorPicker 属性')} propsData={colorPickerPropsJson} />

        <PropsBox title={t('BkColorPicker 事件')} propsData={colorPickerChangePropsJson} />
      </div>
    );
  },
});
