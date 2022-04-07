<template>
  <div style="height: 400px; width: 100%;">
    <div style="padding: 15px 0;">
      <bk-button
        theme="primary"
        @click="handleRandomRows"
      >
        随机1000-9999行数据
      </bk-button>
      <span style="padding: 0 30px">当前行数：{{ randomRows.length }}</span>
    </div>
    <bk-table
      :columns="columns"
      :data="randomRows"
      :border="border"
      :virtual-enabled="true"
      :height="300"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { DATA_TABLE, DATA_COLUMNS } from './options';
export default defineComponent({
  components: {},
  data() {
    return {
      randomRows: [...DATA_TABLE],
      columns: [...DATA_COLUMNS],
      border: ['row'],
    };
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
            status: '创建中',
            create_time: `2018-05-25 15:02:24.${index}`,
          })),
      );
    },
  },
});
</script>
