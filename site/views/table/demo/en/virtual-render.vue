<template>
  <div>
    <div style="padding: 15px 0">
      <bk-button
        theme="primary"
        @click="handleRandomRows"
      >
        Random 1000-9999 rows of data
      </bk-button>
      <span style="padding: 0 30px">
        Current number of rows
        {{ randomRows.length }}
      </span>
    </div>
    <bk-table
      :columns="columns"
      :data="randomRows"
      :border="border"
      :empty-text="'No data'"
      virtual-enabled
      settings
      :height="300"
    />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  import { DATA_COLUMNS, DATA_TABLE } from '../../options';

  export default defineComponent({
    components: {},
    setup() {
      return {
        randomRows: [...DATA_TABLE],
        columns: [...DATA_COLUMNS],
        border: ['row'],
      };
    },
    mounted() {
      this.handleRandomRows();
    },
    methods: {
      handleRandomRows() {
        this.randomRows.splice(
          0,
          this.randomRows.length,
          ...new Array(Math.ceil(Math.random() * 9000) + 1000).fill('')
            .map((_, index) => ({
              ip: `${index}--192.168.0.x`,
              source: `${index}_QQ`,
              status: 'Creating',
              create_time: `2018-05-25 15:02:24.${index}`,
            })),
        );
      },
    },
  });
</script>
