<template>
  <div>
    <div>
      <bk-date-picker
        v-model="defaultValue"
        type="datetimerange"
        use-shortcut-text
        :shortcuts="shortcutsRange"
        @change="change"
      />
    </div>
    <div style="margin-top: 20px;">
      <bk-date-picker
        v-model="dateValue"
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
  const defaultValue = reactive([new Date(), new Date()]);
  const dateValue = ref(new Date());
  const change = (value, type) => {
    console.log(value, type);
  };
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
