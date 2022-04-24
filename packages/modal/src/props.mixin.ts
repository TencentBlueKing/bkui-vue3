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

export const propsMixin = {
  // 是否显示弹框
  isShow: {
    type: Boolean,
    default: false,
  },
  width: {
    type: [Number, String],
    default: '50%',
  },
  height: {
    type: [Number, String],
    default: '50%',
  },
  // 配置自定义样式类名
  customClass: {
    type: [Array, String],
    default: '',
  },
  // 弹框出现时，是否允许页面滚动
  scrollable: {
    type: Boolean,
    default: true,
  },
  // 是否允许出现遮罩
  showMask: {
    type: Boolean,
    default: true,
  },
  // 是否显示右上角的关闭 icon
  closeIcon: {
    type: Boolean,
    default: true,
  },
  // 是否允许 esc 按键关闭弹框
  escClose: {
    type: Boolean,
    default: true,
  },
  // 是否允许点击遮罩关闭弹框
  maskClose: {
    type: Boolean,
    default: true,
  },
  // 是否全屏
  fullscreen: {
    type: Boolean,
    default: false,
  },
  // 弹框尺寸
  size: {
    type: String,
    default: 'normal',
    validator: (value: string) => {
      const dialogSize = ['normal', 'small', 'medium', 'large'];
      if (dialogSize.indexOf(value) < 0) {
        console.error(`dialogSize property is not valid: '${value}',【${dialogSize.join(' | ')}】`);
        return false;
      }
      return true;
    },
  },
  // 弹框的渲染方式
  renderDirective: {
    type: String,
    default: 'show',
    validator: (value: string) => {
      if (['show', 'if'].indexOf(value) < 0) {
        console.error(`type render-directive is not valid: '${value}'`);
        return false;
      }
      return true;
    },
  },
};
