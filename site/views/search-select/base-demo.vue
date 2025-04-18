<template>
  <bk-search-select
    v-model="value"
    :data="data"
    :get-menu-list="getMenuList"
    unique-select
  />
</template>
<script setup>
  import { ref, shallowRef } from 'vue';
  function generateRandomIPs(count) {
    const generateIP = () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      name: generateIP(),
    }));
  }
  const ipList = generateRandomIPs(20);
  function generateRandomValues(count) {
    const arrayCopy = ipList.slice();
    for (let i = arrayCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
    }
    return arrayCopy.slice(0, count);
  }
  const data = shallowRef([
    {
      name: '访问入口',
      id: 'domain',
      multiple: true,
      async: false,
    },
    {
      name: 'IP 或 IP:Port',
      id: 'instance',
      multiple: true,
    },
    {
      name: 'ID',
      id: 'id',
    },
    {
      name: '集群名称',
      id: 'name',
    },
    {
      name: '管控区域',
      id: 'bk_cloud_id',
      multiple: true,
      children: [
        {
          id: 0,
          name: '直连区域',
        },
      ],
    },
    {
      name: '状态',
      id: 'status',
      multiple: true,
      children: [
        {
          id: 'normal',
          name: '正常',
        },
        {
          id: 'abnormal',
          name: '异常',
        },
      ],
    },
    {
      name: '所属 DB 模块',
      id: 'db_module_id',
      multiple: true,
      children: [
        {
          id: 2,
          name: 'tendbha57',
        },
        {
          id: 19,
          name: 'xiaog56',
        },
      ],
    },
    {
      name: '版本',
      id: 'major_version',
      multiple: true,
      children: [
        {
          id: 'MySQL-5.7',
          name: 'MySQL-5.7',
        },
        {
          id: 'MySQL-5.6',
          name: 'MySQL-5.6',
        },
      ],
    },
    {
      name: '地域',
      id: 'region',
      multiple: true,
      children: [
        {
          id: '',
          name: '',
        },
        {
          id: 'default',
          name: 'default',
        },
      ],
    },
    {
      name: '创建人',
      id: 'creator',
    },
    {
      name: '时区',
      id: 'time_zone',
      multiple: true,
      children: [
        {
          id: '+08:00',
          name: '+08:00',
        },
      ],
    },
  ]);
  const getMenuList = async (item, keyword) => {
    console.info(item, keyword);
    await new Promise(resolve => setTimeout(resolve, 300));
    if (!item && keyword) {
      return [
        {
          id: 'sdfds',
          name: 'sdfsdfds',
          value: {
            id: 'sdfsdfsdfsdf',
            name: `测试${keyword}`,
          },
        },
      ];
    }
    if (!item) return data;
    return data.value.find(set => set.id === item.id)?.children;
  };
  const value = ref([{ name: 'IP地址', id: '3', values: generateRandomValues(6) }]);
</script>
