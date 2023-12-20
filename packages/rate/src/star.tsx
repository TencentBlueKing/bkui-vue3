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

import { computed, defineComponent } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { classes, PropTypes } from '@bkui-vue/shared';

export default defineComponent({
  name: 'Star',

  props: {
    rate: PropTypes.number.def(0),
    width: PropTypes.number.def(16),
    height: PropTypes.number.def(16),
    editable: PropTypes.bool.def(true),
    hoverRate: PropTypes.number.def(0),
    max: PropTypes.number.def(5),
  },

  emits: ['chooseRate', 'changeHover'],

  setup(props, { emit }) {
    const chooseRate = index => {
      if (!props.editable) return;

      const rate = index + 1;
      emit('chooseRate', rate);
    };

    const changeHover = index => {
      if (!props.editable) return;

      const rate = index + 1;
      emit('changeHover', rate);
    };

    const { resolveClassName } = usePrefix();

    const starClass = index =>
      classes({
        [`${resolveClassName('is-select')}`]: index < Math.floor(displayRate.value),
        [`${resolveClassName('is-edit')}`]: props.editable,
        [`${resolveClassName('rate-star')}`]: true,
      });

    const displayRate = computed(() => props.hoverRate || props.rate);

    const starStyle = {
      width: `${props.width}px`,
      height: `${props.height}px`,
      minWidth: `${props.width}px`,
    };

    return () => (
      <p class={`${resolveClassName('rate-stars')}`}>
        {Array(props.max)
          .fill(1)
          .map((_, index) => (
            <svg
              class={starClass(index)}
              style={starStyle}
              x='0px'
              y='0px'
              viewBox='0 0 64 64'
              onClick={() => chooseRate(index)}
              onMouseenter={() => changeHover(index)}
            >
              <g transform='translate(-143.000000, -635.000000)'>
                <g transform='translate(83.000000, 114.000000)'>
                  <g transform='translate(15.000000, 384.000000)'>
                    <g transform='translate(29.000000, 137.000000)'>
                      {/* eslint-disable-next-line max-len */}
                      <polygon
                        class='st1'
                        points='48,53 28.2,63.9 32,40.8 16,24.4 38.1,21 48,-0.1 57.8,21 79.9,24.4 63.9,40.8 67.7,63.9'
                      />
                    </g>
                  </g>
                </g>
              </g>
            </svg>
          ))}
      </p>
    );
  },
});
