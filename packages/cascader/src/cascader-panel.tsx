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

import { defineComponent, nextTick, reactive, ref, watch, toRefs } from 'vue';
import { array, object } from 'vue-types';

import Checkbox from '@bkui-vue/checkbox';
import { useLocale, usePrefix } from '@bkui-vue/config-provider';
import { AngleRight, Spinner } from '@bkui-vue/icon';
import { arrayEqual, PropTypes } from '@bkui-vue/shared';

import { IData, INode } from './interface';

/**
 * CascaderPanel 组件
 * 用于展示级联选择器的面板，支持多选、单选、远程加载等功能。
 */
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
    const t = useLocale('cascader');
    const { resolveClassName } = usePrefix();

    const { store } = toRefs(props);
    const menus = reactive({
      list: [props.store.getNodes()],
    });
    const activePath = ref([]);
    const checkValue = ref<(number | string | string[])[]>([]);

    /**
     * 根据传入的值计算尺寸
     * @param value - 数字或字符串类型的尺寸值
     * @returns 带单位的尺寸字符串
     */
    const getSizeComputed = (value: number | string) => {
      if (typeof value === 'number') {
        return `${value}px`;
      }
      return value;
    };

    const panelHeight = getSizeComputed(props.height);
    const panelWidth = getSizeComputed(props.width);

    /**
     * 更新选中的值
     * @param value - 选中的值数组
     */
    const updateCheckValue = (value: Array<number | string | string[]>) => {
      if (!value || value.length === 0) {
        menus.list = menus.list.slice(0, 1);
        activePath.value = [];
      }
      expandByNodeList(value);
      checkValue.value = value;
    };

    /**
     * 根据节点列表展开菜单
     * @param value - 节点ID数组
     */
    const expandByNodeList = (value: Array<number | string | string[]>) => {
      // 判断是否为初始加载
      const isInitialLoad = checkValue.value.length === 0;

      // 如果是初始加载或单选情况，按原来的逻辑处理
      if (isInitialLoad || !store.value.config.multiple) {
        let targetList = [];

        // 处理多选情况
        if (store.value.config.multiple) {
          for (const subArray of value as Array<string[]>) {
            if (subArray.length > targetList.length) {
              targetList = subArray;
            }
          }
        } else {
          // 单选情况
          targetList = value;
        }

        // 执行展开操作
        targetList.forEach((id: number | string | string[]) => {
          const node = store.value.getNodeById(id);
          if (node) {
            // 只展开，不需要重复触发
            const expandNode = (node: INode) => {
              if (!node || node?.isDisabled) return;

              const level = node.level;
              // 确保面板只更新到当前节点层级
              menus.list = menus.list.slice(0, level);
              activePath.value = activePath.value.slice(0, level - 1);

              // 如果节点有子节点，直接添加到面板
              if (node.children?.length) {
                if (menus.list.length === level) {
                  menus.list.push(node.children);
                  activePath.value.push(node);
                }
              }
            };

            // 展开节点的所有父节点
            const expandParents = (node: INode) => {
              if (node.parent) {
                expandParents(node.parent);
              }
              expandNode(node);
            };

            expandParents(node);
          }
        });
      }
      // 用户交互过程中的选择由nodeExpandHandler单独处理，这里不干预
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
        // 如果checkAnyLevel，返回所有check的节点； 否则只check 叶子节点
        const targets = store.value.config.checkAnyLevel
          ? store.value.getCheckedNodes()
          : store.value.getCheckedLeafNodes();
        checkValue.value = targets.map(node => node.path); // 如果任意级别可选，当前节点即为所选内容
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
      if (store.value.config.isRemote && !node.isLeaf) {
        node.loading = true;
        const updateNodes = (nodeData: IData[]) => {
          store.value.appendNodes(nodeData, node || null);
          menus.list.push(node.children);
          activePath.value.push(node);
          node.loading = false;
        };
        store.value.config.remoteMethod(node, updateNodes);
      }
    };

    /**
     * 生成节点事件
     * @param node - 节点对象
     * @returns 事件对象
     */
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

    /**
     * 搜索面板事件
     * @param node - 节点对象
     * @returns 事件对象
     */
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

    /**
     * 滚动到选中的节点
     */
    const scrollToSelected = () => {
      // 遍历每个级别的菜单
      menus.list.forEach((_menu, level) => {
        // 查找当前级别中选中的或已勾选的节点
        const selectedNode = document.querySelector(
          `.${resolveClassName('cascader-panel')}:nth-child(${level + 1}) .${resolveClassName('cascader-node.is-selected')}, .${resolveClassName('cascader-node.is-checked')}`,
        );
        if (selectedNode) {
          nextTick(() => {
            selectedNode.scrollIntoView();
          });
        }
      });
    };

    const noDataText = t.value.noData;
    const { emptyText } = t.value;

    /**
     * 判断节点是否在路径中
     * @param node - 节点对象
     * @returns 布尔值，表示节点是否在路径中
     */
    const isNodeInPath = (node: INode) => {
      const currentLevel = activePath.value[node.level - 1] || {};
      return currentLevel.id === node.id;
    };

    /**
     * 判断节点是否被选中
     * @param node - 节点对象
     * @param checkValue - 选中值数组
     * @returns 布尔值，表示节点是否被选中
     */
    const isCheckedNode = (node: INode, checkValue: (number | string | string[])[]) => {
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

    /**
     * 渲染节点图标
     * @param node - 节点对象
     * @returns 图标组件
     */
    const iconRender = node =>
      node.loading ? (
        <Spinner class={resolveClassName('icon-spinner')}></Spinner>
      ) : (
        <AngleRight class={resolveClassName('icon-angle-right')}></AngleRight>
      );

    // 监听 modelValue 的变化，更新选中值
    watch(
      () => props.modelValue,
      (value: Array<number | string | string[]>) => {
        updateCheckValue(value);
      },
      { immediate: true },
    );

    // 监听 store 的变化，更新菜单列表
    watch(
      () => props.store,
      value => {
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
      expandByNodeList,
      noDataText,
      emptyText,
      resolveClassName,
      scrollToSelected,
    };
  },
  render() {
    const emptyWidth = parseInt(this.panelWidth, 10) > 200 ? this.panelWidth : `${200}px`;
    const searchPanelRender = () =>
      this.suggestions.length ? (
        <ul
          style={{ height: this.panelHeight, width: this.panelWidth }}
          class={[this.resolveClassName('cascader-panel'), this.resolveClassName('scroll-y')]}
        >
          {this.suggestions.map(node => (
            <li
              class={[
                this.resolveClassName('cascader-node'),
                { 'is-selected': this.isNodeInPath(node) },
                { 'is-disabled': node.isDisabled },
                { 'is-checked': this.isCheckedNode(node, this.checkValue) },
              ]}
              {...this.searchPanelEvents(node)}
            >
              {node.pathNames.join(this.separator)}
            </li>
          ))}
        </ul>
      ) : (
        <div
          style={{ width: emptyWidth }}
          class={this.resolveClassName('cascader-search-empty')}
        >
          <span>{this.noDataText}</span>
        </div>
      );
    return (
      <div class={this.resolveClassName('cascader-panel-wrapper')}>
        {this.isFiltering
          ? searchPanelRender()
          : this.menus.list.map(menu => (
              <ul
                style={{ height: this.panelHeight, width: this.panelWidth }}
                class={[this.resolveClassName('cascader-panel'), this.resolveClassName('scroll-y')]}
              >
                {menu.length ? (
                  menu.map(node => (
                    <li
                      class={[
                        this.resolveClassName('cascader-node'),
                        { 'is-selected': this.isNodeInPath(node) },
                        { 'is-disabled': node.isDisabled },
                        { 'is-checked': !node.config.multiple && this.isCheckedNode(node, this.checkValue) },
                      ]}
                      {...Object.assign(this.nodeEvent(node), node.config.multiple ? {} : {})}
                    >
                      {node.config.multiple && (
                        <Checkbox
                          style='margin-right: 5px'
                          v-model={node.checked}
                          disabled={node.isDisabled}
                          indeterminate={node.isIndeterminate}
                          onChange={(val: unknown) => this.checkNode(node, !!val)}
                        ></Checkbox>
                      )}
                      {this.$slots.default?.({ node, data: node.data })}
                      {!node.isLeaf ? this.iconRender(node) : ''}
                    </li>
                  ))
                ) : (
                  <div class={this.resolveClassName('cascader-panel-empty-wrapper')}>{this.noDataText}</div>
                )}
              </ul>
            ))}
      </div>
    );
  },
});
