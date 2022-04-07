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
      { title: '首页', link: { path: '/' } },
      { title: '进度条', link: { path: 'loading' } },
      { title: '滑块开关', link: { path: 'switcher' } },
      { title: '面包屑', link: null },
    ];
    return {
      list,
    };
  },
});

</script>
