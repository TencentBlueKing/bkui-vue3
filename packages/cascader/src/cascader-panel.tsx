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
import { PropTypes, arrayEqual } from '@bkui-vue/shared';
import { AngleRight } from '@bkui-vue/icon';
import { INode }  from './interface';


export default defineComponent({
  name: 'BkCascaderPanel',
  props: {
    store: PropTypes.object.def({}),
  },
  emits: ['input'],
  setup(props, { emit }) {
    const menus = reactive({
      list: [props.store.getNodes()],
    });
    const activePath = ref([]);
    const checkValue = ref([]);

    const nodeCheckHandler = (node: INode) => {
      checkValue.value = node.config.multiple ? checkValue.value.concat(node.path) : node.path;
      emit('input', node.path);
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
      const { trigger, checkAnyLevel } = node.config;
      const events = {
        onClick: (e: Event) => {
          if (!node.isLeaf) e.stopPropagation();
          trigger === 'click' && nodeExpandHandler(node);
          checkAnyLevel && nodeCheckHandler(node);
          node.isLeaf && nodeCheckHandler(node);
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
        return checkValue.some(val => arrayEqual(val, node.path));
      }
      return arrayEqual(checkValue, node.path);
    };

    return {
      menus,
      activePath,
      nodeExpandHandler,
      isNodeInPath,
      nodeEvent,
      isCheckedNode,
      checkValue,
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
