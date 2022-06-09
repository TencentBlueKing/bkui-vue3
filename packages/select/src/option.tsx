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

import {
  computed,
  defineComponent,
  getCurrentInstance,
  inject,
  onBeforeMount,
  onBeforeUnmount,
  reactive,
  toRefs,
} from 'vue';

import { classes, PropTypes } from '@bkui-vue/shared';

import { optionGroupKey, selectKey } from './common';

export default defineComponent({
  name: 'Option',
  props: {
    value: PropTypes.any,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disabled: PropTypes.bool.def(false),
  },
  setup(props) {
    const { proxy } = getCurrentInstance() as any;

    const states = reactive({
      visible: true,
    });

    const { disabled, value } = toRefs(props);
    const select = inject(selectKey, null);
    const group = inject(optionGroupKey, null);
    const selected = computed<boolean>(() => select?.selected?.some(val => val === value.value));
    const multiple = computed<boolean>(() => select?.multiple);
    const isHover = computed(() => select?.activeOptionValue === value.value);

    const handleOptionClick = () => {
      if (disabled.value) return;
      select?.handleOptionSelected(proxy);
    };

    const handleMouseEnter = () => {
      select.activeOptionValue = value.value;
    };

    onBeforeMount(() => {
      select?.register(value.value, proxy);
      group?.register(value.value, proxy);
    });

    onBeforeUnmount(() => {
      select?.unregister(value.value);
      group?.unregister(value.value);
    });

    return {
      ...toRefs(states),
      selected,
      multiple,
      isHover,
      handleOptionClick,
      handleMouseEnter,
    };
  },
  render() {
    const selectItemClass = classes({
      'is-selected': this.selected,
      'is-disabled': this.disabled,
      'is-multiple': this.multiple,
      'is-hover': this.isHover,
      'bk-select-option': true,
    });
    return (
      <li v-show={this.visible}
        class={selectItemClass}
        onClick={this.handleOptionClick}
        onMouseenter={this.handleMouseEnter}>
        {this.$slots.default?.() ?? <span>{this.label}</span>}
      </li>
    );
  },
});
