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

const lang = getCookie('lang');

const BaseDemo = defineAsyncComponent(() => import(`./demo/${lang}/base-demo.vue`));
const ClearDemo = defineAsyncComponent(() => import(`./demo/${lang}/clear-demo.vue`));
const CreateDemo = defineAsyncComponent(() => import(`./demo/${lang}/create-demo.vue`));
const DisabledDemo = defineAsyncComponent(() => import(`./demo/${lang}/disabled-demo.vue`));
const ExampleDemo = defineAsyncComponent(() => import(`./demo/${lang}/example-demo.vue`));
const GroupDemo = defineAsyncComponent(() => import(`./demo/${lang}/group-demo.vue`));
const ListDisabledDemo = defineAsyncComponent(() => import(`./demo/${lang}/list-disabled-demo.vue`));
const MatchDemo = defineAsyncComponent(() => import(`./demo/${lang}/match-demo.vue`));
const MoreDemo = defineAsyncComponent(() => import(`./demo/${lang}/more-demo.vue`));
const PasteDemo = defineAsyncComponent(() => import(`./demo/${lang}/paste-demo.vue`));
const SingleDemo = defineAsyncComponent(() => import(`./demo/${lang}/single-demo.vue`));
const TooltipsDemo = defineAsyncComponent(() => import(`./demo/${lang}/tooltips-demo.vue`));
const TriggerDemo = defineAsyncComponent(() => import(`./demo/${lang}/trigger-demo.vue`));

const { t } = i18n.global;

const propsJson: IPropsTableItem[] = [
  {
    name: 'list',
    type: 'Array',
    default: '[]',
    desc: t('下拉菜单所需的数据列表'),
    optional: [],
  },
  {
    name: 'placeholder',
    type: 'String',
    default: t('请输入并按 Enter 结束'),
    desc: t('空数据时显示的提示文案'),
    optional: [],
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: t('是否禁用组件'),
    optional: ['true', 'false'],
  },
  {
    name: 'allow-next-focus',
    type: 'Boolean',
    default: 'true',
    desc: t('多选时，是否允许选中后继续展示下拉选项'),
    optional: ['true', 'false'],
  },
  {
    name: 'save-key',
    type: 'String',
    default: 'id',
    desc: t('循环 list 时，保存字段的 key 值'),
    optional: [],
  },
  {
    name: 'display-key',
    type: 'String',
    default: 'name',
    desc: t('循环 list 时，展示字段的 key 值'),
    optional: [],
  },
  {
    name: 'search-key',
    type: 'String',
    default: 'name',
    desc: t('输入时，搜索的 key 值'),
    optional: [],
  },
  {
    name: 'tooltip-key',
    type: 'String',
    default: '',
    desc: t('让选中的标签在鼠标移上去时显示提示文案'),
    optional: [],
  },
  {
    name: 'has-delete-icon',
    type: 'Boolean',
    default: 'false',
    desc: t('是否显示标签删除按钮'),
    optional: ['true', 'false'],
  },
  {
    name: 'clearable',
    type: 'Boolean',
    default: 'false',
    desc: t('是否允许清空'),
    optional: ['true', 'false'],
  },
  {
    name: 'allow-create',
    type: 'Boolean',
    default: 'false',
    desc: t('是否允许自定义标签输入'),
    optional: ['true', 'false'],
  },
  {
    name: 'max-data',
    type: 'Number',
    default: '-1',
    desc: t('是否限制可选个数，-1为不限制'),
    optional: [],
  },
  {
    name: 'max-result',
    type: 'Number',
    default: '10',
    desc: t('下拉列表搜索结果显示个数，默认为 10'),
    optional: [],
  },
  {
    name: 'use-group',
    type: 'Boolean',
    default: 'false',
    desc: t('是否启用分组'),
    optional: ['true', 'false'],
  },
  {
    name: 'allow-auto-match',
    type: 'Boolean',
    default: 'false',
    desc: t('配置输入时失焦点后，如果完全匹配则自动选中，如果自定义则自动输入'),
    optional: ['true', 'false'],
  },
  {
    name: 'content-width',
    type: 'Number',
    default: '190',
    desc: t('自定义设置下拉弹框的宽度，单选会撑满因此失效'),
    optional: [],
  },
  {
    name: 'content-max-height',
    type: 'Number',
    default: '300',
    desc: t('自定义设置下拉弹框的长度'),
    optional: [],
  },
  {
    name: 'separator',
    type: 'String',
    default: '',
    desc: t('输入分隔符号，支持批量输入'),
    optional: [],
  },
  {
    name: 'tpl',
    type: 'Function',
    default: '',
    desc: t('自定义下拉列表模板'),
    optional: [],
  },
  {
    name: 'tag-tpl',
    type: 'Function',
    default: '',
    desc: t('自定义标签模板'),
    optional: [],
  },
  {
    name: 'paste-fn',
    type: 'Function',
    default: '',
    desc: t('批量粘贴处理文本返回格式'),
    optional: [],
  },
  {
    name: 'left-space',
    type: 'Number',
    default: '0',
    desc: t('文字与左边框距离'),
    optional: [],
  },
  {
    name: 'trigger',
    type: 'String',
    default: 'search',
    desc: t('搜索列表触发展示方式，默认是输入关键字搜索时展示，也可以获取焦点是展示（用在数据量少的时候）'),
    optional: ['search', 'focus'],
  },
  {
    name: 'create-tag-validator',
    type: 'Function',
    default: '',
    desc: t('自定义标签校验函数，返回 boolean，参数(tag)，tag表示当前输入值，在自定义标签时，可以自定义添加标签的校验'),
    optional: [],
  },
  {
    name: 'filter-callback',
    type: 'Function',
    default: '',
    desc: t('过滤函数，参数 (filterVal, filterKey, data)，分别表示当前过滤的文本、当前数据使用的 key、所有数据，方便使用者根据自己的逻辑来筛选数据'),
    optional: [],
  },
  {
    name: 'show-clear-only-hover',
    type: 'Boolean',
    default: '',
    desc: t('是否在只有 hover 的时候才显示 clear 清除按钮'),
    optional: [],
  },
  {
    name: 'collapse-tags',
    type: 'Boolean',
    default: 'false',
    desc: t('失焦是否折叠 tags'),
    optional: ['true', 'false'],
  },
  {
    name: 'tag-overflow-tips',
    type: 'Object',
    default: '{}',
    desc: t('定义 tag 超出内容的 v-bk-tooltips 配置'),
    optional: [],
  },
];

