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
import { computed, defineComponent, ref, watch } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { Spinner } from '@bkui-vue/icon';

import { ImageViewer } from './index';
import { propsImage as props } from './props';

export default defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'Image',
  props,
  emits: ['loaded', 'error', 'close', 'change'],
  setup(props, { emit, slots }) {
    const loading = ref(true);
    const hasError = ref(true);
    const isShowViewer = ref(false);
    const prevOverflow = ref('');
    const imageSrc = ref('');
    function clickHandler() {}
    watch(
      () => props.src,
      () => {
        loadImage();
      },
    );
    const preview = computed(() => props?.urlList?.length > 0);
    function closeViewer() {
      document.body.style.overflow = prevOverflow.value;
      isShowViewer.value = false;
      emit('close');
    }
    function change(val) {
      emit('change', val);
    }
    function loadImage() {
      loading.value = true;
      hasError.value = false;
      imageSrc.value = props.src;
    }

    const { resolveClassName } = usePrefix();

    return () => {
      function getContent() {
        if (loading.value) {
          return (
            <div class={`${resolveClassName('image-placeholder')}`}>
              <Spinner />
            </div>
          );
        }
        if (hasError.value) {
          if (slots.error) {
            if (typeof slots.error === 'function') {
              return slots.error();
            }
            return slots.error;
          }
          return (
            <div class={`${resolveClassName('image-placeholder')}`}>
              {props.fallback ? (
                <img
                  src={props.fallback}
                  alt='图片加载错误'
                />
              ) : (
                ''
              )}
              <i
                v-else
                class={`${resolveClassName('icon')} icon-image-fail`}
              ></i>
            </div>
          );
        }
        return (
          <img
            src={props.src}
            onClick={clickHandler}
            // style={{ objectFit: fit }}
          />
        );
      }
      return (
        <div class={`${resolveClassName('image')}`}>
          {getContent()}
          {preview.value && isShowViewer.value ? (
            <ImageViewer
              zIndex={props.zIndex}
              maskClose={props.maskClose}
              is-show-title={props.isShowPreviewTitle}
              url-list={props.urlList}
              onClose={closeViewer}
              onChange={change}
            />
          ) : (
            ''
          )}
        </div>
      );
    };
  },
});
