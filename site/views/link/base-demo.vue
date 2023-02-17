<template>
  <div>
    <bk-link>{{ t("这是默认") }}</bk-link>
    <bk-link
      theme="danger"
      @click="handleClick"
    >
      {{ t("这是默认") }}
    </bk-link>
    <bk-link theme="warning">
      {{ t("这是警告") }}
    </bk-link>
    <bk-link theme="success">
      {{ t("这是成功") }}
    </bk-link>
    <bk-link theme="primary">
      {{ t("这是主要") }}
    </bk-link>
  </div>
</template>

<script>
  import { defineComponent, getCurrentInstance } from 'vue';

  export default defineComponent({
    setup() {
      const {
        appContext: {
          config: { globalProperties },
        },
      } = getCurrentInstance();

      const handleClick = () => {
        console.error('handleClickhandleClickhandleClickhandleClick');
      };

      return {
        t: globalProperties.$t,
        handleClick,
      };
    },
  });
</script>

<style lang="postcss" scoped>
.bk-link {
  margin-right: 10px;
}
</style>
