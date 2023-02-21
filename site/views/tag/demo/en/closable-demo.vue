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
      Enterprise mailbox
    </bk-tag>
  </div>
</template>


<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    setup() {
      const handleTagClose = e => console.log(e);

      return {
        handleTagClose,
      };
    },
  });
</script>
