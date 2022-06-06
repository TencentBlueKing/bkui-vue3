
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
import { defineComponent, onMounted, onUnmounted, ref, Teleport, toRef, watch } from 'vue';

import Arrow from './arrow';
import Content from './content';
import { PopoverProps } from './props';
import Reference from './reference';
import useFloating from './use-floating';
import usePopperId from './use-popper-id';
export default defineComponent({
  name: 'Popover2',
  components: {
    Content, Arrow,
  },
  props: PopoverProps,

  setup(props, ctx) {
    const { content, theme, disableTeleport, width, height } = props;
    const refIsShow = toRef(props, 'isShow');
    const refReference = ref();
    const refContent = ref();
    const refArrow = ref();
    let storeEvents = null;

    const {
      localIsShow,
      showPopover,
      triggerPopover,
      resolveTriggerEvents,
      updatePopover,
      resolvePopElements,
      cleanup,
    } = useFloating(props, ctx, refReference, refContent, refArrow);

    const show = () => {
      localIsShow.value = true;
      triggerPopover();
    };

    const hide = () => {
      localIsShow.value = false;
      triggerPopover();
    };

    const createPopInstance = () => {
      updatePopover();
      if (props.always) {
        showPopover();
      } else {
        addEventToReferenceEl();
      }
    };

    if (!props.always && !props.disabled) {
      watch([refIsShow], () => {
        localIsShow.value = props.isShow;
        triggerPopover();
      });
    }

    watch(() => [props.disabled], (val) => {
      if (val[0]) {
        createPopInstance();
      } else {
        beforeInstanceUnmount();
      }
    });


    const addEventToReferenceEl = () => {
      const { elReference } = resolvePopElements();
      storeEvents = resolveTriggerEvents();
      storeEvents.forEach(([event, listener]) => {
        elReference.addEventListener(event, listener);
      });
    };

    const removeEventListener = () => {
      if (storeEvents?.length) {
        const { elReference } = resolvePopElements();
        if (elReference) {
          storeEvents.forEach(([event, listener]) => {
            elReference.removeEventListener(event, listener);
          });
        }

        storeEvents = null;
      }
    };

    const beforeInstanceUnmount = () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }

      removeEventListener();
    };

    onMounted(() => {
      if (props.disabled) {
        return;
      }

      createPopInstance();
    });

    onUnmounted(() => {
      beforeInstanceUnmount();
    });

    ctx.expose({
      show,
      hide,
    });

    const { prefixId } = usePopperId();
    const boundary = typeof props.boundary === 'string' ? props.boundary : prefixId;

    return {
      boundary,
      arrow: props.arrow,
      refReference,
      refContent,
      refArrow,
      content,
      theme,
      disableTeleport,
      width,
      height,
    };
  },

  render() {
    return <>
    <Reference ref="refReference">
      { this.$slots.default?.() ?? <span></span> }
    </Reference>
    <Teleport to={ this.boundary } disabled={ this.disableTeleport }>
      <Content ref="refContent" data-theme={ this.theme } width={ this.width } height={ this.height }
      v-slots={ { arrow: () => (this.arrow ? <Arrow ref="refArrow">{ this.$slots.arrow?.() }</Arrow> : '') } }>
        { this.$slots.content?.() ?? this.content }
      </Content>
    </Teleport>
    </>;
  },
});
