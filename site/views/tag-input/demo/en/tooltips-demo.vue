<template>
  <bk-tag-input
    v-model="state.tags"
    :placeholder="'Please select'"
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
            name: 'Central China',
            children: [
              { id: '1-1', name: 'Henan Province', tips: 'Zhengzhou, the provincial capital' },
              { id: '1-2', name: 'Hubei Province', tips: 'Wuhan, the provincial capital' },
              { id: '1-3', name: 'Hunan Province', tips: 'Changsha, the provincial capital' },
            ],
          },
          {
            id: '2',
            name: 'North China',
            children: [
              { id: '2-1', name: 'Beijing City', tips: 'municipality directly under the Central Government' },
              { id: '2-2', name: 'Tianjin City', tips: 'municipality directly under the Central Government' },
              { id: '2-3', name: 'Hebei Province', tips: 'Shijiazhuang, the provincial capital' },
            ],
          },
          {
            id: '3',
            name: 'South China',
            children: [
              { id: '3-1', name: 'Guangdong Province', tips: 'Guangzhou, the provincial capital' },
              { id: '3-2', name: 'Hainan Province', tips: 'Haikou, the provincial capital' },
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
