
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
const data = JSON.parse('{"type":"element","name":"svg","attributes":{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 1024 1024","style":"width: 1em; height: 1em; vertical-align: middle;fill: currentColor;overflow: hidden;"},"elements":[{"type":"element","name":"path","attributes":{"d":"M608 512A96 96 0 0 1 512 608 96 96 0 0 1 416 512 96 96 0 0 1 608 512z"}},{"type":"element","name":"path","attributes":{"d":"M860.8 558.4c4.8-30.4 4.8-62.4 0-92.8l67.2-57.6c9.6-8 14.4-22.4 9.6-35.2-19.2-59.2-51.2-115.2-92.8-161.6-6.4-6.4-14.4-11.2-24-11.2-3.2 0-8 0-11.2 1.6l-83.2 30.4c-24-19.2-52.8-35.2-81.6-46.4l-16-86.4c-1.6-12.8-12.8-22.4-25.6-25.6-60.8-12.8-124.8-12.8-185.6 0-12.8 3.2-22.4 12.8-24 25.6l-16 86.4c-28.8 11.2-56 27.2-81.6 46.4l-83.2-30.4c-3.2-1.6-6.4-1.6-11.2-1.6-9.6 0-17.6 3.2-24 11.2-41.6 46.4-73.6 100.8-92.8 161.6-4.8 12.8 0 27.2 9.6 35.2l67.2 57.6C160 496 160 528 163.2 558.4L96 616c-9.6 8-14.4 22.4-9.6 35.2 19.2 59.2 51.2 115.2 92.8 161.6 6.4 6.4 14.4 11.2 24 11.2 3.2 0 8 0 11.2-1.6l83.2-30.4c24 19.2 52.8 35.2 81.6 46.4l16 86.4c1.6 12.8 12.8 22.4 25.6 25.6 60.8 12.8 124.8 12.8 185.6 0 12.8-3.2 22.4-12.8 25.6-25.6l16-86.4c28.8-11.2 56-27.2 81.6-46.4l83.2 30.4c3.2 1.6 6.4 1.6 11.2 1.6 9.6 0 17.6-3.2 24-11.2 41.6-46.4 73.6-100.8 92.8-161.6 3.2-12.8 0-27.2-11.2-35.2L860.8 558.4zM512 672c-88 0-160-72-160-160s72-160 160-160 160 72 160 160S600 672 512 672z"}}]}');
const cogShape: FunctionalComponent<IIconBaseProps> = (props, context) => {
  const p = { ...props, ...context.attrs };
  return <BkIcon {...p}  data={data} name="cogShape"></BkIcon>;
};

cogShape.displayName = 'cogShape';
cogShape.inheritAttrs = false;

export default cogShape;
