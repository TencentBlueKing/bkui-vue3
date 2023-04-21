<template>
  <div class="demo">
    <bk-upload
      theme="picture"
      with-credentials
      :multiple="false"
      :files="files"
      :handle-res-code="handleRes"
      :url="'https://jsonplaceholder.typicode.com/posts/'"
      @delete="handleDelete"
    />
  </div>
</template>

<script setup>
  import BkUpload from '@bkui-vue/upload';

  import babyqImgUrl from '../../../imgs/babyq.png';

  const files = [
    {
      url: babyqImgUrl,
    },
  ];

  const handleDelete = (file, fileList) => {
    console.log(file, fileList, 'handleDelete');
  };

  const handleRes = (response) => {
    if (response.id) {
      return true;
    }
    return false;
  };
</script>
