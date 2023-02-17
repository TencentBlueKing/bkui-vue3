<template>
  <bk-search-select
    v-model="value"
    :placeholder="t('请选择')"
    :data="data"
    value-behavior="need-key"
  />
</template>

<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  export default defineComponent({
    setup() {
      const { t } = useI18n();
      const data = ref([
        {
          name: t('实例状态'),
          id: '1',
          multiple: true,
          children: [
            {
              name: t('redis创建中'),
              id: '1-2',
            },
            {
              name: t('运行中'),
              id: '1-3',
            },
            {
              name: t('已关机'),
              id: '1-4',
            },
          ],
        },
        {
          name: t('实例业务'),
          id: '2',
          children: [
            {
              name: t('王者荣耀'),
              id: '2-1',
              disabled: false,
            },
            {
              name: t('刺激战场'),
              id: '2-2',
            },
            {
              name: t('绝地求生'),
              id: '2-3',
            },
          ],
        },
        {
          name: t('IP地址'),
          id: '3',
        },
      ]);
      const value = ref([]);
      return {
        data,
        value,
        t,
      };
    },
  });
</script>
