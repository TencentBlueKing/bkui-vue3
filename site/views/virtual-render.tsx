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

import { defineComponent, reactive, ref } from 'vue';

import VirtualRender from '@bkui-vue/virtual-render';
import BkButton from '@bkui-vue/button';

export default defineComponent({
  name: 'SiteTable',
  setup() {
    const listData = reactive([
      {
        ip: '192.168.0.1',
        source: 'QQ',
        status: '创建中',
        create_time: '2018-05-25 15:02:24',
      },
      {
        ip: '192.168.0.2',
        source: '微信',
        status: '正常',
        create_time: '2018-05-25 15:02:24',
      },
      {
        ip: '192.168.0.3',
        source: 'QQ',
        status: '创建中',
        create_time: '2018-05-25 15:02:24',
      },
    ]);

    const containerStyle = reactive({
      height: '300px',
    });

    const handleRandomRow = () => {
      listData.splice(0, listData.length, ...new Array(Math.ceil(Math.random() * 10000)).fill('')
        .map((_, index: number) => ({
          ip: `192.168.0.${index}`,
          source: `${index}_QQ`,
          status: '创建中',
          create_time: `2018-05-25 15:02:24.${index}`,
        })));
    };

    const isAutoLineHeight = reactive(ref(true));

    const handleCustomLineHeight = () => {
      isAutoLineHeight.value = !isAutoLineHeight.value;
      handleRandomRow();
    };

    const height = reactive(ref(300));

    return {
      listData,
      containerStyle,
      handleRandomRow,
      handleCustomLineHeight,
      height,
      isAutoLineHeight,
    };
  },
  render() {
    const rowHeight = this.isAutoLineHeight ? 30
      : this.listData.map(() => Math.ceil(Math.random() * 30) + 30 + Math.ceil(Math.random() * 20));
    const getLineHeight = this.isAutoLineHeight ? 30 : (index: number) => rowHeight[index];

    const lineHeightTotal = this.isAutoLineHeight ? 30 * this.listData.length : (rowHeight as Array<number>)
      .reduce((pre: number, curr: number) => {
        pre = pre + curr;
        return pre;
      }, 0);

    return (
      <div style={this.containerStyle}>
        <BkButton onClick={this.handleRandomRow}>随机列表(0-9999)</BkButton> |
        <BkButton onClick={this.handleCustomLineHeight}>自定义每行高度({`${!this.isAutoLineHeight}`})</BkButton> |
        | 列表长度： {this.listData.length} | 列表高度：{this.height} | 总高度：{lineHeightTotal}

        <VirtualRender list={this.listData} height={this.height} lineHeight={getLineHeight}>
          {
            {
              default: (scoped: any) => (scoped.data || []).map((item: any, index: number) => {
                const lineHeight = Array.isArray(rowHeight) ? rowHeight[index] : rowHeight;
                const rowStyle = {
                  height: `${lineHeight}px`,
                  lineHeight: `${lineHeight}px`,
                  borderBottom: 'solid 1px #ddd',
                };

                const cellStyle = {
                  padding: '2px 10px',
                  height: `${lineHeight}px`,
                  lineHeight: `${lineHeight}px`,
                  display: 'inline-block',
                  width: '200px',
                };
                return <div style={rowStyle}>
                  <span style={cellStyle}>{item.$index + 1}</span>
                  <span style={cellStyle}>{item.ip}</span>
                  <span style={cellStyle}>{item.source}</span>
                  <span style={cellStyle}>{item.status}</span>
                  <span style={cellStyle}>{item.create_time}</span>
                  <span style={cellStyle}>LineHeight: {lineHeight}</span>
                </div>;
              }),
            }
          }
        </VirtualRender>
      </div>
    );
  },
});
