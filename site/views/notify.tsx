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
import BkNotify from '@bkui-vue/notify';

export default defineComponent({
  name: 'SitePopover',
  setup() {
    const handleClick = () => {
      BkNotify({
        position: 'top-left',
        title: '你好！欢迎你使用蓝鲸智云产品',
        message: '你好，你申请的功能权限现已开通，请及时登录查询。如有疑问，请与蓝鲸智云管理人员联系或关注微信公众账号。',
      });
    };
    const handleClick2 = () => {
      BkNotify({
        theme: 'success',
        position: 'top-right',
        title: '你好！欢迎你使用蓝鲸智云产品',
        message: '你好，你申请的功能权限现已开通，请及时登录查询。如有疑问，请与蓝鲸智云管理人员联系或关注微信公众账号。',
        onClose: () => {
          console.log('message close');
        },
      });
    };
    const handleClick3 = () => {
      BkNotify({
        theme: 'warning',
        position: 'bottom-left',
        title: '你好！欢迎你使用蓝鲸智云产品',
        message: '你好，你申请的功能权限现已开通，请及时登录查询。如有疑问，请与蓝鲸智云管理人员联系或关注微信公众账号。',
      });
    };
    const handleClick4 = () => {
      BkNotify({
        theme: 'danger',
        position: 'bottom-right',
        title: '你好！欢迎你使用蓝鲸智云产品',
        message: '你好，你申请的功能权限现已开通，请及时登录查询。如有疑问，请与蓝鲸智云管理人员联系或关注微信公众账号。',
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
      <div style="margin: 20px auto;">
        <BkButton theme="primary" onClick={this.handleClick}>左上角</BkButton>&nbsp;&nbsp;
        <BkButton theme="success" onClick={this.handleClick2}>右上角</BkButton><br /><br />
        <BkButton theme="warning" onClick={this.handleClick3}>左下角</BkButton>&nbsp;&nbsp;
        <BkButton theme="danger" onClick={this.handleClick4}>右下角</BkButton>
      </div>
    );
  },
});
