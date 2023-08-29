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

import { PropTypes, resolveClassName } from '@bkui-vue/shared';

const EventProps = {
  onContentScroll: Function,
};

export const virtualRenderProps = {
  /** 传入原始数据源 */
  list: PropTypes.array.def([]),

  /**
   * 是否启用此功能
   * 如果设置为false，则此组件只会渲染两层指定的 容器，默认渲染两层 div
   * 设置为true才会启用所有的虚拟渲染 & 滚动相关计算
   * 此属性设置为了兼容需要按需开启\关闭虚拟渲染场景，避免外层设计两套样式架构
   * Note: 目前此属性不支持动态修改
   */
  enabled: PropTypes.bool.def(true),

  /**
   * 是否启用内置的Scroll Listener
   * 当启用虚拟滚动时（enabled = true），滚动监听为内置生效
   * 只有当（enabled = false)时此配置项才生效
   */
  scrollEvent: PropTypes.bool.def(false),

  /**
   * 每行数据高度
   * 默认为数值类型，默认高度 30px
   * 如果每行高度不一致，可为回调函数：(index: number, row: any[]): number => {}
   * 函数参数为当前行index & 当前行数据 row，row为数组，当不分组时，为当前行item
   * 如果有分组展示， index 为当前分组 index， row为数组，当前行分组所有 item 数据
   */
  lineHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).def(30),

  /** 整体最小高度 */
  minHeight: PropTypes.number.def(30),

  /**
   * 整体高度
   * 可设置具体值，如果设置为 100%，则组件会自动计算外层DOM元素offsetHeight，用于计算可渲染行数
   */
  height: PropTypes.oneOfType([PropTypes.string.def('100%'), PropTypes.number]).def('100%'),

  /**
   * 渲染区域宽度
   * 如果设置 100% 则自适应外层元素宽度
   */
  width: PropTypes.oneOfType([PropTypes.string.def('100%'), PropTypes.number]).def('100%'),

  /** 最外层元素ClassName */
  className: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.object, PropTypes.arrayOf(PropTypes.object), PropTypes.string]).def(''),

  /** 内层层元素ClassName */
  contentClassName: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.object, PropTypes.arrayOf(PropTypes.object), PropTypes.string]).def(''),

  /** 内层元素样式 */
  contentStyle: PropTypes.object.def({}),

  /** 用于自定义X轴滚动条样式 */
  scrollXName: PropTypes.string.def(resolveClassName('F-scroll-x')),

  /** 用于自定义Y轴滚动条样式 */
  scrollYName: PropTypes.string.def(resolveClassName('F-scroll-y')),

  /** 分组展示，一行数据可能有多条数据 */
  groupItemCount: PropTypes.number.def(1),

  /** 预加载行数，避免空白渲染 */
  preloadItemCount: PropTypes.number.def(1),

  /** 外层Dom元素需要渲染成的目标元素 */
  renderAs: PropTypes.string.def('div'),

  /** 内容层渲染成目标元素 */
  contentAs: PropTypes.string.def('div'),

  /** top 滚动填充 */
  scrollOffsetTop: PropTypes.number.def(0),

  /**
   * 内置滚动位置
   * 可选：container （最外层容器），content（内容层容器）
   * Note: container 慎选，需要自己处理样式 & 位置
   */
  scrollPosition: PropTypes.string.def('content'),

  /**
   * 绝对高度 | 实际高估
   * 可选值： auto(根据行高和行数计算, LineHeight * List.length) number(外层给定高度，若为0，则不显示)
   */
  abosuteHeight: PropTypes.oneOfType([PropTypes.string.def('auto'), PropTypes.number]).def('auto'),

  /**
   * 滚动刷新计算间隔时间
   * 默认60 ms
   */
  throttleDelay: PropTypes.number.def(60),

  rowKey: PropTypes.string.def(undefined),

  /**
   * 数据改变时是否保持之前的状态
   * 保持滚动条位置、当前渲染区间
   */
  keepAlive: PropTypes.bool.def(false),

  /**
   * 数据监听改变时，是否自动重置位置到[0, 0]
   */
  autoReset: PropTypes.bool.def(true),

  ...EventProps,
};

export type VirtualRenderProps = Readonly<ExtractPropTypes<typeof virtualRenderProps>>;
