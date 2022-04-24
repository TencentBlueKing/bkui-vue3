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
 * THE SOFTWARE IS PROVIDED "AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
*/

import { defineComponent, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { BKPopover, classes, IBKPopover, PropTypes } from '@bkui-vue/shared';
import { Placement } from '@popperjs/core';


export default defineComponent({
  name: 'BkDropdown',
  props: {
    /** trigger = manual时候控制显隐藏  */
    isShow: PropTypes.bool.def(false),
    placement: PropTypes.commonType(['auto', 'auto-start', 'auto-end', 'top', 'right', 'bottom', 'left', 'top-start', 'top-end', 'bottom-start', 'bottom-end', 'right-start', 'right-end', 'left-start', 'left-end'], 'placement').def('bottom'),
    /** 触发方式 */
    trigger: PropTypes.commonType(['hover', 'click', 'manual'], 'trigger').def('hover'),
    /** 是否禁用 */
    disabled: PropTypes.bool.def(false),
    /** 外部设置的 class name */
    extCls: PropTypes.string,
  },
  emits: ['showChange', 'show', 'hide'],
  setup(props: any, { emit }) {
    let popoverInstance: any = Object.create(null);
    /** 参考物dom */
    const reference = ref(null);
    /** 下拉菜单dom */
    const refContent = ref(null);

    onMounted(() => {
      registerDropdown();
    });
    onBeforeUnmount(() => {
      destoryDropdown();
    });

    /**
     * @description: trigger = 'manual' isShow状态变化
     */
    watch(() => props.isShow, (val: Boolean) => {
      nextTick(() => {
        if (props.trigger === 'manual' && popoverInstance && !props.disabled) {
          val ? popoverInstance.show() : popoverInstance.hide();
        }
      });
    });

    /**
     * @description: disabled状态变化
     */
    watch(() => props.disabled, val => handleUpdateDisabled(val));

    /** 显示后回调 */
    const afterShow = () => {
      emit('show');
    };
    /** 隐藏后回调 */
    const afterHidden = () => {
      emit('hide');
    };
    /**
     * @description: 注册dropdown
     */
    const registerDropdown = () => {
      if (props.disabled) return;
      popoverInstance = new BKPopover(
        reference.value as HTMLElement,
        refContent.value as HTMLElement,
        {
          placement: props.placement as Placement,
          trigger: props.trigger,
          afterShow,
          afterHidden,
        },
      );
      props.trigger === 'manual' && props.isShow && popoverInstance.show();
    };

    /**
     * @description: 销毁dropdown实例
     */
    const destoryDropdown = () => {
      if (popoverInstance) {
        const instance = popoverInstance as IBKPopover;
        instance.isShow && instance.hide();
        instance.destroy();
        popoverInstance = null;
        props.trigger === 'manual' && emit('showChange', false);
      }
    };
    const handleUpdateDisabled = (val: boolean) => {
      const instance = popoverInstance as IBKPopover;
      props.trigger === 'manual' && !val && emit('showChange', false);
      instance.updateDisabled(val);
    };
    return {
      reference,
      refContent,
    };
  },
  render() {
    const wrapperClasses = classes({
      'bk-dropdown': true,
    }, this.$props.extCls);
    return <div class={wrapperClasses}>
      <div ref="reference" class="bk-dropdown-reference">
        {this.$slots.default?.()}
      </div>
      <div ref="refContent" class="bk-dropdown-content">
        {this.$slots.content?.()}
      </div>
    </div>;
  },
});
