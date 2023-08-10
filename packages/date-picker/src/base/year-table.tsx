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

const yearTableProps = {
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

export type YearTableProps = Readonly<ExtractPropTypes<typeof yearTableProps>>;

export default defineComponent({
  name: 'YearTable',
  props: yearTableProps,
  emits: ['pick', 'pick-click', 'change-range'],
  setup(props, { emit }) {
    const dates = computed(() => {
      const { selectionMode, modelValue, rangeState } = props;
      const rangeSelecting = selectionMode === 'range' && rangeState.selecting;
      return rangeSelecting ? [rangeState.from] : modelValue;
    });

    const startYear = computed(() => Math.floor(props.tableDate.getFullYear() / 10) * 10);

    const cells = computed(() => {
      const cells = [];
      const cellTmpl = {
        text: '',
        selected: false,
        disabled: false,
      };

      const selectedDays = (dates.value as any[])
        .filter(Boolean).map(date => clearHours(new Date(date.getFullYear(), 0, 1)));
      const focusedDate = clearHours(new Date(props.focusedDate.getFullYear(), 0, 1));

      for (let i = 0; i < 10; i++) {
        const cell = JSON.parse(JSON.stringify(cellTmpl));
        cell.date = new Date(startYear.value + i, 0, 1);
        cell.disabled = typeof props.disabledDate === 'function'
          && props.disabledDate(cell.date)
          && props.selectionMode === 'year';
        const day = clearHours(cell.date);
        cell.selected = selectedDays.includes(day);
        cell.focused = day === focusedDate;
        cells.push(cell);
      }

      return cells;
    });

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
      // <div>123</div>
      <div class={[
        this.resolveClassName('date-picker-cells'),
        this.resolveClassName('date-picker-cells-year'),
      ]}>
        {
          this.cells.map(cell => (
            <span class={this.getCellCls(cell)}
              onClick={() => this.handleClick(cell)}
              onMouseenter={() => this.handleMouseMove(cell)}>
              <em>{cell.date.getFullYear()}</em>
            </span>
            // <div
            //   class={this.resolveClassName('picker-panel-shortcut')}
            //   onClick={() => this.handleShortcutClick(shortcut)}>
            //   {shortcut.text}
            // </div>
          ))
        }
      </div>
    );
  },
});
