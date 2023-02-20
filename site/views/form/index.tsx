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

import { defineAsyncComponent, defineComponent } from 'vue';

import DemoBox from '../../components/demo-box';
import DemoTitle from '../../components/demo-title';
import PropsBox from '../../components/props-box';
import i18n from '../../language/i18n';
import { type IPropsTableItem } from '../../typings';
import { getCookie } from '../utils/cookie';

const lang = getCookie('lang');

const DemoForm = defineAsyncComponent(() => import(`./demo/${lang}/form.vue`));
const DemoComposeFormItem = defineAsyncComponent(() => import(`./demo/${lang}/compose-form-item.vue`));
const DemoFormDescription = defineAsyncComponent(() => import(`./demo/${lang}/form-description.vue`));
const DemoFormValidator = defineAsyncComponent(() => import(`./demo/${lang}/form-validator.vue`));
const DemoFormVertical = defineAsyncComponent(() => import(`./demo/${lang}/form-vertical.vue`));

const { t } = i18n.global;

const formProps: IPropsTableItem[] = [
  {
    name: 'form-type',
    type: 'String',
    default: null,
    desc: t('表单模式'),
    optional: ['default', 'vertical'],
  },
  {
    name: 'label-width',
    type: 'String',
    default: null,
    desc: t('表单域标签的宽度'),
    optional: [],
  },
  {
    name: 'label-position',
    type: 'String',
    default: null,
    desc: t('表单域标签的位置'),
    optional: ['left', 'center', 'right'],
  },
  {
    name: 'model',
    type: 'Object',
    default: null,
    desc: t('表单数据'),
    optional: [],
  },
  {
    name: 'rules',
    type: 'Array',
    default: null,
    desc: t('表单验证规则'),
    optional: [],
  },
];

const formItemProps: IPropsTableItem[] = [
  {
    name: 'label',
    type: 'String',
    default: null,
    desc: t('标签'),
    optional: [],
  },
  {
    name: 'label-width',
    type: 'String',
    default: null,
    desc: t('表单域标签的宽度'),
    optional: [],
  },
  {
    name: 'label-position',
    type: 'String',
    default: null,
    desc: t('表单域标签的位置'),
    optional: ['left', 'center', 'right'],
  },
  {
    name: 'property',
    type: 'String',
    default: null,
    desc: t('表单域 model 字段'),
    optional: [],
  },
  {
    name: 'required',
    type: 'Boolean',
    default: null,
    desc: t('是否必填'),
    optional: [],
  },
  {
    name: 'max',
    type: 'Number',
    default: null,
    desc: t('验证规则最大值'),
    optional: [],
  },
  {
    name: 'min',
    type: 'Number',
    default: null,
    desc: t('验证规则最小值'),
    optional: [],
  },
  {
    name: 'email',
    type: 'String',
    default: null,
    desc: t('验证规则Email'),
    optional: [],
  },
  {
    name: 'rules',
    type: 'Array',
    default: null,
    desc: t('验证规则'),
    optional: [],
  },
  {
    name: 'auto-check',
    type: 'String',
    default: null,
    desc: t('是否自动验证'),
    optional: [],
  },
  {
    name: 'description',
    type: 'String',
    default: null,
    desc: t('是否自动验证'),
    optional: [],
  },
];

export default defineComponent({
  name: 'Form',
  render() {
    return (
      <div>
        <DemoTitle name="Form" desc={t('由输入框、选择器、单选框、多选框等控件组成')} link="https://www.qq.com/" />
        <DemoBox title={t('基础用法')} desc="" componentName="form" demoName={`demo/${lang}/form`}>
          <DemoForm />
        </DemoBox>
        <DemoBox
          title={t('label 描述')}
          desc={t('FormItem 组件配置 description')}
          componentName="form"
          demoName={`demo/${lang}/form-description`}
        >
          <DemoFormDescription />
        </DemoBox>
        <DemoBox title={t('顶部对齐')} desc="" componentName="form" demoName={`demo/${lang}/form-vertical`}>
          <DemoFormVertical />
        </DemoBox>
        <DemoBox title={t('表单验证')} desc="" componentName="form" demoName={`demo/${lang}/form-validator`}>
          <DemoFormValidator />
        </DemoBox>
        <DemoBox title={t('组合表单组件')} desc="" componentName="form" demoName={`demo/${lang}/compose-form-item`}>
          <DemoComposeFormItem />
        </DemoBox>
        <PropsBox title={t('Form 属性')} subtitle="" propsData={formProps} />
        <PropsBox title={t('Form-Item 属性')} subtitle="" propsData={formItemProps} />
      </div>
    );
  },
});
