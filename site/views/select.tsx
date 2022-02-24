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
import BkSelect, { BkOption, BkOptionGroup } from '@bkui-vue/select';
import { Close } from '@bkui-vue/icon';

export default defineComponent({
  name: 'SelectExample',
  setup() {
    const selectValue = ref('');
    const multiSelect = ref([null]);
    const multiSelect2 = ref('test');
    const multiSelect3 = ref();
    const largeArr = ref(new Array(100).fill(undefined)
      .map((_, index) => ({
        name: `name-${index}`,
        id: index,
      })));
    const list = ref([]);
    const remoteMethod = async value => new Promise((resolve) => {
      setTimeout(() => {
        list.value = new Array(10).fill('')
          .map((_, i) => ({
            id: `${i}-${value}`,
            name: `label-${value}-${i}`,
          }));
        resolve('ok');
      }, 3000);
    });
    return {
      selectValue,
      multiSelect,
      multiSelect2,
      multiSelect3,
      largeArr,
      list,
      remoteMethod,
    };
  },
  render() {
    return (
      <div>
        <div>
          <div>单选</div>
          <BkSelect v-model={this.selectValue} filterable>
            <BkOption value="test" label="label1"></BkOption>
            <BkOption value={false} label="label2" disabled></BkOption>
            <BkOption value={undefined} label="label3"></BkOption>
            <BkOption value={1} label="label4"></BkOption>
            <BkOption value={null} label="label5"></BkOption>
          </BkSelect>
        </div>

        <div style="margin-top: 10px">
          <div>多选</div>
          <BkSelect v-model={this.multiSelect} multiple>
            <BkOption value="test" label="label1"></BkOption>
            <BkOption value={false} label="label2"></BkOption>
            <BkOption value={undefined} label="label3"></BkOption>
            <BkOption value={1} label="label4">测试label</BkOption>
            <BkOption value={null} label="label5"></BkOption>
          </BkSelect>
        </div>

        <div style="margin-top: 10px">
          <div>空select</div>
          <BkSelect v-model={this.multiSelect} multiple>
          </BkSelect>
        </div>

        <div style="margin-top: 10px">
          <div>空group</div>
          <BkSelect v-model={this.multiSelect} multiple>
            <BkOptionGroup label='label1'></BkOptionGroup>
            <BkOptionGroup label='label2'></BkOptionGroup>
          </BkSelect>
        </div>

        <div style="margin-top: 10px">
          <div>分组1</div>
          <BkSelect modelValue={1} filterable={false} multiple>
            <BkOptionGroup label="分组1">
              <BkOption value="test" label="label1"></BkOption>
              <BkOption value={false} label="label2"></BkOption>
              <BkOption value={undefined} label="label3"></BkOption>
              <BkOption value={1} label="label4">测试label测试label测试label测试label测试label测试label测试label测试label测试label测试label测试label测试label</BkOption>
              <BkOption value={null} label="label5"></BkOption>
            </BkOptionGroup>
            <BkOptionGroup label="分组2">
              <BkOption value="test" label="label6"></BkOption>
              <BkOption value={2} label="label7"></BkOption>
              <BkOption value={3} label="label8"></BkOption>
              <BkOption value={4} label="label9">测试label</BkOption>
            </BkOptionGroup>
          </BkSelect>
        </div>

        <div style="margin-top: 10px">
          <div>自定义分组label</div>
          <BkSelect v-model={this.multiSelect2} filterable={false} multiple>
              <BkOptionGroup label="分组1">
                {{
                  label: () => (
                    <div>自定义分组label - 123</div>
                  ),
                  default: () => (
                    <div>
                      <BkOption value="test" label="label1"></BkOption>
                      <BkOption value={false} label="label2"></BkOption>
                      <BkOption value={undefined} label="label3"></BkOption>
                      <BkOption value={1} label="label4">测试label测试label测试label测试label测试label测试label测试label测试label测试label测试label测试label测试label</BkOption>
                      <BkOption value={null} label="label5"></BkOption>
                    </div>
                  ),
                }}
              </BkOptionGroup>
              <BkOptionGroup label="分组2">
                <BkOption value="test" label="label6"></BkOption>
                <BkOption value={2} label="label7"></BkOption>
                <BkOption value={3} label="label8"></BkOption>
                <BkOption value={4} label="label9">测试label</BkOption>
              </BkOptionGroup>
            </BkSelect>
        </div>

        <div style="margin-top: 10px">
          <div>分组折叠</div>
          <BkSelect v-model={this.multiSelect2} filterable multiple>
              <BkOptionGroup label="分组折叠" collapsible>
                <BkOption value="test" label="label6"></BkOption>
                <BkOption value={2} label="label7"></BkOption>
                <BkOption value={3} label="label8"></BkOption>
                <BkOption value={4} label="label9">测试label</BkOption>
              </BkOptionGroup>
              <BkOptionGroup label="分组折叠2" collapsible>
                <BkOption value="test" label="label6"></BkOption>
                <BkOption value={2} label="label7"></BkOption>
                <BkOption value={3} label="label8"></BkOption>
              </BkOptionGroup>
            </BkSelect>
        </div>

        <div style="margin-top: 20px">
          <div>搜索</div>
          <BkSelect v-model={this.multiSelect3} filterable multiple>
            {this.largeArr.map(item => <BkOption value={item.id} label={item.name}></BkOption>)}
          </BkSelect>
        </div>

        <div style="margin-top: 20px">
          <div>扩展插槽和前置插槽</div>
          <BkSelect v-model={this.multiSelect3} filterable multiple>
            {{
              prefixIcon: () => (
                <Close></Close>
              ),
              default: () => (
                this.largeArr.map(item => <BkOption value={item.id} label={item.name}></BkOption>)
              ),
              extension: () => (
                <div>扩展插槽</div>
              ),
            }}
          </BkSelect>
        </div>

        <div style="margin-top: 20px">
          <div>loading</div>
          <BkSelect v-model={this.multiSelect3} filterable multiple loading>
            {{
              default: () => (
                this.largeArr.map(item => <BkOption value={item.id} label={item.name}></BkOption>)
              ),
            }}
          </BkSelect>
        </div>

        <div style="margin-top: 20px">
          <div>远程加载</div>
          <BkSelect v-model={this.multiSelect3} filterable multiple remoteMethod={this.remoteMethod}>
            {{
              default: () => (
                this.list.map(item => <BkOption value={item.id} label={item.name}></BkOption>)
              ),
            }}
          </BkSelect>
        </div>
        <iframe style="margin-top: 100px" src="./select"></iframe>
      </div>
    );
  },
});
