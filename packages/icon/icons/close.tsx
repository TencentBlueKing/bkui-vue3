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
import { FunctionalComponent } from 'vue';

import BkIcon, { IIconBaseProps } from './icon';
const data = JSON.parse(
  '{"type":"element","name":"svg","attributes":{"xmlns":"http://www.w3.org/2000/svg","class":"bk-icon","style":"width: 1em; height: 1em; vertical-align: middle;fill: currentColor;overflow: hidden;","overflow":"hidden","viewBox":"0 0 1024 1024"},"elements":[{"type":"element","name":"path","attributes":{"d":"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zM670.4 625.1l-45.3 45.3L512 557.3 398.9 670.4l-45.3-45.3L466.7 512 353.6 398.9l45.3-45.3L512 466.7l113.1-113.1 45.3 45.3L557.3 512 670.4 625.1z"}}]}',
);
const close: FunctionalComponent<IIconBaseProps> = (props, context) => {
  const p = { ...props, ...context.attrs };
  return (
    <BkIcon
      {...p}
      data={data}
      name='close'
    ></BkIcon>
  );
};

close.displayName = 'close';
close.inheritAttrs = false;

export default close;
