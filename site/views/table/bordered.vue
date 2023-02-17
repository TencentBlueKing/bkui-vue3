<template>
  <div style=" width: 100%;height: 300px">
    <div style="display: flex;padding: 15px 0;align-items: center;">
      <bk-checkbox-group v-model="border">
        <bk-checkbox label="none" />
        <bk-checkbox
          label="row"
          disabled
        />
        <bk-checkbox label="col" />
        <bk-checkbox label="outer" />
        <bk-checkbox label="horizontal" />
      </bk-checkbox-group>
      <bk-button
        style="margin-left: 20px;"
        @click="()=>tableData=[]"
      >
        {{ t('清空表格数据') }}
      </bk-button>
    </div>
    <bk-table
      :columns="columns"
      :data="tableData"
      :border="border"
      :empty-text="t('暂无数据')"
    />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { DATA_COLUMNS, DATA_TABLE } from './options';
  export default defineComponent({
    components: {},
    setup() {
      const { t } = useI18n();
      return {
        tableData: [...DATA_TABLE],
        columns: [...DATA_COLUMNS],
        border: ['row'],
        t,
      };
    },
  });
</script>
