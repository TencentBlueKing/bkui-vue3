
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
const data = JSON.parse('{"type":"element","name":"svg","attributes":{"xmlns":"http://www.w3.org/2000/svg","class":"icon","viewBox":"0 0 1024 1024","style":"width: 1em; height: 1em; vertical-align: middle;fill: currentColor;overflow: hidden;"},"elements":[{"type":"element","name":"path","attributes":{"d":"M981.333333 1024H42.666667a42.666667 42.666667 0 0 1-42.666667-42.666667V42.666667a42.666667 42.666667 0 0 1 42.666667-42.666667h341.333333a42.666667 42.666667 0 0 1 0 85.333333H85.333333v853.333334h853.333334V618.666667a42.666667 42.666667 0 0 1 85.333333 0v362.666666a42.666667 42.666667 0 0 1-42.666667 42.666667z m0-576a42.666667 42.666667 0 0 1-42.666666-42.666667V152.746667L315.306667 796.8a48 48 0 0 1-67.2 0 47.36 47.36 0 0 1 0-66.133333L871.893333 85.333333H640a42.666667 42.666667 0 0 1 0-85.333333h341.333333a42.666667 42.666667 0 0 1 42.666667 42.666667v362.666666a42.666667 42.666667 0 0 1-42.666667 42.666667z"}}]}');
const share: FunctionalComponent<IIconBaseProps> = (props, context) => {
  const p = { ...props, ...context.attrs };
  return <BkIcon {...p}  data={data} name="share"></BkIcon>;
};

share.displayName = 'share';
share.inheritAttrs = false;

export default share;
