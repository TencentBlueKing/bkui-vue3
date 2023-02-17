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
import { IPropsTableItem } from '../../typings';

import BaseDemo from './base-demo.vue';
import SlotDemo from './slot-demo.vue';

const { t } = i18n.global;

const SwipePropsJson: IPropsTableItem[] = [
  {
    name: 'isLoop',
    type: 'Boolean',
    default: 'true',
    desc: '是否自动轮询',
    optional: [],
  },
  {
    name: 'loopTime',
    type: 'Number',
    default: '8000',
    desc: '自动轮询间隔时间',
    optional: [],
  },
  {
    name: 'pics',
    type: 'Array',
    default: '[]',
    desc: '图片列表，[{ link: String, url: String, color: String, class: String }]',
    optional: [],
  },
  {
    name: 'list',
    type: 'Array',
    default: '[]',
    desc: '数据列表，配合 slot 使用',
    optional: [],
  },
  {
    name: 'height',
    type: 'Number',
    default: t('父元素高度'),
    desc: '轮播图高度，如果不传将使用父元素高度',
    optional: [],
  },
  {
    name: 'width',
    type: 'Number',
    default: t('父元素宽度'),
    desc: '轮播图宽度，如果不传将使用父元素宽度',
    optional: [],
  },
].map((item: IPropsTableItem) => {
  const result = Object.assign(item, { desc: t(item.desc) });
  return {
    ...result,
  };
});

const SwipeEventJson: IPropsTableItem[] = [
  {
    name: 'index-change',
    type: 'Function',
    default: '',
    desc: t('轮播索引发生变化时回调函数'),
    optional: [],
  },
];

export default defineComponent({
  setup() {},
  render() {
    const { t } = useI18n();
    return (
      <div>
        <DemoTitle name={t('Swiper 轮播图')} desc={t('在多个面板之间切换')} />

        <DemoBox
          title={t('基础用法')}
          subtitle=""
          desc={t('通过传递 pics 或者 list 属性，来直接展示图片。通过 loop-time 控制轮播间隔时间。通过 height 控制轮播图高度')}
          componentName="swiper"
          demoName="base-demo"
        >
          <BaseDemo></BaseDemo>
        </DemoBox>

        <DemoBox
          title={t('通过 Slot 自定义显示内容')}
          subtitle=""
          desc={t('通过传递 pics 或者 list 属性传递数据，通过 default 作用域插槽自定义显示内容')}
          componentName="swiper"
          demoName="slot-demo"
        >
          <SlotDemo></SlotDemo>
        </DemoBox>

        <PropsBox title={t('Swiper 属性')} subtitle="" propsData={SwipePropsJson} />

        <PropsBox title={t('Swiper 事件')} subtitle="" propsData={SwipeEventJson} />
      </div>
    );
  },
});
