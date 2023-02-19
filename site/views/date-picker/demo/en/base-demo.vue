<template>
  <bk-date-picker
    v-model="dateValue"
    clearable
    :disable-date="disableDate"
    :options="options"
  />
</template>

<script>
  import { defineComponent, reactive, ref } from 'vue';
  export default defineComponent({
    setup() {
      const options = reactive({});
      const dateValue = ref(new Date());
      const disableDate = date => date && date.valueOf() < Date.now() - 86400;

      return {
        dateValue,
        options,
        disableDate,
      };
    },
  });
</script>
