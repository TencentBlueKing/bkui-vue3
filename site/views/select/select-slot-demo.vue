<template>
  <div class="demo">
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      filterable
      multiple
      show-select-all
      multiple-mode="tag"
      collapse-tags
      :placeholder="t('请选择')"
      :search-placeholder="t('请输入关键字')"
      :no-data-text="t('无数据')"
      :no-match-text="t('无匹配数据')"
      :loading-text="t('加载中...')"
      :select-all-text="t('全部')"
    >
      <bk-option
        v-for="(item, index) in dataSource"
        :key="index"
        :value="item.value"
        :label="item.label"
      />
      <template #tag="{selected}">
        {{ selected.map(item => `${item.label}( ${item.value} )`).join('；') }}
      </template>
    </bk-select>
  </div>
</template>
<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  export default defineComponent({
    setup() {
      const { t } = useI18n();
      const dataSource = ref([
        {
          value: 1,
          label: t('爬山'),
        },
        {
          value: 2,
          label: t('跑步'),
        },
        {
          value: 3,
          label: t('未知'),
        },
        {
          value: 4,
          label: t('健身'),
        },
        {
          value: 5,
          label: t('骑车'),
        },
        {
          value: 6,
          label: t('跳舞'),
        },
      ]);
      const selectedValue = ref([1, 2, 3, 4]);
      return {
        dataSource,
        selectedValue,
        t,
      };
    },
  });
</script>
<style scoped>
.demo {
  display: flex;
}

.bk-select {
  width: 300px;
  margin-right: 20px;
}
</style>

