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
import { defineComponent, PropType } from 'vue';

import { useLocale, usePrefix } from '@bkui-vue/config-provider';
import { EnlargeLine, NarrowLine, Original, RightTurnLine } from '@bkui-vue/icon';
import { PropTypes } from '@bkui-vue/shared';

import { DownloadIcon, ImageSizeIcon } from './icons';

export interface CurrentImageInfo {
  width?: number;
  resolution?: string;
}

export default defineComponent({
  name: 'BkImagePreviewToolbar',
  props: {
    activeIndex: PropTypes.number.def(0),
    total: PropTypes.number.def(1),
    isMultiple: PropTypes.bool.def(false),
    showInfo: PropTypes.bool.def(false),
    currentImageInfo: {
      type: Object as PropType<CurrentImageInfo | null>,
      default: null,
    },
  },
  emits: {
    zoomIn: () => true,
    zoomOut: () => true,
    rotate: () => true,
    reset: () => true,
    download: () => true,
  },
  setup(props, { emit, slots }) {
    const t = useLocale('image');
    const { resolveClassName } = usePrefix();

    const renderBtn = (tooltip: string, onClick: () => void, content: JSX.Element) => (
      <div
        class={resolveClassName('image-preview-toolbar-btn')}
        data-tooltip={tooltip}
        onClick={onClick}
      >
        {content}
      </div>
    );

    return () => {
      const info = props.currentImageInfo;
      const showInfoBlock = props.showInfo && info && (info.width != null || info.resolution);

      return (
        <div class={resolveClassName('image-preview-toolbar')}>
          <div class={resolveClassName('image-preview-toolbar-inner')}>
            {props.isMultiple && [
              <span class={resolveClassName('image-preview-toolbar-pages')}>
                {props.activeIndex + 1} / {props.total}
              </span>,
              <span class={resolveClassName('image-preview-toolbar-divider')} />,
            ]}
            {renderBtn(t.value.zoomOut, () => emit('zoomOut'), <NarrowLine />)}
            {renderBtn(t.value.zoomIn, () => emit('zoomIn'), <EnlargeLine />)}
            {renderBtn(t.value.rotate, () => emit('rotate'), <RightTurnLine />)}
            {renderBtn(t.value.reset, () => emit('reset'), <Original />)}
            {renderBtn(t.value.download, () => emit('download'), <DownloadIcon />)}
            {slots.extra && [<span class={resolveClassName('image-preview-toolbar-divider')} />, slots.extra()]}
            {showInfoBlock && [
              <span class={resolveClassName('image-preview-toolbar-divider')} />,
              <div class={resolveClassName('image-preview-toolbar-info')}>
                {info.width != null && [
                  <ImageSizeIcon class={resolveClassName('image-preview-toolbar-info-icon')} />,
                  <span>
                    {info.width} px {t.value.width}
                  </span>,
                ]}
                {info.resolution && [
                  <span class={resolveClassName('image-preview-toolbar-info-dot')} />,
                  <ImageSizeIcon class={resolveClassName('image-preview-toolbar-info-icon')} />,
                  <span>{info.resolution}</span>,
                ]}
              </div>,
            ]}
          </div>
        </div>
      );
    };
  },
});
