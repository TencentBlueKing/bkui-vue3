
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
const data = JSON.parse('{"type":"element","name":"svg","attributes":{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 1024 1024","style":"width: 1em; height: 1em; vertical-align: middle;fill: currentColor;overflow: hidden;"},"elements":[{"type":"element","name":"path","attributes":{"d":"M332.8 243.2c25.6 25.6 25.6 64 0 89.6-25.6 25.6-64 25.6-89.6 0L217.6 307.2 198.4 288c-25.6-25.6-25.6-64 0-89.6s64-25.6 89.6 0l25.6 25.6L332.8 243.2z","opacity":".1"}},{"type":"element","name":"path","attributes":{"d":"M192 448c38.4 0 64 25.6 64 64S230.4 576 192 576H160 128C89.6 576 64 550.4 64 512s25.6-64 64-64h32H192z","opacity":".15"}},{"type":"element","name":"path","attributes":{"d":"M243.2 691.2c25.6-25.6 64-25.6 89.6 0 25.6 25.6 25.6 64 0 89.6l-25.6 25.6L281.6 832c-25.6 25.6-64 25.6-89.6 0s-25.6-64 0-89.6l25.6-25.6L243.2 691.2z","opacity":".3"}},{"type":"element","name":"path","attributes":{"d":"M448 832c0-38.4 25.6-64 64-64s64 25.6 64 64v32V896c0 38.4-25.6 64-64 64s-64-25.6-64-64v-32V832z","opacity":".45"}},{"type":"element","name":"path","attributes":{"d":"M825.6 825.6c-25.6 25.6-64 25.6-89.6 0l-25.6-25.6 0 0-25.6-25.6c-25.6-25.6-25.6-64 0-89.6s64-25.6 89.6 0l25.6 25.6 25.6 25.6 0 0C851.2 761.6 851.2 806.4 825.6 825.6z","opacity":".6"}},{"type":"element","name":"path","attributes":{"d":"M896 448l-32 128H832c-38.4 0-64-25.6-64-64s25.6-64 64-64H896zM960 512c0 38.4-25.6 64-64 64h-32L896 448C934.4 448 960 473.6 960 512z","opacity":".75"}},{"type":"element","name":"path","attributes":{"d":"M742.4 192c25.6-19.2 64-19.2 83.2 6.4 25.6 25.6 25.6 64 0 89.6l-25.6 25.6-25.6 25.6c-25.6 25.6-64 25.6-89.6 0s-25.6-64 0-89.6","opacity":".9"}},{"type":"element","name":"path","attributes":{"d":"M448 160L576 192c0 38.4-25.6 64-64 64S448 230.4 448 192V160zM512 64c38.4 0 64 25.6 64 64v32H448V128C448 89.6 473.6 64 512 64zM448 160h128V192H448V160z"}}]}');
const loading: FunctionalComponent<IIconBaseProps> = (props, context) => {
  const p = { ...props, ...context.attrs };
  return <BkIcon {...p}  data={data} name="loading"></BkIcon>;
};

loading.displayName = 'loading';
loading.inheritAttrs = false;

export default loading;
