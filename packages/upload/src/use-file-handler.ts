/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) is licensed under the MIT License.
 *
 * License for 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition):
 *
 * ---------------------------------------------------
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 * the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

import { computed, ref, watch } from 'vue';

import {
  EUploadStatus,
  UploadFile,
  UploadHanderHooks,
  UploadProgressEvent,
  UploadProps,
  UploadRawFile,
} from './upload.type';

function buildFileId(index: number) {
  return Date.now() + index;
}

export default (props: UploadProps, hooks: UploadHanderHooks) => {
  const maxImgSize = computed(() => {
    if (typeof props.size === 'number') {
      return props.size;
    }
    return props?.size?.maxImgSize;
  });

  const maxFileSize = computed(() => {
    if (typeof props.size === 'number') {
      return props.size;
    }
    return props?.size?.maxImgSize;
  });

  // 文件列表，包括选择的和已上传
  const fileList = ref<UploadFile[]>([]);

  function findFile(rawFile: UploadRawFile): UploadFile {
    return fileList.value.find(item => item.uid === rawFile.uid);
  }

  let activeIndex = 0;

  function handlePreprocess(file: UploadRawFile) {
    activeIndex += 1;
    file.uid = buildFileId(activeIndex);

    const uploadFile: UploadFile = {
      uid: file.uid,
      name: file.name,
      status: EUploadStatus.NEW,
      size: file.size,
      raw: file,
    };

    const isImage = file.type.startsWith('image/');
    let error = null;

    // 图片缩略图处理
    if (isImage) {
      try {
        uploadFile.url = window.URL.createObjectURL(file);
      } catch (err) {
        console.error(err);
      }
      uploadFile.isPic = true;
    }

    // 文件名称校验
    if (props.validateName && !props.validateName?.test(uploadFile.name)) {
      uploadFile.status = EUploadStatus.FAIL;
      uploadFile.statusText = 'invalid filename';
      error = new Error(uploadFile.statusText);
    }

    if (isImage && file.size > maxImgSize.value * 1024 ** 2) {
      uploadFile.status = EUploadStatus.FAIL;
      uploadFile.statusText = 'invalid file size';
      error = new Error(uploadFile.statusText);
    }

    if (!isImage && file.size > maxFileSize.value * 1024 ** 2) {
      uploadFile.status = EUploadStatus.FAIL;
      uploadFile.statusText = 'invalid file size';
      error = new Error(uploadFile.statusText);
    }

    fileList.value.push(uploadFile);

    return error;
  }

  async function handleRemove(file: UploadFile | UploadRawFile) {
    const uploadFile = file instanceof File ? findFile(file) : file;

    const remove = (file: UploadFile) => {
      hooks.onRemove(file, fileList.value);

      fileList.value.splice(fileList.value.indexOf(uploadFile), 1);

      if (file.url?.startsWith('blob:')) {
        URL.revokeObjectURL(file.url);
      }
    };

    if (props.beforeRemove) {
      const before = await props.beforeRemove?.(uploadFile, fileList.value);
      if (before !== false) {
        remove(uploadFile);
      }
    } else {
      remove(uploadFile);
    }
  }

  async function handleError(err: Error, rawFile: UploadRawFile, res?: unknown) {
    const file = findFile(rawFile);
    if (!file) return;

    file.status = 'fail';
    file.statusText = err.message;
    file.response = res;
  }

  async function handleSuccess(res: unknown, rawFile: UploadRawFile) {
    const file = findFile(rawFile);
    if (!file) return;

    file.status = 'success';
    file.response = res;
  }

  async function handleProgress(event: UploadProgressEvent, rawFile: UploadRawFile) {
    // TODO slideUpload progress

    const file = findFile(rawFile);
    if (!file) return;

    file.status = 'uploading';
    file.percentage = Math.round(event.percent);
  }

  watch(
    () => props.files,
    files => {
      fileList.value = files.map(file => {
        activeIndex += 1;
        return {
          ...file,
          uid: file.uid ?? buildFileId(activeIndex),
          status: file.status ?? EUploadStatus.SUCCESS,
        };
      });
    },
    { immediate: true, deep: true },
  );

  return {
    fileList,
    handlePreprocess,
    handleRemove,
    handleError,
    handleSuccess,
    handleProgress,
  };
};
