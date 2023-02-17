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
import i18n from '../../language/i18n';

const { t } = i18n.global;
export interface TreeData {
  name?: string
  content?: string
  children?: TreeData[]
  async?: boolean
  isOpen?: boolean
  isFolder?: boolean
  checked?: boolean
  disabled?: boolean
  id?: string | number
}

export const FormatI18nData = (list: TreeData[]) => list.map((item: TreeData) => {
  const child = FormatI18nData(item.children || []);
  return {
    ...item,
    name: t(item.name),
    content: t(item.content),
    children: child,
  };
});

export const BASIC_DATA: TreeData[] = FormatI18nData([
  {
    name: '方案成熟',
    isOpen: true,
    content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
    id: '/',
    children: [
      {
        name: 'child-1-方案成熟-拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
        content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
        children: [],
      },
      {
        name: 'child-1-覆盖全面',
        content:
          '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
        children: [],
      },
      {
        name: 'child-1-开放平台',
        content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
        children: [
          {
            name: 'child-1-方案成熟',
            content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
            children: [],
          },
          {
            name: 'child-1-覆盖全面',
            content:
              '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
            children: [],
          },
          {
            name: 'child-1-开放平台',
            isOpen: true,
            content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
            children: [],
          },
        ],
      },
    ],
  },
  {
    name: '覆盖全面',
    content:
      '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
    id: '//',
    children: [
      {
        name: 'child-2-方案成熟',
        content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
        children: [],
      },
      {
        name: 'child-2-覆盖全面',
        content:
          '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
        children: [],
      },
      {
        name: 'child-2-开放平台',
        content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
        children: [],
        checked: true,
      },
    ],
  },
  {
    name: '开放平台',
    content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
    children: [
      {
        name: 'child-3-方案成熟',
        content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
        children: [],
      },
      {
        name: 'child-3-覆盖全面',
        content:
          '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
        children: [],
      },
      {
        name: 'child-3-开放平台',
        content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
        children: [],
      },
    ],
  },
]);

export const ASYNC_DATA: TreeData[] = FormatI18nData([
  {
    name: '方案成熟',
    async: true,
    content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
    id: '1',
    children: [],
  },
  {
    name: '覆盖全面',
    async: true,
    content:
      '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
    id: '2',
    children: [],
  },
  {
    name: '开放平台',
    async: true,
    content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
    id: '3',
    children: [],
  },
]);

export const AUTO_OPEN_DATA: TreeData[] = FormatI18nData([
  {
    name: '方案成熟',
    content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
    children: [
      {
        name: 'child-1-方案成熟-拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
        content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
        children: [],
      },
      {
        name: 'child-1-覆盖全面',
        content:
          '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
        children: [],
      },
      {
        name: 'child-1-开放平台',
        content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
        children: [
          {
            name: 'child-1-方案成熟',
            content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
            children: [],
          },
          {
            name: 'child-1-覆盖全面',
            content:
              '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
            children: [],
          },
          {
            name: 'child-1-开放平台',
            isOpen: true,
            content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
            children: [],
          },
        ],
      },
    ],
  },
  {
    name: '覆盖全面',
    content:
      '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
    children: [
      {
        name: 'child-2-方案成熟',
        content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
        children: [],
      },
      {
        name: 'child-2-覆盖全面',
        content:
          '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
        children: [],
      },
      {
        name: 'child-2-开放平台',
        content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
        children: [],
      },
    ],
  },
  {
    name: '开放平台',
    content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
    isOpen: true,
    children: [
      {
        name: 'child-3-方案成熟',
        content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
        children: [],
      },
      {
        name: 'child-3-覆盖全面',
        content:
          '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
        children: [],
      },
      {
        name: 'child-3-开放平台',
        content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
        children: [],
      },
    ],
  },
]);

