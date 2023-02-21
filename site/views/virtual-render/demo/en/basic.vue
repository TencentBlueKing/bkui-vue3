<template>
  <div style=" width: 100%;height: 400px; overflow: auto;">
    <div style="padding: 15px 0;">
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
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      const lineHeight = ref(30);
      const randomRows = ref([
        {
          ip: '192.168.0.1',
          source: 'QQ',
          status: 'Creating',
          create_time: '2018-05-25 15:02:24',
        },
        {
          ip: '192.168.0.2',
          source: 'WeChat',
          status: 'normal',
          create_time: '2018-05-25 15:02:24',
        },
        {
          ip: '192.168.0.3',
          source: 'QQ',
          status: 'Creating',
          create_time: '2018-05-25 15:02:24',
        },
        {
          ip: '192.168.0.1',
          source: 'QQ',
          status: 'Creating',
          create_time: '2018-05-25 15:02:24',
        },
        {
          ip: '192.168.0.2',
          source: 'WeChat',
          status: 'normal',
          create_time: '2018-05-25 15:02:24',
        },
        {
          ip: '192.168.0.3',
          source: 'QQ',
          status: 'Creating',
          create_time: '2018-05-25 15:02:24',
        },
      ]);

      const getCellStyle = () => ({
        padding: '2px 10px',
        height: `${lineHeight.value}px`,
        lineHeight: `${lineHeight.value}px`,
        display: 'inline-block',
        width: '200px',
      });

      const getRowStyle = () => ({
        height: `${lineHeight.value}px`,
        lineHeight: `${lineHeight.value}px`,
        borderBottom: 'solid 1px #ddd',
      });

      const handleRandomRows = () => {
        randomRows.value.splice(
          0,
          randomRows.value.length,
          ...new Array(Math.ceil(Math.random() * 9000) + 1000).fill('')
            .map((_, index) => ({
              ip: `${index}--192.168.0.x`,
              source: `${index}_QQ`,
              status: 'Creating',
              create_time: `2018-05-25 15:02:24.${index}`,
            })),
        );
      };

      return {
        randomRows,
        getCellStyle,
        getRowStyle,
        handleRandomRows,
      };
    },
  });
</script>
