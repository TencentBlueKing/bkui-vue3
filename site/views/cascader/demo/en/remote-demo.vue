<template>
  <bk-cascader
    v-model="area"
    :placeholder="'Please select'"
    :list="list"
    is-remote
    :remote-method="remoteMethod"
  />
</template>

<script>
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      let id = 0;
      const area = ref([]);
      const list = [
        {
          id: 'hunan',
          name: 'Hunan',
        },
        {
          id: 'guangxi',
          name: 'Guangxi',
        },
        {
          id: 'yunnan',
          name: 'Yunnan',
        },
      ];

      const remoteMethod = (node, resolve) => {
        const { level } = node;
        // In order to render more accurately, try to tell whether it is a leaf node through the 'leaf' field;
        setTimeout(() => {
          const nodes = Array.from({ length: level + 1 }).map(() => {
            id = id + 1;
            return {
              id,
              name: `Option - ${id}`,
              leaf: level >= 2,
            };
          });
          resolve(nodes);
        }, 1000);
      };

      return {
        list,
        area,
        remoteMethod,
      };
    },
  });
</script>
