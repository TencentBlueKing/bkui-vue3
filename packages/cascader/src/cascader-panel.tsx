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

import { defineComponent, reactive, ref, watch } from 'vue';
import { array, object } from 'vue-types';

import BkCheckbox from '@bkui-vue/checkbox';
import { AngleRight, Spinner } from '@bkui-vue/icon';
import { arrayEqual, PropTypes, resolveClassName } from '@bkui-vue/shared';

import { IData, INode } from './interface';

export default defineComponent({
  name: 'CascaderPanel',
  props: {
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def('auto'),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(216),
    store: PropTypes.object.def({}),
    separator: PropTypes.string.def(''),
    suggestions: PropTypes.arrayOf(object<INode>()),
    isFiltering: PropTypes.bool.def(false),
    searchKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(''),
    modelValue: PropTypes.arrayOf(PropTypes.oneOfType([array<string>(), String, Number])),
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { store } = props;
    const menus = reactive({
      list: [props.store.getNodes()],
    });
    const activePath = ref([]);
    const checkValue = ref<(number | string | string[])[]>([]);

    const getSizeComputed = (value: string | number) => {
      if (typeof value === 'number') {
        return `${value}px`;
      }
      return value;
    };

    const panelHeight = getSizeComputed(props.height);
    const panelWidth = getSizeComputed(props.width);

    const updateCheckValue = (value: Array<number | string | string[]>) => {
      if (value.length === 0) {
        menus.list = menus.list.slice(0, 1);
        activePath.value = [];
      }
      value.forEach((id: number | string | string[]) => {
        const node = store.getNodeById(id);
        nodeExpandHandler(node);
      });
      checkValue.value = value;
    };

    /** 节点选中回调
     *  根据单选、多选配置checkValue
     *  派发事件，更新选中值
     */
    const nodeCheckHandler = (node: INode) => {
      if (node.isDisabled) {
        return;
      }
      if (node.config.multiple) {
        checkValue.value = store.getCheckedNodes().map(node => node.path);
      } else {
        checkValue.value = node.path;
      }
      emit('update:modelValue', checkValue.value);
    };

    /** node点击展开回调 */
    const nodeExpandHandler = (node: INode) => {
      if (!node || node?.isDisabled) return;

      menus.list = menus.list.slice(0, node.level);
      activePath.value = activePath.value.slice(0, node.level - 1);

      /** 如果所点击的node具有children元素，则直接展开
       *  否则判断是否开启了远程加载，进行远程加载列表
       */
      if (node.children?.length) {
        menus.list.push(node.children);
        activePath.value.push(node);
        return;
      }
      if (store.config.isRemote && !node.isLeaf) {
        node.loading = true;
        const updateNodes = (nodeData: IData[]) => {
          store.appendNodes(nodeData, node || null);
          menus.list.push(node.children);
          activePath.value.push(node);
          node.loading = false;
        };
        store.config.remoteMethod(node, updateNodes);
      }
    };

    const nodeEvent = (node: INode) => {
      const { trigger, checkAnyLevel, multiple } = node.config;
      const events = {
        onClick: (e: Event) => {
          if (!node.isLeaf || multiple) e.stopPropagation();
          trigger === 'click' && nodeExpandHandler(node);
          checkAnyLevel && !multiple && nodeCheckHandler(node);
          node.isLeaf && !multiple && nodeCheckHandler(node);
        },
        onMouseenter: () => {
          trigger === 'hover' && nodeExpandHandler(node);
        },
      };
      return events;
    };

    const searchPanelEvents = (node: INode) => {
      const { multiple } = node.config;
      const events = {
        onClick: (e: Event) => {
          if (multiple) {
            e.stopPropagation();
            checkNode(node, !node.checked);
            return;
          }
          nodeExpandHandler(node);
          node.isLeaf && !multiple && nodeCheckHandler(node);
        },
      };
      return events;
    };

    const isNodeInPath = (node: INode) => {
      const currentLevel = activePath.value[node.level - 1] || {};
      return currentLevel.id === node.id;
    };

    const isCheckedNode = (node: INode, checkValue: (string | number | string[])[]) => {
      const { multiple } = node.config;
      if (multiple) {
        return (checkValue as string[][]).some((val: string[]) => arrayEqual(val, node.path as string[]));
      }
      return arrayEqual(checkValue, node.path);
    };

    /** 多选节点checkbox点击的回调 */
    const checkNode = (node: INode, value: boolean) => {
      node.setNodeCheck(value ? value : false);
      nodeCheckHandler(node);
    };

    const iconRender = node => (node.loading ? <Spinner class="icon-spinner"></Spinner> : <AngleRight class="icon-angle-right"></AngleRight>);

    watch(
      () => props.modelValue,
      (value: Array<string | number | string[]>) => {
        updateCheckValue(value);
      },
      { immediate: true },
    );

    watch(
      () => props.store,
      (value) => {
        menus.list = [value.getNodes()];
      },
    );

    return {
      menus,
      activePath,
      nodeExpandHandler,
      isNodeInPath,
      nodeEvent,
      isCheckedNode,
      checkValue,
      checkNode,
      iconRender,
      panelWidth,
      panelHeight,
      searchPanelEvents,
    };
  },
  render() {
    const emptyWidth = parseInt(this.panelWidth, 10) > 200 ? this.panelWidth : `${200}px`;
    const searchPanelRender = () => (
      this.suggestions.length ? <ul
        class={[resolveClassName('cascader-panel'), 'bk-scroll-y']}
        style={{ height: this.panelHeight, width: this.panelWidth }}>
          {this.suggestions.map(node => (
            <li class={[
              resolveClassName('cascader-node'),
              { 'is-selected': this.isNodeInPath(node) },
              { 'is-disabled': node.isDisabled },
              { 'is-checked': this.isCheckedNode(node, this.checkValue) },
            ]}
            {...this.searchPanelEvents(node)}>
              {node.pathNames.join(this.separator)}
            </li>
          ))}
      </ul> : <div class={resolveClassName('cascader-search-empty')} style={{ width: emptyWidth }}>
        <span>暂无搜索结果</span>
      </div>
    );
    return (
      <div class={resolveClassName('cascader-panel-wrapper')}>
        {this.isFiltering ? searchPanelRender() : this.menus.list.map(menu => (
          <ul class={[resolveClassName('cascader-panel'), 'bk-scroll-y']}
            style={{ height: this.panelHeight, width: this.panelWidth }}>
            {menu.map(node => (
              <li
                class={[
                  resolveClassName('cascader-node'),
                  { 'is-selected': this.isNodeInPath(node) },
                  { 'is-disabled': node.isDisabled },
                  { 'is-checked': !node.config.multiple && this.isCheckedNode(node, this.checkValue) },
                ]}
                {...Object.assign(this.nodeEvent(node), node.config.multiple ? {} : {})}
              >
                {node.config.multiple && (
                  <BkCheckbox
                    disabled={node.isDisabled}
                    v-model={node.checked}
                    indeterminate={node.isIndeterminate}
                    style="margin-right: 5px"
                    onChange={(val: boolean) => this.checkNode(node, val)}></BkCheckbox>
                )}
                {this.$slots.default?.({ node, data: node.data })}
                {!node.isLeaf ? this.iconRender(node) : ''}
              </li>
            ))}
          </ul>
        ))}
      </div>
    );
  },
});
