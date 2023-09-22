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

import { isEqual } from 'lodash';
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

import Checkbox from '@bkui-vue/checkbox';
import { usePrefix } from '@bkui-vue/config-provider';
import { Done } from '@bkui-vue/icon';
import { classes, PropTypes, SelectedTypeEnum } from '@bkui-vue/shared';

import { optionGroupKey, selectKey } from './common';

export default defineComponent({
  name: 'Option',
  props: {
    id: {
      type: [String, Number, Object],
      require: true,
    },
    name: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    disabled: PropTypes.bool.def(false),
  },
  setup(props, { attrs }) {
    const { proxy } = getCurrentInstance() as any;

    const states = reactive({
      visible: true,
    });

    const { disabled, id, name } = toRefs(props);
    // 兼容label
    const optionName = computed(() => (name.value !== undefined ? name.value : (attrs.label as string)));
    // 兼容value
    const optionID = computed(() => (id.value !== undefined ? id.value : attrs.value));
    const select = inject(selectKey, null);
    const group = inject(optionGroupKey, null);
    const selected = computed<boolean>(() => select?.selected?.some(item => isEqual(item.value, optionID.value)));
    const multiple = computed<boolean>(() => select?.multiple);
    const isHover = computed(() => select?.activeOptionValue === optionID.value);
    const showSelectedIcon = computed(() => select?.showSelectedIcon && multiple.value);
    const selectedStyle = computed(() => select?.selectedStyle);

    const handleOptionClick = () => {
      if (disabled.value) return;
      select?.handleOptionSelected(proxy);
    };

    const handleMouseEnter = () => {
      select.activeOptionValue = optionID.value;
    };

    onBeforeMount(() => {
      select?.register(optionID.value, proxy);
      group?.register(optionID.value, proxy);
    });

    onBeforeUnmount(() => {
      select?.unregister(optionID.value);
      group?.unregister(optionID.value);
    });

    const { resolveClassName } = usePrefix();

    return {
      ...toRefs(states),
      selected,
      multiple,
      isHover,
      showSelectedIcon,
      selectedStyle,
      optionName,
      optionID,
      handleOptionClick,
      handleMouseEnter,
      resolveClassName,
    };
  },
  render() {
    const selectItemClass = classes({
      'is-selected': this.selected,
      'is-disabled': this.disabled,
      'is-multiple': this.multiple,
      'is-hover': this.isHover,
      'is-checkbox': this.selectedStyle === SelectedTypeEnum.CHECKBOX,
      [this.resolveClassName('select-option')]: true,
    });
    return (
      <li
        v-show={this.visible}
        class={selectItemClass}
        onClick={this.handleOptionClick}
        onMouseenter={this.handleMouseEnter}
      >
        {this.showSelectedIcon && this.selectedStyle === SelectedTypeEnum.CHECKBOX && (
          <Checkbox
            disabled={this.disabled}
            class={this.resolveClassName('select-checkbox')}
            modelValue={this.selected}
          />
        )}
        {this.$slots.default?.() ?? (
          <span
            class={this.resolveClassName('select-option-item')}
            title={String(this.optionName)}
          >
            {this.optionName}
          </span>
        )}
        {this.showSelectedIcon && this.selected && this.selectedStyle === SelectedTypeEnum.CHECK && (
          <Done
            class={this.resolveClassName('select-selected-icon')}
            width={22}
            height={22}
          ></Done>
        )}
      </li>
    );
  },
});
