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

import { BKTab, BKTabPanel } from '@bkui-vue/tab';
import { CogShape } from '@bkui-vue/icon/';

export default defineComponent({
  name: 'TabDemo',
  methods: {
    tabChange(name: string) {
      console.log(name);
    },
    changeActive(name: string) {
      this.active = name;
    },
    addPanel() {
      const name = Math.random().toString(16)
        .substring(4, 10);
      this.panels.push({
        name,
        label: `新标签页-${name.substring(0, 4)}`,
        count: 50,
      });
      this.active = name;
    },
    removePanel(index, panel) {
      console.log(panel);
      this.panels.splice(index, 1);
    },
    tabSort(dragStartIndex, index) {
      console.log(dragStartIndex, index);
    },
    tabDrag(index, $event) {
      console.log(index, $event);
    },
  },
  setup() {
    const active = ref('mission');
    const panels = ref([
      { name: 'mission', label: '任务报表', count: 10 },
      { name: 'config', label: '加速配置', count: 20 },
      { name: 'history', label: '历史版本', count: 30 },
      { name: 'deleted', label: '已归档加速任务', count: 40 },
    ]);
    return {
      active,
      panels,
    };
  },
  render() {
    const slots = {
      add: () => (
        <div onClick={this.addPanel}> +&nbsp;新增</div>
      ),
      setting: () => (
        <div><CogShape/></div>
      ),
    };
    const panels = this.panels.map((item, index) => (
      <BKTabPanel
        key={index}
        name={item.name} label={item.label}
      >{item.label}-{index}</BKTabPanel>
    ));
    return (
      <div style='text-align:left;'>
        <div class='mt40'>
          <h2>基础用法</h2>
          <div class='mb20'>基础的、简洁的标签页。</div>
          <BKTab
            type='unborder-card'
            addable
            v-slots={slots}
            sortable
            onChange={this.tabChange}
            v-model={[this.active, 'active']}>
            {panels}
          </BKTab>
          <button class='mt20' onClick={() => this.changeActive('history')}> 更改为：history</button>
        </div>
        <div class='mt40'>
          <h2>选项卡样式</h2>
          <div class='mb20'>基础的、简洁的标签页。</div>
          <BKTab
            type='card'
            addable
            closable
            v-slots={slots}
            onAdd={this.addPanel}
            onRemove={this.removePanel}
            v-model={[this.active, 'active']}>
            {panels}
          </BKTab>
        </div>
        <div class='mt40'>
          <h2>卡片样式</h2>
          <div class='mb20'>基础的、简洁的标签页。</div>
          <BKTab type='border-card' addable onAdd={this.addPanel} v-model={[this.active, 'active']}>
            {panels}
          </BKTab>
        </div>
        <div class='mt40'>
          <h2>垂直居左-基础样式</h2>
          <div class='mb20'>left</div>
          <BKTab
            addable
            onAdd={this.addPanel}
            tabPosition='left'
            v-model={[this.active, 'active']}>
            {panels}
          </BKTab>
        </div>
        <div class='mt40'>
          <h2>垂直居右-基础样式</h2>
          <div class='mb20'>right</div>
          <BKTab
            addable
            onAdd={this.addPanel}
            tabPosition='right' v-model={[this.active, 'active']}>
            {panels}
          </BKTab>
        </div>
        <div class='mt40'>
          <h2>拖动</h2>
          <div class='mb20'>排序</div>
          <BKTab
            addable
            onAdd={this.addPanel}
            sortable
            v-model={[this.active, 'active']}>
            {this.panels.map((item, index) => (
              <BKTabPanel
                key={index} name={item.name} label={item.label}
                v-slots={{
                  label: () => (<div>{index}---{item.name}</div>),
                  panel: () => (<div>tab内容：{index}---{item.name}</div>),
                }}/>
            ))}
          </BKTab>
        </div>
        <div class='mt40'>
          <h2>自定义内容</h2>
          <div class='mb20'>slot用法</div>
          <BKTab
            addable
            onAdd={this.addPanel}
            v-model={[this.active, 'active']}>
            {this.panels.map((item, index) => (
              <BKTabPanel
                key={index} name={item.name} label={item.label}
                v-slots={{
                  label: () => (<div>{index}---{item.name}</div>),
                  panel: () => (<div>tab内容：{index}---{item.name}</div>),
                }}/>
            ))}
          </BKTab>
        </div>
      </div>
    );
  },
});
