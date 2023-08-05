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
  defineComponent,
  h,
} from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
const isCustomComponent = node => node.__v_isVNode;

export default defineComponent({
  name: 'ComposeFormItem',
  props: {
    headBackgroundColor: {
      type: String,
      default: '#FAFBFD',
    },
    tailBackgroundColor: String,
  },
  setup() {
    const { resolveClassName } = usePrefix();
    return {
      resolveClassName,
    };
  },
  render() {
    if (!this.$slots.default) {
      return null;
    }
    const childrenArr = this.$slots.default();

    if (childrenArr.length > 1) {
      const childrenLength = childrenArr.length;
      let startIndex = 0;
      let headChildren = null;
      while (startIndex < childrenLength) {
        if (isCustomComponent(childrenArr[startIndex])) {
          headChildren = childrenArr[startIndex];
          break;
        }
        startIndex = startIndex + 1;
      }

      let tailIndex = childrenLength - 1;
      let tailChildren = null;
      while (tailIndex >= 0 && tailIndex > startIndex) {
        if (isCustomComponent(childrenArr[tailIndex])) {
          tailChildren = childrenArr[tailIndex];
          break;
        }
        tailIndex = tailIndex - 1;
      }

      if (headChildren && tailChildren) {
        if (!headChildren.props) {
          headChildren.props = {};
        }
        let headChildClass = `${this.resolveClassName('compose-form-item-head')}`;
        if (headChildren.props.class) {
          headChildClass += ` ${headChildren.props.class}`;
        }
        if (this.headBackgroundColor) {
          headChildren.props.style = Object.assign(headChildren.props.style || {}, {
            'background-color': this.headBackgroundColor,
          });
        }
        headChildren.props.class = headChildClass;

        if (!tailChildren.props) {
          tailChildren.props = {};
        }
        let tailChildStaticClass = `${this.resolveClassName('compose-form-item-tail')}`;
        if (tailChildren.props.class) {
          tailChildStaticClass += ` ${tailChildren.props.class}`;
        }
        if (this.tailBackgroundColor) {
          tailChildren.props.style = Object.assign(tailChildren.props.style || {}, {
            'background-color': this.tailBackgroundColor,
          });
        }
        tailChildren.props.class = tailChildStaticClass;
      }
    }
    return h('div', {
      class: `${this.resolveClassName('compose-form-item')}`,
    }, childrenArr);
  },
});
