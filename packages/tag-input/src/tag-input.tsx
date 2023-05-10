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

import { debounce } from 'lodash';
import {
  type Ref,
  computed,
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue';

import { useLocale } from '@bkui-vue/config-provider';
import { bkTooltips } from '@bkui-vue/directives';
import { Close, Error } from '@bkui-vue/icon';
import BkLoading, { BkLoadingSize } from '@bkui-vue/loading';
import BKPopover from '@bkui-vue/popover';
import {
  useFormItem,
} from '@bkui-vue/shared';

import { getCharLength, INPUT_MIN_WIDTH, useFlatList, usePage, useTagsOverflow } from './common';
import ListTagRender from './list-tag-render';
import tagProps from './tag-props';
import TagRender from './tag-render';

export default defineComponent({
  name: 'TagInput',
  directives: {
    bkTooltips,
  },
  props: tagProps(),
  emits: [
    'update:modelValue',
    'change',
    'select',
    'focus',
    'blur',
    'remove',
    'removeAll',
    'input',
  ],
  setup(props, { emit }) {
    const formItem = useFormItem();
    const t = useLocale('tagInput');
    const state = reactive({
      isEdit: false,
      isHover: false,
      focusItemIndex: props.allowCreate ? -1 : 0,
    });

    const popoverProps = reactive({
      isShow: false,
      width: 190,
      offset: {
        mainAxis: 4,
        crossAxis: 0,
        // alignmentAxis: 50,
      },
      ...props.popoverProps,
    });

    // 分页处理
    const { maxResult } = toRefs(props);
    const { pageState, initPage, pageChange } = usePage(maxResult);
    const curInputValue = ref('');
    const tagInputRef = ref(null);
    const bkTagSelectorRef = ref(null);
    const tagListRef = ref(null);
    const tagInputItemRef = ref(null);
    const selectorListRef = ref(null);
    const timer: Ref<ReturnType<typeof setTimeout>> = ref(null);

    // 是否展示tag close
    const showTagClose = computed(() => !props.disabled && props.hasDeleteIcon);
    // 是否单选
    const isSingleSelect = computed(() => props.maxData === 1);
    // 是否展示placeholder
    const isShowPlaceholder = computed(() => (
      listState.selectedTagList.length === 0 && curInputValue.value === '' && !state.isEdit
    ));
    const placeholderText = computed(() => props.placeholder || t.value.placeholder);
    // 是否展示清空Icon
    /**
     * 不显示条件：
     * 1. 设置不可清除
     * 2. 禁用时
     * 3. tag标签为空时
     * 4. 设置了showClearOnlyHover，且没有hover的时候
     */
    const isShowClear = computed(() => props.clearable
        && !props.disabled
        && listState.selectedTagList.length !== 0
        && (props.showClearOnlyHover ? state.isHover : true));
    const triggerClass = computed(() => ({
      'bk-tag-input-trigger': true,
      active: state.isEdit,
      disabled: props.disabled,
    }));

    const listState = reactive({
      localList: [],
      tagListCache: [],
      selectedTagList: [],
      selectedTagListCache: [],
    });
    // 选中标签 save key 列表
    const tagList = computed(() => listState.selectedTagList.map(tag => tag[props.saveKey]));
    // 扁平化 list
    const { flatList, saveKeyMap, flatListInit } = useFlatList(props);
    // 下拉框渲染列表
    const renderList = computed(() => {
      if (props.useGroup) {
        const groupMap = {};
        pageState.curPageList.forEach((item: any, index: number) => {
          item.__index__ = index;
          if (!groupMap[item.group.groupId]) {
            groupMap[item.group.groupId] = {
              id: item.group.groupId,
              name: item.group.groupName,
              children: [],
            };
          }
          groupMap[item.group.groupId].children.push(item);
        });
        return Object.keys(groupMap).map((key: string) => groupMap[key]);
      }
      return pageState.curPageList;
    });

    watch([() => flatList.value], () => {
      nextTick(() => {
        initData();
      });
    }, { deep: true });

    watch(() => props.modelValue, (val) => {
      if (!shallowCompareArray(tagList.value, val)) {
        nextTick(() => {
          initData();
        });
        if (props.withValidate) {
          formItem?.validate?.('change');
        }
      }
    });

    watch(curInputValue, debounce(() => {
      const hasShowCount = pageState.curPageList.length !== 0;
      const { value } = curInputValue;
      /**
       * 1. value !== '' && hasShowCount => search value list.
       * 2. value === '' && props.trigger === 'focus' && hasShowCount => trigger is focus and show all list.
       */
      if ((value !== '' && hasShowCount) || (value === '' && props.trigger === 'focus' && hasShowCount)) {
        popoverProps.isShow = true;
      } else if (props.trigger !== 'focus' || !hasShowCount) {
        popoverProps.isShow = false;
      }
    }, 150));

    watch(() => popoverProps.isShow, (show: boolean) => {
      changePopoverOffset();
      if (show) {
        if (selectorListRef.value) {
          nextTick(() => {
            selectorListRef.value.scrollTop = 0;
          });
          selectorListRef.value.removeEventListener('scroll', scrollHandler);
          selectorListRef.value.addEventListener('scroll', scrollHandler);
        }
      }
    });

    onMounted(() => {
      initData();
    });

    const changePopoverOffset = () => {
      // 修改popover offset
      popoverProps.offset.crossAxis = isSingleSelect.value ? 0 : tagInputItemRef.value?.offsetLeft;
    };
    const scrollHandler = () => {
      if (pageState.isPageLoading || selectorListRef.value.scrollTop === 0) {
        return;
      }
      const {
        scrollTop,
        offsetHeight,
        scrollHeight,
      } = selectorListRef.value;
      if (scrollTop + offsetHeight >= scrollHeight) {
        const curPage = pageState.curPage + 1;
        if (curPage <= pageState.totalPage) {
          pageState.isPageLoading = true;
          setTimeout(() => {
            pageChange(curPage);
          }, 500);
        }
      }
    };

    // 获取选中元素节点
    const getSelectedTagNodes = (): HTMLElement[] => {
      const nodes = Array.from(tagListRef.value?.childNodes || []) as HTMLElement[];
      return nodes.filter((node: HTMLElement) => ![Node.TEXT_NODE, Node.COMMENT_NODE].includes(node.nodeType));
    };

    /**
     * 触发输入框聚焦
     * @param e
     */
    const focusInputTrigger = (e?: MouseEvent) => {
      if (props.disabled) return;

      if (e?.target) {
        const { className } = e.target as HTMLElement;
        if ((className.indexOf('bk-tag-input-trigger') > -1) || (className.indexOf('tag-list') > -1)) {
          // 如果没点在节点上，重置input位置（在最后插入input）
          tagListRef.value.appendChild(tagInputItemRef.value);
        }
      }

      clearTimeout(timer.value);

      // 如果是单选，在获取焦点时自动定位为当前值
      if (isSingleSelect.value && tagList.value.length) {
        listState.tagListCache = [...tagList.value];
        listState.selectedTagListCache = [...listState.selectedTagList];

        curInputValue.value = listState.selectedTagListCache[0][props.saveKey];
        removeTag(listState.selectedTagList[0], 0);

        handleInput();
      }

      state.isEdit = true;

      nextTick(() => {
        tagInputRef.value?.focus();
        if (props.trigger === 'focus' && listState.localList.length !== 0) {
          filterData();
          if (popoverProps.isShow) {
            changePopoverOffset();
          } else {
            popoverProps.isShow = true;
          }
        }
      });
    };

    /**
     * 初始化列表数据
     */
    const initData = () => {
      const {
        saveKey,
        modelValue,
        displayKey,
        allowCreate,
        trigger,
      } = props;
      listState.selectedTagList = [];
      listState.localList = flatList.value;


      if (modelValue.length) {
        const modelValueMap = {};
        listState.selectedTagList = modelValue.map((tag) => {
          const item = saveKeyMap.value[tag];
          modelValueMap[tag] = 1;
          if (!item && allowCreate) {
            return { [saveKey]: tag, [displayKey]: tag };
          }
          return item;
        }).filter(item => item);

        // 如果不是单选时，需要将已选的过滤掉
        if (!isSingleSelect.value) {
          listState.localList = listState.localList.filter(val => !modelValueMap[val[saveKey]]);
        }
      }

      // 如果需要首次展示列表，先初始化
      if (trigger === 'focus') {
        filterData();
      }
    };
    const reload = () => {
      flatListInit();
      initData();
    };

    // 过滤数据
    const filterData = (value = '') => {
      const {
        searchKey,
        filterCallback,
      } = props;
      const lowerCaseValue = value.toLowerCase().trim();
      if (lowerCaseValue === '') {
        initPage(listState.localList);
        return;
      }
      let filterData: any[] = [];
      if (typeof filterCallback === 'function') {
        filterData = filterCallback(lowerCaseValue, searchKey, listState.localList) || [];
      } else {
        // 根据文本框输入的值筛选过来的数据
        if (Array.isArray(searchKey)) {
          // 数组，过滤多个关键字

          filterData = listState.localList
            .filter(item => searchKey.some(keyword => item[keyword].toLowerCase().indexOf(lowerCaseValue) > -1));
        } else {
          filterData = listState.localList.filter(item => item[searchKey].toLowerCase().indexOf(lowerCaseValue) > -1);
        }
      }
      initPage(filterData);
    };

    const activeClass = (data, index: number) => {
      const style = {
        'bk-selector-actived': false,
        'bk-selector-selected': tagList.value.includes(data[props.saveKey]),
      };
      if (props.useGroup) {
        style['bk-selector-actived'] = data.__index__ === state.focusItemIndex;
      } else {
        style['bk-selector-actived'] = index === state.focusItemIndex;
      }

      return style;
    };

    function shallowCompareArray(arr1, arr2) {
      if (arr1.length !== arr2.length) return false;

      return arr2.every((item, index) => arr1[index] === item);
    }

    const clearSingleCache = () => {
      listState.tagListCache = [];
      listState.selectedTagListCache = [];
      listState.selectedTagList = [];
    };

    const clearInput = () => {
      curInputValue.value = '';
    };

    /**
     * 获取输入框元素位置
     */
    const getTagInputItemSite = (): number => {
      // 单选时，当前替换位置为第一个元素
      if (isSingleSelect.value) {
        return 0;
      }
      const childNodes = getSelectedTagNodes();
      const index = childNodes.findIndex(({ id }) => id === 'tagInputItem');
      return index >= 0 ? index : 0;
    };

    /**
     * 交换元素位置
     */
    const swapElementPositions = (newNode: Element, referenceNode: Element, isNextElementSibling = false) => {
      if (!referenceNode || !newNode) return;
      let swap = referenceNode;
      if (isNextElementSibling) {
        swap = referenceNode.nextElementSibling || null;
      }
      referenceNode.parentNode.insertBefore(newNode, swap);
    };

    const handleInput = (e?: Event) => {
      const {
        maxData,
        trigger,
        allowCreate,
      } = props;
      if (maxData === -1 || maxData > tagList.value.length) {
        const { value } = e?.target ? (e.target as HTMLInputElement) : curInputValue;
        const charLen = getCharLength(value);

        if (charLen) {
          filterData(value);
          tagInputRef.value.style.width = `${charLen * INPUT_MIN_WIDTH}px`;
        } else {
          if (trigger === 'focus') {
            filterData();
          }
        }
      } else {
        handleBlur();
        curInputValue.value = '';
        popoverProps.isShow = false;
      }

      state.isEdit = true;
      // 重置下拉菜单选中信息
      state.focusItemIndex = allowCreate ? -1 : 0;
      emit('input', curInputValue.value);
    };

    const handleFocus = () => {
      // this.dispatch('bk-form-item', 'form-focus')
      popoverProps.width = isSingleSelect.value ? bkTagSelectorRef.value?.clientWidth : props.contentWidth;
      emit('focus');
      // e.currentTarget.select();
    };

    const handleBlur = () => {
      timer.value = setTimeout(() => {
        const inputValue = curInputValue.value;
        clearInput();
        // 通知表单组件，可用于实时验证
        // this.dispatch('bk-form-item', 'form-blur')
        state.isEdit = false;

        if (isSingleSelect.value) {
          const [oldValue] = listState.tagListCache;
          // 如果是单选，且input不为空，即保留了上次的结果则恢复
          if (inputValue && inputValue === oldValue && listState.selectedTagListCache.length) {
            addTag(listState.selectedTagListCache[0], 'select');
          } else {
            handleChange('remove');
          }
        } else if (props.allowAutoMatch && inputValue) {
          // 如果匹配，则自动选则
          const matchItem = pageState.curPageList.find((item) => {
            if (Array.isArray(props.searchKey)) {
              const searchValue = props.searchKey.map((key: string) => item[key]);
              return searchValue.includes(inputValue);
            }
            return item[props.searchKey] === inputValue;
          });
          if (matchItem) {
            handleTagSelected(matchItem, 'select');
          } else if (props.allowCreate) {
            // 支持自定义
            handleTagSelected(inputValue, 'custom');
          }
        }
        popoverProps.isShow = false;
        emit('blur', inputValue, tagList.value);
        formItem?.validate?.('blur');
      }, 200);
    };

    /**
     * tag selected handler
     * @param item tag data
     * @param type emit type
     */
    const handleTagSelected = (item, type: string, e?: Event) => {
      e?.stopPropagation();
      // 如果 item 不存在（备选项中没有包含输入的字母的情况即输入关键字没有备选项出现的情况）或者选中标签所在组是禁用状态，返回
      if (!item || item.disabled) {
        return;
      }
      // 如果是单选，清空上一次缓存结果
      if (isSingleSelect.value) {
        clearSingleCache();
      }
      addTag(item, type);
      handleChange('select');
      clearInput();
      popoverProps.isShow = false;
    };

    /**
     * remove selected tag
     * @param data tag data
     * @param index tag index
     * @param e mouse event
     */
    const handleTagRemove = (data, index: number, e?: MouseEvent) => {
      e?.stopPropagation();
      removeTag(data, index);
      clearInput();
      handleChange('remove', data);
      tagInputRef.value.style.width = `${INPUT_MIN_WIDTH}px`;
    };

    /**
     * emit trigger
     * @param type emit type
     */
    const handleChange = (type, data?) => {
      // this.dispatch('bk-form-item', 'form-change')
      emit(type, data);
      emit('update:modelValue', tagList.value);
      emit('change', tagList.value);
    };

    /**
     * clear all selected tags
     * @param e mouse event
     */
    const handleClear = (e: MouseEvent) => {
      e.stopPropagation();
      const removeList = listState.selectedTagList;
      listState.selectedTagList = [];

      // 将删除的项加入加列表
      const existList = removeList.filter(item => saveKeyMap.value[item[props.saveKey]]);
      if (((props.allowCreate && (existList.length !== 0)) || !props.allowCreate) && !isSingleSelect.value) {
        listState.localList.push(...existList);
      }
      handleChange('removeAll');
    };

    const updateScrollTop = () => {
      // 获取下拉列表容器的位置信息，用于判断上下键选中的元素是否在可视区域，若不在则需滚动至可视区域
      const panelInfo = {
        height: selectorListRef.value.clientHeight,
        yAxis: selectorListRef.value.getBoundingClientRect().y,
      };

      nextTick(() => {
        const activeObj = selectorListRef.value.querySelector('.bk-selector-actived');
        if (!activeObj) {
          return;
        }
        const activeInfo = {
          height: activeObj.clientHeight,
          yAxis: activeObj.getBoundingClientRect().y,
        };

        // 选中元素顶部坐标大于容器顶部坐标时，则该元素有部分或者全部区域不在可视区域，执行滚动
        if (activeInfo.yAxis < panelInfo.yAxis) {
          selectorListRef.value.scrollTop = selectorListRef.value.scrollTop - (panelInfo.yAxis - activeInfo.yAxis);
        }

        const distanceToBottom = activeInfo.yAxis + activeInfo.height - panelInfo.yAxis;

        // 选中元素底部坐标大于容器顶部坐标，且超出容器的实际高度，则该元素有部分或者全部区域不在可视区域，执行滚动
        if (distanceToBottom > panelInfo.height) {
          selectorListRef.value.scrollTop = selectorListRef.value.scrollTop + distanceToBottom - panelInfo.height;
        }
      });
    };

    const backspaceHandler = (index: number, target) => {
      // 先交换输入框与被删除节点位置，再进行删除
      const nodes = getSelectedTagNodes();
      swapElementPositions(tagInputItemRef.value, nodes[index - 1]);
      listState.selectedTagList.splice(index - 1, 1);
      focusInputTrigger();

      const isExistInit = saveKeyMap.value[target[props.saveKey]];

      // 将删除的项加入加列表
      if (((props.allowCreate && isExistInit) || !props.allowCreate) && !isSingleSelect.value) {
        listState.localList.push(target);
      }

      tagInputRef.value = `${INPUT_MIN_WIDTH}px`;
      handleChange('remove');
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (pageState.isPageLoading) {
        return;
      }

      let target;
      const val = (e.target as HTMLInputElement).value;
      const valLen = getCharLength(val);
      const tagInputItemIndex = getTagInputItemSite();
      const nodes = getSelectedTagNodes();

      switch (e.code) {
        case 'ArrowUp':
          e.preventDefault();
          if (!popoverProps.isShow) {
            return;
          }
          state.focusItemIndex = state.focusItemIndex - 1;
          state.focusItemIndex = state.focusItemIndex < 0 ? -1 : state.focusItemIndex;
          if (state.focusItemIndex === -1) {
            state.focusItemIndex = pageState.curPageList.length - 1;
          }
          updateScrollTop();
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!popoverProps.isShow) {
            return;
          }
          state.focusItemIndex = state.focusItemIndex + 1;
          state.focusItemIndex = state.focusItemIndex > pageState.curPageList.length - 1
            ? pageState.curPageList.length
            : state.focusItemIndex;
          if (state.focusItemIndex === pageState.curPageList.length) {
            state.focusItemIndex = 0;
          }
          updateScrollTop();
          break;
        case 'ArrowLeft':
          state.isEdit = true;
          if (!valLen) {
            // 输入框已经是第一个节点，无法左移
            if (tagInputItemIndex < 1) {
              return;
            }
            swapElementPositions(tagInputItemRef.value, nodes[tagInputItemIndex - 1]);
            focusInputTrigger();
          }
          break;
        case 'ArrowRight':
          state.isEdit = true;
          if (!valLen) {
            // 输入框已经是最后一个节点，无法右移
            if (tagInputItemIndex === nodes.length - 1) {
              return;
            }
            swapElementPositions(nodes[tagInputItemIndex + 1], tagInputItemRef.value);
            focusInputTrigger();
          }
          break;
        case 'Enter':
        case 'NumpadEnter':
          if ((!props.allowCreate && popoverProps.isShow)
            || (props.allowCreate && state.focusItemIndex >= 0 && popoverProps.isShow)
          ) {
            handleTagSelected(pageState.curPageList[state.focusItemIndex], 'select', e);
          } else if (props.allowCreate && curInputValue.value.trim()) {
            handleTagSelected(curInputValue.value, 'custom', e);
          }
          // 如果是enter, 防止触发form submit
          e.preventDefault();
          break;
        case 'Backspace':
          if (tagInputItemIndex !== 0 && !curInputValue.value) {
            target = listState.selectedTagList[tagInputItemIndex - 1];
            backspaceHandler(tagInputItemIndex, target);
          }
          break;
        default:
          break;
      }
    };

    const defaultPasteFn = (value: string): any[] => {
      const target = [];
      const textArr = value.split(';');
      const regx = /^[a-zA-Z][a-zA-Z_]*/g;

      textArr.forEach((item) => {
        const matchValue = item.match(regx);
        if (matchValue) {
          const finalItem = matchValue.join('');
          target.push({ [props.saveKey]: finalItem, [props.displayKey]: finalItem });
        }
      });
      return target;
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();

      // 单选禁止复制粘贴，防止粘贴多个tag
      if (isSingleSelect.value) {
        return false;
      }

      const {
        maxData,
        saveKey,
        displayKey,
        pasteFn,
        allowCreate,
      } = props;
      const value = e.clipboardData.getData('text');
      const valArr = pasteFn ? pasteFn(value) : defaultPasteFn(value);
      let tags = valArr.map((value: string) => value[saveKey]);
      if (tags.length) {
        const nodes = getSelectedTagNodes();
        const index = getTagInputItemSite();
        const localInitData = listState.localList.map(data => data[saveKey]);

        tags = tags.filter((tag) => {
          const canSelected = tag?.trim() && !tagList.value.includes(tag);

          return allowCreate ? canSelected : canSelected && localInitData.includes(tag);
        });
        // 最大显示限制处理
        if (maxData !== -1) {
          const selectedLength = listState.selectedTagList.length;
          if (selectedLength < maxData) {
            const differ = maxData - selectedLength;
            if (tags.length > differ) {
              tags = [...tags.slice(0, (differ))];
            }
          } else {
            tags = [];
          }
        }
        const localTags = allowCreate
          ? tags.map((tag) => {
            const localTag = listState.localList.find(localTag => localTag[saveKey] === tag);
            return localTag ?? { [saveKey]: tag, [displayKey]: tag };
          })
          : listState.localList.filter(tag => tags.includes(tag[saveKey]));

        if (tags.length) {
          listState.selectedTagList.splice(index, 0, ...localTags);

          swapElementPositions(tagInputItemRef.value, nodes[index]);
          tagInputRef.value.style.width = `${INPUT_MIN_WIDTH}px`;
          listState.localList = listState.localList.filter(val => !tags.includes(val[saveKey]));
          handleChange('select');
          focusInputTrigger();
        }
      }
    };

    /**
     * 已选中标签点击
     * @param e mouse event
     */
    const tagFocus = (e: MouseEvent) => {
      if (props.disabled) {
        return;
      }
      swapElementPositions(tagInputItemRef.value, (e.currentTarget as HTMLElement), true);
      tagInputRef.value.style.width = `${INPUT_MIN_WIDTH}px`;
      popoverProps.isShow && changePopoverOffset();
    };

    /**
     * add tag
     * @param item current tag data
     * @param type operation type
     */
    const addTag = (item, type: string) => {
      // 不允许超过最大可选数量
      if (listState.selectedTagList.length >= props.maxData && props.maxData !== -1) return;

      const {
        separator,
        saveKey,
        displayKey,
        createTagValidator,
      } = props;
      const targetIndex = getTagInputItemSite();
      let moveCount = 1;
      let isSelected = false;
      let newValue;
      const validateTag = (value: string): boolean => {
        if (typeof createTagValidator === 'function') {
          return createTagValidator(value);
        }
        return true;
      };

      // 自定义
      if (type === 'custom') {
        // 自定义时，如果配置分隔符可以一次性输入多个值
        if (separator) {
          let tags = item.split(separator);
          tags = tags.filter(tag => tag?.trim() && !tagList.value.includes(tag) && validateTag(tag));
          const localTags = tags.map(tag => saveKeyMap.value[tag] || {
            [saveKey]: tag,
            [displayKey]: tag,
          });
          if (tags.length) {
            listState.selectedTagList.splice(targetIndex, 0, ...localTags);
            moveCount = localTags.length;
            isSelected = true;
          }
        } else {
          const isObject = typeof item === 'object';
          newValue = isObject ? item[saveKey] : item.trim();
          newValue = newValue.replace(/\s+/g, '');
          if (newValue !== undefined && !tagList.value.includes(newValue) && validateTag(newValue)) {
            const localItem = saveKeyMap.value[newValue]
              || (isObject ? item : { [saveKey]: newValue, [displayKey]: newValue });
            listState.selectedTagList.splice(targetIndex, 0, localItem);
            isSelected = true;
          }
        }
      } else if (item) {
        newValue = item[saveKey];
        if (newValue !== undefined && !tagList.value.includes(newValue)) {
          listState.selectedTagList.splice(targetIndex, 0, item);
          isSelected = true;
        }
      }

      if (isSelected) {
        nextTick(() => {
          for (let count = 1; count <= moveCount; count++) {
            const nodes = getSelectedTagNodes();
            const site = nodes[targetIndex + count];
            swapElementPositions(site, tagInputItemRef.value);
          }
          tagInputRef.value.style.width = `${INPUT_MIN_WIDTH}px`;

          // 非单选
          if (!isSingleSelect.value) {
            // focus继续让用户进行下一个输入
            props.allowNextFocus && focusInputTrigger();
            // 将已经选中的项从数据列表中去除
            const selectedMap = tagList.value.reduce((acc, tag) => {
              acc[tag] = 1;
              return acc;
            }, {});
            listState.localList = listState.localList.filter(val => !selectedMap[val[saveKey]]);
          }
        });
      }
    };

    /**
     * remove current tag
     * @param data tag data
     * @param index tag index
     */
    const removeTag = (data, index) => {
      listState.selectedTagList.splice(index, 1);

      const isExistInit = saveKeyMap.value[data[props.saveKey]];

      // 将删除的项加入加列表
      if (((props.allowCreate && isExistInit) || !props.allowCreate) && !isSingleSelect.value) {
        listState.localList.push(data);
      }
    };
    // 折叠 tags index
    const localCollapseTags = computed(() => (
      props.collapseTags
        ? props.collapseTags && !state.isEdit
        : props.collapseTags
    ));
    const { overflowTagIndex } = useTagsOverflow(bkTagSelectorRef, localCollapseTags, tagList);

    return {
      popoverProps,
      ...toRefs(state),
      ...toRefs(listState),
      ...toRefs(pageState),
      isShowPlaceholder,
      isShowClear,
      placeholderText,
      curInputValue,
      renderList,
      showTagClose,
      tagInputRef,
      bkTagSelectorRef,
      tagListRef,
      tagInputItemRef,
      selectorListRef,
      triggerClass,
      overflowTagIndex,
      localCollapseTags,
      reload,
      focusInputTrigger,
      activeClass,
      handleInput,
      handleFocus,
      handleBlur,
      handleTagSelected,
      handleTagRemove,
      handleClear,
      tagFocus,
      handleKeydown,
      handlePaste,
    };
  },
  render() {
    return (
      <div
        class="bk-tag-input"
        ref="bkTagSelectorRef"
        onClick={this.focusInputTrigger}
        onMouseenter={() => this.isHover = true}
        onMouseleave={() => this.isHover = false}>
        <BKPopover
          theme="light bk-tag-input-popover-content"
          trigger="manual"
          placement="bottom-start"
          arrow={false}
          {...this.popoverProps}
        >
          {{
            default: () => (
              <div class={this.triggerClass}>
                <ul class="tag-list" ref="tagListRef" style={{ marginLeft: `${this.leftSpace}px` }}>
                  {
                    this.selectedTagList.map((item: any, index: number) => {
                      const tooltips = {
                        boundary: 'window',
                        theme: 'light',
                        distance: 12,
                        content: item[this.tooltipKey],
                        disabled: !this.tooltipKey,
                      };
                      const isOverflow = this.localCollapseTags
                        && this.overflowTagIndex
                        && index >= this.overflowTagIndex;
                      return (
                        <li
                          class="tag-item"
                          style={{ display: isOverflow ? 'none' : '' }}
                          v-bk-tooltips={tooltips}
                          onClick={this.tagFocus}>
                          <TagRender
                            node={item}
                            tpl={this.tagTpl}
                            displayKey={this.displayKey}
                            hasTips={!!this.tooltipKey}
                            tagOverflowTips={this.tagOverflowTips}
                          />
                          {this.showTagClose ? <Error class="remove-tag" onClick={this.handleTagRemove.bind(this, item, index)} /> : null}
                        </li>
                      );
                    })
                  }
                  <li ref="tagInputItemRef" id="tagInputItem" class="tag-input-item" role="input" v-show={this.isEdit}>
                    <input
                      type="text"
                      class="tag-input"
                      ref="tagInputRef"
                      v-model={this.curInputValue}
                      onInput={this.handleInput}
                      onFocus={this.handleFocus}
                      onBlur={this.handleBlur}
                      onKeydown={this.handleKeydown}
                      onPaste={this.handlePaste}
                      />
                  </li>
                  {
                    !!this.overflowTagIndex && this.localCollapseTags && (
                      <li class="tag-item">
                        <div class="tag">
                          <span class="text">+{this.selectedTagList.length - this.overflowTagIndex}</span>
                        </div>
                      </li>
                    )
                  }
                </ul>
                <p class="placeholder" v-show={this.isShowPlaceholder}>{this.placeholderText}</p>
                {this.$slots?.suffix?.() ?? (this.isShowClear && <Close class="clear-icon" onClick={this.handleClear} />) }
              </div>
            ),
            content: () => (
              <div class="bk-selector-list">
                <ul ref="selectorListRef" style={{ 'max-height': `${this.contentMaxHeight}px` }} class="outside-ul">
                  {
                    this.renderList.map((group, index) => (this.useGroup ? (
                          <li class="bk-selector-group-item">
                            <span class="group-name">{group.name} ({group.children.length})</span>
                            <ul class="bk-selector-group-list-item">
                              {
                                group.children.map((item, index: number) => (
                                  <li class={['bk-selector-list-item', { disabled: item.disabled }, this.activeClass(item, index)]}
                                    onClick={this.handleTagSelected.bind(this, item, 'select')}>
                                    <ListTagRender node={item}
                                      displayKey={this.displayKey}
                                      tpl={this.tpl}
                                      searchKey={this.searchKey}
                                      searchKeyword={this.curInputValue} />
                                  </li>
                                ))
                              }
                            </ul>
                          </li>
                    ) : (
                          <li class={['bk-selector-list-item', { disabled: group.disabled }, this.activeClass(group, index)]}
                            onClick={this.handleTagSelected.bind(this, group, 'select')}>
                            <ListTagRender node={group}
                              displayKey={this.displayKey}
                              tpl={this.tpl}
                              searchKey={this.searchKey}
                              searchKeyword={this.curInputValue} />
                          </li>
                    )))
                  }
                  {
                    this.isPageLoading
                      ? <li class="bk-selector-list-item loading"><BkLoading theme="primary" size={BkLoadingSize.Small} /></li>
                      : null
                  }
                </ul>
              </div>
            ),
          }}
        </BKPopover>
      </div>
    );
  },
});
