<template>
  <bk-checkbox-group v-model="checkboxGroupValue">
    <bk-checkbox
      :label="'WeChat'"
      checked
    />
    <bk-checkbox label="QQ" />
    <bk-checkbox label="Email" />
  </bk-checkbox-group>
  <div style="margin-top: 10px">
    select: {{ checkboxGroupValue.join('，') }}
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  import { BkCheckbox } from '@bkui-vue/checkbox';

  export default defineComponent({
    components: {
      BkCheckbox,
    },
    setup() {
      const checkboxGroupValue = ref(['WeChat']);

      return {
        checkboxGroupValue,
      };
    },
  });
</script>
