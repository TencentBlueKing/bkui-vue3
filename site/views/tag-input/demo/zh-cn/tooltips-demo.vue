<template>
  <bk-tag-input
    v-model="state.tags"
    :placeholder="'请选择'"
    use-group
    trigger="focus"
    tooltip-key="tips"
    :list="state.list"
  />
</template>

<script>
  import { defineComponent, reactive } from 'vue';

  export default defineComponent({
    setup() {
      const state = reactive({
        tags: [],
        list: [
          {
            id: '1',
            name: '华中地区',
            children: [
              { id: '1-1', name: '河南省', tips: '省会郑州' },
              { id: '1-2', name: '湖北省', tips: '省会武汉' },
              { id: '1-3', name: '湖南省', tips: '省会长沙' },
            ],
          },
          {
            id: '2',
            name: '华北地区',
            children: [
              { id: '2-1', name: '北京市', tips: '直辖市' },
              { id: '2-2', name: '天津市', tips: '直辖市' },
              { id: '2-3', name: '河北省', tips: '省会石家庄' },
            ],
          },
          {
            id: '3',
            name: '华南地区',
            children: [
              { id: '3-1', name: '广东省', tips: '省会广州' },
              { id: '3-2', name: '海南省', tips: '省会海口' },
            ],
          },
        ],
      });

      return {
        state,
      };
    },
  });
</script>
