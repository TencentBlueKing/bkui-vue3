<template>
  <div class="demo">
    <bk-upload
      :handle-res-code="handleRes"
      :select-change="handleSelectChange"
      :tip="'只允许上传JPG、PNG、JPEG、ZIP的文件'"
      :url="'https://jsonplaceholder.typicode.com/posts/'"
      :files="fileList"
      with-credentials
      @done="handleDone"
      @error="handleError"
      @progress="handleProgress"
      @success="handleSuccess"
      :before-upload="handleBeforeUpload"
    />
  </div>
</template>

<script setup>
  import BkUpload from '@bkui-vue/upload';
  import { Message } from 'bkui-vue';
  import { ref } from 'vue';

  let fileList = ref([]);
  const handleSuccess = (file, fileList) => {
    console.log(file, fileList, 'handleSuccess');
  };
  const handleProgress = (event, file, fileList) => {
    console.log(event, file, fileList, 'handleProgress');
  };
  const handleError = (file, fileList, error) => {
    console.log(file, fileList, error, 'handleError');
  };
  const handleDone = fileList => {
    console.log(fileList, 'handleDone');
    fileList.value = [...fileList]
  };
  const handleRes = response => {
    console.log(response, 'handleRes');
    if (response.id) {
      return true;
    }
    return false;
  };
  const handleBeforeUpload = (file, fileList) => {
    const whiteList = ['jpg', 'jpeg', 'png', 'zip'];
    let AllFiles = fileList.filter((v) => whiteList.includes(v.name.substring(file.name.lastIndexOf('.') + 1)));
    if(AllFiles.length !== fileList.length) {
      fileList.pop();
      Message({
        theme: 'warning',
        message: '允许上传JPG、PNG、JPEG、ZIP的文件'
      });
      return false;
    }
    return true;
  };
  const handleSelectChange = event => {
    console.log(event, 'change');
  };
</script>

<style lang="less">
  .demo {
    padding: 24px;
  }
</style>
