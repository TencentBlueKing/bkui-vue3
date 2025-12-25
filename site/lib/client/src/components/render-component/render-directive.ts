import {
  Message,
} from 'bkui-vue';
import * as vue from 'vue';

export default vue.defineComponent({
  name: 'RenderDirective',
  props: {
    name: {
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
  },
  // 占位，否则动态注册逻辑需要加额外判断
  components: {},
  render() {
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

    return vue.h(
      'div',
      {},
      [
        renderDirectiveComponent(),
      ],
    );
  },
});
