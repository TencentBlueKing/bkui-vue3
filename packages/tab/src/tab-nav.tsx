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
  ComponentInternalInstance,
  computed,   defineComponent, h, PropType, ref, VNode } from 'vue';

import { Close, Plus } from '@bkui-vue/icon/';
import { PropTypes } from '@bkui-vue/shared';

/* eslint-disable */

export default defineComponent({
  name: 'TabNav',
  props: {
    active: {
      type: String || Number,
    },
    panels: {
      type: Array as PropType<VNode[]>,
      default: () => ([]),
    },
    closable: PropTypes.bool.def(false),
    addable: PropTypes.bool.def(false),
    sortable: PropTypes.bool.def(false),
    sortType: PropTypes.commonType(['replace', 'insert', 'top'], 'sortType').def('replace'),
    labelHeight: PropTypes.number.def(50),
    scrollStep: PropTypes.number.def(200),
    validateActive: PropTypes.bool.def(true),
    changeOnHover: PropTypes.bool.def(false),
    changeOnHoverDelay: PropTypes.number.def(1000),
    tabAdd: {
      type: Function,
      default: (): any => ({}),
    },
    tabChange: {
      type: Function,
      default: (): any => ({}),
    },
    tabRemove: {
      type: Function,
      default: (): any => ({}),
    },
    tabSort: {
      type: Function,
      default: (): any => ({}),
    },
    tabDrag: {
      type: Function,
      default: (): any => ({}),
    },
  },
  setup(props: Record<string, any>) {
    const navs = computed(() => {
      if (!Array.isArray(props.panels) || !props.panels.length) {
        return [];
      }
      const list = [];
      let hasFindActive = false;
      props.panels.filter((item: ComponentInternalInstance, index: number) => {
        if (!item.props) {
          return null;
        }
        const {
          name, label, closable, visible, disabled, sortable,
        } = item.props as any;
        if (!visible) {
          return false;
        }
        if (props.active === name) {
          hasFindActive = true;
        }
        const renderLabel = (label: any) => {
          if (item.slots.label) {
            return h(item.slots.label);
          }
          if ([undefined, ''].includes(label)) {
            return `选项卡${index + 1}`;
          }
          if (typeof label === 'string') {
            return label;
          }
          if (typeof label === 'function') {
            return h(label);
          }
          return label;
        };
        list.push({
          name, closable, visible, disabled, sortable,
          tabLabel: renderLabel(label),
        });
        return true;
      });
      if (!hasFindActive && props.validateActive) {
        props.panels[0].props && props.tabChange(props.panels[0].props.name);
      }
      return list;
    });
    const dragenterIndex = ref(-1);
    const dragStartIndex = ref(-1);
    const draggingEle = ref('');
    return {
      navs,
      dragenterIndex,
      dragStartIndex,
      draggingEle,
      guid: Math.random().toString(16)
        .substr(4) + Math.random().toString(16)
        .substr(4),
    };
  },
  methods: {
    /**
     * @description  判断拖动的元素是否是在同一个tab。
     *               使用guid，相比 el1.parentNode === el2.parentNode 判断，性能要高
     * @param el1 {string} 拖动的元素
     * @param el2 {string}  触发的元素
     * @return {boolean}
     */
    distinctRoots(el1: string, el2: string) {
      return el1 === el2;
    },
    swapArr(arr: any[], a: number, b: number) {
      const swap = arr[a];
      arr[a] = arr[b];
      arr[b] = swap;
    },
    handleTabAdd(e: MouseEvent) {
      this.tabAdd(e);
    },
    dragstart(index: number, $event: DragEvent) {
      this.dragStartIndex = index;
      this.draggingEle = this.guid;
      // 拖动鼠标效果
      $event.dataTransfer.effectAllowed = 'move';
      // $event.dataTransfer.setData('text/plain', index)
      this.tabDrag(index, $event);
    },
    dragenter(index) {
      // 缓存目标元素索引，方便添加样式
      if (this.distinctRoots(this.draggingEle, this.guid)) {
        this.dragenterIndex = index;
      }
    },
    dragend() {
      this.dragenterIndex = -1;
      this.dragStartIndex = -1;
      this.draggingEle = null;
    },
    drop(index, sortType) {
      // 不是同一个tab，返回——暂时不支持跨tab拖动
      if (!this.distinctRoots(this.draggingEle, this.guid)) {
        return false;
      }
      // 如果是插队模式
      if (sortType === 'insert') {
        if (this.dragStartIndex < index) {
          this.panels.splice(index + 1, 0, this.panels[this.dragStartIndex]);
          this.panels.splice(this.dragStartIndex, 1);
        } else if (this.dragStartIndex > index) {
          this.panels.splice(index, 0, this.panels[this.dragStartIndex]);
          this.panels.splice(this.dragStartIndex + 1, 1);
        } else {
          return false;
        }
      } else {
        this.swapArr(this.panels, this.dragStartIndex, index);
      }
      this.tabSort(this.dragStartIndex, index);
    },
    handleTabChange(name: string) {
      this.tabChange(name);
    },
    handleTabRemove(index: number, panel) {
      this.tabRemove(index, panel);
    },
  },
  render() {
    const {
      active, closable, addable, sortable, sortType, labelHeight,
      dragstart, dragenter, dragend, drop,
    } = this;
    // const { active, closable, addable, sortable, sortType, labelHeight, scrollStep } = this;
    const renderNavs = () => this.navs.map((item, index) => {
      if (!item) {
        return null;
      }
      const { name, disabled, tabLabel } = item;
      const getNavItemClass = () => {
        const classNames = ['bk-tab-header-item'];
        if (disabled) {
          classNames.push('bk-tab-header--disabled');
        }
        if (active === name) {
          classNames.push('bk-tab-header--active');
        }
        return classNames.join(' ');
      };
      const getValue = (value, value2) => (typeof value === 'boolean' ? value : value2);
      return (
        <div
          key={name}
          onClick={() => this.handleTabChange(name)}
          draggable={getValue(item.sortable, sortable)}
          onDragstart={e => dragstart(index, e)}
          onDragenter={(e) => {
            e.preventDefault();
            dragenter(index);
          }}
          onDragleave={(e) => {
            e.preventDefault();
          }}
          onDragover={(e) => {
            e.preventDefault();
          }}
          onDragend={(e) => {
            e.preventDefault();
            dragend();
          }}
          onDrop={(e) => {
            e.preventDefault();
            drop(index, sortType);
          }}
          class={getNavItemClass()}>
          <div>{tabLabel}</div>
          {getValue(item.closable, closable)
          && (<Close class='bk-tab-header-item-close' onClick={(): void => this.handleTabRemove(index, item)} />)}
        </div>
      );
    });
    const renderSlot = () => {
      let addSlot;
      const list = [];
      if (typeof this.$slots.add === 'function') {
        addSlot = this.$slots.add?.(h);
      } else if (addable) {
        addSlot = (
          <div onClick={this.handleTabAdd}><Plus width={26} height={26} /></div>
        );
      }
      list.push(addSlot);
      if (typeof this.$slots.setting === 'function') {
        list.push(this.$slots.setting?.(h));
      }
      return list.map((item, index) => (
        <div class={'bk-tab-header-item'} key={index}>{item}</div>
      ));
    };
    return (
      <div style={{ lineHeight: `${labelHeight}px` }} class='bk-tab-header'>
        <div class='bk-tab-header-nav'>
          {renderNavs()}
        </div>
        <div class='bk-tab-header-operation'>
          {renderSlot()}
        </div>
      </div>
    );
  },
});
