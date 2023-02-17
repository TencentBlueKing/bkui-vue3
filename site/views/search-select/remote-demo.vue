<template>
  <bk-search-select
    v-model="value"
    :data="data"
    :get-menu-list="getMenuList"
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
          async: true,
          validate: true,
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
      ];
      const value = ref([]);
      const getMenuList = async (item, keyword) => {
        console.info(item, keyword);
        await new Promise(resolve => setTimeout(resolve, 300));
        if (!item && keyword) {
          return [{
            id: 'sdfds',
            name: 'sdfsdfds',
            value: {
              id: 'sdfsdfsdfsdf',
              name: `${t('测试')}${keyword}`,
            },
          }];
        }
        if (!item) return data;
        return data.find(set => set.id === item.id)?.children;
      };

      return {
        data,
        value,
        getMenuList,
      };
    },
  });
</script>
