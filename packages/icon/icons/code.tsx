
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
const data = JSON.parse('{"type":"element","name":"svg","attributes":{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 1024 1024","style":"width: 1em; height: 1em; vertical-align: middle;fill: currentColor;overflow: hidden;"},"elements":[{"type":"element","name":"path","attributes":{"d":"M1011.1999999999999 489.59999999999997l-224-224c-12.799999999999999-12.799999999999999-32.64-12.799999999999999-45.44 0s-12.799999999999999 32.64 0 45.44l201.59999999999997 200.95999999999998-201.59999999999997 201.59999999999997c-12.799999999999999 12.799999999999999-12.799999999999999 32.64 0 45.44 6.3999999999999995 6.3999999999999995 14.719999999999999 9.6 22.4 9.6s16.64-3.1999999999999997 22.4-9.6l224-224c12.799999999999999-12.799999999999999 12.799999999999999-33.28 0.6399999999999999-45.44z"}},{"type":"element","name":"path","attributes":{"d":"M282.24 265.59999999999997c-12.799999999999999-12.799999999999999-32.64-12.799999999999999-45.44 0l-224 224c-12.799999999999999 12.799999999999999-12.799999999999999 32.64 0 45.44l224 224c6.3999999999999995 5.76 14.719999999999999 8.959999999999999 23.04 8.959999999999999s16.64-3.1999999999999997 22.4-9.6c12.799999999999999-12.799999999999999 12.799999999999999-32.64 0-45.44l-201.59999999999997-200.95999999999998 201.59999999999997-201.59999999999997c12.159999999999998-12.159999999999998 12.159999999999998-32.64 0-44.8z"}},{"type":"element","name":"path","attributes":{"d":"M616.3199999999999 129.27999999999997c-16.64-5.119999999999999-34.56 5.119999999999999-39.04 22.4l-192 704c-4.4799999999999995 17.28 5.119999999999999 34.56 22.4 39.04 2.5599999999999996 0.6399999999999999 5.76 1.2799999999999998 8.32 1.2799999999999998 14.08 0 26.88-9.6 30.72-23.68l192-704c4.4799999999999995-16.64-5.119999999999999-34.56-22.4-39.04z"}}]}');
const code: FunctionalComponent<IIconBaseProps> = (props, context) => {
  const p = { ...props, ...context.attrs };
  return <BkIcon {...p}  data={data} name="code"></BkIcon>;
};

code.displayName = 'code';
code.inheritAttrs = false;

export default code;
