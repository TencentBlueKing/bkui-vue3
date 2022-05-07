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

// import type { Placement } from '@popperjs/core';
// import { bkZIndexManager, BKPopover, IBKPopover } from '@bkui-vue/shared';
import type { ExtractPropTypes } from 'vue';
import {
  // onMounted,
  // onBeforeUnmount,
  computed,
  defineComponent,
  PropType,
  reactive,
  ref,
  toRefs,
  // nextTick,
} from 'vue';

import { AngleDoubleLeft, AngleDoubleRight, AngleLeft, AngleRight } from '@bkui-vue/icon';

import Confirm from '../base/confirm';
import DateTable from '../base/date-table';
import type {
  DatePickerShortcutsType,
  DatePickerValueType,
  DisableDateType,
  SelectionModeType,
} from '../interface';
import { formatDateLabels, iconBtnCls, siblingMonth } from '../utils';

const datePanelProps = {
  modelValue: {
    type: [Date, String, Number, Array] as PropType<DatePickerValueType | null>,
  },
  shortcuts: {
    type: Array as PropType<DatePickerShortcutsType>,
    default: () => [],
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  shortcutClose: {
    type: Boolean,
    default: false,
  },
  selectionMode: {
    type: String as PropType<SelectionModeType>,
    default: 'date',
    validator(v) {
      if (['year', 'month', 'date', 'time'].indexOf(v) < 0) {
        console.error(`selectionMode property is not valid: '${v}'`);
        return false;
      }
      return true;
    },
  },
  startDate: {
    type: Date,
  },
  disableDate: Function as PropType<DisableDateType>,
  focusedDate: {
    type: Date,
    required: true,
  },
  confirm: {
    type: Boolean,
    default: false,
  },
  showTime: {
    type: Boolean,
    default: false,
  },
} as const;

export type DatePanelProps = Readonly<ExtractPropTypes<typeof datePanelProps>>;

export default defineComponent({
  props: datePanelProps,
  emits: ['pick', 'pick-success', 'pick-clear'],
  setup(props, { emit }) {
    const getTableType = currentView => (currentView.match(/^time/) ? 'time-picker' : `${currentView}-table`);

    const dates = (props.modelValue as DatePickerValueType[]).slice().sort();

    const state = reactive({
      currentView: props.selectionMode || 'date',
      pickerTable: getTableType(props.selectionMode),
      dates,
      panelDate: props.startDate || dates[0] || new Date(),
    });

    const resetView = () => {
      setTimeout(
        () => {
          state.currentView = props.selectionMode;
        },
        500,
      );
    };

    const handlePreSelection = (value) => {
      state.panelDate = value;
      if (state.pickerTable === 'year-table') {
        state.pickerTable = 'month-table';
      } else {
        state.pickerTable = getTableType(state.currentView);
      }
    };

    const handlePick = (value, type) => {
      let val = value;
      if (props.selectionMode === 'year') {
        val = new Date(value.getFullYear(), 0, 1);
      } else if (props.selectionMode === 'month') {
        val = new Date((state.panelDate as Date).getFullYear(), value.getMonth(), 1);
      } else {
        val = new Date(value);
      }

      state.dates = [val];
      emit('pick', val, false, type || props.selectionMode);
    };

    const handlePickSuccess = () => {
      resetView();
      emit('pick-success');
    };

    const handlePickClear = () => {
      resetView();
      emit('pick-clear');
    };

    const handleShortcutClick = (shortcut) => {
      if (shortcut.value) {
        // pick 参数：dates, visible, type, isUseShortCut
        emit('pick', shortcut.value(), false, undefined, shortcut);
      }
      if (shortcut.onClick) {
        shortcut.onClick(this);
      }
      if (props.shortcutClose) {
        handlePickSuccess();
      }
    };

    const reset = () => {
      state.currentView = props.selectionMode;
      state.pickerTable = getTableType(state.currentView);
    };

    const changeYear = (dir) => {
      if (props.selectionMode === 'year' || state.pickerTable === 'year-table') {
        state.panelDate = new Date((state.panelDate as Date).getFullYear() + dir * 10, 0, 1);
      } else {
        state.panelDate = siblingMonth(state.panelDate, dir * 12);
      }
    };

    const changeMonth = (dir) => {
      state.panelDate = siblingMonth(state.panelDate, dir);
    };

    const timeSpinner = ref(null);
    const timeSpinnerEnd = ref(null);

    const onToggleVisibility = (open) => {
      if (open) {
        timeSpinner?.value?.updateScroll();
        timeSpinnerEnd?.value?.updateScroll();
      }
    };

    const panelPickerHandlers = computed(() => (state.pickerTable === `${state.currentView}-table` ? handlePick : handlePreSelection));

    const datePanelLabel = computed(() => {
      const locale = 'zh-CN';
      const datePanelLabelStr = '[yyyy]-[mm]';
      const date = state.panelDate;
      const { labels, separator } = formatDateLabels(locale, datePanelLabelStr, date);

      const handler = type => () => {
        state.pickerTable = getTableType(type);
      };

      return {
        separator,
        labels: labels.map((obj: any) => {
          const ret = obj;
          ret.handler = handler(obj.type);
          return ret;
        }),
      };
    });

    const showLabelFirst = computed(() => (datePanelLabel as any).value.labels[0].type === 'year' || state.currentView === 'date');

    const showLabelSecond = computed(() => (datePanelLabel as any).value.labels[1].type === 'year' || state.currentView === 'date');

    const isTime = computed(() => state.currentView === 'time');

    const handleToggleTime = () => {
      state.currentView = state.currentView === 'time' ? 'date' : 'time';
    };

    return {
      ...toRefs(state),
      panelPickerHandlers,
      datePanelLabel,
      showLabelFirst,
      showLabelSecond,
      handleShortcutClick,
      changeYear,
      changeMonth,
      reset,
      isTime,
      onToggleVisibility,
      handleToggleTime,
      handlePickSuccess,
      handlePickClear,
    };
  },
  render() {
    return (
      <div
        class={[
          'bk-picker-panel-body-wrapper',
          this.shortcuts.length ? 'bk-picker-panel-with-sidebar' : '',
        ]}
        onMousedown={(e: MouseEvent) => {
          e.preventDefault();
        }}
      >
      {
        this.shortcuts.length
          ? (
            <div class="bk-picker-panel-sidebar">
              {
                this.shortcuts.map(shortcut => (
                  <div class="bk-picker-panel-shortcut" onClick={() => this.handleShortcutClick(shortcut)}>
                    {shortcut.text}
                  </div>
                ))
              }
            </div>
          )
          : ''
      }
        <div class="bk-picker-panel-body" style="width: 261px;">
          <div class="bk-date-picker-header" v-show={this.currentView !== 'time'}>
            <span class={iconBtnCls('prev', '-double')} onClick={() => this.changeYear(-1)}>
              {/* <i class="bk-icon icon-angle-double-left"></i> */}
              <AngleDoubleLeft style={{ fontSize: '20px', lineHeight: 1 }}></AngleDoubleLeft>
            </span>
            {
              this.pickerTable === 'date-table'
                ? (
                  <span class={iconBtnCls('prev')} onClick={() => this.changeMonth(-1)} v-show={this.currentView === 'date'}>
                    {/* <i class="bk-icon icon-angle-left"></i> */}
                    <AngleLeft style={{ fontSize: '20px', lineHeight: 1 }}></AngleLeft>
                  </span>
                )
                : ''
            }
            {
              this.datePanelLabel && Object.keys(this.datePanelLabel).length > 0
                ? (
                  <span>
                    <span class="bk-date-picker-header-label" v-show={this.showLabelFirst} onClick={() => this.datePanelLabel.labels[0].handler}>
                      {this.datePanelLabel.labels[0].label}
                    </span>
                    {this.currentView === 'date' ? ` ${this.datePanelLabel.separator} ` : ' '}
                    <span class="bk-date-picker-header-label" v-show={this.showLabelSecond} onClick={() => this.datePanelLabel.labels[1].handler}>
                      {this.datePanelLabel.labels[1].label}
                    </span>
                  </span>
                )
                : ''
            }
            <span class={iconBtnCls('next', '-double')} onClick={() => this.changeYear(+1)}>
              {/* <i class="bk-icon icon-angle-double-right"></i> */}
              <AngleDoubleRight style={{ fontSize: '20px', lineHeight: 1 }}></AngleDoubleRight>
            </span>
            {
              this.pickerTable === 'date-table'
                ? (
                  <span class={iconBtnCls('next')} onClick={() => this.changeMonth(+1)} v-show={this.currentView === 'date'}>
                    {/* <i class="bk-icon icon-angle-right"></i> */}
                    <AngleRight style={{ fontSize: '20px', lineHeight: 1 }}></AngleRight>
                  </span>
                )
                : ''
            }
          </div>
          <div class="bk-picker-panel-content">
            {
              this.currentView !== 'time'
                ? (() => {
                  switch (this.pickerTable) {
                    case 'date-table':
                      return (
                        <DateTable
                          tableDate={this.panelDate as Date}
                          disableDate={this.disableDate}
                          selectionMode={this.selectionMode}
                          modelValue={this.dates as DatePickerValueType}
                          focusedDate={this.focusedDate}
                          onPick={this.panelPickerHandlers} />
                      );
                    default:
                      return null;
                  }
                })()
                : ''
            }
          </div>
          {
            this.confirm
              ? (
                <Confirm
                  clearable={this.clearable}
                  showTime={this.showTime}
                  isTime={this.isTime}
                  onPick-toggle-time={this.handleToggleTime}
                  onPick-clear={this.handlePickClear}
                  onPick-success={this.handlePickSuccess}
                ></Confirm>
              )
              : ''
          }
        </div>
      </div>
    );
  },
});
