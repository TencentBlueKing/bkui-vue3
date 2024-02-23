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
    <bk-tag
      class="custom-tag"
    >
      CustomClass
    </bk-tag>
  </div>
</template>

<style>
.custom-tag {
  color: #531dab;
  background: #f9f0ff;
}

.bk-tag ~ .bk-tag {
  margin-left: 4px;
}
</style>
