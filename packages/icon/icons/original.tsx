
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
const data = JSON.parse('{"type":"element","name":"svg","attributes":{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 1024 1024","style":"width: 1em; height: 1em; vertical-align: middle;fill: currentColor;overflow: hidden;"},"elements":[{"type":"element","name":"path","attributes":{"d":"M896 176H128a64 64 0 0 0-64 64V784a64 64 0 0 0 64 64H896a64 64 0 0 0 64-64V240A64 64 0 0 0 896 176Zm0 608H128V240H896Z"}},{"type":"element","name":"path","attributes":{"d":"M327.84 649.28h52.64V373.28H337.76A97.12 97.12 0 0 1 304 417.28a150.56 150.56 0 0 1-44.8 25.6v48a182.56 182.56 0 0 0 68.16-40Z"}},{"type":"element","name":"path","attributes":{"d":"M480.64 450.24H533.28V502.88H480.64V450.24z"}},{"type":"element","name":"path","attributes":{"d":"M480.64 596.64H533.28V649.28H480.64V596.64z"}},{"type":"element","name":"path","attributes":{"d":"M669.28 649.28h52.64V373.28H679.2a97.12 97.12 0 0 1-33.28 44 150.56 150.56 0 0 1-44.8 25.6v48a182.56 182.56 0 0 0 68.16-40Z"}}]}');
const original: FunctionalComponent<IIconBaseProps> = (props, context) => {
  const p = { ...props, ...context.attrs };
  return <BkIcon {...p}  data={data} name="original"></BkIcon>;
};

original.displayName = 'original';
original.inheritAttrs = false;

export default original;
