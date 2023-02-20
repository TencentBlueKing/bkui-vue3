<template>
  <div class="demo">
    <bk-upload
      theme="picture"
      with-credentials
      :files="files"
      :handle-res-code="handleRes"
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
      const files = [
        {
          name: 'qq',
          url: '../../imgs/qq.png',
        },
        {
          name: 'dov',
          url: '../../imgs/dov.png',
        },
      ];

      const handleRes = (response) => {
        if (response.id) {
          return true;
        }
        return false;
      };

      return {
        files,
        handleRes,
      };
    },
  });
</script>
