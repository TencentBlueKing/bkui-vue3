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
  provide,
  reactive,
  ref,
  toRef,
  toRefs,
} from 'vue';

import { AngleUpFill } from '@bkui-vue/icon';
import { classes, PropTypes } from '@bkui-vue/shared';

import { optionGroupKey, selectKey, useRegistry } from './common';
import { OptionInstanceType } from './type';

export default defineComponent({
  name: 'OptionGroup',
  props: {
    label: PropTypes.string.def(''),
    disabled: PropTypes.bool.def(false),
    collapsible: PropTypes.bool.def(false), // 是否开启折叠
    collapse: PropTypes.bool.def(false), // 是否折叠初始状态
  },
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const { proxy } = instance as any;
    const select = inject(selectKey, null);

    const states = reactive({
      groupCollapse: props.collapse,
      visible: true,
    });
    const optionsMap = ref<Map<any, OptionInstanceType>>(new Map());
    const { register, unregister } = useRegistry<OptionInstanceType>(optionsMap);
    const groupLabel = computed(() => `${props.label} (${[...optionsMap.value.values()].filter(option => option.visible).length})`);

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

    return {
      ...toRefs(states),
      groupLabel,
      handleToggleCollapse,
    };
  },
  render() {
    const groupClass = classes({
      'bk-option-group': true,
      collapsible: this.collapsible,
      disabled: this.disabled,
    });
    const groupLabelClass = classes({
      'bk-option-group-label': true,
      collapsible: this.collapsible,
    });
    const groupLabelIconClass = classes({
      'default-group-label-icon': true,
      collapse: this.groupCollapse,
    });

    return <ul v-show={this.visible} class={groupClass}>
      <li class={groupLabelClass} onClick={this.handleToggleCollapse}>
        {
          this.$slots.label
            ? this.$slots.label()
            : (
              <span class="default-group-label">
                {
                  this.collapsible && <AngleUpFill class={groupLabelIconClass}></AngleUpFill>
                }
                <span class="default-group-label-title">{this.groupLabel}</span>
              </span>
            )
        }
      </li>
      <ul class="bk-option-group-content" v-show={!this.groupCollapse}>
        {this.$slots.default?.()}
      </ul>
    </ul>;
  },
});
