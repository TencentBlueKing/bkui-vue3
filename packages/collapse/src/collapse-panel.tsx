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
import { defineComponent, h, inject, ref, Transition, watch } from 'vue';

import { AngleRight } from '@bkui-vue/icon';

import { propsCollapsePanel as props } from './props';
import { collapseMotion } from './utils';

export default defineComponent({
  name: 'CollapsePanel',
  props,
  emits: ['change', 'update:modelValue', 'after-leave', 'before-enter'],
  setup(props, { emit, slots }) {
    const localActiveItems = inject<(string | number)[]>('localActiveItems');
    const isActive = ref(props.modelValue);
    watch(() => props.modelValue, (newVal) => {
      isActive.value = newVal;
    });
    watch(() => localActiveItems, (newVal) => {
      if (newVal?.length) {
        isActive.value = newVal.includes(props.name);
      }
    }, {
      immediate: true,
    });

    function handleItemClick(props) {
      const { disabled, name, itemClick } = props;
      if (disabled) return;
      const data = { name };
      itemClick(data);
      isActive.value = !isActive.value;
      emit('change', data);
      emit('update:modelValue', isActive.value);
    }


    const transition = ref(collapseMotion(emit));
    const { content } = props;

    function getContent() {
      if (content) {
        return content;
      }
      if (typeof slots.content === 'function') {
        return slots.content(h);
      }
      return slots.content;
    }

    function renderPanel() {
      if (props.renderDirective === 'if' && !isActive.value) {
        return '';
      }
      return (
        <div v-show={isActive.value} class={`bk-collapse-content ${(isActive.value && 'active') || ''}`}>
          {getContent()}
        </div>
      );
    }

    function renderHeader() {
      if (slots.header) {
        if (typeof slots.header === 'function') {
          return slots.header(h);
        }
        return slots.header;
      }
      let title;
      if (slots.default) {
        if (typeof slots.default === 'function') {
          title = slots.default(h);
        } else {
          title = slots.default;
        }
      } else {
        title = props.title;
      }
      return (
        <>
        <span class='bk-collapse-title'>
            {title}
          </span>
          {<AngleRight class={`bk-collapse-icon ${(isActive.value && 'rotate-icon') || ''}`}/>}
        </>
      );
    }

    return () => (
      <div
        class={`bk-collapse-item ${props.disabled ? 'is-disabled' : ''} ${isActive.value ? 'bk-collapse-item-active' : ''}`}>
        <div class='bk-collapse-header' onClick={() => handleItemClick(props)}>
          {renderHeader()}
        </div>
        <Transition {...transition.value}>
          {
            renderPanel()
          }
        </Transition>
      </div>
    );
  },
});
