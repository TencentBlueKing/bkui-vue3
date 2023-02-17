<template>
  <bk-breadcrumb>
    <bk-breadcrumb>
      <bk-breadcrumb-item
        v-for="(item,index) in list"
        :key="index"
        :to="item.link"
      >
        {{ item.title }}
      </bk-breadcrumb-item>
    </bk-breadcrumb>
  </bk-breadcrumb>
</template>
<script>
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { BkBreadcrumb, BkBreadcrumbItem } from '@bkui-vue/breadcrumb';

  export default defineComponent({
    name: 'SiteBreadcrumb',
    components: {
      BkBreadcrumb,
      BkBreadcrumbItem,
    },
    setup() {
      const { t } = useI18n();
      const list = [
        { title: t('首页'), link: { path: '/' } },
        { title: t('进度条'), link: { path: 'loading' } },
        { title: t('滑块开关'), link: { path: 'switcher' } },
        { title: t('面包屑'), link: null },
      ];
      return {
        list,
      };
    },
  });

</script>
