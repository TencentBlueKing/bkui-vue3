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
import { createApp, createVNode, defineComponent, h, ref, shallowRef, VNode } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';

import Dialog from '../../dialog/src/dialog';

export interface ModalFuncProps {
  isShow?: boolean;
  width?: string | number;
  height?: string | number;
  'ext-cls': string | string[];
  type?: 'primary' | 'warning' | 'success' | 'danger';
  infoType?: 'success' | 'danger' | 'warning' | 'loading';
  title?: string | (() => VNode | string) | VNode;
  subTitle?: string | (() => VNode) | VNode; // 弹窗内容
  confirmText?: string | (() => VNode) | VNode;
  cancelText?: string | (() => VNode) | VNode;
  onConfirm?: (...args: any[]) => any;
  onClosed?: (...args: any[]) => any;
  boundary?: HTMLElement; // 插入元素
  draggable?: boolean;
  maskClose?: boolean;
  escClose?: boolean;
  closeIcon?: boolean;
  headerAlign?: 'left' | 'center' | 'right';
  footerAlign?: 'left' | 'center' | 'right';
  contentAlign?: 'left' | 'center' | 'right';
  dialogType?: 'show' | 'operation' | 'confirm';
  showMask?: boolean;
  quickClose?: boolean;
}

const InfoBox = (config: Partial<ModalFuncProps>) => {
  const container = document.createElement('div');
  const modalFuncProps = shallowRef<Partial<ModalFuncProps>>(config);

  const isShow = ref(modalFuncProps.value.isShow !== false);
  let app;

  const dialog = defineComponent({
    name: 'DialogConfirm',
    setup(_props, { expose }) {
      let isLoading = false;
      const beforeHiddenFn = [];
      const resolveUserCallbackFnBeforeClose = async userCallbackFn => {
        if (typeof userCallbackFn === 'function') {
          // 如果是Promise则等待返回结果再关闭弹出提示
          // 如果是常规函数，则暂时推送到待执行池，在弹出提示关闭时一次执行，以保证多层嵌套弹出执行关闭的顺序
          if (userCallbackFn instanceof Promise) {
            await (userCallbackFn as any)();
          } else {
            beforeHiddenFn.push(userCallbackFn);
          }
        }
        isShow.value = false;
      };

      const onClosed = async () => {
        resolveUserCallbackFnBeforeClose(modalFuncProps.value?.onClosed);
      };

      const onConfirm = async () => {
        isLoading = true;
        await resolveUserCallbackFnBeforeClose(modalFuncProps.value?.onConfirm);
        isLoading = false;
      };

      function update(newValue: ModalFuncProps) {
        modalFuncProps.value = { ...modalFuncProps.value, ...newValue };
      }

      expose({ update });

      const { resolveClassName } = usePrefix();

      const getContent = () => {
        const children = [];
        const subTitleBox = [];
        if (modalFuncProps.value.subTitle) {
          switch (typeof modalFuncProps.value.subTitle) {
            case 'string':
              children.push(modalFuncProps.value.subTitle);
              break;
            case 'function':
              children.push(modalFuncProps.value.subTitle());
              break;
            default:
              children.push(modalFuncProps.value.subTitle);
              break;
          }
        }
        if (children.length) {
          subTitleBox.push(
            h(
              'div',
              {
                class: resolveClassName('info-sub-title'),
                style: `text-Align:${modalFuncProps.value.contentAlign || 'center'}`,
              },
              children,
            ),
          );
        }
        return subTitleBox;
      };

      const onHidden = () => {
        beforeHiddenFn.forEach(fn => fn());
        beforeHiddenFn.length = 0;
        container.remove();
      };

      return () =>
        createVNode(
          Dialog,
          {
            class: resolveClassName('info-wrapper'),
            headerAlign: 'center',
            footerAlign: 'center',
            fullscreen: false,
            isLoading,
            ...modalFuncProps.value,
            isShow: isShow.value,
            transfer: false,
            onClosed,
            onConfirm,
            onHidden,
          },
          getContent,
        );
    },
  });

  const beforeShow = () => {
    if (!app) {
      document.body.append(container);
      app = createApp(dialog).mount(container);
    }
  };

  if (isShow.value) {
    beforeShow();
  }

  return {
    show: () => {
      beforeShow();
      isShow.value = true;
    },
    hide: () => {
      isShow.value = false;
    },
    update: (config: Partial<ModalFuncProps>) => {
      beforeShow();
      app?.update(config);
    },
    destroy: () => {
      container.remove();
      app?.unmount();
      app = null;
    },
  };
};

export default InfoBox;
