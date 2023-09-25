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
  '{"type":"element","name":"svg","attributes":{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 1024 1024","style":"width: 1em; height: 1em; vertical-align: middle;fill: currentColor;overflow: hidden;"},"elements":[{"type":"element","name":"path","attributes":{"fill-rule":"evenodd","d":"M917.3054336 379.3934816L644.6573792 106.73362144C637.7657728 99.8360144 628.4074144 95.97271648 618.6572192 96.00014496 608.907024 95.9727168 599.5486656 99.83601472 592.6570624 106.73362144L414.3999776 285.12322784C400.878272 283.59955936 387.280576 282.8495008 373.6733312 282.8767168 290.62998816 282.75079488 210.03082048 310.9734656 145.20474176 362.8774656 137.06031008 369.4172128 132.08090848 379.1118912 131.50944128 389.5416192 130.93797408 399.9713472 134.82836032 410.1520608 142.20952352 417.5425632L343.2635456 618.6052896 104.89409664 856.7354464C101.9839264 859.6325248 100.18706144 863.4620736 99.81886624 867.5519776L96.07484352 908.7380128C95.61805984 913.6831328 97.26692416 918.5917248 100.61644608 922.258144 103.965968 925.9245632 108.70579808 928.009104 113.6717504 927.9997952 114.21255392 927.9997952 114.7533568 927.9997952 115.33576 927.8749568L156.52001024 924.1307712C160.61522176 923.7512992 164.44531456 921.9392928 167.3360768 919.0137184L405.6639264 680.6755552 606.7179456 881.7382784C613.609552 888.6358848 622.9679104 892.499184 632.7181056 892.4716096 643.863968 892.4975552 654.4145248 887.4440928 661.3806784 878.7429312 722.0359616 802.8571424 749.9831616 705.9433792 739.048352 609.4112352L917.3054336 431.1464352C931.5648544 416.8423648 931.5648544 393.697552 917.3054336 379.3934816ZM682.5968096 553.290064L655.5150432 580.4146048 659.6750688 618.4804832C666.2790656 677.3604736 654.5399008 736.8434208 626.062064 788.7992896L235.3940896 397.8647936C287.29906432 369.2916992 346.7919936 357.532144 405.6639264 364.2087328L443.7281568 368.4105408 470.8515232 341.3276032 618.7820192 193.39069952 830.6521088 405.2699584 682.5968096 553.3316672 682.5968096 553.290064Z"}}]}',
);
const fixLine: FunctionalComponent<IIconBaseProps> = (props, context) => {
  const p = { ...props, ...context.attrs };
  return (
    <BkIcon
      {...p}
      data={data}
      name='fixLine'
    ></BkIcon>
  );
};

fixLine.displayName = 'fixLine';
fixLine.inheritAttrs = false;

export default fixLine;
