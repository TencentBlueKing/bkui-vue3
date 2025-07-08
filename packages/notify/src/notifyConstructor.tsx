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

import { computed, defineComponent, onMounted, onUnmounted, ref, Transition, watch } from 'vue';
import { toType } from 'vue-types';

import { usePrefix } from '@bkui-vue/config-provider';
import { Close, Error, Info, Success, Warn } from '@bkui-vue/icon';
import { bkZIndexManager, PropTypes } from '@bkui-vue/shared';

enum NotifyThemeEnum {
  ERROR = 'error',
  PRIMARY = 'primary',
  SUCCESS = 'success',
  WARNING = 'warning',
}
const notifyProps = {
  id: PropTypes.string.def(''),
  title: PropTypes.string.def(''),
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).def(''),
  theme: toType<`${NotifyThemeEnum}`>('notifyTheme', {}).def(NotifyThemeEnum.PRIMARY),
  position: PropTypes.position().def('top-right'),
  delay: PropTypes.number.def(5000),
  dismissable: PropTypes.bool.def(true),
  offsetX: PropTypes.number.def(100),
  offsetY: PropTypes.number.def(30),
  spacing: PropTypes.number.def(10),
  extCls: PropTypes.string.def(''),
  onClose: PropTypes.func,
};

export default defineComponent({
  name: 'Notify',
  props: notifyProps,
  emits: ['destroy'],
  setup(props, { emit }) {
    const zIndex = bkZIndexManager.getMessageNextIndex();

    const horizontalClass = computed(() => (props.position.indexOf('right') > 1 ? 'right' : 'left'));

    const verticalProperty = computed(() => (props.position.startsWith('top') ? 'top' : 'bottom'));
    const styles = computed(() => ({
      [horizontalClass.value]: `${props.offsetX}px`,
      [verticalProperty.value]: `${props.offsetY}px`,
      zIndex,
    }));

    const { resolveClassName } = usePrefix();

    const classNames = computed(() => [
      resolveClassName('notify'),
      resolveClassName(`notify-${props.theme}`),
      horizontalClass.value,
    ]);

    const renderMessage = computed(() => {
      if (typeof props.message === 'function') {
        return props.message();
      }

      return props.message;
    });

    const visible = ref(false);

    let timer = null;
    const startTimer = () => {
      timer = setTimeout(() => {
        visible.value = false;
      }, props.delay);
    };

    const handleClose = () => {
      visible.value = false;
    };

    onMounted(() => {
      props.delay && startTimer();
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

    return {
      classNames,
      styles,
      visible,
      renderMessage,
      handleClose,
      resolveClassName,
    };
  },
  render() {
    const renderIcon = () => {
      const iconMap = {
        primary: <Info></Info>,
        warning: <Warn></Warn>,
        success: <Success></Success>,
        error: <Close></Close>,
      };
      return iconMap[this.theme];
    };

    return (
      <Transition name='bk-notify-fade'>
        <div
          style={this.styles}
          class={this.classNames}
          v-show={this.visible}
        >
          <div class={`${this.resolveClassName('notify-content')}`}>
            <div class={`${this.resolveClassName('notify-icon')}`}>{renderIcon()}</div>
            {this.title ? <div class={`${this.resolveClassName('notify-content-header')}`}>{this.title}</div> : ''}
            <div class={`${this.resolveClassName('notify-content-text')}`}>{this.renderMessage}</div>
          </div>
          {this.dismissable && (
            <Error
              class={`${this.resolveClassName('notify-icon')} ${this.resolveClassName('notify-close')}`}
              onClick={this.handleClose}
            ></Error>
          )}
        </div>
      </Transition>
    );
  },
});
