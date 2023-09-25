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
  '{"type":"element","name":"svg","attributes":{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 1024 1024","style":"width: 1em; height: 1em; vertical-align: middle;fill: currentColor;overflow: hidden;"},"elements":[{"type":"element","name":"path","attributes":{"fill-rule":"evenodd","d":"M618.6572192 96.00014496C628.4074144 95.97271648 637.7657728 99.83601536 644.6573792 106.73362368L917.3054336 379.3935424C931.5648544 393.697616 931.5648544 416.842432 917.3054336 431.1465056L739.048352 609.411344C749.9831616 705.9435072 722.0359616 802.8572896 661.3806784 878.7430976 654.4145248 887.4442592 643.863968 892.4977216 632.7181056 892.471776 622.9679104 892.4993504 613.609552 888.6360544 606.7179456 881.7384448L405.6639264 680.6756768 167.3360768 919.0138912C164.44531456 921.9394656 160.61522176 923.751472 156.52001024 924.1309472L115.33576 927.8751328C114.7533568 928.000144 114.21255392 928.000144 113.6717504 928.000144 108.70579808 928.00928 103.965968 925.9247392 100.61644608 922.2583168 97.26692416 918.5918976 95.61805984 913.6833056 96.07484352 908.7381824L99.81886624 867.5521408C100.18706144 863.4622368 101.9839264 859.6326848 104.89409664 856.7356064L343.2635456 618.6053984 142.20952352 417.5426336C134.82836032 410.152128 130.93797408 399.9714112 131.50944128 389.54168 132.08090848 379.111952 137.06031008 369.4172704 145.20474176 362.8775232 210.03082048 310.97351104 290.62998816 282.75083392 373.6733312 282.87675616 387.280576 282.84954016 400.878272 283.59959872 414.3999776 285.12326752L592.6570624 106.73362368C599.5486656 99.83601568 608.907024 95.9727168 618.6572192 96.00014496Z"}}]}',
);
const fixShape: FunctionalComponent<IIconBaseProps> = (props, context) => {
  const p = { ...props, ...context.attrs };
  return (
    <BkIcon
      {...p}
      data={data}
      name='fixShape'
    ></BkIcon>
  );
};

fixShape.displayName = 'fixShape';
fixShape.inheritAttrs = false;

export default fixShape;
