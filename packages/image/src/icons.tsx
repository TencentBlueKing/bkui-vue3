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
import { FunctionalComponent, SVGAttributes } from 'vue';

const baseAttrs: SVGAttributes = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '1em',
  height: '1em',
  fill: 'currentColor',
  viewBox: '0 0 1024 1024',
  style: 'vertical-align: middle; overflow: hidden;',
};

export const DownloadIcon: FunctionalComponent<SVGAttributes> = (_, { attrs }) => (
  <svg
    {...baseAttrs}
    {...attrs}
  >
    <path d='M512 64a32 32 0 0 1 32 32v518.4l143.36-143.36a32 32 0 1 1 45.28 45.28l-198.08 198.08a32 32 0 0 1-45.12 0L291.36 516.32a32 32 0 0 1 45.28-45.28L480 614.4V96a32 32 0 0 1 32-32z' />
    <path d='M128 768a32 32 0 0 1 32 32v96h704v-96a32 32 0 1 1 64 0v128a32 32 0 0 1-32 32H128a32 32 0 0 1-32-32v-128a32 32 0 0 1 32-32z' />
  </svg>
);
DownloadIcon.displayName = 'BkImageDownloadIcon';
DownloadIcon.inheritAttrs = false;

export const ReloadIcon: FunctionalComponent<SVGAttributes> = (_, { attrs }) => (
  <svg
    {...baseAttrs}
    {...attrs}
  >
    <path d='M512 128a384 384 0 1 1-271.36 655.36 32 32 0 1 1 45.28-45.28A320 320 0 1 0 192 512a32 32 0 0 1-64 0 384 384 0 0 1 384-384z' />
    <path d='M192 128a32 32 0 0 1 32 32v160h160a32 32 0 1 1 0 64H192a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32z' />
  </svg>
);
ReloadIcon.displayName = 'BkImageReloadIcon';
ReloadIcon.inheritAttrs = false;

export const ImageBrokenIcon: FunctionalComponent<SVGAttributes> = (_, { attrs }) => (
  <svg
    {...baseAttrs}
    {...attrs}
  >
    <path d='M880 144H144a48 48 0 0 0-48 48v640a48 48 0 0 0 48 48h736a48 48 0 0 0 48-48V192a48 48 0 0 0-48-48z m-16 672H160V208h704v608z' />
    <path d='M312 472a64 64 0 1 0 0-128 64 64 0 0 0 0 128zM280 720h464a16 16 0 0 0 12-26.4L626.24 540a16 16 0 0 0-23.84-0.32L504 651.84l-90.4-104a16 16 0 0 0-24 0L268 693.6A16 16 0 0 0 280 720z' />
  </svg>
);
ImageBrokenIcon.displayName = 'BkImageBrokenIcon';
ImageBrokenIcon.inheritAttrs = false;

export const ImageSizeIcon: FunctionalComponent<SVGAttributes> = (_, { attrs }) => (
  <svg
    {...baseAttrs}
    {...attrs}
  >
    <path d='M192 128a64 64 0 0 0-64 64v640a64 64 0 0 0 64 64h640a64 64 0 0 0 64-64V192a64 64 0 0 0-64-64H192z m0 64h640v448l-160-160-128 128-256-256-96 96V192z m0 384l96-96 256 256 128-128 160 160v160H192V576z' />
    <path d='M352 416a64 64 0 1 0 0-128 64 64 0 0 0 0 128z' />
  </svg>
);
ImageSizeIcon.displayName = 'BkImageSizeIcon';
ImageSizeIcon.inheritAttrs = false;
