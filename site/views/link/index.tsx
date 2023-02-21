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
const DisabledDemo = defineAsyncComponent(() => import(`./demo/${lang}/disable-demo.vue`));

const { t } = i18n.global;

const linkPropsJson: IPropsTableItem[] = [
  {
    name: 'theme',
    type: 'String',
    default: 'default',
    desc: t('文字链接主题色'),
    optional: ['danger', 'success', 'primary', 'warning', 'default'],
  },
  {
    name: 'href',
    type: 'String',
    default: '',
    desc: t('文字链接地址'),
    optional: [],
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: false,
    desc: t('是否禁用'),
    optional: [],
  },
  {
    name: 'underline',
    type: 'Boolean',
    default: false,
    desc: t('是否显示下划线'),
    optional: [],
  },
  {
    name: 'target',
    type: 'String',
    default: '_self',
    desc: t('a标签的target属性，规定在何处打开链接文档'),
    optional: ['_blank', '_self', '_parent', '_top'],
  },
];

export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle name={t('Link 文字链接')} desc={t('Link 文字超链接')} link="https://www.google.com.hk/" />

        <DemoBox
          title={t('基础用法')}
          desc={t('基础的文字链接用法')}
          componentName="link"
          demoName={`demo/${lang}/base-demo`}
        >
          <BaseDemo></BaseDemo>
        </DemoBox>

        <DemoBox
          title={t('禁用状态和下划线')}
          desc={t('文字链接不可用状态，添加underline实现下划线')}
          componentName="link"
          demoName={`demo/${lang}/disable-demo`}
        >
          <DisabledDemo></DisabledDemo>
        </DemoBox>
        <PropsBox title={t('Link 属性')} subtitle="" propsData={linkPropsJson} />
      </div>
    );
  },
});
