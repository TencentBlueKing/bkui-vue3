<template>
  <bk-collapse-panel
    v-model="active"
  >
    <span>collapse-panel: {{ t('方案成熟') }}</span>
    <template #content>
      <div>
        {{ t('拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维') }}
      </div>
    </template>
  </bk-collapse-panel>
</template>

<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  export default defineComponent({
    setup() {
      const { t } = useI18n();
      const active =  ref(true);

      return {
        active,
        t,
      };
    },
  });

</script>

