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
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';
import { defineComponent, ref, watch } from 'vue';

import './code-box.less';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('xml', xml);
// hljs.addPlugin({
//   'after:highlight': (result) => {
//     console.error('highlighthighlighthighlight');
//     console.error(result);
//     result.value = result.value
//       .replace('&lt;template&gt;', '<span class="hljs-name">&lt;template&gt;</span>');
//   },
// });
export default defineComponent({
  name: 'CodeBox',
  props: {
    code: String,
    language: {
      type: String,
      default: 'html',
    },
  },
  render(props) {
    const code = ref('');
    watch(
      () => props.language,
      () => {
        code.value = hljs.highlight(this.code, {
          language: props.language,
          ignoreIllegals: true,
        }).value;
      },
      { immediate: true },
    );

    return (
      <div class='markdown-body code-box'>
        <pre class='hljs'>
          <code innerHTML={code.value} />
        </pre>
      </div>
    );
  },
});
