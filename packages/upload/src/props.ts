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

import type { PropType } from 'vue';

import {
  APIResponse,
  EThemes,
  ExtraFormData,
  FormDataAttr,
  HeaderDataAttr,
  MaxSize,
  Theme,
  UploadFile,
  UploadRawFile,
  UploadRequestHandler,
} from './upload.type';

const themes = [EThemes.BUTTON, EThemes.DRAGGABLE, EThemes.PICTURE];

export default {
  theme: {
    type: String as PropType<Theme>,
    default: 'draggable' as Theme,
    validator: (val: EThemes) => {
      if (!val || themes.includes(val)) {
        return true;
      }
      console.error(`invalid theme, ${val}, the theme must be one of 【${themes.join(' | ')}】`);
      return false;
    },
  },
  files: {
    type: Array as PropType<UploadFile[]>,
    default: () => ([] as UploadFile[]),
  },
  name: {
    type: String,
    default: 'upload_file',
  },
  multiple: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  autoUpload: {
    type: Boolean,
    default: true,
  },
  accept: {
    type: String,
  },
  delayTime: {
    type: Number,
    default: 0,
  },
  url: {
    type: String,
    required: false,
  },
  method: {
    type: String,
    default: 'post',
  },
  size: {
    type: [Number, Object] as PropType<number | MaxSize>,
    default() {
      return {
        maxFileSize: 5,
        maxImgSize: 1,
      };
    },
  },
  handleResCode: {
    type: Function as PropType<(res: APIResponse) => boolean>,
    default(res: APIResponse) {
      if (res && res.code === 0) {
        return true;
      }
      return false;
    },
  },
  headers: {
    type: Object as PropType<Headers>,
    default: () => ({}),
  },
  header: {
    type: [Array, Object] as PropType<HeaderDataAttr[] | HeaderDataAttr>,
    default: () => [],
  },
  tip: {
    type: String,
    default: '',
  },
  validateName: {
    type: RegExp,
  },
  withCredentials: {
    type: Boolean,
    default: false,
  },
  limit: Number,
  data: {
    type: [Array, Object] as PropType<ExtraFormData[] | ExtraFormData>,
    default: () => [],
  },
  formDataAttributes: {
    type: [Array, Object] as PropType<FormDataAttr[] | FormDataAttr>,
    default: () => [],
  },
  extCls: {
    type: String,
    default: '',
  },
  customRequest: Function as PropType<UploadRequestHandler>,
  beforeUpload: {
    type: Function as PropType<(
      file: UploadRawFile
    ) => Promise<boolean> | boolean>,
  },
  beforeRemove: {
    type: Function as PropType<(
      file: UploadFile,
      uploadFiles: UploadFile[]
    ) => Promise<boolean> | boolean>,
  },
  sliceUpload: {
    type: Boolean,
    default: false,
  },
  sliceUrl: {
    type: String,
    default: '',
  },
  mergeUrl: {
    type: String,
    default: '',
  },
  chunkSize: {
    type: Number,
    default: 10,
  },
};
