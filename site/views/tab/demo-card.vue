<template>
  <div>
    <div style="margin-bottom: 15px;">
      <bk-select v-model="currentType">
        <bk-option
          v-for="item in type"
          :key="item"
          :label="item"
          :value="item"
        />
      </bk-select>
    </div>
    <bk-tab
      v-model:active="active"
      :type="currentType"
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
    data() {
      return {
        panels: [
          { name: 'mission', label: '任务报表', count: 10 },
          { name: 'config', label: '加速配置', count: 20 },
          { name: 'history', label: '历史版本', count: 30 },
          { name: 'deleted', label: '已归档加速任务', count: 40 },
        ],
        active: 'mission',
        currentType: 'card',
        type: ['card', 'card-tab', 'border-card', 'unborder-card', 'vertical-card', 'card-grid'],
      };
    },
  });
</script>
