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

import {
  classes,
  PropTypes,
} from '@bkui-vue/shared';

import permissions from './images/403.svg';
import notFound from './images/404.svg';
import maintain from './images/500.svg';
import Building from './images/building.svg';
import empty from './images/empty.svg';
import login from './images/login.svg';
import searchEmpty from './images/search-empty.svg';
import { TypesMapType } from './typings';

export default defineComponent({
  name: 'Exception',
  props: {
    // 类型
    type: PropTypes.commonType(['404', '403', '500', 'building', 'empty', 'search-empty', 'login'], 'type').def('404'),
    // 场景
    scene: PropTypes.commonType(['page', 'part'], 'scene').def('page'),
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

    const renderImg = () => {
      const imgSrc = images[props.type] ? images[props.type] : empty;
      return (
        <div class="bk-exception-img">
          <img class="exception-image" src={imgSrc} alt="type" />
        </div>
      );
    };

    const renderTitle = () => {
      if (_.isFunction(slots.title)) {
        return (
          <div class="bk-exception-title">{slots.title()}</div>
        );
      }
      if (props.title) {
        return (
          <div class="bk-exception-title">{props.title}</div>
        );
      }
      return null;
    };

    const renderDescription = () => {
      if (_.isFunction(slots.description)) {
        return (
          <div class="bk-exception-description">{slots.description()}</div>
        );
      }
      if (props.description) {
        return (
          <div class="bk-exception-description">{props.description}</div>
        );
      }
      return null;
    };

    const renderFooter = () => {
      if (_.isFunction(slots.default)) {
        return (
          <div class="bk-exception-footer">{slots.default()}</div>
        );
      }
      return null;
    };

    return () => {
      const rootClass = classes({
        'bk-exception': true,
        [`bk-exception-${props.scene}`]: true,
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
