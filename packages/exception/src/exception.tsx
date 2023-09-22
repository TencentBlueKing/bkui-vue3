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

import _ from 'lodash';
import { defineComponent } from 'vue';
import { toType } from 'vue-types';

import { usePrefix } from '@bkui-vue/config-provider';
import { classes, PropTypes } from '@bkui-vue/shared';

import permissions from './images/403.svg';
import notFound from './images/404.svg';
import maintain from './images/500.svg';
import Building from './images/building.svg';
import empty from './images/empty.svg';
import login from './images/login.svg';
import searchEmpty from './images/search-empty.svg';
import { TypesMapType } from './typings';

export enum ExceptionEnum {
  CODE_404 = '404',
  CODE_403 = '403',
  CODE_500 = '500',
  BUILDING = 'building',
  EMPTY = 'empty',
  SEARCH = 'search-empty',
  LOGIN = 'login',
}
export enum SceneEnum {
  PAGE = 'page',
  PART = 'part',
}
export default defineComponent({
  name: 'Exception',
  props: {
    // 类型
    type: toType<`${ExceptionEnum}`>('type', {}).def(ExceptionEnum.CODE_404),
    // 场景
    scene: toType<`${SceneEnum}`>('scene', {}).def(SceneEnum.PAGE),
    title: PropTypes.string,
    description: PropTypes.string,
  },
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
      if (_.isFunction(slots.type)) {
        return <div class={`${resolveClassName('exception-img')}`}>{slots.type()}</div>;
      }
      const imgSrc = images[props.type] ? images[props.type] : empty;
      return (
        <div class={`${resolveClassName('exception-img')}`}>
          <img
            class='exception-image'
            src={imgSrc}
            alt='type'
          />
        </div>
      );
    };

    const renderTitle = () => {
      if (_.isFunction(slots.title)) {
        return <div class={`${resolveClassName('exception-title')}`}>{slots.title()}</div>;
      }
      if (props.title) {
        return <div class={`${resolveClassName('exception-title')}`}>{props.title}</div>;
      }
      return null;
    };

    const renderDescription = () => {
      if (_.isFunction(slots.description)) {
        return <div class={`${resolveClassName('exception-description')}`}>{slots.description()}</div>;
      }
      if (props.description) {
        return <div class={`${resolveClassName('exception-description')}`}>{props.description}</div>;
      }
      return null;
    };

    const renderFooter = () => {
      if (_.isFunction(slots.default)) {
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
