<template>
  <bk-checkbox
    :label="'WeChat'"
    indeterminate
    checked
  />
</template>

<script>
  import { defineComponent } from 'vue';

  import { BkCheckbox } from '@bkui-vue/checkbox';
  export default defineComponent({
    components: {
      BkCheckbox,
    },
    setup() {
      return {};
    },
  });
</script>
