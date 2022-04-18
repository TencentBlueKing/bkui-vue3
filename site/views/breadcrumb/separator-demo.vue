<template>
  <div>
    <div style="margin-bottom: 10px">
      分割符：<bk-input
        v-model="separator"
        style="width: 200px"
      />
    </div>
    <bk-breadcrumb :separator="separator">
      <bk-breadcrumb-item
        v-for="(item,index) in list"
        :key="index"
        :to="item.link"
      >
        {{ item.title }}
      </bk-breadcrumb-item>
      <bk-breadcrumb-item>
        <bk-input clearable />
      </bk-breadcrumb-item>
    </bk-breadcrumb>
  </div>
</template>
<script>
  import { defineComponent, ref } from 'vue';

  import { BkBreadcrumb, BkBreadcrumbItem } from '@bkui-vue/breadcrumb';
  import BkInput from '@bkui-vue/input';

  export default defineComponent({
    name: 'SiteBreadcrumb',
    components: {
      BkBreadcrumb,
      BkBreadcrumbItem,
      BkInput,
    },
    setup() {
      const separator = ref('/');
      const list = [
        { title: '首页', link: { path: '/' } },
        { title: '进度条', link: { path: 'loading' } },
        { title: '滑块开关', link: { path: 'switcher' } },
        { title: '面包屑', link: null },
      ];
      return {
        list,
        separator,
      };
    },
  });

</script>
