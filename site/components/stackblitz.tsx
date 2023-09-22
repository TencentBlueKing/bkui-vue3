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
import { defineComponent, ref } from 'vue';

// import { PlayShape } from 'bkui-vue/lib/icon';
import { PlayShape } from '@bkui-vue/icon';

import {
  htmlContent,
  mainJsContent,
  packageJSONContent,
  stackblitzRc,
  styleContent,
  viteConfigContent,
} from './content';

export default defineComponent({
  name: 'Stackblitz',
  props: {
    code: String,
  },
  setup() {
    const data = {
      htmlContent,
      mainJsContent,
      styleContent,
      stackblitzRc,
      viteConfigContent,
      packageJSONContent,
    };

    const formRef = ref(null);

    const submit = () => {
      formRef.value.submit();
    };

    return { ...data, formRef, submit };
  },
  render() {
    return (
      <form
        ref='formRef'
        method='post'
        action='https://stackblitz.com/run'
        target='_blank'
        onClick={this.submit}
      >
        <input
          type='hidden'
          name='project[files][src/demo.vue]'
          value={this.code}
        />
        <input
          type='hidden'
          name='project[files][src/index.css]'
          value={this.styleContent}
        />
        <input
          type='hidden'
          name='project[files][src/main.js]'
          value={this.mainJsContent}
        />
        <input
          type='hidden'
          name='project[files][index.html]'
          value={this.htmlContent}
        />
        <input
          type='hidden'
          name='project[files][package.json]'
          value={this.packageJSONContent}
        />
        <input
          type='hidden'
          name='project[files][vite.config.js]'
          value={this.viteConfigContent}
        />
        <input
          type='hidden'
          name='project[files][.stackblitzrc]'
          value={this.stackblitzRc}
        />
        <input
          type='hidden'
          name='project[template]'
          value='node'
        />

        <div class='action-online'>
          <PlayShape />
        </div>
      </form>
    );
  },
});
