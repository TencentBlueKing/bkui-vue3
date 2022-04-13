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
import { defineComponent, nextTick, ref } from 'vue';

import BkButton from '@bkui-vue/button';
import BkPopover from '@bkui-vue/popover';

export default defineComponent({
  name: 'SitePopover',
  setup() {
    const isShow = ref(true);
    const trigger = ref('hover');
    const theme = ref('dark');

    const handleThemeChange = (val: string) => {
      theme.value = val;
      updateInstance();
    };

    // const handleShow = () => {
    //   isShow.value = !isShow;
    //   updateInstance();
    // };

    const placements = [
      { title: '上边', name: 'top', refDom: ref(), boundary: document.body },
      { title: '左边', name: 'left', refDom: ref(), boundary: document.body, fixOnBoundary: true },
      { title: '右边', name: 'right', refDom: ref(), boundary: null },
      { title: '下边', name: 'bottom', refDom: ref(), boundary: null },
    ];

    // const handleTrigger = (type: string) => {
    //   trigger.value = type;
    //   updateInstance();
    // };

    const updateInstance = () => {
      nextTick(() => {
        placements.forEach((item: any) => {
          item.refDom.value.update();
        });
      });
    };
    return () => (<>
      <BkButton class="mr10" theme="primary" onClick={ () => handleThemeChange('dark')}>theme-dark</BkButton>
      <BkButton class="mr10" theme="warning" onClick={ () => handleThemeChange('light')}>theme-light</BkButton>
      {/* <BkButton class="mr10" theme="success" onClick={ () => handleTrigger('manual')}>trigger-manual</BkButton>
      <BkButton class="mr10" theme="danger" onClick={ () => handleTrigger('hover')}>trigger-hover</BkButton>
      <BkButton class="mr10" theme="primary" onClick={ () => handleShow()}>IsShow（{`${isShow.value}`}）</BkButton> */}
      <div style="margin: 50px auto;">
        {
          placements.map((item: any) => [<BkPopover ref={ item.refDom }
          content="提示信息"
          theme={theme.value}
          isShow={ isShow.value }
          trigger={ trigger.value }
          placement={ item.name }
          boundary={item.boundary}
          fixOnBoundary={ !!item.fixOnBoundary }>
          <BkButton>{ item.title }</BkButton>
        </BkPopover>,
        <br/>,
          ])
        }
      </div>
      </>
    );
  },
});
