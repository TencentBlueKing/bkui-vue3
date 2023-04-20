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
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  ref, shallowRef,
} from 'vue';

import BKPopover from '@bkui-vue/popover';
import { debounce } from '@bkui-vue/shared';
import { HTMLAttributes } from '@vue/runtime-dom';

import props from '../props';
import getActualWidthByCanvas from '../utils/getActualWidthByCanvas';
import getActualWidthByDom from '../utils/getActualWidthByDom';

import '../overflow.less';


export default defineComponent({
  name: 'OverflowTitle',
  props,
  setup(props, { slots }) {
    const boxRef = ref<HTMLElement>(null);
    const textRef = ref<HTMLElement>(null);
    const isShowTips = ref(false);
    const textProps = shallowRef<HTMLAttributes>();
    const contentText = computed(() => {
      if (props.content) {
        return props.content;
      }
      return slots?.default?.();
    });

    onMounted(() => {
      const { clientWidth } = boxRef.value;
      const resizeHandler = debounce(500, () => {
        isShowTips.value = false;
        textProps.value = {};
        let textWidth = 0;

        if (props.calType === 'dom') {
          textWidth = getActualWidthByDom(textRef.value?.textContent, null, boxRef.value);
        } else {
          const { fontSize, fontFamily } = getComputedStyle(boxRef.value);
          textWidth = getActualWidthByCanvas(contentText.value as string, { fontSize, fontFamily });
        }
        if (textWidth > clientWidth) {
          isShowTips.value = true;
          if (props.type === 'title') {
            textProps.value = { title: textRef?.value?.innerText ?? props.content };
          }
        }
      });
      resizeHandler();
      if (props.resizeable) {
        const observer = new ResizeObserver(resizeHandler);
        observer.observe(boxRef.value);
        onUnmounted(() => {
          observer.unobserve(boxRef.value);
          observer.disconnect();
        });
      }
    });
    return {
      boxRef,
      textRef,
      isShowTips,
      contentText,
      textProps,
    };
  },
  render() {
    return (
      <div ref="boxRef" class="position-relative">
        <BKPopover disabled={this.type === 'title'}>
          {{
            default: () => (
              <div
                ref="textRef"
                class="text-ov"
                {...this.textProps}
              >
                {this.contentText}
              </div>
            ),
            content: () => this.contentText,
          }}
        </BKPopover>
      </div>
    );
  },
});
