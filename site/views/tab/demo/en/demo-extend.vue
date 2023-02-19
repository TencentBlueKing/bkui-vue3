<template>
  <div>
    <bk-tab
      v-model:active="active"
      type="card"
      addable
    >
      <template #add>
        <div @click="addPanel">
          + Add
        </div>
      </template>
      <template #setting>
        <div style="margin: 0 10px">
          Set up
        </div>
      </template>

      <bk-tab-panel
        v-for="(item,index) in panels"
        :key="item.name"
        :name="item.name"
        :label="item.label"
      >
        <template #label>
          <div>Custom tab: {{ index }}---{{ item.name }}</div>
        </template>
        <template #panel>
          <div>
            Custom content: {{ item.label }}
          </div>
        </template>
      </bk-tab-panel>
    </bk-tab>
  </div>
</template>
<script>
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    components: {},
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
  });
</script>
