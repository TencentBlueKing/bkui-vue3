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
import hljs from 'highlight.js';
import { defineComponent, onMounted, reactive, ref, Suspense } from 'vue';

import Button from '@bkui-vue/button';
import BkCodeDiff, { LanguagesUnionType, ThemesUnionType } from '@bkui-vue/code-diff';
import Input from '@bkui-vue/input';

import { NEW_STR, OLD_STR } from './demo';

/**
 * 动态引入语法包
 * [string] language
 */
function languageDynamicImport(language) {
  switch (language) {
    case 'css':
      return import('highlight.js/lib/languages/css');
    case 'java':
      return import('highlight.js/lib/languages/java');
    case 'javascript':
      return import('highlight.js/lib/languages/javascript');
    case 'json':
      return import('highlight.js/lib/languages/json');
    case 'scss':
      return import('highlight.js/lib/languages/scss');
    case 'less':
      return import('highlight.js/lib/languages/less');
    case 'stylus':
      return import('highlight.js/lib/languages/stylus');
    case 'shell':
      return import('highlight.js/lib/languages/shell');
    case 'bash':
      return import('highlight.js/lib/languages/bash');
    case 'cpp':
      return import('highlight.js/lib/languages/cpp');
    case 'go':
      return import('highlight.js/lib/languages/go');
    case 'xml':
      return import('highlight.js/lib/languages/xml');
    case 'python':
      return import('highlight.js/lib/languages/python');
    case 'typescript':
      return import('highlight.js/lib/languages/typescript');
    case 'sql':
      return import('highlight.js/lib/languages/sql');
    case 'ruby':
      return import('highlight.js/lib/languages/ruby');
    case 'vim':
      return import('highlight.js/lib/languages/vim');
    case 'php':
      return import('highlight.js/lib/languages/php');
    case 'perl':
      return import('highlight.js/lib/languages/perl');
    case 'powershell':
      return import('highlight.js/lib/languages/powershell');
    case 'makefile':
      return import('highlight.js/lib/languages/makefile');
  }
}

export default defineComponent({
  setup() {
    const theme = ref<ThemesUnionType>('dark');
    const languageModuleMap = ref({});
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
    onMounted(async () => {
      let languageModule = languageModuleMap.value[state.language];
      if (languageModule === undefined) {
        const mod = await languageDynamicImport(state.language);
        languageModule = mod.default;

        languageModuleMap.value = {
          ...languageModuleMap.value,
          language: languageModule,
        };
      }
      hljs.registerLanguage(state.language, languageModule);
    });
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
                <BkCodeDiff hljs={hljs} language={state.language as LanguagesUnionType} diffContext={state.diffContext} diffFormat='side-by-side' theme={theme.value} oldContent={OLD_STR} newContent={NEW_STR} />
              ),
              fallback: () => (
                <span>loading</span>
              ),
            }}
          </Suspense>
          <BkCodeDiff hljs={hljs} diffFormat='line-by-line' language='javascript' theme='dark' oldContent={OLD_STR} newContent={NEW_STR} />
      </div>
    );
  },
});
