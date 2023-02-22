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

const { t } = i18n.global;

const backtopPropsJson: IPropsTableItem[] = [
  {
    name: 'visibilityHeight',
    type: 'Number',
    default: 200,
    desc: t('滚动多少px后，元素可见'),
    optional: [],
  },
  {
    name: 'target',
    type: 'String',
    default: '',
    desc: t('触发滚动的对象'),
    optional: [],
  },
  {
    name: 'right',
    type: 'Number',
    default: 40,
    desc: t('控制其显示位置, 距离页面右边距'),
    optional: [],
  },
  {
    name: 'bottom',
    type: 'Number',
    default: 40,
    desc: t('控制其显示位置, 距离页面底部边距'),
    optional: [],
  },
  {
    name: 'extCls',
    type: 'String',
    default: '',
    desc: t('自定义样式'),
    optional: [],
  },

];

export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          name={ t('Backtop 回到顶部') }
          desc={ t('Backtop 回到页面顶部的操作按钮')}
          link="https://www.google.com.hk/"/>

        <DemoBox
          title={t('基础用法')}
          desc={t('向下滚动以显示按钮')}
          componentName="backtop"
          demoName="base-demo">
            <BaseDemo></BaseDemo>
          </DemoBox>

        <PropsBox
          style="height: 1000px"
          title={t('Backtop 属性')}
          subtitle=""
          propsData={backtopPropsJson}/>
      </div>
    );
  },
});
