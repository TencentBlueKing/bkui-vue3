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
import BKPopover from '@bkui-vue/popover';
import { classes, PropTypes } from '@bkui-vue/shared';

import {
  selectKey,
  toLowerCase,
  useFocus,
  useHover,
  usePopover,
  useRegistry,
  useRemoteSearch,
} from './common';
import SelectTagInput from './selectTagInput';
import { GroupInstanceType, ISelectedData, OptionInstanceType, SelectTagInputType } from './type';

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
    showSelectAll: PropTypes.bool.def(false), // 权限
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
  },
  emits: ['update:modelValue', 'change', 'toggle', 'clear', 'scroll-end'],
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
    } = toRefs(props);

    const inputRef = ref<HTMLElement>();
    const popoverRef = ref<any>();
    const selectTagInputRef = ref<SelectTagInputType>();
    const options = ref<Set<OptionInstanceType>>(new Set());
    const groups = ref<Set<GroupInstanceType>>(new Set());
    const selected = ref<ISelectedData[]>([]);

    // options对应的map结构（option组件的value不能相同）
    const optionsMap = computed(() => {
      const data: Map<any, OptionInstanceType> = new Map();
      options.value.forEach((option) => {
        data.set(option.value, option);
      });
      return data;
    });
    watch(modelValue, () => {
      handleSetSelectedData();
      // 修复tag模式下内容超出，popover没有更新问题
      if (multipleMode.value === 'tag') {
        popoverRef.value?.update();
      }
    });

    // select组件是否禁用
    const isDisabled = computed(() => disabled.value || loading.value);
    // modelValue对应的label
    const selectedLabel = computed(() => selected.value.map(data => data.label));
    // 是否全选(todo: 优化)
    const isAllSelected = computed(() => {
      const normalSelectedValues = [...options.value.values()].reduce<any[]>((pre, option) => {
        if (!option.disabled) {
          pre.push(option.value);
        }
        return pre;
      }, []);
      return (normalSelectedValues.length <= selected.value.length)
        && normalSelectedValues.every(val => selected.value.some(data => data.value === val));
    });
    // 是否含有分组
    const isGroup = computed(() => !!groups.value.size);
    // options是否为空
    const isOptionsEmpty = computed(() => !options.value.size);
    // 是否搜索为空
    const isSearchEmpty = computed(() => {
      const data = [...options.value.values()];
      return data.length && data.every(option => !option.visible);
    });
    // 是否远程搜索
    const isRemoteSearch = computed(() => filterable.value && typeof remoteMethod.value === 'function');
    // 是否显示select下拉内容
    const isShowSelectContent = computed(() => !(searchLoading.value || isOptionsEmpty.value || isSearchEmpty.value));
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

    const { register, unregister } = useRegistry<OptionInstanceType>(options);
    const {
      register: registerGroup,
      unregister: unregisterGroup,
    } = useRegistry<GroupInstanceType>(groups);
    const { isHover, setHover, cancelHover } = useHover();
    const { isFocus, handleFocus, handleBlur } = useFocus();

    const {
      popperWidth,
      isPopoverShow,
      onPopoverFirstUpdate,
      hidePopover,
      showPopover,
      togglePopover,
    } = usePopover({ popoverMinWidth: popoverMinWidth.value });
    // 输入框是否可以输入内容
    const isInput = computed(() => (filterable.value || allowCreate.value) && isPopoverShow.value);
    watch(isPopoverShow, (isShow) => {
      if (!isShow) {
        searchKey.value = '';
      } else {
        focus();
      }
    });

    // 默认搜索方法
    const defaultSearchMethod = (value) => {
      if (!filterable.value) return;
      options.value.forEach((option) => {
        option.visible = toLowerCase(String(option.label))?.includes(toLowerCase(value));
      });
    };
    const { searchKey, searchLoading } = useRemoteSearch(isRemoteSearch.value
      ? remoteMethod.value
      : defaultSearchMethod);

    // 派发change事件
    const emitChange = (val) => {
      if (val === modelValue.value) return;

      emit('change', val);
      emit('update:modelValue', val);
    };
    // 派发toggle事件
    const handleTogglePopover = () => {
      if (isDisabled.value) return;
      togglePopover();
      emit('toggle', isPopoverShow.value);
    };
    const handleInputChange = (value) => {
      if (!filterable.value) return;
      searchKey.value = value;
    };
    const handleInputEnter = (value) => {
      if (!allowCreate.value) return;

      searchKey.value = '';
      const data = selected.value.find(data => data.value === value);
      if (data) return;

      if (multiple.value) {
        selected.value.push({
          label: value,
          value,
        });
        emitChange(selected.value.map(data => data.value));
      } else {
        selected.value = [{
          label: value,
          value,
        }];
        emitChange(value);
        hidePopover();
      }
    };
    // Option点击事件
    const handleOptionSelected = (option: OptionInstanceType) => {
      if (isDisabled.value || !option) return;

      if (multiple.value) {
        // 多选
        const index = selected.value.findIndex(data => data.value === option.value);
        if (index > -1) {
          selected.value.splice(index, 1);
        } else {
          selected.value.push({
            label: option.label,
            value: option.value,
          });
        }
        emitChange(selected.value.map(data => data.value));
      } else {
        // 单选
        selected.value = [{
          label: option.label,
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
    const handleToggleAll = () => {
      if (isAllSelected.value) {
        selected.value = [];
      } else {
        options.value.forEach((option) => {
          if (option.disabled || selected.value.find(data => data.value === option.value)) return;
          selected.value.push({
            label: option.label,
            value: option.value,
          });
        });
      }
      emitChange(selected.value.map(data => data.value));
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
    const handleDeleteTag = (data: ISelectedData) => {
      const index = selected.value.findIndex(select => select.value === data.value);
      if (index > -1) {
        selected.value.splice(index, 1);
        emitChange(selected.value.map(select => select.value));
      }
    };
    // options存在 > 上一次选择的label > 当前值
    const handleGetLabelByValue = val => optionsMap.value?.get(val)?.label
        || selected.value.find(data => data.value === val)?.label
        || val;
    // 设置selected选项
    const handleSetSelectedData = () => {
      // 同步内部value值
      if (Array.isArray(modelValue.value)) {
        selected.value = modelValue.value.map(val => ({
          label: handleGetLabelByValue(val),
          value: val,
        }));
      } else if (modelValue.value !== undefined) {
        selected.value = [{
          label: handleGetLabelByValue(modelValue.value),
          value: modelValue.value,
        }];
      }
    };
    const handleClickOutside = () => {
      hidePopover();
      handleBlur();
    };

    provide(selectKey, reactive({
      multiple,
      selected,
      register,
      unregister,
      registerGroup,
      unregisterGroup,
      handleOptionSelected,
    }));

    onMounted(() => {
      handleSetSelectedData();
      setTimeout(() => {
        // todo：popover组件渲染问题，暂时用setTimeout
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
      popoverRef,
      inputRef,
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
      onPopoverFirstUpdate,
      hidePopover,
      showPopover,
      handleToggleAll,
      handleOptionSelected,
      handleClickOutside,
      handleScroll,
      handleDeleteTag,
      handleInputChange,
      handleInputEnter,
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
    const modifiers = [
      {
        name: 'offset',
        options: {
          offset: [0, 4],
        },
      },
    ];

    const suffixIcon = () => {
      if (this.loading) {
        return <Loading loading={true} class="spinner" mode="spin" size="mini"></Loading>;
      } if (this.clearable && this.isHover && this.selected.length) {
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
          disabled={this.isDisabled}
          behavior={this.behavior}
          size={this.size}
          onFocus={this.handleFocus}
          onInput={this.handleInputChange}
          onEnter={this.handleInputEnter}>
            {{
              prefix: () => this.$slots.prefixIcon?.(),
              suffix: () => suffixIcon(),
            }}
        </Input>
      );
    };
    const renderSelectTrigger = () => (
        <div
          class="bk-select-trigger"
          onClick={this.handleTogglePopover}
          onMouseenter={this.setHover}
          onMouseleave={this.cancelHover}>
          {renderTriggerInput()}
        </div>
    );
    const renderSelectContent = () => (
        <div>
          {
          (!this.isShowSelectContent) && (
          <div class="bk-select-empty">
            {this.searchLoading
            && <Loading class="mr5" loading={true} mode="spin" size="mini"></Loading>}
            {this.curContentText}
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
                    && !this.searchKey
                    && <li class="bk-select-option" onClick={this.handleToggleAll}>
                      {this.selectAllText}
                      </li>
                }
                {this.$slots.default?.()}
                {this.scrollLoading && (
                  <li class="bk-select-options-loading">
                    <Loading class="spinner mr5" theme='primary' loading={true} mode="spin" size="mini"></Loading>
                    {this.loadingText}
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
      <div class={selectClass} v-clickoutside={this.handleClickOutside}>
        <BKPopover
          ref="popoverRef"
          theme="light"
          trigger="manual"
          width={this.popperWidth}
          arrow={false}
          placement="bottom"
          isShow={this.isPopoverShow}
          modifiers={modifiers}
          handleFirstUpdate={this.onPopoverFirstUpdate}>
          {{
            default: () => renderSelectTrigger(),
            content: () => renderSelectContent(),
          }}
        </BKPopover>
      </div>
    );
  },
});
