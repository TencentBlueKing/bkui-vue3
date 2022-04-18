<template>
  <div>
    <h3>垂直居左-基础样式</h3>
    <bk-tab
      v-model:active="active"
      type="card"
      tab-position="left"
    >
      <bk-tab-panel
        v-for="(item,index) in panels"
        key="index"
        :name="item.name"
        :label="item.label"
      >
        {{ item.label }}-{{ index }}
      </bk-tab-panel>
    </bk-tab>
    <h3>垂直居右-基础样式</h3>
    <bk-tab
      v-model:active="active"
      type="card"
      tab-position="right"
    >
      <bk-tab-panel
        v-for="(item,index) in panels"
        key="index"
        :name="item.name"
        :label="item.label"
      >
        {{ item.label }}-{{ index }}
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
