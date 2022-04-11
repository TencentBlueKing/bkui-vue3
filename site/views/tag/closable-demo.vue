<template>
  <div>
    <bk-tag
      closable
      @close="handleTagClose"
    >
      MagicBox
    </bk-tag>
    <bk-tag
      theme="info"
      closable
      @close="handleTagClose"
    >
      企业邮箱
    </bk-tag>
  </div>
</template>

<script setup>
const handleTagClose = e => console.log(e);
</script>
