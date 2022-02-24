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

/**
 * @file transform-import postcss plugin
 * @import '@bkui-vue/styles/mixins/mixins.less'; => @import '../styles/mixins/mixins.less';
 *
 * Copyright © 2012-2021 Tencent BlueKing. All Rights Reserved. 蓝鲸智云 版权所有
 */

import postcss from 'postcss';

interface Options {
  [key: string]: string;
}

export default postcss.plugin('transform-import', (alias: Options) => (node) => {
  node.walkAtRules((rule) => {
    const importPath = rule.params.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
    const aliasKeys = Object.keys(alias);
    if (new RegExp(aliasKeys.map(item => `^(${item})`).join('|'), 'gi').test(importPath)) {
      const match = RegExp.$1;
      const restPath = importPath.replace(match, '');
      // eslint-disable-next-line no-param-reassign
      rule.params = `'../styles${restPath}'`;
    }
  });
});
