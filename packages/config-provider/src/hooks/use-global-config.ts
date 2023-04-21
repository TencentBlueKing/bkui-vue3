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
  getCurrentInstance,
  inject,
  provide,
  Ref,
  ref,
  unref,
} from 'vue';

import { localeContextKey } from '@bkui-vue/shared';

// import { ConfigProviderContext, configProviderContextKey } from '@bkui-vue/config-provider';
import { ConfigProviderContext, configProviderContextKey } from '../interface';

const globalConfig = ref<ConfigProviderContext>();

function useGlobalConfig(): Ref<ConfigProviderContext>;
function useGlobalConfig(
  key?: keyof ConfigProviderContext,
  defaultValue = undefined,
) {
  const config = getCurrentInstance()
    ? inject(configProviderContextKey, globalConfig)
    : globalConfig;
  if (key) {
    return computed(() => config.value?.[key] ?? defaultValue);
  }
  return config;
}

const keysOf = <T>(arr: T) => Object.keys(arr) as Array<keyof T>;

const mergeConfig = (
  a: ConfigProviderContext,
  b: ConfigProviderContext,
): ConfigProviderContext => {
  const keys = [...new Set([...keysOf(a), ...keysOf(b)])];
  const obj: Record<string, any> = {};
  for (const key of keys) {
    obj[key] = b[key] ?? a[key];
  }
  return obj;
};

export const provideGlobalConfig = (config) => {
  const inSetup = !!getCurrentInstance();
  const oldConfig = inSetup ? useGlobalConfig() : undefined;
  const context = computed(() => {
    const cfg = unref(config);
    if (!oldConfig?.value) return cfg;
    return mergeConfig(oldConfig.value, cfg);
  });

  provide(configProviderContextKey, context);
  console.error('111context.value.locale', context.value.locale);
  provide(
    localeContextKey,
    computed(() => context.value.locale),
  );

  if (!globalConfig.value) {
    globalConfig.value = context.value;
  }
  return context;
};
