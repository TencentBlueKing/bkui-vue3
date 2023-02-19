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

const lang = getCookie('lang');

const BaseDemo = defineAsyncComponent(() => import(`./demo/${lang}/base-demo.vue`));

const { t } = i18n.global;

const menuProps: IPropsTableItem[] = [
  {
    name: 'navWidth',
    type: 'Number | String',
    default: '60',
    desc: t('初始左侧折叠导航的宽度'),
    optional: [],
  },
  {
    name: 'hoverWidth',
    type: 'Number | String',
    default: '260',
    desc: t('展开左侧导航的宽度'),
    optional: [],
  },
  {
    name: 'sideTitle',
    type: 'String',
    default: '',
    desc: t('左侧导航的主标题'),
    optional: [],
  },
  {
    name: 'headerTitle',
    type: 'String',
    default: '',
    desc: t('头部导航条的标题'),
    optional: [],
  },
  {
    name: 'hoverLeaveDelay',
    type: 'Number',
    default: '0',
    desc: t('左侧栏hover离开后折叠的延迟时长'),
    optional: [],
  },
  {
    name: 'hoverEnterDelay',
    type: 'Number',
    default: '100',
    desc: t('左侧栏hover进入后展开的延迟时长'),
    optional: [],
  },
  {
    name: 'defaultOpen',
    type: 'Boolean',
    default: 'false',
    desc: t('左侧栏初始状态'),
    optional: [],
  },
  {
    name: 'needMenu',
    type: 'Boolean',
    default: 'true',
    desc: t('是否显示左侧导航'),
    optional: [],
  },
  {
    name: 'navigationType',
    type: 'String',
    default: 'left-right',
    desc: t('导航风格 （left-right: 左右导航风格 top-bottom: 上下导航风格）'),
    optional: ['left-right', 'top-bottom'],
  },
];
export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          name="Navigation"
          desc={ t('Navigation组件， 为应用提供导航的整体布局。') }
          link="https://www.google.com.hk/"
        />
        <DemoBox
          title={t('基础用法')}
          subtitle={t('点击下面按钮可以切换不同的导航风格')}
          desc={ t('通过属性配置切换不同的导航风格')}
          componentName="navigation"
          demoName={`demo/${lang}/base-demo`}
        >
          <BaseDemo />
        </DemoBox>
        <PropsBox propsData={menuProps} />
      </div>
    );
  },
});
