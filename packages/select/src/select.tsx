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

import { isEqual, merge } from 'lodash';
import { PopoverPropTypes } from 'popover/src/props';
import {
  computed,
  defineComponent,
  onMounted,
  provide,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue';

import { useLocale } from '@bkui-vue/config-provider';
import { clickoutside } from '@bkui-vue/directives';
import { AngleUp, Close, Search } from '@bkui-vue/icon';
import Input from '@bkui-vue/input';
import Loading from '@bkui-vue/loading';
import BKPopover from '@bkui-vue/popover';
import {
  classes,
  InputBehaviorType,
  PropTypes, RenderType, resolveClassName,
  SizeEnum,
  TagThemeType,
  useFormItem,
} from '@bkui-vue/shared';
import VirtualRender from '@bkui-vue/virtual-render';

import {
  selectKey,
  toLowerCase,
  useHover,
  usePopover,
  useRegistry,
  useRemoteSearch,
} from './common';
import Option from './option';
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
    scrollHeight: PropTypes.number.def(200),
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
    popoverOptions: PropTypes.object.def({}), // popover属性
    customContent: PropTypes.bool.def(false), // 是否自定义content内容
    list: PropTypes.array.def([]),
    idKey: PropTypes.string.def('value'),
    displayKey: PropTypes.string.def('label'),
    withValidate: PropTypes.bool.def(true),
    showSelectedIcon: PropTypes.bool.def(true), // 多选时是否显示勾选ICON
    inputSearch: PropTypes.bool.def(true), // 是否采用输入框支持搜索的方式
    enableVirtualRender: PropTypes.bool.def(false), // 是否开启虚拟滚动（List模式下才会生效）
    allowEmptyValues: PropTypes.array.def([]), // 允许的空值作为options选项
    autoFocus: PropTypes.bool.def(false), // 挂载的时候是否自动聚焦输入框
    keepSearchValue: PropTypes.bool.def(false), // 隐藏popover时是否保留搜索内容
  },
  emits: ['update:modelValue', 'change', 'toggle', 'clear', 'scroll-end', 'focus', 'blur'],
  setup(props, { emit }) {
    const t = useLocale('select');

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
      scrollHeight,
      list,
      displayKey,
      collapseTags,
      autoHeight,
      popoverOptions,
      allowEmptyValues,
      autoFocus,
      keepSearchValue,
    } = toRefs(props);

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
    const virtualRenderRef = ref();
    const popoverRef = ref();
    const optionsMap = ref<Map<any, OptionInstanceType>>(new Map());
    const options = computed(() => [...optionsMap.value.values()]);
    const groupsMap = ref<Map<string, GroupInstanceType>>(new Map());
    const selected = ref<ISelected[]>([]);
    const cacheSelectedMap = computed<Record<string, string>>(() => selected.value.reduce((pre, item) => {
      pre[item.value] = item.label;
      return pre;
    }, {}));
    const activeOptionValue = ref<any>(); // 当前悬浮的option

    watch(modelValue, () => {
      handleSetSelectedData();
      if (props.withValidate) {
        formItem?.validate?.('change');
      }
    }, { deep: true });

    watch(selected, () => {
      popoverRef.value?.updatePopover(null, popoverConfig.value);
    });

    // 虚拟滚动模式下搜索后的值
    const virtualList = computed(() => (
      isRemoteSearch.value
        ? list.value
        : list.value
          .filter(item => toLowerCase(String(item[displayKey.value]))?.includes(toLowerCase(searchKey.value)))
    ));
    // select组件是否禁用
    const isDisabled = computed(() => disabled.value || loading.value);
    // modelValue对应的label
    const selectedLabel = computed(() => selected.value
      .map(item => optionsMap.value?.get(item.value)?.label || item.label));
    // 是否全选(todo: 优化)
    const isAllSelected = computed(() => {
      const normalSelectedValues = options.value.reduce<string[]>((pre, option) => {
        if (!option.disabled) {
          pre.push(option.value);
        }
        return pre;
      }, []);
      return (normalSelectedValues.length <= selected.value.length)
        && normalSelectedValues.every(val => selected.value.some(item => item.value === val));
    });
    // 是否含有分组
    const isGroup = computed(() => !!groupsMap.value.size);
    // options是否为空
    const isOptionsEmpty = computed(() => !options.value.length);
    // 是否搜索为空
    const isSearchEmpty = computed(() => options.value.length && options.value.every(option => !option.visible));
    // 是否远程搜索
    const isRemoteSearch = computed(() => filterable.value && typeof remoteMethod.value === 'function');
    // 是否显示select下拉内容
    const isShowSelectContent = computed(() => !(searchLoading.value || isOptionsEmpty.value || isSearchEmpty.value)
      || customContent.value);
    // 是否显示全选
    const isShowSelectAll = computed(() => multiple.value && showSelectAll.value
      && (!searchKey.value || !filterable.value));
    // 虚拟滚动高度 12 上下边距，32 显示全选时的高度
    const virtualHeight = computed(() => scrollHeight.value - 12 - (isShowSelectAll.value ? 32 : 0));
    // 当前空状态时显示文案
    const curContentText = computed(() => {
      if (searchLoading.value) {
        return localLoadingText.value;
      }
      if (isOptionsEmpty.value) {
        return localNoDataText.value;
      }
      if (isSearchEmpty.value) {
        return localNoMatchText.value;
      }
      return '';
    });
    // 是否合并tag以数字形式展示
    const isCollapseTags = computed(() => (
      autoHeight.value
        ? collapseTags.value && !isPopoverShow.value
        : collapseTags.value
    ));
    const popoverConfig = computed<Partial<PopoverPropTypes>>(() => merge(
      {
        theme: 'light bk-select-popover',
        trigger: 'manual',
        width: popperWidth.value,
        arrow: false,
        placement: 'bottom-start',
        isShow: isPopoverShow.value,
        reference: selectTagInputRef.value,
        offset: 6,
        popoverDelay: 0,
        renderType: RenderType.AUTO,
      },
      popoverOptions.value,
    ));

    const { register, unregister } = useRegistry<OptionInstanceType>(optionsMap);
    const {
      register: registerGroup,
      unregister: unregisterGroup,
    } = useRegistry<GroupInstanceType>(groupsMap);
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
      emit('blur');
    };

    const {
      popperWidth,
      isPopoverShow,
      hidePopover,
      showPopover,
      togglePopover,
    } = usePopover({ popoverMinWidth: popoverMinWidth.value }, triggerRef);
    watch(isPopoverShow, () => {
      emit('toggle', isPopoverShow.value);
    });
    // 输入框是否可以输入内容
    const isInput = computed(() => (
      (filterable.value && inputSearch.value) || allowCreate.value)
      && isPopoverShow.value);
    watch(isPopoverShow, (isShow) => {
      if (!isShow) {
        if (!keepSearchValue.value) {
          searchKey.value = '';
        }
      } else {
        setTimeout(() => {
          focusInput();
          initActiveOptionValue();
        }, 10);// 等待Popover content出来，options加载完成
      }
    });

    // 初始化当前悬浮的option项
    const initActiveOptionValue = () => {
      const firstSelected = selected.value[0];
      const option = optionsMap.value.get(firstSelected?.value);
      if (option && !option.disabled && option.visible) {
        activeOptionValue.value = firstSelected?.value;
      } else {
        activeOptionValue.value = options.value.find(option => !option.disabled && option.visible)?.value;
      }
    };
    // 默认搜索方法
    const defaultSearchMethod = (value) => {
      if (!filterable.value) return;
      options.value.forEach((option) => {
        option.visible = toLowerCase(String(option.label))?.includes(toLowerCase(value));
      });
    };
    const { searchKey, searchLoading } = useRemoteSearch(
      isRemoteSearch.value
        ? remoteMethod.value
        : defaultSearchMethod,
      initActiveOptionValue,
    );

    // 派发change事件
    const emitChange = (val: string | string[]) => {
      if (val === modelValue.value) return;

      emit('update:modelValue', val, modelValue.value);
      emit('change', val, modelValue.value);
    };
    // 派发toggle事件
    const handleTogglePopover = () => {
      if (isDisabled.value) return;
      handleFocus();
      togglePopover();
    };
    // 搜索
    const handleInputChange = (value) => {
      if (!filterable.value) return;
      searchKey.value = value;
    };
    // allow create(创建自定义选项)
    const handleInputEnter = (val: string | number, e: Event) => {
      const value = String(val);
      if (!allowCreate.value
        || !value
        || (filterable.value && options.value.find(data => toLowerCase(String(data.label)) === toLowerCase(value)))
      ) return; // 开启搜索后，正好匹配到自定义选项，则不进行创建操作

      const data = optionsMap.value.get(value);
      if (data) return; // 已经存在相同值的option时不能创建

      // todo 优化交互方式
      e.stopPropagation(); // 阻止触发 handleKeyup enter 事件
      if (multiple.value) {
        selected.value.push({
          value,
          label: value,
        });
        emitChange(selected.value.map(item => item.value));
      } else {
        selected.value = [{ value, label: value }];
        emitChange(value);
        hidePopover();
      }
      searchKey.value = '';
    };
    // Option点击事件
    const handleOptionSelected = (option: OptionInstanceType) => {
      if (isDisabled.value || !option) return;

      if (multiple.value) {
        // 多选
        const index = selected.value.findIndex(item => item.value === option.value);
        if (index > -1) {
          selected.value.splice(index, 1);
        } else {
          selected.value.push({
            value: option.value,
            label: option.label || option.value,
          });
        }
        emitChange(selected.value.map(item => item.value));
      } else {
        // 单选
        selected.value = [{
          label: option.label || option.value,
          value: option.value,
        }];
        emitChange(option.value);
        hidePopover();
      }
      focusInput();
    };
    // 聚焦输入框
    const focusInput = () => {
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
    // 清空事件
    const handleClear = (e: Event) => {
      e.stopPropagation();
      selected.value = [];
      emitChange(multiple.value ? [] : '');
      emit('clear', multiple.value ? [] : '');
      hidePopover();
    };
    // 全选/取消全选
    const handleSelectedAllOptionMouseEnter = () => {
      activeOptionValue.value = '';
    };
    const handleToggleAll = () => {
      if (isAllSelected.value) {
        selected.value = [];
      } else {
        options.value.forEach((option) => {
          if (option.disabled || selected.value.find(item => item.value === option.value)) return;
          selected.value.push({
            value: option.value,
            label: option.label || option.value,
          });
        });
      }
      emitChange(selected.value.map(item => item.value));
      focusInput();
    };
    // 滚动事件
    const handleScroll = (e) => {
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
      }
    };
    // options存在 > 上一次选择的label > 当前值
    const handleGetLabelByValue = (value: string) => {
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
      return  optionsMap.value?.get(tmpValue)?.label || cacheSelectedMap.value[tmpValue] || tmpValue;
    };
    // 设置selected选项
    const handleSetSelectedData = () => {
      // 同步内部value值
      if (Array.isArray(modelValue.value)) {
        selected.value = [...(modelValue.value as string[]).map(value => ({
          value,
          label: handleGetLabelByValue(value),
        }))];
      } else {
        if (modelValue.value !== undefined || allowEmptyValues.value.includes(modelValue.value)) {
          selected.value = [{
            value: modelValue.value,
            label: handleGetLabelByValue(modelValue.value),
          }];
        } else {
          selected.value = [];
        }
      }
    };
    // 处理键盘事件
    const handleKeydown = (e: KeyboardEvent) => {
      if (!isPopoverShow.value) return;

      const availableOptions = options.value.filter(option => !option.disabled && option.visible);
      const index = availableOptions.findIndex(option => option.value === activeOptionValue.value);
      if (!availableOptions.length || index === -1) return;

      switch (e.code) {
        // 下一个option
        case 'ArrowDown': {
          e.preventDefault();// 阻止滚动屏幕
          const nextIndex = index >= (availableOptions.length - 1) ? 0 : index + 1;
          activeOptionValue.value = availableOptions[nextIndex]?.value;
          break;
        }
        // 上一个option
        case 'ArrowUp': {
          e.preventDefault();// 阻止滚动屏幕
          const preIndex = index === 0 ? availableOptions.length - 1 : index - 1;
          activeOptionValue.value = availableOptions[preIndex]?.value;
          break;
        }
        // 删除选项
        case 'Backspace': {
          if (
            !multiple.value
            || !selected.value.length
            || searchKey.value.length
            || e.target === searchRef.value
          ) return; // 单选和下拉搜索不支持回退键删除

          selected.value.pop();
          emitChange(selected.value.map(item => item.value));
          break;
        }
        // 选择选项
        case 'Enter': {
          const option = optionsMap.value.get(activeOptionValue.value);
          handleOptionSelected(option);
          break;
        }
      }
    };
    const handleClickOutside = ({ event }) => {
      const { target } = event;
      if (triggerRef.value?.contains(target) || triggerRef.value === target) return;
      hidePopover();
      handleBlur();
    };
    const handlePopoverShow = () => {
      setTimeout(() => {
        // 虚拟滚动首次未更新问题
        enableVirtualRender.value && virtualRenderRef.value?.reset?.();
      });
    };

    provide(selectKey, reactive({
      multiple,
      selected,
      activeOptionValue,
      showSelectedIcon,
      register,
      unregister,
      registerGroup,
      unregisterGroup,
      handleOptionSelected,
      handleGetLabelByValue,
    }));

    onMounted(() => {
      handleSetSelectedData();
      setTimeout(() => {
        showOnInit.value && showPopover();
        autoFocus.value && focusInput();
      });
    });

    return {
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
      virtualRenderRef,
      popoverRef,
      searchLoading,
      isOptionsEmpty,
      isSearchEmpty,
      isFocus,
      isShowSelectContent,
      curContentText,
      isGroup,
      searchKey,
      isShowSelectAll,
      virtualHeight,
      virtualList,
      isCollapseTags,
      popoverConfig,
      focusInput,
      setHover,
      cancelHover,
      handleFocus,
      handleBlur,
      handleTogglePopover,
      handleClear,
      hidePopover,
      showPopover,
      handleToggleAll,
      handleOptionSelected,
      handleClickOutside,
      handleScroll,
      handleDeleteTag,
      handleInputChange,
      handleInputEnter,
      handleKeydown,
      handleSelectedAllOptionMouseEnter,
      handlePopoverShow,
      localLoadingText,
      localPlaceholder,
      localSearchPlaceholder,
      localSelectAllText,
    };
  },
  render() {
    const selectClass = classes({
      [resolveClassName('select')]: true,
      'popover-show': this.isPopoverShow,
      'is-disabled': this.isDisabled,
      'is-focus': this.isFocus,
      'is-filterable': this.filterable,
      [this.size]: true,
      [this.behavior]: true,
    });

    const suffixIcon = () => {
      if (this.loading) {
        return <Loading loading={true} theme='primary' class="spinner" mode="spin" size="mini"></Loading>;
      } if (this.clearable && this.isHover && this.selected.length && !this.isDisabled) {
        return <Close class="clear-icon" onClick={this.handleClear}></Close>;
      }
      return <AngleUp class="angle-up"></AngleUp>;
    };

    const renderTriggerInput = () => {
      if (this.multipleMode === 'tag') {
        return (
          <SelectTagInput
            ref="selectTagInputRef"
            v-model={this.searchKey}
            selected={this.selected}
            tagTheme={this.tagTheme}
            placeholder={this.localPlaceholder}
            filterable={this.isInput}
            disabled={this.isDisabled}
            onRemove={this.handleDeleteTag}
            collapseTags={this.isCollapseTags}
            onEnter={this.handleInputEnter}
            onKeydown={(_v, e) => this.handleKeydown(e as KeyboardEvent)}>
              {{
                prefix: () => this.$slots.prefix?.(),
                default: this.$slots.tag && (() => this.$slots.tag({ selected: this.selected })),
                suffix: () => suffixIcon(),
              }}
          </SelectTagInput>
        );
      }
      return (
        <Input
          ref="inputRef"
          type="text"
          modelValue={this.isInput ? this.searchKey : this.selectedLabel.join(',')}
          placeholder={this.isInput ? (this.selectedLabel.join(',') || this.localPlaceholder) : this.localPlaceholder}
          readonly={!this.isInput}
          selectReadonly={true}
          disabled={this.isDisabled}
          behavior={this.behavior}
          size={this.size}
          withValidate={false}
          onInput={this.handleInputChange}
          onEnter={this.handleInputEnter}
          onKeydown={(_v, e) => this.handleKeydown(e as KeyboardEvent)}>
            {{
              prefix: () => this.$slots.prefix?.(),
              suffix: () => suffixIcon(),
            }}
        </Input>
      );
    };
    const renderSelectTrigger = () => (
        <div
          class={resolveClassName('select-trigger')}
          style={{ height: this.autoHeight && this.collapseTags ? '32px' : '' }}
          ref="triggerRef"
          onClick={this.handleTogglePopover}
          onMouseenter={this.setHover}
          onMouseleave={this.cancelHover}>
          { this.$slots.trigger?.({ selected: this.selected }) || renderTriggerInput()}
        </div>
    );
    const renderSelectContent = () => (
        <div class={resolveClassName('select-content-wrapper')} ref="contentRef">
          {
            this.filterable && !this.inputSearch && (
              <div class={resolveClassName('select-search-wrapper')}>
                <Search class="icon-search" width={16} height={16} />
                <input
                  ref="searchRef"
                  class={resolveClassName('select-search-input')}
                  placeholder={this.localSearchPlaceholder}
                  v-model={this.searchKey}
                />
              </div>
            )
          }
          {
            !this.isShowSelectContent
            && (
            <div class={resolveClassName('select-empty')}>
              {
                this.searchLoading
                && <Loading class="mr5" theme='primary' loading={true} mode="spin" size="mini"></Loading>
              }
              <span>{this.curContentText}</span>
            </div>)
          }
          <div class={resolveClassName('select-content')}>
            <div class={resolveClassName('select-dropdown')}
              style={{ maxHeight: `${this.scrollHeight}px` }}
              onScroll={this.handleScroll}
            >
              <ul class={resolveClassName('select-options')} v-show={this.isShowSelectContent}>
                {
                  this.isShowSelectAll && (
                    <li class={resolveClassName('select-option')}
                      onMouseenter={this.handleSelectedAllOptionMouseEnter}
                      onClick={this.handleToggleAll}>
                      {this.localSelectAllText}
                    </li>
                  )
                }
                {
                  this.enableVirtualRender
                    ? <VirtualRender
                        list={this.virtualList}
                        height={this.virtualHeight}
                        lineHeight={32}
                        ref="virtualRenderRef">
                          {{
                            default: ({ data }) => data
                              .map(item => (
                                <Option
                                  key={item[this.idKey]}
                                  value={item[this.idKey]}
                                  label={item[this.displayKey]}
                                />
                              )),
                          }}
                      </VirtualRender>
                    : this.list
                      .map(item => <Option value={item[this.idKey]} label={item[this.displayKey]}></Option>)
                }
                {this.$slots.default?.()}
                {this.scrollLoading && (
                  <li class={resolveClassName('select-options-loading')}>
                    <Loading class="spinner mr5" theme='primary' loading={true} mode="spin" size="mini"></Loading>
                    <span>{this.localLoadingText}</span>
                  </li>
                )}
              </ul>
            </div>
            {this.$slots.extension
              && (<div class={resolveClassName('select-extension')}>{this.$slots.extension()}</div>)}
          </div>
        </div>
    );
    return (
      <div class={selectClass}>
        <BKPopover {...this.popoverConfig}
          onClickoutside={this.handleClickOutside}
          onAfterShow={this.handlePopoverShow}
          ref="popoverRef">
          {{
            default: () => renderSelectTrigger(),
            content: () => renderSelectContent(),
          }}
        </BKPopover>
      </div>
    );
  },
});
