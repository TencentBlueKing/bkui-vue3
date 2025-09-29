<template>
  <div>
    <bk-tab
      v-model:active="active"
      type="card"
      sortable
    >
      <bk-tab-panel
        v-for="(item, index) in panels"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
        {{ item.label }}-{{ index }}
      </bk-tab-panel>
    </bk-tab>
  </div>
</template>
<script setup>
  import { ref } from 'vue';

  const panels = ref([
    { name: 'mission', label: '任务报表', count: 10 },
    { name: 'config', label: '加速配置', count: 20 },
    { name: 'history', label: '历史版本', count: 30 },
    { name: 'deleted', label: '已归档加速任务', count: 40 },
  ]);

  const active = ref('mission');

  const tabSort = (dragStartIndex, index) => {
    console.log(dragStartIndex, index);
  };

  const tabDrag = (index, $event) => {
    console.log(index, $event);
  };
</script>
