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
  Component,
  ComponentInternalInstance,
  computed,
  defineComponent,
  Fragment,
  getCurrentInstance,
  onMounted,
  onUpdated,
  provide,
  ref,
  VNode,
} from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';

import { PositionEnum, SortTypeEnum, tabActiveInjectionKey, tabProps, TabTypeEnum } from './props';
import TabNav from './tab-nav';

export default defineComponent({
  name: 'Tab',
  components: {
    TabNav,
  },
  props: tabProps,
  emits: [
    // 兼容老方法
    'add-panel',
    'tab-change',
    'remove-panel',
    'sort-change',
    'on-drag-tab',
    // 新方法
    'add',
    'change',
    'remove',
    'update:active',
    'sort',
    'drag',
  ],
  setup(_props, { slots, emit }) {
    const isMounted = ref(false);
    const panels = ref([]);
    const instance = getCurrentInstance();

    // 向下注入当前激活面板，供 TabPanel 通过 inject 读取，替代 this.$parent.active。
    provide(
      tabActiveInjectionKey,
      computed(() => _props.active),
    );

    // 递归收集已挂载的 TabPanel 实例。
    // 仅向下穿透 Tab 自身的包裹元素（原生标签、Fragment、template），
    // 不进入用户自定义组件，避免误收集嵌套 Tab 的面板。
    const getPaneInstanceFromSlot = (vnode: VNode, panelInstanceList: ComponentInternalInstance[] = []) => {
      const children = vnode?.children;
      if (!Array.isArray(children)) {
        return panelInstanceList;
      }
      (children as Array<VNode>).forEach(node => {
        if (!node || typeof node !== 'object') {
          return;
        }
        const rawType = node.type;
        const type = (rawType as Component)?.name || rawType;
        if (type === 'TabPanel' && node.component) {
          panelInstanceList.push(node.component);
        } else if (rawType === Fragment || rawType === 'template' || typeof rawType === 'string') {
          getPaneInstanceFromSlot(node, panelInstanceList);
        }
      });
      return panelInstanceList;
    };
    const setPanelInstances = () => {
      if (!slots.default || !instance?.subTree) {
        return;
      }
      const panelInstanceList = getPaneInstanceFromSlot(instance.subTree);
      const isChanged = panelInstanceList.length !== panels.value.length;
      if (isChanged) {
        panels.value = panelInstanceList;
      }
    };

    onMounted(() => {
      /* 如果是列表模式，直接渲染
      if (props.panels?.length) {
        panels.value = props.panels;
        return;
      }
      */
      setPanelInstances();
      isMounted.value = true;
    });

    onUpdated(() => {
      setPanelInstances();
    });

    const methods = {
      tabAdd(e: MouseEvent) {
        emit('add', { e });
        emit('add-panel', { e });
      },
      tabChange(name: string) {
        if (_props.beforeChange?.(name) ?? true) {
          // emit('xxx') 会调用onXxx函数, 所以不必在主动调用onXxx函数了
          emit('change', name);
          emit('tab-change', name);
          emit('update:active', name);
        }
      },
      tabRemove(index: number, panel) {
        // emit('xxx') 会调用onXxx函数, 所以不必在主动调用onXxx函数了
        emit('remove', index, panel);
        emit('remove-panel', index, panel);
      },
      tabSort(dragTabIndex: number, dropTabIndex: number, sortType: string) {
        const list = panels.value;
        // 如果是插队模式
        if (sortType === SortTypeEnum.INSERT) {
          if (dragTabIndex < dropTabIndex) {
            list.splice(dropTabIndex + 1, 0, list[dragTabIndex]);
            list.splice(dragTabIndex, 1);
          } else if (dragTabIndex > dropTabIndex) {
            list.splice(dropTabIndex, 0, list[dragTabIndex]);
            list.splice(dragTabIndex + 1, 1);
          } else {
            return false;
          }
        } else {
          const swap = list[dropTabIndex];
          list[dropTabIndex] = list[dragTabIndex];
          list[dragTabIndex] = swap;
        }
        panels.value = [...list];
        // emit('xxx') 会调用onXxx函数, 所以不必在主动调用onXxx函数了
        emit('sort', dragTabIndex, dropTabIndex, sortType);
        emit('sort-change', dragTabIndex, dropTabIndex, sortType);
      },
      tabDrag(dragTabIndex: number, dragEvent: DragEvent) {
        // emit('xxx') 会调用onXxx函数, 所以不必在主动调用onXxx函数了
        emit('drag', dragTabIndex, dragEvent);
        emit('on-drag-tab', dragTabIndex, dragEvent);
      },
    };

    const { resolveClassName } = usePrefix();

    return {
      ...methods,
      isMounted,
      panels,
      resolveClassName,
    };
  },
  render() {
    const getTabBoxClass = () => {
      const arr = [this.resolveClassName('tab'), this.extCls];
      if (this.tabPosition === PositionEnum.TOP) {
        arr.push(this.resolveClassName(`tab--${this.tabPosition}`), this.resolveClassName(`tab--${this.type}`));
      } else {
        arr.push(this.resolveClassName(`tab--${this.tabPosition}`));
        if (this.type === TabTypeEnum.CARD_TAB) {
          arr.push(this.resolveClassName('tab--vertical-tab'));
        }
      }
      return arr;
    };
    const getTabHeader = () => {
      const {
        panels,
        active,
        type,
        closable,
        addable,
        sortable,
        sortType,
        labelHeight,
        validateActive,
        tabPosition,
        activeBarSize,
        activeBarColor,
        // function
        tabAdd,
        tabChange,
        tabRemove,
        tabSort,
        tabDrag,
      } = this;
      const props = {
        panels,
        active,
        type,
        closable,
        addable,
        sortable,
        sortType,
        labelHeight,
        validateActive,
        tabPosition,
        activeBarSize,
        activeBarColor,
        // function
        tabAdd,
        tabChange,
        tabRemove,
        tabSort,
        tabDrag,
      };
      if (!panels || !Array.isArray(panels)) {
        return null;
      }
      return (
        <TabNav
          v-slots={this.$slots}
          {...props}
        />
      );
    };

    return (
      <div class={getTabBoxClass()}>
        {getTabHeader()}
        <div class={this.resolveClassName('tab-content')}>{this.$slots.default?.()}</div>
      </div>
    );
  },
}) as any;
