<template>
  <div style="height: 400px;">
    <bk-steps
      :line-type="state.lineType"
      class="mb5"
    />
    <bk-steps
      direction="vertical"
    />
  </div>
</template>
<script>
  import { defineComponent, reactive } from 'vue';

  export default defineComponent({
    setup() {
      const state = reactive({
        lineType: 'solid',
      });
      return {
        state,
      };
    },
  });
</script>
<style>
.mb5 {
  margin-bottom: 5px;
}
</style>
