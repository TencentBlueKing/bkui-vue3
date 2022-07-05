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

import { computed, defineComponent, Ref, ref } from 'vue';

import {
  classes,
  PropTypes,
  useFormItem,
} from '@bkui-vue/shared';

import star from './star';

export default defineComponent({
  name: 'Rate',

  components: {
    star,
  },

  props: {
    modelValue: PropTypes.number.def(0),
    size: PropTypes.size(),
    editable: PropTypes.bool.def(true),
  },

  emits: ['change', 'update:modelValue'],

  setup(props, { emit }) {
    const formItem = useFormItem();
    const hoverRate: Ref<number> = ref(0);

    const chooseRate = (val) => {
      if (!props.editable) return;

      emit('update:modelValue', val);
      emit('change', val);
      formItem?.validate?.('change');
    };

    const changeHover = (val) => {
      hoverRate.value = val;
    };

    const rateClass = classes({
      'bk-rate': true,
    });

    const sizeMap = {
      small: { width: 12, height: 12 },
      large: { width: 18, height: 18 },
    };
    const rateSize = sizeMap[props.size] || { width: 15, height: 16 };

    const starStyle = computed(() => {
      const integer = Math.floor(props.modelValue);
      const fixWidth = (rateSize.width + 3) * integer;
      const rateWidth = rateSize.width * (props.modelValue - integer);
      return { width: `${fixWidth + rateWidth}px` };
    });

    const commonAttrs = {
      width: rateSize.width,
      height: rateSize.height,
    };

    return () => (
      <p class={rateClass}>
        {
          props.editable ? (
            <star
              rate={props.modelValue}
              hover-rate={hoverRate.value}
              onChooseRate={chooseRate}
              onChangeHover={changeHover}
              onMouseleave={() => changeHover(0)}
              {...commonAttrs}
            ></star>
          ) : [
            <star
              rate={5}
              style={starStyle.value}
              class="bk-score-real"
              editable={false}
              {...commonAttrs}
            ></star>,
            <star
              rate={0}
              editable={false}
              {...commonAttrs}
            ></star>,
          ]
        }
      </p>
    );
  },
});
