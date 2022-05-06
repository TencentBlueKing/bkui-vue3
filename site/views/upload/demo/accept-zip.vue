<template>
  <div class="demo">
    <bk-upload
      with-credentials
      :handle-res-code="handleRes"
      :tip="'只允许上传ZIP的文件'"
      :accept="'.zip'"
      :url="'https://jsonplaceholder.typicode.com/posts/'"
    />
  </div>
</template>

<script setup>
  import BkUpload from '@bkui-vue/upload';
  const handleRes = (response) => {
    console.log(response, 'handleRes');
    if (response.id) {
      return true;
    }
    return false;
  };
</script>
