<template>
  <div class="flex-wrapper">
    <bk-cascader
      v-model="area"
      :list="list"
      trigger="click"
      :show-complete-name="false"
    />
  </div>
</template>
<script setup>
  import { ref } from 'vue';

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

</script>

<style lang="less" scoped>
.flex-wrapper {
  display: flex;

  .bk-cascader {
    margin-right: 200px;
  }
}
</style>
