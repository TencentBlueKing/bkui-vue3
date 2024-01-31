<template>
  <div>
    <div>
      <bk-date-picker
        v-model="dateValue"
        type="datetime"
        use-shortcut-text
        format="yyyy-MM-dd HH:mm:ss"
        :shortcuts="dateShortCut"
        :shortcut-selected-index="4"
        @change="change"
      />
    </div>

    <div style="margin-top: 20px;">
      <bk-date-picker
        v-model="defaultValue"
        type="datetimerange"
        use-shortcut-text
        format="yyyy-MM-dd HH:mm:ss"
        :shortcuts="shortcutsRange"
        @change="change"
      />
    </div>
    <div style="margin-top: 20px;">
      <bk-date-picker
        v-model="defaultValue"
        type="datetimerange"
        use-shortcut-text
        format="yyyy-MM-dd HH:mm:ss"
        @change="change"
      >
        <template #shortcuts>
          <div class="custom-shortcuts">
            自定义插槽
          </div>
        </template>
      </bk-date-picker>
    </div>
    <div style="margin-top: 20px;">
      <bk-date-picker
        v-model="dateValue1"
        @change="change"
      >
        <template #shortcuts>
          <div class="custom-shortcuts">
            自定义插槽
          </div>
        </template>
      </bk-date-picker>
    </div>
  </div>
</template>

<script setup>
  import { reactive, ref } from 'vue';
  const defaultValue = reactive(['2022-07-21 12:02:26']);
  const dateValue = ref(new Date());
  const dateValue1 = ref(new Date());
  const change = (value, type) => {
    console.log(value, type);
  };

  function getLastMillisecondOfDate(ts) {
    const date = new Date(ts);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  const now = new Date();

  const dateShortCut = [
    {
      text: '今天',
      value: () => getLastMillisecondOfDate(now.getTime()),
      short: 'now/d',
    },
    {
      text: '昨天',
      value: () => getLastMillisecondOfDate(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      short: 'now-1d/d',
    },
    {
      text: '前天',
      value: () => getLastMillisecondOfDate(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      short: 'now-2d/d',
    },
    {
      text: '一星期前',
      value: () => getLastMillisecondOfDate(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      short: 'now-7d/d',
    },
    {
      text: '一个月前',
      value: () => getLastMillisecondOfDate(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      short: 'now-1M/d',
    },
    {
      text: '一年前',
      value: () => getLastMillisecondOfDate(now.getTime() - 365 * 24 * 60 * 60 * 1000),
      short: 'now-1y/d',
    },
  ];

  const shortcutsRange = reactive([
    {
      text: '今天',
      value() {
        const end = new Date();
        const start = new Date(end.getFullYear(), end.getMonth(), end.getDate());
        return [start, end];
      },
      onClick: (picker) => {
        console.log(picker);
      },
    },
    {
      text: '近7天',
      value() {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        return [start, end];
      },
      onClick: (picker) => {
        console.log(picker);
      },
    },
    {
      text: '近15天',
      value() {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
        return [start, end];
      },
      onClick: (picker) => {
        console.log(picker);
      },
    },
    {
      text: '近30天',
      value() {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        return [start, end];
      },
      onClick: (picker) => {
        console.log(picker);
      },
    },
  ]);
</script>
<style lang="postcss">
.custom-shortcuts {
  color: red;
  text-align: center;
}
</style>
