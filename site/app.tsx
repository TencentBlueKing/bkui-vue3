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
import { RouterView } from 'vue-router';

import header from '@blueking/magicbox-header/index.vue';

// import { provideGlobalConfig } from '../packages/bkui-vue/index';
import DemoNav from './components/demo-nav';

import './app.less';

export default defineComponent({
  name: 'App',
  components: {
    'app-header': header,
  },
  // setup() {
  //   provideGlobalConfig({
  //     prefix: 'aabb',
  //   });
  // },
  render() {
    return (
      <div class='page-container'>
        {/* <bk-config-provider prefix={'aabb'}> */}
        <div class='page-container-header'>
          <app-header
            rootDomain='tencent.com'
            loginUrl='https://login.bk.tencent.com'
            avatarHost='https://q1.qlogo.cn'
            lessCodeUrl='https://github.com/TencentBlueKing/bk-lesscode/blob/master/readme.md'
            designUrl='https://bkdesign.bk.tencent.com/'
            region='tencent'
          ></app-header>
        </div>
        <div class='page-container-body'>
          <div class='body-nav'>
            <DemoNav />
          </div>
          <div class='body-wrapper'>
            <RouterView />
          </div>
        </div>
        {/* </bk-config-provider> */}
      </div>
    );
  },
});
