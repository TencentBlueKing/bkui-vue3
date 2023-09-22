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
  '{"type":"element","name":"svg","attributes":{"xmlns":"http://www.w3.org/2000/svg","class":"bk-icon","style":"width: 1em; height: 1em; vertical-align: middle;fill: currentColor;overflow: hidden;","overflow":"hidden","viewBox":"0 0 1024 1024"},"elements":[{"type":"element","name":"path","attributes":{"d":"M897.6 422.4c-27.2-27.2-62.4-48-100.8-57.6C768 209.6 619.2 104 462.4 131.2c-120 20.8-212.8 115.2-233.6 233.6C131.2 388.8 64 475.2 64 574.4v9.6C64 704 160 800 278.4 800H320v-64h-41.6C195.2 736 128 668.8 128 585.6v-9.6c0-83.2 67.2-150.4 150.4-150.4H288c0-3.2 0-4.8 0-8l0 0c0-1.6 0-3.2 0-4.8v-1.6c0-1.6 0-3.2 0-4.8 0 0 0 0 0-1.6 0-1.6 0-3.2 0-4.8v-1.6c0-1.6 0-3.2 0-3.2 0-1.6 0-1.6 0-3.2 0 0 0-1.6 0-1.6 1.6-9.6 3.2-20.8 6.4-30.4l0 0c30.4-120 153.6-192 272-161.6 78.4 20.8 140.8 81.6 161.6 161.6l0 0c3.2 9.6 4.8 20.8 4.8 30.4 0 0 0 1.6 0 1.6 0 0 0 1.6 0 3.2 0 1.6 0 3.2 0 3.2V400c0 1.6 0 3.2 0 3.2v1.6c0 1.6 0 3.2 0 4.8v1.6c0 1.6 0 3.2 0 4.8l0 0c0 3.2 0 4.8 0 8h9.6c83.2-1.6 152 65.6 153.6 148.8 0 1.6 0 1.6 0 3.2v9.6c0 83.2-67.2 150.4-150.4 150.4l0 0H704v64h41.6C864 800 960 704 960 585.6v-9.6C960 518.4 937.6 464 897.6 422.4z"}},{"type":"element","name":"path","attributes":{"d":"M376 603.2L420.8 648 480 588.8 480 896 544 896 544 588.8 603.2 648 648 603.2 512 467.2z"}}]}',
);
const upload: FunctionalComponent<IIconBaseProps> = (props, context) => {
  const p = { ...props, ...context.attrs };
  return (
    <BkIcon
      {...p}
      data={data}
      name='upload'
    ></BkIcon>
  );
};

upload.displayName = 'upload';
upload.inheritAttrs = false;

export default upload;
