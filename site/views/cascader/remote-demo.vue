<template>
  <bk-cascader
    v-model="area"
    :list="list"
    is-remote
    :remote-method="remoteMethod"
  />
</template>
<script setup>
  import { ref } from 'vue';

  let id = 0;

  const list = [
    {
      id: 'hunan',
      name: '湖南',
    }, {
      id: 'guangxi',
      name: '广西',
    }, {
      id: 'yunnan',
      name: '云南',
    },
  ];
  const area = ref([]);

  const remoteMethod = (node, resolve) => {
    const { level } = node;
    setTimeout(() => {
      const nodes = Array.from({ length: level + 1 }).map(() => {
        id = id + 1;
        return {
          id,
          name: `Option${id}`,
          leaf: level >= 2, // 为了更准确渲染，尽量通过`leaf`字段，告知是否是叶子节点；
        };
      });
      resolve(nodes);
    }, 1000);
  };

</script>
