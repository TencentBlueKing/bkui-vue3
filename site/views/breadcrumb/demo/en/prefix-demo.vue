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

  import { BkBreadcrumb, BkBreadcrumbItem } from '@bkui-vue/breadcrumb';

  export default defineComponent({
    name: 'SiteBreadcrumb',
    components: {
      BkBreadcrumb,
      BkBreadcrumbItem,
      AngleLeft,
    },
    setup() {
      const separator = ref('/');
      const list = [
        { title: 'Home page', link: { path: '/' } },
        { title: 'Progress bar', link: { path: 'progress' } },
        { title: 'Slide switch', link: { path: 'switcher' } },
        { title: 'Crumbs', link: null },
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
