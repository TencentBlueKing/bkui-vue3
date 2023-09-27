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
import { computed, defineComponent, PropType, VNode } from 'vue';

import Checkbox from '@bkui-vue/checkbox';
import { useLocale, usePrefix } from '@bkui-vue/config-provider';
import Radio from '@bkui-vue/radio';

// import { Done } from '@bkui-vue/icon';
import { ICommonItem, IMenuFooterItem, SearchLogical } from './utils';

export default defineComponent({
  name: 'SearchSelectMenu',
  props: {
    list: {
      type: Array as PropType<ICommonItem[]>,
    },
    hoverId: String,
    keyword: {
      type: String,
      default: '',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    conditions: {
      type: Array as PropType<ICommonItem[]>,
    },
    footerBtns: {
      type: Array as PropType<IMenuFooterItem[]>,
      default: () => [],
    },
    showLogical: {
      type: Boolean,
      default: true,
    },
    logical: {
      type: String as PropType<SearchLogical>,
      default: SearchLogical.OR,
    },
  },
  emits: ['selectItem', 'selectCondition', 'footerClick', 'update:logical'],
  setup(props, { emit }) {
    const t = useLocale('searchSelect');
    const { resolveClassName } = usePrefix();
    const localFooterBtns = computed(() => {
      if (props.footerBtns === undefined || props.footerBtns.length === 0) {
        return [
          {
            id: 'confirm',
            name: t.value.ok,
          },
          {
            id: 'cancel',
            name: t.value.cancel,
            disabled: false,
          },
        ];
      }
      return props.footerBtns;
    });

    // events
    function handleClick(item: ICommonItem) {
      emit('selectItem', item);
    }
    function handleClickCondition(item: ICommonItem) {
      emit('selectCondition', item);
    }
    function handleClickFooterBtn(item: IMenuFooterItem) {
      emit('footerClick', item);
    }
    const filterList = computed(() => {
      if (!props.list?.length) return [];
      if (!props.keyword?.length) return props.list;
      return props.list.filter(item => item.name.toLocaleLowerCase().includes(props.keyword.toLocaleLowerCase()));
    });
    function transformNode(str: string): string | (string | VNode)[] {
      if (!str) return str;
      let { keyword } = props;
      const len = keyword.length;
      if (!keyword?.trim().length || !str.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())) return str;
      const list = [];
      let lastIndex = -1;
      keyword = keyword.replace(/([.*/]{1})/gim, '\\$1');
      str.replace(new RegExp(`${keyword}`, 'igm'), (key, index) => {
        if (list.length === 0 && index !== 0) {
          list.push(str.slice(0, index));
        } else if (lastIndex >= 0) {
          list.push(str.slice(lastIndex + key.length, index));
        }
        list.push(<span class='is-keyword'>{key}</span>);
        lastIndex = index;
        return key;
      });
      if (lastIndex >= 0) {
        list.push(str.slice(lastIndex + len));
      }
      return list.length ? list : str;
    }
    function getSearchNode(item: ICommonItem): string | (string | VNode)[] {
      if (!item.value?.name) return transformNode(item.name);
      return [<span class='menu-name'>{item.name}:</span>, item.value.name];
    }
    function handleSelectedChange(e: MouseEvent, item: ICommonItem) {
      e.stopPropagation();
      e.preventDefault();
      handleClick(item);
    }
    function handleLogicalChange(value: string | number | boolean) {
      emit('update:logical', value);
    }
    return {
      handleClick,
      handleClickCondition,
      handleClickFooterBtn,
      handleSelectedChange,
      handleLogicalChange,
      filterList,
      getSearchNode,
      localFooterBtns,
      resolveClassName,
      t,
    };
  },
  render() {
    const listMenu = (
      <ul class='menu-content'>
        {this.list?.map(item => (
          <li
            class={`menu-item ${item.disabled ? 'is-disabled' : ''} ${
              this.hoverId === item.id && !item.disabled ? 'is-hover' : ''
            }`}
            key={item.id}
            id={item.id}
            tabindex='-1'
            onClick={() => !item.disabled && this.handleClick(item)}
          >
            {this.$slots.default ? (
              this.$slots.default({
                item,
                list: this.list,
                multiple: !!this.multiple,
                hoverId: this.hoverId,
                getSearchNode: this.getSearchNode,
              })
            ) : (
              <>
                {this.multiple && (
                  <span onClick={e => this.handleSelectedChange(e, item)}>
                    <Checkbox
                      modelValue={this.selected.includes(item.id)}
                      class='is-selected'
                    />
                  </span>
                )}
                {this.getSearchNode(item)}
              </>
            )}
          </li>
        ))}
      </ul>
    );
    const getListMenu = () => {
      if (!this.showLogical || !this.multiple) return listMenu;
      return (
        <div class='menu-content-wrapper'>
          {listMenu}
          <div class='menu-condition'>
            <div class='menu-condition-title'>{this.t.logical}</div>
            <Radio
              modelValue={this.logical}
              onChange={this.handleLogicalChange}
              label='|'
            >
              {this.t.or} |
            </Radio>
            <Radio
              modelValue={this.logical}
              onChange={this.handleLogicalChange}
              label='&'
            >
              {this.t.and} &
            </Radio>
          </div>
        </div>
      );
    };
    return (
      <div class={this.resolveClassName('search-select-menu')}>
        {!!this.conditions?.length && (
          <ul class='menu-header'>
            {this.conditions.map(item => (
              <li
                key={item.id}
                class={`menu-header-item  ${item.disabled ? 'is-disabled' : ''}`}
                onClick={() => !item.disabled && this.handleClickCondition(item)}
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}
        {getListMenu()}
        {/* {
        this.multiple && this.localFooterBtns?.length && <div class="menu-footer">
          {
            this.localFooterBtns.map(item => <span
              class={`menu-footer-btn ${item.disabled ? 'is-disabled' : ''}`}
              key={item.id}
              onClick={() => !item.disabled && this.handleClickFooterBtn(item)}>{item.name}</span>)
          }
        </div>
      } */}
      </div>
    );
  },
});
