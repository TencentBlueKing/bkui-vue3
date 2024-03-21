
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
const data = JSON.parse('{"type":"element","name":"svg","attributes":{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 1024 1024","style":"width: 1em; height: 1em; vertical-align: middle;fill: currentColor;overflow: hidden;"},"elements":[{"type":"element","name":"path","attributes":{"d":"M896 64C966.692448 64 1024 121.307552 1024 192L1024 857.7635776C1024 928.4560256 966.692448 985.7635776 896 985.7635776L128 985.7635776C57.307552 985.7635776 5.7233980032e-14 928.4560256 0 857.7635776L0 192C-2.286818272e-14 121.307552 57.307552 64 128 64L896 64ZM408.94568768 320.00000064L102.2364224 320.00000064 102.2364224 729.7635776 204.47284416 729.7635776 204.47284416 576.00000064 306.70926592 576.00000064 306.70926592 729.7635776 408.94568768 729.7635776 408.94568768 320.00000064ZM562.70926528 320.00000064L460.47284416 320.00000064 460.47284416 729.7635776 664.9456896 729.7635776 664.9456896 678.2364224 562.70926528 678.2364224 562.70926528 320.00000064ZM818.7092672 320.00000064L716.4728448 320.00000064 716.4728448 729.7635776 920.9456896 729.7635776 920.9456896 678.2364224 818.7092672 678.2364224 818.7092672 320.00000064ZM306.70926464 396.8L306.70926464 499.03642176 204.47284352 499.03642176 204.47284352 396.8 306.70926464 396.8Z"}}]}');
const textAll: FunctionalComponent<IIconBaseProps> = (props, context) => {
  const p = { ...props, ...context.attrs };
  return <BkIcon {...p}  data={data} name="textAll"></BkIcon>;
};

textAll.displayName = 'textAll';
textAll.inheritAttrs = false;

export default textAll;
