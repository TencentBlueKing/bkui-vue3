<template>
  <div>
    <bk-tag
      v-for="tag in tags"
      :key="tag"
      checkable
      :checked="checkedTags.includes(tag)"
      @change="checked => handleCheckChange(checked, tag)"
    >
      {{ tag }}
    </bk-tag>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const tags = ['企业邮箱', '腾讯视频', '蓝鲸智云', '企业微信'];
const checkedTags = ref(['企业邮箱']);

const handleCheckChange = (checked, tag) => {
  if (checked && !checkedTags.value.includes(tag)) {
    checkedTags.value.push(tag);
  } else {
    checkedTags.value = checkedTags.value.filter(tagItem => tagItem !== tag);
  }
};
</script>
