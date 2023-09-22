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

import DemoAffix from './demo/affix.vue';
import DemoAffixBottom from './demo/affix-bottom.vue';
import DemoAffixCallback from './demo/affix-callback.vue';
import DemoAffixContainer from './demo/affix-container.vue';
import DemoAffixTop from './demo/affix-top.vue';
import DemoAffixZIndex from './demo/affix-z-index.vue';

const affixProps: IPropsTableItem[] = [
  {
    name: 'offset-top',
    type: 'Number',
    default: 0,
    desc: '距离窗口顶部达到指定偏移量后触发',
    optional: [],
  },
  {
    name: 'offset-bottom',
    type: 'Number',
    default: '-',
    desc: '距离窗口底部达到指定偏移量后触发',
    optional: [],
  },
  {
    name: 'z-index',
    type: 'Number',
    default: 1000,
    desc: '设置 affix 对象的层级	',
    optional: [],
  },
  {
    name: 'target',
    type: 'String',
    default: 'window',
    desc: '	设置 affix 需要监听其滚动事件容器的id',
    optional: [],
  },
];
const affixEvents: IPropsTableItem[] = [
  {
    name: 'change',
    type: 'String',
    default: '回调参数（true/false）',
    desc: '在固定状态发生改变时触发',
    optional: [],
  },
];
export default defineComponent({
  name: 'Affix',
  render() {
    return (
      <div>
        <DemoTitle
          name='Affix图钉'
          desc='使用图钉，可以将内容固定在屏幕上，并且不随页面的滚动而滚动。'
          link={`${import.meta.env.VITE_APP_BASE_URL ?? ''}/affix`}
        />
        <DemoBox
          title='基础用法'
          desc='不传值时：默认直接固定在最顶端'
          componentName='affix'
          demoName='demo/affix'
        >
          <DemoAffix />
        </DemoBox>
        <DemoBox
          title='固定在顶部'
          desc='设置offset-top属性'
          componentName='affix'
          demoName='demo/affix-top'
        >
          <DemoAffixTop />
        </DemoBox>
        <DemoBox
          title='对象层级'
          desc='设置z-index属性，设置affix对象的层级'
          componentName='affix'
          demoName='demo/affix-z-index'
        >
          <DemoAffixZIndex />
        </DemoBox>
        <DemoBox
          title='固定在底部'
          desc='设置offset-bottom属性, offset-top和offset-bottom只可以设置一个，如果都设置会使用offset-bottom'
          componentName='affix'
          demoName='demo/affix-bottom'
        >
          <DemoAffixBottom />
        </DemoBox>
        <DemoBox
          title='固定状态改变时的回调'
          desc='设置on-change属性，固定状态改变时的回调'
          componentName='affix'
          demoName='demo/affix-callback'
        >
          <DemoAffixCallback />
        </DemoBox>
        <DemoBox
          title='设置滚动容器'
          desc='设置target属性，target为需要监听其滚动事件容器的id，默认为 window。'
          componentName='affix'
          demoName='demo/affix-container'
        >
          <DemoAffixContainer />
        </DemoBox>
        <PropsBox
          title='Affix Attributes'
          subtitle=''
          propsData={affixProps}
        />
        <PropsBox
          title='Affix Events'
          subtitle=''
          propsData={affixEvents}
        />
      </div>
    );
  },
});
