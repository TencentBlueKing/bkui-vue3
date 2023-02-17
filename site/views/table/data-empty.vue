<template>
  <div>
    <h3>{{ t("空数据") }}</h3>
    <div style="width: 100%; height: 300px">
      <bk-table
        :empty-text="t('没有数据')"
        :columns="columns"
        :data="[]"
      />
    </div>
    <h3>{{ t("过滤为空-试试过滤来源为 Email") }}</h3>
    <div style="width: 100%; height: 300px">
      <bk-table
        :empty-text="t('暂无数据')"
        :border="['outer']"
        :columns="columns"
        :data="tableData"
      />
    </div>
    <h3>{{ t("自定义空数据-empty插槽") }}</h3>
    <div style="width: 100%; height: 300px">
      <bk-table
        :columns="columns"
        :data="[]"
      >
        <template #empty>
          <div :style="emptyTextStyle">
            EMPTY
          </div>
        </template>
      </bk-table>
    </div>
  </div>
</template>

<script>
  import { computed, defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { DATA_COLUMNS, DATA_TABLE } from './options';
  export default defineComponent({
    components: {},
    setup() {
      const { t } = useI18n();

      const emptyTextStyle = computed(() => 'width: 100%; height: 100px; display: flex; justify-content: center; align-items: center; font-size: 30px;');

      return {
        emptyTextStyle,
        activeRowInfo: {},
        columns: [...DATA_COLUMNS],
        tableData: [...DATA_TABLE],
        t,
      };
    },
  });
</script>
