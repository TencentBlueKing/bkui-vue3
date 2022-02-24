
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
const data = JSON.parse('{"type":"element","name":"svg","attributes":{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 1024 1024","style":"width: 1em; height: 1em; vertical-align: middle;fill: currentColor;overflow: hidden;"},"elements":[{"type":"element","name":"path","attributes":{"d":"M500.16 304a355.04 355.04 0 0 1 128 24.8l48-48.96a426.08 426.08 0 0 0-176-39.84v64Z"}},{"type":"element","name":"path","attributes":{"d":"M763.2 328.8l-46.08 46.08a822.24 822.24 0 0 1 160 138.88 807.52 807.52 0 0 1-86.88 85.12C723.84 654.24 620.48 720 502.56 720a331.52 331.52 0 0 1-111.04-19.52l-49.44 49.28a402.4 402.4 0 0 0 160 34.24C768 784 960 512 960 512A962.56 962.56 0 0 0 763.2 328.8Z"}},{"type":"element","name":"path","attributes":{"d":"M254.88 701.12l46.08-46.08a706.56 706.56 0 0 1-156.64-144C197.44 442.88 328.16 304 500.16 304V240h0C234.72 240 64 512 64 512A838.72 838.72 0 0 0 254.88 701.12Z"}},{"type":"element","name":"path","attributes":{"d":"M512 640a128 128 0 0 0 110.24-192.96L888 181.28A32 32 0 1 0 842.72 136L576.96 401.76a128 128 0 0 0-176 176L136 842.72a32 32 0 1 0 45.28 45.28L447.04 622.24A128 128 0 0 0 512 640Zm64-128a64 64 0 0 1-64 64 60.96 60.96 0 0 1-16-2.4L573.6 496A60.96 60.96 0 0 1 576 512Zm-64-64a60.96 60.96 0 0 1 16 2.4L450.4 528A60.96 60.96 0 0 1 448 512 64 64 0 0 1 512 448Z"}}]}');
const unvisible: FunctionalComponent<IIconBaseProps> = (props, context) => {
  const p = { ...props, ...context.attrs };
  return <BkIcon {...p}  data={data} name="unvisible"></BkIcon>;
};

unvisible.displayName = 'unvisible';
unvisible.inheritAttrs = false;

export default unvisible;
