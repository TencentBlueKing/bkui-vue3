<template>
  <bk-radio-group v-model="radioGroupValue">
    <bk-radio
      label="QQ"
      disabled
    />
    <bk-radio :label="'WeChat'" />
    <bk-radio label="Email" />
  </bk-radio-group>
  <div style="margin-top: 10px">
    select: {{ radioGroupValue }}
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
      const radioGroupValue = ref('WeChat');

      return {
        radioGroupValue,
      };
    },
  });
</script>
