<template>
  <bk-date-picker
    v-model="dateValue"
    :footer-slot-cls="'custom-footer-wrapper'"
  >
    <template #footer>
      <div class="custom-footer">
        {{ t('我是自定义 footer') }}
      </div>
    </template>
  </bk-date-picker>
</template>

<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  export default defineComponent({
    setup() {
      const { t } = useI18n();
      const dateValue = ref(''); // new Date();
      return {
        dateValue,
        t,
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
