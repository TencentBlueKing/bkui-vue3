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
  unref,
  watch,
} from 'vue';

import { clickoutside } from '@bkui-vue/directives';
import { AngleUp, Close } from '@bkui-vue/icon';
import Loading from '@bkui-vue/loading';
import BKPopover from '@bkui-vue/popover';
import { classes, PropTypes } from '@bkui-vue/shared';
import Tag from '@bkui-vue/tag';

import {
  selectKey,
  toLowerCase,
  useFocus,
  useHover,
  usePopover,
  useRegistry,
  useRemoteSearch,
} from './common';
import { GroupInstanceType, ISelectState, OptionInstanceType } from './type';

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
  },
  emits: ['update:modelValue', 'change', 'toggle', 'clear', 'scroll-end'],
  setup(props, { emit }) {
    const {
      modelValue,
      disabled,
      filterable,
      placeholder,
      multiple,
      remoteMethod,
      loading,
      loadingText,
      noDataText,
      noMatchText,
      popoverMinWidth,
      showOnInit,
    } = toRefs(props);

    const states = reactive<ISelectState>({
      currentPlaceholder: placeholder.value, // 当前placeholder（搜索的时候显示当前值）
      selectedOptions: new Set(), // 已选择Option组件
      currentSelectedLabel: '', // 当前需要展示的Label（搜索的时候为空，非搜索时等于selectedLabel）
    });
    const inputRef = ref<HTMLElement>();
    const popoverRef = ref<any>();
    const options = ref<Set<OptionInstanceType>>(new Set());
    const groups = ref<Set<GroupInstanceType>>(new Set());

    // select组件是否禁用
    const isDisabled = computed(() => disabled.value || loading.value);
    // 选中Option的label
    const selectedLabel = computed(() => [...states.selectedOptions.values()]
      .map(option => option.label));
    // 是否全选
    const isAllSelected = computed(() => [...options.value.values()].filter(option => !option.disabled)
      .every(option => states.selectedOptions.has(option)));
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
    const isRemoteSearch = computed(() => typeof remoteMethod.value === 'function');
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

    // 默认搜索方法
    const defaultSearchMethod = (value) => {
      options.value.forEach((option) => {
        option.visible = toLowerCase(String(option.label))?.includes(toLowerCase(value));
      });
    };
    const { searchKey, searchLoading } = useRemoteSearch(isRemoteSearch.value
      ? remoteMethod.value
      : defaultSearchMethod);
    // todo: 重置状态（搜索状态、当前placeholder和selectLabel状态）
    const handleResetInputValue = () => {
      const label = selectedLabel.value.join(',');
      if (filterable.value && isPopoverShow.value) {
        states.currentPlaceholder = label || placeholder.value;
        states.currentSelectedLabel = '';
      } else {
        states.currentPlaceholder = placeholder.value;
        states.currentSelectedLabel = label;
        searchKey.value = '';
      }
    };
    watch(isPopoverShow, () => {
      handleResetInputValue();
    });

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
    // 处理input事件（搜索值）
    const handleInput = (e) => {
      searchKey.value = e.target.value;
    };
    const selectedCallback = () => {
      // 每次选择Option后，重新聚焦输入框
      inputRef.value.focus();
      popoverRef.value.update();
      !searchKey.value && handleResetInputValue();
    };
    // Option点击事件
    const handleOptionSelected = (option: OptionInstanceType) => {
      if (isDisabled.value || !option) return;

      if (multiple.value) {
        if (states.selectedOptions.has(option)) {
          states.selectedOptions.delete(option);
        } else {
          states.selectedOptions.add(option);
        }
        emitChange([...states.selectedOptions.values()].map(option => option.value));
      } else {
        states.selectedOptions.clear();
        states.selectedOptions.add(option);
        emitChange(option.value);
        hidePopover();
      }
      selectedCallback();
    };
    // 清空事件
    const handleClear = (e: Event) => {
      e.stopPropagation();
      states.selectedOptions.clear();
      hidePopover();
      handleResetInputValue();
      emitChange(multiple.value ? [] : '');
      emit('clear', multiple.value ? [] : '');
    };
    // 全选/取消权限
    const handleToggleAll = () => {
      if (isAllSelected.value) {
        states.selectedOptions.clear();
      } else {
        options.value.forEach((option) => {
          if (option.disabled || states.selectedOptions.has(option)) return;
          states.selectedOptions.add(option);
        });
      }
      selectedCallback();
      emitChange([...states.selectedOptions.values()].map(option => option.value));
    };
    // 滚动事件
    const handleScroll = (e) => {
      const { scrollTop, clientHeight, scrollHeight } = e.target;
      if (scrollTop + clientHeight === scrollHeight) {
        emit('scroll-end');
      }
    };
    const handleClickOutside = () => {
      hidePopover();
      handleBlur();
    };

    provide(selectKey, reactive({
      props,
      selectedOptions: unref(states.selectedOptions),
      register,
      unregister,
      registerGroup,
      unregisterGroup,
      handleOptionSelected,
    }));

    onMounted(() => {
      const initializeValue: any[] = Array.isArray(modelValue.value) ? modelValue.value : [modelValue.value];
      options.value.forEach((option) => {
        if (initializeValue.includes(option.value)) {
          states.selectedOptions.add(option);
        }
      });
      handleResetInputValue();
      setTimeout(() => {
        // todo：popover组件渲染问题，暂时用setTimeout
        showOnInit.value && showPopover();
      });
    });

    return {
      ...toRefs(states),
      options,
      isDisabled,
      selectedLabel,
      isPopoverShow,
      isHover,
      popperWidth,
      popoverRef,
      inputRef,
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
      handleInput,
      handleTogglePopover,
      handleClear,
      onPopoverFirstUpdate,
      hidePopover,
      showPopover,
      handleToggleAll,
      handleOptionSelected,
      handleClickOutside,
      handleScroll,
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
    const renderSelectTrigger = () => {
      const suffixIcon = () => {
        if (this.loading) {
          return <Loading loading={true} class="spinner" mode="spin" size="mini"></Loading>;
        } if (this.clearable && this.isHover) {
          return <Close class="clear-icon" onClick={this.handleClear}></Close>;
        }
        return <AngleUp class="angle-up"></AngleUp>;
      };
      const renderTriggerInput = () => {
        if (this.multipleMode === 'tag') {
          return (
            <div class="bk-select-tag">
              {
                [...this.selectedOptions.values()]
                  .map(option => (
                    <Tag
                      closable
                      style={{ marginTop: '3px' }}
                      theme={this.tagTheme}
                      onClose={() => this.handleOptionSelected(option)}>
                      {option.label}
                    </Tag>
                  ))
              }
              <input
                class="bk-select-tag-input"
                ref="inputRef"
                type="text"
                placeholder={!this.selectedOptions.size ? this.placeholder : ''}
                readonly={!this.filterable || !this.isPopoverShow}
                v-model={this.searchKey}
                onFocus={this.handleFocus}/>
            </div>
          );
        }
        return (
          <input
            ref="inputRef"
            type="text"
            class="bk-select-input"
            style={{
              paddingLeft: this.$slots.prefixIcon ? '20px' : '10px',
            }}
            v-model={this.currentSelectedLabel}
            placeholder={this.currentPlaceholder}
            readonly={!this.filterable || !this.isPopoverShow}
            onFocus={this.handleFocus}
            onInput={this.handleInput} />
        );
      };
      return (
        <div
          class="bk-select-trigger"
          onClick={this.handleTogglePopover}
          onMouseenter={this.setHover}
          onMouseleave={this.cancelHover}>
          {
            this.$slots.prefixIcon
              ? (<span class="bk-select-prefix">{this.$slots.prefixIcon?.()}</span>)
              : null
          }
          {renderTriggerInput()}
          {suffixIcon()}
        </div>
      );
    };
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
