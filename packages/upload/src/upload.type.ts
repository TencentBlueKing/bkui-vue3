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

import { ExtractPropTypes } from 'vue';

import uploadProps from './props';

export const CLASS_PREFIX = 'bk-upload';

export const enum EThemes {
  BUTTON = 'button',
  DRAGGABLE = 'draggable',
  PICTURE = 'picture',
}

export type Theme = Lowercase<keyof typeof EThemes>;

export const enum EUploadStatus {
  NEW = 'new',
  UPLOADING = 'uploading',
  SUCCESS = 'success',
  FAIL = 'fail',
}

export type UploadStatus = Lowercase<keyof typeof EUploadStatus>;

export type FormDataAttr = { name: string; value: string | Blob | [string | Blob, string] };

export type HeaderDataAttr = { name: string; value: string };

export type ExtraFormData = Record<string, string | Blob | [string | Blob, string]>;

export type UploadFiles = UploadFile[];

export type UploadFile = {
  name: string;
  status: UploadStatus;
  statusText?: string;
  percentage?: number;
  response?: unknown;
  size: number;
  uid: number;
  url?: string;
  raw: UploadRawFile;
  isPic?: boolean;
};

export interface UploadRawFile extends File {
  uid: number;
}

export type MaxSize = {
  maxFileSize: number;
  maxImgSize: number;
};

export interface UploadProgressEvent extends ProgressEvent {
  percent: number;
}

export interface APIResponse {
  code: number;
  data: unknown;
  message?: string;
}

export type SuccessResponse = APIResponse | XMLHttpRequestResponseType | unknown;

export type UploadProps = ExtractPropTypes<typeof uploadProps>;

export interface UploadRequestOptions {
  action: string;
  method: string;
  data?: ExtraFormData | ExtraFormData[];
  formDataAttributes?: FormDataAttr | FormDataAttr[];
  filename: string;
  file: File;
  headers?: Headers | Record<string, string | number | null | undefined>;
  header?: HeaderDataAttr | HeaderDataAttr[];
  withCredentials: boolean;
  sliceUrl: string;
  mergeUrl: string;
  chunkSize: number;
  onProgress: (event: UploadProgressEvent, i?: number) => void;
  onError: (error: Error) => void;
  onSuccess: (res: SuccessResponse) => void;
  onComplete: () => void;
}

export type UploadRequestHandler = (options: UploadRequestOptions) => XMLHttpRequest | Promise<unknown>;

export type HookHandler = (uploadFile: UploadFile, uploadFiles: UploadFiles) => void;

export interface UploadHanderHooks {
  onRemove: HookHandler;
}
