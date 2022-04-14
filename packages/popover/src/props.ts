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

import { ExtractPropTypes, PropType } from 'vue';

import { OnFirstUpdateFnType, PropTypes } from '@bkui-vue/shared';
const placements = ['auto', 'auto-start', 'auto-end', 'top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'right', 'right-start', 'right-end', 'left', 'left-start', 'left-end'];
export const PopoverProps = {
  isShow: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def('auto'),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def('auto'),
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(''),

  /**
   * 动画展示方式
   */
  transition: PropTypes.string.def('fade-in'),

  /**
   * 展示位置
   */
  placement: PropTypes.placement(placements).def('top'),

  // 'dark', 'light'
  theme: PropTypes.string.def('light'),

  /**
   * handleFirstUpdate
   */
  handleFirstUpdate: {
    type: Function as PropType<OnFirstUpdateFnType>,
    default: () => {},
  },

  /**
   * 触发方式
   * 支持 click hover manual
   * manual： 通过isShow控制显示、隐藏
   */
  trigger: PropTypes.string.def('hover'),

  // 是否显示箭头
  arrow: PropTypes.bool.def(true),

  // popper modifiers配置
  modifiers: PropTypes.array.def([
    {
      name: 'offset',
      options: {
        offset: [0, 8],
      },
    },
  ]),

  /**
   * 弹出内容绑定元素
   */
  boundary: PropTypes.oneOfType([PropTypes.string.def('parent'), PropTypes.instanceOf(HTMLElement)]),

  /**
   * 如果设置了boundary为指定DOM，此配置项生效
   * 是否将弹出内容固定到目标元素位置
   * 例如：boundary = document.body, fixOnBoundary = true，则弹出内容会一直固定到body
   */
  fixOnBoundary: PropTypes.bool.def(false),
};

export type PopoverPropTypes = Readonly<ExtractPropTypes<typeof PopoverProps>>;

