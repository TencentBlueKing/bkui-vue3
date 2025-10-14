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

import { defineComponent } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { classes } from '@bkui-vue/shared';
import isFunction from 'lodash/isFunction';

import { emits } from './emits';
import permissions from './images/403.svg';
import notFound from './images/404.svg';
import maintain from './images/500.svg';
import Building from './images/building.svg';
import empty from './images/empty.svg';
import login from './images/login.svg';
import searchEmpty from './images/search-empty.svg';
import { props } from './props';
import { TypesMapType } from './typings';

export default defineComponent({
  name: 'Exception',
  props,
  emits,
  setup(props, { slots }) {
    const images: TypesMapType = {
      403: permissions,
      404: notFound,
      500: maintain,
      building: Building,
      empty,
      'search-empty': searchEmpty,
      login,
    };
    const { resolveClassName } = usePrefix();

    const renderImg = () => {
      if (isFunction(slots.type)) {
        return <div class={`${resolveClassName('exception-img')}`}>{slots.type()}</div>;
      }
      const imgSrc = images[props.type] ? images[props.type] : empty;
      return (
        <div class={`${resolveClassName('exception-img')}`}>
          <img
            class='exception-image'
            alt='type'
            src={imgSrc}
          />
        </div>
      );
    };

    const renderTitle = () => {
      if (isFunction(slots.title)) {
        return <div class={`${resolveClassName('exception-title')}`}>{slots.title()}</div>;
      }
      if (props.title) {
        return <div class={`${resolveClassName('exception-title')}`}>{props.title}</div>;
      }
      return null;
    };

    const renderDescription = () => {
      if (isFunction(slots.description)) {
        return <div class={`${resolveClassName('exception-description')}`}>{slots.description()}</div>;
      }
      if (props.description) {
        return <div class={`${resolveClassName('exception-description')}`}>{props.description}</div>;
      }
      return null;
    };

    const renderFooter = () => {
      if (isFunction(slots.default)) {
        return <div class={`${resolveClassName('exception-footer')}`}>{slots.default()}</div>;
      }
      return null;
    };

    return () => {
      const rootClass = classes({
        [`${resolveClassName('exception')}`]: true,
        [`${resolveClassName(`exception-${props.scene}`)}`]: true,
      });
      return (
        <div class={rootClass}>
          {renderImg()}
          {renderTitle()}
          {renderDescription()}
          {renderFooter()}
        </div>
      );
    };
  },
});
