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
import { customRef, markRaw, reactive, Ref, ref, toRefs, watch } from 'vue';

import type { TagProps } from './tag-props';

export const INPUT_MIN_WIDTH = 12;

export function useDebouncedRef<T>(value, delay = 200) {
  let timeout;
  let innerValue = value;
  return customRef<T>((track, trigger) => ({
    get() {
      track();
      return innerValue;
    },
    set(newValue) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        innerValue = newValue;
        trigger();
      }, delay);
    },
  }));
}

export function usePage(pageSize: Ref<number>) {
  const state = reactive({
    curPage: 1,
    totalSize: 0,
    totalPage: 0,
    pageSize,
    isPageLoading: false,
    curPageList: [],
    renderListPaged: [],
  });

  // 初始化分页信息
  const initPage = (allList: any[] = []) => {
    state.curPage = 1;
    state.totalSize = allList.length;
    state.totalPage = Math.ceil(state.totalSize / state.pageSize) || 1;

    const list = [];
    // 小于等于0会无限循环
    if (state.pageSize > 0) {
      for (let i = 0; i < state.totalSize; i += state.pageSize) {
        list.push(allList.slice(i, i + state.pageSize));
      }
    }
    state.renderListPaged.splice(0, state.renderListPaged.length, ...list);
    state.curPageList.splice(0, state.curPageList.length, ...(state.renderListPaged[state.curPage - 1] || []));
  };

  const pageChange = (page: number) => {
    state.curPage = page;
    state.curPageList.splice(state.curPageList.length, 0, ...(state.renderListPaged[state.curPage - 1] || []));
    state.isPageLoading = false;
  };

  return {
    pageState: state,
    initPage,
    pageChange,
  };
}

export function useFlatList(props: TagProps) {
  const {
    useGroup,
    saveKey,
    displayKey,
    list,
  } = toRefs(props);
  const flatList = ref([]);
  const saveKeyMap = ref({});


  watch([useGroup, saveKey, displayKey, list], () => {
    flatList.value = [];
    let formatList: any = markRaw(list.value);
    if (useGroup.value) {
      formatList = formatList.reduce((formatList: any[], item: any) => {
        let children: any[] = [];
        if (item.children) {
          children = item.children.map((child: any) => ({
            group: {
              groupId: item[saveKey.value],
              groupName: item[displayKey.value],
            },
            ...child,
          }));
        }
        return formatList.concat(children);
      }, []);
    }
    flatList.value = formatList;
    saveKeyMap.value = formatList.reduce((acc, item) => {
      acc[item[saveKey.value]] = item;
      return acc;
    }, {});
  }, { immediate: true });

  return {
    flatList,
    saveKeyMap,
  };
}

/**
 * 获取字符长度，汉字两个字节
 * @param str 需要计算长度的字符
 * @returns 字符长度
 */
export const getCharLength = (str: string) => {
  const len = str.length;
  let bitLen = 0;

  for (let i = 0; i < len; i++) {
    if ((str.charCodeAt(i) & 0xff00) !== 0) {
      bitLen += 1;
    }
    bitLen += 1;
  }

  return bitLen;
};
