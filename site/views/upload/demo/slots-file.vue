<template>
  <div class="demo">
    <bk-upload
      ref="uploader"
      theme="button"
      with-credentials
      :files="files"
      :size="5"
      :handle-res-code="handleRes"
      :tip="t('最大上传5(Mb)的文件')"
      :url="'https://jsonplaceholder.typicode.com/posts/'"
    >
      <template #file="{ file }">
        <div>
          {{ file.name }}
          <a
            class="action-link"
            href="javascrip:;"
            @click.stop.prevent="handleRemove(file)"
          >{{ t('删除') }}</a>
          <a
            v-if="file.status === 'fail'"
            class="action-link"
            href="javascrip:;"
            @click="handleRetry(file)"
          >{{ t('重试') }}</a>
        </div>
      </template>
    </bk-upload>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import BkUpload from '@bkui-vue/upload';
  export default defineComponent({
    components: {
      BkUpload,
    },
    setup() {
      const { t } = useI18n();

      const uploader = ref(null);

      const files = [
        {
          name: 'test.ppt',
        },
      ];

      const handleRes = (response) => {
        if (response.id) {
          return true;
        }
        return false;
      };

      const handleRemove = (file) => {
        uploader.value?.handleRemove(file);
      };

      const handleRetry = (file) => {
        uploader.value?.handleRetry(file);
      };

      const handleError = (file, fileList, error) => {
        console.log(file, fileList, error, 'handleError');
      };

      return {
        t,
        files,
        handleRemove,
        handleRetry,
        handleRes,
        handleError,
      };
    },
  });
</script>

<style scoped>
  .action-link {
    margin: 4px;
  }
</style>
