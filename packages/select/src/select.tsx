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

import { computed, defineComponent, onMounted, PropType, provide, reactive, ref, toRefs, watch } from 'vue';

import Checkbox from '@bkui-vue/checkbox';
import { useLocale, usePrefix } from '@bkui-vue/config-provider';
import { clickoutside } from '@bkui-vue/directives';
import { AngleDown, Close, Search, TextAll } from '@bkui-vue/icon';
import Input from '@bkui-vue/input';
import Loading from '@bkui-vue/loading';
import Popover, { PopoverPropTypes } from '@bkui-vue/popover';
import {
  classes,
  InputBehaviorType,
  PropTypes,
  RenderType,
  SelectedType,
  SizeEnum,
  TagThemeType,
  useFormItem,
} from '@bkui-vue/shared';
import VirtualRender from '@bkui-vue/virtual-render';
import isEqual from 'lodash/isEqual';
import merge from 'lodash/merge';

import { isInViewPort, selectKey, toLowerCase, useHover, usePopover, useRegistry, useRemoteSearch } from './common';
import Option from './option';
import pinyin from './pinyin/index';
import SelectTagInput from './selectTagInput';
import { GroupInstanceType, ISelected, OptionInstanceType, SelectTagInputType } from './type';

export default defineComponent({
  name: 'Select',
  directives: {
    clickoutside,
  },
  props: {
    modelValue: PropTypes.any,
    multiple: PropTypes.bool.def(false),
    disabled: PropTypes.bool.def(false),
    size: PropTypes.size().def(SizeEnum.DEFAULT),
    clearable: PropTypes.bool.def(true),
    loading: PropTypes.bool.def(false),
    filterable: PropTypes.bool.def(true), // 是否支持搜索
    remoteMethod: PropTypes.func,
    scrollHeight: PropTypes.number.def(204), // 最大高度
    minHeight: PropTypes.number, // 最小高度
    showAll: PropTypes.bool.def(false), // 全部
    allOptionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // 全部选项ID
    showSelectAll: PropTypes.bool.def(false), // 全选
    popoverMinWidth: PropTypes.number.def(0), // popover最小宽度
    showOnInit: PropTypes.bool.def(false), // 是否默认显示popover
    multipleMode: PropTypes.oneOf(['default', 'tag']).def('default'), // 多选展示方式
    tagTheme: TagThemeType(),
    behavior: InputBehaviorType(), // 输入框模式
    collapseTags: PropTypes.bool.def(false), // 当以标签形式显示选择结果时，是否合并溢出的结果以数字显示
    autoHeight: PropTypes.bool.def(true), // collapseTags模式下，聚焦时自动展开所有Tag
    noDataText: PropTypes.string,
    noMatchText: PropTypes.string,
    loadingText: PropTypes.string,
    placeholder: PropTypes.string,
    searchPlaceholder: PropTypes.string,
    selectAllText: PropTypes.string,
    scrollLoading: PropTypes.bool.def(false),
    allowCreate: PropTypes.bool.def(false), // 是否运行创建自定义选项
    popoverOptions: Object as PropType<Partial<PopoverPropTypes>>, // popover属性
    customContent: PropTypes.bool.def(false), // 是否自定义content内容
    list: PropTypes.arrayOf(PropTypes.any).def([]),
    idKey: PropTypes.string.def('value'),
    displayKey: PropTypes.string.def('label'),
    withValidate: PropTypes.bool.def(true),
    showSelectedIcon: PropTypes.bool.def(true), // 多选时是否显示勾选ICON
    inputSearch: PropTypes.bool.def(false), // 是否采用输入框支持搜索的方式
    enableVirtualRender: PropTypes.bool.def(false), // 是否开启虚拟滚动（List模式下才会生效）
    allowEmptyValues: PropTypes.array.def([]), // 允许的空值作为options选项
    autoFocus: PropTypes.bool.def(false), // 挂载的时候是否自动聚焦输入框
    disableFocusBehavior: PropTypes.bool.def(false), // 禁用自动聚焦行为
    keepSearchValue: PropTypes.bool.def(false), // 隐藏popover时是否保留搜索内容,
    prefix: PropTypes.string,
    selectedStyle: SelectedType(),
    filterOption: { type: Function }, // 配置当前options的过滤规则
    searchWithPinyin: PropTypes.bool.def(true), // 拼音搜索
    highlightKeyword: PropTypes.bool.def(false), // 搜索高亮
    trigger: {
      type: String as PropType<'default' | 'manual'>,
      default: 'default',
    }, // content显示和隐藏方式
  },
  emits: [
    'update:modelValue',
    'change',
    'toggle',
    'clear',
    'scroll-end',
    'focus',
    'blur',
    'tag-remove',
    'select',
    'deselect',
    'search-change',
  ],
  setup(props, { emit }) {
    const t = useLocale('select');
    const { resolveClassName } = usePrefix();
    const {
      modelValue,
      disabled,
      filterable,
      multiple,
      remoteMethod,
      loading,
      popoverMinWidth,
      showOnInit,
      multipleMode,
      allowCreate,
      customContent,
      showSelectedIcon,
      inputSearch,
      enableVirtualRender,
      showSelectAll,
      showAll,
      allOptionId,
      scrollHeight,
      list,
      displayKey,
      idKey,
      collapseTags,
      autoHeight,
      popoverOptions,
      allowEmptyValues,
      autoFocus,
      keepSearchValue,
      selectedStyle,
      filterOption,
      searchWithPinyin,
      highlightKeyword,
      disableFocusBehavior,
      trigger,
    } = toRefs(props);

    const virtualRenderRef = ref(null);
    const localNoDataText = computed(() => {
      if (props.noDataText === undefined) {
        return t.value.noData;
      }
      return props.noDataText;
    });
    const localNoMatchText = computed(() => {
      if (props.noMatchText === undefined) {
        return t.value.noMatchedData;
      }
      return props.noMatchText;
    });
    const localLoadingText = computed(() => {
      if (props.loadingText === undefined) {
        return t.value.loading;
      }
      return props.loadingText;
    });
    const localPlaceholder = computed(() => {
      if (props.placeholder === undefined) {
        return t.value.pleaseSelect;
      }
      return props.placeholder;
    });
    const localSearchPlaceholder = computed(() => {
      if (props.searchPlaceholder === undefined) {
        return t.value.enterKeywords;
      }
      return props.searchPlaceholder;
    });
    const localSelectAllText = computed(() => {
      if (props.selectAllText === undefined) {
        return t.value.all;
      }
      return props.selectAllText;
    });

    const formItem = useFormItem();

    const inputRef = ref<HTMLElement>();
    const triggerRef = ref<HTMLElement>();
    const contentRef = ref<HTMLElement>();
    const searchRef = ref<HTMLElement>();
    const selectTagInputRef = ref<SelectTagInputType>();
    const popoverRef = ref();
    const optionsMap = ref<Map<PropertyKey, OptionInstanceType>>(new Map());
    const options = computed(() =>
      [...optionsMap.value.values()].sort((cur, next) => {
        return cur.order - next.order;
      }),
    );
    const groupsMap = ref<Map<string, GroupInstanceType>>(new Map());
    const selected = ref<ISelected[]>([]);
    const selectedMap = computed<Record<PropertyKey, string>>(() =>
      selected.value.reduce((pre, item) => {
        pre[item.value] = item.label;
        return pre;
      }, {}),
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const activeOptionValue = ref<any>(); // 当前悬浮的option
    const listMap = computed(() =>
      list.value.reduce((pre, item) => {
        pre[item[idKey.value]] = item[displayKey.value];
        return pre;
      }, {}),
    );

    watch([optionsMap, list], () => {
      handleSetSelectedData();
    });

    watch(
      modelValue,
      () => {
        handleSetSelectedData();
        if (props.withValidate) {
          formItem?.validate?.('change');
        }
      },
      { deep: true },
    );

    watch(selected, () => {
      popoverRef.value?.updatePopover(null, popoverConfig.value);
    });

    // list模式下搜索后的值
    const filterList = computed(() =>
      isRemoteSearch.value
        ? list.value
        : list.value.filter(item => {
            return defaultSearchMethod(curSearchValue.value, String(item[displayKey.value]), item);
          }),
    );
    // select组件是否禁用
    const isDisabled = computed(() => disabled.value || loading.value);
    // modelValue对应的label
    const selectedLabel = computed(() =>
      selected.value.map(
        item => optionsMap.value?.get(item.value)?.optionName || listMap.value[item.value] || item.label,
      ),
    );
    // 是否全选(todo: 优化)
    const isAllSelected = computed(() => {
      const normalSelectedValues = options.value.reduce<string[]>((pre, option) => {
        if (!option.disabled) {
          pre.push(option.optionID);
        }
        return pre;
      }, []);
      return (
        normalSelectedValues.length <= selected.value.length &&
        normalSelectedValues.every(val => selected.value.some(item => item.value === val))
      );
    });
    // 全部选项
    const isAll = computed(() => selected.value.length === 1 && selected.value[0]?.value === allOptionId.value);
    // 是否含有分组
    const isGroup = computed(() => !!groupsMap.value.size);
    // options是否为空
    const isOptionsEmpty = computed(() => !options.value.length);
    // 是否搜索为空
    const isSearchEmpty = computed(() => options.value.length && options.value.every(option => !option.visible));
    // 是否远程搜索
    const isRemoteSearch = computed(() => filterable.value && typeof remoteMethod.value === 'function');
    // options过滤函数
    const hasFilterOptionFunc = computed(() => {
      if (filterOption.value && typeof filterOption.value === 'function') return true;

      return false;
    });
    // 是否显示select下拉内容
    const isShowSelectContent = computed(
      () => !(searchLoading.value || isOptionsEmpty.value || isSearchEmpty.value) || customContent.value,
    );
    // 是否显示全选
    const isShowSelectAll = computed(
      () => multiple.value && showSelectAll.value && (!curSearchValue.value || !filterable.value),
    );
    const isShowAll = computed(() => multiple.value && showAll.value);
    // 虚拟滚动高度 12 上下边距，32 显示全选时的高度
    const virtualHeight = computed(() => scrollHeight.value - 12 - (isShowSelectAll.value ? 32 : 0));
    const virtualLineHeight = ref(32);
    // 是否启用虚拟滚动(如果配置了启用，但是数据小于滚动高度则不开启)
    const isEnableVirtualRender = computed(() => {
      if (enableVirtualRender.value) return filterList.value.length * virtualLineHeight.value > virtualHeight.value;
      return false;
    });
    // 预加载滚动数据
    const preloadItemCount = computed(() => Math.ceil(virtualHeight.value / virtualLineHeight.value));
    // 当前空状态时显示文案
    const curContentText = computed(() => {
      if (searchLoading.value) {
        return localLoadingText.value;
      }
      if (isSearchEmpty.value || (list.value.length && !filterList.value.length)) {
        return localNoMatchText.value;
      }
      if (isOptionsEmpty.value) {
        return localNoDataText.value;
      }
      return '';
    });
    // 是否合并tag以数字形式展示
    const isCollapseTags = computed(() =>
      autoHeight.value ? collapseTags.value && !isPopoverShow.value : collapseTags.value,
    );

    const popoverConfig = computed(() =>
      merge<Partial<PopoverPropTypes>, Partial<PopoverPropTypes>>(
        {
          theme: `light ${resolveClassName('select-popover')}`,
          trigger: 'manual',
          width: popperWidth.value,
          arrow: false,
          placement: 'bottom-start',
          isShow: isPopoverShow.value,
          reference: selectTagInputRef.value,
          offset: 4,
          popoverDelay: 0,
          renderType: RenderType.AUTO,
        },
        popoverOptions.value,
      ),
    );

    const { register, unregister } = useRegistry<OptionInstanceType>(optionsMap);
    const { register: registerGroup, unregister: unregisterGroup } = useRegistry<GroupInstanceType>(groupsMap);
    const { isHover, setHover, cancelHover } = useHover();
    const isFocus = ref(false);
    const handleFocus = () => {
      if (isFocus.value) return;
      isFocus.value = true;
      emit('focus');
    };
    const handleBlur = () => {
      if (!isFocus.value) return;
      isFocus.value = false;
      blurInput();
      emit('blur');
    };

    const { popperWidth, isPopoverShow, hidePopover, showPopover, togglePopover } = usePopover(
      { popoverMinWidth: popoverMinWidth.value },
      triggerRef,
    );
    const handleHidePopover = () => {
      if (trigger.value === 'manual') return;
      hidePopover();
    };
    const handleShowPopover = () => {
      if (trigger.value === 'manual') return;
      showPopover();
    };
    // 输入框是否可以输入内容
    // const isInput = computed(
    //   () => ((filterable.value && inputSearch.value) || allowCreate.value) && isPopoverShow.value,
    // );
    // 自定义创建失焦后仍保留输入框内的内容
    const isInput = computed(() => (filterable.value && inputSearch.value && isPopoverShow.value) || allowCreate.value);
    watch(isPopoverShow, isShow => {
      emit('toggle', isPopoverShow.value);
      if (!isShow) {
        if (!keepSearchValue.value) {
          searchValue.value = '';
        }
        document.removeEventListener('keydown', handleDocumentKeydown);
      } else {
        document.addEventListener('keydown', handleDocumentKeydown);
        setTimeout(() => {
          focusInput();
          initActiveOptionValue();
          scrollActiveOptionIntoView();
        }, 10); // 等待Popover content出来，options加载完成
      }
    });
    // 滚动到当前选中的options中
    const scrollActiveOptionIntoView = () => {
      if (isEnableVirtualRender.value) return;
      const optionsDom = contentRef.value?.querySelectorAll?.('.is-selected');
      optionsDom?.[0]?.scrollIntoView({
        block: 'center',
        // behavior: 'smooth',
      });
    };

    // 初始化当前悬浮的option项
    const initActiveOptionValue = () => {
      const firstSelected = selected.value[0];
      const option = optionsMap.value.get(firstSelected?.value);
      if (option && !option.disabled && option.visible) {
        activeOptionValue.value = firstSelected?.value;
      } else {
        activeOptionValue.value = options.value.find(option => !option.disabled && option.visible)?.optionID;
      }
    };
    // 默认搜索方法
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const defaultSearchMethod = (searchValue: string, optionName: string, filterData: Record<string, any> = {}) => {
      if (hasFilterOptionFunc.value) {
        // 是否配置了单个options过滤
        return !!filterOption.value(searchValue, { ...filterData });
      }
      if (searchWithPinyin.value) {
        // 是否配置了拼音过滤
        const pinyinList = pinyin.parse(optionName).map(v => {
          if (v.type === 2) {
            return v.target.toLowerCase();
          }
          return v.target;
        });
        const pinyinStr = pinyinList.reduce((res, cur) => res + cur[0], '');
        return (
          pinyinList.join('').indexOf(searchValue) !== -1 ||
          pinyinStr.indexOf(searchValue) !== -1 ||
          toLowerCase(String(optionName))?.includes(toLowerCase(searchValue))
        );
      }
      return toLowerCase(String(optionName))?.includes(toLowerCase(searchValue));
    };
    // 处理options模式时默认搜索方法
    const handleDefaultOptionSearch = (searchValue: string) => {
      if (!filterable.value) return;

      if (!searchValue) {
        options.value.forEach(option => {
          option.visible = true;
        });
      } else {
        options.value.forEach(option => {
          option.visible = defaultSearchMethod(searchValue, String(option.optionName), {
            ...option.$props,
            ...option.$attrs,
          });
        });
      }
    };
    const { searchValue, customOptionName, curSearchValue, searchLoading } = useRemoteSearch(
      isRemoteSearch.value ? remoteMethod.value : handleDefaultOptionSearch,
      initActiveOptionValue,
    );

    // 派发search change事件
    watch(searchValue, () => {
      emit('search-change', searchValue.value);
    });

    // 派发change事件
    const emitChange = (val: string | string[]) => {
      if (val === modelValue.value) return;

      emit('update:modelValue', val, modelValue.value);
      emit('change', val, modelValue.value);
    };
    // 派发toggle事件
    const handleTogglePopover = () => {
      if (isDisabled.value || trigger.value === 'manual') return;
      handleFocus();
      togglePopover();
    };
    // 自定义创建
    const handleInputChange = value => {
      if (!filterable.value) return;
      customOptionName.value = value;
    };
    // allow create(创建自定义选项)
    const handleCreateCustomOption = (val: number | string, e: KeyboardEvent) => {
      const value = String(val);
      if (!allowCreate.value || !value) return;

      // 阻止触发鼠标事件
      e.stopPropagation();
      e.preventDefault();

      const matchedOption = options.value.find(data => toLowerCase(String(data.optionName)) === toLowerCase(value));
      if (filterable.value && matchedOption) {
        // 开启搜索后，正好匹配到自定义选项，则不进行创建操作
        handleOptionSelected(matchedOption);
        customOptionName.value = '';
        return;
      }

      const data = optionsMap.value.get(value);
      if (data) return; // 已经存在相同值的option时不能创建

      if (multiple.value) {
        selected.value.push({
          value,
          label: value,
        });
        emitChange(selected.value.map(item => item.value));
      } else {
        selected.value = [{ value, label: value }];
        emitChange(value);
        handleHidePopover();
      }
      customOptionName.value = '';
    };
    // Option点击事件
    const handleOptionSelected = (option: OptionInstanceType) => {
      if (isDisabled.value || !option) return;

      // 删除全部选项
      const exitAllIndex = selected.value.findIndex(item => item.value === allOptionId.value);
      if (exitAllIndex > -1) {
        selected.value.splice(exitAllIndex, 1);
      }

      if (multiple.value) {
        // 多选
        const index = selected.value.findIndex(item => item.value === option.optionID);
        if (index > -1) {
          selected.value.splice(index, 1);
          emitChange(selected.value.map(item => item.value));
          emit('deselect', option.optionID);
        } else {
          selected.value.push({
            value: option.optionID,
            label: option.optionName || option.optionID,
          });
          emitChange(selected.value.map(item => item.value));
          emit('select', option.optionID);
          clearMultipleInputValue();
        }
        focusInput();
      } else {
        // 单选
        selected.value = [
          {
            label: option.optionName || option.optionID,
            value: option.optionID,
          },
        ];
        if (filterable.value && allowCreate.value) {
          customOptionName.value = '';
        }
        emitChange(option.optionID);
        emit('select', option.optionID);
        handleHidePopover();
        handleBlur();
      }
    };
    // 是否需要清空多选输入框内容
    const clearMultipleInputValue = () => {
      if (['tag'].includes(multipleMode.value) && isInput.value) {
        selectTagInputRef.value?.updateModelValue('');
      }
    };
    // 聚焦输入框
    const focusInput = () => {
      if (disableFocusBehavior.value) return;
      setTimeout(() => {
        if (!inputSearch.value && !allowCreate.value) {
          searchRef.value?.focus();
        } else {
          if (multipleMode.value === 'tag') {
            selectTagInputRef.value?.focus();
          } else {
            inputRef.value?.focus();
          }
        }
      }, 0);
    };
    // 失焦输入框
    const blurInput = () => {
      setTimeout(() => {
        if (multipleMode.value === 'tag') {
          selectTagInputRef.value?.blur();
        } else {
          inputRef.value?.blur();
        }
      }, 0);
    };
    // 清空事件
    const handleClear = (e: Event) => {
      e.stopPropagation();
      selected.value = [];
      clearMultipleInputValue();
      emitChange(multiple.value ? [] : '');
      emit('clear', multiple.value ? [] : '');
      handleHidePopover();
    };
    const handleSelectedAllOptionMouseEnter = () => {
      activeOptionValue.value = '';
    };
    // 全选/取消全选
    const toggleSelectAll = () => {
      if (isAllSelected.value) {
        selected.value = [];
      } else {
        const tmpSelectedMap = new Map();
        options.value.forEach(option => {
          if (option.disabled || tmpSelectedMap.has(option.optionID)) return;

          tmpSelectedMap.set(option.optionID, option.optionName || option.optionID);
        });
        list.value?.forEach(item => {
          if (item.disabled || tmpSelectedMap.has(item[idKey.value])) return;

          tmpSelectedMap.set(item[idKey.value], item[displayKey.value]);
        });
        selected.value = Array.from(tmpSelectedMap.keys()).map(key => ({
          value: key,
          label: tmpSelectedMap.get(key),
        }));
      }
      emitChange(selected.value.map(item => item.value));
      focusInput();
    };
    // 全部/取消全部
    const toggleAll = () => {
      if (!isShowAll.value) return;

      const index = selected.value.findIndex(item => item.value === allOptionId.value);
      if (index > -1) {
        selected.value = [];
      } else {
        selected.value = [
          {
            value: allOptionId.value as string,
            label: t.value.all,
          },
        ];
      }
      emitChange(selected.value.map(item => item.value));
      focusInput();
    };
    // 滚动事件
    const handleScroll = e => {
      const { scrollTop, clientHeight, scrollHeight } = e.target;
      if (scrollTop + clientHeight === scrollHeight) {
        emit('scroll-end');
      }
    };
    // tag删除事件
    const handleDeleteTag = (val: string) => {
      if (isDisabled.value) return;
      const index = selected.value.findIndex(item => item.value === val);
      if (index > -1) {
        selected.value.splice(index, 1);
        emitChange(selected.value.map(item => item.value));
        emit('tag-remove', val);
      }
    };
    // options存在 > 上一次选择的label > 当前值
    const handleGetLabelByValue = (value: PropertyKey) => {
      // 处理options value为对象类型，引用类型变更后，回显不对问题
      let tmpValue = value;
      if (typeof tmpValue === 'object') {
        for (const key of optionsMap.value.keys()) {
          if (isEqual(key, tmpValue)) {
            tmpValue = key;
            break;
          }
        }
      }
      return (
        optionsMap.value?.get(tmpValue)?.optionName ||
        listMap.value[tmpValue] ||
        selectedMap.value[tmpValue] ||
        tmpValue
      );
    };
    // 设置selected选项
    const handleSetSelectedData = () => {
      // 同步内部value值
      if (Array.isArray(modelValue.value)) {
        selected.value = [
          ...(modelValue.value as string[]).map(value => ({
            value,
            label: handleGetLabelByValue(value),
          })),
        ];
      } else {
        if (modelValue.value || allowEmptyValues.value.includes(modelValue.value)) {
          selected.value = [
            {
              value: modelValue.value,
              label: handleGetLabelByValue(modelValue.value),
            },
          ];
        } else {
          selected.value = [];
        }
      }
    };
    // 手动设置selected值
    const setSelected = (data: Array<object>) => {
      selected.value = data.map(item => ({
        label: item[displayKey.value],
        value: item[idKey.value],
      }));
    };
    // 处理键盘事件
    const handleDocumentKeydown = (e: KeyboardEvent) => {
      if (!isPopoverShow.value || isEnableVirtualRender.value) return;

      const availableOptions = options.value.filter(option => !option.disabled && option.visible);
      const index = availableOptions.findIndex(option => option.optionID === activeOptionValue.value);

      // todo v-for循环时组件创建属性不固定
      switch (e.code) {
        // 下一个option
        case 'ArrowUp':
        case 'ArrowDown': {
          e.preventDefault(); // 阻止滚动屏幕
          let activeIndex = 0;
          if (e.code === 'ArrowDown') {
            activeIndex = index >= availableOptions.length - 1 ? 0 : index + 1;
          } else {
            activeIndex = index === 0 ? availableOptions.length - 1 : index - 1;
          }
          if (!isInViewPort(availableOptions[activeIndex]?.$el, contentRef.value)) {
            availableOptions[activeIndex]?.$el?.scrollIntoView();
          }
          activeOptionValue.value = availableOptions[activeIndex]?.optionID;
          break;
        }
        // 删除选项
        case 'Backspace': {
          if (
            !multiple.value ||
            !selected.value.length ||
            customOptionName.value.length ||
            e.target === searchRef.value
          )
            return; // 单选和下拉搜索不支持回退键删除

          selected.value.pop();
          emitChange(selected.value.map(item => item.value));
          break;
        }
        // 选择选项
        case 'Enter': {
          const { value } = e.target as HTMLInputElement;
          // 搜索和创建的时候不触发enter事件
          if ((allowCreate.value && value) || e.target === searchRef.value) return;
          const option = optionsMap.value.get(activeOptionValue.value);
          handleOptionSelected(option);
          break;
        }
      }
    };
    const handleClickOutside = ({ event }) => {
      const { target } = event;
      if (triggerRef.value?.contains(target) || triggerRef.value === target) return;
      handleHidePopover();
      handleBlur();
    };

    provide(
      selectKey,
      reactive({
        multiple,
        selected,
        activeOptionValue,
        showSelectedIcon,
        selectedStyle,
        curSearchValue,
        highlightKeyword,
        register,
        unregister,
        registerGroup,
        unregisterGroup,
        handleOptionSelected,
        handleGetLabelByValue,
      }),
    );

    onMounted(() => {
      handleSetSelectedData();
      setTimeout(() => {
        showOnInit.value && handleShowPopover();
        autoFocus.value && focusInput();
      });
    });

    const handlePopoverShown = () => {
      virtualRenderRef.value?.scrollTo(0, 1);
    };

    return {
      t,
      selected,
      isInput,
      options,
      isDisabled,
      selectedLabel,
      isPopoverShow,
      isHover,
      popperWidth,
      inputRef,
      triggerRef,
      contentRef,
      searchRef,
      selectTagInputRef,
      popoverRef,
      searchLoading,
      isOptionsEmpty,
      isSearchEmpty,
      isFocus,
      isShowSelectContent,
      curContentText,
      isGroup,
      searchValue,
      curSearchValue,
      customOptionName,
      isShowAll,
      isShowSelectAll,
      virtualHeight,
      filterList,
      isCollapseTags,
      popoverConfig,
      isAllSelected,
      isAll,
      focusInput,
      setHover,
      cancelHover,
      handleFocus,
      handleBlur,
      handleTogglePopover,
      handleClear,
      hidePopover,
      showPopover,
      toggleSelectAll,
      toggleAll,
      handleOptionSelected,
      handleClickOutside,
      handleScroll,
      handleDeleteTag,
      handleInputChange,
      handleSelectedAllOptionMouseEnter,
      localLoadingText,
      localPlaceholder,
      localSearchPlaceholder,
      localSelectAllText,
      resolveClassName,
      handleCreateCustomOption,
      handlePopoverShown,
      virtualLineHeight,
      isEnableVirtualRender,
      preloadItemCount,
      virtualRenderRef,
      setSelected,
    };
  },
  render() {
    const selectClass = classes({
      [`${this.resolveClassName('select')}`]: true,
      'popover-show': this.isPopoverShow,
      'is-disabled': this.isDisabled,
      'is-focus': this.isFocus,
      'is-filterable': this.filterable,
      [this.size]: true,
      [this.behavior]: true,
    });
    // 右侧ICON
    const suffixIcon = () => {
      if (this.loading) {
        return (
          <Loading
            class='spinner'
            loading={true}
            mode='spin'
            size='mini'
            theme='primary'
          />
        );
      }
      if (this.clearable && this.isHover && this.selected.length && !this.isDisabled) {
        return (
          <Close
            class='clear-icon'
            onClick={this.handleClear}
          />
        );
      }
      return this.$slots?.suffix ? (
        <span class='angle-down'>{this.$slots?.suffix?.()}</span>
      ) : (
        <AngleDown class='angle-down' />
      );
    };

    const renderPrefix = () => {
      if (this.prefix) {
        return () => (
          <div class={`${this.resolveClassName('select--prefix-area')}`}>
            <span>{this.prefix}</span>
          </div>
        );
      }
      return this.$slots?.prefix ? () => this.$slots?.prefix?.() : undefined;
    };

    // 全选
    const renderSelectAll = () => {
      if (!this.isShowSelectAll) return;
      return (
        <li
          class={this.resolveClassName('select-option')}
          onClick={this.toggleSelectAll}
          onMouseenter={this.handleSelectedAllOptionMouseEnter}
        >
          {this.selectedStyle === 'checkbox' && (
            <Checkbox
              class={this.resolveClassName('select-checkbox')}
              indeterminate={!this.isAllSelected && !!this.selected.length && !this.isAll}
              modelValue={this.isAllSelected}
            />
          )}
          {this.t.selectAll}
        </li>
      );
    };
    // 全部
    const renderAll = () => {
      if (!this.isShowAll) return;
      return (
        <div class={this.resolveClassName('select-all')}>
          <div
            class={[
              'wrapper',
              this.selected.length === 1 && this.selected[0]?.value === this.allOptionId ? 'active' : '',
            ]}
            onClick={this.toggleAll}
          >
            <TextAll class='select-all-icon' />
            <span>{this.t.all}</span>
          </div>
        </div>
      );
    };
    // 默认trigger输入框渲染
    const renderTriggerInput = () => {
      if (this.multipleMode === 'tag') {
        return (
          <SelectTagInput
            ref='selectTagInputRef'
            v-model={this.customOptionName}
            v-slots={{
              prefix: renderPrefix(),
              default: this.$slots?.tag && (() => this.$slots?.tag({ selected: this.selected })),
              tagRender: this.$slots?.tagRender && ((item: ISelected) => this.$slots?.tagRender(item)),
              suffix: () => suffixIcon(),
            }}
            behavior={this.behavior}
            collapseTags={this.isCollapseTags}
            disabled={this.isDisabled}
            filterable={this.isInput}
            placeholder={this.localPlaceholder}
            selected={this.selected}
            tagTheme={this.tagTheme}
            onEnter={this.handleCreateCustomOption}
            onRemove={this.handleDeleteTag}
          />
        );
      }
      return (
        <Input
          ref='inputRef'
          behavior={this.behavior}
          disabled={this.isDisabled}
          modelValue={this.isInput ? this.customOptionName : this.selectedLabel.join(',')}
          placeholder={this.isInput ? this.selectedLabel.join(',') || this.localPlaceholder : this.localPlaceholder}
          readonly={!this.isInput}
          selectReadonly={true}
          size={this.size}
          stopPropagation={false}
          type='text'
          withValidate={false}
          onEnter={this.handleCreateCustomOption}
          onInput={this.handleInputChange}
          {...(this.prefix ? { prefix: this.prefix } : null)}
          v-slots={{
            ...(typeof this.$slots?.prefix === 'function' ? { prefix: () => this.$slots?.prefix?.() } : null),
            suffix: () => suffixIcon(),
          }}
        />
      );
    };
    // 渲染trigger
    const renderSelectTrigger = () => (
      <div
        ref='triggerRef'
        style={{ height: this.autoHeight && this.collapseTags ? '32px' : '' }}
        class={this.resolveClassName('select-trigger')}
        onClick={this.handleTogglePopover}
        onMouseenter={this.setHover}
        onMouseleave={this.cancelHover}
      >
        {this.$slots?.trigger?.({ selected: this.selected }) || renderTriggerInput()}
      </div>
    );
    // 渲染列表模式
    const renderList = () => {
      return this.isEnableVirtualRender ? (
        <VirtualRender
          ref='virtualRenderRef'
          height={this.virtualHeight}
          lineHeight={this.virtualLineHeight}
          list={this.filterList}
          preloadItemCount={this.preloadItemCount}
          scrollbar={{ enabled: true, size: 'small' }}
        >
          {{
            default: ({ data }) => {
              // 兼容以前slots
              const optionRender = this.$slots?.optionRender || this.$slots?.virtualScrollRender;
              return data.map(item => (
                <Option
                  id={item[this.idKey]}
                  key={item[this.idKey]}
                  v-slots={typeof optionRender === 'function' ? { default: () => optionRender({ item }) } : null}
                  name={item[this.displayKey]}
                />
              ));
            },
          }}
        </VirtualRender>
      ) : (
        this.filterList.map(item => {
          // 兼容以前slots
          const optionRender = this.$slots?.optionRender || this.$slots?.virtualScrollRender;
          return (
            <Option
              id={item[this.idKey]}
              key={item[this.idKey]}
              v-slots={typeof optionRender === 'function' ? { default: () => optionRender({ item }) } : null}
              name={item[this.displayKey]}
            />
          );
        })
      );
    };
    // 渲染内容
    const renderSelectContent = () => (
      <div
        ref='contentRef'
        class={this.resolveClassName('select-content-wrapper')}
      >
        {renderAll()}
        {this.filterable && !this.inputSearch && (
          <div class={this.resolveClassName('select-search-wrapper')}>
            <Search
              width={16}
              height={16}
              class='icon-search'
            />
            <input
              ref='searchRef'
              class={this.resolveClassName('select-search-input')}
              v-model={this.searchValue}
              placeholder={this.localSearchPlaceholder}
            />
          </div>
        )}
        {!this.isShowSelectContent && (
          <div class={this.resolveClassName('select-empty')}>
            {this.searchLoading && (
              <Loading
                class='mr5'
                loading={true}
                mode='spin'
                size='mini'
                theme='primary'
              />
            )}
            <span>{this.curContentText}</span>
          </div>
        )}
        <div class={this.resolveClassName('select-content')}>
          <div
            style={{ maxHeight: `${this.scrollHeight}px`, minHeight: `${this.minHeight}px` }}
            class={this.isEnableVirtualRender ? '' : this.resolveClassName('select-dropdown')}
            onScroll={this.handleScroll}
          >
            <ul class={this.resolveClassName('select-options')}>
              {renderSelectAll()}
              {renderList()}
              {this.$slots?.default?.()}
              {this.scrollLoading && (
                <li class={this.resolveClassName('select-options-loading')}>
                  <Loading
                    class='spinner mr5'
                    loading={true}
                    mode='spin'
                    size='mini'
                    theme='primary'
                  />
                  <span>{this.localLoadingText}</span>
                </li>
              )}
            </ul>
          </div>
          {this.$slots?.extension && (
            <div class={this.resolveClassName('select-extension')}>{this.$slots?.extension()}</div>
          )}
        </div>
      </div>
    );

    return (
      <div class={selectClass}>
        <Popover
          {...this.popoverConfig}
          ref='popoverRef'
          v-slots={{
            default: () => renderSelectTrigger(),
            content: () => renderSelectContent(),
          }}
          onAfterShow={this.handlePopoverShown}
          onClickoutside={this.handleClickOutside}
        />
      </div>
    );
  },
});
