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

import { computed, defineComponent, nextTick, ref, toRefs, watch } from 'vue';
import { array } from 'vue-types';

import { bkTooltips } from '@bkui-vue/directives';
import { AngleUp, Close, Error } from '@bkui-vue/icon';
import BkPopover from '@bkui-vue/popover';
import { debounce, PropTypes, resolveClassName } from '@bkui-vue/shared';
import Tag from '@bkui-vue/tag';

import { useHover } from '../../select/src/common';
import { useTagsOverflow } from '../../tag-input/src/common';

import CascaderPanel from './cascader-panel';
import { INode } from './interface';
import Store from './store';

export default defineComponent({
  name: 'Cascader',
  directives: {
    bkTooltips,
  },
  components: {
    CascaderPanel,
    BkPopover,
    Tag,
  },
  props: {
    modelValue: PropTypes.arrayOf(PropTypes.oneOfType([array<string>(), String, Number])),
    list: PropTypes.array.def([]),
    placeholder: PropTypes.string.def('请选择'),
    behavior: PropTypes.string.def('normal'),
    filterable: PropTypes.bool.def(false),
    multiple: PropTypes.bool.def(false),
    disabled: PropTypes.bool.def(false),
    clearable: PropTypes.bool.def(true),
    trigger: PropTypes.string.def('click'),
    checkAnyLevel: PropTypes.bool.def(false),
    isRemote: PropTypes.bool.def(false),
    remoteMethod: PropTypes.func,
    showCompleteName: PropTypes.bool.def(true),
    idKey: PropTypes.string.def('id'),
    nameKey: PropTypes.string.def('name'),
    childrenKey: PropTypes.string.def('children'),
    separator: PropTypes.string.def('/'),
    limitOneLine: PropTypes.bool.def(false),
    extCls: PropTypes.string.def(''),
    scrollHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(216),
    scrollWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def('auto'),
    collapseTags: {
      type: Boolean,
      default: true,
    },
    floatMode: {   // 当floatMode为true时为漂浮模式,不会挤占空间
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'change', 'clear', 'toggle', 'focus'],
  setup(props, { emit }) {
    const { separator, multiple } = props;
    const { isHover, setHover, cancelHover } = useHover();
    const store = ref(new Store(props));
    const selectedText = ref<string | number>('');
    const selectedTags = ref([]);
    const { modelValue } = toRefs(props);
    const cascaderPanel = ref();
    const searchKey = ref<string | number>('');  // 支持搜索时，搜索框绑定变量
    const suggestions = ref([]); // 搜索功能打开时，面板给出的列表
    const isFiltering = ref(false); // 是否正在搜索，过滤
    const isEdit = ref(false);
    const isFocus = ref(false);

    const checkedValue = computed({
      get: () => modelValue.value,
      set: (value: Array<string | number | string[]>) => {
        emit('update:modelValue', value);
      },
    });

    const popover = ref(null);
    const bkCascaderRef = ref(null);
    const inputRef = ref(null);

    /** 根据配置，获取输入框显示的text */
    const getShowText = (node: INode) =>  (props.showCompleteName
      ? node.pathNames.join(separator)
      : node.pathNames[node.pathNames.length - 1]);

    /** 更新搜索框的值 */
    const updateSearchKey = () => {
      searchKey.value = selectedText.value;
    };

    /** 更新选中 */
    const updateValue = (val: Array<string | number | string[]>) => {
      /** 根据配置更新显示内容 */
      if (multiple) {
        store.value.setNodesCheck(val as Array<string[]>);
        selectedTags.value = store.value.getCheckedNodes().map((node: INode) => ({
          text: getShowText(node),
          key: node.id,
        }));
        selectedText.value = selectedTags.value.map(item => item.text).join(', ');
        return;
      }

      /** 根据val的值，设置selectedText显示内容 */
      !props.checkAnyLevel && popover?.value?.hide(); // 非多选，选中后，关闭popover
      if (val.length === 0) {
        selectedText.value = '';
      } else {
        const node = store.value.getNodeByValue(val);
        if (!node) return;
        selectedText.value = getShowText(node);
      }
      updateSearchKey();
    };

    /** 清空所选内容，要stopPropagation防止触发下拉 */
    const handleClear = (e: Event) => {
      e.stopPropagation();
      store.value.clearChecked();
      searchKey.value = '';
      updateValue([]);
      emit('update:modelValue', []);
      emit('clear', JSON.parse(JSON.stringify(props.modelValue)));
    };

    const removeTag = (value, index, e) => {
      e.stopPropagation();
      const current = JSON.parse(JSON.stringify(value));
      const tag = current.splice(index, 1)[0];
      isEdit.value = true; // 删除时也在编辑态，触发overflowTagIndex的计算
      store.value.removeTag(tag);
      updateValue(current);
      emit('update:modelValue', store.value.getCheckedNodes().map((node: INode) => node.path));
      // 计算过后，关闭编辑状态
      setTimeout(() => {
        isEdit.value = isFocus.value;
      });
    };

    const modelValueChangeHandler = (value, oldValue) => {
      updateValue(value);
      /** 派发相关事件 */
      emit('update:modelValue', value);
      oldValue !== undefined && emit('change', value); // oldValue = undefined代表初始化，init不派发change事件
      // 如果有过滤搜索，选择后，自动focus到input
      inputRef?.value?.focus();
    };

    const listChangeHandler = () => {
      store.value = new Store(props);
      updateValue(props.modelValue);
    };

    const popoverChangeEmitter = (val) => {
      emit('toggle', val.isShow);

      isEdit.value = val.isShow;

      // popover激活后，focus相应事件
      isFocus.value = val.isShow;
      nextTick(() => {
        val && inputRef.value?.focus();
      });


      val.isShow && focusEmitter(); // 面板打开，触发focus事件
      /** 面板收起，搜索状态关闭 */
      if (!val.isShow) {
        isFiltering.value = false;
      }
    };

    const searchInputHandler = debounce(200, (e: InputEvent) => {
      const target = e.target as HTMLInputElement;
      searchKey.value = target.value;
      if (searchKey.value === '') {
        isFiltering.value = false;
        return;
      }
      isFiltering.value = true;
      const targetNodes = store.value.getFlattedNodes().filter((node) => {
        if (props.checkAnyLevel) {
          return node.pathNames.join(props.separator).includes(searchKey.value);
        }
        return node.isLeaf && node.pathNames.join(props.separator).includes(searchKey.value);
      });
      suggestions.value = targetNodes;
      !popover?.value.isShow && popover?.value.show();
    });

    const focusEmitter = () => {
      emit('focus');
    };

    watch(
      () => props.modelValue,
      modelValueChangeHandler, { immediate: true },
    );

    watch(
      () => props.list,
      listChangeHandler,
      { deep: true, immediate: true },
    );

    /**
     * 折叠tag(collapseTags)相关逻辑
     * @params tagList: string 多选tag的name合集;
     * @params isCollapse: boolean 是否折叠，当外部传入collapseTags参数且下拉面板打开时，才显示所有tags
     */
    const tagList = computed(() => selectedTags.value.map(item => item.text));
    const isCollapse = computed(() => (props.collapseTags ? props.collapseTags && isFocus.value
      : props.collapseTags));
    const isEditMode = computed(() => (props.collapseTags ? props.collapseTags && isEdit.value
      : props.collapseTags));

    const { overflowTagIndex } = useTagsOverflow(bkCascaderRef, isEditMode, tagList);
    return {
      bkCascaderRef,
      inputRef,
      overflowTagIndex,
      isCollapse,
      isFocus,
      store,
      updateValue,
      selectedText,
      checkedValue,
      handleClear,
      isHover,
      setHover,
      popover,
      cancelHover,
      selectedTags,
      removeTag,
      cascaderPanel,
      popoverChangeEmitter,
      searchKey,
      suggestions,
      isFiltering,
      searchInputHandler,
      focusEmitter,
      tagList,
      isEdit,
    };
  },
  render() {
    const suffixIcon = () => {
      if (this.clearable && this.isHover && !this.disabled) {
        return <Close class={resolveClassName('icon-clear-icon')}
          onClick={this.handleClear}></Close>;
      }
      return <AngleUp class={resolveClassName('icon-angle-up')}></AngleUp>;
    };

    // 因为cascader的tag长短不一，在计算时如果overflowIndex为0，会出现直接+n渲染的情况，因此需要对其进行修正
    this.overflowTagIndex = this.overflowTagIndex === 0 ? 1 : this.overflowTagIndex;

    const collapseTooltip = this.tagList.reduce((acc, cur, curIndex) => {
      if (this.overflowTagIndex !== null && curIndex >= this.overflowTagIndex) {
        acc.push(cur);
      }
      return acc;
    }, []);

    const renderTags = () => {
      if (this.limitOneLine) {
        return <span class="cascader-selected-text">{this.selectedText}</span>;
      }
      return <div class="cascader-tag-list">
        {this.tagList.map((tag, index) => {
          const isOverflow = !this.isCollapse && this.overflowTagIndex !== null && index >= this.overflowTagIndex;
          return (
            <span class="tag-item" style={{ display: isOverflow ? 'none' : '' }} key={tag}>
              <span class="tag-item-name">{tag}</span>
              <Error class={resolveClassName('icon-clear-icon')}
                onClick={(e: Event) => {
                  e.stopPropagation();
                  this.removeTag(this.modelValue, index, e);
                }}></Error>
            </span>
          );
        })}
        {

          this.overflowTagIndex !== null && !this.isCollapse && (
            <Tag style="margin-top: 0" v-bk-tooltips={collapseTooltip.join(', ')}>+{this.selectedTags.length - this.overflowTagIndex}</Tag>
          )
        }
      </div>;
    };

    const textRender = () => (
      // 多选时， text被tagRender填充，不需要进行text渲染
      this.multiple ? null :  <span>{this.selectedText}</span>
    );

    return (
      <div class={[resolveClassName('cascader-wrapper'), this.floatMode ? 'float-mode' : '']}>
        <div class={[resolveClassName('cascader'), this.extCls, {
          'is-unselected': this.modelValue.length === 0,
          'is-hover': this.isHover,
          'is-filterable': this.filterable,
          'is-focus': this.isFocus,
          'is-disabled': this.disabled,
          'is-simplicity': this.behavior === 'simplicity',
        }]}
          tabindex="0"
          data-placeholder={this.placeholder}
          onMouseenter={this.setHover}
          onMouseleave={this.cancelHover}
          ref="bkCascaderRef">
          {suffixIcon()}
          <BkPopover
            placement="bottom-start"
            theme={`light ${resolveClassName('cascader-popover')}`}
            trigger="click"
            arrow={false}
            disabled={this.disabled}
            class={resolveClassName('cascader-popover-wrapper')}
            ref="popover"
            onAfterHidden={this.popoverChangeEmitter}
            onAfterShow={this.popoverChangeEmitter}
            boundary="body">
            {{
              default: () => (
                <div class={[resolveClassName('cascader-name'), 'bk-scroll-y']}>
                  {this.multiple && this.selectedTags.length > 0 && renderTags()}
                  {this.filterable
                    ? (this.isCollapse || this.selectedTags.length === 0)
                    && <input class={[resolveClassName('cascader-search-input'), {
                      'is-disabled': this.disabled,
                    }]}
                        type="text"
                        onInput={this.searchInputHandler}
                        placeholder={this.placeholder}
                        value={this.searchKey}
                        disabled={this.disabled}
                        ref="inputRef"
                      />
                    : textRender()
                  }
                </div>
              ),
              content: () => (
                <div class={resolveClassName('cascader-popover')}>
                  <CascaderPanel
                    store={this.store}
                    ref="cascaderPanel"
                    width={this.scrollWidth}
                    height={this.scrollHeight}
                    search-key={this.searchKey}
                    separator={this.separator}
                    is-filtering={this.isFiltering}
                    suggestions={this.suggestions}
                    v-model={this.checkedValue}
                    v-slots={{
                      default: scope => (this.$slots.default
                        ? this.$slots.default(scope)
                        : <span class={resolveClassName('cascader-node-name')}>{scope.node.name}</span>),
                    }}>
                  </CascaderPanel>
                </div>
              ),
            }}
          </BkPopover>
        </div>
      </div>
    );
  },
});
