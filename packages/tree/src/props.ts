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
import { PropTypes } from '@bkui-vue/shared';

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
    callback: PropTypes.func.def(null),
    cache: PropTypes.bool.def(true),
  }),

  /**
   * 每个节点偏移左侧距离
   */
  offsetLeft: PropTypes.number.def(15),
};

type AsyncOption = {
  callback: (item, cb) => Promise<any>,
  cache: Boolean
};
export type TreePropTypes = Readonly<ExtractPropTypes<typeof treeProps>>;
