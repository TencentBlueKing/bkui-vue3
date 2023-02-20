<template>
  <bk-radio-group v-model="radioGroupValue">
    <bk-radio
      label="QQ"
      disabled
    />
    <bk-radio :label="'微信'" />
    <bk-radio label="Email" />
  </bk-radio-group>
  <div style="margin-top: 10px">
    选中：{{ radioGroupValue }}
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
      const radioGroupValue = ref('微信');

      return {
        radioGroupValue,
      };
    },
  });
</script>
