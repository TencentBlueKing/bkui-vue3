<template>
  <div>
    <bk-dropdown
      :disabled="disabled"
      placement="bottom-start"
    >
      <bk-button @click="handleClick">
        {{ `${t('点击切换disabled')}(${disabled})${t('状态')}` }}
      </bk-button>
      <template #content>
        <bk-dropdown-menu>
          <bk-dropdown-item
            v-for="item in dropdownList"
            :key="item"
          >
            {{ item }}
          </bk-dropdown-item>
        </bk-dropdown-menu>
      </template>
    </bk-dropdown>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import BkDropdown from '@bkui-vue/dropdown';

  export default defineComponent({
    components: {
      BkDropdown,
    },
    setup() {
      const { t } = useI18n();

      const disabled = ref(false);
      const dropdownList = ref([
        t('生产环境'),
        t('预发布环境'),
        t('测试环境'),
        t('正式环境'),
        t('开发环境'),
        t('调试环境'),
      ]);

      const handleClick = () => {
        disabled.value = !disabled.value;
      };

      return {
        disabled,
        dropdownList,
        handleClick,
        t,
      };
    },
  });
</script>
