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
import { computed, defineComponent, onBeforeUnmount, shallowRef, Teleport, toRef, Transition, watch } from 'vue';

import { useLocale, usePrefix } from '@bkui-vue/config-provider';
import { AngleLeft, AngleRight, Close } from '@bkui-vue/icon';

import { ImageBrokenIcon } from './icons';
import PreviewToolbar from './preview-toolbar';
import { imagePreviewProps } from './props';
import { useImageTransform } from './use-image-transform';
import { usePreviewKeyboard } from './use-preview-keyboard';

import type { ImageItem, ImageLoadingStatus } from './types';

export default defineComponent({
  name: 'ImagePreview',
  props: imagePreviewProps,
  emits: {
    'update:modelValue': (val: boolean) => typeof val === 'boolean',
    'update:current': (val: number) => typeof val === 'number',
  },
  setup(props, { emit, slots }) {
    const { resolveClassName } = usePrefix();
    const t = useLocale('image');

    const visible = toRef(props, 'modelValue');
    const activeIndex = toRef(props, 'current');

    const {
      imageStyle,
      resetTransform,
      zoomIn,
      zoomOut,
      rotateCW,
      handleWheel,
      handleDragStart,
      cleanupDragListeners,
    } = useImageTransform();

    const currentStatus = shallowRef<ImageLoadingStatus>('loading');

    // 用于 File -> ObjectURL 的内存管理
    const objectUrls: string[] = [];

    const revokeObjectUrls = () => {
      for (const url of objectUrls) {
        URL.revokeObjectURL(url);
      }
      objectUrls.length = 0;
    };

    const fileToImageItem = (file: File): ImageItem => {
      const url = URL.createObjectURL(file);
      objectUrls.push(url);
      return { url, name: file.name, file };
    };

    const normalizedImages = computed<ImageItem[]>(() => {
      // 每次列表变化都先释放旧的 ObjectURL，避免内存泄漏
      revokeObjectUrls();
      return props.images.map(img => {
        if (img instanceof File) {
          return fileToImageItem(img);
        }
        if (typeof img === 'string') {
          return { url: img };
        }
        if (img.file && !img.url) {
          return { ...img, url: fileToImageItem(img.file).url };
        }
        return img;
      });
    });

    const isMultiple = computed(() => normalizedImages.value.length > 1);

    const currentImage = computed<ImageItem>(() => normalizedImages.value[activeIndex.value] ?? { url: '' });

    const currentImageInfo = computed(() => {
      const img = currentImage.value;
      if (img.width == null && !img.resolution) {
        return null;
      }
      return { width: img.width, resolution: img.resolution };
    });

    const updateVisible = (val: boolean) => {
      emit('update:modelValue', val);
    };

    const handleClose = () => {
      updateVisible(false);
    };

    const handleMaskClick = () => {
      if (props.maskClosable) {
        handleClose();
      }
    };

    const switchImage = (index: number) => {
      emit('update:current', index);
      resetTransform();
      currentStatus.value = 'loading';
    };

    const handlePrev = () => {
      const len = normalizedImages.value.length;
      const next = activeIndex.value > 0 ? activeIndex.value - 1 : len - 1;
      switchImage(next);
    };

    const handleNext = () => {
      const len = normalizedImages.value.length;
      const next = activeIndex.value < len - 1 ? activeIndex.value + 1 : 0;
      switchImage(next);
    };

    const handleDownload = () => {
      const img = currentImage.value;
      const url = img.downloadUrl || img.url;
      if (props.onDownload) {
        props.onDownload(url, img);
        return;
      }
      const link = document.createElement('a');
      link.href = url;
      link.download = img.name || url.split('/').pop() || 'image';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const handleImageLoad = () => {
      currentStatus.value = 'loaded';
    };

    const handleImageError = () => {
      currentStatus.value = 'error';
    };

    const handleWheelPrevent = (e: WheelEvent) => {
      e.preventDefault();
      handleWheel(e);
    };

    watch(visible, val => {
      if (val) {
        currentStatus.value = 'loading';
        resetTransform();
      } else {
        revokeObjectUrls();
        cleanupDragListeners();
      }
    });

    // 列表数量变化或外部更新 current 时，纠正越界
    watch(
      () => normalizedImages.value.length,
      len => {
        if (activeIndex.value > len - 1) {
          emit('update:current', Math.max(0, len - 1));
        }
      },
    );

    onBeforeUnmount(() => {
      revokeObjectUrls();
      cleanupDragListeners();
    });

    usePreviewKeyboard({
      visible,
      onClose: handleClose,
      onPrev: () => isMultiple.value && handlePrev(),
      onNext: () => isMultiple.value && handleNext(),
    });

    const renderBody = () => {
      const status = currentStatus.value;
      const img = currentImage.value;

      return (
        <div
          class={resolveClassName('image-preview-body')}
          onClick={(e: MouseEvent) => {
            if (e.target === e.currentTarget) {
              handleMaskClick();
            }
          }}
          onMousedown={handleDragStart}
        >
          {status !== 'error' && (
            <img
              style={imageStyle.value}
              class={resolveClassName('image-preview-img')}
              draggable={false}
              src={img.url}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          )}
          {status === 'error' && (
            <div class={resolveClassName('image-preview-error')}>
              <ImageBrokenIcon class={resolveClassName('image-preview-error-icon')} />
              <p class={resolveClassName('image-preview-error-text')}>{t.value.loadFailed}</p>
            </div>
          )}
          {status === 'loading' && img.thumbnailUrl && (
            <div class={resolveClassName('image-preview-loading')}>
              <img
                style={imageStyle.value}
                class={[resolveClassName('image-preview-img'), resolveClassName('image-preview-img--blur')]}
                draggable={false}
                src={img.thumbnailUrl}
              />
            </div>
          )}
        </div>
      );
    };

    return () => (
      <Teleport to='body'>
        <Transition name={resolveClassName('image-preview-fade')}>
          {visible.value && (
            <div
              class={resolveClassName('image-preview')}
              onWheel={handleWheelPrevent}
            >
              <div
                class={resolveClassName('image-preview-close')}
                onClick={handleClose}
              >
                <Close class={resolveClassName('image-preview-close-icon')} />
              </div>

              {isMultiple.value && [
                <div
                  class={[resolveClassName('image-preview-arrow'), resolveClassName('image-preview-arrow-left')]}
                  onClick={handlePrev}
                >
                  <AngleLeft class={resolveClassName('image-preview-arrow-icon')} />
                </div>,
                <div
                  class={[resolveClassName('image-preview-arrow'), resolveClassName('image-preview-arrow-right')]}
                  onClick={handleNext}
                >
                  <AngleRight class={resolveClassName('image-preview-arrow-icon')} />
                </div>,
              ]}

              {renderBody()}

              <PreviewToolbar
                activeIndex={activeIndex.value}
                currentImageInfo={currentImageInfo.value}
                isMultiple={isMultiple.value}
                showInfo={props.showInfo}
                total={normalizedImages.value.length}
                onDownload={handleDownload}
                onReset={resetTransform}
                onRotate={rotateCW}
                onZoomIn={zoomIn}
                onZoomOut={zoomOut}
              >
                {{
                  extra: slots.extra ? () => slots.extra?.() : undefined,
                }}
              </PreviewToolbar>
            </div>
          )}
        </Transition>
      </Teleport>
    );
  },
});
