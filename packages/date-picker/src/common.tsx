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

export const dateIcon = (
  <>
    <svg
      class='picker-icon'
      x='0px'
      y='0px'
      viewBox='0 0 1024 1024'
    >
      <g id='date'>
        <path
          fill='#c4c6cc'
          d='M896,128h-96v64h64v112H160V192h64v-64h-96c-17.7,0-32,14.3-32,32v736c0,17.7,14.3,32,32,32h768c17.7,0,32-14.3,32-32V160C928,142.3,913.7,128,896,128z M160,864V368h704v496H160z'
        />
        <rect
          x='416'
          y='128'
          fill='#c4c6cc'
          width='192'
          height='64'
        />
        <rect
          x='288'
          y='96'
          fill='#c4c6cc'
          width='64'
          height='128'
        />
        <rect
          x='672'
          y='96'
          fill='#c4c6cc'
          width='64'
          height='128'
        />
        <polygon
          fill='#c4c6cc'
          points='403.7,514.4 557.1,514.4 557.1,515.3 420.1,765.5 483.5,765.5 620.3,504.3 620.3,466.5 403.7,466.5'
        />
      </g>
    </svg>
  </>
);

export const timeIcon = (
  <>
    <svg
      class='picker-icon'
      x='0px'
      y='0px'
      viewBox='0 0 1024 1024'
    >
      <g id='time'>
        <path
          fill='#c4c6cc'
          d='M512,128c51.9,0,102.2,10.1,149.5,30.2c45.7,19.3,86.8,47,122.1,82.3s63,76.4,82.3,122.1c20,47.3,30.2,97.6,30.2,149.5S886,614.3,865.9,661.6c-19.3,45.7-47,86.8-82.3,122.1s-76.4,63-122.1,82.3c-47.3,20-97.6,30.2-149.5,30.2S409.8,886.1,362.5,866c-45.7-19.3-86.8-47-122.1-82.3s-63-76.4-82.3-122.1c-20-47.3-30.2-97.6-30.2-149.5s10.1-102.2,30.2-149.5c19.3-45.7,47-86.8,82.3-122.1s76.4-63,122.1-82.3C409.8,138.1,460.1,128,512,128 M512,64C264.6,64,64,264.6,64,512s200.6,448,448,448s448-200.6,448-448S759.4,64,512,64L512,64z'
        />
        <polygon
          fill='#c4c6cc'
          points='512,512 512,256 448,256 448,512 448,576 512,576 768,576 768,512'
        />
      </g>
    </svg>
  </>
);
