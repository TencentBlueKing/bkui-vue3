<template>
  <div style="height: 400px; width: 100%; overflow: auto;">
    <div style="padding: 15px 0;">
      <bk-button
        theme="primary"
        @click="handleRandomRows"
      >
        随机1000-9999行数据
      </bk-button>
      <span style="padding: 0 30px">当前行数：{{ randomRows.length }}</span>
    </div>
    <bk-virtual-render
      :list="randomRows"
      :line-height="30"
      :height="300"
    >
      <template #default="{data}">
        <div
          v-for="item in data"
          :key="item.$index"
          :style="getRowStyle(item)"
        >
          <span :style="getCellStyle(item)">{{ item.$index + 1 }}</span>
          <span :style="getCellStyle(item)">{{ item.ip }}</span>
          <span :style="getCellStyle(item)">{{ item.source }}</span>
          <span :style="getCellStyle(item)">{{ item.status }}</span>
          <span :style="getCellStyle(item)">{{ item.create_time }}</span>
          <span :style="getCellStyle(item)">LineHeight: {{ 30 }}</span>
        </div>
      </template>
    </bk-virtual-render>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  export default defineComponent({
    components: {},
    data() {
      return {
        randomRows: [
          {
            ip: '192.168.0.1',
            source: 'QQ',
            status: '创建中',
            create_time: '2018-05-25 15:02:24',
          },
          {
            ip: '192.168.0.2',
            source: '微信',
            status: '正常',
            create_time: '2018-05-25 15:02:24',
          },
          {
            ip: '192.168.0.3',
            source: 'QQ',
            status: '创建中',
            create_time: '2018-05-25 15:02:24',
          },
          {
            ip: '192.168.0.1',
            source: 'QQ',
            status: '创建中',
            create_time: '2018-05-25 15:02:24',
          },
          {
            ip: '192.168.0.2',
            source: '微信',
            status: '正常',
            create_time: '2018-05-25 15:02:24',
          },
          {
            ip: '192.168.0.3',
            source: 'QQ',
            status: '创建中',
            create_time: '2018-05-25 15:02:24',
          },
        ],
      };
    },
    created() {
    // this.handleRandomRows();
    },
    methods: {
      getCellStyle() {
        const lineHeight = 30;
        return {
          padding: '2px 10px',
          height: `${lineHeight}px`,
          lineHeight: `${lineHeight}px`,
          display: 'inline-block',
          width: '200px',
        };
      },

      getRowStyle() {
        const lineHeight = 30;
        return {
          height: `${lineHeight}px`,
          lineHeight: `${lineHeight}px`,
          borderBottom: 'solid 1px #ddd',
        };
      },
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
