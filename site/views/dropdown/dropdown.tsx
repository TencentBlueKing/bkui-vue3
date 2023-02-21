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

const AlignDemo = defineAsyncComponent(() => import(`./demo/${lang}/align-demo.vue`));
const BaseDemo = defineAsyncComponent(() => import(`./demo/${lang}/base-demo.vue`));
const DropdownBoundaryBody = defineAsyncComponent(() => import(`./demo/${lang}/boundary-body-demo.vue`));
const DisabledDemo = defineAsyncComponent(() => import(`./demo/${lang}/disabled-demo.vue`));
const DropdownMethodsDemo = defineAsyncComponent(() => import(`./demo/${lang}/dropdown-methods-demo.vue`));
const IsShowDemo = defineAsyncComponent(() => import(`./demo/${lang}/is-show-demo.vue`));
const TriggerDemo = defineAsyncComponent(() => import(`./demo/${lang}/trigger-demo.vue`));

const { t } = i18n.global;

const DropdownProps: IPropsTableItem[] = [
  {
    name: 'isShow',
    type: 'Boolean',
    desc: '自定义控制显示与隐藏 trigger = manual 时生效',
    optional: ['true', 'false'],
    default: 'false',
  },
  {
    name: 'placement',
    type: 'String',
    desc: '下拉菜单位置',
    optional: [
      'auto',
      'auto-start',
      'auto-end',
      'top',
      'right',
      'bottom',
      'left',
      'top-start',
      'top-end',
      'bottom-start',
      'bottom-end',
      'right-start',
      'right-end',
      'left-start',
      'left-end',
    ],
    default: 'bottom',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    desc: '是否禁用弹出菜单',
    optional: ['true', 'false'],
    default: 'false',
  },
  {
    name: 'popoverOptions',
    type: 'Object',
    desc: 'Popover组件的配置项',
    optional: [],
    default: '{}',
  },
  {
    name: 'extCls',
    type: 'String',
    desc: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-dropdown 上',
    optional: [],
    default: '',
  },
].map((item: IPropsTableItem) => {
  const result = Object.assign(item, { desc: t(item.desc) });
  return {
    ...result,
  };
});

const DropdownMenuProps: IPropsTableItem[] = [
  {
    name: 'extCls',
    type: 'String',
    desc: t('配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-dropdown-menu 上'),
    optional: [],
    default: '',
  },
];

const dropdownItemProps: IPropsTableItem[] = [
  {
    name: 'extCls',
    type: 'String',
    desc: t('配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-dropdown-item 上'),
    optional: [],
    default: '',
  },
];
const dropdownMethods: IPropsTableItem[] = [
  {
    name: 'show',
    type: 'Function',
    desc: t('显示时触发'),
    optional: [],
    default: '',
  },
  {
    name: 'hide',
    type: 'Function',
    desc: t('隐藏时触发'),
    optional: [],
    default: '',
  },
];

const dropdownItemMethods: IPropsTableItem[] = [
  {
    name: 'click',
    type: 'Function',
    desc: t('点击触发'),
    optional: [],
    default: '',
  },
];

export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle name={t('DropdownMenu 下拉菜单')} desc="" />
        <DemoBox
          title={t('基础用法')}
          desc={t('slot[name=default] 配置触发对象，slot[name=content] 配置下拉菜单')}
          componentName="dropdown"
          demoName={`demo/${lang}/base-demo`}
        >
          <BaseDemo />
        </DemoBox>
        <DemoBox
          title={t('菜单出现的位置')}
          desc={t('通过配置参数 placement 可以让下拉菜单的位置，默认为 bottom')}
          componentName="dropdown"
          demoName={`demo/${lang}/align-demo`}
        >
          <AlignDemo />
        </DemoBox>
        <DemoBox
          title={t('点击触发')}
          desc={t('通过 trigger=click 设置触发事件类型')}
          componentName="dropdown"
          demoName={`demo/${lang}/trigger-demo`}
        >
          <TriggerDemo />
        </DemoBox>
        <DemoBox
          title={t('自定义显示与隐藏')}
          desc={t('通过 isShow 下来菜单的显示与隐藏，trigger=manual下生效')}
          componentName="dropdown"
          demoName={`demo/${lang}/is-show-demo`}
        >
          <IsShowDemo />
        </DemoBox>
        <DemoBox
          title={t('禁用状态')}
          desc={t('通过 disabled 来禁用下来弹出')}
          componentName="dropdown"
          demoName={`demo/${lang}/disabled-demo`}
        >
          <DisabledDemo />
        </DemoBox>
        <DemoBox
          title={t('回调函数')}
          desc={t('通过 show hide 设置显示与隐藏的回调')}
          componentName="dropdown"
          demoName={`demo/${lang}/dropdown-methods-demo`}
        >
          <DropdownMethodsDemo />
        </DemoBox>
        <DemoBox
          title={t('元素绑定在body下')}
          desc={t('通过 popoverOptions 设置 boundary: \'body\'')}
          componentName="dropdown"
          demoName={`demo/${lang}/boundary-body-demo`}
        >
          <DropdownBoundaryBody />
        </DemoBox>
        <PropsBox title={t('Dropdown 属性')} subtitle="" propsData={DropdownProps} />
        <PropsBox title={t('DropdownMenu 属性')} subtitle="" propsData={DropdownMenuProps} />
        <PropsBox title={t('DropdownItem 属性')} subtitle="" propsData={dropdownItemProps} />
        <PropsBox title={t('Dropdown 事件')} subtitle="" propsData={dropdownMethods} />
        <PropsBox title={t('DropdownItem 事件')} subtitle="" propsData={dropdownItemMethods} />
      </div>
    );
  },
});
