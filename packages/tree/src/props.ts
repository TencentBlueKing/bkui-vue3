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
import { ExtractPropTypes } from 'vue';
import { string, toType } from 'vue-types';

import { PropTypes } from '@bkui-vue/shared';

import { NodeContentActionEnum } from './constant';

enum ColumnTypeEnum {
  ONCE = 'once',
  EVERY = 'every',
}
enum TreeSearchMatchEnum {
  FUZZY = 'fuzzy',
  FULL = 'full',
}

enum TreeSearchResultEnum {
  TREE = 'tree',
  LIST = 'list',
}

/**
 * Tree Prop: prefixIcon function
 * @param {} isRoot 是否为分跟节点
 * @param {} hasChild 是否有孩子节点
 * @param {} isOpen 当前节点是否展开
 * @param {} renderType 当前渲染类型（action: 用来标识当前节点状态，展开 | 收起, node_type：节点类型，文件、文件夹）
 * @param {} item 当前节点数据
 */
export type IPrefixIcon = (isRoot: boolean, hasChild: boolean, isOpen: boolean, renderType: string, item: any) => any;

export const treeProps = {
  /**
   * 渲染列表
   */
  data: PropTypes.arrayOf(PropTypes.any).def([]),

  /**
   * 指定节点标签为节点对象的某个属性值
   */
  label: PropTypes.oneOfType([PropTypes.func.def(undefined), PropTypes.string.def('label')]),

  /**
   * 每个树节点用来作为唯一标识的属性，此标识应该是唯一的
   * 如果设置系统会默认自动生成唯一id
   */
  nodeKey: PropTypes.string.def(undefined),

  /**
   * 子节点 Key, 用于读取子节点
   * 默认 children
   */
  children: PropTypes.string.def('children'),

  /**
   * 相邻级节点间的水平缩进，单位为像素
   */
  indent: PropTypes.number.def(18),

  /**
   * 设置行高
   */
  lineHeight: PropTypes.number.def(32),

  /**
   * 设置层级连线
   */
  levelLine: PropTypes.oneOfType([
    PropTypes.bool.def(false),
    PropTypes.func.def(undefined),
    PropTypes.string.def('1px dashed #c3cdd7'),
  ]).def(false),

  /**
   * 是否开启虚拟滚动
   * 默认虚拟滚动是开启的，数据量大的情况下有利于性能优化，可以通过设置 virtualRender = false 关闭虚拟滚动
   */
  virtualRender: PropTypes.bool.def(false),

  /**
   * 当前节点标识图标
   * 默认 true
   */
  prefixIcon: PropTypes.oneOfType([
    PropTypes.func.def(() => {}),
    PropTypes.bool.def(false),
  ]).def(true),

  /**
   * 异步加载节点数据配置
   * @param callback 请求数据回调函数，函数返回 Promise
   * @param cache 是否缓存请求结果，默认为True，只有在第一次才会发起请求，若设置为false则每次都会发起请求
   */
  async: PropTypes.shape<AsyncOption>({
    /**
     * 点击节点需要执行的异步函数
     * 返回 Promise
     */
    callback: PropTypes.func.def(undefined),

    /**
     * 是否缓存异步请求结果
     * true 只在第一次点击请求异步函数
     * false 每次点击都执行异步函数
     */
    cache: PropTypes.bool.def(true),

    /**
     * 异步请求节点是否自动展开
     * 可选值：once 只在初始化是执行一次
     * every 每次数据更新都执行
     */
    deepAutoOpen: toType<`${ColumnTypeEnum}`>('columnType', {}).def(ColumnTypeEnum.ONCE),
  }),

  /**
   * 每个节点偏移左侧距离
   */
  offsetLeft: PropTypes.number.def(5),

  /**
   * 搜索配置
   * 可以为一个配置项 SearchOption
   * 或者直接为一个字符串，如果直接为字符串则模糊匹配此值
   */
  search: PropTypes.oneOfType([
    PropTypes.shape<SearchOption>({
    /**
     * 需要匹配的值
     * */
      value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.bool,
      ]).def(''),

      /**
     * 匹配方式
     * 支持模糊匹配（fuzzy） || 完全匹配（full）
     * 默认 模糊匹配（fuzzy）
     * 支持自定义匹配函数 (searchValue, itemText, item) => true || false
     */
      match: PropTypes.oneOfType([
        string<`${TreeSearchMatchEnum}`>(),
        PropTypes.func,
      ]).def(TreeSearchMatchEnum.FUZZY),

      /**
     * 搜索结果如何展示
     * 显示为 tree || list
     * 默认 tree
     */
      resultType: string<`${TreeSearchResultEnum}`>().def(TreeSearchResultEnum.TREE),

      /**
       * 默认展开所有搜索结果
       */
      openResultNode: PropTypes.bool,
    }),
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).def(undefined),

  emptyText: PropTypes.string.def('没有数据'),

  draggable: PropTypes.bool.def(false),
  disableDrag: PropTypes.func,
  disableDrop: PropTypes.func,

  /**
   * 节点拖拽时可交换位置（开启拖拽可交换位置后将不支持改变层级）
   */
  dragSort: PropTypes.bool.def(false),

  /**
   * 节点是否可以选中
   */
  selectable: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]).def(true),
  disabledFolderSelectable: PropTypes.bool.def(false),

  /**
   * 是否支持多选
   */
  showCheckbox: PropTypes.bool.def(false),

  /**
   * 是否显示节点类型Icon
   */
  showNodeTypeIcon: PropTypes.bool.def(true),

  /**
   * 默认选中的节点id，selectable为false时无效
   */
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),

  /**
   * 是否自动检查当前节点是否有子节点
   * 节点前面的展开收起Icon会根据判定值做改变
   * 如果需要自已控制，请设置为false
   */
  autoCheckChildren: PropTypes.bool.def(true),

  /**
   * 如果设置了某一个叶子节点状态为展开，是否自动展开所有父级节点
   * 默认为true，如果设置为false，则每层状态需要自己控制
   */
  autoOpenParentNode: PropTypes.bool.def(true),

  /**
   * 默认是否展开所有节点
   */
  expandAll: PropTypes.bool.def(false),

  /**
   * 节点内容点击行为
   * 此处配置每个节点除了展开\收起箭头之外的内容块时的行为
   * 默认为 ['selected', 'expand', 'click']，点击内容块为选中当前节点
   */
  nodeContentAction: PropTypes.oneOfType([
    PropTypes.arrayOf(toType<`${NodeContentActionEnum}`>('nodeContentActionType', {}).def(NodeContentActionEnum.CLICK)),
    PropTypes.func.def(() => ['selected']),
  ]).def(['selected', 'expand', 'click']),
};

type AsyncOption = {
  callback: (item, cb) => Promise<any>,
  cache: Boolean,
  deepAutoOpen?: string
};

export type SearchOption = {
  value: string | number | boolean,
  match?: `${TreeSearchMatchEnum}` | Function,
  resultType?: `${TreeSearchResultEnum}`;
  openResultNode: boolean;
};

export type TreePropTypes = Readonly<ExtractPropTypes<typeof treeProps>>;
