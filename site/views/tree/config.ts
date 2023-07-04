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
export default [
  {
    title: 'bk-tree 属性',
    subTile: '--',
    config: [
      { name: 'data', type: 'Array', default: '[]', desc: '渲染列表', optional: [] },
      { name: 'label', type: 'Function|String', default: 'label', desc: '指定节点标签为节点对象的某个属性值', optional: [] },
      { name: 'node-key', type: 'String', default: 'undefined', desc: '每个树节点用来作为唯一标识的属性，此标识应该是唯一的;如果设置系统会默认自动生成唯一id', optional: [] },
      { name: 'children', type: 'String', default: 'children', desc: '子节点 Key, 用于读取子节点', optional: [] },
      { name: 'indent', type: 'Number', default: '18', desc: '相邻级节点间的水平缩进，单位为像素', optional: [] },
      { name: 'line-height', type: 'Number', default: '32', desc: '设置行高', optional: [] },
      { name: 'level-line', type: 'Boolean|String|Function', default: 'false', desc: '设置层级连线, 可通过true|false设置默认开启|关闭，也可以直接设置`1px dashed #c3cdd7`自定义样式，或者设置为回调函数，动态设置', optional: [] },
      { name: 'virtual-render', type: 'Boolean', default: 'true', desc: '是否开启虚拟滚动, 默认虚拟滚动是开启的，数据量大的情况下有利于性能优化，可以通过设置 virtualRender = false 关闭虚拟滚动', optional: [] },
      { name: 'prefix-icon', type: 'Boolean|Function', default: 'true', desc: '当前节点标识图标, 通过 true | false，设置是否显示，如果需要自定义则配置为函数，返回VNode', optional: [] },
      { name: 'async', type: 'IAsync', default: '--', desc: '异步加载节点数据配置,详情请参考 IAsync配置', optional: [] },
      { name: 'offset-left', type: 'Number', default: '5', desc: '每个节点偏移左侧距离', optional: [] },
      { name: 'search', type: 'String|Number|Boolean|ISearchOption', default: 'undefined', desc: '搜索配置,可以为一个配置项 SearchOption, 或者直接为一个字符串|数值|布尔值，如此则模糊匹配此值', optional: [] },
      { name: 'empty-text', type: 'String', default: '没有数据', desc: '空数据显示文本', optional: [] },
      { name: 'draggable', type: 'Boolean', default: 'false', desc: '是否允许节点拖拽', optional: [] },
      { name: 'disable-drag', type: 'Function', default: 'null', desc: '节点是否禁用作为拖拽开启元素', optional: [] },
      { name: 'disable-drop', type: 'Function', default: 'null', desc: '节点是否禁用作为拖拽结束位置元素', optional: [] },
      { name: 'drag-sort', type: 'Boolean', default: 'false', desc: '节点拖拽时可交换位置（开启拖拽可交换位置后将不支持改变层级）', optional: [] },
      { name: 'selectable', type: 'Boolean|Function', default: 'true', desc: '节点是否可以选中', optional: [] },
      { name: 'disabled-folder-selectable', type: 'Boolean', default: 'false', desc: '是否禁用非最后叶子节点的可选择配置', optional: [] },
      { name: 'show-checkbox', type: 'Boolean', default: 'false', desc: '是否支持多选', optional: [] },
      { name: 'show-node-type-icon', type: 'Boolean', default: 'true', desc: '是否显示节点类型Icon', optional: [] },
      { name: 'selected', type: 'Object', default: 'null', desc: '默认选中的节点id(如果设置了node-key)或者节点对象，selectable为false时无效', optional: [] },
      { name: 'auto-check-children', type: 'Boolean', default: 'true', desc: '仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的展开收起操作（需指定 row-是否自动检查当前节点是否有子节点, 节点前面的展开收起Icon会根据判定值做改变.如果需要自已控制，请设置为false', optional: [] },
      { name: 'auto-open-parent-node', type: 'Boolean', default: 'true', desc: '如果设置了某一个叶子节点状态为展开，是否自动展开所有父级节点,默认为true，如果设置为false，则每层状态需要自己控制', optional: [] },
      { name: 'expand-all', type: 'Boolean', default: 'false', desc: '默认是否展开所有节点', optional: [] },
      { name: 'node-content-action', type: 'String[]', default: '', desc: '节点内容点击行为，此处配置每个节点除了展开\\收起箭头之外的内容块时的行为.默认为 ["selected", "expand", "click"]，点击内容块为选中当前节点, 如果要禁用所有行为，请设置为空数组 []', optional: ['click', 'selected', 'expand', 'collapse'] },
    ],
  },
  {
    title: 'IAsync',
    subTile: '异步加载节点数据配置',
    config: [
      { name: 'callback', type: 'Function', default: 'undefined', desc: '点击节点需要执行的异步函数, 返回 Promise', optional: [] },
      { name: 'cache', type: 'Boolean', default: 'true', desc: '是否缓存异步请求结果, true 只在第一次点击请求异步函数, false 每次点击都执行异步函数', optional: [] },
      { name: 'deepAutoOpen', type: 'String', default: 'once', desc: '异步请求节点是否自动展开, 可选值：once 只在初始化时执行一次；every 每次数据更新都执行', optional: ['once', 'every'] },
    ],
  },
  {
    title: 'ISearchOption',
    subTile: '搜索配置',
    config: [
      { name: 'value', type: 'String|Number|Boolean', default: '', desc: '需要匹配的值', optional: [] },
      { name: 'match', type: 'Boolean', default: 'fuzzy', desc: '匹配方式, 支持模糊匹配（fuzzy） || 完全匹配（full）, 支持自定义匹配函数 (searchValue, itemText, item) => true || false', optional: ['fuzzy', 'full'] },
      { name: 'resultType', type: 'String', default: 'tree', desc: '搜索结果如何展示', optional: ['tree', 'list'] },
      { name: 'openResultNode', type: 'Boolean', default: 'false', desc: '默认展开所有搜索结果', optional: ['true', 'false'] },
    ],
  },
  {
    title: 'Events',
    subTile: '表格事件',
    type: 'events',
    config: [
      { name: 'node-click', desc: '节点点击事件', params: '' },
      { name: 'node-collapse', desc: '节点收起事件', params: '' },
      { name: 'node-expand', desc: '节点展开事件', params: '' },
      { name: 'node-checked', desc: '节点勾选事件', params: '' },
      { name: 'node-drag-start', desc: '节点拖拽开始事件', params: '' },
      { name: 'node-drag-over', desc: '节点拖拽经过事件', params: '' },
      { name: 'node-drag-leave', desc: '节点拖拽离开事件', params: '' },
      { name: 'node-drop', desc: '节点拖拽释放事件', params: '' },
    ],
  },
  {
    title: 'Methods',
    subTile: 'bk-table 方法',
    type: 'events',
    config: [
      { name: 'handleTreeNodeClick', desc: '节点点击', params: '(item: any, e: MouseEvent)' },
      { name: 'isNodeChecked', desc: '判定指定节点是否选中', params: '(node)' },
      { name: 'isRootNode', desc: '判定指定节点是否为根节点', params: '(node)' },
      { name: 'isNodeOpened', desc: '判定指定节点是否展开', params: '(node)' },
      { name: 'isNodeMatched', desc: '判定指定节点是否匹配成功', params: 'row, expanded' },
      { name: 'hasChildNode', desc: '判定指定节点是否有子节点', params: 'row, expanded' },
      { name: 'setOpen', desc: '指定节点展开', params: '(item: any[] | any, isOpen = true, autoOpenParents = false)' },
      { name: 'setChecked', desc: '设置指定节点是否选中', params: '(item: any[] | any, checked = true)' },
      { name: 'setNodeAction', desc: '设置指定节点行为 checked isOpen', params: '(args: any | any[], action: string, value: any)' },
      { name: 'setNodeOpened', desc: '设置指定节点是否展开', params: '(item: any, isOpen = null, e: MouseEvent = null, fireEmit = true)' },
      { name: 'setSelect', desc: '设置指定节点是否选中', params: '(item: any, selected = true, autoOpen = true)' },
      { name: 'asyncNodeClick', desc: '异步请求触发点击节点', params: '（item）' },
      { name: 'getData', desc: '获取当前树配置数据（经过内部处理的数据）', params: '（）' },
    ],
  },
  {
    title: 'Slots',
    subTile: '预留插槽',
    type: 'events',
    config: [
      { name: '#default', desc: '默认自定义节点插槽, #default插槽与 #node插槽二选一即可，两者区别为参数格式不同，其他功能一致', params: '{ data: { ...node }, attributes: {} }' },
      { name: '#node', desc: '自定义节点', params: '{ ...node, ...attributes }' },
      { name: '#nodeType', desc: '节点类型Icon', params: 'node' },
      { name: '#nodeAppend', desc: '自定义节点后面的扩展展示', params: 'node' },
      { name: '#nodeAction', desc: '展开|收起自义定渲染', params: 'node' },
    ],
  },
];
