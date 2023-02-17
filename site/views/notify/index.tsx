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
import { useI18n } from 'vue-i18n';

import DemoBox from '../../components/demo-box';
import DemoTitle from '../../components/demo-title';
import PropsBox from '../../components/props-box';
import i18n from '../../language/i18n';
import type { DemoPropsItem, IPropsTableItem } from '../../typings';

import Base from './demo/base.vue';
import Close from './demo/close.vue';
import Position from './demo/position.vue';
import Theme from './demo/theme.vue';

const { t } = i18n.global;

const props: IPropsTableItem[] = [
  {
    name: 'theme',
    type: 'String',
    default: 'primary',
    desc: '组件主题色',
    optional: ['primary', 'warning', 'success', 'error'],
  },
  {
    name: 'title',
    type: 'String',
    default: '',
    desc: '组件的标题',
    optional: [],
  },
  {
    name: 'message',
    type: 'String | Function',
    default: '',
    desc: '组件显示的文字内容',
    optional: [],
  },
  {
    name: 'position',
    type: 'String',
    default: '',
    desc: '组件出现的方向',
    optional: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
  },
  {
    name: 'delay',
    type: 'Number',
    default: '5000',
    desc: '组件延时关闭时间，值为 0 时需要手动关闭',
    optional: [],
  },
  {
    name: 'dismissable',
    type: 'Boolean',
    default: 'true',
    desc: '是否显示右侧关闭 icon',
    optional: ['true', 'false'],
  },
  {
    name: 'offsetX',
    type: 'Number',
    default: '10',
    desc: '组件出现时距离视口的水平偏移量',
    optional: [],
  },
  {
    name: 'offsetY',
    type: 'Number',
    default: '30',
    desc: '组件出现时距离视口顶部的偏移量',
    optional: [],
  },
  {
    name: 'spacing',
    type: 'Number',
    default: '10',
    desc: '多个组件之间的垂直距离',
    optional: [],
  },
  {
    name: 'extCls',
    type: 'String',
    default: '',
    desc: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-message 上',
    optional: [],
  },
  {
    name: 'onClose',
    type: 'Function',
    default: '',
    desc: '关闭组件时的回调函数, 参数为组件实例',
    optional: [],
  },
].map((item: IPropsTableItem) => {
  const result = Object.assign(item, { desc: t(item.desc) });
  return {
    ...result,
  };
});

const demos: DemoPropsItem[] = [
  {
    title: '基础用法',
    desc: '使用默认配置的通知提示',
    componentName: 'notify',
    demoName: 'demo/base',
    DemoComponent: Base,
  },
  {
    title: '内置主题',
    desc: '通知提示提供消息、成功、警告、失败四种主题',
    componentName: 'notify',
    demoName: 'demo/theme',
    DemoComponent: Theme,
  },
  {
    title: '通知出现的位置',
    desc: '通知出现可以从 4 个方向出现：左上角、右上角、左下角、右下角',
    componentName: 'notify',
    demoName: 'demo/position',
    DemoComponent: Position,
  },
  {
    title: '通知关闭',
    desc: '配置 delay 字段定义通知自动关闭的时间，当值为 0 时不自动关闭。配置 dismissable 字段控制是否显示右侧的手动关闭 icon。',
    componentName: 'notify',
    demoName: 'demo/close',
    DemoComponent: Close,
  },
].map((item: DemoPropsItem) => {
  const result = Object.assign(item, {
    title: t(item.title),
    desc: t(item.desc),
  });
  return {
    ...result,
  };
});

export default defineComponent({
  render() {
    const { t } = useI18n();
    return (
      <div>
        <DemoTitle
          name={t('Notify 通知提示')}
          desc={t('用来给用户推送通知提示信息，通知可配置为从界面的四个角出现')}
          link="https://www.google.com.hk/"
        />
        {demos.map(({ DemoComponent, ...demo }) => (
          <DemoBox {...demo}>
            <DemoComponent />
          </DemoBox>
        ))}
        <PropsBox subtitle="" propsData={props}></PropsBox>
      </div>
    );
  },
});
