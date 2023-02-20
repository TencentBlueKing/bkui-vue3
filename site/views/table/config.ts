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
import i18n from '../../language/i18n';

const { t } = i18n.global;

export interface ConfigTableItem {
  name: string;
  type?: string;
  default?: string | number;
  desc: string;
  optional?: string[];
  config?: ConfigTableItem[];
}

interface TableItem {
  title?: string;
  subTile?: string;
  type?: string;
  config?: ConfigTableItem[];
}

export const FormatI18nData = (list: ConfigTableItem[]) => list.map((item: ConfigTableItem) => {
  const config = FormatI18nData(item.config || []);
  return {
    ...item,
    desc: t(item.desc),
    config,
  };
});

const LIST: TableItem[] = [
  {
    title: t('bk-table 属性'),
    subTile: 'LINE_HEIGHT = 42; SCROLLY_WIDTH = 4;',
    config: [
      { name: 'data', type: 'Array', default: '--', desc: '显示的数据', optional: [] },
      { name: 'columns', type: 'IColumn[]', default: '', desc: '表格列的配置描述，具体项参考IColumn', optional: [] },
      {
        name: 'active-column',
        type: 'Number|Array',
        default: '--',
        desc: '当前选中列,当设置选中多列时（columnPick = multi），配置为数组[index1, index2, index3]，只能选中单列时，可以为数值或者数组[index]',
        optional: [],
      },
      {
        name: 'column-pick',
        type: 'String',
        default: t('禁用（disabled）'),
        desc: '表格列选中方式,支持：',
        optional: [t('单列（single）'), t('多列（multi）'), t('禁用（disabled）')],
      },
      {
        name: 'height',
        type: 'Number|String',
        default: 'auto',
        desc: '设置表格高度,auto 根据行数自动填充高度, 100%，依赖初始化时父级容器高度',
        optional: [],
      },
      { name: 'min-height', type: 'Number|String', default: 'LINE_HEIGHT * 2', desc: '设置表格最小高度', optional: [] },
      {
        name: 'max-height',
        type: 'Number|String',
        default: t('auto，依赖外层高度'),
        desc: '设置表格最大高度',
        optional: [],
      },
      {
        name: 'row-height',
        type: 'Number|Function',
        default: 'LINE_HEIGHT',
        desc: '行高，可以为固定数值类型, 可以是函数，返回当前行的高度，返回值为数值类型',
        optional: [],
      },
      {
        name: 'head-height',
        type: 'Number',
        default: 'LINE_HEIGHT',
        desc: 'Thead行高，可以为固定数值类型',
        optional: [],
      },
      { name: 'show-head', type: 'Boolean', default: 'true', desc: '是否显示Head', optional: [] },
      {
        name: 'thead',
        type: 'Object',
        default: '--',
        desc: '表头配置，详细参考IHead，如果同时配置了thead和head-height、show-head，thead优先级最高，会覆盖其他配置',
        optional: [],
      },
      {
        name: 'virtual-enabled',
        type: 'Boolean',
        default: 'false',
        desc: '是否启用虚拟渲染 & 滚动, 当数据量很大时，启用虚拟渲染可以解决压面卡顿问题',
        optional: [],
      },
      {
        name: 'border',
        type: 'Array',
        default: '[BORDER_OPTION.ROW]',
        desc: '表格边框显示设置，可以是一个组合; 生效规则: 除非单独设置 none,否则会追加每个设置',
        optional: ['none', 'row', 'col', 'outer'],
      },
      {
        name: 'pagination',
        type: 'Boolean|Object',
        default: 'false',
        desc: '分页配置, 默认值为false，不启用分页; 设置为 true，启用分页功能，默认值参考分页组件 Pagination',
        optional: [],
      },
      { name: 'remote-pagination', type: 'Boolean', default: 'false', desc: '是否启用远程分页', optional: [] },
      { name: 'empty-text', type: 'String', default: t('暂无数据'), desc: '空数据展示', optional: [] },
      {
        name: 'settings',
        type: 'Object|Boolean',
        default: 'false',
        desc: 'bk-table-setting-content,用于设置表格行高、显示列...，详细参考ISettings',
        optional: [],
      },
      {
        name: 'row-class',
        type: 'String|Object|Function',
        default: '{}',
        desc: '行的 class 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style',
        optional: [],
      },
      {
        name: 'row-style',
        type: 'String|Object|Function',
        default: '{}',
        desc: '行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style',
        optional: [],
      },
      {
        name: 'cell-style',
        type: 'String|Object|Function',
        default: '{}',
        desc: '单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有单元格设置一样的 Style',
        optional: [],
      },
      {
        name: 'cell-class',
        type: 'String|Object|Function',
        default: '{}',
        desc: '单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className',
        optional: [],
      },
      {
        name: 'scroll-loading',
        type: 'Object|Boolean',
        default: 'undefined',
        desc: '表格底部loading加载效果，可以配合表格scroll-bottom事件使用, 详细配置可参考bk-loading组件',
        optional: [],
      },
      {
        name: 'reserve-expand',
        type: 'Boolean',
        default: 'false',
        desc: '仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的展开收起操作（需指定 row-key）',
        optional: [],
      },
      {
        name: 'row-key',
        type: 'String|Function',
        default: '--',
        desc: '行数据的 Key，用来优化 Table 的渲染。此key用于渲染table row的key，便于大数据渲染时的性能优化。在使用 reserve-selection, reserve-expand 功能的情况下，该属性是必填的。类型为 String 时，支持多层访问：user.info.id，同时支持 user.info[0].id',
        optional: [],
      },
      {
        name: 'show-overflow-tooltip',
        type: 'Boolean|IOverflowTooltip',
        default: 'false',
        desc: '表格cell内容超长时，是否自动展示tooltip，默认值为false，可以通过设置为true开启，如果需要自定义content请设置为对象，具体参考 IOverflowTooltip（此处配置整个table都启用，单个column配置可覆盖）',
        optional: [],
      },
      {
        name: 'selection-key',
        type: 'string',
        default: '',
        desc: '仅对设置了selection的情况下生效, 用于初始化或者更新row已选中状态,内部使用逻辑为：row[selectionKey]，可以为多级选择，但是多级选择只支持 row.child.child，更多请参考lodash.get',
        optional: [],
      },
      {
        name: 'is-selected-fn',
        type: 'Function',
        default: 'undefined',
        desc: '提供自定义判定当前行是否选中, 如果设置了此属性，其他判定均不生效, ({\'{\'} row, cell, data {\'}\'}) => bool',
        optional: [],
      },
      {
        name: 'async-data',
        type: 'Boolean',
        default: 'false',
        desc: '为避免不必要的数据修改导致的不可控组件更新,默认组件不会对传入组件的data进行任何修改,设置此属性为true则会对源数据进行同步（如：启用selection，勾选时想要自动同步到源数据）, 目前只会对指定了selectionKey的情况下才会对指定的字段数据进行更新，同时需要指定 rowKey，保证匹配到的row是正确的目标对象',
        optional: ['true', 'false'],
      },
      {
        name: 'row-hover',
        type: 'String',
        default: 'highlight',
        desc: '鼠标划过行样式行为,配置`highlight`会高亮当前行，`auto`自行设置样式',
        optional: ['highlight', 'auto'],
      },
      {
        name: 'default-sort',
        type: 'Object',
        default: '{}',
        desc: '如果只指定了 prop, 没有指定 order, 则默认顺序是 asc, 配置格式：{\'{\'} column: order {\'}\'}',
        optional: [],
      },
      {
        name: 'isRowSelectEnable',
        type: 'Function|Boolean',
        default: 'true',
        desc: '* 配合 column selection 使用用于配置渲染行数据的勾选框是否可用, 可以直接为 true|false，全部启用或者禁用如果是函数，则返回 true|false({\'{\'} row, index, isCheckAll {\'}\'}) => boolean',
        optional: [],
      },
      {
        name: 'resizerWay',
        type: 'String',
        default: 'true',
        desc: '当外层容器尺寸改变时，当前组件用什么方式进行重新计算,默认为 throttle，按照指定频率重新计算,可选值：debounce，在指定时间范围内只执行一次重新计算',
        optional: ['throttle', 'debounce'],
      },
    ],
  },
  {
    title: 'IColumn',
    subTile: '列配置详细说明',
    config: [
      {
        name: 'label',
        type: 'String|Function',
        default: '--',
        desc: '显示的标题，可以是字符串或者函数，函数的话需要返回一个String类型字符串',
        optional: [],
      },
      {
        name: 'field',
        type: 'String|Function',
        default: '',
        desc: '绑定的展示字段，可以是字符串或者函数，函数的话需要返回一个存在的字段名称',
        optional: [],
      },
      {
        name: 'prop',
        type: 'String|Function',
        default: '',
        desc: '此属性只在<bk-column>模板绑定时才会生效，如果是函数式绑定请使用`field`. 绑定的展示字段，可以是字符串或者函数，函数的话需要返回一个存在的字段名称',
        optional: [],
      },
      { name: 'render', type: 'String|Function', default: '--', desc: '自定义当前列渲染函数', optional: [] },
      { name: 'width', type: 'Number|String', default: 'auto', desc: '对应列的宽度', optional: [] },
      {
        name: 'minWidth',
        type: 'Number|String',
        default: 'auto',
        desc: '对应列的最小宽度，与 width 的区别是 width 是固定的，min-width 会把剩余宽度按比例分配给设置了 min-width 的列',
        optional: [],
      },
      {
        name: 'show-overflow-tooltip',
        type: 'Boolean|IOverflowTooltip',
        default: 'false',
        desc: '表格cell内容超长时，是否自动展示tooltip，默认值为false，可以通过设置为true开启，如果需要自定义content请设置为对象，具体参考 IOverflowTooltip',
        optional: [],
      },
      {
        name: 'type',
        type: 'String',
        default: 'none',
        desc: '对应列的类型。如果设置了 index 则显示该行的索引（从 1 开始计算）；如果设置了 expand 则显示为一个可展开的按钮',
        optional: ['index', 'expand', 'none'],
      },
      { name: 'resizable', type: 'Boolean', default: 'true', desc: '对应列是否可以通过拖动改变宽度', optional: [] },
      {
        name: 'fixed',
        type: 'String',
        default: 'false',
        desc: '列是否固定在左侧或者右侧，true 表示固定在左侧',
        optional: ['left', 'right'],
      },
      {
        name: 'sort',
        type: 'Boolean|ISort|String',
        default: 'false',
        desc: '对应列是否可以排序，可以简单设置true开启默认排序，也可以通过详细配置排序方式，请参考ISort',
        optional: [],
      },
      {
        name: 'filter',
        type: 'Boolean|String|IFilter',
        default: 'false',
        desc: '数据过滤的选项,可以简单设置true开启默认过滤。可以通过详细配置排序方式，请参考IFilter',
        optional: [],
      },
      { name: 'colspan', type: 'Number|Function', default: 1, desc: '规定单元格可横跨的列数', optional: [] },
      { name: 'rowspan', type: 'Number|Function', default: 1, desc: '规定单元格可横跨的行数', optional: [] },
    ],
  },
  {
    title: 'IOverflowTooltip',
    subTile: 'Table Cell ellipsis tooltip config',
    config: [
      {
        name: 'content',
        type: 'String|Function',
        default: 'Cell innerText',
        desc: 'tooltip展示内容，可以为回调函数，回调参数 (column, row) => string',
        optional: [],
      },
      { name: 'disabled', type: 'Boolean', default: 'false', desc: '是否展示tooltip', optional: ['true', 'false'] },
      {
        name: 'mode',
        type: 'String',
        default: 'auto',
        desc: '渲染模式，可选项 auto|static, auto模式会自动计算文本宽度和表格单元宽度，只有当文本宽度超出tip才会激活，如果是static模式，则会一直激活状态',
        optional: ['auto', 'static'],
      },
      {
        name: 'watchCellResize',
        type: 'Boolean',
        default: 'true',
        desc: '是否监听当前cell尺寸变化, 动态添加tooltip, 【如果需要提升性能，请禁用此功能】',
        optional: ['true', 'false'],
      },
    ],
  },
  {
    title: 'IHead',
    subTile: '表头详细配置说明',
    config: [
      { name: 'height', type: 'Number', default: 'LINE_HEIGHT', desc: 'Thead行高，可以为固定数值类型', optional: [] },
      { name: 'isShow', type: 'Boolean', default: 'true', desc: '是否显示Head', optional: [] },
      { name: 'cellFn', type: 'Function', default: 'undefined', desc: '自定义当前列渲染函数', optional: [] },
    ],
  },
  {
    title: 'ISort',
    subTile: '排序详细配置',
    config: [
      { name: 'value', type: 'string', default: 'asc', desc: '排序规则', optional: ['asc', 'desc'] },
      {
        name: 'sortFn',
        type: 'Function',
        default: '--',
        desc: '自定义排序函数，返回true | false，函数参考 Array.sort((a,b) => boolean)',
        optional: [],
      },
      {
        name: 'sortScope',
        type: 'String',
        default: 'current',
        desc: '排序生效范围，针对分页表格，当前排序是当前页生效还是全部数据排序',
        optional: ['current', 'all'],
      },
    ],
  },
  {
    title: 'IFilter',
    subTile: '过滤详细配置',
    config: [
      {
        name: 'filterFn',
        type: 'Function',
        default: '--',
        desc: '自定义过滤函数，参数：(checked, row, props.column, index, data) => boolean。如果要使用远程过滤，为防止默认过滤，请配置此选项为: () => true',
        optional: [],
      },
      {
        name: 'list',
        type: 'Array[{ value, text }]',
        default: '[]',
        desc: '数据过滤的选项，数组格式，数组中的元素需要有 text 和 value 属性。',
        optional: [],
      },
      {
        name: 'match',
        type: 'String',
        default: 'full',
        desc: '过滤匹配模式，默认全量匹配',
        optional: ['full', 'fuzzy'],
      },
      {
        name: 'filterScope',
        type: 'String',
        default: 'current',
        desc: '如果有分页，配置过滤范围为当前页面或者跨页',
        optional: ['current', 'all'],
      },
      {
        name: 'btnSave',
        type: 'String|Boolean',
        default: t('确定'),
        desc: '数据过滤的`确定`按钮配置，可配置为String类型，配置不同显示文本；也可以配置为false，禁用确定按钮，当此按钮禁用，单击过滤选项即生效',
        optional: [],
      },
      {
        name: 'btnReset',
        type: 'String|Boolean',
        default: t('重置'),
        desc: '数据过滤的`重置`按钮配置，可配置为String类型，配置不同显示文本；也可以配置为false，禁用`重置`按钮',
        optional: [],
      },
    ],
  },
  {
    title: 'ISettings',
    subTile: '表格设置详细配置，default：large: 78，medium: 60，small: 42',
    config: [
      { name: 'fields', type: 'Field[]', default: '--', desc: '可选的字段列表', optional: [] },
      { name: 'checked', type: 'String[]', default: '[]', desc: '已选的字段列表', optional: [] },
      {
        name: 'limit',
        type: 'Number',
        default: '0',
        desc: '配置最多能选择多少个字段，配置该属性后，字段列表将不提供全选功能',
        optional: [],
      },
      {
        name: 'size',
        type: 'String',
        default: 'small',
        desc: '当前表格的尺寸',
        optional: ['small', 'medium', 'large'],
      },
      {
        name: 'sizeList',
        type: 'Array[{ value, label, height }]',
        default: '[]',
        desc: '自定义表格尺寸列表',
        optional: [],
      },
    ],
  },
  {
    title: 'Events',
    subTile: '表格事件',
    type: 'events',
    config: [
      { name: 'row-click', desc: '当某一行被点击时会触发该事件', params: '(event, row, index, rows, this)' },
      { name: 'row-dblclick', desc: '当某一行被双击时会触发该事件', params: '(event, row, index, rows, this)' },
      {
        name: 'row-expand',
        desc: '当用户对某一行展开或者关闭的时候会触发该事件',
        params: '{ row, column, index, rows, e }',
      },
      { name: 'page-limit-change', desc: '当用户切换表格每页显示条数时会出发的事件', params: 'limit' },
      { name: 'page-value-change', desc: '当用户切换表格分页时会触发的事件', params: 'current' },
      { name: 'scroll-bottom', desc: '滚动到底部触发事件', params: '{ bottom, translateX, translateY }' },
      { name: 'setting-change', desc: '表格设置发生变化时的事件', params: '{ checked, size, height }' },
      { name: 'column-sort', desc: '当表格的排序条件发生变化的时候会触发该事件', params: '{ column, index, type }' },
      {
        name: 'column-filter',
        desc: '当表格的筛选条件发生变化的时候会触发该事件',
        params: '{ checked, column, index }',
      },
      { name: 'column-pick', desc: '当表格的选中一列的时候会触发该事件,(prop column-pick启用)', params: 'column[]' },
      { name: 'select-all', desc: '当用户手动勾选全选 Checkbox 时触发的事件', params: '{ checked, data }' },
      { name: 'select', desc: '当用户手动勾选数据行的 Checkbox 时触发的事件', params: '{ row, index, checked, data }' },
      {
        name: 'selection-change',
        desc: '当选择项发生变化时会触发该事件',
        params: '{ row, isAll, index, checked, data }',
      },
    ],
  },
  {
    title: 'Methods',
    subTile: 'bk-table 方法',
    type: 'events',
    config: [
      { name: 'clearSelection', desc: '用于多选表格，清空用户的选择', params: '' },
      { name: 'getSelection', desc: '用于多选表格，获取用户的选择', params: '' },
      {
        name: 'toggleRowSelection',
        desc: '用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）',
        params: 'row, selected',
      },
      { name: 'toggleAllSelection', desc: '用于多选表格，切换所有行的选中状态', params: '' },
      {
        name: 'setRowExpand',
        desc: '用于可展开表格，切换某一行的展开状态，如果使用了第二个参数，则是设置这一行展开与否（expanded 为 true 则展开）',
        params: 'row, expanded',
      },
    ],
  },
  {
    title: 'Slots',
    subTile: '预留插槽',
    type: 'events',
    config: [
      { name: '#empty', desc: '自定义空数据-empty插槽', params: '' },
      {
        name: '#default',
        desc: '<bk-column />模板使用自定义显示默认插槽',
        params: '{ cell, data, row, column, index, rows }',
      },
      { name: '#fixedBottom', desc: '底部加载插槽', params: '' },
    ],
  },
].map((item: TableItem) => {
  const result = Object.assign(item, {
    subTile: t(item.subTile),
    config: FormatI18nData(item.config),
  });
  return {
    ...result,
  };
});

export default LIST;
