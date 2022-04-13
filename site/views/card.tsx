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

import BkCard from '@bkui-vue/card';
import { Help, HelpDocumentFill, HelpFill } from '@bkui-vue/icon';

export default defineComponent({
  name: 'SiteCard',
  setup() {
    return {
    };
  },
  render() {
    const cardSlots = {
      default: () => <div>
        <p>卡片内容 1</p>
        <p>卡片内容 2</p>
        <p>卡片内容 3</p></div>,
      footer: () => <div style="background: #fafbfd;">
        <span class="card-foot-icon"><HelpDocumentFill /></span>
        <span class="card-foot-icon"><Help /></span>
        <span class="card-foot-icon"><HelpFill /></span>
      </div>,
    };
    return (
      <div style="width: 80%; margin: 0 auto; background: #f5f7fa; padding: 30px">
        <div style="width: 400px; display: inline-block;" class="mr40">
          <BkCard title="Card卡片标题">
            <p>卡片内容 1</p>
            <p>卡片内容 2</p>
            <p>卡片内容 3</p>
          </BkCard>
        </div>
        <div style="width: 400px; display: inline-block;">
          <BkCard title="Card卡片标题" class="mr40" showFooter={true} showHeader={false}>
            {cardSlots}
          </BkCard>
        </div>
      </div>
    );
  },
});
