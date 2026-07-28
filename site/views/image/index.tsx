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

import DemoBox from '../../components/demo-box';
import DemoTitle from '../../components/demo-title';
import PropsBox from '../../components/props-box';
import { type IPropsTableItem } from '../../typings';
import BaseDemo from './demo/base.vue';
import ErrorDemo from './demo/error.vue';
import FitDemo from './demo/fit.vue';
import GroupDemo from './demo/group.vue';
import LazyDemo from './demo/lazy.vue';
import PreviewDemo from './demo/preview.vue';
import StandalonePreviewDemo from './demo/standalone-preview.vue';

const imageProps: IPropsTableItem[] = [
  {
    name: 'src',
    type: 'String',
    default: '""',
    desc: '图片地址',
    optional: [],
  },
  {
    name: 'alt',
    type: 'String',
    default: '""',
    desc: '替代文字',
    optional: [],
  },
  {
    name: 'width',
    type: 'String | Number',
    default: '--',
    desc: '容器宽度',
    optional: [],
  },
  {
    name: 'height',
    type: 'String | Number',
    default: '--',
    desc: '容器高度',
    optional: [],
  },
  {
    name: 'fit',
    type: 'String',
    default: 'cover',
    desc: '图片填充方式（与 CSS object-fit 一致）',
    optional: ['fill', 'contain', 'cover', 'none', 'scale-down'],
  },
  {
    name: 'lazy',
    type: 'Boolean',
    default: 'false',
    desc: '是否懒加载（基于 IntersectionObserver）',
    optional: [],
  },
  {
    name: 'preview',
    type: 'Boolean',
    default: 'true',
    desc: '是否启用点击大图预览',
    optional: [],
  },
  {
    name: 'show-info',
    type: 'Boolean',
    default: 'false',
    desc: '大图模式下是否显示图片宽度与分辨率',
    optional: [],
  },
  {
    name: 'preview-props',
    type: 'Object',
    default: '--',
    desc: '单图预览时透传到大图的额外信息（name / width / resolution / downloadUrl 等）',
    optional: [],
  },
  {
    name: 'on-download',
    type: 'Function',
    default: '--',
    desc: '自定义下载逻辑，传入则禁用默认下载行为',
    optional: [],
  },
  {
    name: 'ext-cls',
    type: 'String',
    default: '""',
    desc: '附加在最外层的自定义类名',
    optional: [],
  },
];

const imageEvents: IPropsTableItem[] = [
  {
    name: 'load',
    type: 'Function',
    default: '--',
    desc: '图片加载成功时触发，参数：原生 Event',
    optional: [],
  },
  {
    name: 'error',
    type: 'Function',
    default: '--',
    desc: '图片加载失败时触发，参数：原生 Event',
    optional: [],
  },
  {
    name: 'preview',
    type: 'Function',
    default: '--',
    desc: '点击图片打开预览时触发',
    optional: [],
  },
];

const imageSlots: IPropsTableItem[] = [
  {
    name: 'default',
    type: 'Function',
    default: '--',
    desc: '可在缩略图容器内追加自定义内容（如蒙层、操作按钮）',
    optional: [],
  },
  {
    name: 'extra',
    type: 'Function',
    default: '--',
    desc: '大图工具栏右侧自定义内容（仅启用 preview 时生效）',
    optional: [],
  },
];

const previewProps: IPropsTableItem[] = [
  {
    name: 'model-value',
    type: 'Boolean',
    default: 'false',
    desc: '是否可见，支持 v-model',
    optional: [],
  },
  {
    name: 'current',
    type: 'Number',
    default: '0',
    desc: '当前预览索引，支持 v-model:current',
    optional: [],
  },
  {
    name: 'images',
    type: 'Array<string | File | ImageItem>',
    default: '[]',
    desc: '待预览的图片列表',
    optional: [],
  },
  {
    name: 'mask-closable',
    type: 'Boolean',
    default: 'true',
    desc: '是否点击遮罩关闭',
    optional: [],
  },
  {
    name: 'show-info',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示图片信息',
    optional: [],
  },
  {
    name: 'on-download',
    type: 'Function',
    default: '--',
    desc: '自定义下载逻辑',
    optional: [],
  },
];

const groupProps: IPropsTableItem[] = [
  {
    name: 'mask-closable',
    type: 'Boolean',
    default: 'true',
    desc: '是否点击遮罩关闭',
    optional: [],
  },
  {
    name: 'show-info',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示图片信息',
    optional: [],
  },
  {
    name: 'on-download',
    type: 'Function',
    default: '--',
    desc: '自定义下载逻辑',
    optional: [],
  },
];

export default defineComponent({
  name: 'SiteImage',
  render() {
    return (
      <div>
        <DemoTitle
          desc='提供图片缩略展示与大图预览（缩放、旋转、拖拽、键盘导航、批量预览）'
          designLink=''
          name='Image 图片'
        />

        <DemoBox
          componentName='image'
          demoName='demo/base'
          desc='设置 src / width / height 即可显示一张缩略图，默认点击可查看大图。'
          subtitle=''
          title='基本用法'
        >
          <BaseDemo />
        </DemoBox>

        <DemoBox
          componentName='image'
          demoName='demo/fit'
          desc='通过 fit 控制图片在容器内的填充方式，与原生 CSS object-fit 一致。'
          subtitle=''
          title='填充方式'
        >
          <FitDemo />
        </DemoBox>

        <DemoBox
          componentName='image'
          demoName='demo/lazy'
          desc='设置 lazy，仅在图片即将进入视口时加载，提升长列表性能。'
          subtitle=''
          title='懒加载'
        >
          <LazyDemo />
        </DemoBox>

        <DemoBox
          componentName='image'
          demoName='demo/preview'
          desc='通过 show-info 与 preview-props 在大图工具栏展示宽度、分辨率等信息。'
          subtitle=''
          title='预览信息'
        >
          <PreviewDemo />
        </DemoBox>

        <DemoBox
          componentName='image'
          demoName='demo/group'
          desc='使用 ImagePreviewGroup 包裹一组 Image，点击任意图片可在同一弹层中浏览整组。'
          subtitle=''
          title='分组预览'
        >
          <GroupDemo />
        </DemoBox>

        <DemoBox
          componentName='image'
          demoName='demo/standalone-preview'
          desc='也可以脱离 Image 组件，单独使用 ImagePreview 控制大图弹层。'
          subtitle=''
          title='独立大图预览'
        >
          <StandalonePreviewDemo />
        </DemoBox>

        <DemoBox
          componentName='image'
          demoName='demo/error'
          desc='图片加载失败时展示占位与重新加载入口，悬停时出现重载按钮。'
          subtitle=''
          title='加载失败'
        >
          <ErrorDemo />
        </DemoBox>

        <PropsBox
          propsData={imageProps}
          subtitle=''
          title='Image 属性'
        />

        <PropsBox
          propsData={imageEvents}
          subtitle=''
          title='Image 事件'
        />

        <PropsBox
          propsData={imageSlots}
          subtitle=''
          title='Image 插槽'
        />

        <PropsBox
          propsData={previewProps}
          subtitle=''
          title='ImagePreview 属性'
        />

        <PropsBox
          propsData={groupProps}
          subtitle=''
          title='ImagePreviewGroup 属性'
        />
      </div>
    );
  },
});
