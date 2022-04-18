
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
const data = JSON.parse('{"type":"element","name":"svg","attributes":{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 1024 1024","style":"width: 1em; height: 1em; vertical-align: middle;fill: currentColor;overflow: hidden;"},"elements":[{"type":"element","name":"path","attributes":{"d":"M928 320h-35.199999999999996c-15.402666666666665-73.55733333333333-79.744-128-156.75733333333332-128 0 0-0.042666666666666665 0-0.042666666666666665 0h-288v-32c0-53.034666666666666-42.96533333333333-96-96-96h-256c-53.034666666666666 0-96 42.96533333333333-96 96v640c0 88.36266666666667 71.63733333333333 160 160 160h704c0.38399999999999995 0 0.8533333333333333 0 1.3226666666666667 0 51.199999999999996 0 92.88533333333334-40.61866666666666 94.67733333333332-91.34933333333333l64-452.65066666666667c0-53.034666666666666-42.96533333333333-96-96-96zM64 800v-640c0-17.663999999999998 14.336-32 32-32h256c17.663999999999998 0 32 14.336 32 32v64c0 17.663999999999998 14.336 32 32 32h320c41.42933333333333 0.128 76.71466666666666 26.496 90.02666666666666 63.31733333333333l-538.0266666666666 0.6826666666666666c-0.38399999999999995 0-0.8533333333333333 0-1.3226666666666667 0-51.199999999999996 0-92.88533333333334 40.61866666666666-94.67733333333332 91.34933333333333l-64 452.65066666666667c0.128 9.856 1.7493333333333334 19.328 4.650666666666666 28.202666666666666-39.97866666666667-12.842666666666666-68.47999999999999-49.151999999999994-68.65066666666667-92.16zM896 864c0 17.663999999999998-14.336 32-32 32h-640c-0.08533333333333333 0-0.21333333333333332 0-0.29866666666666664 0-16.08533333333333 0-29.39733333333333-11.861333333333334-31.658666666666665-27.349333333333334l64-452.65066666666667c0-17.663999999999998 14.336-32 32-32h640c0.08533333333333333 0 0.21333333333333332 0 0.29866666666666664 0 16.08533333333333 0 29.39733333333333 11.861333333333334 31.658666666666665 27.349333333333334z"}}]}');
const folderOpen: FunctionalComponent<IIconBaseProps> = (props, context) => {
  const p = { ...props, ...context.attrs };
  return <BkIcon {...p}  data={data} name="folderOpen"></BkIcon>;
};

folderOpen.displayName = 'folderOpen';
folderOpen.inheritAttrs = false;

export default folderOpen;
