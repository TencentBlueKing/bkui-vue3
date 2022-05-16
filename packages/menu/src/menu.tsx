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

import { computed, defineComponent, PropType, ref, watch, watchEffect } from 'vue';

import { IMenuInfo, MenuMode, useMenuProvider } from './utils';
export const menuProps = {
  activeKey: String,
  collapse: {
    type: Boolean,
    default: false,
  },
  openedKeys: { type: Array as PropType<string[]> },
  mode: { type: String as PropType<MenuMode>, default: 'vertical' },
  uniqueOpen: {
    type: Boolean,
    default: true,
  },
};
export default defineComponent({
  name: 'Menu',
  props: menuProps,
  emits: [
    'update:activeKey',
    'update:openKeys',
    'click',
    'openChange',
  ],
  setup(props, { slots, emit }) {
    const activeKey = ref<string>('');
    const openedKeys = ref<string[]>([]);
    const menuStore = ref<Record<string, IMenuInfo>>({});
    const mode = computed<MenuMode>(() => props.mode);
    const collapse = ref<boolean>(props.collapse);
    const oldOpenKeys = ref<string[]>([]);
    watch(() => props.openedKeys, (keys = openedKeys.value) => {
      openedKeys.value = keys;
    }, { immediate: true });
    watchEffect(() => {
      if (props.activeKey !== undefined) {
        activeKey.value = props.activeKey;
      }
    });
    watch(
      () => props.collapse,
      () => {
        collapse.value = props.collapse;
        const oldKeys = [...oldOpenKeys.value];
        const openKeys = [...openedKeys.value];
        openedKeys.value = collapse.value ? [] : oldKeys;
        oldOpenKeys.value = collapse.value ? openKeys : [];
      },
      {
        immediate: true,
      },
    );
    const registerMenuInfo = (key: string, info: IMenuInfo) => {
      menuStore.value = { ... menuStore.value, [key]: info };
    };
    const unregisterMenuInfo = (key: string) => {
      delete menuStore.value[key];
      menuStore.value = { ... menuStore.value };
    };
    const handleOpenChange = (key: string, opened: boolean) => {
      if (opened) {
        if (props.uniqueOpen) {
          openedKeys.value = [key];
        } else openedKeys.value.push(key);
      } else {
        openedKeys.value = openedKeys.value.filter(v => v !== key);
      }
      emit('openChange', opened, menuStore.value[key]);
      emit('update:openKeys', [...openedKeys.value]);
    };
    const handleActiveChange = (key: string) => {
      activeKey.value = key;
      emit('click', menuStore.value[key]);
      emit('update:activeKey', key, menuStore.value[key]);
    };
    useMenuProvider({
      activeKey,
      menuStore,
      registerMenuInfo,
      unregisterMenuInfo,
      mode: mode.value,
      openedKeys,
      collapse,
      handleOpenChange,
      handleActiveChange,
    });
    return () => (
      <div class={{
        'bk-menu': true,
        'is-collapse': collapse.value,
      }}>
        {slots?.default?.()}
      </div>
    );
  },
});
