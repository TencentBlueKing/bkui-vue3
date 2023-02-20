<template>
  <div class="demo">
    <bk-upload
      with-credentials
      :handle-res-code="handleRes"
      :tip="'Only ZIP files can be uploaded'"
      :accept="'.zip'"
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
        console.log(response, 'handleRes');
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
