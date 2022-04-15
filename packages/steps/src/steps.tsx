/**
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

import { defineComponent, ExtractPropTypes, onMounted, ref } from 'vue';

import { Circle, Done, Error } from '@bkui-vue/icon';
import { classes, PropTypes } from '@bkui-vue/shared';

const stepsProps = {
  theme: PropTypes.theme().def('primary'),
  size: PropTypes.size(),
  curStep: PropTypes.number.def(1),
  controllable: PropTypes.bool.def(false),
  direction: PropTypes.commonType(['horizontal', 'vertical'], 'direction').def('horizontal'),
  status: PropTypes.commonType(['', 'error', 'loading'], 'status').def(''),
  lineType: PropTypes.commonType(['dashed', 'solid'], 'lineType').def('dashed'),
  text: PropTypes.bool,
  extCls: PropTypes.string,
  steps: PropTypes.array.def([]),
  beforeChange: PropTypes.func,
};

export type StepsPropTypes = ExtractPropTypes<typeof stepsProps>;

export default defineComponent({
  name: 'Steps',
  props: stepsProps,
  emits: ['update:curStep', 'click'],

  setup(props: StepsPropTypes, { emit }) {
    const defaultSteps = ref([]);

    const updateSteps = (steps) => {
      const defaults = [];
      steps.forEach((step) => {
        if (typeof step === 'string') {
          defaults.push(step);
        } else {
          defaults.push({
            title: step.title,
            icon: step.icon,
            description: step.description,
            status: step.status,
          });
        }
      });
      defaultSteps.value.splice(0, defaultSteps.value.length, ...defaults);
    };

    const init = () => {
      defaultSteps.value.splice(0, defaultSteps.value.length, ...[
        {
          title: '步骤1',
          icon: 1,
        },
        {
          title: '步骤2',
          icon: 2,
        },
        {
          title: '步骤3',
          icon: 3,
        },
      ]);
      if (props.steps?.length) {
        updateSteps(props.steps);
      }
    };

    const jumpTo = async (index) => {
      try {
        if (props.controllable && index !== props.curStep) {
          if (typeof props.beforeChange === 'function') {
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            await new Promise(async (resolve, reject) => {
              const confirmed = await props.beforeChange(index);
              confirmed ? resolve(confirmed) : reject(confirmed);
            });
          }
          emit('update:curStep', index);
          emit('click', index);
        }
      } catch (e) {
        console.warn(e);
      }
    };

    onMounted(init);

    return {
      defaultSteps,
      jumpTo,
    };
  },

  render() {
    const stepsClsPrefix = 'bk-steps';
    const stepsThemeCls: string = this.theme ? `${stepsClsPrefix}-${this.theme}` : '';
    const stepsSizeCls: string = this.size ? `${stepsClsPrefix}-${this.size}` : '';
    const stepsCls: string = classes({
      [`${this.extCls}`]: !!this.extCls,
      [`bk-steps-${this.direction}`]: this.direction,
      [`bk-steps-${this.lineType}`]: this.lineType,
    }, `${stepsThemeCls} ${stepsClsPrefix} ${stepsSizeCls}`);


    const isDone = index => this.curStep > (index + 1) || this.defaultSteps[index].status === 'done';

    const isCurrent = index => this.curStep === (index + 1);

    const iconType = (step) => {
      const { icon } = step;

      if (icon) {
        return Object.prototype.toString.call(icon) === '[object Object]';
      }
      return typeof step === 'string';
    };

    const isIcon = (index, step) => (step.icon ? step.icon : index + 1);

    const isLoadingStatus =  step => step.status === 'loading';

    const isErrorStatus = step => step.status === 'error';

    const renderIcon = (index, step) => {
      if ((isCurrent(index) && this.status === 'loading') || isLoadingStatus(step)) {
        return (<Circle class="bk-icon bk-steps-icon icon-loading" />);
      }  if ((isCurrent(index) && this.status === 'error') || isErrorStatus(step)) {
        return (<Error class="bk-steps-icon" />);
      } if (isDone(index)) {
        return (<Done class="bk-steps-icon" />);
      }

      return (<span class="number">{isIcon(index, step)}</span>);
    };

    return (
      <div class={stepsCls}>
        {
          this.defaultSteps.map((step, index) => <div class={
          ['bk-step',
            !step.title ? 'bk-step-no-content' : '',
            isDone(index) ? 'done' : '',
            isCurrent(index) ? 'current' : '',
            step.status && isCurrent(index) ? [`bk-step-${step.status}`] : '',
          ]
        }>
          <span
            class={['bk-step-indicator', `bk-step-${iconType(step) ? 'icon' : 'number'}`]}
            style={{ cursor: this.controllable ? 'pointer' : '' }}
            onClick={() => {
              this.jumpTo(index + 1);
            }}>
              {this.$slots[index + 1]?.() ?? renderIcon(index, step)}
          </span>
          {
            step.title
              ? <div class="bk-step-content">
              <div
                class="bk-step-title" style={{ cursor: this.controllable ? 'pointer' : '' }}
                onClick={() => {
                  this.jumpTo(index + 1);
                }}>
                {step.title}
              </div>
              {step.description
              && (<div class="bk-step-description" title={step.description}>
                {step.description}
              </div>)}
            </div>
              : ''
          }
        </div>)
        }
      </div>
    );
  },

});
