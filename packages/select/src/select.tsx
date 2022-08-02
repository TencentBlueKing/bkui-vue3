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

import { merge } from 'lodash';
import { PopoverPropTypes } from 'popover2/src/props';
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

import { clickoutside } from '@bkui-vue/directives';
import { AngleUp, Close } from '@bkui-vue/icon';
import Input from '@bkui-vue/input';
import Loading from '@bkui-vue/loading';
import BKPopover from '@bkui-vue/popover2';
import {
  classes,
  PropTypes,
  useFormItem,
} from '@bkui-vue/shared';

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
    size: PropTypes.size().def('default'),
    clearable: PropTypes.bool.def(true),
    loading: PropTypes.bool.def(false),
    filterable: PropTypes.bool.def(false), // 是否支持搜索
    remoteMethod: PropTypes.func,
    scrollHeight: PropTypes.number.def(216),
    showSelectAll: PropTypes.bool.def(false), // 全选
    popoverMinWidth: PropTypes.number.def(0), // popover最小宽度
    showOnInit: PropTypes.bool.def(false), // 是否默认显示popover
    multipleMode: PropTypes.oneOf(['default', 'tag']).def('default'), // 多选展示方式
    tagTheme: PropTypes.theme(['success', 'info', 'warning', 'danger']).def(''),
    behavior: PropTypes.oneOf(['normal', 'simplicity']).def('normal'), // 输入框模式
    collapseTags: PropTypes.bool.def(false), // todo:当以标签形式显示选择结果时，是否合并溢出的结果以数字显示
    noDataText: PropTypes.string.def('无数据'),
    noMatchText: PropTypes.string.def('无匹配数据'),
    loadingText: PropTypes.string.def('加载中...'),
    placeholder: PropTypes.string.def('请选择'),
    selectAllText: PropTypes.string.def('全部'),
    scrollLoading: PropTypes.bool.def(false),
    allowCreate: PropTypes.bool.def(false), // 是否运行创建自定义选项
    popoverOptions: PropTypes.object.def({}), // popover属性
    customContent: PropTypes.bool.def(false), // 是否自定义content内容
    list: PropTypes.array.def([]),
    idKey: PropTypes.string.def('value'),
    displayKey: PropTypes.string.def('label'),
    showSelectedIcon: PropTypes.bool.def(true), // 多选时是否显示勾选ICON
  },
  emits: ['update:modelValue', 'change', 'toggle', 'clear', 'scroll-end', 'focus', 'blur'],
  setup(props, { emit }) {
    const {
      modelValue,
      disabled,
      filterable,
      multiple,
      remoteMethod,
      loading,
      loadingText,
      noDataText,
      noMatchText,
      popoverMinWidth,
      showOnInit,
      multipleMode,
      allowCreate,
      customContent,
      showSelectedIcon,
    } = toRefs(props);

    const formItem = useFormItem();

    const inputRef = ref<HTMLElement>();
    const triggerRef = ref<HTMLElement>();
    const selectTagInputRef = ref<SelectTagInputType>();
    const optionsMap = ref<Map<string, OptionInstanceType>>(new Map());
    const options = computed(() => [...optionsMap.value.values()]);
    const groupsMap = ref<Map<string, GroupInstanceType>>(new Map());
    const selected = ref<ISelected[]>([]);
    const activeOptionValue = ref<any>(); // 当前悬浮的option

    watch(modelValue, () => {
      handleSetSelectedData();
    }, { deep: true });

    // select组件是否禁用
    const isDisabled = computed(() => disabled.value || loading.value);
    // modelValue对应的label
    const selectedLabel = computed(() => selected.value.map(item => handleGetLabelByValue(item)));
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
    // 当前空状态时显示文案
    const curContentText = computed(() => {
      if (searchLoading.value) {
        return loadingText.value;
      }
      if (isOptionsEmpty.value) {
        return noDataText.value;
      }
      if (isSearchEmpty.value) {
        return noMatchText.value;
      }
      return '';
    });

    const { register, unregister } = useRegistry<OptionInstanceType>(optionsMap);
    const {
      register: registerGroup,
      unregister: unregisterGroup,
    } = useRegistry<GroupInstanceType>(groupsMap);
    const { isHover, setHover, cancelHover } = useHover();
    const isFocus = ref(false);
    const handleFocus = (e: FocusEvent) => {
      isFocus.value = true;
      emit('focus', e);
    };
    const handleBlur = () => {
      isFocus.value && emit('blur');
      isFocus.value = false;
    };

    const {
      popperWidth,
      isPopoverShow,
      hidePopover,
      showPopover,
      togglePopover,
    } = usePopover({ popoverMinWidth: popoverMinWidth.value }, triggerRef);
    // 输入框是否可以输入内容
    const isInput = computed(() => (filterable.value || allowCreate.value) && isPopoverShow.value);
    watch(isPopoverShow, (isShow) => {
      if (!isShow) {
        searchKey.value = '';
      } else {
        focus();
        initActiveOptionValue();
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
    const { searchKey, searchLoading } = useRemoteSearch(isRemoteSearch.value
      ? remoteMethod.value
      : defaultSearchMethod, initActiveOptionValue);

    // 派发change事件
    const emitChange = (val: string | string[]) => {
      if (val === modelValue.value) return;

      emit('change', val, modelValue.value);
      emit('update:modelValue', val, modelValue.value);
      formItem?.validate?.('change');
    };
    // 派发toggle事件
    const handleTogglePopover = () => {
      if (isDisabled.value) return;
      togglePopover();
      emit('toggle', isPopoverShow.value);
    };
    // 搜索
    const handleInputChange = (value) => {
      if (!filterable.value) return;
      searchKey.value = value;
    };
    // allow create
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
      focus();
    };
    // 聚焦输入框
    const focus = () => {
      if (multipleMode.value === 'tag') {
        selectTagInputRef.value?.focus();
      } else {
        inputRef.value?.focus();
      }
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
      focus();
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
      const index = selected.value.findIndex(item => item.value === val);
      if (index > -1) {
        selected.value.splice(index, 1);
        emitChange(selected.value.map(item => item.value));
      }
    };
    // options存在 > 上一次选择的label > 当前值
    const handleGetLabelByValue = (item: ISelected) => optionsMap.value?.get(item.value)?.label
    || item.label || item.value;
    // 设置selected选项
    const handleSetSelectedData = () => {
      // 同步内部value值
      if (Array.isArray(modelValue.value)) {
        selected.value = [...(modelValue.value as string[]).map(value => ({
          value,
          label: value,
        }))];
      } else if (modelValue.value !== undefined) {
        selected.value = [{
          value: modelValue.value,
          label: modelValue.value,
        }];
      }
    };
    // 处理键盘事件
    const handleKeydown = (e: any) => {
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
          if (!multiple.value || !selected.value.length || searchKey.value.length) return; // 只有多选支持回退键删除

          selected.value.pop();
          emitChange(selected.value.map(item => item.value));
          break;
        }
        // 选择选项
        case 'Enter': {
          if (!isPopoverShow.value) {
            isPopoverShow.value = true;
          } else {
            const option = optionsMap.value.get(activeOptionValue.value);
            handleOptionSelected(option);
          }
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
      selectTagInputRef,
      searchLoading,
      isOptionsEmpty,
      isSearchEmpty,
      isFocus,
      isShowSelectContent,
      curContentText,
      isGroup,
      searchKey,
      setHover,
      cancelHover,
      handleFocus,
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
    };
  },
  render() {
    const selectClass = classes({
      'bk-select': true,
      'popover-show': this.isPopoverShow,
      'is-disabled': this.isDisabled,
      'is-focus': this.isFocus,
      'is-filterable': this.filterable,
      [this.size]: true,
      [this.behavior]: true,
    });
    const basePopoverOptions: Partial<PopoverPropTypes> = {
      theme: 'light bk-select-popover',
      trigger: 'manual',
      width: this.popperWidth,
      arrow: false,
      placement: 'bottom',
      isShow: this.isPopoverShow,
    };
    const popoverOptions: Partial<PopoverPropTypes> = merge(basePopoverOptions, this.popoverOptions);

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
            placeholder={this.placeholder}
            filterable={this.isInput}
            onFocus={this.handleFocus}
            onRemove={this.handleDeleteTag}
            onEnter={this.handleInputEnter}>
              {{
                prefix: () => this.$slots.prefix?.(),
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
          placeholder={this.isInput ? (this.selectedLabel.join(',') || this.placeholder) : this.placeholder}
          readonly={!this.isInput}
          selectReadonly={true}
          disabled={this.isDisabled}
          behavior={this.behavior}
          size={this.size}
          onFocus={this.handleFocus}
          onInput={this.handleInputChange}
          onEnter={this.handleInputEnter}
          onKeydown={(_, e) => this.handleKeydown(e)}>
            {{
              prefix: () => this.$slots.prefix?.(),
              suffix: () => suffixIcon(),
            }}
        </Input>
      );
    };
    const renderSelectTrigger = () => (
        <div
          class="bk-select-trigger"
          ref="triggerRef"
          onClick={this.handleTogglePopover}
          onMouseenter={this.setHover}
          onMouseleave={this.cancelHover}
          onKeydown={this.handleKeydown}>
          {renderTriggerInput()}
        </div>
    );
    const renderSelectContent = () => (
        <div class="bk-select-content">
          {
            !this.isShowSelectContent
            && (
            <div class="bk-select-empty">
              {
                this.searchLoading
                && <Loading class="mr5" theme='primary' loading={true} mode="spin" size="mini"></Loading>
              }
              <span>{this.curContentText}</span>
            </div>)
          }
          <div class="bk-select-content">
            <div class="bk-select-dropdown"
              style={{ maxHeight: `${this.scrollHeight}px` }}
              onScroll={this.handleScroll}
            >
              <ul class="bk-select-options" v-show={this.isShowSelectContent}>
                {
                  this.multiple
                    && this.showSelectAll
                    && (!this.searchKey || !this.filterable)
                    && <li class="bk-select-option"
                      onMouseenter={this.handleSelectedAllOptionMouseEnter}
                      onClick={this.handleToggleAll}>
                      {this.selectAllText}
                      </li>
                }
                {this.list.map(item => <Option value={item[this.idKey]} label={item[this.displayKey]}></Option>)}
                {this.$slots.default?.()}
                {this.scrollLoading && (
                  <li class="bk-select-options-loading">
                    <Loading class="spinner mr5" theme='primary' loading={true} mode="spin" size="mini"></Loading>
                    <span>{this.loadingText}</span>
                  </li>
                )}
              </ul>
            </div>
            {this.$slots.extension
              && (<div class="bk-select-extension">{this.$slots.extension()}</div>)}
          </div>
        </div>
    );
    return (
      <div class={selectClass}>
        <BKPopover {...popoverOptions} onClickoutside={this.handleClickOutside}>
          {{
            default: () => renderSelectTrigger(),
            content: () => renderSelectContent(),
          }}
        </BKPopover>
      </div>
    );
  },
});
