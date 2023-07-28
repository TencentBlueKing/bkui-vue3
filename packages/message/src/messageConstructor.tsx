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

import { useLocale } from 'bkui-vue';
import ClipboardJS from 'clipboard';
import JSONFormatter from 'json-formatter-js';
import { computed, defineComponent, isVNode, onMounted, onUnmounted, reactive, ref, Transition, VNode, watch } from 'vue';
import { toType } from 'vue-types';

import {
  AngleDoubleDownLine,
  AngleDoubleUpLine,
  Close,
  CopyShape,
  Error,
  FixLine,
  FixShape,
  Info,
  Success,
  Warn,
  WeixinPro,
} from '@bkui-vue/icon';
import { bkZIndexManager, isElement, PropTypes } from '@bkui-vue/shared';

enum MessageThemeEnum {
  PRIMARY = 'primary',
  WARNING = 'warning',
  SUCCESS = 'success',
  ERROR = 'error',
}

enum MessageContentType {
  KEY_VALUE = 'key-value',
  JSON = 'json',
}

enum IMessageActionType {
  /**
   * 联系助手：默认直接拉起企业微信与助手的聊天，需要在 message.assistant 配置对应的企微群ID
   */
  ASSISTANT = 'assistant',

  /**
   * 展开详情：展开面向开发的详情
   */
  DETAILS = 'details',

  /**
   * 图钉按钮：点击后，Message 不会自动消失
   */
  FIX = 'fix',

  /**
   * 关闭：点击关闭，Message 消失
   */
  CLOSE = 'close',
}

type IMessageAction = {
  /**
   * 唯一ID，从给定的 IMessageActionType 中选择
   * 如果是自定义的其他操作，此ID可以自定义，此时将会作为一个新的操作项追加
   */
  id: IMessageActionType;

  /**
   * 需要展示的文本，如果不设置显示默认
   */
  text?: () => string | string;

  /**
   * 需要展示的ICON，如果不设置显示默认
   */
  icon?: () => VNode | string | VNode;

  /**
   * 鼠标点击事件，如果返回false则阻止默认点击行为
   * 如果返回其他，默认行为不会阻止
   * @returns
   */
  onClick?: (...args) => Boolean | void;

  /**
   * 自定义渲染 & 事件处理
   * 如果设置了render则整个渲染都需要自己处理，默认渲染将会被阻止
   * @returns VNode
   */
  render?: () => VNode;

  /**
   * 是否禁用此功能
   * 如果设置为true，则此功能不展示
   */
  disabled?: boolean;

  /**
   * 是否只读
   * 如果设置为true，则此功能只做文本展示
   */
  readonly?: boolean;

  /**
   * 需要添加到操作项外层元素的样式列表
   */
  classList?: string | string[];
};

type IMessageActions = IMessageAction[];

export type IMessage = {
  /**
   * 错误码
   */
  code: string | number;

  /**
   * 错误概述
   */
  overview: string;

  /**
   * 操作建议
   */
  suggestion: string;

  /**
   * 详情
   */
  details: string | Record<string, any> | Array<Record<string, any> | string | number | boolean>;

  /**
   * 助手
   */
  assistant: string;

  /**
   * 展开详情：数据展示格式
   * 详情分为：Key Value 类详情、JSON 类详情
   * 可选值：'key-value', 'json'
   */
  type: MessageContentType;
};

const IMessageType = {
  code: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  overview: PropTypes.string,
  suggestion: PropTypes.string,
  details: PropTypes.string,
  assistant: PropTypes.string,
  type: toType<MessageContentType>('MessageContentType', {}),
};

const messageProps = {
  id: PropTypes.string.def(''),
  message: PropTypes.oneOfType([PropTypes.shape<IMessage>(IMessageType).loose, PropTypes.string]),
  theme: toType<`${MessageThemeEnum}`>('messageTheme', {}).def(MessageThemeEnum.PRIMARY),
  delay: PropTypes.number,
  dismissable: PropTypes.bool.def(true),
  offsetY: PropTypes.number.def(30),
  spacing: PropTypes.number.def(10),
  extCls: PropTypes.string.def(''),
  onClose: PropTypes.func,
  getContainer: PropTypes.instanceOf(HTMLElement),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  actions: PropTypes.shape<IMessageActions>([]),
};

