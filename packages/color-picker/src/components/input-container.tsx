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
import {
  computed,
  defineComponent,
  ExtractPropTypes,
} from 'vue';

import { classes, PropTypes } from '@bkui-vue/shared';
import { usePrefix } from '@bkui-vue/config-provider';

const inputContainerProps = {
  info: PropTypes.object.isRequired,
};

export type InputContainerProps = ExtractPropTypes<typeof inputContainerProps>;

export default defineComponent({
  props: inputContainerProps,
  emits: ['tab', 'input'],
  setup(props, { emit }) {
    const handleTab = (e) => {
      if (props.info.key === 'a') {
        emit('tab', e);
      }
    };

    const handleInput = (e) => {
      const { key } = props.info;
      const { value } = e.target;
      emit('input', key, value);
    };

    const { resolveClassName } = usePrefix();

    const colorPickerCls = computed(() => classes({
      error: props.info.error,
    }, `${resolveClassName('color-picker-input-value')}`));

    return () => (
      <div class={`${resolveClassName('color-picker-input-part')}`}>
      <input type={props.info.name === 'HEX' ? 'text' : 'number'}
        class={colorPickerCls.value}
        value={props.info.value}
        onKeydown={handleTab}
        onInput={handleInput}/>
      <span class={`${resolveClassName('color-picker-input-text')}`}>{props.info.name}</span>
    </div>
    );
  },
});
