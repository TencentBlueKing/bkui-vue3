/**
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

/* eslint-disable arrow-body-style */
import { computed, defineComponent, ref, toRaw, toRefs, watch } from 'vue';

import { ArrowsRight, Error, Search, Transfer } from '@bkui-vue/icon/';
import BkInput from '@bkui-vue/input';

import { ArrayType } from './const';
import { transferProps } from './props';

// 生成数据
function useTransferData(sourceData, targetList, settingCode) {
  const selectList = ref([]);
  const selectedList = ref([]);
  const transformData = () => {
    sourceData.value.forEach((s) => {
      const keyId = s[settingCode.value];
      if (targetList.value.includes(keyId)) {
        selectedList.value.push(s);
      } else {
        selectList.value.push(s);
      }
    });
  };
  transformData();
  watch(() => [sourceData, targetList, settingCode], transformData);

  return {
    selectList,
    selectedList,
  };
}
// 搜索
function useSelectListSearch(selectList, displayCode) {
  const selectSearchQuery = ref('');
  const selectListSearch = computed(() => {
    return selectList.value.filter((select) => {
      const val = select[displayCode.value];
      if (val instanceof Object) return false;
      return val.toString().includes(selectSearchQuery.value);
    });
  });
  return {
    selectSearchQuery,
    selectListSearch,
  };
}

