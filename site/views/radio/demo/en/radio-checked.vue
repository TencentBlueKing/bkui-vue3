<template>
  <bk-radio label="QQ" />
  <bk-radio
    :label="'WeChat'"
    checked
  />
  <bk-radio label="Email" />
</template>

<script>
  import { defineComponent } from 'vue';

  import { BkRadio } from '@bkui-vue/radio';
  export default defineComponent({
    components: {
      BkRadio,
    },
    setup() {
      return {};
    },
  });
</script>
