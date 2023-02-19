<template>
  <bk-date-picker
    v-model="dateValue"
    :footer-slot-cls="'custom-footer-wrapper'"
  >
    <template #footer>
      <div class="custom-footer">
        我是自定义 footer
      </div>
    </template>
  </bk-date-picker>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      const dateValue = ref(''); // new Date();
      return {
        dateValue,
      };
    },
  });
</script>

<style lang="postcss">
.custom-footer-wrapper {
  color: red;
}

.custom-footer {
  text-align: center;
}
</style>
