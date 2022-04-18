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

import { mount } from '@vue/test-utils';

import BKTable from '../src/table';
const data = [
  {
    ip: '192.168.0.1',
    source: 'QQ',
    status: '创建中',
    create_time: '2018-05-25 15:02:24',
    children: [
      {
        name: '用户管理',
        count: '23',
        creator: 'person2',
        create_time: '2017-10-10 11:12',
        desc: '用户管理',
      },
      {
        name: '模块管理',
        count: '2',
        creator: 'person1',
        create_time: '2017-10-10 11:12',
        desc: '无数据测试',
      },
    ],
  },
  {
    ip: '192.168.0.2',
    source: '微信',
    status: '正常',
    create_time: '2018-05-25 15:02:24',
    children: [
      {
        name: '用户管理',
        count: '23',
        creator: 'person2',
        create_time: '2017-10-10 11:12',
        desc: '用户管理',
      },
      {
        name: '模块管理',
        count: '2',
        creator: 'person1',
        create_time: '2017-10-10 11:12',
        desc: '无数据测试',
      },
    ],
  },
  {
    ip: '192.168.0.3',
    source: 'QQ',
    status: '创建中',
    create_time: '2018-05-25 15:02:24',
    children: [
      {
        name: '用户管理',
        count: '23',
        creator: 'person2',
        create_time: '2017-10-10 11:12',
        desc: '用户管理',
      },
      {
        name: '模块管理',
        count: '2',
        creator: 'person1',
        create_time: '2017-10-10 11:12',
        desc: '无数据测试',
      },
    ],
  },
];

const columns = [
  {
    label: () => '名称/内网IP',
    field: 'ip',
  },
  {
    label: '来源',
    field: 'source',
  },
  {
    label: '创建时间',
    field: 'create_time',
    render: (row: any) => row?.create_time,
  },
];
describe('table.tsx', () => {
  it('renders single active when passed', async () => {
    const wrapper = await mount(BKTable, {
      props: {
        data,
        columns,
        activeColumn: [0],
        columnPick: 'single',
      },
    });
    expect(wrapper.classes()).toContain('bk-table');
    expect(wrapper.findAll('table > tbody > tr').length).toEqual(3);
    expect(wrapper.findAll('table > thead > tr > th')[0].classes()).toContain('active');
  });

  it('renders mlti active when passed', async () => {
    const wrapper = await mount(BKTable, {
      props: {
        data,
        columns,
        activeColumn: [0, 1],
        columnPick: 'multi',
      },
    });
    expect(wrapper.findAll('table > thead > tr > th')[1].classes()).toContain('active');
  });
});
