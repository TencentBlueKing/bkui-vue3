<template>
  <bk-date-picker
    v-model="dateValue"
    :header-slot-cls="'custom-header-wrapper'"
  >
    <template #header>
      <div class="custom-header">
        {{ t('我是自定义 header') }}
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
.custom-header-wrapper {
  color: green;
}

.custom-header {
  text-align: center;
}
</style>
