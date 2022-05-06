<template>
  <div class="demo">
    <bk-upload
      with-credentials
      :limit="limit"
      :handle-res-code="handleRes"
      :tip="'最多上传2个文件'"
      :url="'https://jsonplaceholder.typicode.com/posts/'"
      @on-exceed="handleExceed"
    />
  </div>
</template>

<script setup>
  import BkMessage from '@bkui-vue/message';
  import BkUpload from '@bkui-vue/upload';

  const limit = 2;

  const handleExceed = (files, fileList) => {
    console.log(files, fileList, 'handleExceed');
    BkMessage({
      theme: 'danger',
      message: `最多上传${limit}个文件`,
    });
  };

  const handleRes = (response) => {
    if (response.id) {
      return true;
    }
    return false;
  };
</script>
