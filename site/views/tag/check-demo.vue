<template>
  <div>
    <bk-tag
      v-for="tag in tags"
      :key="tag"
      checkable
      :checked="checkedTags.includes(tag)"
      @change="(checked) => handleCheckChange(checked, tag)"
    >
      {{ tag }}
    </bk-tag>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    setup() {
      const { t } = useI18n();
      const tags = [t('企业邮箱'), t('腾讯视频'), t('蓝鲸智云'), t('企业微信')];
      const checkedTags = ref(['企业邮箱']);

      const handleCheckChange = (checked, tag) => {
        if (checked && !checkedTags.value.includes(tag)) {
          checkedTags.value.push(tag);
        } else {
          checkedTags.value = checkedTags.value.filter(tagItem => tagItem !== tag);
        }
      };

      return {
        tags,
        checkedTags,
        handleCheckChange,
      };
    },
  });
</script>
