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

import { AngleDown, AngleRight } from '@bkui-vue/icon/';
import { PropTypes } from '@bkui-vue/shared';
import { computed, defineComponent, ref, watch } from 'vue';
export default defineComponent({
  name: 'Collapse',
  props: {
    /**
     * 渲染列表
     * 对象数组或者字符串数组，字符串数组默认会增加 name 字段，值为传入的字符串值
     */
    list: PropTypes.arrayOf(PropTypes.any).def([]),

    /**
     * ID字段
     */
    idFiled: PropTypes.string.def('$index'),

    /**
     * Title 字段
     */
    titleField: PropTypes.string.def('name'),

    /**
     * Content 字段，默认渲染内容，不配置时自动读取 name字段
     * 自定义配置slot时可以忽略
     */
    contentField: PropTypes.string.def('content'),

    /**
     * 当前激活Index
     */
    activeIndex: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number).def([]), PropTypes.number.def(-1)]),

    /**
     * 当前激活 Name, 与activeIndex互斥，同时配置时， activeName 覆盖 activeIndex
     */
    activeName: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string).def([]), PropTypes.string.def('')]),

    /**
     * 是否使用手风琴效果
     */
    accordion: PropTypes.bool.def(true),
  },

  setup(props, { slots }) {
    // 当前点击展开条目
    // 初始状态为null，当为null时， props配置项中的 activeIndex、activeName生效
    // 当不为null，说明当前组件内部点击操作生效，此时忽略 props配置
    const localActiveItems = ref(null);

    // 设置监视，当 activeName or activeIndex 改变时，重置 localActiveItems 为null
    // 以保证当前的设置生效
    watch(() => [props.activeName, props.activeIndex], () => {
      localActiveItems.value = null;
    });

    // 统一格式化传入数据格式为标准渲染格式
    const collapseData = computed(() => (props.list || []).map((item, index) => {
      if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
        return { $index: index, name: item };
      }
      return { $index: index, ...item };
    }));

    // 计算当前ActiveItem
    const activeItemIndexList = computed(() => {
      if (localActiveItems.value !== null) {
        return localActiveItems.value.map(item => item.$index);
      }

      if (props.activeName !== null && props.activeName !== undefined && props.activeName !== '') {
        const activeNames = resolvePropsActiveValue(props.activeName);
        return activeNames.map(name => collapseData.value.findIndex(item => item[props.idFiled] === name));
      }

      return resolvePropsActiveValue(props.activeIndex ?? 0);
    });

    // 格式化组件传入的ActiveIndex 或者 ActiveName为标准数组格式
    const resolvePropsActiveValue = (prop: string | number | Array<string> | Array<number>) => {
      if (Array.isArray(prop)) {
        return props.accordion ? resolvePropsActiveValue(prop[0]) : prop;
      }

      if (typeof prop === 'string' || typeof prop === 'number') {
        return [prop];
      }

      return [];
    };

    const handleItemClick = (item) => {
      if (localActiveItems.value === null) {
        localActiveItems.value = [item];
      } else {
        // 手风琴模式，只有一个Active，移除一个新增一个
        if (props.accordion) {
          localActiveItems.value = [item];
        } else {
          const activeItemIndex = localActiveItems.value.findIndex(local => local.$index === item.$index);
          if (activeItemIndex >= 0) {
            localActiveItems.value.splice(activeItemIndex, 1);
          } else {
            localActiveItems.value.push(item);
          }
        }
      }
    };

    // 判定当前Item是否为激活状态
    const isItemActive = item => activeItemIndexList.value.some(activeIndex => activeIndex === item.$index);

    const renderItems = () => collapseData.value.map(item => <div class="bk-collapse-item">
      <div class="bk-collapse-header" onClick={() => handleItemClick(item)}>
        <span class="bk-collapse-title">
          {slots.default?.() ?? item[props.titleField]}
        </span>
        { isItemActive(item) ? <AngleDown class="bk-collapse-icon" /> : <AngleRight class="bk-collapse-icon" />}
      </div>
      <div class={`bk-collapse-content ${(isItemActive(item) && 'active') || ''}`}>
        {slots.content?.(item) ?? item[props.contentField]}
      </div>
    </div>);

    const className = 'bk-collapse-wrapper';
    return () => <div class={className}>
      {renderItems()}
    </div>;
  },
});
