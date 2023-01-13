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

import { ComponentInternalInstance, computed, defineComponent, h, ref } from 'vue';

import { Close, Plus } from '@bkui-vue/icon/';
import { resolveClassName } from '@bkui-vue/shared';

import { tabNavProps } from './props';

export default defineComponent({
  name: 'TabNav',
  props: tabNavProps,
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
        } = item.props;
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
    const  distinctRoots = (el1: string, el2: string) => el1 === el2;
    const methods = {
      /**
       * @description  判断拖动的元素是否是在同一个tab。
       *               使用guid，相比 el1.parentNode === el2.parentNode 判断，性能要高
       * @param e {event}  触发的元素
       * @return {boolean}
       */
      handleTabAdd(e) {
        props.tabAdd(e);
      },
      dragstart(index: number, $event: DragEvent) {
        dragStartIndex.value = index;
        draggingEle.value = props.guid;
        // 拖动鼠标效果
        Object.assign($event.dataTransfer, { effectAllowed: 'move' });
        // $event.dataTransfer.setData('text/plain', index)
        props.tabDrag(index, $event);
      },
      dragenter(index) {
        // 缓存目标元素索引，方便添加样式
        if (distinctRoots(draggingEle.value, props.guid)) {
          dragenterIndex.value = index;
        }
      },
      dragend() {
        dragenterIndex.value = -1;
        dragStartIndex.value = -1;
        draggingEle.value = null;
      },
      drop(index, sortType) {
        // 不是同一个tab，返回——暂时不支持跨tab拖动
        if (!distinctRoots(draggingEle.value, props.guid)) {
          return false;
        }
        props.tabSort(dragStartIndex.value, index, sortType);
      },
      handleTabChange(name: string) {
        props.tabChange(name);
      },
      handleTabRemove(index: number, panel) {
        props.tabRemove(index, panel);
      },
    };
    return {
      ...methods,
      navs,
      dragenterIndex,
      dragStartIndex,
      draggingEle,
      guid: Math.random().toString(16)
        .substr(4) + Math.random().toString(16)
        .substr(4),
    };
  },
  render() {
    const {
      active, closable, addable, sortable, sortType, labelHeight,
      dragstart, dragenter, dragend, drop,
    } = this;
    const renderNavs = () => this.navs.map((item, index) => {
      if (!item) {
        return null;
      }
      const { name, disabled, tabLabel } = item;
      const getNavItemClass = () => {
        const classNames = [resolveClassName('tab-header-item')];
        if (disabled) {
          classNames.push(resolveClassName('tab-header--disabled'));
        }
        if (active === name) {
          classNames.push(resolveClassName('tab-header--active'));
        }
        return classNames.join(' ');
      };
      // const getValue = (value, value2) => (typeof value === 'boolean' ? value : value2);
      const getValue = (curentValue, parentValue) => curentValue || parentValue;
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
          && (<Close class={resolveClassName('tab-header-item-close')} onClick={(): void => this.handleTabRemove(index, item)} />)}
        </div>
      );
    });
    const renderSlot = () => {
      const list = [];
      if (typeof this.$slots.add === 'function') {
        list.push(this.$slots.add?.(h));
      } else if (addable) {
        list.push(<div onClick={this.handleTabAdd}><Plus style="display:flex;" width={26} height={26} /></div>);
      }
      if (list.length) {
        return (
          <div class={resolveClassName('tab-header-operation')}>
            {
              list.map((item, index) => (
                <div class={resolveClassName('tab-header-item')} key={index}>{item}</div>
              ))
            }
          </div>
        );
      }
      return null;
    };
    return (
      <div style={{ lineHeight: `${labelHeight}px` }} class={resolveClassName('tab-header')}>
        <div class={resolveClassName('tab-header-nav')}>
          {renderNavs()}
        </div>
        { renderSlot()}
        {
          typeof this.$slots.setting === 'function' &&  (
            <div class={resolveClassName('tab-header-setting')}>
            {this.$slots.setting() }
          </div>
          )
        }
      </div>
    );
  },
});
