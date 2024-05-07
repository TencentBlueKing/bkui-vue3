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

import cloneDeep from 'lodash/cloneDeep';
import { defineComponent, useAttrs, useSlots, getCurrentInstance } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { AngleLeft, AngleRight } from '@bkui-vue/icon';
import Modal, { propsMixin } from '@bkui-vue/modal';
import { PropTypes } from '@bkui-vue/shared';

const sliderProps = cloneDeep(propsMixin);
sliderProps.width.default = '400';

export default defineComponent({
  name: 'Sideslider',
  inheritAttrs: false,
  props: {
    ...sliderProps,
    title: PropTypes.string.def(''),
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

  setup(props, { emit }) {
    const attrs = useAttrs();
    const slots = useSlots();
    const instance = getCurrentInstance();
    const { resolveClassName } = usePrefix();

    const handleClose = async () => {
      let shouldClose = true;
      if (typeof props.beforeClose === 'function') {
        shouldClose = await props.beforeClose();
      }
      if (shouldClose) {
        emit('update:isShow', false);
        emit('closed');
        emit('animation-end');
      }
    };

    const handleShown = () => {
      emit('shown');
    };

    const handleHidden = () => {
      emit('hidden');
    };

    return () => {
      const modelSlot = {
        header: () => (
          <>
            <div class={`${resolveClassName('sideslider-header')}`}>
              <div
                class={`${resolveClassName('sideslider-close')}`}
                onClick={handleClose}
              >
                {props.direction === 'left' ? <AngleLeft /> : <AngleRight />}
              </div>
              <div class={`${resolveClassName('sideslider-title')}`}>{slots.header?.() ?? props.title}</div>
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

      const inheritAttrs = { ...attrs };
      if (instance.vnode.scopeId) {
        inheritAttrs[instance.vnode.scopeId] = '';
      }

      return (
        <Modal
          {...inheritAttrs}
          class={{
            [resolveClassName('sideslider')]: true,
            [`is-position-${props.direction}`]: props.direction,
          }}
          isShow={props.isShow}
          width={props.width}
          animateType={props.direction}
          closeIcon={false}
          escClose={props.escClose}
          quickClose={props.quickClose}
          showMask={props.showMask}
          transfer={props.transfer}
          zIndex={props.zIndex}
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
