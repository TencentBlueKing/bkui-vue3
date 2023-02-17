<template>
  <div class="demo">
    <bk-upload
      with-credentials
      :size="5"
      :handle-res-code="handleRes"
      :tip="t('最大上传5(Mb)的文件')"
      :url="'https://jsonplaceholder.typicode.com/posts/'"
      @error="handleError"
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
      const handleRes = (response) => {
        if (response.id) {
          return true;
        }
        return false;
      };

      const handleError = (file, fileList, error) => {
        console.log(file, fileList, error, 'handleError');
      };

      return {
        t,
        handleRes,
        handleError,
      };
    },
  });
</script>
