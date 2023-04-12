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

import { debounce } from 'lodash';
import type { ExtractPropTypes, PropType } from 'vue';
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue';

import { resolveClassName, scrollTop } from '@bkui-vue/shared';

import { timePanelProps } from '../props';
import { firstUpperCase } from '../utils';

const timeSpinnerProps = {
  hours: {
    type: [Number, String],
    default: NaN,
  },
  minutes: {
    type: [Number, String],
    default: NaN,
  },
  seconds: {
    type: [Number, String],
    default: NaN,
  },
  showSeconds: {
    type: Boolean,
    default: true,
  },
  steps: {
    type: Array as PropType<Array<number>>,
    default: () => [],
  },
};

export type TimeSpinnerProps = Readonly<ExtractPropTypes<typeof timeSpinnerProps>>;

const timeParts = ['hours', 'minutes', 'seconds'];

export default defineComponent({
  name: 'TimeSpinner',
  props: {
    ...timeSpinnerProps,
    ...timePanelProps,
  },
  emits: ['change', 'pick-click'],
  setup(props, { emit }) {
    const state = reactive({
      spinerSteps: [1, 1, 1].map((one, i) => Math.abs(props.steps[i]) || one),
      compiled: false,
      focusedColumn: -1,
      focusedTime: [0, 0, 0],
    });

    const hoursList = computed(() => {
      const hours = [];
      const step = state.spinerSteps[0];
      const focusedHour = state.focusedColumn === 0 && state.focusedTime[0];
      const hourTmpl = {
        text: 0,
        selected: false,
        disabled: false,
        hide: false,
      };

      for (let i = 0; i < 24; i += step) {
        const hour = JSON.parse(JSON.stringify(hourTmpl));
        hour.text = i;
        hour.focused = i === focusedHour;

        if (props.disabledHours.length && props.disabledHours.indexOf(i) > -1) {
          hour.disabled = true;
          if (props.hideDisabledOptions) {
            hour.hide = true;
          }
        }
        if (props.hours === i) {
          hour.selected = true;
        }
        hours.push(hour);
      }

      return hours;
    });

    const minutesList = computed(() => {
      const minutes = [];
      const step = state.spinerSteps[1];
      const focusedMinute = state.focusedColumn === 1 && state.focusedTime[1];
      const minuteTmpl = {
        text: 0,
        selected: false,
        disabled: false,
        hide: false,
      };

      for (let i = 0; i < 60; i += step) {
        const minute = JSON.parse(JSON.stringify(minuteTmpl));
        minute.text = i;
        minute.focused = i === focusedMinute;

        if (props.disabledMinutes.length && props.disabledMinutes.indexOf(i) > -1) {
          minute.disabled = true;
          if (props.hideDisabledOptions) {
            minute.hide = true;
          }
        }
        if (props.minutes === i) {
          minute.selected = true;
        }
        minutes.push(minute);
      }
      return minutes;
    });

    const secondsList = computed(() => {
      const seconds = [];
      const step = state.spinerSteps[2];
      const focusedMinute = state.focusedColumn === 2 && state.focusedTime[2];
      const secondTmpl = {
        text: 0,
        selected: false,
        disabled: false,
        hide: false,
      };

      for (let i = 0; i < 60; i += step) {
        const second = JSON.parse(JSON.stringify(secondTmpl));
        second.text = i;
        second.focused = i === focusedMinute;

        if (props.disabledSeconds.length && props.disabledSeconds.indexOf(i) > -1) {
          second.disabled = true;
          if (props.hideDisabledOptions) {
            second.hide = true;
          }
        }
        if (props.seconds === i) {
          second.selected = true;
        }
        seconds.push(second);
      }

      return seconds;
    });

    const styles = computed(() => ({
      width: props.showSeconds ? '33.33%' : '50%',
    }));

    watch(() => props.hours, (val) => {
      if (!state.compiled) {
        return;
      }
      scroll('hours', hoursList.value.findIndex(obj => obj.text === val));
    });

    watch(() => props.minutes, (val) => {
      if (!state.compiled) {
        return;
      }
      scroll('minutes', minutesList.value.findIndex(obj => obj.text === val));
    });

    watch(() => props.seconds, (val) => {
      if (!state.compiled) {
        return;
      }
      scroll('seconds', minutesList.value.findIndex(obj => obj.text === val));
    });

    watch(() => state.focusedTime, (updated, old) => {
      timeParts.forEach((part, i) => {
        if (updated[i] === old[i] || typeof updated[i] === 'undefined') {
          return;
        }
        const valueIndex = this[`${part}List`].findIndex(obj => obj.text === updated[i]);
        scroll(part, valueIndex);
      });
    });

    onMounted(() => {
      nextTick(() => {
        state.compiled = true;
        bindWheelEvent();
      });
    });

    function getDomRef(type) {
      let domRef;
      if (type === 'hours') {
        domRef = hoursRef;
      } else if (type === 'minutes') {
        domRef = minutesRef;
      } else {
        domRef = secondsRef;
      }
      return domRef.value;
    }

    function getCellCls(cell) {
      return [
        resolveClassName('time-picker-cells-cell'),
        {
          [resolveClassName('time-picker-cells-cell-selected')]: cell.selected,
          [resolveClassName('time-picker-cells-cell-focused')]: cell.focused,
          [resolveClassName('time-picker-cells-cell-disabled')]: cell.disabled,
        },
      ];
    }

    function bindWheelEvent() {
      const bindFunction = (type) => {
        const domRef = getDomRef(type);
        domRef.addEventListener('wheel', debounce(() => {
          handleWheel(type);
        }, 32), { passive: true });
      };
      bindFunction('hours');
      bindFunction('minutes');
      bindFunction('seconds');
    }

    function typeItemHeight(type) {
      const domRef = getDomRef(type);
      return domRef.querySelector('li').offsetHeight;
    }

    function scrollBarHeight(type) {
      const domRef = getDomRef(type);
      return domRef.offsetHeight;
    }

    function handleWheel(type) {
      const domRef = getDomRef(type);
      const value = Math.min(
        Math.round((domRef.scrollTop - (scrollBarHeight(type) * 0.5 - 10) / typeItemHeight(type) + 3)
            / typeItemHeight(type)),
        (type === 'hours' ? 23 : 59),
      );
      let list;
      if (type === 'hours') {
        list = hoursList;
      } else if (type === 'minutes') {
        list = minutesList;
      } else {
        list = secondsList;
      }
      const item = list.value.find(data => data.text === value);
      if (item.disabled) {
        return false;
      }
      nextTick(() => {
        emitChange({ [type]: value });
      });
    }

    function handleClick(type, cell) {
      if (cell.disabled) {
        return;
      }
      const data = { [type]: cell.text };
      emitChange(data);
    }

    function emitChange(changes) {
      emit('change', changes);
      emit('pick-click');
    }

    function scroll(type, index) {
      const domRef = getDomRef(type);
      const from = domRef.scrollTop;
      const to = 32 * getScrollIndex(type, index);
      scrollTop(domRef, from, to, 500);
    }

    function getScrollIndex(type, index) {
      const t = firstUpperCase(type);
      const disabled = props[`disabled${t}`];
      let ret: number = index;
      if (disabled.length && props.hideDisabledOptions) {
        let count = 0;
        disabled.forEach(item => (item <= index ? count += 1 : ''));
        ret -= count;
      }
      return ret;
    }

    function updateScroll() {
      nextTick(() => {
        timeParts.forEach((type) => {
          const domRef = getDomRef(type);
          let list;
          if (type === 'hours') {
            list = hoursList;
          } else if (type === 'minutes') {
            list = minutesList;
          } else {
            list = secondsList;
          }

          domRef.scrollTop = 32 * list.value.findIndex(obj => obj.text === props[type]);
        });
      });
    }

    function padTime(text) {
      return text < 10 ? `0${text}` : text;
    }

    const hoursRef = ref(null);
    const minutesRef = ref(null);
    const secondsRef = ref(null);

    return {
      ...toRefs(state),
      hoursList,
      minutesList,
      secondsList,
      styles,

      hoursRef,
      minutesRef,
      secondsRef,

      getCellCls,
      handleClick,
      updateScroll,
      padTime,
    };
  },
  render() {
    return (
      <div
        class={[
          resolveClassName('time-picker-cells'),
          this.showSeconds ? resolveClassName('time-picker-cells-with-seconds') : '',
        ]}
      >
        <div class={resolveClassName('time-picker-cells-title-wrapper')}>
          <div class={[resolveClassName('time-picker-cells-title'), this.focusedColumn === 0 ? 'active' : '']} style={this.styles}>时</div>
          <div class={[resolveClassName('time-picker-cells-title'), this.focusedColumn === 1 ? 'active' : '']} style={this.styles}>分</div>
          <div class={[resolveClassName('time-picker-cells-title'), this.focusedColumn === 2 ? 'active' : '']} v-show={this.showSeconds} style={this.styles}>秒</div>
        </div>
        <div class={resolveClassName('time-picker-cells-list')} ref="hoursRef" style={this.styles}>
          <ul class={resolveClassName('time-picker-cells-ul')}>
            {
              this.hoursList.map(item => (
                <li class={this.getCellCls(item)} v-show={!item.hide} onClick={() => this.handleClick('hours', item)}>{this.padTime(item.text)}</li>
              ))
            }
          </ul>
        </div>
        <div class={resolveClassName('time-picker-cells-list')} ref="minutesRef" style={this.styles}>
          <ul class={resolveClassName('time-picker-cells-ul')}>
            {
              this.minutesList.map(item => (
                <li class={this.getCellCls(item)} v-show={!item.hide} onClick={() => this.handleClick('minutes', item)}>{this.padTime(item.text)}</li>
              ))
            }
          </ul>
        </div>
        <div class={resolveClassName('time-picker-cells-list')} v-show={this.showSeconds} ref="secondsRef" style={this.styles}>
          <ul class={resolveClassName('time-picker-cells-ul')}>
            {
              this.secondsList.map(item => (
                <li class={this.getCellCls(item)} v-show={!item.hide} onClick={() => this.handleClick('seconds', item)}>{this.padTime(item.text)}</li>
              ))
            }
          </ul>
        </div>
      </div>
    );
  },
});
