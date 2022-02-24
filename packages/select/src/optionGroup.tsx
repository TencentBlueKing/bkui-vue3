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
import { PropTypes, classes } from '@bkui-vue/shared';
import { ref, defineComponent, reactive, toRefs, provide, onMounted, getCurrentInstance, toRef, computed } from 'vue';
import { optionGroupKey, OptionInstanceType } from './common';
import { AngleUpFill } from '@bkui-vue/icon';

export default defineComponent({
  name: 'Group',
  props: {
    label: PropTypes.string.def(''),
    disabled: PropTypes.bool.def(false),
    collapsible: PropTypes.bool.def(false), // 是否开启折叠
    collapse: PropTypes.bool.def(false), // 是否折叠
  },
  setup(props, { emit }) {
    const children = ref<OptionInstanceType[]>([]);
    const instance = getCurrentInstance();
    const states = reactive({
      groupCollapse: props.collapse,
      visible: true,
    });
    const groupLabel = computed(() => `${props.label} (${children.value.filter(option => option.visible).length})`);

    provide(
      optionGroupKey,
      reactive({
        ...toRefs(props),
        groupCollapse: toRef(states, 'groupCollapse'),
      }),
    );

    const flattedChildren = (node) => {
      const children = [];
      if (Array.isArray(node.children)) {
        node.children.forEach((child) => {
          if (
            child.type
            && child.type.name === 'Option'
            && child.component
            && child.component.proxy
          ) {
            children.push(child.component.proxy);
          } else if (child.children?.length) {
            children.push(...flattedChildren(child));
          }
        });
      }
      return children;
    };


    const handleToggleCollapse = () => {
      if (!props.collapsible) return;

      states.groupCollapse = !states.groupCollapse;
      emit('update:collapse', states.groupCollapse);
    };

    onMounted(() => {
      children.value = flattedChildren(instance.subTree);
    });

    return {
      ...toRefs(states),
      children,
      groupLabel,
      handleToggleCollapse,
    };
  },
  render() {
    const groupClass = classes({
      'bk-option-group': true,
      collapsible: this.collapsible,
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
                  this.collapsible
                    ? <AngleUpFill class={groupLabelIconClass}></AngleUpFill>
                    : null
                }
                <span class="default-group-label-title">
                  {this.groupLabel}
                </span>
              </span>
            )
        }
      </li>
      <ul class="bk-option-group-content">
        {this.$slots.default?.()}
      </ul>
    </ul>;
  },
});
