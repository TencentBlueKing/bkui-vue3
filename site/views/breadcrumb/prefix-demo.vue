<template>
  <div>
    <bk-breadcrumb :back-router="{ path: '/' }">
      <bk-breadcrumb-item
        v-for="(item,index) in list"
        :key="index"
        :to="item.link"
      >
        {{ item.title }}
      </bk-breadcrumb-item>
    </bk-breadcrumb>
    <bk-breadcrumb style="margin-top: 10px">
      <bk-breadcrumb-item
        v-for="(item,index) in list"
        :key="index"
        :to="item.link"
      >
        {{ item.title }}
      </bk-breadcrumb-item>
      <template #prefix>
        <angle-left @click="goBack" />
      </template>
    </bk-breadcrumb>
  </div>
</template>

<script>
  import { AngleLeft } from 'bkui-vue/lib/icon';
  import { defineComponent, getCurrentInstance, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { BkBreadcrumb, BkBreadcrumbItem } from '@bkui-vue/breadcrumb';

  export default defineComponent({
    name: 'SiteBreadcrumb',
    components: {
      BkBreadcrumb,
      BkBreadcrumbItem,
      AngleLeft,
    },
    setup() {
      const { t } = useI18n();
      const separator = ref('/');
      const list = [
        { title: t('首页'), link: { path: '/' } },
        { title: t('进度条'), link: { path: 'loading' } },
        { title: t('滑块开关'), link: { path: 'switcher' } },
        { title: t('面包屑'), link: null },
      ];
      const { appContext } = getCurrentInstance();
      const { $router } = appContext.config.globalProperties;
      const goBack = () => {
        $router.push({ path: '/' });
      };
      return {
        list,
        separator,
        goBack,
      };
    },
  });

</script>
