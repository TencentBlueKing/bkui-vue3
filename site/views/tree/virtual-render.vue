<template>
  <div style="width: 100%;overflow: hidden;">
    <div style="padding: 15px 0;">
      <bk-button
        theme="primary"
        @click="handleRandomRows"
      >
        {{ t('随机数据') }}
      </bk-button>
    </div>
    <div style="height: 400px;">
      <bk-tree
        :data="treeData"
        virtual-render
        level-line
        label="name"
        children="children"
      />
    </div>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { BASIC_DATA } from './options';
  export default defineComponent({
    setup() {
      const { t } = useI18n();

      const treeData = ref([...BASIC_DATA]);

      const handleRandomRows = () => {
        treeData.value.length = 0;
        function randomChildren(depth = 5) {
          if (depth > 0) {
            const length = Math.ceil(Math.random() * depth);
            return new Array(length)
              .fill(depth)
              .map((item, index) => ({ name: `depth-${item}-${index}`, children: randomChildren(depth - 1) }));
          }
          return [];
        }
        treeData.value = randomChildren();
      };

      return {
        treeData,
        handleRandomRows,
        t,
      };
    },
  });
</script>

