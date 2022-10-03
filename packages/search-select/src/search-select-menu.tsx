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
import { computed, defineComponent, PropType } from 'vue';

import { Done } from '@bkui-vue/icon';

import { ICommonItem } from './utils';;
export default defineComponent({
  name: 'SearchSelectMenu',
  props: {
    list: {
      type: Array as PropType<ICommonItem[]>,
    },
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
  },
  emits: ['selectItem'],
  setup(props, { emit }) {
    function handleClick(item: ICommonItem) {
      emit('selectItem', item);
    }
    const filterList = computed(() => {
      if (!props.list?.length) return [];
      if (!props.keyword?.length) return props.list;
      return props.list.filter(item => item.name.toLocaleLowerCase().includes(props.keyword.toLocaleLowerCase()));
    });
    function getSearchNode(str: string) {
      if (!str) return str;
      let { keyword } = props;
      const len = keyword.length;
      if (!keyword?.trim().length || !str.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())) return str;
      const list = [];
      let lastIndex = -1;
      keyword = keyword.replace(/([.*/]{1})/gmi, '\\$1');
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
    };
    return {
      handleClick,
      filterList,
      getSearchNode,
    };
  },
  render() {
    return <ul class='search-select-menu'>
      {
        this.filterList.map(item => <li
          class="menu-item"
          key={item.id}
          onClick={() => this.handleClick(item)}>{this.getSearchNode(item.name)}
          {this.multiple && this.selected.includes(item.id) && <Done class="is-selected"/>}
        </li>)
      }
    </ul>;
  },
});
