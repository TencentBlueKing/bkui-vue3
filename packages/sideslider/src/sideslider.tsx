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

import { defineComponent, ref } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import Modal from '@bkui-vue/modal';

const { propsMixin } = Modal;
const sliderPops = Object.assign({}, propsMixin);
sliderPops.width.default = '400';
sliderPops.height.default = '100%';
export default defineComponent({
  name: 'Sideslider',
  props: {
    ...sliderPops,
    direction: {
      type: String,
      default: 'right',
      validator: (value: string) => {
        const textAlign = ['left', 'right'];
        if (textAlign.indexOf(value) < 0) {
          console.error(`direction property is not valid: '${value}',【${textAlign.join(' | ')}】`);
          return false;
        }
        return true;
      },
    },
  },

  emits: ['closed', 'update:isShow', 'shown', 'hidden', 'animation-end'],

  setup(props, { slots, emit }) {
    const refRoot = ref(null);

    const handleClose = async () => {
      // 这里无需处理 beforeClose，在 modal 中会处理
      emit('update:isShow', false);
      emit('closed');
      setTimeout(() => {
        // 有动画，推迟发布事件
        emit('animation-end');
        refRoot.value?.close?.();
      }, props.hiddenDelay);
    };
    const handleShown = () => {
      // 有动画，推迟发布事件
      setTimeout(() => {
        emit('shown');
      }, 200);
    };
    const handleHidden = () => {
      // 有动画，推迟发布事件
      setTimeout(() => {
        emit('hidden');
      }, 200);
    };

    const { resolveClassName } = usePrefix();

    return () => {
      const modelSlot = {
        header: () => (
          <>
            <div class={`${resolveClassName('sideslider-header')}`}>
              <div
                class={`${resolveClassName('sideslider-close')} ${props.direction}`}
                onClick={() => handleClose()}
              />
              <div class={`${resolveClassName('sideslider-title')} ${props.direction}`}>
                {slots.header?.() ?? props.title}
              </div>
            </div>
          </>
        ),
        default: () => <div class={`${resolveClassName('sideslider-content')}`}>{slots.default?.()}</div>,
      };
      if (slots.footer) {
        Object.assign(modelSlot, {
          footer: () => {
            return <div class={`${resolveClassName('sideslider-footer')}`}>{slots.footer()}</div>;
          },
        });
      }

      return (
        <Modal
          ref={refRoot}
          {...props}
          class={{
            [resolveClassName('sideslider')]: true,
            [resolveClassName('sideslider-wrapper')]: true,
          }}
          closeIcon={false}
          onHidden={handleHidden}
          onShown={handleShown}
          onClose={handleClose}
        >
          {modelSlot}
        </Modal>
      );
    };
  },
});
