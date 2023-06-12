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

export const transferProps = {
  // 顶部title(title[0]: 左侧title,title[1]: 右侧title,)
  title: PropTypes.arrayOf(PropTypes.string).def([]),
  // 自定义class
  extCls: PropTypes.string.def(''),
  // 搜索框 placeholder
  searchPlaceholder: PropTypes.string.def(''),
  // 唯一key值
  settingKey: PropTypes.string.def('id'),
  // 循环list时，显示字段的key值(当list为普通数组时可不传传了也无效)
  displayKey: PropTypes.string.def('value'),
  // 排序所依据的key(当list为普通数组时可不传，默认按照index值排序)
  sortKey: PropTypes.string.def('value'),
  // 内容超出是否显示tooltip
  showOverflowTips: PropTypes.bool.def(false),
  // 是否开启搜索
  searchable: PropTypes.bool.def(false),
  // 是否开启排序功能
  sortable: PropTypes.bool.def(false),
  // 穿梭框数据源(支持普通数组)
  sourceList: PropTypes.arrayOf(PropTypes.any).def([]),
  // 默认已选择的数据源
  targetList: PropTypes.arrayOf(PropTypes.any).def([]),
  // 穿梭框无数据时提示文案
  emptyContent: PropTypes.arrayOf(PropTypes.string).def([]),
  // 支持checkbox多选模式
  multiple: PropTypes.bool.def(false),
};