export const AUTO_CHECKED_DATA: TreeData[] = FormatI18nData([
  {
    name: '方案成熟',
    content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
    children: [
      {
        name: 'child-1-方案成熟-拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
        content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
        children: [],
      },
      {
        name: 'child-1-覆盖全面',
        content:
          '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
        children: [],
      },
      {
        name: 'child-1-开放平台',
        content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
        children: [
          {
            name: 'child-1-方案成熟',
            content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
            children: [],
          },
          {
            name: 'child-1-覆盖全面',
            content:
              '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
            children: [],
          },
          {
            name: 'child-1-开放平台',
            content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
            children: [],
          },
        ],
      },
    ],
  },
  {
    name: '覆盖全面',
    content:
      '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
    children: [
      {
        name: 'child-2-方案成熟',
        content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
        children: [],
      },
      {
        name: 'child-2-覆盖全面',
        content:
          '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
        children: [],
      },
      {
        name: 'child-2-开放平台',
        content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
        children: [],
      },
    ],
  },
  {
    name: '开放平台',
    content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
    isOpen: true,
    children: [
      {
        name: 'child-3-方案成熟',
        isOpen: true,
        content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
        children: [],
      },
      {
        name: 'child-3-覆盖全面',
        content:
          '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
        children: [],
      },
      {
        name: 'child-3-开放平台',
        content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
        checked: true,
        children: [],
      },
    ],
  },
]);

export const SINGLE_NODE_DATA: TreeData[] = FormatI18nData([
  {
    name: '方案成熟',
    content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
    id: '/',
    children: [
      {
        id: '/1/',
        name: 'child-1-方案成熟-拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
        content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
        children: [],
      },
      {
        id: '/2/',
        name: 'child-1-覆盖全面',
        content:
          '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
        children: [],
      },
      {
        id: '/3/',
        name: 'child-1-开放平台',
        content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
        children: [
          {
            id: '/3/1/',
            name: 'child-1-方案成熟',
            content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
            children: [],
          },
          {
            id: '/3/2/',
            name: 'child-1-覆盖全面',
            content:
              '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
            children: [],
          },
          {
            id: '/3/3/',
            name: 'child-1-开放平台',
            content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
            children: [],
          },
        ],
      },
    ],
  },
]);

export const DRAG_TEST_DATA: TreeData[] = FormatI18nData([
  {
    name: '方案成熟',
    isOpen: true,
    content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
    id: '/',
    isFolder: true,
    children: [
      {
        name: 'child-1-方案成熟-拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
        content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
        isFolder: true,
        children: [],
      },
      {
        name: 'child-1-覆盖全面',
        disabled: true,
        content:
          '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
      },
      {
        name: 'child-1-开放平台',
        content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
        isFolder: true,
        children: [
          {
            isFolder: true,
            name: 'child-1-方案成熟',
            content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
            children: [],
          },
          {
            name: 'child-1-覆盖全面',
            disabled: true,
            content:
              '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
          },
          {
            name: 'child-1-开放平台',
            isOpen: true,
            content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
          },
        ],
      },
    ],
  },
  {
    name: '覆盖全面',
    disabled: true,
    content:
      '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
    id: '//',
    isFolder: true,
    children: [
      {
        name: 'child-2-方案成熟',
        content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
      },
      {
        name: 'child-2-覆盖全面',
        content:
          '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
      },
      {
        name: 'child-2-开放平台',
        content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
        children: [],
        isFolder: true,
        checked: true,
      },
    ],
  },
  {
    name: '开放平台',
    content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
    children: [
      {
        name: 'child-3-方案成熟',
        isFolder: true,
        content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
        children: [],
      },
      {
        name: 'child-3-覆盖全面',
        content:
          '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
      },
      {
        name: 'child-3-开放平台',
        content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
      },
    ],
  },
]);

export const SELECTED_DATA: TreeData[] = FormatI18nData([
  {
    id: '1',
    name: '方案成熟',
    isOpen: true,
    content:
      '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
    children: [
      {
        id: '2',
        name:
          'child-1-方案成熟-拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
        content:
          '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
        children: [],
      },
      {
        id: '3',
        name: 'child-1-覆盖全面',
        content:
          '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
        children: [],
      },
      {
        id: '4',
        name: 'child-1-开放平台',
        content:
          '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
        children: [
          {
            id: '5',
            name: 'child-1-方案成熟',
            content:
              '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
            children: [],
          },
          {
            id: '6',
            name: 'child-1-覆盖全面',
            content:
              '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
            children: [],
          },
          {
            id: '7',
            name: 'child-1-开放平台',
            isOpen: true,
            content:
              '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
            children: [],
          },
        ],
      },
    ],
  },
]);
