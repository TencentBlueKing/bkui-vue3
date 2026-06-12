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

// 组件公共依赖（编译时作为外部依赖处理，映射到全局变量名）
export const externals = {
  vue: 'vue',
  lodash: 'lodash',
  uuid: 'uuid',
  'lodash/throttle': 'lodashThrottle',
  'lodash/merge': 'lodashMerge',
  'lodash/cloneDeep': 'lodashCloneDeep',
  'lodash/isElement': 'lodashIsElement',
  'lodash/random': 'lodashRandom',
  'lodash/debounce': 'lodashDebounce',
  'lodash/isFunction': 'lodashIsFunction',
  'lodash/get': 'lodashGet',
  'lodash/isDate': 'lodashIsDate',
  'lodash/isEmpty': 'lodashIsEmpty',
  'lodash/isEqual': 'lodashIsEqual',
  'lodash/isNumber': 'lodashIsNumber',
  'lodash/trim': 'lodashTrim',
  'lodash/has': 'lodashHas',
  'vue-types': 'vueTypes',
  'normalize-wheel': 'normalizeWheel',
  'js-calendar': 'jsCalendar',
  'date-fns': 'dateFns',
  'resize-observer-polyfill': 'resizeObserverPolyfill',
  clipboard: 'clipboard',
  'json-formatter-js': 'jsonFormatterJs',
  tinycolor2: 'tinycolor2',
  dompurify: 'dompurify',
  'spark-md5': 'sparkMd5',
  diff: 'diff',
  diff2html: 'diff2html',
  'diff2html/bundles/css/diff2html.min.css': '_code_diff_src_diff2html_bundles_css_diff2html_min_css',
  '@popperjs/core': 'popperjsCore',
  '@floating-ui/dom': 'floatingUiDom',
  '@blueking/fork-resize-detector': 'forkResizeDetector',
  '@floating-ui/vue': 'floatingUiVue',
};
