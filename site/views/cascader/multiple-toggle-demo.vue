<template>
  <div class="cascader-wrapper">
    <bk-button @click="toggleMultiple">切换多选/单选 (当前: {{ isMultiple ? '多选' : '单选' }})</bk-button>

    <bk-cascader
      v-model="area"
      :list="list"
      :multiple="isMultiple"
      trigger="click"
      style="margin-top: 20px;"
    />

    <div style="margin-top: 20px;">
      <p>当前值: {{ area }}</p>
    </div>
  </div>
</template>
<script setup>
  import { ref } from 'vue';

  const isMultiple = ref(false);

  const list = [
    {
      id: 'hunan',
      name: '湖南',
      children: [
        {
          id: 'changsha',
          name: '长沙',
        },
        {
          id: 'yueyang',
          name: '岳阳',
        },
      ],
    },
    {
      id: 'guangxi',
      name: '广西',
    },
    {
      id: 'yunnan',
      name: '云南',
      children: [
        {
          id: 'kunming',
          name: '昆明',
          children: [
            {
              id: 'wuhuaqu',
              name: '五华区',
            },
            {
              id: 'guanduqu',
              name: '官渡区',
            },
          ],
        },
      ],
    },
  ];

  const area = ref([]);

  const toggleMultiple = () => {
    isMultiple.value = !isMultiple.value;
    // 切换模式时清空已选值以避免冲突
    area.value = [];
  };
</script>

<style lang="less" scoped>
  .cascader-wrapper {
    width: 250px;

    .bk-cascader-wrapper:not(:last-of-type) {
      margin-bottom: 20px;
    }
  }
</style>
