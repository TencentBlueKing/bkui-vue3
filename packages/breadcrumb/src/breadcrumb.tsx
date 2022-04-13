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

import { ArrowsLeft } from '@bkui-vue/icon';
import { classes, PropTypes } from '@bkui-vue/shared';
import { defineComponent, getCurrentInstance, onMounted, provide } from 'vue';

import { IBreadcrumbProps } from './props';


export default defineComponent({
  name: 'Breadcrumb',
  props: {
    extCls: PropTypes.string,
    separator: PropTypes.string.def('/'),
    separatorClass: PropTypes.string,
    replace: PropTypes.bool,
    backRouter: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).def(''),

  },
  setup(props, { slots }) {
    const { proxy, appContext } = getCurrentInstance();

    provide<IBreadcrumbProps>('breadcrumb', props);
    onMounted(() => {
      const items = proxy.$el.querySelectorAll('.bk-breadcrumb-item');
      if (items.length) {
        items[items.length - 1].setAttribute('aria-current', 'page');
      }
    });
    const classCtx = classes({ 'bk-breadcrumb': true }, `${props.extCls || ''}`);

    const goBack = () => {
      const { backRouter, replace } = props;
      const { $router } = appContext.config.globalProperties;
      if (!$router) return;
      replace ? $router.replace(backRouter) : $router.push(backRouter);
    };
    return () => (
      <div class={classCtx} aria-label="Breadcrumb" role="navigation">
        {
          !slots.prefix && props.backRouter
            ? <div class="bk-breadcrumb-goback">
                <ArrowsLeft onClick={goBack}></ArrowsLeft>
              </div>
            : ''
        }
        {
          slots.prefix
            ? <div class="bk-breadcrumb-goback">{slots.prefix()}</div>
            : ''
        }
        {slots.default?.()}
      </div>
    );
  },
});
