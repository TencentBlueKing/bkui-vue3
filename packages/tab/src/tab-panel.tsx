/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2025 Tencent.  All rights reserved.
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

import { ComputedRef, defineComponent, h, inject, VNodeChild } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';

import { tabActiveInjectionKey, tabPanelProps } from './props';

export default defineComponent({
  name: 'TabPanel',
  props: tabPanelProps,
  setup() {
    // 优先通过 inject 获取激活态；单独使用 TabPanel（无父级 Tab）时回退到 $parent。
    const tabActive = inject<ComputedRef<number | string> | null>(tabActiveInjectionKey, null);
    return { tabActive };
  },
  render() {
    const parentActive = this.tabActive ?? (this.$parent as any)?.active;
    const active: boolean = this.name === parentActive;
    const getContent = (): VNodeChild => {
      // 不渲染
      if (!this.visible || ((this.renderDirective as unknown as string) === 'if' && !active)) {
        return null;
      }
      if (typeof this.panel === 'function') {
        return this.panel(h);
      }
      if (typeof this.$slots.default === 'function') {
        return this.$slots.default(null);
      }
      if (typeof this.$slots.panel === 'function') {
        return this.$slots.panel(null);
      }
      return null;
    };

    const { resolveClassName } = usePrefix();

    return (
      <div
        ref='content'
        class={resolveClassName('tab-panel')}
        v-show={active}
      >
        {getContent()}
      </div>
    );
  },
});
