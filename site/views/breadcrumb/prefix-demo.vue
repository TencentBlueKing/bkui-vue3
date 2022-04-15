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
  import { defineComponent, getCurrentInstance, ref } from 'vue';

  import { BkBreadcrumb, BkBreadcrumbItem } from '@bkui-vue/breadcrumb';
  import { AngleLeft } from '@bkui-vue/icon';

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
        { title: '首页', link: { path: '/' } },
        { title: '进度条', link: { path: 'loading' } },
        { title: '滑块开关', link: { path: 'switcher' } },
        { title: '面包屑', link: null },
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
