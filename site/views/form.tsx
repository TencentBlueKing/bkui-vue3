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

import {
  defineComponent,
  ref,
  onMounted,
  getCurrentInstance,
  reactive,
} from 'vue';
import BkForm, { BkFormItem } from '@bkui-vue/form';
import BkInput from '@bkui-vue/input';
import BkRadio, { BkRadioGroup } from '@bkui-vue/radio';
import BkCheckbox, { BkCheckboxGroup } from '@bkui-vue/checkbox';
import BkSelect from '@bkui-vue/select';
import BKOption from '../../packages/select/src/option';
import BkButton from '@bkui-vue/button';

export default defineComponent({
  name: 'SiteForm',
  setup() {
    const formRef = ref(null);
    const state = reactive({
      formMode: {
        name: 'asdadasdasdasdasdasdasd',
        age: 1,
      },
    });
    const currentInstance =  getCurrentInstance();
    onMounted(() => {
      console.log('print instalcen == ', currentInstance);
      console.dir(formRef.value);
      // console.log('from form mounted = ', formRef.value);
      formRef.value.validate();
    });

    return  () => (
      <div>
        <div style="margin: 20px auto;">
          <BkForm ref={formRef} model={state.formMode}>
            <BkFormItem label="姓名" maxlength={12} required property="name">
              <BkInput
                placeholder="请输入"
                clearable />
            </BkFormItem>
            <BkFormItem label="年龄" min={0} max={100} required>
              <BkRadioGroup>
                <BkRadio label="test1" disabled />
                <BkRadio label="test2" />
                <BkRadio label="test3" disabled checked />
                <BkRadio label="test4" />
                <BkRadio label="test5" checked>slosdssdst name</BkRadio>
              </BkRadioGroup>
            </BkFormItem>
            <BkFormItem label="联系方式">
              <BkCheckboxGroup>
                <BkCheckbox label="QQ" disabled falseLabel={false} />
                <BkCheckbox label="WEI XIN" disabled falseLabel={false} />
                <BkCheckbox label="EMAIL" />
              </BkCheckboxGroup>
            </BkFormItem>
            <BkFormItem label="性别">
              <BkSelect>
                <BKOption value="test" label="男"></BKOption>
                <BKOption value={false} label="女"></BKOption>
              </BkSelect>
            </BkFormItem>
            <BkFormItem label="介绍" maxlength={200}>
              <BkInput
                placeholder="请输入"
                type="paasword" />
            </BkFormItem>
            <BkFormItem>
              <BkButton theme="primary">提交</BkButton>
            </BkFormItem>
          </BkForm>
        </div>
        <div style="margin: 20px auto;">
          <BkForm
            formType="vertical">
            <BkFormItem label="姓名">
            <BkInput
              placeholder="请输入"
              clearable />
            </BkFormItem>
            <BkFormItem label="年龄">
              <BkRadioGroup>
                <BkRadio label="test1" disabled />
                <BkRadio label="test2" />
                <BkRadio label="test3" disabled checked />
                <BkRadio label="test4" />
                <BkRadio label="test5" checked>slosdssdst name</BkRadio>
              </BkRadioGroup>
            </BkFormItem>
            <BkFormItem label="联系方式">
              <BkCheckboxGroup>
                <BkCheckbox label="QQ" disabled falseLabel={false} />
                <BkCheckbox label="WEI XIN" disabled falseLabel={false} />
                <BkCheckbox label="EMAIL" />
              </BkCheckboxGroup>
            </BkFormItem>
            <BkFormItem label="性别">
              <BkSelect>
                <BKOption value="test" label="男"></BKOption>
                <BKOption value={false} label="女"></BKOption>
              </BkSelect>
            </BkFormItem>
            <BkFormItem label="介绍">
              <BkInput
                placeholder="请输入"
                type="paasword" />
            </BkFormItem>
          </BkForm>
        </div>
      </div>
    );
  },
});
