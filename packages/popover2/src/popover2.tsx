
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
import { computed, defineComponent, onMounted, onUnmounted, ref, Teleport, watch } from 'vue';

import { clickoutside } from '@bkui-vue/directives';

import Arrow from './arrow';
import { EMIT_EVENT_TYPES, EMITEVENTS } from './const';
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
  directives: {
    clickoutside,
  },
  props: PopoverProps,
  emits: EMIT_EVENT_TYPES,

  setup(props, ctx) {
    const { content, theme, width, height, disableTeleport } = props;
    const refReference = ref();
    const refContent = ref();
    const refArrow = ref();
    const isFullscreen = ref(false);
    let storeEvents = null;

    const {
      localIsShow,
      showPopover,
      hidePopover,
      resolveTriggerEvents,
      updatePopover,
      resolvePopElements,
      isElementFullScreen,
      cleanup,
    } = useFloating(props, ctx, refReference, refContent, refArrow);

    const show = () => {
      showPopover();
    };

    const hide = () => {
      hidePopover();
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
      watch(() => props.isShow, () => {
        props.isShow ? showPopover() : hidePopover();
      }, { immediate: true });
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

    const { getPrefixId, resetFullscreenElementTag } = usePopperId(props);
    const boundary = ref('');
    boundary.value = getPrefixId();

    const beforeInstanceUnmount = () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }

      removeEventListener();
    };

    const handleFullscrennChange = () => {
      isFullscreen.value = isElementFullScreen();
      resetFullscreenElementTag();
      boundary.value = getPrefixId();
    };

    onMounted(() => {
      if (props.disabled) {
        return;
      }

      createPopInstance();
      document.body.addEventListener('fullscreenchange', handleFullscrennChange);
    });

    onUnmounted(() => {
      beforeInstanceUnmount();
      document.body.removeEventListener('fullscreenchange', handleFullscrennChange);
    });

    ctx.expose({
      show,
      hide,
    });


    const handleClickOutside = (_e: MouseEvent) => {
      ctx.emit(EMITEVENTS.CLICK_OUTSIDE, { isShow: localIsShow.value });
      if (props.disableOutsideClick || props.always || props.disabled || props.trigger === 'manual') {
        return;
      }

      if (localIsShow.value) {
        hide();
      }
    };
    const transBoundary = computed(() => isFullscreen.value || !disableTeleport);

    return {
      boundary,
      arrow: props.arrow,
      refReference,
      refContent,
      refArrow,
      content,
      theme,
      transBoundary,
      width,
      height,
      handleClickOutside,
    };
  },

  render() {
    return <>
    <Reference ref="refReference">
      { this.$slots.default?.() ?? <span></span> }
    </Reference>
    <Teleport to={ this.boundary } disabled={ !this.transBoundary }>
      <Content ref="refContent" data-theme={ this.theme } width={ this.width } height={ this.height }
      v-clickoutside={this.handleClickOutside}
      v-slots={ { arrow: () => (this.arrow ? <Arrow ref="refArrow">{ this.$slots.arrow?.() }</Arrow> : '') } }>
        { this.$slots.content?.() ?? this.content }
      </Content>
    </Teleport>
    </>;
  },
});
