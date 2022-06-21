<template>
  <div>
    <bk-tab
      v-model:active="active"
      type="card"
      addable
    >
      <template #add>
        <div @click="addPanel">
          + 新增
        </div>
      </template>
      <template #setting>
        <div style="margin: 0 10px">
          设置
        </div>
      </template>

      <bk-tab-panel
        v-for="(item,index) in panels"
        :key="item.name"
        :name="item.name"
        :label="item.label"
      >
        <template #label>
          <div>自定义标签：{{ index }}---{{ item.name }}</div>
        </template>
        <template #panel>
          <div>自定义内容:{{ item.label }}</div>
        </template>
      </bk-tab-panel>
    </bk-tab>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  export default defineComponent({
    components: {},
    data() {
      return {
        panels: [
          { name: 'mission', label: '任务报表', count: 10 },
          { name: 'config', label: '加速配置', count: 20 },
          { name: 'history', label: '历史版本', count: 30 },
          { name: 'deleted', label: '已归档加速任务', count: 40 },
        ],
        active: 'mission',
      };
    },
    methods: {
      tabChange(name) {
        console.log(name);
      },
      changeActive(name) {
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
  });
</script>
