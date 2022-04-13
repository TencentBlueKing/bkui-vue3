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

import { BkButton, BkButtonGroup } from '@bkui-vue/button';

export default defineComponent({
  name: 'SiteButton',
  setup() {
    const buttonSize = ref('large');
    const handleButtonSize = () => {
      buttonSize.value = 'large';
    };

    const theme = ref('');
    function changeTheme() {
      theme.value = 'primary';
    }

    return {
      buttonSize,
      handleButtonSize,
      theme,
      changeTheme,
    };
  },
  render() {
    return (
      <div>
        <div style="margin: 0px auto; display: flex; align-items: center; justify-content: space-between;">
          <BkButton disabled >default</BkButton>
          <BkButton hoverTheme="success" theme="primary" >hoverTheme</BkButton>
          <BkButton outline theme="primary">outline</BkButton>
          <BkButton text theme="primary" onClick={this.handleButtonSize}>文字按钮</BkButton>
          <BkButton size={this.buttonSize} theme="danger">danger</BkButton>
          <BkButton size="large" theme="warning">warning</BkButton>
          <BkButton theme={this.theme} onClick={this.changeTheme} >primary</BkButton>
          <BkButton size="small" loading={true}></BkButton>
          <BkButton size="small" loading={true} theme="primary" laodingMode='default'></BkButton>
        </div>

        <div>
          <BkButtonGroup>
            <BkButton disabled />
            <BkButton theme="warning">hoverTheme</BkButton>
            <BkButton theme="primary">outline</BkButton>
            <BkButton size="small">danger</BkButton>
            <BkButton size="large">warning</BkButton>
            <BkButton>primary</BkButton>
          </BkButtonGroup>
        </div>
      </div>
    );
  },
});
