/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) is licensed under the MIT License.
 *
 * License for 蓝鲸智云PaaS平台 (BlueKing PaaS):
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

import { number, string } from 'vue-types';

import { ElementType, PropTypes, stringEnum } from '@bkui-vue/shared';

import type { ExtractPropTypes } from 'vue';

export const LANGUAGES = [
  'css',
  'java',
  'javascript',
  'json',
  'scss',
  'less',
  'stylus',
  'shell',
  'bash',
  'cpp',
  'go',
  'xml',
  'python',
  'typescript',
  'sql',
  'ruby',
  'vim',
  'php',
  'perl',
  'powershell',
  'makefile',
] as const;

const diffFormats = ['side-by-side', 'line-by-line'] as const;
const CodeDiffFormat = stringEnum([...diffFormats]);
export type DiffFormatType = ElementType<typeof diffFormats>;

export type LanguagesUnion = ElementType<typeof LANGUAGES>;

const themes = ['dark', 'light'] as const;
export type ThemesUnion = ElementType<typeof themes>;

export const props = {
  oldContent: string().def(''),
  newContent: string().def(''),
  diffFormat: string<DiffFormatType>().def(CodeDiffFormat['line-by-line']),
  diffContext: number(),
  // conf: Object as PropType<Diff2Html.Diff2HtmlUIConfig>,
  theme: string<ThemesUnion>().def('light'),
  language: string<LanguagesUnion>().def('javascript'),
  hljs: PropTypes.any.isRequired,
};

export type CodeDiffProps = ExtractPropTypes<typeof props>;
