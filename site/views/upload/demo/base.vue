<template>
  <div class="demo">
    <bk-upload
      with-credentials
      :tip="t('只允许上传JPG、PNG、JPEG、ZIP的文件')"
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
  import { useI18n } from 'vue-i18n';

  import BkUpload from '@bkui-vue/upload';
  export default defineComponent({
    components: {
      BkUpload,
    },
    setup() {
      const { t } = useI18n();

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
        t,
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
