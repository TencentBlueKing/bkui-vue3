<template>
  <bk-time-picker
    v-model="dateValue"
    clearable
  />
</template>

<script>
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      const dateValue = ref('12:12:12');

      return {
        dateValue,
      };
    },
  });
</script>
