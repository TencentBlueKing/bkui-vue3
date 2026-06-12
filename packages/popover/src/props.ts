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
 * documentation files (the 'Software'), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 * the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */
import { ExtractPropTypes } from 'vue';
import { toType } from 'vue-types';

import {
  PlacementEnum,
  placementType,
  PropTypes,
  renderType,
  triggerType,
  renderDirectiveType,
} from '@bkui-vue/shared';

export const EventProps = {
  onAfterHidden: () => {},
  onAfterShow: () => {},
};
export type IAxesOffsets = {
  mainAxis?: number;
  crossAxis?: number;
  alignmentAxis?: null | number;
};

type IContent = HTMLElement | JSX.Element | number | string;

export const PopoverProps = {
  isShow: PropTypes.bool.def(false),
  always: PropTypes.bool.def(false),
  disabled: PropTypes.bool.def(false),
  clickContentAutoHide: PropTypes.bool.def(false),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def('auto'),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def('auto'),
  maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def('auto'),
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def('auto'),
  content: toType<IContent>('IContent', {}).def(''),
  renderDirective: renderDirectiveType().def('if'),

  target: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(HTMLElement),
    PropTypes.instanceOf(PointerEvent),
  ]),

  allowHtml: PropTypes.bool.def(false),
  /**
   * 组件显示位置
   */
  // placement: placementType().def(PlacementEnum.TOP),
  placement: placementType().def(PlacementEnum.TOP_START),

  // 'dark', 'light'
  theme: PropTypes.string.def('dark'),

  /**
   * 触发方式
   * 支持 click hover manual
   * manual： 通过isShow控制显示、隐藏
   */
  trigger: triggerType(),

  /**
   * content 渲染方式
   */
  renderType: renderType(),

  // 是否显示箭头
  arrow: PropTypes.bool.def(true),

  padding: PropTypes.number.def(5),

  offset: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape<IAxesOffsets>({
      mainAxis: PropTypes.number,
      crossAxis: PropTypes.number,
      alignmentAxis: PropTypes.number,
    }),
  ]).def(6),

  /**
   * 弹出内容绑定元素
   */
  boundary: PropTypes.oneOfType([
    PropTypes.string.def('parent'),
    PropTypes.instanceOf(HTMLElement),
    PropTypes.func,
  ]).def('body'),

  zIndex: PropTypes.number.def(undefined),

  disableTeleport: PropTypes.bool.def(false),

  /**
   *  chooses the placement that has the most space available automatically
   */
  autoPlacement: PropTypes.bool.def(false),

  /**
   * 当有滚动条，滚动出可是范围时自动隐藏pop
   */
  autoVisibility: PropTypes.bool.def(true),

  /**
   * 是否禁用clickoutside
   */
  disableOutsideClick: PropTypes.bool.def(false),

  /**
   * 是否禁用样式的transform更新位移
   */
  disableTransform: PropTypes.bool.def(false),

  /**
   * 自定义 reference
   */
  reference: PropTypes.any,

  /**
   * 自定义浮动定位参考元素（仅用于定位，不影响 default slot 渲染）
   * 与 reference 的区别：reference 会导致 default slot 不渲染
   */
  floatingReference: PropTypes.any,

  /**
   * 兼容v1版本遗留配置
   * 不建议使用
   */
  modifiers: PropTypes.array.def([]),
  /**
   * popover显示和隐藏的延时时间
   */
  popoverDelay: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]).def(100),
  /**
   * 配置自定义样式类名，传入的类会被加在组件最外层的 DOM
   */
  extCls: PropTypes.string.def(''),

  /**
   * 配置自定义样式类名，传入的类会被加在 Reference 外部的 div 上
   */
  referenceCls: PropTypes.string.def(''),
  /**
   * 是否渲染默认插槽最外层 reference span；仅 true 时主动追加 span
   */
  renderReferenceWrapper: PropTypes.bool.def(undefined),
  /**
   * 点击 Reference 占位区是否忽略收起 popover
   */
  hideIgnoreReference: PropTypes.bool.def(false),
  /**
   * 自定义Content组件渲染，point-event延迟渲染时间
   * 避免子组件point-event渲染时触发popover鼠标事件
   * 如果设置为0，则不启用此设置
   */
  componentEventDelay: PropTypes.number.def(0),

  /**
   * 或略其他判定条件，强制监听clickoutside & 执行hide
   */
  forceClickoutside: PropTypes.bool.def(false),
};

export type PopoverPropTypes = Readonly<ExtractPropTypes<typeof PopoverProps>>;
