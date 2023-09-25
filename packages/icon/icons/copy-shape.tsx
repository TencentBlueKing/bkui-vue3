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
  '{"type":"element","name":"svg","attributes":{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 1024 1024","style":"width: 1em; height: 1em; vertical-align: middle;fill: currentColor;overflow: hidden;"},"elements":[{"type":"element","name":"path","attributes":{"fill-rule":"evenodd","d":"M893.3333344 96C912.4693344 96 928 111.53066656 928 130.66666656L928 754.6666656C928 773.8026656 912.4693344 789.3333344 893.3333344 789.3333344L789.3333344 789.3333344 789.3333344 893.3333344C789.3333344 912.4693344 773.8026656 928 754.6666656 928L130.66666656 928C111.53066656 928 96 912.4693344 96 893.3333344L96 269.33333344C96 250.19733344 111.53066656 234.66666656 130.66666656 234.66666656L234.66666656 234.66666656 234.66666656 130.66666656C234.66666656 111.53066656 250.19733344 96 269.33333344 96ZM720 304L165.33333344 304 165.33333344 858.6666656 720 858.6666656 720 304ZM625.454544 663.2727264L625.454544 738.9090912 247.27272736 738.9090912 247.27272736 663.2727264 625.454544 663.2727264ZM858.6666656 165.33333344L304 165.33333344 304 234.66666656 754.6666656 234.66666656C773.8026656 234.66666656 789.3333344 250.19733344 789.3333344 269.33333344L789.3333344 720 858.6666656 720 858.6666656 165.33333344ZM625.454544 549.8181824L625.454544 625.454544 247.27272736 625.454544 247.27272736 549.8181824 625.454544 549.8181824ZM625.454544 436.3636352L625.454544 512 247.27272736 512 247.27272736 436.3636352 625.454544 436.3636352Z"}}]}',
);
const copyShape: FunctionalComponent<IIconBaseProps> = (props, context) => {
  const p = { ...props, ...context.attrs };
  return (
    <BkIcon
      {...p}
      data={data}
      name='copyShape'
    ></BkIcon>
  );
};

copyShape.displayName = 'copyShape';
copyShape.inheritAttrs = false;

export default copyShape;