export default defineComponent({
  name: 'Transfer',
  props: transferProps,
  emits: ['change', 'update:targetList'],
  setup(props, { emit }) {
    // 区分数据是基础数据数组(false)还是对象数组(true)
    const sourceListType = computed(() => {
      if (Array.isArray(props.sourceList)) {
        const isObjectArray = props.sourceList.every(s => s.toString().includes('[object Object]'));
        return isObjectArray ? ArrayType.OBJECT_ARRAY : ArrayType.BASE_ARRAY;
      }
      return ArrayType.NOT_ARRAY;
    });
    const settingCode = computed(() => (sourceListType.value === ArrayType.BASE_ARRAY ? 'value' : props.settingKey));
    const displayCode = computed(() => (sourceListType.value === ArrayType.BASE_ARRAY ? 'value' : props.displayKey));
    const sortCode = computed(() => (props.sortKey || displayCode.value));
    // 处理为统一格式
    const sourceData = computed(() => {
      switch (sourceListType.value) {
        case ArrayType.BASE_ARRAY:
          // 封装为对象
          return [...new Set(props.sourceList)].map(s => ({ value: s }));
        case ArrayType.OBJECT_ARRAY:
          return [...props.sourceList];
        default:
          return [];
      }
    });
    // 获取左右列表
    const { targetList } = toRefs(props);
    const { selectList, selectedList } = useTransferData(sourceData, targetList, settingCode);
    // 使用搜索
    const { selectSearchQuery, selectListSearch } = useSelectListSearch(selectList, displayCode);

    const selectListSort = computed(() => {
      return [...selectListSearch.value].sort((a, b) => {
        const va = a[sortCode.value];
        const vb = b[sortCode.value];
        return va > vb ? 1 : -1;
      });
    });
    const selectedListSort = computed(() => {
      return [...selectedList.value].sort((a, b) => {
        const va = a[sortCode.value];
        const vb = b[sortCode.value];
        return va > vb ? 1 : -1;
      });
    });
    /** 全选 */
    const allToRight = () => {
      selectList.value = [];
      selectedList.value = [...sourceData.value];
      // 全选搜索结果
      // selectedList.value.push(...selectListSearch.value)
      handleEmitUpdateTargetList();
    };
    /** 移除 */
    const allToLeft = () => {
      selectList.value = [...sourceData.value];
      selectedList.value = [];
      handleEmitUpdateTargetList();
    };
      /**
     * @desc 列表项 click 事件
     * @param { string } itemKey settingCode值
     * @param { boolean } isLeft 左右面板
     */
    const handleItemClick = (itemKey, isLeft) => {
      const from = isLeft ? selectList : selectedList;
      const to = isLeft ? selectedList : selectList;
      const index = from.value.findIndex(item => item[settingCode.value] === itemKey);
      to.value.push(...from.value.splice(index, 1));
      handleEmitUpdateTargetList();
    };
    // emit事件，只有用户交互才会触发，如果是程序修改不会触发
    const handleEmitUpdateTargetList = () => {
      const restList = selectList.value.map(item => item[settingCode.value]);
      const targetList = selectedList.value.map(item => item[settingCode.value]);
      emit('update:targetList', targetList);
      emit(
        'change',
        sourceListType.value === ArrayType.BASE_ARRAY ? restList : selectList.value.map(v => toRaw(v)),
        sourceListType.value === ArrayType.BASE_ARRAY ? targetList : selectedList.value.map(v => toRaw(v)),
        targetList,
      );
    };

    return {
      selectSearchQuery,
      selectListSearch,
      selectedList,
      selectListSort,
      selectedListSort,
      settingCode,
      displayCode,
      allToRight,
      allToLeft,
      handleItemClick,
    };
  },
  render() {
    const leftList = this.sortable ? this.selectListSort : this.selectListSearch;
    const rightList = this.sortable ? this.selectedListSort : this.selectedList;
    const getHeaderHtml = (dirct) => {
      const isLeft = dirct === 'left-header';
      const titleText = isLeft ? `${this.title[0] ?? '源列表'}` : `${this.title[1] ?? '目标列表'}`;
      const isDisabled = isLeft ? !leftList.length : !rightList.length;
      const headerClick = () => {
        if (isDisabled) return;
        isLeft ? this.allToRight() : this.allToLeft();
      };

      return this.$slots[dirct]
        ? <div class="slot-header">
            {this.$slots[dirct]()}
          </div>
        : <div class="header">
            {`${titleText}（${isLeft ? leftList.length : rightList.length}）`}
            <span
              class={{ disabled: isDisabled }}
              onClick={() => headerClick()}>
              {isLeft ? '选择全部' : '清空'}
              </span>
          </div>;
    };
    const getEmptyHtml = (dirct) => {
      const isLeft = dirct === 'left-empty-content';
      const emptyText = (isLeft ? this.emptyContent[0] : this.emptyContent[1]) ?? (isLeft ? '无数据' : '未选择任何项');

      return this.$slots[dirct]
        ? <div>{this.$slots[dirct]()}</div>
        : <div class="empty">{emptyText}</div>;
    };
    const getDefaultListHtml = (item, isLeft = true) => {
      return (
        <div class="item-content">
          {/* 暂无该指令 */}
          {/* {this.showOverflowTips
            ? <span
                class="content-text"
                v-bk-overflow-tips>
                {item[this.displayCode]}
              </span>
            : <span
                class="content-text"
                title={item[this.displayCode]}>
                {item[this.displayCode]}
              </span>
          } */}
          <span
            class="content-text"
            title={item[this.displayCode]}>
            {item[this.displayCode]}
          </span>
          <span class="icon-wrapper">
            {isLeft ? <ArrowsRight class="bk-icon icon-move" /> : <Error class="bk-icon icon-delete" />}
          </span>
        </div>
      );
    };
    const getListContentHtml = (dirct) => {
      const isLeft = dirct === 'left';
      const list = isLeft ? leftList : rightList;
      const slotName = isLeft ? 'source-option' : 'target-option';
      const emptySlotName = isLeft ? 'left-empty-content' : 'right-empty-content';

      return list.length
        ? <ul class={['content', this.searchable && isLeft ? 'is-search' : '']}>
            {list.map(item => (
              <li
                key={item[this.settingCode]}
                class={[this.$slots[slotName] ? 'custom-item' : '']}
                onClick={() => this.handleItemClick(item[this.settingCode], isLeft)}>
                {this.$slots[slotName]?.(item) ?? (getDefaultListHtml(item, isLeft))}
              </li>
            ))}
          </ul>
        : getEmptyHtml(emptySlotName);
    };

    return (
      <div class={['bk-transfer', this.extCls]}>
        <div class="source-list">
          {getHeaderHtml('left-header')}
          {
            this.searchable
              && <BkInput
                v-model={this.selectSearchQuery}
                class="transfer-search-input"
                clearable={true}
                placeholder={this.searchPlaceholder || '搜索'}>
                {{
                  prefix: () => (
                    <Search class="icon-search" />
                  ),
                }}
                </BkInput>
          }
          {getListContentHtml('left')}
        </div>
        <Transfer class="transfer" />
        <div class="target-list">
          {getHeaderHtml('right-header')}
          {getListContentHtml('right')}
        </div>
      </div>
    );
  },
});
