<template>
  <div>
    <bk-tab
      v-model:active="active"
      type="card"
      sortable
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
    components: {},
    setup() {
      const active = ref('mission');
      const panels = ref([
        { name: 'mission', label: 'Task Report', count: 10 },
        { name: 'config', label: 'Accelerated configuration', count: 20 },
        { name: 'history', label: 'Historical version', count: 30 },
        { name: 'deleted', label: 'Archived acceleration task', count: 40 },
      ]);

      const tabSort = (dragStartIndex, index) => {
        console.log(dragStartIndex, index);
      };

      const tabDrag = (index, $event) => {
        console.log(index, $event);
      };

      return {
        active,
        panels,
        tabSort,
        tabDrag,
      };
    },
  });
</script>
