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
import _ from 'lodash';
import { createApp, defineComponent, onMounted, ref, shallowRef, VNode } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';

import Dialog from '../../dialog/src/dialog';

export interface ModalFuncProps {
  isShow?: boolean;
  width?: string | number;
  height?: string | number;
  'ext-cls': string | string[];
  type?: 'primary' | 'warning' | 'success' | 'danger';
  infoType?: 'success' | 'danger' | 'warning' | 'loading';
  title?: string;
  subTitle?: string | (() => VNode) | VNode; // 弹窗内容
  confirmText?: string;
  cancelText?: string;
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
  const isShow = ref(false);
  const modalFuncProps = shallowRef<Partial<ModalFuncProps>>(config);
  const dialog = defineComponent({
    name: 'DialogConfirm',
    setup(_props, { expose }) {
      onMounted(() => {
        const dom: HTMLElement = (document.activeElement as HTMLElement) || document.body;
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
        modalFuncProps.value = { ...modalFuncProps.value, ...newValue };
      }

      expose({ update });

      const { resolveClassName } = usePrefix();

      const renderSubTitle = () => {
        const subTitle = _.isFunction(modalFuncProps.value.subTitle)
          ? modalFuncProps.value.subTitle()
          : modalFuncProps.value.subTitle;
        if (!subTitle) {
          return null;
        }
        return (
          <div
            class={resolveClassName('info-sub-title')}
            style={`text-Align:${modalFuncProps.value.contentAlign || 'center'}`}
          >
            {subTitle}
          </div>
        );
      };

      return () => (
        <Dialog
          class={resolveClassName('info-wrapper')}
          headerAlign='center'
          footerAlign='center'
          transfer={true}
          fullscreen={false}
          isShow={isShow.value}
          {...{ ...modalFuncProps.value, onClosed, onConfirm }}
        >
          {renderSubTitle()}
        </Dialog>
      );
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
    destroy: () => {
      app.unmount();
      app = null;
    },
  };
};

export default InfoBox;
