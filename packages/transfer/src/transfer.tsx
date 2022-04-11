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

import {
  defineComponent,
  ExtractPropTypes,
  ref,
  PropType,
  computed,
  watch,
} from 'vue';
import { PropTypes, isEmpty } from '@bkui-vue/shared';
import { ArrowsRight, Error } from '@bkui-vue/icon/';
import BkInput from '@bkui-vue/input';

const transferProps = {
  title: Array as PropType<string[]>,
  extCls: PropTypes.string,
  settingKey: PropTypes.string,
  displayKey: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  showOverflowTips: PropTypes.bool,
  searchable: PropTypes.bool,
  sortKey: PropTypes.string,
  sortable: PropTypes.bool,
  sourceList: Array,
  targetList: Array,
  emptyContent: Array as PropType<string[]>,
};

export type TransferPropType = ExtractPropTypes<typeof transferProps>;

export default defineComponent({
  name: 'Transfer',
  props: {
    // 顶部title(title[0]: 左侧title,title[1]: 右侧title,)
    title: { type: Array as PropType<string[]>, default: () => ([]) },
    // 自定义class
    extCls: { type: String, default: '' },
    // 搜索框 placeholder
    searchPlaceholder: { type: String, default: '' },
    // 唯一key值
    settingKey: { type: String, default: 'id' },
    // 循环list时，显示字段的key值(当list为普通数组时可不传传了也无效)
    displayKey: { type: String, default: 'value' },
    // 排序所依据的key(当list为普通数组时可不传，默认按照index值排序)
    sortKey: { type: String, default: '' },
    // 内容超出是否显示tooltip
    showOverflowTips: { type: Boolean, default: false },
    // 是否开启搜索
    searchable: { type: Boolean, default: false },
    // 是否开启排序功能
    sortable: { type: Boolean, default: false },
    // 穿梭框数据源(支持普通数组)
    sourceList: { type: Array, default: () => ([]) },
    // 默认已选择的数据源
    targetList: { type: Array, default: () => ([]) },
    // 穿梭框无数据时提示文案
    emptyContent: { type: Array as PropType<string[]>, default: () => ([]) },
  },
  emits: ['change'],
  slots: [
    'left-header',
    'right-header',
    'source-option',
    'target-option',
    'left-empty-content',
    'right-empty-content',
  ],
  setup(props: TransferPropType, { emit }) {
    let sortList = [];
    let sortCode = props.sortKey;
    let isSortFlag = props.sortable;

    const keyword = ref('');
    const transferRef = ref(null);
    const dataList = ref([]);
    const hasSelectedList = ref([]);
    const leftHoverIndex = ref(-1);
    const rightHoverIndex = ref(-1);

    const typeFlag = computed<boolean | 'empty'>(() => {
      if (!props.sourceList || !Array.isArray(props.sourceList)) {
        return 'empty';
      }
      const str = props.sourceList.toString();
      if (str.indexOf('[object Object]') !== -1) {
        return true;
      }
      return false;
    });
    const settingCode = computed(() => {
      // 普通数组
      if (!typeFlag.value) {
        return 'index';
      }
      return props.settingKey;
    });
    const displayCode = computed(() => {
      // 普通数组
      if (!typeFlag.value) {
        return 'value';
      }
      return props.displayKey;
    });
    const displayDataList = computed(() => {
      // 搜索
      if (keyword.value) {
        return dataList.value.filter(item => !isEmpty(item[displayCode.value])
          && String(item[displayCode.value]).indexOf(keyword.value) > -1);
      }

      return dataList.value;
    });

    watch(() => props.sourceList, () => {
      if (typeFlag.value !== 'empty') {
        initData();
        initSort();
      }
    }, { deep: true });
    watch(() => props.targetList, () => {
      initData();
      initSort();
    }, { deep: true });
    watch(() => [displayCode.value, settingCode.value], () => {
      initData();
    });
    watch(() => props.sortKey, (value) => {
      sortCode = value;
      initSort();
    });
    watch(() => props.sortable, (value) => {
      isSortFlag = value;
      initSort();
    });

    /** 数据改变初始化 */
    const initData = () => {
      if (typeFlag.value !== 'empty') {
        if (!typeFlag.value) {
          generalInit();
        } else {
          init();
        }
      }
    };
    /** 普通数组数据初始化 */
    const generalInit = () => {
      if (!props.targetList.length || props.targetList.length > props.sourceList.length) {
        const list = [];
        for (let i = 0; i < props.sourceList.length; i++) {
          list.push({
            index: i,
            value: props.sourceList[i],
          });
        }
        dataList.value = [...list];
        hasSelectedList.value.splice(0, hasSelectedList.value.length, ...[]);
        emit('change', dataList.value, [], []);
      } else {
        const list = [];
        const valueList = [];
        for (let i = 0; i < props.sourceList.length; i++) {
          list.push({
            index: i,
            value: props.sourceList[i],
          });
        }
        props.targetList.forEach((target) => {
          const matchItem = list.find(val => val.value === target);
          if (matchItem) {
            valueList.push(matchItem);
          }
        });
        hasSelectedList.value = [...valueList];
        const result = list.filter(item1 => valueList.every(item2 => item2.index !== item1.index));
        dataList.value = [...result];
        emit('change', dataList.value, [...handleListFormat(hasSelectedList.value, false)], []);
      }
    };
    /** 对象数组数据初始化 */
    const init = () => {
      if (!props.targetList.length || props.targetList.length > props.sourceList.length) {
        dataList.value.splice(0, dataList.value.length, ...props.sourceList);
        hasSelectedList.value = [];
        emit('change', dataList.value, [], []);
      } else {
        // eslint-disable-next-line max-len
        const result = props.sourceList.filter(item1 => props.targetList.every(item2 => item2 !== item1[settingCode.value]));
        const hasTempList = [];
        props.sourceList.forEach((item1) => {
          props.targetList.forEach((item2) => {
            if (item1[settingCode.value] === item2) {
              hasTempList.push(item1);
            }
          });
        });
        hasSelectedList.value = [...hasTempList];
        dataList.value = [...result];
        const list = [...handleListFormat(hasSelectedList.value)];
        emit('change', dataList.value, hasSelectedList.value, list);
      }
    };
    /** 初始化排序 */
    const initSort = () => {
      let templateList = [];
      if (!typeFlag.value) {
        sortCode = isSortFlag ? 'index' : '';
        for (let k = 0; k < props.sourceList.length; k++) {
          templateList.push({
            index: k,
            value: props.sourceList[k],
          });
        }
      } else {
        if (!isSortFlag) {
          sortCode = '';
        }
        templateList = [...props.sourceList];
      }
      if (sortCode) {
        const arr = [];
        templateList.forEach((item) => {
          arr.push(item[sortCode]);
        });
        sortList = [...arr];
        if (sortList.length === props.sourceList.length) {
          const list = [...dataList.value];
          dataList.value = [...sortDataList(list, sortCode, sortList)];
        }
      }
    };
    /** 选项改变触发 change */
    const handleItemChange = () => {
      const sourceList = dataList.value;
      const targetList = !typeFlag.value
        ? [...handleListFormat(hasSelectedList.value, false)] : hasSelectedList.value;
      const targetValueList = !typeFlag.value ? [] : [...handleListFormat(hasSelectedList.value)];
      emit('change', sourceList, targetList, targetValueList);
    };
    /** 数组数据格式处理 普通数组 ｜ 对象数组 */
    const handleListFormat = (list, objectType = true) => {
      const templateList = [];
      if (!list.length) {
        return [];
      }
      const dataList = [...list];
      dataList.forEach((item) => {
        if (objectType) {
          for (const [key, value] of Object.entries(item)) {
            if (key === settingCode.value) {
              templateList.push(value);
            }
          }
        } else {
          templateList.push(item.value);
        }
      });

      return templateList;
    };
    /** 全选 */
    const allToRight = () => {
      leftHoverIndex.value = -1;
      const curDisplayDataList = displayDataList.value;
      const selectedList = hasSelectedList.value;

      // 遍历左边列表（包括搜索后的列表）
      curDisplayDataList.forEach((transferItem) => {
        selectedList.push(transferItem);
        removeFromDataList(transferItem);
      });

      if (sortList.length === props.sourceList.length) {
        hasSelectedList.value = [...sortDataList(selectedList, sortCode, sortList)];
      } else {
        hasSelectedList.value = [...selectedList];
      }
      handleItemChange();
    };
    /** 全部移除到左侧穿梭框 */
    const allToLeft = () => {
      rightHoverIndex.value = -1;
      const selectedList = hasSelectedList.value;
      const curDataList = dataList.value;
      while (selectedList.length) {
        const transferItem = selectedList.shift();
        curDataList.push(transferItem);
        if (sortList.length === props.sourceList.length) {
          dataList.value = [...sortDataList(curDataList, sortCode, sortList)];
        } else {
          dataList.value = [...curDataList];
        }
      }
      handleItemChange();
    };
    /** 排序处理 */
    const sortDataList = (list, key, sortList) => {
      const arr = sortList;
      return list.sort((a, b) => arr.indexOf(a[key]) - arr.indexOf(b[key]) >= 0);
    };
    /** 从左边列表中删除 */
    const removeFromDataList = (removeItem) => {
      // eslint-disable-next-line max-len
      dataList.value = dataList.value.filter(item => item[settingCode.value] !== removeItem[settingCode.value]);
    };
    /**
     * @desc 列表项 mouseover mouseleave 事件
     * @param { strin } type 事件类型 over | leave
     * @param { Event } event
     * @param { boolean } isLeft 左右面板
     * @param { number } index 索引
     */
    const handleItemMouseEvent = (type, event, isLeft, index) => {
      event.preventDefault();
      event.stopPropagation();
      const hoverIndex = type === 'over' ? index : -1;
      isLeft ? leftHoverIndex.value = hoverIndex : rightHoverIndex.value = hoverIndex;
    };
      /**
     * @desc 列表项 click 事件
     * @param { Event } event
     * @param { number } index 索引
     * @param { boolean } isLeft 左右面板
     */
    const handleItemClick = (event, index, isLeft) => {
      event.preventDefault();
      event.stopPropagation();

      isLeft ? leftHoverIndex.value = -1 : rightHoverIndex.value = -1;
      const transferItem = isLeft ? displayDataList.value[index] : hasSelectedList.value.splice(index, 1)[0];
      const selectedList = isLeft ? hasSelectedList.value : dataList.value;
      selectedList.push(transferItem);
      isLeft && removeFromDataList(transferItem);

      const newList = sortList.length === props.sourceList.length
        ? [...sortDataList(selectedList, sortCode, sortList)] : [...selectedList];

      isLeft ? hasSelectedList.value = [...newList] : dataList.value = [...newList];

      handleItemChange();
    };

    if (typeFlag.value !== 'empty') {
      if (!typeFlag.value) {
        generalInit();
      } else {
        init();
      }
      initSort();
    }

    return {
      keyword,
      transferRef,
      dataList,
      allToRight,
      allToLeft,
      displayDataList,
      displayCode,
      leftHoverIndex,
      rightHoverIndex,
      handleItemMouseEvent,
      handleItemClick,
      hasSelectedList,
    };
  },
  render() {
    const {
      extCls,
      title,
      // showOverflowTips,
      emptyContent,
      searchable,
      searchPlaceholder,
    } = this.$props;
    const getHeaderHtml = (dirct) => {
      const isLeft = dirct === 'left-header';
      const titleText = isLeft ? `${title[0] ?? '左侧列表'}` : `${title[1] ?? '右侧列表'}`;
      const isDisabled = isLeft ? !this.dataList.length : !this.hasSelectedList.length;
      const headerClick = () => {
        if (isLeft && this.dataList.length) {
          this.allToRight();
        }
        if (!isLeft && this.hasSelectedList.length) {
          this.allToLeft();
        }
      };

      return this.$slots[dirct]
        ? <div class="slot-header">
            <div class="slot-content">{this.$slots[dirct]()}</div>
          </div>
        : <div class="header">
            {`${titleText}（共${this.dataList.length}条）`}
            <span
              class={{ disabled: isDisabled }}
              onClick={() => headerClick()}>
              {isLeft ? '全部添加' : '清空'}
              </span>
          </div>;
    };
    const getEmptyHtml = (dirct) => {
      const isLeft = dirct === 'left-empty-content';
      const emptyText = (isLeft ? emptyContent[0] : emptyContent[1]) ?? (isLeft ? '无数据' : '未选择任何项');

      return this.$slots[dirct]
        ? <div>{this.$slots[dirct]()}</div>
        : <div class="empty">{emptyText}</div>;
    };
    const getDefaultListHtml = (item, index, isLeft = true) => {
      const hoverIndex = isLeft ? this.leftHoverIndex : this.rightHoverIndex;

      return (
        <div class="item-content">
          {/* 暂无该指令 */}
          {/* {showOverflowTips
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
          <span
            class={['icon-wrapper', index === hoverIndex ? 'hover' : '']}>
            {isLeft ? <ArrowsRight class="bk-icon" /> : <Error class="bk-icon" />}
          </span>
        </div>
      );
    };
    const getListContentHtml = (dirct) => {
      const isLeft = dirct === 'left';
      const list = isLeft ? this.displayDataList : this.hasSelectedList;
      const slotName = isLeft ? 'source-option' : 'target-option';
      const emptySlotName = isLeft ? 'left-empty-content' : 'right-empty-content';

      return list.length
        ? <ul class={['content', searchable && isLeft ? 'is-search' : '']}>
            {list.map((item, index) => (
              <li
                key={index}
                class={[!!this.$slots[slotName] ? 'custom-item' : '']}
                onClick={event => this.handleItemClick(event, index, isLeft)}
                onMouseover={event => this.handleItemMouseEvent('over', event, isLeft, index)}
                onMouseleave={event => this.handleItemMouseEvent('leave', event, isLeft, index)}>
                {this.$slots[slotName]?.(item)
                  ?? (getDefaultListHtml(item, index, isLeft))
                }
              </li>
            ))}
          </ul>
        : getEmptyHtml(emptySlotName);
    };

    return (
      <div class={['bk-transfer', extCls]} ref="transferRef">
        <div class="source-list">
          {getHeaderHtml('left-header')}
          {
            searchable
              && <BkInput
                v-model={this.keyword}
                class="transfer-search-input"
                clearable={true}
                placeholder={searchPlaceholder || '请输入搜索关键字'}
                type="search"
                left-icon='bk-icon icon-search' />
          }
          {getListContentHtml('left')}
        </div>
        <div class="transfer"></div>
        <div class="target-list">
          {getHeaderHtml('right-header')}
          {getListContentHtml('right')}
        </div>
      </div>
    );
  },
});