export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle name={ t('TagInput 标签输入框') } desc={ t('常用于对标签列表的填写、关键字的输入') } />
        <DemoBox
          title={t('基础用法')}
          desc={t('通过 bk-tag-input 来使用组件，其中 list 属性为下拉选择列表选项')}
          componentName="tag-input"
          demoName={`demo/${lang}/base-demo`}>
            <BaseDemo />
        </DemoBox>
        <DemoBox
          title={t('触发方式')}
          desc={t('配置 trigger 来设置下拉框的显示方式，有 focus（获焦点时显示）, search（搜索时显示）两种')}
          componentName="tag-input"
          demoName={`demo/${lang}/trigger-demo`}>
            <TriggerDemo />
        </DemoBox>
        <DemoBox
          title={t('hover 时才显示 clear 按钮')}
          desc={t('设置 show-clear-only-hover 为 true，则其 clear 按钮在 hover 时才会显示')}
          componentName="tag-input"
          demoName={`demo/${lang}/clear-demo`}
          >
            <ClearDemo />
        </DemoBox>
        <DemoBox
          title={t('自定义标签')}
          desc={t('设置 allow-create 属性来输入自定义标签，按 Enter 键结束；设置 has-delete-icon 属性可显示标签删除按钮')}
          componentName="tag-input"
          demoName={`demo/${lang}/create-demo`}
          >
            <CreateDemo />
        </DemoBox>
        <DemoBox
          title={t('失去焦点自动匹配')}
          desc={t('设置 allow-auto-match 属性当输入内容时失去焦点后，如果完全匹配则自动选中，如果设置 allow-create 属性则创建标签')}
          componentName="tag-input"
          demoName={`demo/${lang}/match-demo`}
          >
            <MatchDemo />
        </DemoBox>
        <DemoBox
          title={t('更多自定义配置')}
          desc={t('设置 save-key 属性定义选项的保存 key 值；设置 display-key 属性定义选项展示名称；search-key 属性定义多字段索引；tpl 属性可自定义下拉列表展示')}
          componentName="tag-input"
          demoName={`demo/${lang}/more-demo`}
        >
            <MoreDemo />
        </DemoBox>
        <DemoBox
          title={t('分组展示')}
          desc={t('配置 use-group 来启用分组功能， 数据源必须加上 children 的配置')}
          componentName="tag-input"
          demoName={`demo/${lang}/group-demo`}>
            <GroupDemo />
        </DemoBox>
        <DemoBox
          title={t('设置选中标签 tooltips')}
          desc={t('配置 tooltip-key 定义选中标签 hover 时的显示文案')}
          componentName="tag-input"
          demoName={`demo/${lang}/tooltips-demo`}>
            <TooltipsDemo />
        </DemoBox>
        <DemoBox
          title={t('列表项禁用')}
          desc={t('设置列表数据源 disabled 属性来禁用列表中的某些项，禁止用户选择')}
          componentName="tag-input"
          demoName={`demo/${lang}/list-disabled-demo`}
          >
            <ListDisabledDemo />
        </DemoBox>
        <DemoBox
          title={t('组件禁用状态')}
          desc={t('设置 disabled 属性来禁用组件')}
          componentName="tag-input"
          demoName={`demo/${lang}/disabled-demo`}
          >
            <DisabledDemo />
        </DemoBox>
        <DemoBox
          title={t('批量输入') }
          desc={t('粘贴内容默认按“;”来分割内容，设置 paste-fn 方法可以自定义粘贴输出内容')}
          componentName="tag-input"
          demoName={`demo/${lang}/paste-demo`}>
            <PasteDemo />
        </DemoBox>
        <DemoBox
          title={t('综合例子(多选)')}
          desc={t('设置 tpl 方法自定义下拉列表展示；设置 tagTpl 方法自定义标签展示，通过 max-data 属性限制最大可选数量')}
          componentName="tag-input"
          demoName={`demo/${lang}/example-demo`}>
            <ExampleDemo />
        </DemoBox>
        <DemoBox
          title={ t('综合例子(单选)') }
          desc={t('设置 filter-callback 定义过滤方法；设置 create-tag-validator 定义创建标签校验方法') }
          componentName="tag-input"
          demoName={`demo/${lang}/single-demo`}>
            <SingleDemo />
        </DemoBox>
        <PropsBox propsData={propsJson} subtitle="" />
      </div>
    );
  },
});
