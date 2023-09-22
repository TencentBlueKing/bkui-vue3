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
  '{"type":"element","name":"svg","attributes":{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 1024 1303.273","style":"width: 1em; height: 1em; vertical-align: middle;fill: currentColor;overflow: hidden;"},"elements":[{"type":"element","name":"path","attributes":{"fill-rule":"evenodd","d":"M664.4363636363636 0C676.8 0 688.5818181818182 4.945454545454554 697.3090909090909 13.67272727272728L697.3090909090909 13.67272727272728 1010.3272727272728 326.69090909090914C1019.0545454545455 335.41818181818184 1024 347.3454545454546 1024 359.70909090909095L1024 359.70909090909095 1024 1256.7272727272727C1024 1282.4727272727273 1003.2 1303.2727272727273 977.4545454545455 1303.2727272727273L977.4545454545455 1303.2727272727273 46.54545454545455 1303.2727272727273C20.80000000000002 1303.2727272727273 0 1282.4727272727273 0 1256.7272727272727L0 1256.7272727272727 0 46.54545454545455C0 20.799999999999997 20.80000000000002 0 46.54545454545455 0L46.54545454545455 0ZM397.1878772363637 614.0514816000001L397.1878772363637 848.3380922181818C397.1878772363637 912.7669108363636 440.14042298181823 936.1955746909091 494.8073006545455 901.0525835636363L650.9983744 797.5759965090909C703.7128610909091 758.5282280727272 703.7128610909091 699.9565730909092 650.9983744 664.8135819636365L494.8073006545455 561.3369949090909C442.0928139636364 526.1940037818182 397.1878772363637 549.6226676363636 397.1878772363637 614.0514816000001ZM642.9090909090909 107.34545454545456L642.9090909090909 381.0909090909091 916.6545454545455 381.0909090909091 642.9090909090909 107.34545454545456Z"}}]}',
);
const videoFill: FunctionalComponent<IIconBaseProps> = (props, context) => {
  const p = { ...props, ...context.attrs };
  return (
    <BkIcon
      {...p}
      data={data}
      name='videoFill'
    ></BkIcon>
  );
};

videoFill.displayName = 'videoFill';
videoFill.inheritAttrs = false;

export default videoFill;
