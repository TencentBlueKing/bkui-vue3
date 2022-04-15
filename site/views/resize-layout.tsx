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
import { defineComponent, ref } from 'vue';
import BkResizeLayout from '@bkui-vue/resize-layout';
import { BkRadio, BkRadioGroup } from '@bkui-vue/radio';

export default defineComponent({
  name: 'ResizeLayoutExample',
  setup() {
    const radioGroupValue = ref('right');
    return {
      radioGroupValue,
    };
  },
  render() {
    return (
      <div>
        <div style="padding: 10px">
          <BkResizeLayout style="height:500px;" immediate>
            {{
              aside: <div>aside</div>,
              main: <div>main</div>,
            }}
          </BkResizeLayout>
        </div>
        <div style="margin-top: 10px; padding:10px">
          <BkRadioGroup v-model={this.radioGroupValue}>
              <BkRadio label="left" />
              <BkRadio label="right" />
              <BkRadio label="top" />
              <BkRadio label="bottom" />
          </BkRadioGroup>
          <BkResizeLayout style="height:500px;" placement={this.radioGroupValue}>
            {{
              aside: <div>aside</div>,
              main: <div>main</div>,
            }}
          </BkResizeLayout>
        </div>
        <div style="padding: 10px;">
          <BkResizeLayout style="height:500px;" immediate min={50} max={400}>
            {{
              aside: <div>aside</div>,
              main: <div>main</div>,
            }}
          </BkResizeLayout>
        </div>
        <div style="padding: 10px;">
          <BkResizeLayout style="height:500px;" autoMinimize={true}>
            {{
              aside: <div>aside</div>,
              main: <div>main</div>,
            }}
          </BkResizeLayout>
        </div>
        <div style="padding: 10px;">
          <BkResizeLayout style="height:500px;" collapsible={true}>
            {{
              aside: <div>aside</div>,
              main: <div>main</div>,
            }}
          </BkResizeLayout>
        </div>
        <div style="padding: 10px">
            <BkResizeLayout style="height:500px;" collapsible={true}>
              {{
                aside: <BkResizeLayout placement="top" border={false} style="height: 100%">
                  {{
                    aside: <div>aside-top</div>,
                    main: <div>main-1</div>,
                  }}
                </BkResizeLayout>,
                main: <BkResizeLayout placement="bottom" border={false} style="height: 100%">
                {{
                  aside: <div>aside-bottom</div>,
                  main: <div>main-2</div>,
                }}
              </BkResizeLayout>,
              }}
            </BkResizeLayout>
        </div>
      </div>
    );
  },
});
