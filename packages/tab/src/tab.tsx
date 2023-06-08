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
  Component,
  ComponentInternalInstance,
  defineComponent,
  Fragment,
  getCurrentInstance,
  onMounted,
  onUpdated,
  ref,
  VNode,
} from 'vue';

import { resolveClassName } from '@bkui-vue/shared';

import { PositionEnum, SortTypeEnum, tabProps, TabTypeEnum } from './props';
import TabNav from './tab-nav';

export default defineComponent({
  name: 'Tab',
  components: {
    TabNav,
  },
  props: tabProps,
  emits: [
    // 兼容老方法
    'add-panel', 'tab-change', 'remove-panel', 'sort-change', 'on-drag-tab',
    // 新方法
    'add', 'change', 'remove', 'update:active', 'sort', 'drag',
  ],
  setup(_props: Record<string, any>, { slots, emit }) {
    const isMounted = ref(false);
    const panels = ref([]);
    const instance = getCurrentInstance();
    // 动态插入tabPanel
    const getPaneInstanceFromSlot = (vnode: VNode, panelInstanceList: ComponentInternalInstance[] = []) => {
      const { children } = vnode;
      ((children || []) as Array<VNode>).forEach((node) => {
        let { type } = node;
        type = (type as Component).name || type;
        if (type === 'TabPanel' && node.component) {
          panelInstanceList.push(node.component);
        } else if (type === Fragment || type === 'template') {
          getPaneInstanceFromSlot(node, panelInstanceList);
        }
      });
      return panelInstanceList;
    };
    const setPanelInstances = () => {
      if (slots.default) {
        const { children } = instance.subTree.children[1];
        if (!children) return;
        const content = children[0];
        const panelInstanceList = getPaneInstanceFromSlot(content);
        const isChanged = panelInstanceList.length !== panels.value.length;
        if (isChanged) {
          panels.value = panelInstanceList;
        }
      }
    };

    onMounted(() => {
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
        // emit('xxx') 会调用onXxx函数, 所以不必在主动调用onXxx函数了
        emit('change', name);
        emit('tab-change', name);
        emit('update:active', name);
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
            list.splice(dropTabIndex + 1, 0, panels[dragTabIndex]);
            list.splice(dragTabIndex, 1);
          } else if (dragTabIndex > dropTabIndex) {
            list.splice(dropTabIndex, 0, panels[dragTabIndex]);
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

    return {
      ...methods,
      isMounted,
      panels,
    };
  },
  render() {
    const getTabBoxClass = () => {
      const arr = [resolveClassName('tab'), this.extCls];
      if (this.tabPosition === PositionEnum.TOP) {
        arr.push(resolveClassName(`tab--${this.tabPosition}`), resolveClassName(`tab--${this.type}`));
      } else {
        arr.push(resolveClassName(`tab--${this.tabPosition}`));
        if (this.type === TabTypeEnum.CARD_TAB) {
          arr.push(resolveClassName('tab--vertical-tab'));
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
        scrollStep,
        validateActive,
        changeOnHover,
        changeOnHoverDelay,
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
        scrollStep,
        validateActive,
        changeOnHover,
        changeOnHoverDelay,
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
        <TabNav v-slots={this.$slots} {...props} />
      );
    };

    return (
      <div class={getTabBoxClass()}>
        {getTabHeader()}
        <div class={resolveClassName('tab-content')}>
          {this.$slots.default?.()}
        </div>
      </div>
    );
  },
});
