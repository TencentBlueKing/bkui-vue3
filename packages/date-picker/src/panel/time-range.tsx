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

import type { ExtractPropTypes, PropType } from 'vue';
import {
  computed,
  defineComponent,
  inject,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue';

import { capitalize } from '@bkui-vue/shared';

import TimeSpinner from '../base/time-spinner';
import fecha from '../fecha';
import { datePickerProps, timePanelProps } from '../props';
import { initTime, timePickerKey } from '../utils';

const timeRangeProps = {
  steps: {
    type: Array as PropType<Array<number>>,
    default: () => [],
  },
  format: {
    type: String,
    default: 'HH:mm:ss',
  },
  value: {
    type: Array,
    required: true,
  },
  // 是否允许时间跨天选择,即起始时间小于终止时间, allow-cross-day属性只在time-picker组件type为timerange时生效
  allowCrossDay: {
    type: Boolean,
    default: false,
  },
};

export type TimeRangePanelProps = Readonly<ExtractPropTypes<typeof timeRangeProps>>;

export default defineComponent({
  name: 'TimeRangePanel',
  props: {
    ...datePickerProps,
    ...timePanelProps,
    ...timeRangeProps,
  },
  emits: ['pick', 'pick-click'],
  setup(props, { emit }) {
    const [dateStart, dateEnd] = props.value.slice();
    const state = reactive({
      showDate: false,
      dateStart: (dateStart || initTime()) as Date,
      dateEnd: (dateEnd || initTime()) as Date,
    });

    const parentProvide = inject(timePickerKey);

    const showSeconds = computed(() => !(props.format || '').match(/mm$/));
    const leftDatePanelLabel = computed(() => fecha.format(parentProvide.dates[0], props.format));
    const rightDatePanelLabel = computed(() => fecha.format(parentProvide.dates[1], props.format));

    watch(() => props.value, (dates) => {
      const [dateStart, dateEnd] = dates.slice();
      state.dateStart = (dateStart || initTime()) as any;
      state.dateEnd = (dateEnd || initTime()) as any;
    });

    onMounted(() => {
      if (parentProvide && parentProvide.parentName === 'DatePanel') {
        state.showDate = true;
      }
    });

    // const timeSpinnerRef = ref(null);

    // const showSeconds = computed(() => !(props.format || '').match(/mm$/));
    // const visibleDate = computed(() => fecha.format(parentProvide.panelDate, props.format));

    // const timeSlots = computed(() => {
    //   if (!props.value[0]) {
    //     return [];
    //   }
    //   return ['getHours', 'getMinutes', 'getSeconds'].map(slot => state.date[slot]());
    // });

    // const disabledHMS = computed<IDisabledHMS>(() => {
    //   const disabledTypes = ['disabledHours', 'disabledMinutes', 'disabledSeconds'];
    //   if (props.disabledDate === (() => false || !props.value[0])) {
    //     const disabled = disabledTypes.reduce((obj, type) => {
    //       obj[type] = this[type];
    //       return obj;
    //     }, {});
    //     return disabled;
    //   }
    //   const slots = [24, 60, 60];
    //   const disabled = ['Hours', 'Minutes', 'Seconds'].map(type => props[`disabled${type}`]);
    //   const disabledHMS = disabled.map((preDisabled, j) => {
    //     const slot = slots[j];
    //     const toDisable = preDisabled;
    //     for (let i = 0; i < slot; i += (props.steps[j] || 1)) {
    //       const hms: number[] = timeSlots.value.map((slot, x) => (x === j ? i : slot));
    //       const testDateTime = mergeDateHMS(state.date, ...hms);
    //       if (props.disabledDate(testDateTime, true)) {
    //         toDisable.push(i);
    //       }
    //     }
    //     return toDisable.filter((el, i, arr) => arr.indexOf(el) === i);
    //   });
    //   return disabledTypes.reduce((obj, type, i) => {
    //     obj[type] = disabledHMS[i];
    //     return obj;
    //   }, {});
    // });

    // function handleChange(date, isEmit = true) {
    //   const newDate = new Date(state.date);
    //   Object.keys(date).forEach(type => newDate[`set${capitalize(type)}`](date[type]));

    //   if (isEmit) {
    //     emit('pick', newDate, true, 'time');
    //   }
    // }

    function handlePickClick() {
      emit('pick-click');
    }

    function handleChange(idx, start, end, isEmit = true) {
      let dateStart = new Date(state.dateStart);
      let dateEnd = new Date(state.dateEnd);

      Object.keys(start).forEach((type) => {
        dateStart[`set${capitalize(type)}`](start[type]);
      });

      Object.keys(end).forEach((type) => {
        dateEnd[`set${capitalize(type)}`](end[type]);
      });

      if (!props.allowCrossDay && (dateEnd < dateStart)) {
        // 左边变化
        if (idx === 'start') {
          dateEnd = dateStart;
        }
        // 右边变化
        if (idx === 'end') {
          dateStart = dateEnd;
        }
      }

      if (isEmit) {
        emit('pick', [dateStart, dateEnd], true, 'time');
      }
    }

    function handleStartChange(date) {
      handleChange('start', date, {});
    }

    function handleEndChange(date) {
      handleChange('end', {}, date);
    }

    const timeSpinnerRef = ref(null);
    const timeSpinnerEndRef = ref(null);

    function updateScroll() {
      timeSpinnerRef?.value?.updateScroll();
      timeSpinnerEndRef?.value?.updateScroll();
    }

    return {
      ...toRefs(state),
      showSeconds,
      leftDatePanelLabel,
      rightDatePanelLabel,
      handleStartChange,
      handleEndChange,
      handlePickClick,
      updateScroll,

      timeSpinnerRef,
      timeSpinnerEndRef,
    };
  },
  render() {
    return (
      <div
        class={[
          'bk-picker-panel-body-wrapper',
          'bk-time-picker-with-range',
          (this.showSeconds) ? 'bk-time-picker-with-seconds' : '',
        ]}
        onMousedown={(e) => {
          e.preventDefault();
        }}
      >
        <div class="bk-picker-panel-body" style={{ width: `${this.width * 2}px` }}>
          <div class="bk-picker-panel-content bk-picker-panel-content-left" style={{ width: `${this.width}px` }}>
            {
              this.showDate
                ? (
                  <div class="bk-time-picker-header">{this.leftDatePanelLabel}</div>
                )
                : ''
            }
            <TimeSpinner
              ref="timeSpinnerRef"
              steps={this.steps}
              showSeconds={this.showSeconds}
              hours={this.value[0] && this.dateStart.getHours()}
              minutes={this.value[0] && this.dateStart.getMinutes()}
              seconds={this.value[0] && this.dateStart.getSeconds()}
              disabledHours={this.disabledHours}
              disabledMinutes={this.disabledMinutes}
              disabledSeconds={this.disabledSeconds}
              hideDisabledOptions={this.hideDisabledOptions}
              onChange={this.handleStartChange}
              onPick-click={this.handlePickClick} />
          </div>
          <div class="bk-picker-panel-content bk-picker-panel-content-right" style={{ width: `${this.width}px` }}>
            {
              this.showDate
                ? (
                  <div class="bk-time-picker-header">{this.rightDatePanelLabel}</div>
                )
                : ''
            }
            <TimeSpinner
              ref="timeSpinnerEndRef"
              steps={this.steps}
              showSeconds={this.showSeconds}
              hours={this.value[1] && this.dateEnd.getHours()}
              minutes={this.value[1] && this.dateEnd.getMinutes()}
              seconds={this.value[1] && this.dateEnd.getSeconds()}
              disabledHours={this.disabledHours}
              disabledMinutes={this.disabledMinutes}
              disabledSeconds={this.disabledSeconds}
              hideDisabledOptions={this.hideDisabledOptions}
              onChange={this.handleEndChange}
              onPick-click={this.handlePickClick} />
          </div>
        </div>
      </div>
    );
  },
});
