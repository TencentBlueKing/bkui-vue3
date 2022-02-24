
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
const data = JSON.parse('{"type":"element","name":"svg","attributes":{"xmlns":"http://www.w3.org/2000/svg","class":"bk-icon","style":"width: 1em; height: 1em; vertical-align: middle;fill: currentColor;overflow: hidden;","overflow":"hidden","viewBox":"0 0 1024 1024"},"elements":[{"type":"element","name":"path","attributes":{"d":"M512 64A448 448 0 1 1 64 512 448 448 0 0 1 512 64ZM493.92 402.56a156 156 0 0 0-77.12 42.24c-24.32 22.88 1.44 44 16 27.52a82.56 82.56 0 0 1 40.48-28.16c11.04-2.24 17.6 1.28 19.36 10.4A118.88 118.88 0 0 1 488.16 496q-7.2 29.76-26.4 93.92-34.72 116.32-30.08 140.8a54.72 54.72 0 0 0 28.8 40.96 88 88 0 0 0 58.4 5.12 161.76 161.76 0 0 0 80-45.44c25.76-24.96-3.52-43.04-17.28-28a76.32 76.32 0 0 1-39.36 26.08c-14.24 2.88-22.72-2.4-25.28-16A104.96 104.96 0 0 1 522.88 672Q582.24 469.12 576 439.84a46.24 46.24 0 0 0-25.6-33.6A89.6 89.6 0 0 0 493.92 402.56Zm67.84-39.84A49.92 49.92 0 1 0 512 312.96 49.76 49.76 0 0 0 561.76 362.72Z"}}]}');
const info: FunctionalComponent<IIconBaseProps> = (props, context) => {
  const p = { ...props, ...context.attrs };
  return <BkIcon {...p}  data={data} name="info"></BkIcon>;
};

info.displayName = 'info';
info.inheritAttrs = false;

export default info;
