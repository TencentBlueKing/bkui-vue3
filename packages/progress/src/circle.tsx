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

/** 环形进度和仪表盘 */
const Circle = (_: any, { attrs, slots }) => {
  const { resolveClassName } = usePrefix();
  const { width, percent, strokeWidth, color, strokeLinecap, theme, type, bgColor, titleStyle } = attrs;
  const circleStrokeWidth = strokeWidth || 6;

  const circleSize = width || 126;

  const circleStyle = {
    width: typeof circleSize === 'number' ? `${circleSize}px` : circleSize,
    height: typeof circleSize === 'number' ? `${circleSize}px` : circleSize,
    fontSize: `${circleSize * 0.15 + 6}px`,
  };

  const radius = 50 - circleStrokeWidth / 2;

  const isDashboard = type === 'dashboard';

  /** 总度数 */
  const len = Math.PI * 2 * radius;

  /** 绘制长度 */
  const rate = (isDashboard && 0.75) || 1;

  /** stroke偏移 */
  const strokeDashoffset = `${(-1 * len * (1 - rate)) / 2}px`;

  const transition = 'stroke-dasharray 0.6s ease 0s, stroke 0.6s ease';
  /** 底色样式 */
  const trailStyle = {
    strokeDasharray: `${len * rate}px, ${len}px`,
    strokeDashoffset,
  };
  /** 路径样式 */
  const pathStyle = {
    strokeDasharray: `${len * rate * (percent / 100)}px, ${len}px`,
    strokeDashoffset,
    transition,
  };
  /** 绘制路径 */
  const path = `
    M 50 50
    m 0 ${isDashboard ? '' : '-'}${radius}
    a ${radius} ${radius} 0 1 1 0 ${isDashboard ? '-' : ''}${radius * 2}
    a ${radius} ${radius} 0 1 1 0 ${isDashboard ? '' : '-'}${radius * 2}
  `;
  /** 底色 */
  const progressCircleTrail = {
    d: path,
    stroke: bgColor || '#f5f5f5',
    'stroke-linecap': strokeLinecap,
    'stroke-width': circleStrokeWidth,
    'fill-opacity': '0',
    class: 'process-circle-trail',
    style: trailStyle,
  };
  /** 路径 */
  const progressCirclePath = {
    d: path,
    stroke: color || '#13ce66',
    'stroke-linecap': strokeLinecap,
    'stroke-width': (percent > 0 && circleStrokeWidth) || 0,
    'fill-opacity': '0',
    class: `process-circle-path ${resolveClassName(`${theme}-circle-trail`)}`,
    style: pathStyle,
  };

  return (
    <div
      class='progress-outer-circle'
      style={circleStyle}
    >
      <svg viewBox='0 0 100 100'>
        <path {...progressCircleTrail} />
        <path {...progressCirclePath} />
      </svg>
      <span
        class='progress-circle-text'
        style={titleStyle}
      >
        {slots?.default()}
      </span>
    </div>
  );
};

export default Circle;
