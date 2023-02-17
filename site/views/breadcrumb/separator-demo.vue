<template>
  <div>
    <div style="margin-bottom: 10px">
      {{ `${t('分割符')}：` }}<bk-input
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
      <bk-breadcrumb-item :to="{ path: 'switcher' }">
        <span>{{ t('自定义separator') }}</span>
        <template #separator>
          <span style="margin: 0px 9px">slot</span>
        </template>
      </bk-breadcrumb-item>
      <bk-breadcrumb-item>
        <bk-input clearable />
      </bk-breadcrumb-item>
    </bk-breadcrumb>
  </div>
</template>
<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

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
      const { t } = useI18n();
      const separator = ref('/');
      const list = [
        { title: t('首页'), link: { path: '/' } },
        { title: t('进度条'), link: { path: 'loading' } },
        { title: t('滑块开关'), link: { path: 'switcher' } },
        { title: t('面包屑'), link: null },
      ];
      return {
        list,
        separator,
        t,
      };
    },
  });

</script>
