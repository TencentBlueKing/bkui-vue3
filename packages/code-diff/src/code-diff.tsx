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

import { defineComponent, ExtractPropTypes, ref, nextTick, computed, onMounted, watch } from 'vue';
import * as Diff2Html from 'diff2html';
import { createPatch } from 'diff';
import hljs from 'highlight.js';

import { number, string } from 'vue-types';
import { classes, ElementType, stringEnum } from '@bkui-vue/shared';

const diffFormats = ['side-by-side', 'line-by-line'] as const;
const CodeDiffFormat = stringEnum([...diffFormats]);
export type DiffFormatType = ElementType<typeof diffFormats>;

export const LANGUAGES = [
  'css', 'java', 'javascript', 'json', 'scss', 'less', 'stylus', 'shell', 'bash', 'cpp', 'go', 'xml', 'python', 'typescript', 'sql', 'ruby', 'vim', 'php', 'perl', 'powershell', 'makefile',
] as const;
export type LanguagesUnion = ElementType<typeof LANGUAGES>;

const themes = ['dark', 'light'] as const;
const themesEnum = stringEnum([...themes]);
export type ThemesUnion = ElementType<typeof themes>;

export const codeDiffProps = {
  oldContent: string().def(''),
  newContent: string().def(''),
  diffFormat: string<DiffFormatType>().def(CodeDiffFormat['line-by-line']),
  diffContext: number(),
  // conf: Object as PropType<Diff2Html.Diff2HtmlUIConfig>,
  theme: string<ThemesUnion>().def('light'),
  language: string<LanguagesUnion>().def('javascript'),

};

// TODO: 感觉像是highlight.js的问题, 一些关键字无法显示高亮
function changeCodeCls(htmlStr: string, lang): string {
  return htmlStr.replace(/d2h-code-line-ctn/g, $1 => `${$1} lang-${lang}`);
}

export type CodeDiffPropsType = ExtractPropTypes<typeof codeDiffProps>;

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
  name: 'BkCodeDiff',
  props: codeDiffProps,
  emits: [],
  setup(props) {
    const diffBox = ref(null);
    const diffHtml = ref('');
    const diffBoxCls = computed(() => classes({
      dark: props.theme === themesEnum.dark,
    }, 'hljs bk-code-diff'));
    const languageModuleMap = ref({});

    /**
     * 高亮语法节点
     */
    function highlightElement() {
      nextTick(() => {
        if (diffBox.value) {
          diffBox.value.querySelectorAll(`.lang-${props.language}`).forEach((item) => {
            hljs.highlightElement(item);
          });
        }
      });
    }
    /**
     * 动态生成对应的HTML字符串
     * @param diffContext 不同地方间隔多少行不隐藏
     * @param language 语法类型
     */
    async function generateDiffHTML(diffContext, language) {
      let languageModule = languageModuleMap.value[language];
      if (languageModule === undefined) {
        const mod = await languageDynamicImport(props.language);
        languageModule = mod.default;

        languageModuleMap.value = {
          ...languageModuleMap.value,
          language: languageModule,
        };
      }
      const dd = createPatch(
        '',
        props.oldContent,
        props.newContent,
        '',
        '',
        {
          context: diffContext,
        },
      );

      hljs.registerLanguage(language, languageModule);
      hljs.configure({
        languages: [language],
        ignoreUnescapedHTML: true,
      });
      diffHtml.value = changeCodeCls(Diff2Html.html(dd, {
        drawFileList: false,
        matching: 'lines',
        outputFormat: props.diffFormat,
      }), language);
    }

    onMounted(async () => {
      await Promise.all([
        generateDiffHTML(props.diffContext, props.language),
        import('diff2html/bundles/css/diff2html.min.css'),
      ]);

      highlightElement();
    });

    watch(() => [props.diffContext, props.language], async (newVal) => {
      const [newContext, newLanguage] = newVal;
      await generateDiffHTML(newContext, newLanguage);
      highlightElement();
    });

    return () => (
      <div ref={diffBox} class={diffBoxCls.value} v-html={diffHtml.value}></div>
    );
  },
});
