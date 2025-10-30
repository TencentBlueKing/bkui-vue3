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

import { ExtractPropTypes, PropType } from 'vue';

import { IOptions } from '@bkui-vue/directives';
import { PopoverPropTypes } from '@bkui-vue/popover';
import { InputBehaviorType, PropTypes, SelectedType, SizeEnum, TagThemeType } from '@bkui-vue/shared';

export const props = {
  modelValue: PropTypes.any,
  multiple: PropTypes.bool.def(false),
  disabled: PropTypes.bool.def(false),
  size: PropTypes.size().def(SizeEnum.DEFAULT),
  clearable: PropTypes.bool.def(true),
  loading: PropTypes.bool.def(false),
  filterable: PropTypes.bool.def(false), // 是否支持搜索
  remoteMethod: PropTypes.func,
  scrollHeight: PropTypes.number.def(204), // 最大高度
  minHeight: PropTypes.number, // 最小高度
  showAll: PropTypes.bool.def(false), // 全部
  allOptionText: PropTypes.string.def(''), // 全部选项文本
  allOptionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // 全部选项ID
  showSelectAll: PropTypes.bool.def(false), // 全选
  popoverMinWidth: PropTypes.number.def(0), // popover最小宽度
  showOnInit: PropTypes.bool.def(false), // 是否默认显示popover
  multipleMode: PropTypes.oneOf(['default', 'tag']).def('default'), // 多选展示方式
  tagTheme: TagThemeType(),
  behavior: InputBehaviorType(), // 输入框模式
  collapseTags: PropTypes.bool.def(false), // 当以标签形式显示选择结果时，是否合并溢出的结果以数字显示
  autoHeight: PropTypes.bool.def(true), // collapseTags模式下，聚焦时自动展开所有Tag
  noDataText: PropTypes.string,
  noMatchText: PropTypes.string,
  loadingText: PropTypes.string,
  placeholder: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  selectAllText: PropTypes.string,
  scrollLoading: PropTypes.bool.def(false),
  allowCreate: PropTypes.bool.def(false), // 是否运行创建自定义选项
  popoverOptions: Object as PropType<Partial<PopoverPropTypes>>, // popover属性
  customContent: PropTypes.bool.def(false), // 是否自定义content内容
  list: PropTypes.arrayOf(PropTypes.any).def([]),
  idKey: PropTypes.string.def('value'),
  displayKey: PropTypes.string.def('label'),
  withValidate: PropTypes.bool.def(true),
  showSelectedIcon: PropTypes.bool.def(true), // 多选时是否显示勾选ICON
  inputSearch: PropTypes.bool.def(false), // 是否采用输入框支持搜索的方式
  enableVirtualRender: PropTypes.bool.def(false), // 是否开启虚拟滚动（List模式下才会生效）
  allowEmptyValues: PropTypes.array.def([]), // 允许的空值作为options选项
  autoFocus: PropTypes.bool.def(false), // 挂载的时候是否自动聚焦输入框
  disableFocusBehavior: PropTypes.bool.def(false), // 禁用自动聚焦行为
  keepSearchValue: PropTypes.bool.def(false), // 隐藏popover时是否保留搜索内容,
  prefix: PropTypes.string,
  selectedStyle: SelectedType(),
  filterOption: { type: Function }, // 配置当前options的过滤规则
  searchWithPinyin: PropTypes.bool.def(true), // 拼音搜索
  highlightKeyword: PropTypes.bool.def(false), // 搜索高亮
  trigger: {
    type: String as PropType<'default' | 'manual'>,
    default: 'default',
  }, // content显示和隐藏方式
  disableScrollToSelectedOption: PropTypes.bool.def(false), // 是否禁用滚动到选中option的功能
  inputTooltipsOptions: {
    type: Object as PropType<Partial<IOptions>>,
    default: () => ({}),
  }, // 透传Input组件的tooltips配置
};

export type SelectProps = ExtractPropTypes<typeof props>;

export const optionProps = {
  id: {
    type: [String, Number],
    require: true,
  },
  name: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  disabled: PropTypes.bool.def(false),
  order: PropTypes.number.def(0),
};

export type OptionProps = ExtractPropTypes<typeof optionProps>;

export const optionGroupProps = {
  label: PropTypes.string.def(''),
  disabled: PropTypes.bool.def(false),
  collapsible: PropTypes.bool.def(false), // 是否开启折叠
  collapse: PropTypes.bool.def(false), // 是否折叠初始状态
  visible: PropTypes.bool.def(true),
};

export type OptionGroupProps = ExtractPropTypes<typeof optionGroupProps>;
