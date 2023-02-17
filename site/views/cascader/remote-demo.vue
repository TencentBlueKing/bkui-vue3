<template>
  <bk-cascader
    v-model="area"
    :placeholder="t('请选择')"
    :list="list"
    is-remote
    :remote-method="remoteMethod"
  />
</template>
<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  export default defineComponent({
    setup() {
      const { t } = useI18n();

      let id = 0;
      const area = ref([]);
      const list = [
        {
          id: 'hunan',
          name: t('湖南'),
        },
        {
          id: 'guangxi',
          name: t('广西'),
        },
        {
          id: 'yunnan',
          name: t('云南'),
        },
      ];

      const remoteMethod = (node, resolve) => {
        const { level } = node;
        setTimeout(() => {
          const nodes = Array.from({ length: level + 1 }).map(() => {
            id = id + 1;
            return {
              id,
              name: `Option - ${id}`,
              leaf: level >= 2, // 为了更准确渲染，尽量通过`leaf`字段，告知是否是叶子节点；
            };
          });
          resolve(nodes);
        }, 1000);
      };

      return {
        list,
        area,
        remoteMethod,
        t,
      };
    },
  });
</script>
