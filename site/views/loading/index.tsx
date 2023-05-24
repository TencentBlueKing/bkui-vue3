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
import {
  type IPropsTableItem,
} from '../../typings';

import Basic from './demo/basic.vue';
import Directive from './demo/directive.vue';
import Mask from './demo/mask.vue';
import Mode from './demo/mode.vue';
import Size from './demo/size.vue';
import Theme from './demo/theme.vue';
import Title from './demo/title.vue';
// import Number from './demo/number.vue';
// import Password from './demo/password.vue';
// import Search from './demo/search.vue';
// import Simple from './demo/simple.vue';
// import Size from './demo/size.vue';
// import Status from './demo/status.vue';
// import Textarea from './demo/textarea.vue';;
// 输入框属性列表
const loadingProps: IPropsTableItem[] = [
  {
    name: 'loading',
    type: 'String',
    default: 'text',
    desc: '输入框类型',
    optional: ['text', 'textarea', 'password', 'number', 'email', 'url', 'date'],
  },
  {
    name: 'mode',
    type: 'String',
    default: 'normal',
    desc: '空白提示',
    optional: ['normal', 'spin'],
  },
  {
    name: 'title',
    type: 'String',
    default: '',
    desc: '是否不可用',
    optional: [],
  },
  {
    name: 'theme',
    type: 'String',
    default: '',
    desc: 'primary danger warning(spin模式下支持: primary danger warning success, white)',
    optional: ['default', 'primary', 'danger', 'warning', 'white'],
  },
  {
    name: 'opacity',
    type: 'number',
    default: 0.9,
    desc: 'loading 遮罩的背景透明度 （注：如设置了 color 属性为 rgba 类型颜色则此属性将被覆盖）',
    optional: ['0-1之间的小数'],
  },
  {
    name: 'color',
    type: 'String',
    default: '',
    desc: 'loading 遮罩的背景色 支持 rgb/hex/rgba',
    optional: [],
  },
];

const demos = [{
  // '基础输入框',
  title: '基础用法',
  desc: '对指定 dom 节点添加 loading 效果',
  componentName: 'loading',
  demoName: 'demo/basic',
  DemoComponent: Basic,
}, {
  // '基础输入框',
  title: '指令用法',
  desc: '组件提供了自定义指令 v-bkloading，方便对指定 dom 节点添加 loading 效果',
  componentName: 'loading',
  demoName: 'demo/directive',
  DemoComponent: Directive,
}, {
  title: '配置大小',
  desc: '传入 size，可以配置 loading 效果大小',
  componentName: 'loading',
  demoName: 'demo/size',
  DemoComponent: Size,
}, {
  title: '配置主题',
  desc: '传入 theme，可以配置 loading 效果主题',
  componentName: 'loading',
  demoName: 'demo/theme',
  DemoComponent: Theme,
}, {
  title: '配置 mode loading的显示形式',
  desc: '配置 mode 为 spin 可使其以spin的形式显示。',
  componentName: 'loading',
  demoName: 'demo/mode',
  DemoComponent: Mode,
}, {
  title: '配置 loading 遮罩的背景透明度与背景色',
  desc: 'loading 遮罩的背景透明度会由传入的 opacity 参数决定，此参数为 0 至 1 之间的数字，默认为 0.9 背景色则由color属性决定。',
  componentName: 'loading',
  demoName: 'demo/mask',
  DemoComponent: Mask,
}, {
  title: '配置文案',
  desc: '传入 title，值会被渲染到 loading 图标的下方',
  componentName: 'loading',
  demoName: 'demo/title',
  DemoComponent: Title,
}];


export default defineComponent({
  name: 'Input',

  render() {
    return (
      <div>
        <DemoTitle
          name="Loading"
          desc="覆盖正在加载数据的组件一个 loading 层"
          link={`${import.meta.env.VITE_APP_BASE_URL ?? ''}/loading`}
        />
          {
            demos.map(({ DemoComponent, ...demo }) => (
              <DemoBox {...demo}>
                  <DemoComponent />
              </DemoBox>
            ))
          }
        <PropsBox
          title="Loading 属性"
          subtitle=""
          propsData={loadingProps}/>

      </div>
    );
  },
});
