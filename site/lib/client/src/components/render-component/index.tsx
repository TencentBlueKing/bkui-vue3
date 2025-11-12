import * as vue from 'vue';

import RenderComponent from './render-component';
import RenderDirective from './render-directive';
import RenderFunction from './render-function';
import RenderIcon from './render-icon';
import RenderError from './render-error';
import RenderLoading from './render-loading';

export default vue.defineComponent({
  name: 'RenderComponentWrapper',
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
    style: {
      type: String
    },
    component: {
      type: Object,
      required: true,
    },
    events: {
      type: Object,
      default: () => ({}),
    },
    renderProps: {
      type: Object,
      default: () => ({}),
    },
    renderSlots: {
      type: Object,
      default: () => ({}),
    },
    dependentComponents: {
      type: Object,
      default: (_data?: unknown) => ({}),
    },
  },
  data() {
    return {
      errorMessage: '',
      loading: true,  // 添加准备状态
    };
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
  },
  errorCaptured(err) {
    this.errorMessage = (err as Error).message;
    return false;
  },
  mounted() {
    // 等待父组件 DOM 完全挂载, 确保类似dialog等组件可以正确找到挂载点
    this.$nextTick(() => {
      this.loading = false;
    });
  },
  render() {
    if (this.loading) {
      return <RenderLoading />;
    } else if (this.errorMessage) {
      return <RenderError
        key={this.errorMessage}
        errorMessage={this.errorMessage}
      />;
    } else if (this.name === 'icon') {
      return <RenderIcon
        component={this.component}
        renderProps={this.renderProps}
      />;
    } else if (this.group === '指令') {
      return <RenderDirective
        key={this.name}
        name={this.name}
        template={this.template}
        component={this.component}
        renderProps={this.renderProps}
      />;
    } else if (typeof this.component.default === 'function') {
      return <RenderFunction
        key={this.component.default}
        component={this.component}
        renderProps={this.renderProps}
      />;
    }

    return <RenderComponent
      key={this.name}
      name={this.name}
      group={this.group}
      template={this.template}
      componentStyle={this.style}
      component={this.component}
      events={this.events}
      renderProps={this.renderProps}
      renderSlots={this.renderSlots}
      dependentComponents={this.dependentComponents}
    />;
  },
});
