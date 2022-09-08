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

import { computed, defineComponent, ref, toRefs, watch } from 'vue';

import { clickoutside } from '@bkui-vue/directives';
import { AngleUp, Close, Error } from '@bkui-vue/icon';
import BkPopover from '@bkui-vue/popover2';
import { debounce, PropTypes } from '@bkui-vue/shared';

import { useHover } from '../../select/src/common';

import CascaderPanel from './cascader-panel';
import { INode } from './interface';
import Store from './store';;

export default defineComponent({
  name: 'Cascader',
  directives: {
    clickoutside,
  },
  components: {
    CascaderPanel,
    BkPopover,
  },
  props: {
    modelValue: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number).def([]),
      PropTypes.arrayOf(PropTypes.string).def([])]),
    list: PropTypes.array.def([]),
    placeholder: PropTypes.string.def('请选择'),
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
  },
  emits: ['update:modelValue', 'change', 'clear', 'toggle'],
  setup(props, { emit }) {
    const { separator, multiple } = props;
    const { isHover, setHover, cancelHover } = useHover();
    const store = ref(new Store(props));
    const panelShow = ref(false);
    const selectedText = ref<string | number>('');
    const selectedTags = ref([]);
    const { modelValue } = toRefs(props);
    const cascaderPanel = ref();
    const searchKey = ref<string | number>('');  // 支持搜索时，搜索框绑定变量
    const suggestions = ref([]); // 搜索功能打开时，面板给出的列表
    const isFiltering = ref(false); // 是否正在搜索，过滤

    const checkedValue = computed({
      get: () => modelValue.value,
      set: (value: Array<string | number>) => {
        emit('update:modelValue', value);
      },
    });

    const popover = ref(null);

    /** 根据配置，获取输入框显示的text */
    const getShowText = (node: INode) =>  (props.showCompleteName
      ? node.pathNames.join(separator)
      : node.pathNames[node.pathNames.length - 1]);

    /** 更新搜索框的值 */
    const updateSearchKey = () => {
      searchKey.value = selectedText.value;
    };

    /** 更新选中 */
    const updateValue = (val: Array<string | number>) => {
      /** 根据配置更新显示内容 */
      if (multiple) {
        selectedTags.value = store.value.getCheckedNodes().map((node: INode) => ({
          text: getShowText(node),
          key: node.id,
        }));
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
      updateValue([]);
      emit('update:modelValue', []);
      emit('clear', JSON.parse(JSON.stringify(props.modelValue)));
    };

    const removeTag = (value, index, e) => {
      e.stopPropagation();
      const current = JSON.parse(JSON.stringify(value));
      current.splice(index, 1);
      updateValue(current);
    };

    const modelValueChangeHandler = (value, oldValue) => {
      updateValue(value);
      /** 派发相关事件 */
      emit('update:modelValue', value);
      oldValue !== undefined && emit('change', value); // oldValue = undefined代表初始化，init不派发change事件
    };

    const listChangeHandler = () => {
      store.value = new Store(props);
      updateValue(props.modelValue);
    };

    const popoverChangeEmitter = (val) => {
      emit('toggle', val.isShow);
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

    watch(
      () => props.modelValue,
      modelValueChangeHandler, { immediate: true },
    );

    watch(
      () => props.list,
      listChangeHandler,
      { deep: true, immediate: true },
    );

    return {
      store,
      updateValue,
      panelShow,
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
    };
  },
  render() {
    const suffixIcon = () => {
      if (this.clearable && this.isHover) {
        return <Close class="bk-icon-clear-icon" onClick={this.handleClear}></Close>;
      }
      return <AngleUp class="bk-icon-angle-up"></AngleUp>;
    };

    const renderTags = () => {
      if (this.limitOneLine) {
        return <span>{this.selectedText}</span>;
      }
      return <div class="cascader-tag-list">
        {this.selectedTags.map((tag, index) => (
          <span class="cascader-tag-item">
            <span class="cascader-tag-item-name">{tag.text}</span>
            <Error class="bk-icon-clear-icon" onClick={(e: Event) => this.removeTag(this.modelValue, index, e)}></Error>
          </span>
        ))}
      </div>;
    };
    return (
      <div class={['bk-cascader', 'bk-cascader-wrapper', this.extCls, {
        'bk-is-show-panel': this.panelShow,
        'is-unselected': this.modelValue.length === 0,
        'is-hover': this.isHover,
        'is-filterable': this.filterable,
      }]}
        tabindex="0"
        data-placeholder={this.placeholder}
        onMouseenter={this.setHover}
        onMouseleave={this.cancelHover}>
        {suffixIcon()}
        <BkPopover
          placement="bottom-start"
          theme="light bk-cascader-popover"
          trigger="click"
          arrow={false}
          class="bk-cascader-popover-wrapper"
          ref="popover"
          onAfterHidden={this.popoverChangeEmitter}
          onAfterShow={this.popoverChangeEmitter}
          boundary="body">
          {{
            default: () => (
              <div class="bk-cascader-name">
                {this.multiple && renderTags()}
                {this.filterable
                  ? <input class="bk-cascader-search-input"
                    type="text"
                    onInput={this.searchInputHandler}
                    placeholder={this.placeholder}
                    value={this.searchKey}
                  />
                  : <span>{this.selectedText}</span>
                }
              </div>
            ),
            content: () => (
              <div class="bk-cascader-popover">
                <CascaderPanel
                  store={this.store}
                  ref="cascaderPanel"
                  width={this.scrollWidth}
                  height={this.scrollHeight}
                  search-key={this.searchKey}
                  is-filtering={this.isFiltering}
                  suggestions={this.suggestions}
                  v-model={this.checkedValue}
                  v-slots={{
                    default: scope => (this.$slots.default
                      ? this.$slots.default(scope)
                      : <span class="bk-cascader-node-name">{scope.node.name}</span>),
                  }}>
                </CascaderPanel>
              </div>
            ),
          }}
        </BkPopover>
      </div>
    );
  },
});
