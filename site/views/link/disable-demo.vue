<template>
  <div>
    <bk-link disabled>
      {{ t('这是默认') }}
    </bk-link>
    <bk-link
      disabled
      theme="danger"
    >
      {{ t('这是危险') }}
    </bk-link>
    <bk-link
      disabled
      theme="warning"
    >
      {{ t('这是警告') }}
    </bk-link>
    <bk-link
      disabled
      underline
      theme="success"
    >
      {{ t('这是成功') }}
    </bk-link>
    <bk-link
      disabled
      underline
      theme="primary"
    >
      {{ t('这是主要') }}
    </bk-link>
  </div>
</template>

<script>
  import { defineComponent, getCurrentInstance } from 'vue';

  export default defineComponent({
    setup() {
      const { appContext: { config: { globalProperties } } } = getCurrentInstance();
      return {
        t: globalProperties.$t,
      };
    },
  });
 </script>

<style lang="postcss" scoped>
.bk-link {
  margin-right: 10px;
}
</style>
