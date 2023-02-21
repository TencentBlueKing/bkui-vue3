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

  export default defineComponent({
    setup() {
      const tags = ['Enterprise mailbox', 'Tencent Video', 'BlueKing', 'WeCom'];
      const checkedTags = ref(['Enterprise mailbox']);

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
