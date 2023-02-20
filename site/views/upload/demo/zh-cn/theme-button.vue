<template>
  <div class="demo">
    <bk-upload
      theme="button"
      with-credentials
      :files="files"
      :size="5"
      :handle-res-code="handleRes"
      :tip="'最大上传5(Mb)的文件'"
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
          name: 'test.ppt',
        },
      ];

      const handleRes = (response) => {
        console.log(response, 'handleRes');
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
