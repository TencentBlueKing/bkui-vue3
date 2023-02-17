<template>
  <bk-select
    v-model="selectedValue"
    class="bk-select"
    filterable
    multiple
    allow-create
    multiple-mode="tag"
    show-select-all
  >
    <bk-option
      v-for="(item, index) in dataSource"
      :key="index"
      :value="item.value"
      :label="item.label"
      :disabled="item.disabled"
    />
  </bk-select>
</template>

<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  export default defineComponent({
    setup() {
      const { t } = useI18n();
      const dataSource = ref([
        {
          value: 'climbing',
          label: t('爬山'),
        },
        {
          value: 'running',
          label: t('跑步'),
        },
        {
          value: 'unknow',
          label: t('未知'),
        },
        {
          value: 'fitness',
          label: t('健身'),
        },
        {
          value: 'bike',
          label: t('骑车'),
        },
        {
          value: 'dancing',
          label: t('跳舞'),
        },
        {
          value: 'sleep',
          label: t('睡觉'),
        },
      ]);
      const selectedValue = ref('running');
      const handleToggle = (value) => {
        console.log(value);
      };
      return {
        dataSource,
        selectedValue,
        handleToggle,
        t,
      };
    },
  });
</script>
<style scoped>
.bk-select {
  width: 300px;
}
</style>

