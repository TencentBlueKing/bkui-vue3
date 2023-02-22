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
import { useI18n } from 'vue-i18n';

import BkButton from '@bkui-vue/button';
import BkCollapse from '@bkui-vue/collapse';

const { t } = useI18n();
export default defineComponent({
  name: 'SiteCollapse',
  data() {
    return {
      activeIndex: 0,
      list: [
        { name: t('方案成熟'), content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维' },
        { name: '覆盖全面', content: '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。' },
        { name: '开放平台', content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。' },
      ],
    };
  },
  render() {
    return <div style="padding: 24px; text-align: left;">
      <BkButton onClick={() => {
        this.activeIndex = 1;
      }}>重置ActiveIndex</BkButton>
      <BkCollapse list={this.list} activeIndex={this.activeIndex}>
      </BkCollapse>
    </div>;
  },
});
