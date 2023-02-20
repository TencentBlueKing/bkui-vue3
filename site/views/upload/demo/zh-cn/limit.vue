<template>
  <div class="demo">
    <bk-upload
      with-credentials
      :limit="limit"
      :handle-res-code="handleRes"
      :tip="'最多上传2个文件'"
      :url="'https://jsonplaceholder.typicode.com/posts/'"
      @exceed="handleExceed"
    />
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  import BkMessage from '@bkui-vue/message';
  import BkUpload from '@bkui-vue/upload';

  export default defineComponent({
    components: {
      BkUpload,
    },
    setup() {
      const limit = ref(2);

      const handleRes = (response) => {
        if (response.id) {
          return true;
        }
        return false;
      };

      const handleExceed = (files, fileList) => {
        console.log(files, fileList, 'handleExceed');
        BkMessage({
          theme: 'error',
          message: `最多上传${limit.value}个文件`,
        });
      };

      return {
        limit,
        handleRes,
        handleExceed,
      };
    },
  });
</script>
