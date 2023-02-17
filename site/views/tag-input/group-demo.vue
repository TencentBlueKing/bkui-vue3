<template>
  <bk-tag-input
    v-model="state.tags"
    :placeholder="t('请选择')"
    use-group
    trigger="focus"
    :list="state.list"
  />
</template>

<script>
  import { defineComponent, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  export default defineComponent({
    setup() {
      const { t } = useI18n();
      const state = reactive({
        tags: [],
        list: [
          {
            id: '1',
            name: t('华中地区'),
            children: [
              { id: '1-1', name: t('河南省') },
              { id: '1-2', name: t('湖北省') },
              { id: '1-3', name: t('湖南省') },
            ],
          },
          {
            id: '2',
            name: t('华北地区'),
            children: [
              { id: '2-1', name: t('北京市') },
              { id: '2-2', name: t('天津市') },
              { id: '2-3', name: t('河北省') },
            ],
          },
          {
            id: '3',
            name: '华南地区',
            children: [
              { id: '3-1', name: t('广东省') },
              { id: '3-2', name: t('海南省') },
            ],
          },
        ],
      });

      return {
        state,
        t,
      };
    },
  });
</script>
