/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2025 Tencent.  All rights reserved.
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

import DemoBox from '../../../components/demo-box';
import DemoTitle from '../../../components/demo-title';
import PropsBox from '../../../components/props-box';
import { IPropsTableItem } from '../../../typings';
import BaseDemo from './base-demo.vue';
import CustomColorDemo from './custom-color-demo.vue';
import I18nDemo from './i18n-demo.vue';
import InstallationDemo from './installation-demo.vue';
import TypeDemo from './type-demo.vue';

const propsJson: IPropsTableItem[] = [
  {
    name: 'status',
    type: 'String',
    default: '-',
    desc: '状态值（必填），如：loading、running、stop、warning、failed、unknown 等',
    optional: ['loading', 'running', 'stop', 'warning', 'failed', 'unknown'],
  },
  {
    name: 'type',
    type: 'String',
    default: 'default',
    desc: '标签类型：default（带背景框）、stroke（8px 描边）、filled（13px 光晕 + 7px 实心）',
    optional: ['default', 'stroke', 'filled'],
  },
  {
    name: 'locale',
    type: 'String',
    default: 'zh-CN',
    desc: '语言设置，支持中英文切换。会自动检测 Cookie 中的 blueking_language 设置',
    optional: ['zh-CN', 'en-US'],
  },
  {
    name: 'status-map',
    type: 'String (JSON)',
    default: '-',
    desc: '自定义状态映射配置（JSON 字符串），用于定义自定义状态的文本和主题',
    optional: [],
  },
];

const eventColumnMap = {
  name: '名称',
  desc: '说明',
  params: '参数',
};

const featuresJson = [
  {
    name: '无框架依赖',
    desc: '原生 Web Component，可在任何前端框架中使用（Vue、React、Angular 等）',
    params: '',
  },
  {
    name: '样式隔离',
    desc: '使用 Shadow DOM，避免样式冲突',
    params: '',
  },
  {
    name: '国际化支持',
    desc: '内置中英文，可扩展其他语言，自动检测 Cookie 设置',
    params: '',
  },
  {
    name: '智能匹配',
    desc: '支持大小写不敏感的状态匹配（RUNNING、Running、running 都会被识别）',
    params: '',
  },
  {
    name: '自定义配置',
    desc: '支持通过 status-map 属性自定义状态映射',
    params: '',
  },
  {
    name: '轻量级',
    desc: '压缩后约 12KB（gzip: 3.1KB）',
    params: '',
  },
];

export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          desc='Status Tag 是一个无框架依赖的状态标签 Web Component，支持国际化，适用于任何前端项目（Vue、React、Angular 等）。它提供了多种预设状态类型，支持自定义颜色、尺寸和图标。'
          name='Status Tag 状态标签'
          npmLink='https://www.npmjs.com/package/@blueking/status-tag'
        />
        <DemoBox
          componentName='blueking/status-tag'
          demoName='installation-demo'
          desc='通过 npm 安装后，在 Vue 3 项目中引入并使用。'
          subtitle='快速开始使用 Status Tag'
          title='安装和使用'
        >
          <InstallationDemo />
        </DemoBox>

        <DemoBox
          componentName='blueking/status-tag'
          demoName='base-demo'
          desc='通过 status 属性设置不同的状态值。组件内置了 6 种状态：loading、running、stop、warning、failed、unknown。支持大小写不敏感的智能匹配。'
          subtitle='展示所有内置状态和智能匹配功能'
          title='基础用法'
        >
          <BaseDemo />
        </DemoBox>

        <DemoBox
          componentName='blueking/status-tag'
          demoName='type-demo'
          desc='通过 type 属性设置标签的显示类型。default（带背景框）、stroke（8px 描边）、filled（13px 光晕 + 7px 实心）。'
          subtitle='三种不同的视觉风格'
          title='标签类型'
        >
          <TypeDemo />
        </DemoBox>

        <DemoBox
          componentName='blueking/status-tag'
          demoName='custom-color-demo'
          desc='通过 status-map 属性可以自定义状态映射，定义自己的状态文本和主题样式。支持审批流程、连接状态等各种业务场景。'
          subtitle='自定义状态映射配置'
          title='自定义状态'
        >
          <CustomColorDemo />
        </DemoBox>

        <DemoBox
          componentName='blueking/status-tag'
          demoName='i18n-demo'
          desc='Status Tag 支持国际化，通过 locale 属性可以切换语言。组件会自动检测 Cookie 中的 blueking_language 设置。'
          subtitle='支持中英文切换，可扩展其他语言'
          title='国际化'
        >
          <I18nDemo />
        </DemoBox>

        <PropsBox
          propsData={propsJson}
          title='组件属性'
        />
        <PropsBox
          columnMap={eventColumnMap}
          propsData={featuresJson}
          title='特性列表'
        />
      </div>
    );
  },
});
