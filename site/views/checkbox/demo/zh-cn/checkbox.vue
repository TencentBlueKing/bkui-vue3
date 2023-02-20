<template>
  <bk-checkbox v-model="value">
    微信
  </bk-checkbox>
  <div style="margin-top: 10px">
    选中微信：{{ value }}
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


