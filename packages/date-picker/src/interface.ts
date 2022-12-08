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

import type { ComputedPlacement } from '@popperjs/core';

import type { DatePickerProps } from './props';;

// export type DatePickerPlacementType =
//   | 'top'
//   | 'top-start'
//   | 'top-end'
//   | 'bottom'
//   | 'bottom-start'
//   | 'bottom-end'
//   | 'left'
//   | 'left-start'
//   | 'left-end'
//   | 'right'
//   | 'right-start'
//   | 'right-end';

// interface 描述数据结构
// type 描述类型关系

export type DatePickerPlacementType = ComputedPlacement;

export type DatePickerTypeType = 'year' | 'month' | 'date' | 'daterange' | 'datetime' | 'datetimerange';
export type TimePickerTypeType = 'time' | 'timerange';
export type PickerTypeType = DatePickerTypeType | TimePickerTypeType;

export interface IDatePickerShortcut {
  text: string
  value?: () => Date[]
  onClick?: (picker: any) => void
}
export type DatePickerShortcutsType = IDatePickerShortcut[];

type ValueType = Date | string | number;
export type DatePickerValueType = ValueType | [ValueType, ValueType];

export type DisabledDateType = (date: number | Date) => boolean;

export interface IDatePickerCtx {
  props: DatePickerProps,
  focus: () => void
}

export interface ITimePickerCtx {
  parentName: string,
  panelDate?: Date | string | number,
  dates?: ValueType | [ValueType, ValueType]
}

export type DatePickerPanelType = 'DateRangePanel' | 'DatePanel' | 'RangeTimePickerPanel' | 'TimePickerPanel';

export type SelectionModeType = 'year' | 'month' | 'date' | 'time';

export interface IDisabledHMS {
  disabledHours?: number[],
  disabledMinutes?: number[],
  disabledSeconds?: number[],
}
