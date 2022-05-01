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

import { PropTypes } from '@bkui-vue/shared';
export const propsMixin = {
  // 是否显示弹框
  isShow: PropTypes.bool.def(false),
  width: PropTypes.string.def('50%') || PropTypes.number,
  height: PropTypes.string.def('50%') || PropTypes.number,
  // 配置自定义样式类名
  customClass: PropTypes.string || PropTypes.array,
  // 弹框出现时，是否允许页面滚动
  scrollable: PropTypes.bool.def(true),
  // 是否允许出现遮罩
  showMask: PropTypes.bool.def(true),
  // 是否显示右上角的关闭 icon
  closeIcon: PropTypes.bool.def(true),
  // 是否允许 esc 按键关闭弹框
  escClose: PropTypes.bool.def(true),
  // 是否允许点击遮罩关闭弹框
  maskClose: PropTypes.bool.def(true),
  // 是否全屏
  fullscreen: PropTypes.bool.def(false),
  // 自定义类样式名
  extCls: PropTypes.string.def(''),
  // 弹框尺寸
  size: PropTypes.commonType(['normal', 'small', 'medium', 'large'], 'size').def('normal'),
  // 是否可拖拽
  draggable: PropTypes.bool.def(true),
  // 是否允许点击遮罩关闭弹窗
  quickClose: PropTypes.bool.def(true),
  // 是否显示在body内（即与id#app同级
  transfer: PropTypes.bool.def(false),
  // 自定义标题
  title: PropTypes.string.def('Header'),
  // 内容区最大高度
  maxHeight: PropTypes.string,
  // 弹出方向
  direction: PropTypes.string,
  // 动画类型
  animateType: PropTypes.string.def('slide'),
  // 弹框的渲染方式
  renderDirective: PropTypes.commonType(['show', 'if'], 'renderDirective').def('show'),
  // 关闭前回调
  beforeClose: PropTypes.custom(() => true),
};
