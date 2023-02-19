<template>
  <div>
    <bk-tab
      v-model:active="active"
      type="card"
      addable
      closable
      @add="addPanel"
      @remove="removePanel"
    >
      <bk-tab-panel
        v-for="(item,index) in panels"
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
    setup() {
      const panels = ref([
        { name: 'mission', label: 'Task Report', count: 10 },
        { name: 'config', label: 'Accelerated configuration', count: 20 },
        { name: 'history', label: 'Historical version', count: 30 },
        { name: 'deleted', label: 'Archived acceleration task', count: 40 },
      ]);
      const active = ref('mission');

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

      return {
        panels,
        active,
        addPanel,
        removePanel,
      };
    },
  });
</script>
