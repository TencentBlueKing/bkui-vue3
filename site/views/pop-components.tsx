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

import BkButton from '@bkui-vue/button';
import BkDialog from '@bkui-vue/dialog';
import BkPopover from '@bkui-vue/popover';
import BkSideslider from '@bkui-vue/sideslider';
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'PopConmponents',
  data() {
    return {
      dialog1: {
        isShow: false,
      },
      slider: {
        isShow: false,
      },
      trigger: 'manual',
      popShow: false,
      showMask: true,
    };
  },
  methods: {
    handleIsShowChanged(isShow: boolean) {
      this.dialog1.isShow = isShow;
    },
    handleSliderIsShowChanged(isShow: boolean) {
      this.slider.isShow = isShow;
    },
    handlePopShowChanged() {
      this.popShow = !this.popShow;
    },
    handleShowMaskChanged() {
      this.showMask = !this.showMask;
    },
  },
  render() {
    return (
      <div>
        <BkButton onClick={() => this.handleSliderIsShowChanged(true)}>显示Sideslider</BkButton>
        <BkSideslider isShow={this.slider.isShow} onClosed={() => this.handleSliderIsShowChanged(false)}>
          <button onClick={() => this.handleIsShowChanged(true)}>显示Dialog</button>
          <button onClick={() => this.handleShowMaskChanged()}>ShowMask { `${this.showMask}` }</button>
          <BkDialog isShow={this.dialog1.isShow} showMask={ this.showMask }
            onClosed={() => this.handleIsShowChanged(false)} width={600} height={400}>

            <p>【首部及导言】</p>
            <p>欢迎您使用腾讯蓝鲸智云软件及服务。</p>
            <p>为使用腾讯蓝鲸智云软件（以下简称本软件）及服务，您应当阅读并遵守《腾讯蓝鲸智云软件许可及服务协议》
              （以下简称本协议），以及《腾讯服务协议》。
              请您务必审慎阅读、充分理解各条款内容，特别是免除或者限制责任的条款，以及开通或使用某项服务的单独协议，
              并选择接受或不接受。限制、免责条款可能以加粗形式提示您注意。</p>
            <p>除非您已阅读并接受本协议所有条款，否则您无权下载、安装或使用本软件及相关服务。
              您的下载、安装、使用、登录等行为即视为您已阅读并同意上述协议的约束。</p>
            <p>一、【协议的范围】</p>
            <p>1.1【协议适用主体范围】</p>
            <p>本协议是您与腾讯之间关于您下载、安装、使用、复制本软件，以及使用腾讯相关服务所订立的协议。</p>
            <p>1.2【协议关系及冲突条款】</p>
            <p>本协议被视为《腾讯服务协议》（链接地址:http://www.qq.com/contract.shtml，若链接地址变更的，
              则以变更后的链接地址所对应的内容为准；其他链接地址变更的情形，均适用前述约定。）的补充协议，
              是其不可分割的组成部分是其不可分割的组成部分。</p>
            <p>【首部及导言】</p>
            <p>欢迎您使用腾讯蓝鲸智云软件及服务。</p>
            <p>为使用腾讯蓝鲸智云软件（以下简称本软件）及服务，您应当阅读并遵守《腾讯蓝鲸智云软件许可及服务协议》
              （以下简称本协议），以及《腾讯服务协议》。请您务必审慎阅读、充分理解各条款内容，
              特别是免除或者限制责任的条款，以及开通或使用某项服务的单独协议，并选择接受或不接受。
              限制、免责条款可能以加粗形式提示您注意。</p>
            <p>除非您已阅读并接受本协议所有条款，否则您无权下载、安装或使用本软件及相关服务。您的下载、安装、使用、
              登录等行为即视为您已阅读并同意上述协议的约束。</p>
            <p>一、【协议的范围】</p>

            <p>1.1【协议适用主体范围】</p>
            <p>本协议是您与腾讯之间关于您下载、安装、使用、复制本软件，以及使用腾讯相关服务所订立的协议。</p>
            <p>1.2【协议关系及冲突条款】</p>

            <BkPopover trigger={this.trigger} isShow={this.popShow}>
              {
                {
                  default: () => <p>1.2【协议关系及冲突条款】</p>,
                  content: () => <p>本协议被视为《腾讯服务协议》
                    （链接地址:http://www.qq.com/contract.shtml，若链接地址变更的，
                    则以变更后的链接地址所对应的内容为准；其他链接地址变更的情形，均适用前述约定。）
                    的补充协议，是其不可分割的组成部分是其不可分割的组成部分。</p>,
                }
              }
            </BkPopover>
            <button onClick={() => this.handlePopShowChanged()}>显示POP</button>
            <BkPopover>
              {
                {
                  default: () => <p>1.3【协议关系及冲突条款1.3】</p>,
                  content: () => <p>本协议被视为《腾讯服务协议》
                    （链接地址:http://www.qq.com/contract.shtml，若链接地址变更的，
                    则以变更后的链接地址所对应的内容为准；其他链接地址变更的情形，均适用前述约定。）
                    的补充协议，是其不可分割的组成部分是其不可分割的组成部分。</p>,
                }
              }
            </BkPopover>
          </BkDialog>
        </BkSideslider>
      </div>
    );
  },
});
