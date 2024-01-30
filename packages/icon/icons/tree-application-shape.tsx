
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
const data = JSON.parse('{"type":"element","name":"svg","attributes":{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 1024 1024","style":"width: 1em; height: 1em; vertical-align: middle;fill: currentColor;overflow: hidden;"},"elements":[{"type":"element","name":"path","attributes":{"d":"M432.64 576h156.79999999999998l-79.36-260.48-77.44 260.48z"}},{"type":"element","name":"path","attributes":{"d":"M512 0c-282.75199999999995 0-512 229.248-512 512s229.248 512 512 512c282.75199999999995 0 512-229.248 512-512s-229.248-512-512-512zM681.5999999999999 768h-9.6c-0.042666666666666665 0-0.128 0-0.21333333333333332 0-14.250666666666667 0-26.325333333333333-9.301333333333332-30.464-22.186666666666667l-32.04266666666666-105.81333333333333h-192l-33.28 105.6c-4.1386666666666665 13.994666666666667-16.896 24.02133333333333-32 24.02133333333333-18.389333333333333 0-33.32266666666666-14.933333333333332-33.32266666666666-33.32266666666666 0-3.328 0.46933333333333327-6.485333333333333 1.3653333333333333-9.514666666666667l133.07733333333334-429.82399999999996c9.813333333333333-23.552 32.64-39.808 59.263999999999996-39.808 24.917333333333332 0 46.464 14.208 57.04533333333333 34.986666666666665l134.57066666666665 434.304c1.152 3.157333333333333 1.792 6.784 1.792 10.581333333333333 0 14.890666666666664-10.197333333333333 27.434666666666665-23.97866666666667 30.976z"}}]}');
const treeApplicationShape: FunctionalComponent<IIconBaseProps> = (props, context) => {
  const p = { ...props, ...context.attrs };
  return <BkIcon {...p}  data={data} name="treeApplicationShape"></BkIcon>;
};

treeApplicationShape.displayName = 'treeApplicationShape';
treeApplicationShape.inheritAttrs = false;

export default treeApplicationShape;
