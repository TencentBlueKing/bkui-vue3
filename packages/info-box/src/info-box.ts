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

import { createApp, h, ref, VNode } from 'vue';

import RenderComponent, { genDefaultState } from './render-component';

export interface Props {
  isShow?: boolean;
  width?: number | string;
  extCls?: string | string[];
  class?: string | string[]; // extCls 改名 class 继续存在为兼容老版本
  infoType?: 'danger' | 'loading' | 'success' | 'warning'; // infoType 改名 type 继续存在为兼容老版本
  type?: 'danger' | 'loading' | 'success' | 'warning';
  title?: (() => VNode | string) | VNode | string;
  subTitle?: (() => VNode) | VNode | string; // subTitle 改名 content 继续存在为兼容老版本
  content?: (() => VNode) | VNode | string;
  footer?: (() => VNode) | VNode | string;
  headerAlign?: 'center' | 'left' | 'right';
  footerAlign?: 'center' | 'left' | 'right';
  contentAlign?: 'center' | 'left' | 'right';
  showMask?: boolean;
  quickClose?: boolean;
  escClose?: boolean;
  closeIcon?: boolean;
  confirmText?: (() => VNode) | VNode | string;
  theme?: 'danger' | 'primary' | 'success' | 'warning'; // theme 改名 confirmButtonTheme 继续存在为兼容老版本
  confirmButtonTheme?: 'danger' | 'primary' | 'success' | 'warning';
  cancelText?: (() => VNode) | VNode | string;
  beforeClose?: (action: string) => Promise<boolean> | boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void; // onClose 改名 onCancel， 继续存在为兼容老版本
}

interface InstanceMethods {
  show: () => void;
  hide: () => void;
  update: (config: Partial<Props>) => void;
}

const appRef = ref();
const getInstance = () => {
  if (!appRef.value) {
    const container = document.createElement('div');
    const infoboxInstance = createApp({
      render() {
        return h(RenderComponent, {
          ref: appRef,
        });
      },
    });
    document.body.appendChild(container);
    infoboxInstance.mount(container);
  }

  return appRef.value as InstanceMethods;
};

const InfoBox = (config: Partial<Props>) => {
  let instance = getInstance();

  const configCache = Object.assign(genDefaultState(), config);

  const show = () => {
    instance?.update(configCache);
    instance?.show();
  };

  // 被调用时默认会弹出，当不需要默认弹出时需要明确传入 isShow: false 作为参数
  if (config.isShow !== false) {
    show();
  }

  return {
    show,
    hide: () => {
      instance?.hide();
    },
    update: (config: Partial<Props>) => {
      Object.assign(configCache, config);
      instance?.update(configCache);
    },
    destroy: () => {
      instance = null;
    },
  };
};

export default InfoBox;
