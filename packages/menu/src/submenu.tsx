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

import { defineComponent, getCurrentInstance, onBeforeUnmount, Transition, ref, computed } from 'vue';
import { collapseMotion, useMenuInject, useMenuPathInject, useMenuPathProvider } from './utils';
import { AngleDown, TreeApplicationShape } from '@bkui-vue/icon/';

export const subMenuProps = {
  title: {
    type: String,
    default: 'title',
  },
};
export default defineComponent({
  name: 'Submenu',
  props: subMenuProps,
  emits: ['collapse'],
  slots: ['icon'],
  setup(props, { slots, emit }) {
    const { registerMenuInfo, unregisterMenuInfo, openedKeys,
      handleOpenChange, collapse, activeKey, menuStore } = useMenuInject();
    const { parentInfo } = useMenuPathInject();
    const instance = getCurrentInstance();
    const key = instance.vnode.key?.toString?.() || String(instance.uid);
    const transition = ref(collapseMotion());
    const isShow = computed(() => openedKeys.value.includes(key));
    const specialCollapse = computed(() => {
      const activeParentKey = menuStore.value?.[activeKey.value]?.parentKey;
      return collapse.value && activeParentKey === key && isShow;
    });
    useMenuPathProvider(key);
    registerMenuInfo(key, {
      key,
      parentKey: parentInfo?.key,
    });
    onBeforeUnmount(() => unregisterMenuInfo(key));
    const handleCollapse = () => {
      handleOpenChange(key, !isShow.value);
      emit('collapse', !isShow.value, instance);
    };
    return () => (
      <li
        class={{
          'bk-menu-submenu': true,
          'is-opened': isShow.value,
        }}
      >
        <div
          class={{
            'submenu-header': true,
            'is-collapse': specialCollapse.value,
          }}
          onClick={handleCollapse}
        >
          <span class="submenu-header-icon">
            {slots.icon?.() || <TreeApplicationShape class="menu-icon" />}
          </span>
          <span class="submenu-header-content">{props.title}</span>
          <AngleDown
            class={{
              'submenu-header-collapse': true,
              'is-collapse': openedKeys.value.includes(key),
            }}
          />
        </div>
        <Transition {...transition.value}>
          <ul class="submenu-list" v-show={isShow.value}>
            {slots.default?.()}
          </ul>
        </Transition>
      </li>
    );
  },
});
