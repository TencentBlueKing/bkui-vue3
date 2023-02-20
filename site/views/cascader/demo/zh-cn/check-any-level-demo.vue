<template>
  <div class="cascader-wrapper">
    <bk-cascader
      v-model="area"
      style="height: 32px;"
      :placeholder="'请选择'"
      :list="list"
      check-any-level
    />
    <bk-cascader
      v-model="multipleArea"
      :placeholder="'请选择'"
      :list="list"
      multiple
      filterable
      check-any-level
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
          name: '湖南',
          disabled: true,
          children: [
            {
              id: 'changsha',
              name: '长沙',
            },
            {
              id: 'yueyang',
              name: '岳阳',
              disabled: true,
            },
          ],
        }, {
          id: 'guangxi',
          name: '广西',
        }, {
          id: 'yunnan',
          name: '云南',
          children: [
            {
              id: 'kunming',
              name: '昆明',
              children: [
                {
                  id: 'wuhuaqu',
                  name: '长文字测试五华山五华山五华山',
                },
                {
                  id: 'guanduqu',
                  name: '官渡区',
                },
                {
                  id: 'xishanqu',
                  name: '西山区',
                },
              ],
            },
            {
              id: 0,
              name: '大理',
            },
            {
              id: 'yuxi',
              name: '玉溪',
            },
          ],
        },
      ];
      const area = ref([]);
      const multipleArea = ref([]);

      return {
        list,
        area,
        multipleArea,
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

