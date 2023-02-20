<template>
  <div class="row">
    <bk-table
      :data="tableData"
      :settings="settings"
      :empty-text="'暂无数据'"
      border="horizontal"
    >
      <bk-table-column
        :label="'序号'"
        type="index"
        sort
        :width="80"
      />
      <bk-table-column
        :label="'名称/内网IP'"
        prop="ip"
      >
        <template #default="props">
          {{ props?.row.ip }}
        </template>
      </bk-table-column>
      <bk-table-column
        :label="'来源'"
        prop="source"
      />
      <bk-table-column
        :label="'创建时间'"
        prop="create_time"
      />
    </bk-table>
  </div>
</template>

<script>
  import { defineComponent, onMounted, reactive } from 'vue';

  import { DATA_COLUMNS, DATA_TABLE } from '../../options';
  export default defineComponent({
    setup() {
      const settings = reactive({
        fields: [],
        checked: [],
      });

      const handleSortBy = (...arg) => {
        console.log('handleSortBy', arg);
      };

      const handleDblClick = (...args) => {
        console.log(args);
      };

      onMounted(() => {
        setTimeout(() => {
          settings.checked.push('index');
          settings.fields.push(...[
            {
              label: '序号',
              field: 'index',
              disabled: true,
            },
            {
              label: '名称/内网IP',
              field: 'ip',
            },
            {
              label: '来源',
              field: 'source',
            },
            {
              label: '创建时间',
              field: 'create_time',
            },
          ]);
        }, 1000);
      });

      return {
        tableData: [...DATA_TABLE],
        columns: [...DATA_COLUMNS],
        settings,
        handleSortBy,
        handleDblClick,
      };
    },
    methods: {

    },
  });
</script>
<style scoped>
  .row {
    display: flex;
    width: 100%;
  }

  .cell {
    flex: 1;
    margin: 0 5px 0 5px;
  }
  </style>

