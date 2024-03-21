/* eslint-disable codecc/comment-ratio */

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
import { IPropsTableItem } from '../../typings';

import SelectAllowCreate from './select-allow-create.vue';
import SelectBaseDemo from './select-base-demo.vue';
import SelectGroupDemo from './select-group-demo.vue';
import SelectMultiDemo from './select-multi-demo.vue';
import SelectScrollLoadingDemo from './select-scrollloading-demo.vue';
import SelectSearchDemo from './select-search-demo.vue';
import SelectSlotDemo from './select-slot-demo.vue';
import SelectStyleDemo from './select-style-demo.vue';
import SelectTreeDemo from './select-tree-demo.vue';
import SelectVirtualRender from './select-virtual-render.vue';

const eventColumnMap = {
  name: '名称',
  desc: '说明',
  params: '参数',
};

const slotColumnMap = {
  name: '名称',
  desc: '说明',
  type: '类型',
  params: '参数',
};

const propsJson: IPropsTableItem[] = [
  {
    name: 'modelValue / v-model',
    type: 'any',
    default: '',
    desc: '绑定值',
    optional: [],
  },
  {
    name: 'multiple',
    type: 'boolean',
    default: 'false',
    desc: '是否多选',
    optional: ['true', 'false'],
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    desc: '是否禁用',
    optional: ['true', 'false'],
  },
  {
    name: 'size',
    type: 'string',
    default: 'default',
    desc: '输入框尺寸',
    optional: ['default', 'small', 'large'],
  },
  {
    name: 'clearable',
    type: 'boolean',
    default: 'true',
    desc: '是否可以清空选项',
    optional: ['true', 'false'],
  },
  {
    name: 'loading',
    type: 'boolean',
    default: 'false',
    desc: '是否正在加载中',
    optional: ['true', 'false'],
  },
  {
    name: 'filterable',
    type: 'boolean',
    default: 'false',
    desc: '是否可搜索',
    optional: ['true', 'false'],
  },
  {
    name: 'remoteMethod',
    type: 'function',
    default: '',
    desc: '远程搜索方法',
    optional: [],
  },
  {
    name: 'scrollHeight',
    type: 'number',
    default: '200',
    desc: '下拉框高度',
    optional: [],
  },
  {
    name: 'showSelectAll',
    type: 'boolean',
    default: 'false',
    desc: '是否展示全选项',
    optional: ['true', 'false'],
  },
  {
    name: 'popoverMinWidth',
    type: 'number',
    default: '0',
    desc: '下拉框最大宽度',
    optional: [],
  },
  {
    name: 'showOnInit',
    type: 'boolean',
    default: 'false',
    desc: '是否初始化时展示下拉框',
    optional: ['true', 'false'],
  },
  {
    name: 'multipleMode',
    type: 'string',
    default: 'tag',
    desc: '多选展示模式',
    optional: ['default', 'tag'],
  },
  {
    name: 'tagTheme',
    type: 'string',
    default: '',
    desc: 'tag模式主题',
    optional: ['success', 'info', 'warning', 'danger'],
  },
  {
    name: 'behavior',
    type: 'string',
    default: 'normal',
    desc: '输入框样式',
    optional: ['simplicity', 'normal'],
  },
  {
    name: 'collapseTags',
    type: 'boolean',
    default: 'false',
    desc: '多选时是否将选中值按文字的形式展示',
    optional: ['true', 'false'],
  },
  {
    name: 'autoHeight',
    type: 'boolean',
    default: 'true',
    desc: 'collapseTags为true时，聚焦下拉时是否自动展开所有Tag',
    optional: ['true', 'false'],
  },
  {
    name: 'noDataText',
    type: 'string',
    default: '',
    desc: '无数据文案',
    optional: [],
  },
  {
    name: 'noMatchText',
    type: 'string',
    default: '',
    desc: '无匹配数据文案',
    optional: [],
  },
  {
    name: 'loadingText',
    type: 'string',
    default: '',
    desc: '加载中文案',
    optional: [],
  },
  {
    name: 'placeholder',
    type: 'string',
    default: '',
    desc: '',
    optional: [],
  },
  {
    name: 'searchPlaceholder',
    type: 'string',
    default: '',
    desc: '搜索框的placeholder',
    optional: [],
  },
  {
    name: 'selectAllText',
    type: 'string',
    default: '',
    desc: '全选文案',
    optional: [],
  },
  {
    name: 'scrollLoading',
    type: 'boolean',
    default: 'false',
    desc: '是否开启滚动加载',
    optional: ['true', 'false'],
  },
  {
    name: 'allowCreate',
    type: 'boolean',
    default: 'false',
    desc: '是否运行创建自定义选项',
    optional: ['true', 'false'],
  },
  {
    name: 'popoverOptions',
    type: 'object',
    default: '',
    desc: '下拉框popover配置，参考Popover组件',
    optional: [],
  },
  {
    name: 'customContent',
    type: 'boolean',
    default: 'false',
    desc: '是否自定义下拉内容',
    optional: [],
  },
  {
    name: 'list',
    type: 'Array',
    default: '',
    desc: '列表模式',
    optional: [],
  },
  {
    name: 'idKey',
    type: 'string',
    default: 'id',
    desc: '列表模式ID键',
    optional: [],
  },
  {
    name: 'displayKey',
    type: 'string',
    default: 'name',
    desc: '列表模式name键',
    optional: [],
  },
  {
    name: 'withValidate',
    type: 'boolean',
    default: 'true',
    desc: '',
    optional: ['true', 'false'],
  },
  {
    name: 'showSelectedIcon',
    type: 'boolean',
    default: 'true',
    desc: '是否隐藏selectedStyle的样式',
    optional: ['true', 'false'],
  },
  {
    name: 'inputSearch',
    type: 'boolean',
    default: 'true',
    desc: '搜索框跟下拉框是否共用',
    optional: ['true', 'false'],
  },
  {
    name: 'enableVirtualRender',
    type: 'boolean',
    default: 'false',
    desc: '是否启用虚拟滚动（只支持List模式）',
    optional: ['true', 'false'],
  },
  {
    name: 'allowEmptyValues',
    type: 'Array',
    default: '',
    desc: '允许的空值作为options选项',
    optional: [],
  },
  {
    name: 'autoFocus',
    type: 'boolean',
    default: 'false',
    desc: '是否自动聚焦当前下拉框',
    optional: ['true', 'false'],
  },
  {
    name: 'keepSearchValue',
    type: 'boolean',
    default: 'false',
    desc: '隐藏popover时是否保留搜索内容',
    optional: ['true', 'false'],
  },
  {
    name: 'prefix',
    type: 'string',
    default: '',
    desc: '前缀',
    optional: [],
  },
  {
    name: 'selectedStyle',
    type: 'string',
    default: 'check',
    desc: '多选时ICON样式',
    optional: ['checkbox', 'check'],
  },
  {
    name: 'filterOption',
    type: 'boolean/function',
    default: 'true',
    desc: '是否根据输入项进行筛选。当其为一个函数时，会接收 searchValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false',
  },
  {
    name: 'searchWithPinyin',
    desc: '是否开启拼音搜索',
    type: 'boolean',
    default: 'true',
  },
  {
    name: 'highlightKeyword',
    desc: '高亮搜索关键字',
    type: 'boolean',
    default: 'false',
  },
];
const eventJson = [
  {
    name: 'change',
    desc: '选中值发生变化时触发',
    params: 'value',
  },
  {
    name: 'toggle',
    desc: '下拉框出现/隐藏时触发',
    params: 'value',
  },
  {
    name: 'clear',
    desc: '清空选项',
    params: '--',
  },
  {
    name: 'scroll-end',
    desc: '列表滚动到底部时触发',
    params: '--',
  },
  {
    name: 'focus',
    desc: '当 input 获得焦点时触发',
    params: '--',
  },
  {
    name: 'blur',
    desc: '当 input 失去焦点时触发',
    params: '--',
  },
  {
    name: 'tag-remove',
    desc: '多选模式下移除tag时触发',
    params: 'value',
  },
  {
    name: 'select',
    desc: '被选中时调用',
    params: 'value',
  },
  {
    name: 'deselect',
    desc: '取消选中时调用',
    params: 'value',
  },
];
// 输入框插槽
const selectSlots = [
  {
    name: 'prefix',
    type: 'Slot',
    default: null,
    desc: '前置插槽',
    optional: [],
  },
  {
    name: 'suffix',
    type: 'Slot',
    default: null,
    desc: '后置插槽',
    optional: [],
  },
  {
    name: 'trigger',
    type: 'Slot',
    default: null,
    desc: '选项插槽',
    optional: [],
  },
  {
    name: 'extension',
    type: 'Slot',
    default: null,
    desc: '下拉选项拓展插槽',
    optional: [],
  },
  {
    name: 'tag',
    type: 'Slot',
    default: null,
    desc: '标签插槽（multiple-mode=“tag” 生效）',
    optional: [],
  },
];
const selectExpose = [
  {
    name: 'hidePopover',
    type: 'function',
    default: '',
    desc: '隐藏Popover弹窗',
    optional: [],
  },
  {
    name: 'showPopover',
    type: 'function',
    default: '',
    desc: '显示Popover弹窗',
    optional: [],
  },
];
const optionProps = [
  {
    name: 'id',
    type: 'string / number',
    default: '',
    desc: '下拉选项的唯一ID',
    optional: [],
  },
  {
    name: 'name',
    type: 'string',
    default: '',
    desc: '下拉选项展示的名称',
    optional: [],
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    desc: '是否禁用',
    optional: [],
  },
];
const optionSlot = [
  {
    name: 'default',
    type: 'Slot',
    default: '',
    desc: '默认插槽',
    optional: [],
  },
];
export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          name='Select 下拉选框'
          desc='将动作或菜单折叠到下拉菜单中，支持单选和多选'
          designLink='https://bkdesign.bk.tencent.com/design/54'
        />
        <DemoBox
          title='基础用法'
          desc='基础单选'
          componentName='select'
          demoName='select-base-demo'
        >
          <SelectBaseDemo />
        </DemoBox>
        <DemoBox
          title='尺寸 & 风格'
          desc='large、default、 small 三种尺寸，normal、simplicity两种风格'
          componentName='select'
          demoName='select-style-demo'
        >
          <SelectStyleDemo />
        </DemoBox>
        <DemoBox
          title='多选'
          desc='支持 tag 形式的多选，支持打勾以及 checkbox 的多选样式'
          componentName='select'
          demoName='select-multi-demo'
        >
          <SelectMultiDemo />
        </DemoBox>
        <DemoBox
          title='分组'
          desc=''
          componentName='select'
          demoName='select-group-demo'
        >
          <SelectGroupDemo />
        </DemoBox>
        <DemoBox
          title='搜索'
          desc='远程搜索和本地搜索，注意：动态Options时建议使用value作为key，防止出现option没有销毁问题'
          componentName='select'
          demoName='select-search-demo'
        >
          <SelectSearchDemo />
        </DemoBox>
        <DemoBox
          title='滚动加载'
          desc='滚动加载'
          componentName='select'
          demoName='select-scrollloading-demo'
        >
          <SelectScrollLoadingDemo />
        </DemoBox>
        <DemoBox
          title='自定义创建'
          desc='自定义创建选项'
          componentName='select'
          demoName='select-allow-create'
        >
          <SelectAllowCreate />
        </DemoBox>
        <DemoBox
          title='Tree Select'
          desc='Tree Select'
          componentName='select'
          demoName='select-tree-demo'
        >
          <SelectTreeDemo />
        </DemoBox>
        <DemoBox
          title='Virtual Select'
          desc='虚拟滚动只支持list模式数据源'
          componentName='select'
          demoName='select-virtual-render'
        >
          <SelectVirtualRender />
        </DemoBox>
        <DemoBox
          title='自定义slot'
          desc='自定义tag和trigger'
          componentName='select'
          demoName='select-slot-demo'
        >
          <SelectSlotDemo />
        </DemoBox>
        <PropsBox
          propsData={propsJson}
          subtitle=''
        />
        <PropsBox
          propsData={eventJson}
          columnMap={eventColumnMap}
          title='Select 事件'
        />
        <PropsBox
          title='Select 插槽'
          subtitle=''
          columnMap={slotColumnMap}
          propsData={selectSlots}
        />
        <PropsBox
          title='Select 方法'
          subtitle=''
          propsData={selectExpose}
        />
        <PropsBox
          title='Option 属性'
          subtitle=''
          propsData={optionProps}
        />
        <PropsBox
          title='Option 插槽'
          subtitle=''
          propsData={optionSlot}
        />
      </div>
    );
  },
});
