<template>
  <div>
    <bk-link disabled>
      This is the default
    </bk-link>
    <bk-link
      disabled
      theme="danger"
    >
      This is dangerous
    </bk-link>
    <bk-link
      disabled
      theme="warning"
    >
      This is a warning
    </bk-link>
    <bk-link
      disabled
      underline
      theme="success"
    >
      This is success
    </bk-link>
    <bk-link
      disabled
      underline
      theme="primary"
    >
      This is the primary
    </bk-link>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    setup() {},
  });
</script>

<style lang="postcss" scoped>
.bk-link {
  margin-right: 10px;
}
</style>
