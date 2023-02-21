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
const PartDemo = defineAsyncComponent(() => import(`./demo/${lang}/part-demo.vue`));

const { t } = i18n.global;

const props: IPropsTableItem[] = [
  {
    name: 'type',
    type: 'String / Number',
    desc: '异常类型',
    optional: ['403', '404', '500', 'building', 'empty', 'search-empty'],
    default: '404',
  },
  {
    name: 'scene',
    type: 'String',
    desc: '异常类型',
    optional: [t('page（页面）'), t('part（局部）')],
    default: 'page',
  },
  {
    name: 'title',
    type: 'String',
    desc: '异常 title',
    optional: [],
    default: '',
  },
  {
    name: 'description',
    type: 'String',
    desc: '异常 description',
    optional: [],
    default: '',
  },
].map((item: IPropsTableItem) => {
  const result = Object.assign(item, { desc: t(item.desc) });
  return {
    ...result,
  };
});

export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle name={t('Exception 异常提示')} desc="" />
        <DemoBox
          title={t('基础用法')}
          desc={t('配置 type 为异常类型 403、404、500、building、empty、search-empty，也可以不配置，默认为 404')}
          componentName="exception"
          demoName={`demo/${lang}/base-demo`}
        >
          <BaseDemo />
        </DemoBox>
        <DemoBox
          title={t('局部异常提示')}
          desc={t('配置 scene 为使用场景为 part')}
          componentName="exception"
          demoName={`demo/${lang}/part-demo`}
        >
          <PartDemo />
        </DemoBox>
        <PropsBox title={t('属性')} subtitle="" propsData={props} />
      </div>
    );
  },
});
