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

  import dovImgUlr from '../../../imgs/dov.png';
  import qqImageUrl from '../../../imgs/qq.png';

  const files = [
    {
      name: 'qq',
      url: qqImageUrl,
    },
    {
      name: 'dov',
      url: dovImgUlr,
    },
  ];

  const handleRes = (response) => {
    if (response.id) {
      return true;
    }
    return false;
  };
</script>
