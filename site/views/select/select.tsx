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
import SelectTriggerDemo from './select-trigger-demo.vue';
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
    name: 'model-value / v-model',
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
    desc: '下拉框最大高度',
    optional: [],
  },
  {
    name: 'minHeight',
    type: 'number',
    default: '',
    desc: '下拉框最小高度',
    optional: [],
  },
  {
    name: 'showAll',
    type: 'boolean',
    default: 'false',
    desc: '是否展示全部',
    optional: ['true', 'false'],
  },
  {
    name: 'allOptionId',
    type: 'string|number',
    default: '',
    desc: 'showAll为true时，全部选项的ID',
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
    desc: '下拉框popover配置，参考Popover组件（如果在Popover里面使用select，建议配置成为：{ boundary: "parent" }）',
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
    default: 'value',
    desc: '列表模式ID键',
    optional: [],
  },
  {
    name: 'displayKey',
    type: 'string',
    default: 'label',
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
    desc: '是否启用虚拟滚动（只支持List模式，如果scrollHeight高度大于list数目，则不会开启）',
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
    name: 'disableFocusBehavior',
    type: 'boolean',
    default: 'false',
    desc: '是否禁用自动聚焦行为（每次点击options或者展示select会自动聚焦到搜索框，可关闭此属性禁用聚焦）',
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
  {
    name: 'trigger',
    desc: 'content显示方式',
    type: 'string',
    default: 'default',
    optional: ['default', 'manual'],
  },
  {
    name: 'disableScrollToSelectedOption',
    desc: '是否禁用滚动到选中option的功能',
    type: 'boolean',
    default: 'false',
  },
];
const eventJson = [
  {
    name: 'update:modelValue',
    desc: 'v-model事件',
    params: 'value',
  },
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
  {
    name: 'search-change',
    desc: '自定义搜索回调',
    params: 'searchValue',
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
    desc: '整个标签插槽（multiple-mode=“tag” 生效）',
    optional: [],
  },
  {
    name: 'tagRender',
    type: 'Slot',
    default: null,
    desc: '标签内容插槽（multiple-mode=“tag” 生效）',
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
  {
    name: 'setSelected',
    type: 'function',
    default: '',
    desc: '手动设置选择的值（需要配置idKey和displayKey）',
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
          desc='将动作或菜单折叠到下拉菜单中，支持单选和多选'
          designLink='https://bkdesign.bk.tencent.com/design/54'
          name='Select 下拉选框'
        />
        <DemoBox
          componentName='select'
          demoName='select-base-demo'
          desc='基础单选'
          title='基础用法'
        >
          <SelectBaseDemo />
        </DemoBox>
        <DemoBox
          componentName='select'
          demoName='select-style-demo'
          desc='large、default、 small 三种尺寸，normal、simplicity两种风格'
          title='尺寸 & 风格'
        >
          <SelectStyleDemo />
        </DemoBox>
        <DemoBox
          componentName='select'
          demoName='select-multi-demo'
          desc='支持 tag 形式的多选，支持打勾以及 checkbox 的多选样式'
          title='多选'
        >
          <SelectMultiDemo />
        </DemoBox>
        <DemoBox
          componentName='select'
          demoName='select-group-demo'
          desc=''
          title='分组'
        >
          <SelectGroupDemo />
        </DemoBox>
        <DemoBox
          componentName='select'
          demoName='select-search-demo'
          desc='远程搜索和本地搜索，注意：动态Options时建议使用value作为key，防止出现option没有销毁问题'
          title='搜索'
        >
          <SelectSearchDemo />
        </DemoBox>
        <DemoBox
          componentName='select'
          demoName='select-scrollloading-demo'
          desc='滚动加载'
          title='滚动加载'
        >
          <SelectScrollLoadingDemo />
        </DemoBox>
        <DemoBox
          componentName='select'
          demoName='select-allow-create'
          desc='自定义创建选项'
          title='自定义创建'
        >
          <SelectAllowCreate />
        </DemoBox>
        <DemoBox
          componentName='select'
          demoName='select-tree-demo'
          desc='Tree Select'
          title='Tree Select'
        >
          <SelectTreeDemo />
        </DemoBox>
        <DemoBox
          componentName='select'
          demoName='select-virtual-render'
          desc='虚拟滚动只支持list模式数据源'
          title='Virtual Select'
        >
          <SelectVirtualRender />
        </DemoBox>
        <DemoBox
          componentName='select'
          demoName='select-trigger-demo'
          desc='配置trigger属性来控制content显示和隐藏'
          title='自定义content显示方式'
        >
          <SelectTriggerDemo />
        </DemoBox>
        <DemoBox
          componentName='select'
          demoName='select-slot-demo'
          desc='自定义tag和trigger'
          title='自定义slot'
        >
          <SelectSlotDemo />
        </DemoBox>
        <PropsBox
          propsData={propsJson}
          subtitle=''
        />
        <PropsBox
          columnMap={eventColumnMap}
          propsData={eventJson}
          title='Select 事件'
        />
        <PropsBox
          columnMap={slotColumnMap}
          propsData={selectSlots}
          subtitle=''
          title='Select 插槽'
        />
        <PropsBox
          propsData={selectExpose}
          subtitle=''
          title='Select 方法'
        />
        <PropsBox
          propsData={optionProps}
          subtitle=''
          title='Option 属性'
        />
        <PropsBox
          propsData={optionSlot}
          subtitle=''
          title='Option 插槽'
        />
      </div>
    );
  },
});
