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
import { propsMixin } from '@bkui-vue/modal';
import { PropTypes } from '@bkui-vue/shared';

const props = {
  ...propsMixin,
  width: PropTypes.oneOfType([String, Number]).def(''),
  height: PropTypes.oneOfType([String, Number]).def(''),
  // 确认按钮文字
  confirmText: PropTypes.string.def('确定'),
  // 取消按钮文字
  cancelText: PropTypes.string.def('取消'),
  // 步骤按钮文字
  prevText: PropTypes.string.def('上一步'),
  nextText: PropTypes.string.def('下一步'),
  // 当前步骤
  current: PropTypes.number.def(1),
  // 总步数
  totalStep: PropTypes.number,
  // 弹框的标题
  title: PropTypes.string.def('title'),
  // 显示 header 的位置
  headerAlign: PropTypes.commonType(['left', 'center', 'right'], 'headerAlign').def('left'),
  // 显示 footer 的位置
  footerAlign: PropTypes.commonType(['left', 'center', 'right'], 'footerAlign').def('right'),
  // 颜色 按钮类型
  theme: PropTypes.commonType(['primary', 'warning', 'success', 'danger'], 'theme').def('primary'),
  // 对话框类型
  dialogType: PropTypes.commonType(['show', 'operation', 'confirm', 'process'], 'dialogType').def('operation'),
  // 按钮loading
  isLoading: PropTypes.bool.def(false),
};
export default props;
