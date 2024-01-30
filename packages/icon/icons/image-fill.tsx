
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
const data = JSON.parse('{"type":"element","name":"svg","attributes":{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 1024 1303.273","style":"width: 1em; height: 1em; vertical-align: middle;fill: currentColor;overflow: hidden;"},"elements":[{"type":"element","name":"path","attributes":{"d":"M664.4363636363637 0C676.8000000000001 0 688.5818181818182 4.945454545454545 697.3090909090909 13.672727272727274L697.3090909090909 13.672727272727274 1010.3272727272728 326.6909090909091C1019.0545454545455 335.41818181818184 1024 347.3454545454546 1024 359.70909090909095L1024 359.70909090909095 1024 1256.7272727272727C1024 1282.4727272727273 1003.2 1303.2727272727273 977.4545454545455 1303.2727272727273L977.4545454545455 1303.2727272727273 46.54545454545455 1303.2727272727273C20.8 1303.2727272727273 0 1282.4727272727273 0 1256.7272727272727L0 1256.7272727272727 0 46.54545454545455C0 20.8 20.8 0 46.54545454545455 0L46.54545454545455 0ZM637.6727272727272 744.7272727272727L474.76363636363635 954.1818181818182 358.40000000000003 814.5454545454546 195.4909090909091 1024 847.1272727272727 1024 637.6727272727272 744.7272727272727ZM465.4545454545455 558.5454545454545C414.041856 558.5454545454545 372.3636363636364 600.2236741818182 372.3636363636364 651.6363636363636 372.3636363636364 703.0490530909091 414.041856 744.7272727272727 465.4545454545455 744.7272727272727 516.8672349090909 744.7272727272727 558.5454545454545 703.0490530909091 558.5454545454545 651.6363636363636 558.5454545454545 600.2236741818182 516.8672349090909 558.5454545454545 465.4545454545455 558.5454545454545ZM642.9090909090909 107.34545454545454L642.9090909090909 381.0909090909091 916.6545454545455 381.0909090909091 642.9090909090909 107.34545454545454Z"}}]}');
const imageFill: FunctionalComponent<IIconBaseProps> = (props, context) => {
  const p = { ...props, ...context.attrs };
  return <BkIcon {...p}  data={data} name="imageFill"></BkIcon>;
};

imageFill.displayName = 'imageFill';
imageFill.inheritAttrs = false;

export default imageFill;
