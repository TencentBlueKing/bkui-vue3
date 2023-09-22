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
import SparkMD5 from 'spark-md5';

import { isNullOrUndef } from '@bkui-vue/shared';

import type { UploadProgressEvent, UploadRequestHandler, UploadRequestOptions } from './upload.type';

function getRes(xhr: XMLHttpRequest): XMLHttpRequestResponseType {
  const res = xhr.responseText || xhr.response;
  if (!res) {
    return res;
  }

  try {
    return JSON.parse(res);
  } catch {
    return res;
  }
}

export const ajaxUpload: UploadRequestHandler = option => {
  if (typeof XMLHttpRequest === 'undefined') {
    throw new Error('XMLHttpRequest is undefined');
  }

  const xhr = new XMLHttpRequest();
  const { action } = option;

  if (xhr.upload) {
    xhr.upload.addEventListener('progress', event => {
      const progressEvent = event as unknown as UploadProgressEvent;
      progressEvent.percent = event.total > 0 ? (event.loaded / event.total) * 100 : 0;
      option.onProgress(progressEvent);
    });
  }

  const formData = new FormData();

  if (option.data) {
    let appendData = option.data;
    if (!Array.isArray(appendData)) {
      appendData = [appendData];
    }
    appendData.forEach(data => {
      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value)) formData.append(key, ...value);
        else formData.append(key, value);
      }
    });
  }

  if (option.formDataAttributes) {
    let appendData = option.formDataAttributes;
    if (!Array.isArray(appendData)) {
      appendData = [appendData];
    }
    appendData.forEach(item => {
      if (Array.isArray(item.value)) formData.append(item.name, ...item.value);
      else formData.append(item.name, item.value);
    });
  }

  formData.append(option.filename, option.file, option.file.name);

  xhr.addEventListener('error', () => {
    option.onError(new Error('An error occurred during upload'));
  });

  xhr.addEventListener('load', () => {
    if (xhr.status < 200 || xhr.status >= 300) {
      return option.onError(new Error('An error occurred during upload'));
    }
    option.onSuccess(getRes(xhr));
  });

  xhr.addEventListener('loadend', () => {
    option.onComplete();
  });

  xhr.open(option.method, action, true);

  if (option.withCredentials && 'withCredentials' in xhr) {
    xhr.withCredentials = true;
  }

  if (option.header) {
    if (Array.isArray(option.header)) {
      option.header.forEach(head => {
        const headerKey = head.name;
        const headerVal = head.value;
        xhr.setRequestHeader(headerKey, headerVal);
      });
    } else {
      const headerKey = option.header.name;
      const headerVal = option.header.value;
      xhr.setRequestHeader(headerKey, headerVal);
    }
  }

  const headers = option.headers || {};
  if (headers instanceof Headers) {
    headers.forEach((value, key) => xhr.setRequestHeader(key, value));
  } else {
    for (const [key, value] of Object.entries(headers)) {
      if (isNullOrUndef(value)) continue;
      xhr.setRequestHeader(key, String(value));
    }
  }

  xhr.send(formData);
  return xhr;
};

// 该方法用于在不同的浏览器使用不同的方式
const blobSlice = File.prototype.slice || (File.prototype as any).mozSlice || (File.prototype as any).webkitSlice;

export const ajaxSliceUpload: UploadRequestHandler = async option => {
  const chunkSize = option.chunkSize * 1024 * 1024;
  const { file } = option;
  if (!file) {
    throw new Error('File not found');
  }
  const blockCount = Math.ceil(file.size / chunkSize);
  const hash = await hashFile(file, chunkSize);
  const progressList = [];
  sliceSend(option, file, blockCount, hash, progressList, chunkSize);

  // 所有分片上传后，请求合并分片文件
  await Promise.all(progressList).then(() => {
    // 合并chunks
    const data = {
      size: file.size,
      name: file.name,
      total: blockCount,
      hash,
    };
    const req = new XMLHttpRequest();
    req.open(option.method, option.mergeUrl, true);
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        if (req.status < 200 || req.status >= 300) {
          return option.onError(new Error('An error occurred during upload'));
        }
        option.onSuccess(getRes(req));
      }
    };

    req.onloadend = () => {
      option.onComplete();
    };

    req.setRequestHeader('Content-type', 'application/JSON');

    req.send(JSON.stringify(data));
  });
};

