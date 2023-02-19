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

import { CogShape } from '@bkui-vue/icon/';
import { BkTab, BkTabPanel } from '@bkui-vue/tab';

export default defineComponent({
  name: 'TabDemo',
  components: {
    BkTab,
    BkTabPanel,
  },
  setup() {
    const active = ref('mission');
    const panels = ref([
      { name: 'mission', label: 'Task Report', count: 10 },
      { name: 'config', label: 'Accelerated configuration', count: 20 },
      { name: 'history', label: 'Historical version', count: 30 },
      { name: 'deleted', label: 'Archived acceleration task', count: 40 },
    ]);

    const tabChange = (name) => {
      console.log(name);
    };

    const changeActive = (name) => {
      active.value = name;
    };

    const addPanel = () => {
      const name = Math.random().toString(16)
        .substring(4, 10);
      panels.value.push({
        name,
        label: `New tab-${name.substring(0, 4)}`,
        count: 50,
      });
      active.value = name;
    };

    const removePanel = (index, panel) => {
      console.log(panel);
      panels.value.splice(index, 1);
    };

    const tabSort = (dragStartIndex, index) => {
      console.log(dragStartIndex, index);
    };

    const tabDrag = (index, $event) => {
      console.log(index, $event);
    };


    return {
      active,
      panels,
      tabChange,
      changeActive,
      addPanel,
      removePanel,
      tabSort,
      tabDrag,
    };
  },

  render() {
    const slots = {
      add: () => (
        <div onClick={this.addPanel}> +&nbsp;新增</div>
      ),
      setting: () => (
        <div style="margin: 0 10px"><CogShape/></div>
      ),
    };
    const panels = this.panels.map((item, index) => (
      <BkTabPanel
        key={index}
        name={item.name} label={item.label}
      >{item.label}-{index}</BkTabPanel>
    ));
    return (
      <div style='text-align:left;'>
        <div class='mt40'>
          <h2>Basic Usage</h2>
          <div class='mb20'>Basic and concise tabs.</div>
          <BkTab
            type='unborder-card'
            v-model={[this.active, 'active']}>
            {panels}
          </BkTab>
          <button class='mt20' onClick={() => this.changeActive('history')}>Change to: history</button>
        </div>
        <div class='mt40'>
          <h2>Tab Style</h2>
          <div class='mb20'>Basic and concise tabs.</div>
          <BkTab
            type='card'
            v-model={[this.active, 'active']}>
            {panels}
          </BkTab>
        </div>
        <div class='mt40'>
          <h2>Card Style</h2>
          <div class='mb20'>Basic and concise tabs.</div>
          <BkTab
            type='border-card'
            v-model={[this.active, 'active']}>
            {panels}
          </BkTab>
        </div>
        <div class='mt40'>
          <h2>Vertical Left - Base Style</h2>
          <div class='mb20'>left</div>
          <BkTab
            tabPosition='left'
            v-model={[this.active, 'active']}>
            {panels}
          </BkTab>
        </div>
        <div class='mt40'>
          <h2>Vertical Right - Base Style</h2>
          <div class='mb20'>right</div>
          <BkTab
            onAdd={this.addPanel}
            tabPosition='right' v-model={[this.active, 'active']}>
            {panels}
          </BkTab>
        </div>
        <div class='mt40'>
          <h2>Drag</h2>
          <div class='mb20'>Sort</div>
          <BkTab
            sortable
            v-model={[this.active, 'active']}>
            {panels}
          </BkTab>
        </div>
        <div class='mt40'>
          <h2>Custom content</h2>
          <div class='mb20'>Slot usage</div>
          <BkTab
            addable
            closable
            v-slots={slots}
            onAdd={this.addPanel}
            v-model={[this.active, 'active']}>
               {this.panels.map((item, index) => (
              <BkTabPanel
                key={index} name={item.name} label={item.label}
                v-slots={{
                  label: () => (<div>{index}---{item.name}</div>),
                  panel: () => (<div>Tab content: {index}---{item.name}</div>),
                }}/>
               ))}
          </BkTab>
        </div>
      </div>
    );
  },
});
