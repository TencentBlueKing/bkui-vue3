<template>
  <div class="demo">
    <bk-upload
      theme="button"
      with-credentials
      :files="files"
      :size="5"
      :handle-res-code="handleRes"
      :tip="t('最大上传5(Mb)的文件')"
      :url="'https://jsonplaceholder.typicode.com/posts/'"
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
        t,
        files,
        handleRes,
      };
    },
  });
</script>
