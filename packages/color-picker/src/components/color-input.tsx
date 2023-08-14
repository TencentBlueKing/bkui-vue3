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

import tinycolor from 'tinycolor2';
import {
  defineComponent,
  ExtractPropTypes,
  reactive,
  watch,
} from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { PropTypes } from '@bkui-vue/shared';

import InputContainer from './input-container';
const colorPickerProps = {
  colorObj: PropTypes.object.isRequired,
};

export type ColorPickerPropTypes = ExtractPropTypes<typeof colorPickerProps>;

export default defineComponent({
  name: 'ColorPicker',
  props: colorPickerProps,
  emits: ['change', 'tab'],
  setup(props, { emit }) {
    const hex = reactive({ key: 'hex', name: 'HEX', value: props.colorObj.hex, error: false });
    const r = reactive({ key: 'r', name: 'R', value: props.colorObj.rgba.r.toString(), error: false });
    const g = reactive({ key: 'g', name: 'G', value: props.colorObj.rgba.g.toString(), error: false });
    const b = reactive({ key: 'b', name: 'B', value: props.colorObj.rgba.b.toString(), error: false });
    const a = reactive({ key: 'a', name: 'Alpha', value: props.colorObj.rgba.a.toString(), error: false });

    watch(() => props.colorObj, (val) => {
      if (tinycolor(val.hex).toString() !== tinycolor(hex.value).toString()) {
        // 只有 hex 代表的颜色不同才同步，像这种手动输入了 #fEF 等价于 #ffeeff 就不同步
        hex.value = val.hex;
      }
      r.value = val.rgba.r.toString();
      g.value = val.rgba.g.toString();
      b.value = val.rgba.b.toString();
      a.value = val.rgba.a.toString();
      // 每次变化时校验以更新存在的错误
      validate();
    }, { deep: true });

    // 最后的 alpha 表单 tab 事件
    const handleAlphaTab = (e) => {
      emit('tab', e);
    };

    /**
     * 处理手动输入颜色
     * @param {String} key
     * @param {String} value
     */
    const handleInput = (key, value) => {
      const colorList = { r, g, b, a, hex };
      colorList[key].value = value;
      if (validate()) {
        const colorStr = key === 'hex'
          ? hex.value
          : `rgba(${r.value}, ${g.value}, ${b.value}, ${a.value})`;
        emit('change', colorStr);
      }
    };

    // 判断表单输入值是否合法
    const validate = () => {
      let result = true;
      // hex
      if (hex.value.startsWith('#')
            && (hex.value.length === 4 || hex.value.length === 7)
            && !hex.value.slice(1).match(/[^0-9a-fA-F]/)) {
        hex.error = false;
      } else {
        hex.error = true;
        result = false;
      }
      // a
      if (a.value !== '' && a.value >= 0 && a.value <= 1) {
        a.error = false;
      } else {
        a.error = true;
        result = false;
      }
      // r g b
      for (const colorInfo of [r, g, b]) {
        const { value } = colorInfo;
        if (value !== '' && value >= 0 && value <= 255) {
          colorInfo.error = false;
        } else {
          colorInfo.error = true;
          result = false;
        }
      }
      return result;
    };

    const { resolveClassName } = usePrefix();

    return () => (
      <div class={`${resolveClassName('color-picker-input')}`}>
        <div class={`${resolveClassName('color-picker-input-hex')}`}>
          <InputContainer info={hex} onInput={handleInput}></InputContainer>
        </div>
        <div class={`${resolveClassName('color-picker-input-rgba')}`}>
          <InputContainer info={r} onInput={handleInput}></InputContainer>
          <InputContainer info={g} onInput={handleInput}></InputContainer>
          <InputContainer info={b} onInput={handleInput}></InputContainer>
          <InputContainer info={a} onInput={handleInput} onTab={handleAlphaTab}></InputContainer>
        </div>
      </div>
    );
  },
});
