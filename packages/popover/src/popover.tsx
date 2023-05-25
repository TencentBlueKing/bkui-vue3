
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
import { computed, defineComponent, h, onBeforeUnmount, onMounted, ref, Teleport, toRefs, watch } from 'vue';

import { RenderType } from '@bkui-vue/shared';

import clickoutside from '../../directives/src/clickoutside';

import Arrow from './arrow';
import { EMIT_EVENT_TYPES } from './const';
import Content from './content';
import { PopoverProps } from './props';
import Reference from './reference';
import Root from './root';
import usePopoverInit from './use-popover-init';
import { isElement } from './utils';
export default defineComponent({
  name: 'Popover',
  components: {
    Content, Arrow, Root,
  },
  directives: {
    clickoutside,
  },
  props: PopoverProps,
  emits: EMIT_EVENT_TYPES,

  setup(props, ctx) {
    const { content, theme, disableTeleport } = props;
    const { reference } = toRefs(props);
    const refDefaultReference = ref();
    const refContent = ref();
    const refArrow = ref();
    const refRoot = ref();

    const refReference = computed(() => reference.value || refDefaultReference.value);

    const {
      onMountedFn,
      onUnmountedFn,
      handleClickOutside,
      beforeInstanceUnmount,
      updateBoundary,
      initPopInstance,
      showFn,
      hideFn,
      showPopover,
      hidePopover,
      updatePopover,
      stopHide,
      localIsShow,
      boundary,
    } = usePopoverInit(props, ctx, {
      refReference, refContent, refArrow, refRoot,
    });

    if (!props.always && !props.disabled) {
      watch(() => props.isShow, () => {
        props.isShow ? showPopover() : hidePopover();
      }, { immediate: true });
    }

    watch(() => [props.disabled], (val) => {
      if (val[0]) {
        beforeInstanceUnmount();
      } else {
        initPopInstance();
      }
    });

    updateBoundary();
    onMounted(onMountedFn);
    onBeforeUnmount(onUnmountedFn);

    const transBoundary = computed(() => !disableTeleport);
    const show = () => {
      showFn();
    };

    const hide = () => {
      hideFn();
    };

    const contentIsShow = computed(() => {
      if (props.renderType === RenderType.AUTO) {
        return true;
      }

      return localIsShow.value;
    });

    const renderContent = () => {
      if (props.allowHtml) {
        if (isElement(props.content)) {
          return h('div', { innerHTML: props.content.innerHTML });
        }

        if (/^(#|\.)/.test(props.content)) {
          const target = document.querySelector(props.content);
          if (isElement(target)) {
            return h('div', { innerHTML: target.innerHTML });
          }

          return content;
        }

        return h('div', { innerHTML: props.content });
      }

      return content;
    };

    return {
      boundary,
      arrow: props.arrow,
      refDefaultReference,
      refContent,
      refArrow,
      content,
      theme,
      transBoundary,
      handleClickOutside,
      updatePopover,
      hide,
      show,
      stopHide,
      contentIsShow,
      renderContent,
    };
  },

  render() {
    return <Root ref="refRoot">
      <Reference ref="refDefaultReference">
        { this.$slots.default?.() ?? <span></span> }
      </Reference>
      <Teleport to={ this.boundary } disabled={ !this.transBoundary }>
        <Content ref="refContent"
          data-theme={ this.theme }
          extCls={this.extCls}
          width={ this.width }
          height={ this.height }
          maxHeight={ this.maxHeight }
          v-clickoutside={this.handleClickOutside}
          v-slots={ { arrow: () => (this.arrow ? <Arrow ref="refArrow">{ this.$slots.arrow?.() }</Arrow> : '') } }>
          { this.contentIsShow ? this.$slots.content?.() ?? this.renderContent() : '' }
        </Content>
      </Teleport>
    </Root>;
  },
});
