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

import { PropTypes } from '@bkui-vue/shared';
import { defineComponent } from 'vue';

import permissions from './images/403.svg';
import notFound from './images/404.svg';
import maintain from './images/500.svg';
import Building from './images/building.svg';
import empty from './images/empty.svg';
import login from './images/login.svg';
import searchEmpty from './images/search-empty.svg';
import { Types, TypesMapType } from './typings';

export default defineComponent({
  name: 'Exception',
  props: {
    // 类型
    type: PropTypes.commonType(['404', '403', '500', 'building', 'empty', 'search-empty', 'login'], 'type').def('404'),
    // 场景
    scene: PropTypes.commonType(['page', 'part'], 'scene').def('page'),
    // 外部设置的 class name
    extCls: PropTypes.string,
  },
  setup(props, { slots }) {
    const tipText: TypesMapType = {
      403: '无业务权限',
      404: '页面不存在',
      500: '服务维护中',
      building: '功能建设中',
      empty: '没有数据',
      'search-empty': '搜索为空',
      login: '请登入蓝鲸',
    };
    const images: TypesMapType = {
      403: permissions,
      404: notFound,
      500: maintain,
      building: Building,
      empty,
      'search-empty': searchEmpty,
      login,
    };
    return () => (
      <div class={['bk-exception-wrapper', props.extCls]}>
        <div class={['bk-exception-img', `${props.scene}-img`]}>
            <img class="exception-image" src={images[props.type as Types]} alt="type" />
        </div>
        <div class={['bk-exception-text', `${props.scene}-text`]}>
            {slots.default?.() ?? tipText[props.type as Types]}
        </div>
    </div>
    );
  },
});
