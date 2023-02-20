<template>
  <bk-cascader
    v-model="area"
    :placeholder="'Please select'"
    :list="list"
    separator="|"
  />
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

