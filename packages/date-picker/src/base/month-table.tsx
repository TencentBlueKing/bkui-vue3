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

import type { ExtractPropTypes } from 'vue';
import { computed, defineComponent, PropType } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';

import type { DatePickerValueType } from '../interface';
import { clearHours } from '../utils';

const monthTableProps = {
  tableDate: {
    type: Date,
    required: true,
  },
  disabledDate: {
    type: Function,
  },
  selectionMode: {
    type: String,
    required: true,
  },
  // value: {
  //   type: Array,
  //   required: true,
  // },
  modelValue: {
    type: [Date, String, Number, Array] as PropType<DatePickerValueType | null>,
    required: true,
  },
  rangeState: {
    type: Object,
    default: () => ({
      from: null,
      to: null,
      selecting: false,
    }),
  },
  focusedDate: {
    type: Date,
    required: true,
  },
  cellClass: {
    type: Function,
    default: () => '',
  },
} as const;

export type MonthTableProps = Readonly<ExtractPropTypes<typeof monthTableProps>>;

export default defineComponent({
  name: 'MonthTable',
  props: monthTableProps,
  emits: ['pick', 'pick-click', 'change-range'],
  setup(props, { emit }) {
    const dates = computed(() => {
      const { selectionMode, modelValue, rangeState } = props;
      const rangeSelecting = selectionMode === 'range' && rangeState.selecting;
      return rangeSelecting ? [rangeState.from] : modelValue;
    });

    const cells = computed(() => {
      const cells = [];
      const cellTmpl = {
        text: '',
        selected: false,
        disabled: false,
      };

      const tableYear = props.tableDate.getFullYear();
      const selectedDays = (dates.value as any[])
        .filter(Boolean).map(date => clearHours(new Date(date.getFullYear(), date.getMonth(), 1)));
      const focusedDate = clearHours(new Date(props.focusedDate.getFullYear(), props.focusedDate.getMonth(), 1));

      for (let i = 0; i < 12; i++) {
        const cell = JSON.parse(JSON.stringify(cellTmpl));
        cell.date = new Date(tableYear, i, 1);
        cell.text = tCell(i + 1);
        const day = clearHours(cell.date);
        cell.disabled = typeof props.disabledDate === 'function'
          && props.disabledDate(cell.date)
          && props.selectionMode === 'month';
        cell.selected = selectedDays.includes(day);
        cell.focused = day === focusedDate;
        cells.push(cell);
      }

      return cells;
    });

    const tCell = nr => (String(nr).length > 1 ? nr : `0${nr}`);

    const { resolveClassName } = usePrefix();

    const getCellCls = cell => [
      resolveClassName('date-picker-cells-cell'),
      {
        [resolveClassName('date-picker-cells-cell-selected')]: cell.selected,
        [resolveClassName('date-picker-cells-cell-disabled')]: cell.disabled,
        [resolveClassName('date-picker-cells-cell-range')]: cell.range && !cell.start && !cell.end,
      },
    ];

    const handleClick = (cell) => {
      if (cell.disabled || cell.type === 'weekLabel') {
        return;
      }
      const newDate = new Date(clearHours(cell.date));

      emit('pick', newDate);
      emit('pick-click');
    };

    const handleMouseMove = (cell) => {
      if (!props.rangeState.selecting) {
        return;
      }
      if (cell.disabled) {
        return;
      }
      const newDate = cell.date;
      emit('change-range', newDate);
    };

    return {
      cells,
      getCellCls,
      handleClick,
      handleMouseMove,
      resolveClassName,
    };
  },
  render() {
    return (
      <div class={[
        this.resolveClassName('date-picker-cells'),
        this.resolveClassName('date-picker-cells-month'),
      ]}>
        {
          this.cells.map(cell => (
            <span class={this.getCellCls(cell)}
              onClick={() => this.handleClick(cell)}
              onMouseenter={() => this.handleMouseMove(cell)}>
              <em>{cell.text}</em>
            </span>
          ))
        }
      </div>
    );
  },
});
