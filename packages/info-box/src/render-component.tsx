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
import { defineComponent, reactive, ref } from 'vue';

import Button from '@bkui-vue/button';
import { usePrefix } from '@bkui-vue/config-provider';
import { Close, Error, Spinner, Success, Warn } from '@bkui-vue/icon';
import Modal from '@bkui-vue/modal';
import isFunction from 'lodash/isFunction';

import type { Props } from './info-box';

export const genDefaultState = (): Required<Props> => ({
  isShow: false,
  width: 400,
  extCls: undefined,
  class: undefined,
  infoType: undefined,
  type: undefined,
  title: undefined,
  subTitle: undefined,
  content: undefined,
  footer: undefined,
  headerAlign: 'center',
  contentAlign: 'center',
  footerAlign: 'center',
  showMask: true,
  quickClose: false,
  escClose: false,
  closeIcon: true,
  confirmText: '确定',
  theme: undefined,
  confirmButtonTheme: 'primary',
  cancelText: '',
  beforeClose: () => true,
  onConfirm: () => {},
  onCancel: () => {},
  onClose: undefined,
});

export default defineComponent({
  name: 'InfoBox',
  setup(_props, { expose }) {
    const state = reactive(genDefaultState());

    const isShow = ref(false);
    const isLoading = ref(false);

    const { resolveClassName } = usePrefix();

    const handleConfirm = async () => {
      isLoading.value = true;
      try {
        const willClose = await state.beforeClose('confirm');

        if (!willClose) {
          return;
        }
        await state.onConfirm();
        isShow.value = false;
      } finally {
        isLoading.value = false;
      }
    };

    const handleCancel = async () => {
      const willClose = await state.beforeClose('cancel');
      if (!willClose) {
        return;
      }
      state.onCancel();
      isShow.value = false;
    };

    expose({
      show: () => {
        isShow.value = true;
      },
      hide: () => {
        isShow.value = false;
      },
      update: (payload: Partial<Props>) => {
        Object.assign(state, payload);
        // 配置项变更 infoType 变更为 type
        if (payload.infoType) {
          state.type = payload.infoType;
        }
        // 配置项变更 onClose 变更为 onCancel
        if (payload.onClose) {
          state.onCancel = payload.onClose;
        }
        // 配置项变更 subTitle 变更为 content
        if (payload.subTitle) {
          state.content = payload.subTitle;
        }
        // 配置项变更 theme 变更为 confirmButtonTheme
        if (payload.theme) {
          state.confirmButtonTheme = payload.theme;
        }
        // 配置项变更 extCls 变更为 class
        if (payload.extCls) {
          state.class = payload.extCls;
        }
      },
    });

    return () => {
      const renderIcon = () => {
        if (!state.type) {
          return null;
        }
        const iconMap = {
          loading: <Spinner class={[resolveClassName('infobox-icon'), 'loading']}></Spinner>,
          warning: <Warn class={[resolveClassName('infobox-icon'), 'warning']}></Warn>,
          success: <Success class={[resolveClassName('infobox-icon'), 'success']}></Success>,
          danger: <Close class={[resolveClassName('infobox-icon'), 'danger']}></Close>,
        };
        return <div class={resolveClassName('infobox-type')}>{iconMap[state.type]}</div>;
      };

      const renderTitle = () => {
        if (isFunction(state.title)) {
          return state.title();
        }
        return state.title;
      };

      const renderContent = () => {
        if (isFunction(state.content)) {
          return state.content();
        }
        return state.content;
      };

      const renderFooter = () => {
        if (isFunction(state.footer)) {
          return state.footer();
        }
        if (state.footer) {
          return state.footer;
        }
        return (
          <>
            {state.confirmText && (
              <Button
                loading={isLoading.value}
                theme={state.confirmButtonTheme}
                onClick={handleConfirm}
              >
                {state.confirmText}
              </Button>
            )}

            {state.cancelText && <Button onClick={handleCancel}>{state.cancelText}</Button>}
          </>
        );
      };

      return (
        <Modal
          width={state.width}
          class={[resolveClassName('infobox'), state.class]}
          animateType='fadein'
          closeIcon={state.closeIcon}
          isShow={isShow.value}
          quickClose={false}
          transfer={true}
        >
          {{
            header: () => (
              <div class={resolveClassName('infobox-header')}>
                {renderIcon()}
                <div
                  style={{ textAlign: state.headerAlign }}
                  class={resolveClassName('infobox-title')}
                >
                  {renderTitle()}
                </div>
              </div>
            ),
            default: () =>
              state.content && (
                <div
                  style={{ textAlign: state.contentAlign }}
                  class={resolveClassName('infobox-content')}
                >
                  {renderContent()}
                </div>
              ),
            footer: () => (
              <div
                class={{
                  [resolveClassName('infobox-footer')]: true,
                  [`is-position-${state.footerAlign}`]: state.footerAlign,
                }}
              >
                {renderFooter()}
              </div>
            ),
            close: () => <Error onClick={handleCancel} />,
          }}
        </Modal>
      );
    };
  },
});
