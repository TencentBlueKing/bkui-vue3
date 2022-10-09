import { ISearchItem } from './utils';

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
export const defaultData: ISearchItem[]  = [
  {
    name: '实例状态',
    id: '1',
    multiple: true,
    placeholder: '必须项',
    children: [
      {
        name: '创建中',
        id: '1-2',
      },
      {
        name: '运行中',
        id: '1-3',
        disabled: false,
      },
      {
        name: '已关机',
        id: '1-4',
      },
    ],
  },
  {
    name: '实例业务',
    id: '2',
    children: [
      {
        name: '王者荣耀',
        id: '2-1',
        disabled: false,
      },
      {
        name: '刺激战场',
        id: '2-2',
      },
      {
        name: '绝地求生',
        id: '2-3',
      },
    ],
    conditions: [
      {
        name: '>',
        id: '>',
      },
      {
        name: '>=',
        id: '>=',
      },
      {
        name: '<=',
        id: '<=',
      },
      {
        name: '<',
        id: '<',
      },
      {
        name: '=',
        id: '=',
      },
    ],
  },
  {
    name: 'IP地址',
    id: '3',
    disabled: true,
  },
  {
    name: '实例名',
    id: '4',
  },
  {
    name: '实例地址',
    id: '5',
  },
  {
    name: '测试六',
    id: '6',
  },
];
