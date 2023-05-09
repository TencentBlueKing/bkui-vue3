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
import { createApp, createVNode, defineComponent, h, onMounted, ref, shallowRef, VNode } from 'vue';

import { resolveClassName } from '@bkui-vue/shared';

import Dialog from '../../dialog/src/dialog';

export interface ModalFuncProps {
  isShow?: boolean;
  width?: string | number;
  type?: 'primary' | 'warning' | 'success' | 'danger';
  title?: string | (() => VNode | string) | VNode;
  subTitle?: string | (() => VNode) | VNode;// 弹窗内容
  confirmText?: string | (() => VNode) | VNode;
  cancelText?: string | (() => VNode) | VNode;
  onConfirm?: (...args: any[]) => any;
  onClosed?: (...args: any[]) => any;
  boundary?: HTMLElement;// 插入元素
  draggable?: boolean;
  maskClose?: boolean;
  escClose?: boolean;
  closeIcon?: boolean;
  headerAlign?: 'left' | 'center' | 'right'
  footerAlign?: 'left' | 'center' | 'right'
  contentAlign?: 'left' | 'center' | 'right'
  dialogType?: 'show' | 'operation' | 'confirm'
}

const InfoBox = (config: Partial<ModalFuncProps>) => {
  const container = document.createElement('div');
  const isShow = ref(false);
  const modalFuncProps = shallowRef<Partial<ModalFuncProps>>(config);
  const dialog = defineComponent({
    name: 'DialogConfirm',
    setup(_props, { expose }) {
      onMounted(() => {
        const dom: HTMLElement = document.activeElement as HTMLElement || document.body;
        dom.blur();
        if (modalFuncProps.value.isShow !== false) {
          isShow.value = true;
        }
      });
      const onClosed = async () => {
        if (typeof modalFuncProps.value?.onClosed === 'function') {
          await modalFuncProps.value?.onClosed();
        }
        isShow.value = false;
      };
      const onConfirm = async () => {
        if (typeof modalFuncProps.value?.onConfirm === 'function') {
          await modalFuncProps.value?.onConfirm();
        }
        isShow.value = false;
      };

      function update(newValue: ModalFuncProps) {
        modalFuncProps.value = newValue;
      }

      expose({ update });

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
          subTitleBox.push(h('div', {
            class: resolveClassName('info-sub-title'),
            style: `text-Align:${modalFuncProps.value.contentAlign || 'center'}`,
          }, children));
        }
        return subTitleBox;
      };

      return () => createVNode(Dialog, {
        class: resolveClassName('info-wrapper'),
        headerAlign: 'center',
        footerAlign: 'center',
        ...modalFuncProps.value,
        isShow: isShow.value,
        onClosed,
        onConfirm,
      }, getContent());
    },
  });
  let app: any = createApp(dialog).mount(container);
  return {
    show: () => {
      isShow.value = true;
    },
    hide: () => {
      isShow.value = false;
    },
    update: (config: Partial<ModalFuncProps>) => {
      app.update(config);
    },
    destroy: () => {
      app.unmount();
      app = null;
    },
  };
};

export default InfoBox;
