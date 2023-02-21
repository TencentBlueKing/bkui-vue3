<template>
  <div>
    <bk-tag>MagicBox</bk-tag>
    <bk-tag theme="success">
      企业邮箱
    </bk-tag>
    <bk-tag theme="info">
      腾讯视频
    </bk-tag>
    <bk-tag theme="warning">
      蓝鲸智云
    </bk-tag>
    <bk-tag theme="danger">
      企业微信
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
