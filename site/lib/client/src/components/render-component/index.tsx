import * as vue from 'vue';
import type {
  ComponentInstance,
  Component,
} from 'vue';
import {
  compile,
} from '@vue/compiler-dom';
import {
  useClipboard,
} from '@vueuse/core';
import {
  Message,
  Input as BkInput,
  Button as BkButton,
  clickoutside,
} from 'bkui-vue';

const { copy } = useClipboard({
  legacy: true,
});

export default vue.defineComponent({
  name: 'RenderComponent',
  directives: {
    clickoutside,
  },
  props: {
    name: {
      type: String,
    },
    group: {
      type: String,
    },
    template: {
      type: String,
      default: '',
    },
    component: {
      type: Object,
      required: true,
    },
    renderProps: {
      type: Object,
      default: () => ({}),
    },
    renderSlots: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    BkInput,
    BkButton
  },
  data() {
    return {
      errorMessage: '',
    }
  },
  errorCaptured(err: Error) {
    this.errorMessage = err.message;
    return false;
  },
  render() {
    const renderError = () => {
      return vue.h('div', {
        style: {
          color: '#EA3636',
        },
      }, this.errorMessage);
    };

    const renderComponent = () => {
      if (Object.keys(this.component).length > 1) {
        Object.keys(this.component).forEach((key) => {
          (this as ComponentInstance<Component>)._.components[key] = this.component[key]
        })
      }
      return vue.h(
        this.component.default,
        this.renderProps,
        Object.keys(this.renderSlots).reduce(
          (acc, slotName) => {
            const Fn = Function;
            acc[slotName] = () => Fn('Vue', compile(this.renderSlots[slotName]).code)(vue)(vue);
            return acc;
          },
          {} as Record<string, () => object>,
        ),
      );
    }

    const renderIconComponent = () => {
      return vue.h(
        'section',
        Object.keys(this.component).map((key) => {
          return vue.h(
            this.component[key],
            {
              ...this.renderProps,
              style: {
                margin: '10px',
                cursor: 'pointer',
              },
              onclick() {
                copy(key);
                Message({
                  message: `复制Icon名【${key}】成功`,
                  theme: 'success',
                });
              }
            }
          )
        })
      )
    }

    const renderDirectiveComponent = () => {
      const RuntimeComponent = vue.defineComponent({
        name: `Render${this.name}Directive`,
        directives: {
          [this.name]: this.component.default
        },
        setup() {
          const handleClickOutside = () => {
            Message({
              message: '点击了外部区域',
              theme: 'primary',
            });
          };
          return {
            handleClickOutside,
          };
        },
        template: this.template,
      });
      // 渲染组件，renderProps 作为 props 传入。指令使用 $attrs 使用属性
      return vue.h(RuntimeComponent, {
        ...this.renderProps,
      });
    }

    const renderFunctionComponent = () => {
      return vue.h(
        BkButton,
        {
          theme: 'primary',
          onClick: () => this.component.default(this.renderProps)
        },
        ['点击展示组件']
      )
    }
  
    if (this.errorMessage) {
      return renderError();
    } else if (typeof this.component.default === 'function') {
      return renderFunctionComponent();
    } else if (this.name === 'icon') {
      return renderIconComponent();
    } else if (this.group === '指令') {
      return renderDirectiveComponent();
    } else {
      return renderComponent();
    }
  },
});
