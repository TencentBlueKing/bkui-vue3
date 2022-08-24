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
import { createApp, onMounted, onUnmounted, ref, Teleport } from 'vue';

import Arrow from './arrow';
import Content from './content';
import usePopoverInit from './use-popover-init';
export default function createPopoverComponent(options: any) {
  const props = {
    ...options,
    boundary: 'body',
    isVirtualEl: true,
    trigger: 'manual',
    disableTransform: true,
  };

  const {
    arrow = true,
    content = '',
    boundary = 'parent',
    disableTeleport = false,
    target = null,
    immediateShow = false,
  } = props;
  const popoverComponent = {
    name: '$popover',
    setup() {
      const getEventRect = ({ clientX, clientY }) => ({
        width: 0,
        height: 0,
        x: clientX,
        y: clientY - 10,
        left: clientX,
        right: clientX,
        top: clientY,
        bottom: clientY,
      });
      const refReference = ref({ $el:
        {
          getBoundingClientRect() {
            return getEventRect(target);
          },
        },
      });
      const refContent = ref();
      const refArrow = ref();
      const {
        onMountedFn,
        onUnmountedFn,
        handleClickOutside,
        beforeInstanceUnmount,
        updateBoundary,
        updatePopover,
        showFn,
        hideFn,
      } = usePopoverInit(props, { emit: () => {} }, refReference, refContent, refArrow, { value: null });

      const throttleShow = throttle(showFn, 120);
      const show = () => {
        throttleShow();
      };

      const hide = () => {
        beforeInstanceUnmount();
        hideFn();
      };

      const updatePosition = (event: MouseEvent) => {
        const virtualEl = {
          getBoundingClientRect() {
            return getEventRect(event);
          },
        };
        Object.assign(refReference.value.$el, virtualEl);
        updatePopover(null, props);
      };

      updateBoundary();
      onMounted(() => {
        onMountedFn();
        if (immediateShow) {
          setTimeout(() => {
            showFn();
          });
        }
      });
      onUnmounted(onUnmountedFn);

      return {
        refContent,
        refArrow,
        handleClickOutside,
        show,
        hide,
        updatePosition,
      };
    },
    render() {
      return <Teleport to={ boundary } disabled={ disableTeleport }>
        <Content ref="refContent"
        v-slots={ { arrow: () => (arrow ? <Arrow ref="refArrow"></Arrow> : '') } }>
          { content }
        </Content>
      </Teleport>;
    },
  };

  const popoverInstance = createApp(popoverComponent);
  let vm = popoverInstance.mount(document.createElement('div'));

  function close() {
    // (vm as any)?.hide();
    popoverInstance.unmount();
    vm = null;
  };

  function show() {
    (vm as any)?.show();
  }

  function update(e: MouseEvent) {
    (vm as any)?.updatePosition(e);
  };

  return {
    close,
    show,
    update,
    vm,
    get $el(): HTMLElement {
      return vm.$el;
    },
  };
}
