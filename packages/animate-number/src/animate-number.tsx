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

import { computed, defineComponent, onBeforeUnmount, onMounted, Ref, ref, watch } from 'vue';

import { PropTypes } from '@bkui-vue/shared';

export default defineComponent({
  name: 'AnimateNumber',
  props: {
    value: PropTypes.number.def(0),
    digits: PropTypes.number.def(0),
  },
  setup(props) {
    let rafId = -1;
    const tweeningValue: Ref<number> = ref(0);
    const formatValue = computed<string>(() => Number(tweeningValue.value).toFixed(props.digits));

    const tween = (startValue, endValue) => {
      // 错误数据返回0
      if (Number.isNaN(+endValue)) return 0;

      const dis = Math.abs(endValue - startValue);
      const isPositive = endValue - startValue > 0 ? 1 : -1;
      const ticDis = Math.ceil((dis / 30) * 10 ** props.digits) / 10 ** props.digits;
      const ticTimes = Math.ceil(dis / ticDis);
      // 算出每次计算需要间隔的时间，保证动画的流畅
      const gapTime = 25 / ticTimes;
      let tickGap = 1;

      const animate = () => {
        if (tickGap < gapTime) {
          rafId = requestAnimationFrame(animate);
          tickGap = tickGap + 1;
          return;
        }

        tweeningValue.value += ticDis * isPositive;

        const isUnDone = isPositive === 1 ? tweeningValue.value < endValue : tweeningValue.value > endValue;
        if (isUnDone) {
          rafId = requestAnimationFrame(animate);
          tickGap = 1;
        } else {
          tweeningValue.value = endValue;
        }
      };

      animate();
    };

    watch(
      () => props.value,
      (newValue, oldValue) => {
        tween(oldValue, newValue);
      },
    );

    onMounted(() => {
      tween(0, props.value);
    });

    onBeforeUnmount(() => {
      cancelAnimationFrame(rafId);
    });

    return () => <span>{formatValue.value}</span>;
  },
});
