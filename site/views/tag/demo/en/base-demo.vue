<template>
  <div>
    <bk-tag>MagicBox</bk-tag>
    <bk-tag theme="success">
      Enterprise mailbox
    </bk-tag>
    <bk-tag theme="info">
      Tencent Video
    </bk-tag>
    <bk-tag theme="warning">
      BlueKing
    </bk-tag>
    <bk-tag theme="danger">
      WeCom
    </bk-tag>
    <bk-tag class="custom-tag">
      CustomClass
    </bk-tag>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    setup() {
      return {};
    },
  });
</script>

<style scoped>
.custom-tag {
  color: #531dab;
  background: #f9f0ff;
}
</style>