export default defineComponent({
  name: 'Message',
  props: messageProps,
  emits: ['destroy'],
  setup(props, { emit, slots }) {
    const t = useLocale('message');
    const classNames = computed(() => ['bk-message', `bk-message-${props.theme}`, `${props.extCls}`]);
    const zIndex = bkZIndexManager.getMessageNextIndex();

    const singleLineWidth = 560;
    const advanceWidth = 800;

    const singleLineDelay = 3000;
    const advanceDelay = 8000;

    const timerDelay = computed(() => {
      if (/^\d+\.?\d*$/.test(`${props.delay}`)) {
        return props.delay;
      }

      if (typeof props.message === 'object' && !isVNode(props.message)) {
        return advanceDelay;
      }

      return singleLineDelay;
    });

    const contentWidth = computed(() => {
      if (/^\d+/.test(`${props.width}`)) {
        return /^\d+\.?\d*$/.test(`${props.width}`) ? `${props.width}px` : props.width;
      }

      if (typeof props.message === 'object' && !isVNode(props.message)) {
        return `${advanceWidth}px`;
      }

      return `${singleLineWidth}px`;
    });

    const isGetContainer = computed<boolean>(() => props.getContainer && isElement(props.getContainer));
    const styles = computed(() => ({
      top: `${props.offsetY}px`,
      zIndex,
      position: (isGetContainer.value ? 'absolute' : 'fixed') as 'absolute' | 'fixed',
      width: contentWidth.value,
    }));

    const refJsonContent = ref(null);
    const refCopyStatus = ref(null);
    const refCopyMsgDiv = ref(null);
    const visible = ref(false);
    const toolOperation = reactive({
      isFix: false,
      isDetailShow: false,
    });

    let timer = null;
    const startTimer = () => {
      timer = setTimeout(() => {
        if (toolOperation.isFix) {
          return;
        }

        visible.value = false;
      }, timerDelay.value);
    };

    const close = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      visible.value = false;
    };

    let copyStatusTimer;
    const isInstallClipboardJS = ref(false);
    const copyStatus = ref(null);

    const copyMessage = (_e: MouseEvent) => {
      if (isInstallClipboardJS.value) {
        return;
      }

      const copyInstance = new ClipboardJS(refCopyMsgDiv.value as HTMLElement, {
        text: () => (props.message as any).details,
      });

      ['success', 'error'].forEach((theme) => {
        copyInstance.on(theme, () => {
          const target = refCopyStatus.value as HTMLElement;
          copyStatus.value = theme;
          if (target) {
            target.classList.remove(...['success', 'error', 'is-hidden']);
            target.classList.add(...[theme, 'is-show']);
            copyStatusTimer && clearTimeout(copyStatusTimer);
            copyStatusTimer = setTimeout(() => {
              target.classList.remove(...['is-show']);
              target.classList.add(...['is-hidden']);
            }, 2000);
          }
        });
        isInstallClipboardJS.value = true;
        setTimeout(() => {
          (refCopyMsgDiv.value as HTMLElement).click();
        });
      });
    };

    const parseJson = (value) => {
      let targetJson = value;
      if (typeof value === 'string') {
        try {
          targetJson = JSON.parse(value);
        } catch (e) {
          console.error(`Format Json Error: ${e}`);
        }
      }

      return targetJson;
    };

    const setDetailsShow = (e: MouseEvent, isShow?: boolean) => {
      toolOperation.isDetailShow = isShow ?? !toolOperation.isDetailShow;
      fixMesage(e, toolOperation.isDetailShow);

      if (
        toolOperation.isDetailShow
        && typeof props.message === 'object'
        && !isVNode(props.message)
        && (props.message.type === MessageContentType.JSON || !props.message.type)
      ) {
        const targetJson = parseJson(props.message.details);
        const formatter = new JSONFormatter(targetJson);
        setTimeout(() => {
          if (refJsonContent.value) {
            refJsonContent.value.innerHTML = '';
            refJsonContent.value.append(formatter.render());
          }
        });
      }
    };

    const fixMesage = (e: MouseEvent, isFix?: boolean) => {
      toolOperation.isFix = isFix ?? !toolOperation.isFix;
    };

    onMounted(() => {
      timerDelay.value && startTimer();
      visible.value = true;
    });

    onUnmounted(() => {
      clearTimeout(timer);
    });

    watch(visible, () => {
      if (!visible.value) {
        emit('destroy', props.id);
      }
    });

    const handleMouseenter = (_e: MouseEvent) => {
      clearTimeout(timer);
    };

    const handleMouseleave = (_e: MouseEvent) => {
      timerDelay.value && startTimer();
    };

    const handleHeplerClick = (_e: MouseEvent) => {
      if ((props.message as IMessage).assistant) {
        window.open((props.message as IMessage).assistant, '_blank');
      }
    };

    const defActionList = computed(() => ({
      [IMessageActionType.ASSISTANT]: {
        id: IMessageActionType.ASSISTANT,
        icon: () => <WeixinPro></WeixinPro>,
        text: () => t.value.assistant,
        onClick: (e: MouseEvent) => handleHeplerClick(e),
      },
      [IMessageActionType.DETAILS]: {
        id: IMessageActionType.DETAILS,
        icon: () => (toolOperation.isDetailShow ? <AngleDoubleUpLine /> : <AngleDoubleDownLine />),
        text: () => t.value.details,
        onClick: (e: MouseEvent) => setDetailsShow(e),
      },
      [IMessageActionType.FIX]: {
        id: IMessageActionType.FIX,
        icon: () => (toolOperation.isFix ? <FixShape></FixShape> : <FixLine></FixLine>),
        classList: toolOperation.isFix ? 'fixed' : '',
        onClick: (e: MouseEvent) => fixMesage(e),
      },
      [IMessageActionType.CLOSE]: {
        id: IMessageActionType.CLOSE,
        classList: 'normal-color',
        icon: () => props.dismissable && <Error class='bk-message-close' onClick={close} />,
        onClick: close,
      },
    }));

    const sortActionIdList = [
      IMessageActionType.ASSISTANT,
      IMessageActionType.DETAILS,
      IMessageActionType.FIX,
      IMessageActionType.CLOSE,
    ];

    const actionList = computed(() => {
      if (props.actions?.length > 0) {
        const resultList = props.actions.map((action) => {
          const id = action.id.toLocaleLowerCase();
          const defAction: IMessageAction = defActionList.value[id];
          const defClickFn = defAction?.onClick;
          const target = Object.assign({}, defActionList.value[id] || {}, action);
          target.id = id;

          if (action.classList !== undefined) {
            const classList = Array.isArray(action.classList) ? action.classList : [action.classList];
            let defClassList = [];
            if (defAction.classList !== undefined) {
              defClassList = Array.isArray(defAction.classList) ? defAction.classList : [defAction.classList];
            }

            target.classList = [...defClassList, ...classList];
          }

          if (typeof action.onClick === 'function') {
            target.onClick = () => {
              const resp = Reflect.apply(action.onClick, this, []);
              if ((typeof resp === undefined || resp) && typeof defClickFn === 'function') {
                Reflect.apply(defClickFn, this, []);
              }
            };

            return target;
          }

          target.onClick = defClickFn;
          return target;
        });
        const appendList = sortActionIdList
          .filter(id => !resultList.some(action => action.id === id))
          .map(id => defActionList.value[id]);
        resultList.push(...appendList);
        return resultList;
      }

      return sortActionIdList.map(id => defActionList.value[id]);
    });

    const renderMessageActions = () => {
      const renderIcon = ({ icon }: IMessageAction) => {
        if (typeof icon === 'function') {
          return Reflect.apply(icon, this, []);
        }

        return <span class={icon}></span>;
      };

      const renderText = ({ text }: IMessageAction) => {
        let content = undefined;
        if (typeof text === 'function') {
          content = Reflect.apply(text, this, []);
        }

        if (content === undefined) {
          return;
        }

        if (typeof content === 'string') {
          return <span class='message-action-text'>{content}</span>;
        }

        return content;
      };

      const handleActionClick = (e, action: IMessageAction) => {
        if (action.readonly || action.disabled) {
          return;
        }

        if (typeof action.onClick === 'function') {
          Reflect.apply(action.onClick, this, [e, action]);
        }
      };

      const renderActionList = () => actionList.value.map((action) => {
        if (action.disabled) {
          return null;
        }

        if (typeof action.render === 'function') {
          return Reflect.apply(action.render, this, []);
        }

        const classList = Array.isArray(action.classList) ? action.classList.join(' ') : action.classList;

        return (
            <span class={['tool', action.id, classList]} onClick={e => handleActionClick(e, action)}>
              {renderIcon(action)}
              {renderText(action)}
            </span>
        );
      });

      return slots.action?.() ?? renderActionList();
    };

    return {
      classNames,
      styles,
      visible,
      close,
      setDetailsShow,
      fixMesage,
      copyMessage,
      parseJson,
      handleMouseenter,
      handleMouseleave,
      renderMessageActions,
      refJsonContent,
      refCopyStatus,
      refCopyMsgDiv,
      toolOperation,
      copyStatus,
      t,
    };
  },
  render() {
    const renderIcon = (theme?) => {
      const iconMap = {
        primary: <Info></Info>,
        warning: <Warn></Warn>,
        success: <Success></Success>,
        error: <Close></Close>,
      };
      return iconMap[theme ?? this.theme];
    };

    const renderMsgDetail = (msg: IMessage) => {
      if (msg.type === MessageContentType.KEY_VALUE) {
        const target = this.parseJson(msg.details || {});
        const keys = Object.keys(target);
        return keys.map(key => (
          <div class='message-row'>
            <label>{key}</label>
            {target[key]}
          </div>
        ));
      }
    };

    const renderMessage = () => {
      if (typeof this.message === 'object' && !isVNode(this.message)) {
        return (
          <div class='bk-message-content multi'>
            <div class='overview'>
              <div class='left-content'>
                <div class='bk-message-icon'>{renderIcon()}</div>
                <div class='describe'>
                  {this.$slots.title?.()
                    ?? `【${this.message.code}】${this.message.overview} ${this.message.suggestion}`}
                </div>
              </div>
              <div class='tools'>{this.renderMessageActions()}</div>
            </div>
            {this.toolOperation.isDetailShow && (
              <div class='message-detail'>
                <div class='message-copy' ref="refCopyMsgDiv" onClick={this.copyMessage}>
                  <CopyShape></CopyShape>
                  <div class="copy-status" ref="refCopyStatus">
                    <div class="inner">
                      { renderIcon(this.copyStatus) }
                      { this.copyStatus === 'success' ? this.t.copySuccess : this.t.copyFailed }
                    </div>
                  </div>
                </div>
                <div ref='refJsonContent' class="message-tree">{renderMsgDetail(this.message)}</div>
              </div>
            )}
          </div>
        );
      }

      return (
        <>
          <div class='bk-message-content'>
            <div class='bk-message-icon'>{renderIcon()}</div>
            {this.message}
          </div>
          {this.dismissable && <Error class='bk-message-close' onClick={this.close} />}
        </>
      );
    };

    return (
      <Transition name='bk-message-fade'>
        <div
          v-show={this.visible}
          class={this.classNames}
          style={this.styles}
          onMouseenter={this.handleMouseenter}
          onMouseleave={this.handleMouseleave}
        >
          {renderMessage()}
        </div>
      </Transition>
    );
  },
});
