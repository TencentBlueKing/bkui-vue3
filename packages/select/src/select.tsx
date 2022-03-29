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

import { PropTypes, OnFirstUpdateFnType } from '@bkui-vue/shared';
import BKPopover from '@bkui-vue/popover';
import { defineComponent, toRefs, computed, ref, provide, reactive, watch, unref, onMounted, watchEffect } from 'vue';
import useDebouncedRef, { useFocus, selectKey, OptionInstanceType, useHover, ISelectState } from './common';
import { clickoutside } from '@bkui-vue/directives';
import { AngleUp, Close, Spinner } from '@bkui-vue/icon';

export default defineComponent({
  name: 'Select',
  directives: {
    clickoutside,
  },
  props: {
    modelValue: PropTypes.any,
    multiple: PropTypes.bool.def(false),
    placeholder: PropTypes.string.def('请选择'),
    disabled: PropTypes.bool.def(false),
    size: PropTypes.size().def('small'),
    clearable: PropTypes.bool.def(true),
    loading: PropTypes.bool.def(false),
    filterable: PropTypes.bool.def(false),
    remoteMethod: PropTypes.func,
    scrollHeight: PropTypes.number.def(216),
  },
  emits: ['update:modelValue', 'change', 'toggle'],
  setup(props, { emit }) {
    const {
      modelValue,
      disabled,
      size,
      filterable,
      placeholder,
      multiple,
      remoteMethod,
      loading,
    } = toRefs(props);

    const states = reactive<ISelectState>({
      currentPlaceholder: placeholder.value, // 当前placeholder（搜索的时候显示之前的值）
      options: new Set(), // Option组件
      selectedOptions: new Set(), // 已选择Option组件
      currentSelectedLabel: '', // 当前需要展示的Label（搜索的时候为空，非搜索时等于selectedLabel）
    });
    const selectTriggerRef = ref<HTMLElement>();
    const inputRef = ref<HTMLElement>();
    // 注册Option
    const register = (option: OptionInstanceType) => {
      if (!option) return;
      return states.options.add(option);
    };
    // 删除Option
    const unregister = (option: OptionInstanceType) => states.options.delete(option);

    const { isHover, setHover, cancelHover } = useHover();
    const { isFocus, handleFocus, handleBlur } = useFocus();
    const handleInput = (e) => {
      searchKey.value = e.target.value;
    };
    // select组件是否禁用
    const isDisabled = computed(() => disabled.value || loading.value);
    const selectClass = computed(() => ({
      'bk-select': true,
      'popover-show': isPopoverShow.value,
      'is-disabled': isDisabled.value,
      'is-focus': isFocus.value,
      [size.value]: true,
    }));
    // 缓存选中Option的label
    const selectedLabel = computed<string>(() => [...states.selectedOptions.values()].map(option => option.label).join(','));

    const popperWidth = ref<string | number>('auto');
    // 初始化PopoverWidth
    const onPopoverFirstUpdate: OnFirstUpdateFnType = (instance) => {
      const { reference } = instance.elements;
      popperWidth.value = (reference as HTMLElement).offsetWidth;
    };
    const isPopoverShow = ref(false);
    const toggleMenu = () => {
      if (isDisabled.value) return;
      isPopoverShow.value = !isPopoverShow.value;
      emit('toggle', isPopoverShow.value);
    };
    const hidePopover = () => {
      isPopoverShow.value = false;
      handleBlur();
    };
    const showPopover = () => {
      isPopoverShow.value = true;
    };
    watch(isPopoverShow, () => {
      handleResetState();
    });
    // 重置状态（搜索状态、当前placeholder和selectLabel状态）
    const handleResetState = () => {
      if (!isRemoteSearch.value || (isRemoteSearch.value && !isPopoverShow.value)) {
        searchKey.value = '';
      }

      if (filterable.value && isPopoverShow.value) {
        states.currentPlaceholder = selectedLabel.value || placeholder.value;
        states.currentSelectedLabel = '';
      } else {
        states.currentPlaceholder = placeholder.value;
        states.currentSelectedLabel = selectedLabel.value;
      }
    };

    // 派发change事件
    const emitChange = (val) => {
      if (val === modelValue.value) return;

      emit('change', val);
      emit('update:modelValue', val);
    };
    // Option选择回调
    const handleOptionSelected = (option: OptionInstanceType) => {
      if (isDisabled.value) return;

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
      // 每次选择Option后，重新聚焦输入框
      inputRef.value.focus();
      handleResetState();
    };
    // 请求select值
    const handleClear = (e: Event) => {
      e.stopPropagation();
      states.selectedOptions.clear();
      emitChange(multiple.value ? [] : '');
      hidePopover();
      handleResetState();
    };
    // 搜索值（在输入时动态设置）
    const searchKey = useDebouncedRef<string>('');
    const isRemoteSearch = computed(() => typeof remoteMethod.value === 'function');
    const searchLoading = ref(false);
    // 远程搜索
    watchEffect(async () => {
      if (!isRemoteSearch.value || !isPopoverShow.value || !searchKey.value) return;
      try {
        searchLoading.value = true;
        await remoteMethod.value(searchKey.value);
      } catch (e) {
        console.error(e);
      } finally {
        searchLoading.value = false;
      }
    });
    const isEmpty = computed(() => [...states.options.values()].every(option => !option.visible));

    provide(selectKey, reactive({
      props,
      searchKey,
      selectedOptions: unref(states.selectedOptions),
      isRemoteSearch,
      register,
      unregister,
      handleOptionSelected,
    }));

    onMounted(() => {
      const initializeValue: any[] = Array.isArray(modelValue.value) ? modelValue.value : [modelValue.value];
      states.options.forEach((option) => {
        if (initializeValue.includes(option.value)) {
          states.selectedOptions.add(option);
        }
      });
      handleResetState();
    });

    return {
      ...toRefs(states),
      selectedLabel,
      selectClass,
      isPopoverShow,
      isHover,
      popperWidth,
      selectTriggerRef,
      inputRef,
      searchKey,
      searchLoading,
      isEmpty,
      isFocus,
      setHover,
      cancelHover,
      handleFocus,
      handleInput,
      toggleMenu,
      handleClear,
      onPopoverFirstUpdate,
      hidePopover,
      showPopover,
    };
  },
  render() {
    const modifiers = [
      {
        name: 'offset',
        options: {
          offset: [0, 4],
        },
      },
    ];
    const renderSelectRightIcon = () => {
      if (this.loading) {
        return <Spinner class="spinner"></Spinner>;
      } if (this.clearable && this.isHover) {
        return <Close class="clear-icon" onClick={this.handleClear}></Close>;
      }
      return <AngleUp class="angle-up"></AngleUp>;
    };
    const renderEmptySelect = () => {
      if (this.searchLoading) {
        return (
          <div class="bk-select-empty" v-show={this.searchLoading}>
            <Spinner class="spinner"></Spinner>
            加载中...
          </div>
        );
      } if (this.isEmpty) {
        return (
          <div class="bk-select-empty" v-show={this.isEmpty}>
            无匹配数据
          </div>
        );
      }
      return null;
    };
    const renderSelectContent = () => (
      <div>
        {renderEmptySelect()}
        <div class="bk-select-content" v-show={!this.searchLoading && !this.isEmpty}>
          <div class="bk-select-dropdown" style={{
            maxHeight: `${this.scrollHeight}px`,
          }}>
          <ul class="bk-select-options">
            {this.$slots.default?.()}
          </ul>
          </div>
          {
            this.$slots.extension ? (
              <div class="bk-select-extension">
                {this.$slots.extension()}
              </div>
            ) : null
          }
          </div>
      </div>
    );
    return (
      <div class={this.selectClass} v-clickoutside={this.hidePopover}>
        <BKPopover
          theme="light"
          trigger="manual"
          width={this.popperWidth}
          arrow={false}
          placement="bottom"
          isShow={this.isPopoverShow}
          modifiers={modifiers}
          handleFirstUpdate={this.onPopoverFirstUpdate}
        >
          {{
            default: () => (
              <div
                class="bk-select-trigger"
                ref="selectTriggerRef"
                onClick={this.toggleMenu}
                onMouseenter={this.setHover}
                onMouseleave={this.cancelHover}
              >
                {
                  this.$slots.prefixIcon ? (
                    <span class="bk-select-prefix">{this.$slots.prefixIcon?.()}</span>
                  ) : null
                }
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
                  onInput={this.handleInput}
                ></input>
                {renderSelectRightIcon()}
              </div>
            ),
            content: () => renderSelectContent(),
          }}
        </BKPopover>
      </div>
    );
  },
});
