<template>
  <div class="demo">
    <bk-upload
      with-credentials
      :handle-res-code="handleRes"
      :tip="'只允许上传JPG、PNG、JPEG的文件'"
      :accept="'image/png,image/jpeg,image/jpg'"
      :url="'https://jsonplaceholder.typicode.com/posts/'"
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
      const handleRes = (response) => {
        if (response.id) {
          return true;
        }
        return false;
      };

      return {
        handleRes,
      };
    },
  });


</script>
