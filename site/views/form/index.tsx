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
import { type IPropsTableItem } from '../../typings';
import DemoComposeFormItem from './demo/compose-form-item.vue';
import DemoForm from './demo/form.vue';
import DemoFormDescription from './demo/form-description.vue';
import DemoFormValidator from './demo/form-validator.vue';
import DemoFormVertical from './demo/form-vertical.vue';

const formProps: IPropsTableItem[] = [
  {
    name: 'form-type',
    type: 'String',
    default: null,
    desc: '表单模式',
    optional: ['default', 'vertical'],
  },
  {
    name: 'label-width',
    type: 'String',
    default: null,
    desc: '表单域标签的宽度',
    optional: [],
  },
  {
    name: 'label-position',
    type: 'String',
    default: null,
    desc: '表单域标签的位置',
    optional: ['left', 'center', 'right'],
  },
  {
    name: 'model',
    type: 'Object',
    default: null,
    desc: '表单数据',
    optional: [],
  },
  {
    name: 'rules',
    type: 'Array',
    default: null,
    desc: '表单验证规则',
    optional: [],
  },
];

const formRules = [
  {
    name: 'required',
    type: 'Boolean',
    default: null,
    desc: '验证不为空',
  },
  {
    name: 'email',
    type: 'Boolean',
    default: null,
    desc: '验证email',
  },
  {
    name: 'min',
    type: 'Boolean',
    default: null,
    desc: '数字最小值',
  },
  {
    name: 'max',
    type: 'Boolean',
    default: null,
    desc: '数字最大值',
  },
  {
    name: 'maxlength',
    type: 'Boolean',
    default: null,
    desc: '字符串最大长度',
  },
  {
    name: 'pattern',
    type: 'RegExp',
    default: null,
    desc: '自定义正则',
  },
  {
    name: 'validator',
    type: 'Function',
    default: null,
    desc: '自定义验证函数',
  },
  {
    name: 'message',
    type: 'String',
    default: null,
    desc: '验证错误提示',
  },
  {
    name: 'trigger',
    type: 'String',
    default: 'change',
    desc: '触发校验的方式',
    optional: ['change', 'blur'],
  },
];

const formMethods: IPropsTableItem[] = [
  {
    name: 'validate',
    type: 'Function',
    default: null,
    desc: '触发表单校验',
    optional: [],
  },
  {
    name: 'getValidateResult',
    type: 'Function',
    default: null,
    desc: '只获取表单校验结果，不会标记错误表单项',
    optional: [],
  },
  {
    name: 'clearValidate',
    type: 'Function',
    default: null,
    desc: '触发表单校验',
    optional: [],
  },
];

const formEvents: IPropsTableItem[] = [
  {
    name: 'submit',
    default: null,
    desc: '表单提交',
    optional: [],
  },
  {
    name: 'validate',
    type: '(property: string, result: boolean, message: string) => void',
    default: null,
    desc: 'Form Item 校验结束后触发',
    optional: [],
  },
];

const formItemProps: IPropsTableItem[] = [
  {
    name: 'label',
    type: 'String',
    default: null,
    desc: '标签',
    optional: [],
  },
  {
    name: 'label-width',
    type: 'String',
    default: null,
    desc: '表单域标签的宽度',
    optional: [],
  },
  {
    name: 'label-position',
    type: 'String',
    default: null,
    desc: '表单域标签的位置',
    optional: ['left', 'center', 'right'],
  },
  {
    name: 'property',
    type: 'String',
    default: null,
    desc: '表单域 model 字段',
    optional: [],
  },
  {
    name: 'required',
    type: 'Boolean',
    default: null,
    desc: '是否必填',
    optional: [],
  },
  {
    name: 'max',
    type: 'Number',
    default: null,
    desc: '验证规则最大值',
    optional: [],
  },
  {
    name: 'min',
    type: 'Number',
    default: null,
    desc: '验证规则最小值',
    optional: [],
  },
  {
    name: 'maxlength',
    type: 'Number',
    default: null,
    desc: '验证规则最大长度',
    optional: [],
  },
  {
    name: 'email',
    type: 'String',
    default: null,
    desc: '验证规则Email',
    optional: [],
  },
  {
    name: 'rules',
    type: 'Array',
    default: null,
    desc: '验证规则',
    optional: [],
  },
  {
    name: 'auto-check',
    type: 'String',
    default: null,
    desc: '是否自动验证',
    optional: [],
  },
  {
    name: 'description',
    type: 'String',
    default: null,
    desc: '是否自动验证',
    optional: [],
  },
  {
    name: 'error-display-type',
    type: 'String',
    default: null,
    desc: '错误提示类型',
    optional: ['tooltips', 'normal'],
  },
];

const formItemSlots: IPropsTableItem[] = [
  {
    name: 'label',
    type: '() => string',
    default: null,
    desc: '自定义表单项 label',
    optional: [],
  },
  {
    name: 'error',
    type: '(message: string) => string',
    default: null,
    desc: '自定义表单项验证错误信息',
    optional: [],
  },
];

export default defineComponent({
  name: 'Form',
  render() {
    return (
      <div>
        <DemoTitle
          desc='由输入框、选择器、单选框、多选框等控件组成'
          designLink='https://bkdesign.bk.tencent.com/design/33'
          name='Form'
        />
        <DemoBox
          componentName='form'
          demoName='/demo/form'
          desc=''
          title='基础用法'
        >
          <DemoForm />
        </DemoBox>
        <DemoBox
          componentName='form'
          demoName='/demo/form-description'
          desc='FormItem 组件配置 description'
          title='label 描述'
        >
          <DemoFormDescription />
        </DemoBox>
        <DemoBox
          componentName='form'
          demoName='/demo/form-vertical'
          desc=''
          title='顶部对齐'
        >
          <DemoFormVertical />
        </DemoBox>
        <DemoBox
          componentName='form'
          demoName='/demo/form-validator'
          desc=''
          title='表单验证'
        >
          <DemoFormValidator />
        </DemoBox>
        <DemoBox
          componentName='form'
          demoName='/demo/compose-form-item'
          desc=''
          title='组合表单组件'
        >
          <DemoComposeFormItem />
        </DemoBox>
        <PropsBox
          propsData={formProps}
          subtitle=''
          title='Form 属性'
        />
        <PropsBox
          propsData={formMethods}
          subtitle=''
          title='Form 实例方法'
        />
        <PropsBox
          propsData={formEvents}
          subtitle=''
          title='Form 事件'
        />
        <PropsBox
          propsData={formItemProps}
          subtitle=''
          title='Form-Item 属性'
        />
        <PropsBox
          propsData={formItemSlots}
          subtitle=''
          title='Form-Item Slot'
        />
        <PropsBox
          propsData={formRules}
          subtitle=''
          title='Rule 验证规则配置'
        />
      </div>
    );
  },
});
