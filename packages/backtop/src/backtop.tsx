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

import { throttle } from 'lodash';
import {
  type Ref,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  Transition,
  watch,
} from 'vue';

import { AngleUp } from '@bkui-vue/icon';
import { bkZIndexManager, PropTypes } from '@bkui-vue/shared';


export default defineComponent({
  name: 'Backtop',
  props: {
    visibilityHeight: PropTypes.number.def(200),
    target: PropTypes.string.def(''),
    right: PropTypes.number.def(40),
    bottom: PropTypes.number.def(40),
    extCls: PropTypes.string.def(''),
  },
  setup(props, { slots }) {
    const container: Ref<Document | HTMLElement | null> = ref(null);
    const el: Ref<HTMLElement | null> = ref(null);
    const visible: Ref<boolean> = ref(false);
    const zIndex: Ref<number> = ref(bkZIndexManager.getModalNextIndex());

    const styleBottom = `${props.bottom}px`;
    const styleRight = `${props.right}px`;

    const scrollHandler = throttle(() => {
      visible.value = el.value!.scrollTop >= props.visibilityHeight;
    }, 30);

    const scrollTop = () => {
      el.value!.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };

    watch(() => visible, () => {
      zIndex.value = bkZIndexManager.getModalNextIndex();
    });

    onMounted(() => {
      container.value = document;
      el.value = document.documentElement;
      if (props.target) {
        el.value = document.querySelector(props.target);
        if (!el.value) {
          throw new Error('target does not exist');
        }
        container.value = el.value;
      }
      container.value!.addEventListener('scroll', scrollHandler);
    });

    onBeforeUnmount(() => {
      container.value!.removeEventListener('scroll', scrollHandler);
    });

    return () => (
      <Transition name="bk-fade">
        { visible.value
          ? <div
            class={`bk-backtop ${props.extCls}`}
            style={{
              right: styleRight,
              bottom: styleBottom,
              zIndex: zIndex.value,
            }}
            onClick={scrollTop}>
            {slots.default?.() ?? <AngleUp style={{ fontSize: '14px' }}></AngleUp>}
          </div>
          : ''
        }
      </Transition>
    );
  },
});
