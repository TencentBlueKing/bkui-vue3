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

import BkCascader from '@bkui-vue/cascader';

export default defineComponent({
  name: 'SiteAnimateNumber',
  data() {
    return {
      list: [
        {
          id: 'hunan',
          name: '湖南',
          disabled: true,
          children: [
            {
              id: 'changsha',
              name: '长沙',
            },
            {
              id: 'yueyang',
              name: '岳阳',
              disabled: true,
            },
          ],
        }, {
          id: 'guangxi',
          name: '广西',
        }, {
          id: 'yunnan',
          name: '云南',
          children: [
            {
              id: 'kunming',
              name: '昆明',
              children: [
                {
                  id: 'wuhuaqu',
                  name: '五华区',
                },
                {
                  id: 'guanduqu',
                  name: '官渡区',
                },
                {
                  id: 'xishanqu',
                  name: '西山区',
                },
              ],
            },
            {
              id: 0,
              name: '大理',
            },
            {
              id: 'yuxi',
              name: '玉溪',
            },
          ],
        },
      ],
      area: [],
    };
  },
  render() {
    return <>
      <BkCascader v-model={this.area} list={this.list} check-any-level trigger="hover" />
      </>;
  },
});
