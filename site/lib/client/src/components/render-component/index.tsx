import {
  Button as BkButton,
  clickoutside,
  Exception as BkException,
  Input as BkInput,
  Loading as BkLoading,
  Message,
} from 'bkui-vue';
import type {
  Component,
  ComponentInstance,
} from 'vue';
import * as vue from 'vue';

import {
  compile,
} from '@vue/compiler-dom';
import {
  useClipboard,
} from '@vueuse/core';

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
    BkButton,
    BkLoading,
  },
  data() {
    return {
      errorMessage: '',
      isReady: false,  // 添加准备状态
    };
  },
  mounted() {
    // 等待父组件 DOM 完全挂载, 确保类似dialog等组件可以正确找到挂载点
    this.$nextTick(() => {
      this.isReady = true;
    });
  },
  // 如果使用beforeUpdate，会导致无限循环渲染
  watch: {
    renderProps: {
      handler() {
        // renderProps 变化时清空错误信息
        this.errorMessage = '';
      },
      deep: true,
    },
    renderSlots: {
      handler() {
        // renderSlots 变化时清空错误信息
        this.errorMessage = '';
      },
      deep: true,
    },
  },
  errorCaptured(err) {
    this.errorMessage = (err as Error).message;
    return false;
  },
  render() {
    if (!this.isReady) {
      return vue.h(BkLoading, {
        loading: true,
      });
    }

    const renderError = () => {
      return vue.h(BkException, {
        type: '500',
        scene: 'page',
        title: this.errorMessage,
      });
    };

    const renderComponent = () => {
      // 如果组件有多个子组件，则将子组件注册到组件实例中
      if (Object.keys(this.component).length > 1) {
        Object.keys(this.component).forEach((key) => {
          (this as ComponentInstance<Component>)._.components[key] = this.component[key];
        });
      }
      const component = vue.h(
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

      // 如果是 Backtop 组件，外面套一层 1000px 高的 div 以产生滚动内容
      if (this.component.default.name === 'Backtop') {
        return vue.h('div', {
          style: {
            height: '1000px',
            position: 'relative',
          },
        }, [component]);
      }

      return component;
    };

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
              },
            },
          );
        }),
      );
    };

    const renderDirectiveComponent = () => {
      const RuntimeComponent = vue.defineComponent({
        name: `Render${this.name}Directive`,
        directives: {
          [this.name]: this.component.default,
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
    };

    const renderFunctionComponent = () => {
      return vue.h(
        BkButton,
        {
          theme: 'primary',
          onClick: () => this.component.default(this.renderProps),
        },
        ['点击展示组件'],
      );
    };

    console.log(111);
    if (this.errorMessage) {
      return renderError();
    } if (typeof this.component.default === 'function') {
      return renderFunctionComponent();
    } if (this.name === 'icon') {
      return renderIconComponent();
    } if (this.group === '指令') {
      return renderDirectiveComponent();
    }
    return renderComponent();
  },
});
