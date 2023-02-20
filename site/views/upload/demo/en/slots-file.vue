<template>
  <div class="demo">
    <bk-upload
      ref="uploader"
      theme="button"
      with-credentials
      :files="files"
      :size="5"
      :handle-res-code="handleRes"
      :tip="'Upload up to 5 (Mb) files'"
      :url="'https://jsonplaceholder.typicode.com/posts/'"
    >
      <template #file="{ file }">
        <div>
          {{ file.name }}
          <a
            class="action-link"
            href="javascrip:;"
            @click.stop.prevent="handleRemove(file)"
          >
            Delete
          </a>
          <a
            v-if="file.status === 'fail'"
            class="action-link"
            href="javascrip:;"
            @click="handleRetry(file)"
          >
            Retry
          </a>
        </div>
      </template>
    </bk-upload>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  import BkUpload from '@bkui-vue/upload';
  export default defineComponent({
    components: {
      BkUpload,
    },
    setup() {
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
