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
import throttle from 'lodash/throttle';
import { type Ref, ref, useSlots, watch } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';

import type { ModalProps } from './modal';

export const useContentResize = (root: Ref<HTMLElement>, props: ModalProps) => {
  const { resolveClassName } = usePrefix();
  const slots = useSlots();

  const isContentScroll = ref(false);
  const contentStyles = ref({});

  let observer;

  const handleContentBoxChange = () => {
    if (!slots.footer) {
      return;
    }

    const calcContentScroll = throttle(() => {
      const { height: headerHeight } = root.value
        .querySelector(`.${resolveClassName('modal-header')}`)
        .getBoundingClientRect();

      const { height: contentHeight } = root.value
        .querySelector(`.${resolveClassName('modal-content')}`)
        .getBoundingClientRect();

      const { height: footerHeight } = root.value
        .querySelector(`.${resolveClassName('modal-footer')}`)
        .getBoundingClientRect();

      const windowInnerHeight = window.innerHeight;

      isContentScroll.value = windowInnerHeight < headerHeight + contentHeight + footerHeight;
      if (isContentScroll.value || props.fullscreen) {
        contentStyles.value = {
          height: `${windowInnerHeight - headerHeight - footerHeight}px`,
          overflow: 'scroll',
        };
      } else {
        contentStyles.value = {};
      }
    }, 100);

    observer = new MutationObserver(() => {
      calcContentScroll();
    });

    observer.observe(root.value.querySelector(`.${resolveClassName('modal-content')} div`), {
      subtree: true,
      attributes: true,
      childList: true,
    });

    calcContentScroll();
  };

  watch(
    () => props.isShow,
    () => {
      if (props.isShow) {
        setTimeout(() => {
          handleContentBoxChange();
        }, 100);
      } else {
        if (observer) {
          observer.takeRecords();
          observer.disconnect();
          observer = null;
        }
      }
    },
    {
      immediate: true,
    },
  );

  return {
    contentStyles,
    isContentScroll,
  };
};
