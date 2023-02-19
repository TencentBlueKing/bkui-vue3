<template>
  <div>
    <h3>Vertical Left - Base Style</h3>
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
    <h3>Vertical Right - Base Style</h3>
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
        { name: 'mission', label: 'Task Report', count: 10 },
        { name: 'config', label: 'Accelerated configuration', count: 20 },
        { name: 'history', label: 'Historical version', count: 30 },
        { name: 'deleted', label: 'Archived acceleration task', count: 40 },
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
