<template>
  <div>
    <bk-cascader
      v-model="area"
      :list="list"
      :check-any-level="true"
      multiple
    >
      <template #panel="{ nodes, level }">
        <div class="custom-panel-header" @click="handleClick(nodes, level)">
          Panel Level: {{ level }}, Nodes: {{ nodes.length }}
        </div>
      </template>
    </bk-cascader>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      const list = ref([
        {
          id: 'hunan',
          name: '湖南',
          children: [
            {
              id: 'changsha',
              name: '长沙',
              children: [
                { id: 'yuelu', name: '岳麓区' },
                { id: 'kaifu', name: '开福区' },
                { id: 'furong', name: '芙蓉区' },
              ],
            },
            {
              id: 'yueyang',
              name: '岳阳',
            },
          ],
        },
        {
          id: 'guangdong',
          name: '广东',
          children: [
            {
              id: 'guangzhou',
              name: '广州',
            },
            {
              id: 'shenzhen',
              name: '深圳',
            },
          ],
        },
      ]);
      const area = ref([]);

      const handleClick = (nodes, level) =>{
        console.log('nodes', nodes, 'level', level)
      }

      return {
        list,
        area,
        handleClick
      };
    },
  });
</script>

<style lang="less" scoped>
.custom-panel-header {
  padding: 5px 12px;
  font-size: 12px;
  color: #63656e;
  background: #f0f1f5;
  border-bottom: 1px solid #dcdee5;
}
</style>
