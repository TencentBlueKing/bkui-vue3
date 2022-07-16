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

import { computed, defineComponent, ref, Transition, watch } from 'vue';

import { AngleRight } from '@bkui-vue/icon/';

import { propsCollapse as props } from './props';
import { collapseMotion } from './utils';

export default defineComponent({
  name: 'Collapse',
  props,
  emits: ['item-click', 'update:modelValue', 'after-leave', 'before-enter'],
  setup(props, { emit, slots }) {
    const localActiveItems = ref([]);
    const transition = ref(collapseMotion(emit));

    // 以保证当前的设置生效
    watch(() => [props.modelValue], () => {
      const value = props.modelValue;
      if (Array.isArray(value)) {
        localActiveItems.value = [...value];
      } else if (typeof value !== 'undefined') {
        localActiveItems.value = [value];
      } else {
        localActiveItems.value = [];
      }
    }, {
      immediate: true,
    });

    // 统一格式化传入数据格式为标准渲染格式
    const collapseData = computed(() => (props.list || []).map((item, index) => {
      if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
        return { $index: index, name: item };
      }
      return { $index: index, ...item };
    }));

    const handleItemClick = (item) => {
      if (item.disabled) return;
      // 手风琴模式，只有一个Active，移除一个新增一个
      if (props.accordion) {
        const activeItemIndex = localActiveItems.value.findIndex(local => local === item[props.idFiled]);
        if (activeItemIndex >= 0) {
          localActiveItems.value.splice(activeItemIndex, 1);
        } else {
          localActiveItems.value = [item[props.idFiled]];
        }
      } else {
        const activeItemIndex = localActiveItems.value.findIndex(local => local === item[props.idFiled]);
        if (activeItemIndex >= 0) {
          localActiveItems.value.splice(activeItemIndex, 1);
        } else {
          localActiveItems.value.push(item[props.idFiled]);
        }
      }
      emit('item-click', item);
      emit('update:modelValue', localActiveItems.value);
    };

    // 判定当前Item是否为激活状态
    const isItemActive = item => localActiveItems.value.includes(item[props.idFiled]);
    const renderItems = () => collapseData.value.map(item => <div
      class={`bk-collapse-item ${item.disabled ? 'is-disabled' : ''} ${(isItemActive(item)) ? 'bk-collapse-item-active' : ''}`}>
      <div class='bk-collapse-header' onClick={() => handleItemClick(item)}>
          <span class='bk-collapse-title'>
            {slots.default?.(item) ?? item[props.titleField]}
          </span>
        {<AngleRight class={`bk-collapse-icon ${(isItemActive(item) && 'rotate-icon') || ''}`}/>}
      </div>
      <Transition {...transition.value}>
        <div v-show={isItemActive(item)} class={`bk-collapse-content ${(isItemActive(item) && 'active') || ''}`}>
          {slots.content?.(item) ?? item[props.contentField]}
        </div>
      </Transition>
    </div>);

    const className = 'bk-collapse-wrapper';
    return () => <div class={className}>
      {renderItems()}
    </div>;
  },
});
