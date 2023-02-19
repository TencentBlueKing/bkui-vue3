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
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    components: {},
    setup() {
      const { t } = useI18n();
      const active = ref('mission');
      const panels = ref([
        { name: 'mission', label: t('任务报表'), count: 10 },
        { name: 'config', label: t('加速配置'), count: 20 },
        { name: 'history', label: t('历史版本'), count: 30 },
        { name: 'deleted', label: t('已归档加速任务'), count: 40 },
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
        t,
      };
    },
  });
</script>
