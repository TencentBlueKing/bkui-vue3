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

import { merge } from 'lodash';
import { defineComponent, ref } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import BKPopover, { PopoverPropTypes } from '@bkui-vue/popover';
import { classes,  placementType, PropTypes, triggerType } from '@bkui-vue/shared';


export default defineComponent({
  name: 'Dropdown',
  props: {
    /** trigger = manual时候控制显隐藏  */
    isShow: PropTypes.bool.def(false),
    /** 弹层出现位置 */
    placement: placementType(),
    /** 触发方式 */
    trigger: triggerType(),
    /** 是否禁用 */
    disabled: PropTypes.bool.def(false),
    /** popover属性 */
    popoverOptions: PropTypes.object.def({}),
    /** 外部设置的 class name */
    extCls: PropTypes.string,
  },
  emits: ['showChange', 'show', 'hide'],
  setup(_props, { emit }) {
    /** 弹层显示值变更 */
    const handleShowChagne = (val: boolean) => {
      emit('showChange', val);
    };
    /** 显示后回调 */
    const afterShow = () => {
      emit('show');
      handleShowChagne(true);
    };
    /** 隐藏后回调 */
    const afterHidden = () => {
      emit('hide');
      handleShowChagne(false);
    };

    const popoverRef = ref(null);
    const { resolveClassName } = usePrefix();

    return {
      afterShow,
      afterHidden,
      popoverRef,
      resolveClassName,
    };
  },
  render() {
    const wrapperClasses = classes({
      [`${this.resolveClassName('dropdown')}`]: true,
    }, this.$props.extCls);
    /** popover 基础配置 */
    const basePopoverOptions: Partial<PopoverPropTypes> = {
      theme: `light ${this.resolveClassName('dropdown-popover')}`,
      trigger: this.trigger,
      arrow: false,
      placement: this.placement,
      isShow: this.isShow,
      disabled: this.disabled,
    };
    const popoverOptions: Partial<PopoverPropTypes> = merge(basePopoverOptions, this.popoverOptions);
    return <div class={wrapperClasses}>
      <BKPopover ref="popoverRef"
        { ...popoverOptions }
        onAfterShow={this.afterShow}
        onAfterHidden={this.afterHidden} >
        {{
          default: () => (
            <div class={`${this.resolveClassName('dropdown-reference')}`}> {this.$slots.default?.()} </div>
          ),
          content: () => (
            <div class={`${this.resolveClassName('dropdown-content')}`}> { this.$slots.content?.()} </div>
          ),
        }}
      </BKPopover>
    </div>;
  },
});
