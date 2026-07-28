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
import { computed, CSSProperties, defineComponent, inject, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';

import { useLocale, usePrefix } from '@bkui-vue/config-provider';
import { ImgError } from '@bkui-vue/icon';

import { ReloadIcon } from './icons';
import ImagePreview from './image-preview';
import { imageProps } from './props';
import { IMAGE_PREVIEW_GROUP_KEY } from './types';

import type { ImageItem, ImageLoadingStatus } from './types';

export default defineComponent({
  name: 'Image',
  props: imageProps,
  emits: {
    load: (e: Event) => e instanceof Event,
    error: (e: Event) => e instanceof Event,
    preview: () => true,
  },
  setup(props, { emit, slots, expose }) {
    const { resolveClassName } = usePrefix();
    const t = useLocale('image');

    const groupContext = inject(IMAGE_PREVIEW_GROUP_KEY, null);

    // 每个 Image 实例的唯一标识（用于 group 注册）
    const uid = Symbol('BkImage');

    const containerRef = ref<HTMLElement>();
    const status = shallowRef<ImageLoadingStatus>('loading');
    const previewVisible = shallowRef(false);
    const isInView = shallowRef(!props.lazy);
    const reloadToken = shallowRef(0);

    let observer: IntersectionObserver | null = null;

    const previewSrc = computed(() => props.previewProps?.src || props.src);

    const getPreviewItem = (): ImageItem => {
      const pp = props.previewProps;
      return {
        url: previewSrc.value,
        name: pp?.name,
        width: pp?.width,
        resolution: pp?.resolution,
        downloadUrl: pp?.downloadUrl,
      };
    };

    const actualSrc = computed(() => {
      if (props.lazy && !isInView.value) {
        return '';
      }
      const base = props.src;
      if (reloadToken.value === 0) {
        return base;
      }
      // 重新加载时附加时间戳避免命中缓存
      return `${base}${base.includes('?') ? '&' : '?'}_t=${reloadToken.value}`;
    });

    const standalonePreviewImages = computed<ImageItem[]>(() => [getPreviewItem()]);

    const containerStyle = computed<CSSProperties>(() => {
      const style: CSSProperties = {};
      if (props.width != null) {
        style.width = typeof props.width === 'number' ? `${props.width}px` : props.width;
      }
      if (props.height != null) {
        style.height = typeof props.height === 'number' ? `${props.height}px` : props.height;
      }
      return style;
    });

    const innerStyle = computed<CSSProperties>(() => ({
      width: '100%',
      height: '100%',
      objectFit: props.fit,
    }));

    const handleLoad = (ev: Event) => {
      status.value = 'loaded';
      emit('load', ev);
    };

    const handleError = (ev: Event) => {
      status.value = 'error';
      emit('error', ev);
    };

    const handleReload = (ev: MouseEvent) => {
      ev.stopPropagation();
      status.value = 'loading';
      reloadToken.value = Date.now();
    };

    const handleImageClick = () => {
      if (!props.preview || status.value !== 'loaded') {
        return;
      }
      if (groupContext) {
        groupContext.preview(uid);
      } else {
        previewVisible.value = true;
      }
      emit('preview');
    };

    const updatePreviewVisible = (val: boolean) => {
      previewVisible.value = val;
    };

    const initObserver = () => {
      if (!props.lazy || !containerRef.value || typeof IntersectionObserver === 'undefined') {
        return;
      }
      observer = new IntersectionObserver(
        entries => {
          if (entries[0]?.isIntersecting) {
            isInView.value = true;
            observer?.disconnect();
            observer = null;
          }
        },
        { rootMargin: '200px' },
      );
      observer.observe(containerRef.value);
    };

    const destroyObserver = () => {
      observer?.disconnect();
      observer = null;
    };

    onMounted(() => {
      initObserver();
      groupContext?.register(uid, getPreviewItem);
    });

    onBeforeUnmount(() => {
      destroyObserver();
      groupContext?.unregister(uid);
    });

    expose({
      previewVisible,
      reload: () => handleReload(new MouseEvent('reload')),
    });

    return () => {
      const isPreviewable = props.preview && status.value === 'loaded';

      const classNames = [
        resolveClassName('image'),
        {
          [resolveClassName('image-error')]: status.value === 'error',
          [resolveClassName('image-preview-cursor')]: isPreviewable,
        },
        props.extCls,
      ];

      return (
        <div
          ref={containerRef}
          style={containerStyle.value}
          class={classNames}
          onClick={handleImageClick}
        >
          {status.value !== 'error' && actualSrc.value && (
            <img
              style={innerStyle.value}
              class={resolveClassName('image-inner')}
              alt={props.alt}
              src={actualSrc.value}
              onError={handleError}
              onLoad={handleLoad}
            />
          )}

          {status.value === 'error' && (
            <div class={resolveClassName('image-error-content')}>
              <ImgError class={resolveClassName('image-error-icon')} />
            </div>
          )}

          {status.value === 'error' && (
            <div
              class={resolveClassName('image-error-overlay')}
              onClick={handleReload}
            >
              <ReloadIcon class={resolveClassName('image-reload-icon')} />
              <span>{t.value.reload}</span>
            </div>
          )}

          {slots.default?.()}

          {!groupContext && props.preview && previewVisible.value && (
            <ImagePreview
              images={standalonePreviewImages.value}
              modelValue={previewVisible.value}
              showInfo={props.showInfo}
              onDownload={props.onDownload}
              onUpdate:modelValue={updatePreviewVisible}
            >
              {{
                extra: slots.extra ? () => slots.extra?.() : undefined,
              }}
            </ImagePreview>
          )}
        </div>
      );
    };
  },
});
