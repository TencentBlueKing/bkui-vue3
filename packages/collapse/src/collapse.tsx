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

import { computed, createVNode, defineComponent, provide, ref, renderSlot, watch } from 'vue';

import CollapsePanel from './collapse-panel';
import { propsCollapse as props } from './props';

export default defineComponent({
  name: 'Collapse',
  props,
  emits: ['item-click', 'update:modelValue', 'after-leave', 'before-enter'],

  setup(props, { emit, slots }) {
    const localActiveItems = ref([]);
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
    const handleItemClick = (item) => {
      // 手风琴模式，只有一个Active，移除一个新增一个
      const { name } = item;
      if (props.accordion) {
        const activeItemIndex = localActiveItems.value.findIndex(local => local === name);
        if (activeItemIndex >= 0) {
          localActiveItems.value.splice(activeItemIndex, 1);
        } else {
          localActiveItems.value = [name];
        }
      } else {
        const activeItemIndex = localActiveItems.value.findIndex(local => local === name);
        if (activeItemIndex >= 0) {
          localActiveItems.value.splice(activeItemIndex, 1);
        } else {
          localActiveItems.value.push(name);
        }
      }
      emit('item-click', item);
      emit('update:modelValue', localActiveItems.value);
    };
    provide('localActiveItems', localActiveItems);
    provide('handleItemClick', handleItemClick);
    let className = 'bk-collapse-wrapper';
    // 线条样式
    if (props.hasHeaderBorder) {
      className += ' bk-collapse-header-border';
    }

    // hover效果
    if (props.hasHeaderHover) {
      className += ' bk-collapse-header-hover';
    }

    // 卡片样式
    if (props.useCardTheme) {
      className += ' bk-collapse-card';
    }

    // 图标位置
    if (props.headerIconAlign === 'left') {
      className += ' bk-collapse-icon-left';
    } else {
      className += ' bk-collapse-icon-right';
    }
    if (!Array.isArray(props.list) || !props.list.length) {
      return () => createVNode('div', {
        class: className,
      }, [renderSlot(slots, 'default', { props: { isList: true } })]);
    }
    // 统一格式化传入数据格式为标准渲染格式
    const collapseData = computed(() => (props.list || []).map((item, index) => {
      if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
        return { $index: index, name: item };
      }
      return { $index: index, ...item };
    }));
    // 判定当前Item是否为激活状态
    const renderItems = () => collapseData.value.map((item, index) => {
      const name = item[props.idFiled] || index;
      let title = item[props.titleField];
      const icon = props.headerIcon || 'angle-right';
      if (slots.title) {
        if (typeof slots.title === 'function') {
          title = slots.title(item, index);
        } else {
          title = slots.title;
        }
      }
      if (slots.default) {
        title = slots.default?.(item, index);
      }
      return  (
        <CollapsePanel
          key={index}
          item-click={handleItemClick}
          disabled={item.disabled}
          name={name}
          icon={icon}
          isFormList={true}
          title={title}
          content={slots.content?.(item, index) ?? item[props.contentField]}
        />
      );
    });
    return () => (
      <div class={className}>
        {renderItems()}
      </div>
    );
  },
});
