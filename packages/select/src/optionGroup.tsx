/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2025 Tencent.  All rights reserved.
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
  provide,
  reactive,
  ref,
  toRef,
  toRefs,
} from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import BkDivider from '@bkui-vue/divider';
import { AngleUpFill } from '@bkui-vue/icon';
import { classes } from '@bkui-vue/shared';

import { optionGroupKey, selectKey, useRegistry } from './common';
import { optionGroupProps } from './props';
import { OptionInstanceType } from './type';

export default defineComponent({
  name: 'OptionGroup',
  props: optionGroupProps,
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { proxy } = instance as any;
    const select = inject(selectKey, null);

    const states = reactive({
      groupCollapse: props.collapse,
      // visible: props.visible,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const optionsMap = ref<Map<any, OptionInstanceType>>(new Map());
    const { register, unregister } = useRegistry<OptionInstanceType>(optionsMap);
    const groupLabel = computed(
      () => `${props.label} (${[...optionsMap.value.values()].filter(option => option.visible).length})`,
    );
    const isVisible = computed(() => {
      if (!props.visible) return false;
      const groupOptions = [...optionsMap.value.values()];
      if (!groupOptions.length) return !select.isSearchEmpty;
      return groupOptions.some(option => option.visible);
    });

    const handleToggleCollapse = () => {
      if (!props.collapsible || props.disabled) return;

      states.groupCollapse = !states.groupCollapse;
      emit('update:collapse', states.groupCollapse);
    };

    provide(
      optionGroupKey,
      reactive({
        ...toRefs(props),
        register,
        unregister,
        groupCollapse: toRef(states, 'groupCollapse'),
      }),
    );

    onBeforeMount(() => {
      select?.registerGroup(instance.uid, proxy);
    });

    onBeforeUnmount(() => {
      select?.unregisterGroup(instance.uid);
    });

    const { resolveClassName } = usePrefix();

    return {
      ...toRefs(states),
      groupLabel,
      isVisible,
      handleToggleCollapse,
      resolveClassName,
    };
  },
  render() {
    const isDivider = this.groupStyle === 'divider';

    const groupClass = classes({
      [this.resolveClassName('option-group')]: true,
      [this.resolveClassName('option-group-divider')]: isDivider,
      collapsible: this.collapsible,
      disabled: this.disabled,
    });

    const renderGroupHeader = () => {
      if (isDivider) {
        return (
          <div class={this.resolveClassName('option-group-divider-container')}>
            <BkDivider
              style={{ margin: 0 }}
              color='#EAEBF0'
              type='solid'
            />
          </div>
        );
      }

      const groupLabelClass = classes({
        [this.resolveClassName('option-group-label')]: true,
        collapsible: this.collapsible,
      });
      const groupLabelIconClass = classes({
        'default-group-label-icon': true,
        collapse: this.groupCollapse,
      });

      return (
        <li
          class={groupLabelClass}
          onClick={this.handleToggleCollapse}
        >
          {this.$slots.label ? (
            this.$slots.label()
          ) : (
            <span class='default-group-label'>
              {this.collapsible && <AngleUpFill class={groupLabelIconClass}></AngleUpFill>}
              <span class='default-group-label-title'>{this.groupLabel}</span>
            </span>
          )}
        </li>
      );
    };

    return (
      <ul
        class={groupClass}
        v-show={this.isVisible}
      >
        {renderGroupHeader()}
        <ul
          class={this.resolveClassName('option-group-content')}
          v-show={!this.groupCollapse}
        >
          {this.$slots.default?.()}
        </ul>
      </ul>
    );
  },
});
