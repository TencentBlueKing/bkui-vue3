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
import { defineComponent, reactive, ref, Suspense } from 'vue';
import BkCodeDiff, { ThemesUnionType, LanguagesUnionType } from '@bkui-vue/code-diff';
import { oldStr, newStr } from './demo';
import Button from '@bkui-vue/button';
import Input from '@bkui-vue/input';


export default defineComponent({
  setup() {
    const theme = ref<ThemesUnionType>('dark');
    const state = reactive({
      language: 'javascript',
      diffContext: 20,
    });
    function handleClick() {
      theme.value = theme.value === 'dark' ? 'light' : 'dark';
    }
    function handleChange(val) {
      state.diffContext = val;
    }
    function handleLanChange(val) {
      state.language = val;
    }
    return () => (
      <div style="margin: 20px">
          <Button onClick={handleClick}>Switch Theme</Button>
          <span>
            language:
            <Input modelValue={state.language} onChange={handleLanChange}></Input>
          </span>
          <span>
            context:
            <Input type='number' modelValue={state.diffContext} onChange={handleChange}></Input>
          </span>
          <Suspense>
            {{
              default: () => (
                <BkCodeDiff language={state.language as LanguagesUnionType} diffContext={state.diffContext} diffFormat='side-by-side' theme={theme.value} oldContent={oldStr} newContent={newStr} />
              ),
              fallback: () => (
                <span>loading</span>
              ),
            }}
          </Suspense>
          <BkCodeDiff diffFormat='line-by-line' language='javascript' theme='dark' oldContent={oldStr} newContent={newStr} />
      </div>
    );
  },
});
