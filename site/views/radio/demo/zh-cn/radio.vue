<template>
  <bk-radio
    v-model="value"
    label="QQ"
  />
  <bk-radio
    v-model="value"
    :label="'微信'"
  />
  <bk-radio
    v-model="value"
    label="Email"
  />
  <div style="margin-top: 10px">
    选中：{{ value }}
  </div>
</template>
<script>
  import { defineComponent, ref } from 'vue';

  import { BkRadio } from '@bkui-vue/radio';
  export default defineComponent({
    components: {
      BkRadio,
    },
    setup() {
      const value = ref('微信');

      return {
        value,
      };
    },
  });
</script>
