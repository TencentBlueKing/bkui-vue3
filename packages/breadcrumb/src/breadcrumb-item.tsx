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

import { defineComponent, getCurrentInstance, inject } from 'vue';

import { classes, PropTypes } from '@bkui-vue/shared';

import { IBreadcrumbProps } from './props';


export default defineComponent({
  name: 'BreadcrumbItem',
  props: {
    extCls: PropTypes.string,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).def(''),
    replace: PropTypes.bool,
  },
  emits: ['click'],
  setup(props, { emit, slots }) {
    const { appContext } = getCurrentInstance();
    const parent = inject<IBreadcrumbProps>('breadcrumb');
    const router = appContext.config.globalProperties.$router;
    const handleClick = (e) => {
      emit('click', e);
      const { to, replace } = props;
      if (!to || !router) return;
      replace ? router.replace(to) : router.push(to);
    };
    const classCtx = classes({ 'bk-breadcrumb-item': true }, `${props.extCls || ''}`);

    const renderSeparator = () => {
      if (slots.separator) {
        return slots.separator();
      }
      if (parent.separatorClass) {
        return <i class={`bk-breadcrumb-separator ${parent.separatorClass}`} />;
      }
      if (parent.separator) {
        return <span class="bk-breadcrumb-separator" role="presentation">{parent?.separator}</span>;
      }
      return null;
    };

    return () => (
      <span class={classCtx}>
        <span
          ref="link"
          class={`bk-breadcrumb-item-inner ${props.to ? 'is-link' : ''}`}
          role="link"
          onClick={handleClick}
        >
          {slots.default?.()}
        </span>
        {renderSeparator()}
      </span>
    );
  },
});
