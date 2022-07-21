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

export const propsCollapse = {
  /**
   * 渲染列表
   * 对象数组或者字符串数组，字符串数组默认会增加 name 字段，值为传入的字符串值
   */
  list: PropTypes.arrayOf(PropTypes.any).def([]),

  /**
   * ID字段
   */
  idFiled: PropTypes.string.def('$index'),

  /**
   * Title 字段
   */
  titleField: PropTypes.string.def('name'),

  /**
   * Content 字段，默认渲染内容，不配置时自动读取 content 字段
   * 自定义配置slot时可以忽略
   */
  contentField: PropTypes.string.def('content'),

  /**
   * 当前激活Index
   */
  modelValue: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number).def([]),
    PropTypes.arrayOf(PropTypes.string).def([]), PropTypes.number.def(-1)]),

  /**
   * 是否使用手风琴效果
   */
  accordion: PropTypes.bool.def(false),
};
export const CollapsePanelEventProps = {
  itemClick: {
    type: Function,
    default: (): any => ({}),
  },
};
export const propsCollapsePanel = {
  name: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(''),
  title: PropTypes.any,
  content: PropTypes.string,
  disabled: PropTypes.bool.def(false),
  isFormList: PropTypes.bool.def(false),
  renderDirective: PropTypes.commonType(['if', 'show'], 'render').def('show'),
  modelValue: PropTypes.bool.def(false),
  ...CollapsePanelEventProps,
};


