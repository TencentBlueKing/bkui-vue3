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

  import { BkBreadcrumb, BkBreadcrumbItem } from '@bkui-vue/breadcrumb';

  export default defineComponent({
    name: 'SiteBreadcrumb',
    components: {
      BkBreadcrumb,
      BkBreadcrumbItem,
    },
    setup() {
      const list = [
        { title: 'Home page', link: { path: '/' } },
        { title: 'Progress bar', link: { path: 'progress' } },
        { title: 'Slide switch', link: { path: 'switcher' } },
        { title: 'Crumbs', link: null },
      ];

      return {
        list,
      };
    },
  });

</script>
