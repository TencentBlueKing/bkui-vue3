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

import { computed, defineComponent, toRefs, watch, onMounted, ref, onBeforeUnmount, SetupContext } from 'vue';
import {
  IBKPopover,
  BKPopover,
  bkZIndexManager,
} from '@bkui-vue/shared';
import { Placement } from '@popperjs/core';

import { PopoverProps, PopoverPropTypes } from './props';


export default defineComponent({
  name: 'Popover',
  props: PopoverProps,
  setup(props: PopoverPropTypes, ctx: SetupContext) {
    let isPopInstance = false;
    let popoverInstance = Object.create(null);
    const { width, height, theme, trigger, isShow, placement, modifiers, arrow, content } = toRefs(props);

    const reference = ref();
    const refContent = ref();

    const compStyle = computed(() => ({
      width: /^\d+$/.test(width.value) ? `${width.value}px` : width.value,
      height: /^\d+$/.test(height.value) ? `${height.value}px` : height.value,
      zIndex: bkZIndexManager.getModalNextIndex(),
    }));

    const themeList = ['dark', 'light'];
    const compTheme = computed(() => {
      const themes = theme.value.split(/\s+/);
      themes.sort((a: string, b: string) => Number(themeList.includes(b)) - (Number(themeList.includes(a))));
      const systemThemes = themes;
      const customThemes = themes.filter((item: string) => !themeList.includes(item));
      return { systemThemes, customThemes };
    });

    const handleManualShow = (val) => {
      if (trigger === 'manual' && isPopInstance) {
        val ? popoverInstance.show() : popoverInstance.hide();
      }
    };

    watch(() => props.isShow, () => {
      handleManualShow(true);
    }, { immediate: true });

    // const handleClose = () => {
    //   ctx.$emit('update:isShow', false);
    // };

    const getOptions = () => ({
      theme: compTheme.value.systemThemes.join(' '),
      placement: placement.value as Placement,
      trigger: trigger.value,
      modifiers: modifiers.value,
      onFirstUpdate: props.handleFirstUpdate,
    });

    const destroyPopInstance = () => {
      const instance = popoverInstance as IBKPopover;
      instance.isShow && instance.hide();
      instance.destroy();
      popoverInstance = Object.create(null);
    };

    const initPopInstance = () => {
      popoverInstance = new BKPopover(
        reference.value as HTMLElement,
        refContent.value as HTMLElement,
        getOptions(),
      );
      isPopInstance = true;
      // 初次渲染默认isShow 为True时，触发
      handleManualShow(isShow);
    };

    const update = () => {
      destroyPopInstance();
      initPopInstance();
    };

    ctx.expose({
      update,
    });

    onMounted(initPopInstance);
    onBeforeUnmount(destroyPopInstance);

    return () => {
      // 兼容多种样式处理规则
    // class custom-theme
      const customThemeCls = compTheme.value.customThemes.join(' ');
      const customTheme = compTheme.value.customThemes.reduce((out, cur) => ({ [`data-${cur}-theme`]: true, ...out }), {});
      const contentClass = `bk-popover-content ${customThemeCls}`;
      return (
      <div class="bk-popover">
        <div ref={ reference } class="bk-popover-reference">
          {ctx.slots.default?.()}
        </div>
        <div ref={ refContent } class={contentClass} style={compStyle.value} {...customTheme}>
          {ctx.slots.content?.() ?? content.value}
          {arrow && <div class="arrow" data-popper-arrow></div>}
        </div>
      </div>
      );
    };
  },
});
