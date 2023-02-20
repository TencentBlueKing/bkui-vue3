<template>
  <div class="demo">
    <bk-upload
      with-credentials
      :limit="limit"
      :handle-res-code="handleRes"
      :tip="'Upload up to 2 files'"
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
          message: `Upload at most ${limit.value} files`,
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
