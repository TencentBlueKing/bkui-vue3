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

import { computed, defineComponent, onBeforeUnmount, shallowRef  } from 'vue';

import { classes } from '@bkui-vue/shared';

import uploadProps from './props';
import {
  APIResponse,
  CLASS_PREFIX,
  EThemes,
  SuccessResponse,
  UploadFile,
  UploadFiles,
  UploadProps,
  UploadRawFile,
  UploadRequestOptions,
} from './upload.type';
import UploadList from './upload-list';
import UploadTrigger from './upload-trigger';
import { ajaxSliceUpload, ajaxUpload } from './use-ajax-upload';
import useFileHandler from './use-file-handler';

export default defineComponent({
  name: 'Upload',
  props: uploadProps,
  emits: ['exceed', 'progress', 'success', 'error', 'delete', 'done'],
  setup(props, { slots, emit, expose }) {
    const requests = shallowRef<Record<string, XMLHttpRequest | Promise<unknown>>>({});

    const isPhotowall = computed<boolean>(() => props.theme === EThemes.PICTURE);
    const isSinglePhoto = computed<boolean>(() => isPhotowall.value && !props.multiple);

    const classNames = computed(() => classes({
      [CLASS_PREFIX]: true,
      [`${CLASS_PREFIX}--${props.theme}`]: true,
      [`${CLASS_PREFIX}--disabled`]: props.disabled,
      [`${CLASS_PREFIX}--single-picture`]: isSinglePhoto.value,
      [props.extCls]: props.extCls ?? false,
    }));

    const triggerProps = {
      theme: props.theme,
      multiple: props.multiple,
      disabled: props.disabled,
      accept: props.accept,
    };


    function onRemove(file: UploadFile, fileList: UploadFiles) {
      abort(file);
      emit('delete', file, fileList);
    }

    const {
      fileList,
      handlePreprocess,
      handleRemove,
      handleProgress,
      handleSuccess,
      handleError,
    } = useFileHandler(props, { onRemove });

    function handleFiles(files: File[]) {
      if (!files.length) {
        return;
      }

      // limit检查
      if (props.limit && fileList.value.length + files.length > props.limit) {
        emit('exceed', files, fileList.value);
        return;
      }

      let sendFiles = files;
      if (!props.multiple || props.limit === 1) {
        sendFiles = files.slice(0, 1);
      }

      for (const file of sendFiles) {
        const rawFile = file as UploadRawFile;
        const error = handlePreprocess(rawFile);

        if (error) {
          emit('error', rawFile, fileList.value, error);
          return;
        }

        if (props.autoUpload) {
          upload(rawFile, sendFiles);
        }
      }
    };

    function handleRetry(file: UploadFile) {
      send(file.raw);
    }

    async function upload(file: UploadRawFile, sendFiles: File[]) {
      if (!props.beforeUpload) {
        return send(file, sendFiles);
      }

      let beforeResult: ReturnType<UploadProps['beforeUpload']>;
      try {
        beforeResult = await props.beforeUpload?.(file);
      } catch {
        beforeResult = false;
      }

      if (beforeResult === false) {
        handleRemove(file);
        return;
      }

      send(file, sendFiles);
    }

    function send(file: UploadRawFile, sendFiles?: File[]) {
      const {
        headers,
        header,
        data,
        formDataAttributes,
        method,
        withCredentials,
        name: filename,
        url,
        sliceUrl,
        mergeUrl,
        chunkSize,
        customRequest,
      } = props;

      const { uid } = file;
      const options: UploadRequestOptions = {
        headers,
        header,
        withCredentials,
        file,
        data,
        formDataAttributes,
        method,
        filename,
        action: url,
        sliceUrl,
        mergeUrl,
        chunkSize,
        onProgress: (event) => {
          handleProgress(event, file);
          emit('progress', event, file, fileList.value);
        },
        onSuccess: (res: SuccessResponse) => {
          const result = res as APIResponse;
          if (props?.handleResCode?.(result)) {
            handleSuccess(res, file);
            emit('success', res, file, fileList.value);
          } else {
            const err = new Error(result?.message || 'unknow error');
            handleError(err, file, res);
            emit('error', file, fileList.value, err);
          }

          delete requests.value[uid];
        },
        onError: (err) => {
          handleError(err, file);
          emit('error', file, fileList.value, err);
          delete requests.value[uid];
        },
        onComplete: () => {
          if (sendFiles && sendFiles.indexOf(file) === sendFiles.length - 1) {
            emit('done', fileList.value);
          }
        },
      };

      let uploadFn = props.sliceUpload ? ajaxSliceUpload : ajaxUpload;
      if (customRequest) {
        uploadFn = customRequest;
      }
      const request = uploadFn(options);
      requests.value[uid] = request;
      if (request instanceof Promise) {
        request.then(options.onSuccess, options.onError);
      }
    }

    function abort(file?: UploadFile) {
      let reqs = requests.value;
      if (file) {
        reqs = { [file.uid]: requests.value[file.uid] };
      }
      Object.keys(reqs).forEach((uid) => {
        if (reqs[uid] instanceof XMLHttpRequest) {
          const xhr = reqs[uid] as XMLHttpRequest;
          xhr?.abort();
        }
        delete requests.value[uid];
      });
    }

    onBeforeUnmount(() => {
      fileList.value.forEach(({ url }) => {
        if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    });

    expose({
      handleRemove,
      handleRetry,
    });

    return () => (
      <div class={classNames.value}>
        {
          !isPhotowall.value && <UploadTrigger {...triggerProps} v-slots={slots} onChange={handleFiles} />
        }
        {
          slots.tip
            ? slots.tip()
            : props.tip && <div class={`${CLASS_PREFIX}__tip`}>{props.tip}</div>
        }
        <UploadList
          files={fileList.value}
          theme={props.theme}
          disabled={props.disabled}
          multiple={props.multiple}
          onRemove={handleRemove}
          onRetry={handleRetry}>
          {{
            innerTrigger: (file: UploadFile) => isPhotowall.value
              && <UploadTrigger
                {...triggerProps}
                file={file}
                v-slots={slots}
                onChange={handleFiles}
                onRemove={handleRemove} />,
            file: slots.file,
          }}
        </UploadList>
      </div>
    );
  },
});
