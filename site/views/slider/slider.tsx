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
import { IPropsTableItem } from '../../typings';
import { getCookie } from '../utils/cookie';

const lang = getCookie('blueking_language');

const BaseDemo = defineAsyncComponent(() => import(`./demo/${lang}/base-demo.vue`));
const CustomDemo = defineAsyncComponent(() => import(`./demo/${lang}/custom-demo.vue`));
const InputDemo = defineAsyncComponent(() => import(`./demo/${lang}/input-demo.vue`));
const StepDemo = defineAsyncComponent(() => import(`./demo/${lang}/step-demo.vue`));
const VerticalDemo = defineAsyncComponent(() => import(`./demo/${lang}/vertical-demo.vue`));

const { t } = i18n.global;

const switcherPropsJson: IPropsTableItem[] = [
  {
    name: 'value',
    type: 'number/array' as any,
    default: '0',
    desc: '使用v-model，将指定变量与slider的值进行绑定',
    optional: [],
  },
  {
    name: 'extCls',
    type: 'String',
    default: '',
    desc: '自定义类名',
    optional: [],
  },
  {
    name: 'vertical',
    type: 'Boolean',
    default: 'false',
    desc: '是否垂直',
    optional: ['true', 'false'],
  },
  {
    name: 'height',
    type: 'String',
    default: '200PX',
    desc: '垂直状态下的高度',
    optional: [],
  },
  {
    name: 'disable',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用',
    optional: [],
  },
  {
    name: 'showTip',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示滑块的tip',
    optional: [],
  },
  {
    name: 'maxValue',
    type: 'Number',
    default: '100',
    desc: '最大值',
    optional: [],
  },
  {
    name: 'minValue',
    type: 'Number',
    default: '0',
    desc: '最小值',
    optional: [],
  },
  {
    name: 'step',
    type: 'Number',
    default: '1',
    desc: '每一步的距离',
    optional: [],
  },
  {
    name: 'range',
    type: 'Boolean',
    default: 'false',
    desc: '是否为分段式',
    optional: [],
  },
  {
    name: 'showInterval',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示间断点',
    optional: [],
  },
  {
    name: 'showIntervalLabel',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示间断点下的文字',
    optional: [],
  },
  {
    name: 'showButtonLabel',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示滑块下的问题，不可与showIntervalLabel同时使用',
    optional: [],
  },
  {
    name: 'showBetweenLabel',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示首尾的文字',
    optional: [],
  },
  {
    name: 'showInput',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示输入框',
    optional: [],
  },
  {
    name: 'customContent',
    type: 'Object',
    default: 'null',
    desc: '自定义内容',
    optional: [],
  },
  {
    name: 'formatterLabel',
    type: 'Function',
    default: '(value) => value',
    desc: '自定义间断点下的文字格式',
    optional: [],
  },
  {
    name: 'formatterButtonLabel',
    type: 'Function',
    default: '(value) => value',
    desc: '自定义滑块下下的文字格式',
    optional: [],
  },
  {
    name: 'formatterTipLabel',
    type: 'Function',
    default: '(value) => value',
    desc: '自定义滑块tip格式',
    optional: [],
  },
].map((item: IPropsTableItem) => {
  const result = Object.assign(item, {
    desc: t(item.desc),
  });
  return {
    ...result,
  };
});

const switcherChangeJson: IPropsTableItem[] = [
  {
    name: 'change',
    type: 'Function',
    default: '',
    desc: t('鼠标弹起时触发'),
    optional: [],
  },
];

export default defineComponent({
  setup() {},
  render() {
    return (
      <div>
        <DemoTitle
          name={t('Slider 滑动选择器')}
          desc={t('用于操作反馈的中间态(loading)、成功、失败等')}
          link="https://www.google.com.hk/"
        />
        <DemoBox
          title={t('基础用法')}
          subtitle=""
          desc={t('使用 v-model 将变量与 slider 滑杆进行数据绑定，默认最大值 max-value 为 100, 默认最小值为 min-value 0')}
          componentName="slider"
          demoName={`demo/${lang}/base-demo`}
        >
          <BaseDemo></BaseDemo>
        </DemoBox>
        <DemoBox title={t('刻度')} subtitle="" desc="" componentName="slider" demoName={`demo/${lang}/step-demo`}>
          <StepDemo></StepDemo>
        </DemoBox>
        <DemoBox title={t('带输入')} subtitle="" desc="" componentName="slider" demoName={`demo/${lang}/input-demo`}>
          <InputDemo></InputDemo>
        </DemoBox>
        <DemoBox title={t('垂直')} subtitle="" desc="" componentName="slider" demoName={`demo/${lang}/vertical-demo`}>
          <VerticalDemo></VerticalDemo>
        </DemoBox>
        <DemoBox title={t('自定义')} subtitle="" desc="" componentName="slider" demoName={`demo/${lang}/custom-demo`}>
          <CustomDemo></CustomDemo>
        </DemoBox>
        <PropsBox title={t('Slider 属性')} subtitle="" propsData={switcherPropsJson} />
        <PropsBox title={t('Slider 事件')} subtitle="" propsData={switcherChangeJson} />
      </div>
    );
  },
});
