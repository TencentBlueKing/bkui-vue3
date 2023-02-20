<template>
  <div class="demo">
    <bk-upload
      theme="picture"
      with-credentials
      :multiple="false"
      :files="files"
      :handle-res-code="handleRes"
      :url="'https://jsonplaceholder.typicode.com/posts/'"
      @delete="handleDelete"
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
      const files = [
        {
          url: '../../imgs/babyq.png',
        },
      ];

      const handleDelete = (file, fileList) => {
        console.log(file, fileList, 'handleDelete');
      };

      const handleRes = (response) => {
        if (response.id) {
          return true;
        }
        return false;
      };

      return {
        files,
        handleDelete,
        handleRes,
      };
    },
  });
</script>
