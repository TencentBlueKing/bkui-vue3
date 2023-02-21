<template>
  <bk-time-picker
    :model-value="defaultValue"
    :type="'timerange'"
  />
</template>

<script>
  import { defineComponent, reactive } from 'vue';

  export default defineComponent({
    setup() {
      const defaultValue = reactive(['00:00:00', '23:59:59']);

      return {
        defaultValue,
      };
    },
  });

</script>
