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
} from 'bkui-vue';

const { copy } = useClipboard({
  legacy: true,
});

export default vue.defineComponent({
  name: 'RenderComponent',
  props: {
    name: {
      type: String,
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
  render() {
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
 
    if (typeof this.component.default === 'function') {
      return renderFunctionComponent();
    } else if (this.name === 'icon') {
      return renderIconComponent();
    } else {
      return renderComponent();
    }
  },
});
