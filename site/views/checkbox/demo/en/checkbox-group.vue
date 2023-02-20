<template>
  <bk-checkbox-group v-model="checkboxGroupValue">
    <bk-checkbox :label="'WeChat'" />
    <bk-checkbox label="QQ" />
    <bk-checkbox label="Email" />
  </bk-checkbox-group>
  <div style="margin-top: 10px">
    select: {{ checkboxGroupValue.join("，") }}
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  import { BkCheckbox, BkCheckboxGroup } from '@bkui-vue/checkbox';

  export default defineComponent({
    setup() {
      const checkboxGroupValue = ref(['WeChat']);
      return {
        checkboxGroupValue,
        BkCheckbox,
        BkCheckboxGroup,
      };
    },
  });
</script>
