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
import { PropTypes } from '@bkui-vue/shared';

import type { ImageItem, ImagePreviewMeta } from './types';
import type { PropType } from 'vue';

export const imageProps = {
  /** 图片地址 */
  src: PropTypes.string.def(''),
  /** 替代文字 */
  alt: PropTypes.string.def(''),
  /** 容器宽度 */
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** 容器高度 */
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** 图片填充方式（同 CSS object-fit） */
  fit: {
    type: String as PropType<'contain' | 'cover' | 'fill' | 'none' | 'scale-down'>,
    default: 'cover',
  },
  /** 是否懒加载（基于 IntersectionObserver） */
  lazy: PropTypes.bool.def(false),
  /** 是否启用点击大图预览 */
  preview: PropTypes.bool.def(true),
  /** 大图模式下是否显示图片信息（宽度/分辨率） */
  showInfo: PropTypes.bool.def(false),
  /** 自定义下载逻辑，传入则禁用默认下载行为 */
  onDownload: {
    type: Function as PropType<(url: string, item: ImageItem) => void>,
    default: undefined,
  },
  /** 单图预览时透传给 ImagePreview 的额外信息 */
  previewProps: {
    type: Object as PropType<ImagePreviewMeta>,
    default: undefined,
  },
  /** 自定义类名 */
  extCls: PropTypes.string.def(''),
};

export const imagePreviewProps = {
  /** 是否可见 */
  modelValue: PropTypes.bool.def(false),
  /** 当前预览索引 */
  current: PropTypes.number.def(0),
  /** 待预览的图片列表，元素支持 string、File、ImageItem */
  images: {
    type: Array as PropType<(File | ImageItem | string)[]>,
    default: () => [],
  },
  /** 是否点击遮罩关闭 */
  maskClosable: PropTypes.bool.def(true),
  /** 是否显示图片信息（宽度/分辨率） */
  showInfo: PropTypes.bool.def(false),
  /** 自定义下载逻辑 */
  onDownload: {
    type: Function as PropType<(url: string, item: ImageItem) => void>,
    default: undefined,
  },
};

export const imagePreviewGroupProps = {
  /** 是否点击遮罩关闭 */
  maskClosable: PropTypes.bool.def(true),
  /** 是否显示图片信息（宽度/分辨率） */
  showInfo: PropTypes.bool.def(false),
  /** 自定义下载逻辑 */
  onDownload: {
    type: Function as PropType<(url: string, item: ImageItem) => void>,
    default: undefined,
  },
};
