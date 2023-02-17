<template>
  <div class="demo">
    <bk-upload
      with-credentials
      :handle-res-code="handleRes"
      :tip="t('只允许上传JPG、PNG、JPEG的文件')"
      :accept="'image/png,image/jpeg,image/jpg'"
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
      const handleRes = (response) => {
        if (response.id) {
          return true;
        }
        return false;
      };

      return {
        handleRes,
        t,
      };
    },
  });


</script>
