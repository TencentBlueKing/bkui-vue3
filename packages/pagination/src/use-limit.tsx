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

import type { ComponentInternalInstance, ComputedRef } from 'vue';
import { getCurrentInstance, nextTick, ref, watch } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import type { Language } from '@bkui-vue/locale';
import BkSelect, { BkOption } from '@bkui-vue/select';

import type { IPaginationInstance } from './type';

export default (t: ComputedRef<Language['pagination']>) => {
  const { proxy } = getCurrentInstance() as ComponentInternalInstance & { proxy: IPaginationInstance };

  const localLimit = ref<number>(proxy.limit);

  /**
   * @desc 同步props.limit的变化
   */
  watch(
    () => proxy.limit,
    limit => {
      localLimit.value = limit;
    },
  );
  /**
   * @desc 同步props.limitlist的变化并判断props.limit的合法性
   */
  watch(
    () => proxy.limitList,
    limitList => {
      nextTick(() => {
        if (!limitList.includes(localLimit.value)) {
          [localLimit.value] = limitList;
        }
      });
    },
    {
      immediate: true,
    },
  );

  /**
   * @desc 选择每页条数
   */
  const handleLimitChange = (limit: number) => {
    localLimit.value = limit;
  };

  const { resolveClassName } = usePrefix();

  const render = ({ isFirst, isLast }) => {
    if (!proxy.showLimit) {
      return null;
    }
    return (
      <div
        class={{
          [resolveClassName('pagination-limit')]: true,
          'is-first': isFirst,
          'is-last': isLast,
        }}
        {...{
          disabled: proxy.disabled,
        }}
      >
        <div>{t.value.eachPage}</div>
        <BkSelect
          class={`${resolveClassName('pagination-limit-select')}`}
          clearable={false}
          size='small'
          withValidate={false}
          modelValue={localLimit.value}
          onChange={handleLimitChange}
          disabled={proxy.disabled}
        >
          {proxy.limitList.map((num, index) => (
            <BkOption
              // value={num}
              // label={`${num}`}
              id={num}
              name={`${num}`}
              key={`${index}_${num}`}
            />
          ))}
        </BkSelect>
        <div>{t.value.strip}</div>
      </div>
    );
  };

  return {
    limit: localLimit,
    render,
  };
};
