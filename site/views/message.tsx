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
import { defineComponent } from 'vue';

import BkButton from '@bkui-vue/button';
import BkMessage from '@bkui-vue/message';

export default defineComponent({
  name: 'SitePopover',
  setup() {
    const handleClick = () => {
      BkMessage('选择你导入的构建机并填写相关信息，系统将为你安装必要的软件');
    };
    const handleClick2 = () => {
      BkMessage({
        theme: 'success',
        message: '恭喜！你提交的申请已经审核通过，请及时跟进了解下一步操作方式',
        onClose: () => {
          console.log('message close');
        },
      });
    };
    const handleClick3 = () => {
      BkMessage({
        theme: 'warning',
        message: '系统即将于19：00-21：00进行升个级，请及时保存你的资料',
      });
    };
    const handleClick4 = () => {
      BkMessage({
        theme: 'danger',
        message: '系统错误，请稍后重试',
      });
    };
    return {
      handleClick,
      handleClick2,
      handleClick3,
      handleClick4,
    };
  },
  render() {
    return (
      <div style="margin: 20px auto; float: left;">
        <BkButton theme="primary" onClick={this.handleClick}>消息</BkButton><br /><br />
        <BkButton theme="success" onClick={this.handleClick2}>成功</BkButton><br /><br />
        <BkButton theme="warning" onClick={this.handleClick3}>警告</BkButton><br /><br />
        <BkButton theme="danger" onClick={this.handleClick4}>失败</BkButton>
      </div>
    );
  },
});
