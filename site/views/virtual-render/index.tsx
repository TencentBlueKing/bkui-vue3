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

import { virtualRenderProps } from '../../../packages/virtual-render/src/props';
import DemoBox from '../../components/demo-box';
import DemoTitle from '../../components/demo-title';
import PropsBox from '../../components/props-box';
import { resolvePropsToDesData } from '../utils/index';

import basic from './basic.vue';
import customLineHeight from './custom-line-height.vue';

export default defineComponent({
  components: { basic, customLineHeight },
  render() {
    const propsJson = resolvePropsToDesData(virtualRenderProps);

    const configs = [
      {
        attrs: {
          title: '基础用法',
          subtitle: '基础用法，用于表单内容的录入',
          desc: 'props: --',
          componentName: 'virtual-render',
          demoName: 'basic',
        },
        component: () => <basic></basic>,
      },
      {
        attrs: {
          title: '自定义行高',
          subtitle: '每行高度不一致，自定义每行高度',
          desc: 'props: --',
          componentName: 'virtual-render',
          demoName: 'custom-line-height',
        },
        component: () => <custom-line-height></custom-line-height>,
      },
    ];

    return (
      <div>
        <DemoTitle
          name="virtual-render"
          desc="virtual-render 为页面和功能提供列表。"
          link="https://www.google.com.hk/"/>
          {
            configs.map(cfg => <DemoBox { ...cfg.attrs }>
                 {
                   cfg.component()
                 }
              </DemoBox>)
          }
        <PropsBox propsData={propsJson}/>
      </div>
    );
  },
});
