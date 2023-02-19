<template>
  <div>
    <bk-tab
      v-model:active="active"
      type="border-card"
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
    setup() {
      const panels = ref([
        { name: 'mission', label: 'Task Report', count: 10 },
        { name: 'config', label: 'Accelerated configuration', count: 20 },
        { name: 'history', label: 'Historical version', count: 30 },
        { name: 'deleted', label: 'Archived acceleration task', count: 40 },
      ]);

      const active = ref('mission');

      return {
        panels,
        active,
      };
    },
  });
</script>
