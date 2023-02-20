<template>
  <div class="cascader-wrapper">
    <bk-cascader
      v-model="area"
      :placeholder="'Please select'"
      :list="list"
      multiple
      filterable
      trigger="click"
    />
    <bk-cascader
      v-model="area"
      :placeholder="'Please select'"
      :list="list"
      multiple
      trigger="click"
    />
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      const list = [
        {
          id: 'hunan',
          name: 'Hunan',
          disabled: true,
          children: [
            {
              id: 'changsha',
              name: 'Changsha',
            },
            {
              id: 'yueyang',
              name: 'Yueyang',
              disabled: true,
            },
          ],
        }, {
          id: 'guangxi',
          name: 'Guangxi',
        }, {
          id: 'yunnan',
          name: 'Yunnan',
          children: [
            {
              id: 'kunming',
              name: 'Kunming',
              children: [
                {
                  id: 'wuhuaqu',
                  name: 'WuhuashanWuhuashanWuhuashan',
                },
                {
                  id: 'guanduqu',
                  name: 'Guanduqu',
                },
                {
                  id: 'xishanqu',
                  name: 'Xishanqu',
                },
              ],
            },
            {
              id: 0,
              name: 'Dali',
            },
            {
              id: 'yuxi',
              name: 'Yuxi',
            },
          ],
        },
      ];
      const area = ref([]);

      return {
        list,
        area,
      };
    },
  });
</script>

<style lang="less" scoped>
.cascader-wrapper {
  .bk-cascader:first-of-type {
    margin-bottom: 20px;
  }
}
</style>
