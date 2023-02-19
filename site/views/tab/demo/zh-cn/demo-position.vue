<template>
  <div>
    <h3>垂直居左-基础样式</h3>
    <bk-tab
      v-model:active="active"
      type="card"
      tab-position="left"
    >
      <bk-tab-panel
        v-for="(item, index) in panels"
        :key="item.name"
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
        v-for="(item, index) in panels"
        :key="item.name"
        :name="item.name"
        :label="item.label"
      >
        {{ item.label }}-{{ index }}
      </bk-tab-panel>
    </bk-tab>
  </div>
</template>
<script>
  import { defineComponent, ref } from 'vue';
  export default defineComponent({
    components: {},
    setup() {
      const panels = ref([
        { name: 'mission', label: '任务报表', count: 10 },
        { name: 'config', label: '加速配置', count: 20 },
        { name: 'history', label: '历史版本', count: 30 },
        { name: 'deleted', label: '已归档加速任务', count: 40 },
      ]);
      const active = ref('mission');

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
          label: `新标签页-${name.substring(0, 4)}`,
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
        removePanel,
        tabChange,
        tabDrag,
        tabSort,
        addPanel,
        changeActive,
      };
    },
  });
</script>
