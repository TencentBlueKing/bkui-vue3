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
  '{"type":"element","name":"svg","attributes":{"xmlns":"http://www.w3.org/2000/svg","class":"bk-icon","style":"width: 1em; height: 1em; vertical-align: middle;fill: currentColor;overflow: hidden;","overflow":"hidden","viewBox":"0 0 1024 1024"},"elements":[{"type":"element","name":"path","attributes":{"d":"M512 128c212.8 0 384 171.2 384 384S724.8 896 512 896 128 724.8 128 512 299.2 128 512 128M512 64C264 64 64 264 64 512s200 448 448 448 448-200 448-448S760 64 512 64z"}},{"type":"element","name":"path","attributes":{"d":"M548.8 673.6A48 48 0 0 1 500.8 721.6 48 48 0 0 1 452.8 673.6 48 48 0 0 1 548.8 673.6z"}},{"type":"element","name":"path","attributes":{"d":"M513.6 302.4c80 0 132.8 44.8 132.8 110.4 0 41.6-20.8 72-60.8 96-40 24-48 35.2-48 62.4v14.4H464v-16c-3.2-44.8 11.2-70.4 51.2-92.8 36.8-22.4 48-35.2 48-60.8s-20.8-44.8-52.8-44.8c-28.8-1.6-52.8 19.2-56 48 0 1.6 0 1.6 0 3.2h-76.8C377.6 352 427.2 302.4 513.6 302.4z"}}]}',
);
const help: FunctionalComponent<IIconBaseProps> = (props, context) => {
  const p = { ...props, ...context.attrs };
  return (
    <BkIcon
      {...p}
      data={data}
      name='help'
    ></BkIcon>
  );
};

help.displayName = 'help';
help.inheritAttrs = false;

export default help;
