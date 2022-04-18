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
import { defineComponent } from 'vue';

import DemoBox from '../../components/demo-box';
import DemoTitle from '../../components/demo-title';
import PropsBox from '../../components/props-box';
import { IPropsTableItem } from '../../typings';

import SelectBaseDemo from './select-base-demo.vue';
import SelectGroupDemo from './select-group-demo.vue';
import SelectMultiDemo from './select-multi-demo.vue';
import SelectSearchDemo from './select-search-demo.vue';
import SelectStyleDemo from './select-style-demo.vue';

const propsJson: IPropsTableItem[] = [];
export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle name="Select 下拉选框" desc="将动作或菜单折叠到下拉菜单中，支持单选和多选" />
        <DemoBox
          title="基础用法"
          desc="基础单选"
          componentName="select"
          demoName="select-base-demo">
            <SelectBaseDemo />
        </DemoBox>
        <DemoBox
          title="尺寸 & 风格"
          desc="large、default、 small 三种尺寸，normal、simplicity两种风格"
          componentName="select"
          demoName="select-style-demo">
            <SelectStyleDemo />
        </DemoBox>
        <DemoBox
          title="多选"
          desc="支持tag形式的多选"
          componentName="select"
          demoName="select-multi-demo">
            <SelectMultiDemo />
        </DemoBox>
        <DemoBox
          title="分组"
          desc=""
          componentName="select"
          demoName="select-group-demo">
            <SelectGroupDemo />
        </DemoBox>
        <DemoBox
          title="搜索"
          desc="远程搜索和本地搜索"
          componentName="select"
          demoName="select-search-demo">
            <SelectSearchDemo />
        </DemoBox>
        <PropsBox propsData={propsJson} subtitle="" />
      </div>
    );
  },
});
