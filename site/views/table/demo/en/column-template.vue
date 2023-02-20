<template>
  <div class="row">
    <bk-table
      :data="tableData"
      :settings="settings"
      :empty-text="'No data'"
      border="horizontal"
    >
      <bk-table-column
        :label="'SN'"
        type="index"
        sort
        :width="80"
      />
      <bk-table-column
        :label="'Name/Intranet IP'"
        prop="ip"
      >
        <template #default="props">
          {{ props?.row.ip }}
        </template>
      </bk-table-column>
      <bk-table-column
        :label="'Source'"
        prop="source"
      />
      <bk-table-column
        :label="'Create time'"
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
              label: 'SN',
              field: 'index',
              disabled: true,
            },
            {
              label: '/Name/Intranet IP',
              field: 'ip',
            },
            {
              label: 'Source',
              field: 'source',
            },
            {
              label: 'Create time',
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

