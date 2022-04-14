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
import { defineComponent } from 'vue';

import { classes, PropTypes } from '@bkui-vue/shared';

import Circle from './circle';
import Line from './line';

export type ValidatorFunction<T> = (value: T) => boolean;

export default defineComponent({
  name: 'Progress',
  props: {
    extCls: PropTypes.string,
    type: PropTypes.string
      .validate((value: any) => ['line', 'circle', 'dashboard'].includes(value))
      .def('line'),
    percent: PropTypes.number.def(0),
    theme: PropTypes.theme().def('primary'),
    size: PropTypes.size(),
    width: PropTypes.number.def(126),
    strokeWidth: PropTypes.number,
    strokeLinecap: PropTypes.string.def('round'),
    textInside: PropTypes.bool.def(false),
    showText: PropTypes.bool.def(true),
    color: PropTypes.string,
    bgColor: PropTypes.string,
    fixed: PropTypes.number
      .validate((value: any) => value >= 0 && value <= 20)
      .def(0),
    format: PropTypes.func.def((percent: number): string => `${percent}%`),
    titleStyle: PropTypes.object.def({
      fontSize: '16px',
      verticalAlign: 'middle',
    }),

  },
  setup() {
    return {

    };
  },
  methods: {
    /** 验证进度值 */
    validPercent(percent?: number) {
      if (!percent || percent < 0) {
        return 0;
      }
      if (percent > 100) {
        return 100;
      }
      return percent;
    },
    /** text 区域展示内容*/
    renderProcessInfo() {
      const { showText, format, percent, textInside, titleStyle, fixed } = this.$props;
      const formatPercent = format(this.validPercent(percent)?.toFixed(fixed));

      if ((showText || this.$slots.default) && textInside) {
        return this.$slots.default ? this.$slots.default() : <span>{ formatPercent }</span>;
      }
      if (!showText || textInside) return null;
      return (
        <span
          class='progress-text'
          style={ typeof formatPercent === 'string' ? titleStyle : undefined }
        >
          {
            this.$slots.default ? this.$slots.default() : formatPercent
          }
        </span>
      );
    },
  },
  render() {
    const progressInfo = this.renderProcessInfo();

    const $props = {
      ...this.$props,
      percent: this.validPercent(this.percent),
    };

    let progress = <Line {...$props}>{progressInfo}</Line>;

    if (this.type === 'circle' || this.type === 'dashboard') {
      progress = <Circle {...$props}>{progressInfo}</Circle>;
    }

    const progressProps = {
      class: classes({ extCls: !!this.extCls }, `bk-progress bk-progress-${this.type}`),
    };
    return <div {...progressProps}>{progress}</div>;
  },
});
