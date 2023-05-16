<template>
  <div style="background: #F5F7FA;padding: 10px 20px;">
    <bk-tab
      v-model:active="active"
      type="card-grid"
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
  });
</script>
