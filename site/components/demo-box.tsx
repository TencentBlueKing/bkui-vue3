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
import ClipboardJS from 'clipboard';
import { defineComponent, getCurrentInstance, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';

import { Code, Copy, PlayShape } from '@bkui-vue/icon';
import BkMessage from '@bkui-vue/message';

import BoxIcon from './box-icon';
import CodeBox from './code-box';
import CommonBox from './common-box';

import './demo-box.less';

export default defineComponent({
  name: 'DemoBox',
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: 'html',
    },
    componentName: {
      type: String,
      required: true,
    },
    demoName: {
      type: String,
      required: true,
    },
    suffix: {
      type: String,
      default: '.vue',
    },
  },
  setup(props) {
    const showCode = ref(false);
    const preview = ref<HTMLDivElement>(null);
    let copyInstance = null;
    const sourceCode = ref('');
    const evalCode = ref('');
    const handleShowCodeChange = () => {
      showCode.value = !showCode.value;
    };
    onBeforeMount(async () => {
      if (process.env.NODE_ENV === 'development') {
        // evalCode.value = (await import(/* @vite-ignore */
        // `../views/${props.componentName}/${props.demoName}.vue`)).default;
        sourceCode.value = (await import(/* @vite-ignore */ `../views/${props.componentName}/${props.demoName}${props.suffix}?raw`)).default;
        // const app = createApp(evalCode.value as any);
        // app.mount(preview.value);
      } else {
        sourceCode.value = await fetch(`../views/${props.componentName}/${props.demoName}${props.suffix}`).then(res => res.text());
      }
    });
    onMounted(() => {
      copyInstance = new ClipboardJS((getCurrentInstance().refs.copyBtn as any).$el, {
        text: () => sourceCode.value,
      });
      ['success', 'error'].forEach((theme) => {
        copyInstance.on(theme, () => BkMessage({
          theme,
          message: theme === 'success' ? '复制成功' : '复制失败',
        }));
      });
    });
    onBeforeUnmount(() => {
      copyInstance?.destroy();
    });

    return {
      showCode,
      handleShowCodeChange,
      copyInstance,
      sourceCode,
      evalCode,
      preview,
    };
  },
  render() {
    return <CommonBox title={this.title} subtitle={this.subtitle}>
      {
        [
           <div class="example-box">
             {this.$slots.default?.()}
            {/* <div ref='preview'/> */}
          </div>,
          <div class="example-tools">
            {this.desc}
              <BoxIcon tips='执行' style={{ marginLeft: 'auto' }}>
                  <PlayShape/>
              </BoxIcon>
            <BoxIcon
              tips='代码'
              onClick={this.handleShowCodeChange}
              active={this.showCode}>
              <Code/>
            </BoxIcon>
            <BoxIcon tips='copy' ref="copyBtn">
              <Copy/>
            </BoxIcon>
          </div>,
          <div class="eample-code" style={{ display: this.showCode ? 'block' : 'none' }}>
            <CodeBox code={this.sourceCode} language={this.language}/>
          </div>,
        ]
      }
    </CommonBox>;
  },
});
