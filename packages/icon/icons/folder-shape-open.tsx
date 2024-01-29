
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
const data = JSON.parse('{"type":"element","name":"svg","attributes":{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 1024 1024","style":"width: 1em; height: 1em; vertical-align: middle;fill: currentColor;overflow: hidden;"},"elements":[{"type":"element","name":"path","attributes":{"d":"M202.24 421.11999999999995c1.792-56.23466666666667 47.78666666666667-101.12 104.27733333333333-101.12 0.46933333333333327 0 0.9386666666666665 0 1.408 0l568.2346666666666 0c0.17066666666666666 0 0.38399999999999995 0 0.5973333333333333 0 7.082666666666666 0 12.799999999999999-5.717333333333333 12.799999999999999-12.799999999999999 0-1.3653333333333333-0.21333333333333332-2.6879999999999997-0.6399999999999999-3.925333333333333-21.205333333333332-65.024-81.40799999999999-111.27466666666666-152.40533333333332-111.27466666666666-0.17066666666666666 0-0.38399999999999995 0-0.5546666666666666 0h-287.9573333333333v-32c0-53.034666666666666-42.96533333333333-96-96-96h-256c-53.034666666666666 0-96 42.96533333333333-96 96v640c0 0.9813333333333333-0.042666666666666665 2.0906666666666665-0.042666666666666665 3.2426666666666666 0 77.056 54.44266666666667 141.39733333333334 126.976 156.58666666666664 0.896-1.92 0.8106666666666666-4.394666666666666 0.8106666666666666-6.8693333333333335s0.08533333333333333-4.949333333333334 0.256-7.381333333333332z"}},{"type":"element","name":"path","attributes":{"d":"M960 384h-652.16c-22.954666666666668 0-41.599999999999994 18.645333333333333-41.599999999999994 41.599999999999994l-74.24 521.5999999999999c-0.42666666666666664 1.92-0.6399999999999999 4.1386666666666665-0.6399999999999999 6.3999999999999995s0.256 4.4799999999999995 0.6826666666666666 6.613333333333333l703.9573333333333-0.21333333333333332c35.327999999999996 0 64-28.672 64-64l64-448c0-35.327999999999996-28.672-64-64-64z"}}]}');
const folderShapeOpen: FunctionalComponent<IIconBaseProps> = (props, context) => {
  const p = { ...props, ...context.attrs };
  return <BkIcon {...p}  data={data} name="folderShapeOpen"></BkIcon>;
};

folderShapeOpen.displayName = 'folderShapeOpen';
folderShapeOpen.inheritAttrs = false;

export default folderShapeOpen;
