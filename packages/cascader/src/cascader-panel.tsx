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

import BkCheckbox from '@bkui-vue/checkbox';
import { AngleRight, Spinner } from '@bkui-vue/icon';
import { arrayEqual, PropTypes } from '@bkui-vue/shared';

import { IData, INode } from './interface';

export default defineComponent({
  name: 'CascaderPanel',
  props: {
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def('auto'),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(216),
    store: PropTypes.object.def({}),
    modelValue: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number).def([]),
      PropTypes.arrayOf(PropTypes.string).def([])]),
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { store } = props;
    const menus = reactive({
      list: [props.store.getNodes()],
    });
    const activePath = ref([]);
    const checkValue = ref([]);

    const getSizeComputed = (value: string | number) => {
      if (typeof value === 'number') {
        return `${value}px`;
      }
      return value;
    };

    const panelHeight = getSizeComputed(props.height);
    const panelWidth = getSizeComputed(props.width);

    const updateCheckValue = (value: Array<number | string>) => {
      if (value.length === 0) {
        menus.list = menus.list.slice(0, 1);
        activePath.value = [];
      }
      value.forEach((id: number | string) => {
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

    const isNodeInPath = (node: INode) => {
      const currentLevel = activePath.value[node.level - 1] || {};
      return currentLevel.id === node.id;
    };

    const isCheckedNode = (node: INode, checkValue: string[]) => {
      const { multiple } = node.config;
      if (multiple) {
        return false;
        // return checkValue.some(val => arrayEqual(val, node.path));
      }
      return arrayEqual(checkValue, node.path);
    };

    const checkNode = (node: INode, value: boolean) => {
      node.setNodeCheck(value);
      nodeCheckHandler(node);
    };

    const iconRender = node => (node.loading ? <Spinner class="icon-spinner"></Spinner> : <AngleRight class="icon-angle-right"></AngleRight>);

    watch(
      () => props.modelValue,
      (value: Array<string | number>) => {
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
    };
  },
  render() {
    return (
      <div class="bk-cascader-panel-wrapper">
        {this.menus.list.map(menu => (
          <ul class="bk-cascader-panel bk-scroll-y"
            style={{ height: this.panelHeight, width: this.panelWidth }}>
            {menu.map(node => (
              <li
                class={[
                  'bk-cascader-node',
                  { 'is-selected': this.isNodeInPath(node) },
                  { 'is-disabled': node.isDisabled },
                  { 'is-checked': this.isCheckedNode(node, this.checkValue) },
                ]}
                {...this.nodeEvent(node)}
              >
                {node.config.multiple && (
                  <BkCheckbox
                    disabled={node.isDisabled}
                    v-model={node.checked}
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
