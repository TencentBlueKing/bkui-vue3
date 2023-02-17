<template>
  <bk-search-select
    v-model="value"
    :data="data"
    :validate-values="validateValues"
  />
</template>
<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  export default defineComponent({
    setup() {
      const { t } = useI18n();
      const data = [
        {
          name: t('实例状态'),
          id: '1',
          multiple: true,
          placeholder: t('请选择/请输入'),
          noValidate: true,
          children: [
            {
              name: t('创建中'),
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
          placeholder: t('输入格式为XXX'),
          noValidate: false,
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
          conditions: [
            {
              name: '>',
              id: '>',
            },
            {
              name: '>=',
              id: '>=',
            },
            {
              name: '<=',
              id: '<=',
            },
            {
              name: '<',
              id: '<',
            },
            {
              name: '=',
              id: '=',
            },
          ],
        },
        {
          name: t('IP地址'),
          id: '3',
          disabled: true,
        },
        {
          name: t('实例名'),
          id: '4',
        },
        {
          name: t('实例地址'),
          id: '5',
        },
        {
          name: t('测试六'),
          id: '6',
        },
      ];
      const value = ref([]);
      const validateValues = async (item, values) => {
        console.info(item, values);
        return !item ? t('格式错误') : true;
      };

      return {
        data,
        value,
        validateValues,
      };
    },
  });
</script>
