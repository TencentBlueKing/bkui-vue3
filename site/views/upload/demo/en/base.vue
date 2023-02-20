<template>
  <div class="demo">
    <bk-upload
      with-credentials
      :tip="'Only JPG, PNG, JPEG and ZIP files can be uploaded'"
      :handle-res-code="handleRes"
      :url="'https://jsonplaceholder.typicode.com/posts/'"
      @success="handleSuccess"
      @error="handleError"
      @progress="handleProgress"
      @done="handleDone"
    />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  import BkUpload from '@bkui-vue/upload';
  export default defineComponent({
    components: {
      BkUpload,
    },
    setup() {
      const handleSuccess = (file, fileList) => {
        console.log(file, fileList, 'handleSuccess');
      };

      const handleProgress = (event, file, fileList) => {
        console.log(event, file, fileList, 'handleProgress');
      };

      const handleError = (file, fileList, error) => {
        console.log(file, fileList, error, 'handleError');
      };

      const handleDone = (fileList) => {
        console.log(fileList, 'handleDone');
      };

      const handleRes = (response) => {
        console.log(response, 'handleRes');
        if (response.id) {
          return true;
        }
        return false;
      };

      return {
        handleSuccess,
        handleProgress,
        handleError,
        handleDone,
        handleRes,
      };
    },
  });
</script>

<style lang="less">
  .demo {
    padding: 24px;
  }
</style>
