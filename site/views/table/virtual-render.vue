<template>
  <div>
    <div style="padding: 15px 0">
      <bk-button
        theme="primary"
        @click="handleRandomRows"
      >
        随机1000-9999行数据 | 自定义 row-height
      </bk-button>
      <span style="padding: 0 30px">当前行数：{{ randomRows.length }}</span>
    </div>
    <bk-table
      :border="border"
      :columns="columns"
      :data="randomRows"
      :height="300"
      :row-height="getRowHeight"
      settings
      virtual-enabled
    />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  import { DATA_COLUMNS2, DATA_TABLE } from './options';
  export default defineComponent({
    components: {},
    data() {
      return {
        randomRows: [...DATA_TABLE],
        columns: [...DATA_COLUMNS2],
        border: ['row'],
      };
    },
    mounted() {
      this.handleRandomRows();
    },
    methods: {
      getRowHeight(...args) {
        const hj = [40, 80, 100, 65];
        return hj[(args[0].index ?? 0) % 3];
      },
      handleRandomRows() {
        this.randomRows.splice(
          0,
          this.randomRows.length,
          ...new Array(Math.ceil(Math.random() * 90) + 10).fill('').map((_, index) => ({
            ip: `${index}--192.168.0.x`,
            source: `${index}_QQ`,
            status: '创建中',
            create_time: `2018-05-25 15:02:24.${index}`,
          })),
        );
      },
    },
  });
</script>
