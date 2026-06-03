/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2025 Tencent.  All rights reserved.
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
  cloneVNode,
  computed,
  defineComponent,
  isVNode,
  nextTick,
  onMounted,
  PropType,
  provide,
  reactive,
  ref,
  toRefs,
  watch,
  type VNode,
} from 'vue';

import Checkbox from '@bkui-vue/checkbox';
import { useLocale, usePrefix } from '@bkui-vue/config-provider';
import { clickoutside, IOptions } from '@bkui-vue/directives';
import { AngleDown, AngleUpFill, Close, Search, TextAll } from '@bkui-vue/icon';
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
    filterable: PropTypes.bool.def(false), // 是否支持搜索
    remoteMethod: PropTypes.func,
    scrollHeight: PropTypes.number.def(204), // 最大高度
    minHeight: PropTypes.number, // 最小高度
    showAll: PropTypes.bool.def(false), // 全部
    allOptionText: PropTypes.string.def(''), // 全部选项文本
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
    disableScrollToSelectedOption: PropTypes.bool.def(false), // 是否禁用滚动到选中option的功能
    inputTooltipsOptions: {
      type: Object as PropType<Partial<IOptions>>,
      default: () => ({}),
    }, // 透传Input组件的tooltips配置
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
  setup(props, { emit, slots }) {
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
      disableScrollToSelectedOption,
    } = toRefs(props);

    const virtualRenderRef = ref(null);
    const displayAllText = computed(() => {
      return props.allOptionText;
    });
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
        return t.value.selectAll;
      }
      return props.selectAllText;
    });

    const formItem = useFormItem();

    const inputRef = ref<HTMLElement>();
    const triggerRef = ref<HTMLElement>();
    const contentRef = ref<HTMLElement>();
    const searchRef = ref<HTMLInputElement>();
    const scrollContainerRef = ref<HTMLElement>();
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
    const selectedCacheMap = computed(() =>
      selected.value.reduce<Record<PropertyKey, number | string>>(
        (pre, item) => {
          pre[item.value] = item.label;
          return pre;
        },
        {
          [`${allOptionId.value}`]: t.value.all,
        },
      ),
    );

    const activeOptionValue = ref<any>(); // 当前悬浮的option
    const listMap = computed(() =>
      list.value.reduce((pre, item) => {
        pre[item[idKey.value]] = item[displayKey.value];
        return pre;
      }, {}),
    );

    type SlotOptionMeta = {
      label: number | string;
      disabled: boolean;
      raw: Record<string, any>;
    };
    const slotOptionMetaMap = ref<Map<PropertyKey, SlotOptionMeta>>(new Map());

    const normalizeVNodes = (nodes: unknown): VNode[] => {
      if (!nodes) return [];
      const list = Array.isArray(nodes) ? nodes : [nodes];
      return list.filter(isVNode) as VNode[];
    };

    const getVNodeName = (vnode: VNode): string => {
      const type = vnode.type as any;
      return typeof type === 'object' ? type?.name : String(type);
    };
    const isOptionName = (name: string) => name === 'Option' || name === 'BkOption';
    const isOptionGroupName = (name: string) => name === 'OptionGroup' || name === 'BkOptionGroup';

    const parseOptionValueLabel = (vnode: VNode) => {
      const rawProps = (vnode.props ?? {}) as Record<string, any>;
      // Option 内部兼容：id 优先，其次 attrs.value
      const value = rawProps.id !== undefined ? rawProps.id : rawProps.value;
      // Option 内部兼容：name 优先，其次 attrs.label
      const label = rawProps.name !== undefined ? rawProps.name : rawProps.label;
      const disabled = !!rawProps.disabled;
      return { value, label, disabled, rawProps };
    };

    const refreshSlotOptionMetaMap = () => {
      const nodes = normalizeVNodes(slots.default?.() ?? []);
      const map = new Map<PropertyKey, SlotOptionMeta>();

      const walk = (vnodes: VNode[]) => {
        for (const vnode of vnodes) {
          const name = getVNodeName(vnode);
          if (isOptionName(name)) {
            const { value, label, disabled, rawProps } = parseOptionValueLabel(vnode);
            if (value !== undefined) {
              map.set(value, {
                label: (label ?? value) as number | string,
                disabled,
                raw: rawProps,
              });
            }
            continue;
          }
          if (isOptionGroupName(name)) {
            const childrenSlot = (vnode.children as any)?.default;
            const children = typeof childrenSlot === 'function' ? normalizeVNodes(childrenSlot()) : [];
            walk(children);
          }
        }
      };

      walk(nodes);
      slotOptionMetaMap.value = map;
    };

    const countSlotOptions = () => {
      const nodes = normalizeVNodes(slots.default?.() ?? []);
      let count = 0;
      const walk = (vnodes: VNode[]) => {
        for (const vnode of vnodes) {
          const name = getVNodeName(vnode);
          if (isOptionName(name)) {
            count += 1;
            continue;
          }
          if (isOptionGroupName(name)) {
            const childrenSlot = (vnode.children as any)?.default;
            const children = typeof childrenSlot === 'function' ? normalizeVNodes(childrenSlot()) : [];
            walk(children);
          }
        }
      };
      walk(nodes);
      return count;
    };

    // 初始同步一次（让虚拟模式在首帧即可根据 slot/options 判断是否启用）
    refreshSlotOptionMetaMap();

    // 虚拟模式下的分组折叠状态（key 来自 vnode.key 或 fallback）
    const groupCollapseState = ref<Map<PropertyKey, boolean>>(new Map());
    const setGroupCollapse = (groupKey: PropertyKey, collapsed: boolean) => {
      const next = new Map(groupCollapseState.value);
      next.set(groupKey, collapsed);
      groupCollapseState.value = next;
    };
    const getGroupCollapse = (groupKey: PropertyKey, fallback = false) => {
      return groupCollapseState.value.get(groupKey) ?? fallback;
    };

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
      // 仅在下拉展开时更新定位；并放到 DOM 更新后执行，避免更新链路互相触发导致递归更新
      if (!isPopoverShow.value) return;
      nextTick(() => {
        if (!isPopoverShow.value) return;
        popoverRef.value?.updatePopover(null, popoverConfig.value);
      });
    });

    // list模式下搜索后的值
    const filterList = computed(() => {
      // 远程搜索：list 由外部 remoteMethod 更新，不在这里做过滤
      if (isRemoteSearch.value) return list.value;

      const keyword = curSearchValue.value;
      // 关键字为空时直接返回原始 list，避免无意义的拷贝导致虚拟列表反复重算
      if (!keyword) return list.value;

      return list.value.filter(item => {
        return defaultSearchMethod(keyword, String(item[displayKey.value]), item);
      });
    });
    // select组件是否禁用
    const isDisabled = computed(() => disabled.value || loading.value);
    // modelValue对应的label
    const selectedLabel = computed(() =>
      selected.value.map(
        item =>
          optionsMap.value?.get(item.value)?.optionName ||
          listMap.value[item.value] ||
          slotOptionMetaMap.value.get(item.value)?.label ||
          item.label,
      ),
    );
    // 是否全选(todo: 优化)
    const isAllSelected = computed(() => {
      const valueSet = new Set<PropertyKey>();

      // slot/options 模式：优先使用已注册的 options；否则使用解析出来的 slotOptionMetaMap（虚拟模式）
      if (options.value.length > 0) {
        options.value.forEach(option => {
          if (!option.isDisabled) valueSet.add(option.optionID);
        });
      } else {
        slotOptionMetaMap.value.forEach((meta, value) => {
          if (!meta.disabled) valueSet.add(value);
        });
      }

      // list 模式
      list.value?.forEach(item => {
        if (item?.disabled) return;
        valueSet.add(item[idKey.value]);
      });

      const allSelectableValues = [...valueSet.values()];
      if (!allSelectableValues.length) return false;

      return allSelectableValues.every(val => selected.value.some(item => isEqual(item.value, val)));
    });
    // 全部选项
    const isAll = computed(() => selected.value.length === 1 && selected.value[0]?.value === allOptionId.value);
    // 是否含有分组
    const isGroup = computed(() => !!groupsMap.value.size);
    // options是否为空（list 模式使用 list 判断，slot 模式使用 options 判断；虚拟 slot 额外使用 slotOptionMetaMap 判断）
    const isOptionsEmpty = computed(() => {
      // 如果有 list 数据，以 list 为准
      if (list.value.length > 0) return false;
      // 虚拟 slot/options
      if (slotOptionMetaMap.value.size > 0) return false;
      // 否则以 options（slot 模式）为准
      return !options.value.length;
    });
    // 是否搜索为空（list 模式使用 filterList 判断，slot 模式使用 options.visible 判断；虚拟 slot 用 slotOptionMetaMap + defaultSearchMethod 判断）
    const isSearchEmpty = computed(() => {
      // 如果有 list 数据，以 filterList 为准
      if (list.value.length > 0) {
        return curSearchValue.value && filterList.value.length === 0;
      }
      if (slotOptionMetaMap.value.size > 0) {
        const keyword = curSearchValue.value;
        if (!keyword) return false;
        for (const meta of slotOptionMetaMap.value.values()) {
          if (defaultSearchMethod(keyword, String(meta.label), meta.raw)) {
            return false;
          }
        }
        return true;
      }
      // 否则以 options（slot 模式）为准
      return options.value.length && options.value.every(option => !option.visible);
    });
    // 是否远程搜索
    const isRemoteSearch = computed(() => filterable.value && typeof remoteMethod.value === 'function');
    // options过滤函数
    const hasFilterOptionFunc = computed(() => {
      if (filterOption.value && typeof filterOption.value === 'function') return true;

      return false;
    });
    // 是否显示select下拉内容
    const isShowSelectContent = computed(() => {
      // 自定义内容时始终显示
      if (customContent.value) return true;

      // 加载中、无数据、无搜索结果时不显示下拉内容
      return !(searchLoading.value || isOptionsEmpty.value || isSearchEmpty.value);
    });
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
      if (!enableVirtualRender.value) return false;
      const slotCount = slotOptionMetaMap.value.size || countSlotOptions();
      const candidateCount = filterList.value.length + slotCount;
      // 兜底：如果存在 slot 内容但无法可靠计数，避免首屏渲染全部节点，直接启用虚拟滚动
      if (candidateCount === 0 && typeof slots.default === 'function') return true;
      return candidateCount * virtualLineHeight.value > virtualHeight.value;
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
          offset: 4,
          popoverDelay: 0,
          renderType: RenderType.AUTO,
          referenceCls: resolveClassName('select-popover-reference'),
          // 当 autoHeight + collapseTags 模式时，使用 selectTagInputRef 作为定位参考
          floatingReference: autoHeight.value && collapseTags.value ? selectTagInputRef.value?.$el : undefined,
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
        // 打开时刷新一次 slot options 元信息（用于虚拟模式回显/空态判断）
        refreshSlotOptionMetaMap();
        document.addEventListener('keydown', handleDocumentKeydown);
        setTimeout(() => {
          focusInput();
          initActiveOptionValue();
          scrollActiveOptionIntoView();
          // 重置虚拟滚动状态，确保再次打开时正确渲染
          if (isEnableVirtualRender.value) {
            virtualRenderRef.value?.reset?.();
          }
        }, 10); // 等待Popover content出来，options加载完成
      }
    });
    // 滚动到当前选中的options中
    const scrollActiveOptionIntoView = () => {
      if (disableScrollToSelectedOption.value) return;
      if (isEnableVirtualRender.value) {
        const rows = buildVirtualRows();
        const idx = rows.findIndex(row => row?.rowType === 'option' && isEqual(row?.value, activeOptionValue.value));
        if (idx >= 0) {
          virtualRenderRef.value?.scrollTo?.(0, idx * virtualLineHeight.value);
        }
        return;
      }
      const optionsDom = contentRef.value?.querySelectorAll?.('.is-selected');
      optionsDom?.[0]?.scrollIntoView({
        block: 'center',
      });
    };

    // 初始化当前悬浮的option项
    const initActiveOptionValue = () => {
      if (isEnableVirtualRender.value) {
        const rows = buildVirtualRows();
        const selectableValues = rows.filter(row => row?.rowType === 'option' && !row?.disabled).map(row => row.value);
        if (!selectableValues.length) {
          activeOptionValue.value = '';
          return;
        }
        const firstSelected = selected.value[0]?.value;
        if (firstSelected !== undefined && selectableValues.some(v => isEqual(v, firstSelected))) {
          activeOptionValue.value = firstSelected;
        } else {
          activeOptionValue.value = selectableValues[0];
        }
        return;
      }
      const firstSelected = selected.value[0];
      const option = optionsMap.value.get(firstSelected?.value);
      if (option && !option.isDisabled && option.visible) {
        activeOptionValue.value = firstSelected?.value;
      } else {
        activeOptionValue.value = options.value.find(option => !option.isDisabled && option.visible)?.optionID;
      }
    };
    // 默认搜索方法

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
      // Popover 关闭时：下拉搜索无需处理；但 inputSearch/allowCreate 仍需要更新可见性
      if (!isPopoverShow.value && !(inputSearch.value || allowCreate.value)) return;

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
      // Popover 关闭时跳过搜索相关的副作用，避免不必要的 DOM 操作和状态更新
      if (!isPopoverShow.value) return;
      if (isEnableVirtualRender.value) {
        virtualRenderRef.value?.scrollTo?.(0, 0);
      } else if (scrollContainerRef.value) {
        scrollContainerRef.value.scrollTop = 0;
      }
      activeOptionValue.value = '';
      emit('search-change', searchValue.value);
    });

    // 派发change事件
    const emitChange = (val: string | string[]) => {
      if (val === modelValue.value) return;

      emit('update:modelValue', val, modelValue.value);
      emit('change', val, modelValue.value);
      // 重置Selected 以model-value为主
      handleSetSelectedData();
      if (multiple.value) {
        // 多选时enter之后变成tag不需要保存当前值
        customOptionName.value = '';
      }
    };
    // 派发toggle事件
    const handleTogglePopover = () => {
      if (isDisabled.value || trigger.value === 'manual') return;
      // 打开前先刷新 slot/options 元信息，避免首帧先走非虚拟导致大量 mount
      refreshSlotOptionMetaMap();
      handleFocus();
      togglePopover();
    };
    // 自定义创建
    const handleInputChange = value => {
      if (!filterable.value) return;
      customOptionName.value = value;

      if (!value?.length) {
        emitChange(multiple.value ? [] : '');
      }
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
      customOptionName.value = '';
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
          if (option.isDisabled || tmpSelectedMap.has(option.optionID)) return;

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
    // 虚拟滚动的滚动事件（VirtualRender 会回传 pagination.pos.bottom）
    const handleVirtualContentScroll = (args: unknown[]) => {
      const pagination = args?.[1] as any;
      if (pagination?.pos?.bottom === 0) {
        emit('scroll-end');
      }
    };

    /**
     * 虚拟模式：把 list + slot + OptionGroup 扁平化成虚拟行（作为 VirtualRender 的 list）
     * 注意：该函数会在 render/键盘处理时被调用，需保持纯函数（不要在这里写入响应式状态）。
     */
    const buildVirtualRows = () => {
      const keyword = curSearchValue.value || '';
      const optionRender = slots.optionRender || slots.virtualScrollRender;

      const rows: any[] = [];

      // 1) list 模式数据（已通过 filterList 过滤）
      filterList.value.forEach(item => {
        const value = item[idKey.value];
        rows.push({
          rowType: 'option',
          key: `__list_${String(value)}`,
          value,
          disabled: !!item.disabled,
          vnode: (
            <Option
              id={value}
              key={value}
              v-slots={typeof optionRender === 'function' ? { default: () => optionRender({ item }) } : null}
              disabled={!!item.disabled}
              name={item[displayKey.value]}
              skipRegister={true}
            />
          ),
        });
      });

      // 2) slot/options + OptionGroup
      const slotNodes = normalizeVNodes(slots.default?.() ?? []);
      slotNodes.forEach((vnode, index) => {
        const name = getVNodeName(vnode);
        if (isOptionName(name)) {
          const { value, label, disabled, rawProps } = parseOptionValueLabel(vnode);
          if (value === undefined) return;
          if (keyword && !defaultSearchMethod(keyword, String(label ?? value), rawProps)) return;
          rows.push({
            rowType: 'option',
            key: vnode.key ?? `__slot_${index}_${String(value)}`,
            value,
            disabled,
            vnode: cloneVNode(vnode, { skipRegister: true }, true),
          });
          return;
        }

        if (isOptionGroupName(name)) {
          const groupProps = (vnode.props ?? {}) as Record<string, any>;
          if (groupProps.visible === false) return;

          const groupKey = vnode.key ?? `__group_${index}`;
          const groupLabel = String(groupProps.label ?? '');
          const groupDisabled = !!groupProps.disabled;
          const groupCollapsible = !!groupProps.collapsible;
          const groupCollapsed = getGroupCollapse(groupKey, !!groupProps.collapse);
          const labelSlot = typeof (vnode.children as any)?.label === 'function' ? (vnode.children as any).label : null;

          const childrenSlot = (vnode.children as any)?.default;
          const children = typeof childrenSlot === 'function' ? normalizeVNodes(childrenSlot()) : [];

          const optionNodes = children.filter(v => isOptionName(getVNodeName(v)));
          const matchedOptionNodes = optionNodes.filter(optVNode => {
            const { value, label, rawProps } = parseOptionValueLabel(optVNode);
            if (value === undefined) return false;
            if (!keyword) return true;
            return defaultSearchMethod(keyword, String(label ?? value), rawProps);
          });

          // 搜索命中为空时隐藏整个分组
          if (keyword && matchedOptionNodes.length === 0) return;
          // 分组内无任何 option 时不渲染
          if (!optionNodes.length) return;

          rows.push({
            rowType: 'groupHeader',
            key: `__group_header_${String(groupKey)}`,
            groupKey,
            groupProps,
            label: groupLabel,
            disabled: groupDisabled,
            collapsible: groupCollapsible,
            collapsed: groupCollapsed,
            count: matchedOptionNodes.length,
            labelSlot,
          });

          if (!groupCollapsed) {
            matchedOptionNodes.forEach((optVNode, optIndex) => {
              const { value, disabled } = parseOptionValueLabel(optVNode);
              if (value === undefined) return;
              const mergedClass = [
                (optVNode.props as any)?.class,
                'is-grouped',
                groupCollapsible ? 'is-group-collapsible' : '',
              ];
              rows.push({
                rowType: 'option',
                key: optVNode.key ?? `__group_${index}_opt_${optIndex}_${String(value)}`,
                value,
                disabled,
                vnode: cloneVNode(optVNode, { skipRegister: true, class: mergedClass }, true),
              });
            });
          }
          return;
        }

        // 其它未知节点按原样插入（与非虚拟模式一致）
        rows.push({
          rowType: 'vnode',
          key: vnode.key ?? `__vnode_${index}`,
          vnode,
        });
      });

      if (props.scrollLoading) {
        rows.push({ rowType: 'loading', key: '__loading' });
      }

      return rows;
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
    // 优先级: option name属性 > list模式 > 上一次选择的label > 当前值
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
        slotOptionMetaMap.value.get(tmpValue)?.label ||
        selectedCacheMap.value[tmpValue] ||
        tmpValue
      );
    };
    // 设置selected选项
    const handleSetSelectedData = () => {
      // 用于虚拟模式下的 slot/options 回显
      refreshSlotOptionMetaMap();
      const setIfChanged = (nextSelected: ISelected[]) => {
        // 防止 options/list 变化时重复写入同一份 selected，造成不必要的更新风暴
        if (isEqual(nextSelected, selected.value)) return;
        selected.value = nextSelected;
      };
      // 同步内部value值
      if (Array.isArray(modelValue.value)) {
        setIfChanged([
          ...(modelValue.value as string[]).map(value => ({
            value,
            label: handleGetLabelByValue(value),
          })),
        ]);
      } else {
        if (modelValue.value || modelValue.value === 0 || allowEmptyValues.value.includes(modelValue.value)) {
          setIfChanged([
            {
              value: modelValue.value,
              label: handleGetLabelByValue(modelValue.value),
            },
          ]);
        } else {
          setIfChanged([]);
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
      if (!isPopoverShow.value) return;

      if (isEnableVirtualRender.value) {
        const rows = buildVirtualRows();
        const selectableValues = rows.filter(row => row?.rowType === 'option' && !row?.disabled).map(row => row.value);
        if (!selectableValues.length) return;

        const curIndex = selectableValues.findIndex(v => isEqual(v, activeOptionValue.value));

        const scrollToValue = (val: PropertyKey) => {
          const idx = rows.findIndex(row => row?.rowType === 'option' && isEqual(row?.value, val));
          if (idx >= 0) {
            virtualRenderRef.value?.scrollTo?.(0, idx * virtualLineHeight.value);
          }
        };

        switch (e.code) {
          case 'ArrowUp':
          case 'ArrowDown': {
            e.preventDefault();
            let nextIndex = 0;
            if (e.code === 'ArrowDown') {
              nextIndex = curIndex >= selectableValues.length - 1 ? 0 : Math.max(0, curIndex + 1);
            } else {
              nextIndex = curIndex <= 0 ? selectableValues.length - 1 : curIndex - 1;
            }
            activeOptionValue.value = selectableValues[nextIndex];
            scrollToValue(activeOptionValue.value);
            break;
          }
          case 'Backspace': {
            if (
              !multiple.value ||
              !selected.value.length ||
              customOptionName.value.length ||
              e.target === searchRef.value
            )
              return;

            selected.value.pop();
            emitChange(selected.value.map(item => item.value));
            break;
          }
          case 'NumpadEnter':
          case 'Enter': {
            const { value } = e.target as HTMLInputElement;
            // 搜索和创建的时候不触发enter事件
            if ((allowCreate.value && value) || (e.target === searchRef.value && searchRef.value?.value)) return;
            const activeVal = activeOptionValue.value;
            if (activeVal === undefined || activeVal === '') return;
            handleOptionSelected({
              optionID: activeVal as any,
              optionName: handleGetLabelByValue(activeVal),
            } as any);
            break;
          }
        }

        return;
      }

      const availableOptions = options.value.filter(option => !option.isDisabled && option.visible);
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
        case 'NumpadEnter':
        case 'Enter': {
          const { value } = e.target as HTMLInputElement;
          // 搜索和创建的时候不触发enter事件
          if ((allowCreate.value && value) || (e.target === searchRef.value && searchRef.value?.value)) return;
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
        isSearchEmpty,
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

    // 虚拟滚动：切换分组折叠（兼容 OptionGroup 的 update:collapse）
    const handleToggleGroupCollapseVirtual = (groupKey: PropertyKey, groupProps: Record<string, any>) => {
      if (!groupProps?.collapsible || groupProps?.disabled) return;
      const nextCollapsed = !getGroupCollapse(groupKey, !!groupProps?.collapse);
      setGroupCollapse(groupKey, nextCollapsed);
      const cb = groupProps?.['onUpdate:collapse'];
      if (typeof cb === 'function') cb(nextCollapsed);
    };

    // 处理扩展区域点击事件
    const handleExtensionClick = (e: MouseEvent) => {
      e.stopPropagation();
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
      scrollContainerRef,
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
      displayAllText,
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
      handleVirtualContentScroll,
      handleDeleteTag,
      handleInputChange,
      handleSelectedAllOptionMouseEnter,
      localLoadingText,
      localPlaceholder,
      localSearchPlaceholder,
      localSelectAllText,
      resolveClassName,
      handleCreateCustomOption,
      defaultSearchMethod,
      virtualLineHeight,
      isEnableVirtualRender,
      preloadItemCount,
      virtualRenderRef,
      setSelected,
      buildVirtualRows,
      groupCollapseState,
      getGroupCollapse,
      handleToggleGroupCollapseVirtual,
      handleExtensionClick,
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
      if (
        (this.clearable && this.isHover && this.selected.length && !this.isDisabled) ||
        (this.allowCreate && this.isHover && this.customOptionName && !this.isDisabled)
      ) {
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
          {this.localSelectAllText}
        </li>
      );
    };
    // 全部icon支持自定义
    const renderAllIcon = () => {
      return this.$slots?.allOptionIcon?.() || <TextAll class='select-all-icon' />;
    };
    // 全部选项文案支持自定义
    const renderAllText = () => {
      return <span>{this.displayAllText || this.t.all}</span>;
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
            {renderAllIcon()}
            {renderAllText()}
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
          modelValue={this.isInput && this.customOptionName ? this.customOptionName : this.selectedLabel.join(',')}
          placeholder={this.isInput ? this.selectedLabel.join(',') || this.localPlaceholder : this.localPlaceholder}
          readonly={!this.isInput}
          selectReadonly={true}
          size={this.size}
          stopPropagation={false}
          tooltipsOptions={this.inputTooltipsOptions}
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
    // 渲染列表模式（非虚拟）
    const renderList = () => {
      return this.filterList.map(item => {
        // 兼容以前slots
        const optionRender = this.$slots?.optionRender || this.$slots?.virtualScrollRender;
        return (
          <Option
            id={item[this.idKey]}
            key={item[this.idKey]}
            v-slots={typeof optionRender === 'function' ? { default: () => optionRender({ item }) } : null}
            disabled={!!item.disabled}
            name={item[this.displayKey]}
          />
        );
      });
    };

    // 虚拟渲染（list + slot + OptionGroup 扁平化为虚拟行）
    const renderVirtualList = () => {
      const rows = this.buildVirtualRows?.() ?? [];

      return (
        <VirtualRender
          ref='virtualRenderRef'
          height={this.virtualHeight}
          className={this.resolveClassName('select-dropdown')}
          lineHeight={this.virtualLineHeight}
          list={rows}
          minHeight={this.minHeight || 30}
          preloadItemCount={this.preloadItemCount}
          wrapperStyle={{ width: '100%', display: 'block' }}
          onContentScroll={this.handleVirtualContentScroll}
        >
          {{
            default: ({ data }) => (
              <ul class={this.resolveClassName('select-options')}>
                {data.map(row => {
                  if (row.rowType === 'groupHeader') {
                    const labelIconClass = classes({
                      'default-group-label-icon': true,
                      collapse: row.collapsed,
                    });
                    return (
                      <li
                        key={row.key as any}
                        class={classes({
                          [this.resolveClassName('option-group-label')]: true,
                          collapsible: row.collapsible,
                          disabled: row.disabled,
                        })}
                        onClick={() => this.handleToggleGroupCollapseVirtual(row.groupKey, row.groupProps)}
                      >
                        {row.labelSlot ? (
                          row.labelSlot()
                        ) : (
                          <span class='default-group-label'>
                            {row.collapsible && <AngleUpFill class={labelIconClass}></AngleUpFill>}
                            <span class='default-group-label-title'>
                              {row.label} ({row.count})
                            </span>
                          </span>
                        )}
                      </li>
                    );
                  }
                  if (row.rowType === 'option') return row.vnode;
                  if (row.rowType === 'loading') {
                    return (
                      <li
                        key={row.key as any}
                        class={this.resolveClassName('select-options-loading')}
                      >
                        <Loading
                          class='spinner mr5'
                          loading={true}
                          mode='spin'
                          size='mini'
                          theme='primary'
                        />
                        <span>{this.localLoadingText}</span>
                      </li>
                    );
                  }
                  return row.vnode;
                })}
              </ul>
            ),
          }}
        </VirtualRender>
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
            {this.searchValue && (
              <span
                class={this.resolveClassName('select-search-clear')}
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  this.searchValue = '';
                }}
              >
                <Close />
              </span>
            )}
          </div>
        )}
        {!this.isShowSelectContent && (
          <div class={this.resolveClassName('select-empty')}>
            {this.$slots?.empty?.({ searchLoading: this.searchLoading, text: this.curContentText }) ?? (
              <>
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
              </>
            )}
          </div>
        )}
        <div class={this.resolveClassName('select-content')}>
          {this.isEnableVirtualRender ? (
            <div v-show={this.isShowSelectContent}>
              {/* 全选行保持在虚拟滚动容器外，避免影响虚拟高度计算 */}
              {this.isShowSelectAll && <ul class={this.resolveClassName('select-options')}>{renderSelectAll()}</ul>}
              {renderVirtualList()}
            </div>
          ) : (
            <div
              ref='scrollContainerRef'
              style={{ maxHeight: `${this.scrollHeight}px`, minHeight: `${this.minHeight}px` }}
              class={this.resolveClassName('select-dropdown')}
              v-show={this.isShowSelectContent}
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
          )}
          {this.$slots?.extension && (
            <div
              class={this.resolveClassName('select-extension')}
              onClick={this.handleExtensionClick}
            >
              {this.$slots?.extension()}
            </div>
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
          onClickoutside={this.handleClickOutside}
        />
      </div>
    );
  },
});
