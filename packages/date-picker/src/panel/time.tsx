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
  // InjectionKey,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { capitalize } from '@bkui-vue/shared';

import TimeSpinner from '../base/time-spinner';
import fecha from '../fecha';
// import type { DatePickerValueType } from '../interface';
import { IDisabledHMS } from '../interface';
import { datePickerProps, timePanelProps } from '../props';
import { initTime, mergeDateHMS, timePickerKey } from '../utils';

const timeProps = {
  disabledDate: {
    type: Function,
    default: () => false,
  },
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
    // type: [Date, String, Number, Array] as PropType<DatePickerValueType | null>,
    required: true,
  },
  confirm: {
    type: Boolean,
    default: false,
  },
};

export type TimePanelProps = Readonly<ExtractPropTypes<typeof timeProps>>;

// function injectStrict<T>(key: InjectionKey<T>, fallback?: T) {
//   const resolved = inject(key, fallback);
//   if (!resolved) {
//     throw new Error(`Could not resolve ${key.description}`);
//   }
//   return resolved;
// }

export default defineComponent({
  name: 'TimePanel',
  props: {
    ...datePickerProps,
    ...timePanelProps,
    ...timeProps,
  },
  emits: ['pick', 'pick-click'],
  setup(props, { emit }) {
    const state = reactive({
      date: (props.value[0] || initTime()) as Date,
      showDate: false,
    });

    // const parentProvide = injectStrict(timePickerKey);
    const parentProvide = inject(timePickerKey);

    const timeSpinnerRef = ref(null);

    const showSeconds = computed(() => !(props.format || '').match(/mm$/));
    const visibleDate = computed(() => fecha.format(parentProvide.panelDate, props.format));

    const timeSlots = computed(() => {
      if (!props.value[0]) {
        return [];
      }
      return ['getHours', 'getMinutes', 'getSeconds'].map(slot => state.date[slot]());
    });

    const disabledHMS = computed<IDisabledHMS>(() => {
      const disabledTypes = ['disabledHours', 'disabledMinutes', 'disabledSeconds'];
      if (props.disabledDate === (() => !props.value[0])) {
        const disabled = disabledTypes.reduce((obj, type) => {
          obj[type] = this[type];
          return obj;
        }, {});
        return disabled;
      }
      const slots = [24, 60, 60];
      const disabled = ['Hours', 'Minutes', 'Seconds'].map(type => props[`disabled${type}`]);
      const disabledHMS = disabled.map((preDisabled, j) => {
        const slot = slots[j];
        const toDisable = preDisabled;
        for (let i = 0; i < slot; i += props.steps[j] || 1) {
          const hms: number[] = timeSlots.value.map((slot, x) => (x === j ? i : slot));
          const testDateTime = mergeDateHMS(state.date, ...hms);
          if (props.disabledDate(testDateTime, true)) {
            toDisable.push(i);
          }
        }
        return toDisable.filter((el, i, arr) => arr.indexOf(el) === i);
      });
      return disabledTypes.reduce((obj, type, i) => {
        obj[type] = disabledHMS[i];
        return obj;
      }, {});
    });

    watch(
      () => props.value,
      dates => {
        let newVal: any = dates[0] || initTime();
        newVal = new Date(newVal);
        state.date = newVal;
      },
    );

    onMounted(() => {
      if (parentProvide && parentProvide.parentName === 'DatePanel') {
        state.showDate = true;
      }
    });

    function handleChange(date, isEmit = true) {
      const newDate = new Date(state.date);
      Object.keys(date).forEach(type => newDate[`set${capitalize(type)}`](date[type]));

      if (isEmit) {
        emit('pick', newDate, true, 'time');
      }
    }

    function handlePickClick() {
      emit('pick-click');
    }

    const { resolveClassName } = usePrefix();

    return {
      ...toRefs(state),
      visibleDate,
      showSeconds,
      timeSlots,
      disabledHMS,

      timeSpinnerRef,

      handlePickClick,
      handleChange,
      resolveClassName,
    };
  },
  render() {
    return (
      <div
        class={this.resolveClassName('picker-panel-body-wrapper')}
        onMousedown={e => {
          e.preventDefault();
        }}
      >
        <div
          class={this.resolveClassName('picker-panel-body')}
          style={{ width: `${this.width}px` }}
        >
          {this.showDate ? <div class={this.resolveClassName('time-picker-header')}>{this.visibleDate}</div> : ''}
          <div class={this.resolveClassName('picker-panel-content')}>
            <TimeSpinner
              ref='timeSpinnerRef'
              showSeconds={this.showSeconds}
              steps={this.steps}
              hours={this.timeSlots[0]}
              minutes={this.timeSlots[1]}
              seconds={this.timeSlots[2]}
              disabledHours={this.disabledHMS.disabledHours}
              disabledMinutes={this.disabledHMS.disabledMinutes}
              disabledSeconds={this.disabledHMS.disabledSeconds}
              hideDisabledOptions={this.hideDisabledOptions}
              onPick-click={this.handlePickClick}
              onChange={this.handleChange}
            />
          </div>
        </div>
      </div>
    );
  },
});
