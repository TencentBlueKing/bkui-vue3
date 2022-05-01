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

import { defineComponent, reactive, ref } from 'vue';

import BkCheckbox from '@bkui-vue/checkbox';
import { AngleRight } from '@bkui-vue/icon';
import { arrayEqual, PropTypes } from '@bkui-vue/shared';

import { INode }  from './interface';;


export default defineComponent({
  name: 'BkCascaderPanel',
  props: {
    store: PropTypes.object.def({}),
  },
  emits: ['input'],
  setup(props, { emit }) {
    const { store } = props;
    const menus = reactive({
      list: [props.store.getNodes()],
    });
    const activePath = ref([]);
    const checkValue = ref([]);

    const nodeCheckHandler = (node: INode) => {
      if (node.config.multiple) {
        checkValue.value = store.getCheckedNodes().map(node => node.path);
      } else {
        checkValue.value =  node.path;
      }
      emit('input', checkValue.value);
    };

    const nodeClear = () => {
      emit('input', []);
    };

    const nodeExpandHandler = (node: INode) => {
      if (node.isDisabled) return;
      menus.list = menus.list.slice(0, node.level);
      activePath.value = activePath.value.slice(0, node.level - 1);
      if (node.children?.length) {
        menus.list.push(node.children);
        activePath.value.push(node);
      }
    };

    const nodeEvent = (node: INode) => {
      const { trigger, checkAnyLevel, multiple } = node.config;
      const events = {
        onClick: (e: Event) => {
          if (!node.isLeaf || multiple) e.stopPropagation();
          trigger === 'click' && nodeExpandHandler(node);
          (checkAnyLevel && !multiple) && nodeCheckHandler(node);
          (node.isLeaf && !multiple) && nodeCheckHandler(node);
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

    const isCheckedNode = (node: INode, checkValue: []) => {
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

    return {
      menus,
      activePath,
      nodeExpandHandler,
      isNodeInPath,
      nodeEvent,
      isCheckedNode,
      checkValue,
      nodeClear,
      checkNode,
    };
  },
  render() {
    return (
      <div class='bk-cascader-panel-wrapper'>
        {this.menus.list.map(menu => (
            <ul class='bk-cascader-panel'>
              {menu.map(node => (
                  <li class={
                    ['bk-cascader-node',
                      { 'is-selected': this.isNodeInPath(node) },
                      { 'is-disabled': node.isDisabled },
                      { 'is-checked': this.isCheckedNode(node, this.checkValue) }]
                  }
                    {...this.nodeEvent(node)}>
                    { node.config.multiple
                      && <BkCheckbox
                            disabled={node.isDisabled}
                            v-model={node.checked}
                            onChange={(val: boolean) => this.checkNode(node, val)}></BkCheckbox>}
                    <span class="content">{node.name}</span>
                    {!node.isLeaf ? <AngleRight class="icon-angle-right"></AngleRight> : ''}
                  </li>
              ))}
            </ul>
        ))}
      </div>
    );
  },
});
