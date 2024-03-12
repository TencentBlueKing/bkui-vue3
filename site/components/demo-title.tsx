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
/*
import { Share } from '@bkui-vue/icon';
*/
import { defineComponent } from 'vue';

import { Share } from '@bkui-vue/icon';

import './demo-title.less';

export default defineComponent({
  name: 'DemoTitile',
  props: {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      default: '',
    },
    npmLink: {
      type: String,
      default: '',
    },
    designLink: {
      type: String,
      default: '',
    },
  },
  setup() {
    // const { name } = useRoute();
    return {
      // name,
    };
  },
  render() {
    return (
      <div class='demo-title'>
        <div class='title-name'>
          {this.name}
          {this.designLink && (
            <a
              class='design-link'
              href={this.designLink}
              target='_blank'
            >
              设计规范
            </a>
          )}
        </div>
        <div class='title-desc'>
          {this.desc}
          {this.npmLink && (
            <a
              class='desc-link'
              href={this.npmLink}
            >
              <Share />
              详细使用
            </a>
          )}
        </div>
      </div>
    );
  },
});
