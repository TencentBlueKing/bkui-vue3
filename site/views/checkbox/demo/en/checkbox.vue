<template>
  <bk-checkbox v-model="value">
    WeChat
  </bk-checkbox>
  <div style="margin-top: 10px">
    Select WeChat: {{ value }}
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  import { BkCheckbox } from '@bkui-vue/checkbox';;
  export default defineComponent({
    components: {
      BkCheckbox,
    },
    setup() {
      const value = ref(true);

      return {
        value,
      };
    },
  });

</script>


