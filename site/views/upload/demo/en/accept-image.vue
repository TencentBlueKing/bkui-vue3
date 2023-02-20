<template>
  <div class="demo">
    <bk-upload
      with-credentials
      :handle-res-code="handleRes"
      :tip="'Only JPG, PNG and JPEG files can be uploaded'"
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
