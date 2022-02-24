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
  Component, defineComponent, getCurrentInstance, onMounted, onUpdated, ref, Fragment, ComponentInternalInstance, VNode,
} from 'vue';
import { PropTypes } from '@bkui-vue/shared';
import TabNav from './tab-nav';
export default defineComponent({
  name: 'Tab',
  components: {
    TabNav,
  },
  props: {
    active: {
      type: String || Number,
    },
    type: PropTypes.commonType(['card', 'border-card', 'unborder-card'], 'type').def('border-card'),
    tabPosition: PropTypes.commonType(['left', 'right', 'top'], 'position').def('top'),
    closable: PropTypes.bool.def(false),
    addable: PropTypes.bool.def(false),
    sortable: PropTypes.bool.def(false),
    sortType: PropTypes.commonType(['replace', 'insert', 'top'], 'sortType').def('replace'),
    labelHeight: PropTypes.number.def(50),
    scrollStep: PropTypes.number.def(200),
    extCls: PropTypes.string.def(''),
    validateActive: PropTypes.bool.def(true),
    showHeader: PropTypes.bool.def(true),
    changeOnHover: PropTypes.bool.def(false),
    changeOnHoverDelay: PropTypes.number.def(1000),
  },
  emits: [
    // 兼容老方法
    'add-panel', 'tab-change', 'close-panel', 'sort-change', 'on-drag-tab',
    // 新方法
    'add', 'change', 'remove', 'update:active', 'sort', 'drag',
  ],
  methods: {
    tabAdd(e: MouseEvent) {
      this.$emit('add', { e });
      this.$emit('add-panel', { e });
    },
    tabChange(name: string) {
      // emit('xxx') 会调用onXxx函数, 所以不必在主动调用onXxx函数了
      this.$emit('change', name);
      this.$emit('tab-change', name);
      this.$emit('update:active', name);
    },
    tabRemove(index: number, panel) {
      // emit('xxx') 会调用onXxx函数, 所以不必在主动调用onXxx函数了
      this.$emit('remove', index, panel);
      this.$emit('close-panel', index, panel);
    },
    tabSort(dragTabIndex: number, dropTabIndex: number) {
      // emit('xxx') 会调用onXxx函数, 所以不必在主动调用onXxx函数了
      this.$emit('sort', dragTabIndex, dropTabIndex);
      this.$emit('sort-change', dragTabIndex, dropTabIndex);
    },
    tabDrag(dragTabIndex: number, dragEvent: DragEvent) {
      // emit('xxx') 会调用onXxx函数, 所以不必在主动调用onXxx函数了
      this.$emit('drag', dragTabIndex, dragEvent);
      this.$emit('on-drag-tab', dragTabIndex, dragEvent);
    },
  },
  setup(_props: Record<string, any>, { slots }) {
    /* const panels = slots.default();
    return {
      panels,
    };
    console.log(panels);*/
    const isMounted = ref(false);
    const panels = ref([]);
    const instance = getCurrentInstance();
    if (typeof slots.panel === 'function') {
      panels.value = slots.default();
    }
    if (typeof slots.default === 'function') {
      panels.value = slots.default();
    }
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
        const isChanged = !(panelInstanceList.length === panels.value.length
          && panelInstanceList.every((panel, index) => panel.uid === panels.value[index].uid));
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

    return {
      isMounted,
      panels,
    };
  },
  render() {
    const getTabBoxClass = () => {
      if (this.tabPosition === 'top') {
        return `bk-tab bk-tab--${this.tabPosition} bk-tab--${this.type} ${this.extCls}`;
      }
      return `bk-tab bk-tab--${this.tabPosition}  ${this.extCls}`;
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
        <TabNav v-slots={this.$slots} {...props}></TabNav>
      );
    };

    return (
      <div class={getTabBoxClass()}>
        {getTabHeader()}
        <div class='bk-tab-content'>
          {this.$slots.default?.()}
        </div>
      </div>
    );
  },
});