// 请求分片上传，保存在progressList中
const sliceSend = (
  option: UploadRequestOptions,
  file: File,
  blockCount: string | number | Blob,
  hash: unknown,
  progressList: any[],
  chunkSize: number,
) => {
  for (let i = 0; i < blockCount; i++) {
    // eslint-disable-next-line no-loop-func
    const pooltask = new Promise((resolve, reject) => {
      const start = i * chunkSize;
      const end = Math.min(file.size, start + chunkSize);
      // 构建表单
      const formData = new FormData();
      if (option.data) {
        let appendData = option.data;
        if (!Array.isArray(appendData)) {
          appendData = [appendData];
        }
        appendData.forEach(data => {
          for (const [key, value] of Object.entries(data)) {
            if (Array.isArray(value)) formData.append(key, ...value);
            else formData.append(key, value);
          }
        });
      }

      if (option.formDataAttributes) {
        let appendData = option.formDataAttributes;
        if (!Array.isArray(appendData)) {
          appendData = [appendData];
        }
        appendData.forEach(item => {
          if (Array.isArray(item.value)) formData.append(item.name, ...item.value);
          else formData.append(item.name, item.value);
        });
      }

      formData.append('file', blobSlice.call(file, start, end));
      formData.append('name', file.name);
      formData.append('total', blockCount.toString());
      formData.append('index', i.toString());
      formData.append('size', file.size.toString());
      formData.append('hash', hash.toString());

      const xhr = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          const res = getRes(xhr);
          if (xhr.status < 200 || xhr.status >= 300) {
            reject(res);
            option.onError(new Error('An error occurred during upload'));
          } else {
            resolve('reponseText');
          }
        }
      };

      xhr.upload.addEventListener(
        'progress',
        event => {
          const progressEvent = event as unknown as UploadProgressEvent;
          option.onProgress(progressEvent, i);
        },
        false,
      );

      if (option.withCredentials && 'withCredentials' in xhr) {
        xhr.withCredentials = true;
      }

      xhr.open(option.method, option.sliceUrl, true);

      if (option.header) {
        if (Array.isArray(option.header)) {
          option.header.forEach(head => {
            const headerKey = head.name;
            const headerVal = head.value;
            xhr.setRequestHeader(headerKey, headerVal);
          });
        } else {
          const headerKey = option.header.name;
          const headerVal = option.header.value;
          xhr.setRequestHeader(headerKey, headerVal);
        }
      }

      const headers = option.headers || {};
      if (headers instanceof Headers) {
        headers.forEach((value, key) => xhr.setRequestHeader(key, value));
      } else {
        for (const [key, value] of Object.entries(headers)) {
          if (isNullOrUndef(value)) continue;
          xhr.setRequestHeader(key, String(value));
        }
      }

      xhr.send(formData);
    });

    progressList.push(pooltask);
  }
};

// SparkMD5分片文件
const hashFile = (file: File, chunkSize: number) =>
  new Promise((resolve, reject) => {
    const chunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();
    function loadNext() {
      const start = currentChunk * chunkSize;
      const end = start + chunkSize >= file.size ? file.size : start + chunkSize;
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    }
    fileReader.onload = e => {
      spark.append(e.target.result); // Append array buffer
      currentChunk += 1;
      if (currentChunk < chunks) {
        loadNext();
      } else {
        const result = spark.end();
        // 如果单纯的使用result 作为hash值的时候, 如果文件内容相同，而名称不同的时候
        // 想保留两个文件无法保留。所以把文件名称加上。
        const sparkMd5 = new SparkMD5();
        sparkMd5.append(result);
        sparkMd5.append(file.name);
        const hexHash = sparkMd5.end();
        resolve(hexHash);
      }
    };
    fileReader.onerror = () => {
      reject(new Error('File slcie failed'));
    };
    loadNext();
  }).catch(err => {
    console.log(err);
  });
