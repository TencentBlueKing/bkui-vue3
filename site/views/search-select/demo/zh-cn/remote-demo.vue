<template>
  <bk-search-select
    v-model="value"
    :data="data"
    :get-menu-list="getMenuList"
  />
</template>
<script>
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      const data = ref([
        {
          name: '实例状态',
          id: '1',
          multiple: true,
          placeholder: '必须项',
          async: true,
          validate: true,
          children: [
            {
              name: 'redis创建中',
              id: '1-2',
            },
            {
              name: '运行中',
              id: '1-3',
              disabled: false,
            },
            {
              name: '已关机',
              id: '1-4',
            },
          ],
        },
        {
          name: '实例业务',
          id: '2',
          children: [
            {
              name: '王者荣耀',
              id: '2-1',
              disabled: false,
            },
            {
              name: '刺激战场',
              id: '2-2',
            },
            {
              name: '绝地求生',
              id: '2-3',
            },
          ],
        },
        {
          name: 'IP地址',
          id: '3',
          disabled: true,
        },
      ]);
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
              name: `测试${keyword}`,
            },
          }];
        }
        if (!item) return data.value;
        return data.value.find(set => set.id === item.id)?.children;
      };

      return {
        data,
        value,
        getMenuList,
      };
    },
  });
</script>
