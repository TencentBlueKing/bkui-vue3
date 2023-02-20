<template>
  <bk-radio-group v-model="radioGroupValue">
    <bk-radio-button label="QQ" />
    <bk-radio-button :label="'WeChat'" />
    <bk-radio-button label="Email" />
  </bk-radio-group>
  <div style="margin-top: 10px">
    select: {{ radioGroupValue }}
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  import { BkRadioButton } from '@bkui-vue/radio';

  export default defineComponent({
    components: {
      BkRadioButton,
    },
    setup() {
      const radioGroupValue = ref('WeChat');

      return {
        radioGroupValue,
      };
    },
  });
</script>
