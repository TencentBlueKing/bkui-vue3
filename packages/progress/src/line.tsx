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

import { usePrefix } from '@bkui-vue/config-provider';

/** 进度条直线*/
const Line = (_: any, { attrs, slots }) => {
  const { resolveClassName } = usePrefix();
  const { percent, strokeWidth, size, color, titleStyle, showText, textInside, theme } = attrs;
  const percentStyle = {
    height: `${strokeWidth}px`,
    lineHeight: `${strokeWidth}px`,
  };

  const barStyle = {
    width: `${percent}%`,
    background: color,
    animationDuration: '3s',
  };
  /** 根据 textInside 来区分何时展示 默认slot*/
  const showDefault = (isTextInside = true) => {
    if (!(showText || slots.default)) {
      return null;
    }
    if ((isTextInside && textInside) || (!isTextInside && !textInside)) {
      return slots?.default();
    }
    return null;
  };

  return (
    <div class="progress-outer">
      <div class={`${resolveClassName(`progress-${size || 'normal'}`)} progress-bar`} style={percentStyle}>
          <div style={barStyle} class={{ 'progress-inner': true, [`${resolveClassName(`${theme}`)}`]: true }}>
          <div class="inner-text" style={titleStyle}>
            {
              showDefault()
            }
          </div>
          </div>
      </div>
      { showDefault(false) }
    </div>
  );
};

export default Line;
