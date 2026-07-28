/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2025 Tencent.  All rights reserved.
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
import type { InjectionKey } from 'vue';

export type ImageLoadingStatus = 'error' | 'loaded' | 'loading';

export interface ImageItem {
  /** 图片预览地址 */
  url: string;
  /** 缩略图地址（用于大图加载过渡） */
  thumbnailUrl?: string;
  /** 图片名称（用于下载文件名） */
  name?: string;
  /** 原始 File 对象（本地文件预览场景） */
  file?: File;
  /** 图片宽度（信息展示用） */
  width?: number;
  /** 分辨率（信息展示用，例如 1920x1080） */
  resolution?: string;
  /** 自定义下载地址，不传则使用 url */
  downloadUrl?: string;
}

/** 单图独立预览时透传给 ImagePreview 的额外信息 */
export interface ImagePreviewMeta {
  src?: string;
  name?: string;
  width?: number;
  height?: number;
  resolution?: string;
  downloadUrl?: string;
}

export interface ImagePreviewGroupContext {
  register: (uid: symbol, getItem: () => ImageItem) => void;
  unregister: (uid: symbol) => void;
  preview: (uid: symbol) => void;
}

export const IMAGE_PREVIEW_GROUP_KEY: InjectionKey<ImagePreviewGroupContext> = Symbol('BkImagePreviewGroup');
