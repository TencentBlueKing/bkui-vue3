<template>
  <bk-search-select
    v-model="value"
    :data="data"
    unique-select
    :value-split-code="'+'"
  />
</template>
<script>

  import { defineComponent, ref, shallowRef } from 'vue';
  import { useI18n } from 'vue-i18n';
  export default defineComponent({
    setup() {
      const { t } = useI18n();
      const data = shallowRef([
        {
          name: t('实例状态'),
          id: '1',
          multiple: true,
          placeholder: t('必须项'),
          async: true,
          validate: true,
          children: [
            {
              name: t('redis创建中'),
              id: '1-2',
            },
            {
              name: t('运行中'),
              id: '1-3',
              disabled: false,
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
          disabled: true,
        },
        {
          name: 'testestset',
          id: '4',
        },
      ]);
      const value = ref([
        {
          id: '1',
          name: t('实例状态'),
          values: [{
            name: t('创建中'),
            id: '1-2',
          }],
        },
      ]);

      return {
        data,
        value,
      };
    },
  });
</script>
