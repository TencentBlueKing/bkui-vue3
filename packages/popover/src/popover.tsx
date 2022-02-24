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

import { computed, defineComponent, toRefs, PropType } from 'vue';
import {
  IBKPopover,
  BKPopover,
  PropTypes,
  bkZIndexManager,
  OnFirstUpdateFnType,
} from '@bkui-vue/shared';
import { Placement } from '@popperjs/core';


export default defineComponent({
  name: 'Popover',
  props: {
    isShow: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def('auto'),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def('auto'),
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(''),
    placement: PropTypes.placement().def('top'),
    theme: PropTypes.theme(['dark', 'light']).def('light'),
    handleFirstUpdate: {
      type: Function as PropType<OnFirstUpdateFnType>,
      default: () => {},
    },

    /**
     * 触发方式
     * 支持 click hover manual
     * manual： 通过isShow控制显示、隐藏
     */
    trigger: PropTypes.string.def('hover'),
    // 是否显示箭头
    arrow: PropTypes.bool.def(true),
    // popper modifiers配置
    modifiers: PropTypes.array.def([
      {
        name: 'offset',
        options: {
          offset: [0, 8],
        },
      },
    ]),
  },
  setup(props: any) {
    const { width, height } = toRefs(props);
    const compStyle = computed(() => ({
      width: /^\d+$/.test(width.value) ? `${width.value}px` : width.value,
      height: /^\d+$/.test(height.value) ? `${height.value}px` : height.value,
      zIndex: bkZIndexManager.getModalNextIndex(),
    }));

    return {
      compStyle,
    };
  },
  data() {
    return {
      popoverInstance: Object.create(null),
      isPopInstance: false,
    };
  },

  watch: {
    isShow: {
      immediate: true,
      handler(val: boolean) {
        this.$nextTick(() => {
          if (this.trigger === 'manual' && this.isPopInstance) {
            val ? this.popoverInstance.show() : this.popoverInstance.hide();
          }
        });
      },
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.popoverInstance = new BKPopover(
        this.$refs.reference as HTMLElement,
        this.$refs.refContent as HTMLElement,
        {
          theme: this.theme,
          placement: this.placement as Placement,
          trigger: this.trigger,
          modifiers: this.modifiers,
          onFirstUpdate: this.handleFirstUpdate,
        },
      );
      this.isPopInstance = true;
    });
  },

  beforeUnmount() {
    const instance = this.popoverInstance as IBKPopover;
    instance.isShow && instance.hide();
    instance.destroy();
    this.popoverInstance = Object.create(null);
  },

  methods: {
    handleClose() {
      this.$emit('update:isShow', false);
    },
  },

  render() {
    return (
      <div class="bk-popover">
        <div ref="reference" class="bk-popover-reference">
          {this.$slots.default?.()}
        </div>
        <div ref="refContent" class="bk-popover-content" style={this.compStyle}>
          {this.$slots.content?.() ?? this.content}
          {this.arrow && <div class="arrow" data-popper-arrow></div>}
        </div>
      </div>
    );
  },
});
