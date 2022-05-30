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

<script setup>
  import BkUpload from '@bkui-vue/upload';

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
</script>
