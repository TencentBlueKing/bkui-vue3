<template>
  <bk-collapse v-model="activeIndex">
    <bk-collapse-panel :name="1">
      <span>{{ t("方案成熟") }}</span>
      <template #content>
        <div>
          {{
            t(
              "拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维"
            )
          }}
        </div>
      </template>
    </bk-collapse-panel>
    <bk-collapse-panel :name="2">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <div>{{ t("覆盖全面") }}</div>
          <div>
            {{ t(activeIndex.includes(2) ? "展开" : "收起") }}
          </div>
        </div>
      </template>
      <template #content>
        <div>
          {{
            t(
              "拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维"
            )
          }}
        </div>
      </template>
    </bk-collapse-panel>
  </bk-collapse>
</template>

<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import BkCollapse from '@bkui-vue/collapse';
  export default defineComponent({
    components: {
      BkCollapse,
    },
    setup() {
      const { t } = useI18n();
      const activeIndex = ref([0]);

      return {
        activeIndex,
        t,
      };
    },
  });
</script>
