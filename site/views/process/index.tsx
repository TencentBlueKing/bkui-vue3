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

const BaseDemo = defineAsyncComponent(() => import(`./demo/${lang}/base-demo.vue`));
const LoadingDemo = defineAsyncComponent(() => import(`./demo/${lang}/loading-demo.vue`));
const StatusDemo = defineAsyncComponent(() => import(`./demo/${lang}/status-demo.vue`));

const { t } = i18n.global;

const processProps: IPropsTableItem[] = [
  {
    name: 'list',
    type: 'Array',
    default: '--',
    desc: t('process 数据源'),
    optional: [],
  },
  {
    name: 'display-key',
    type: 'String',
    default: 'content',
    desc: t('循环 list 时，显示字段的 key 值'),
    optional: [],
  },
  {
    name: 'controllable',
    type: 'Boolean',
    default: 'false',
    desc: t('步骤可否被控制前后跳转'),
    optional: ['true', 'false'],
  },
  {
    name: 'cur-process',
    type: 'Number',
    default: 1,
    desc: t('当前步骤的索引值'),
    optional: [],
  },
  {
    name: 'ext-cls',
    type: 'String',
    default: '--',
    desc: t('配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-process 上'),
    optional: [],
  },
];

const processEvents: IPropsTableItem[] = [
  {
    name: 'click',
    type: 'Function',
    default: t('回调参数（变化后的步骤 index）'),
    desc: t('当前步骤变化时的回调'),
    optional: [],
  },
];

export default defineComponent({
  name: 'Process',
  render() {
    return (
      <div>
        <DemoTitle
          name={t('Process 步骤')}
          desc={t('Process 步骤组件')}
          link={`${import.meta.env.VITE_APP_BASE_URL ?? ''}/process`}
        />
        <DemoBox
          title={t('基础用法')}
          desc={t('默认配置list，配置 controllable 可控制 process 前后跳转')}
          componentName="process"
          demoName={`demo/${lang}/base-demo`}
        >
          <BaseDemo />
        </DemoBox>
        <DemoBox
          title={t('loading状态')}
          desc={t('在 list 数据源中配置, 设置status 为 loading')}
          componentName="process"
          demoName={`demo/${lang}/loading-demo`}
        >
          <LoadingDemo />
        </DemoBox>
        <DemoBox
          title={t('步骤状态、自定义icon配置')}
          desc={t('配置 steps 的不同状态, 使用 status 属性设置当前步骤状态，支持 default、done、loading、error。 同样也可以是用icon属性添加icon')}
          componentName="process"
          demoName={`demo/${lang}/status-demo`}
        >
          <StatusDemo />
        </DemoBox>

        <PropsBox title={t('属性')} subtitle="" propsData={processProps} />

        <PropsBox title={t('事件')} subtitle="" propsData={processEvents} />
      </div>
    );
  },
});
