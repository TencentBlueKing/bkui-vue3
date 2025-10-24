/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2025 Tencent.  All rights reserved.
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

export enum MessageThemeEnum {
  ERROR = 'error',
  PRIMARY = 'primary',
  SUCCESS = 'success',
  WARNING = 'warning',
}

export enum MessageContentType {
  JSON = 'json',
  KEY_VALUE = 'key-value',
}

export enum IMessageActionType {
  /**
   * 联系助手：默认直接拉起企业微信与助手的聊天，需要在 message.assistant 配置对应的企微群ID
   */
  ASSISTANT = 'assistant',

  /**
   * 关闭：点击关闭，Message 消失
   */
  CLOSE = 'close',

  /**
   * 展开详情：展开面向开发的详情
   */
  DETAILS = 'details',

  /**
   * 图钉按钮：点击后，Message 不会自动消失
   */
  FIX = 'fix',
}
