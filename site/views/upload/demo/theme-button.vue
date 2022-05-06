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

<script setup>
  import BkUpload from '@bkui-vue/upload';

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
</script>
