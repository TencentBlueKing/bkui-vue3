import {
  Button as BkButton,
} from 'bkui-vue';
import * as vue from 'vue';

import { IProp } from '@/types/component';

import { processRenderEvents, processRenderProps, registerComponents } from './utils';

export default vue.defineComponent({
  name: 'RenderFunction',
  props: {
    component: {
      type: Object,
      required: true,
    },
    renderProps: {
      type: Object,
      default: () => ({}),
    },
    events: {
      type: Object as vue.PropType<Record<string, string>>,
      default: () => ({}),
    },
    props: {
      type: Object as vue.PropType<IProp[]>,
      default: () => ({}),
    },
    dependentComponents: {
      type: Object,
      default: (_data?: unknown) => ({}),
    },
    dependentProps: {
      type: Array as vue.PropType<string[]>,
      default: () => ([] as string[]),
    },
  },
  components: {},
  render() {
    // 注册组件和依赖组件
    registerComponents(
      this.component,
      this.dependentComponents,
      this as vue.ComponentInstance<vue.Component>,
    );

    // 处理 events
    const renderEvents = processRenderEvents(
      this.events,
      this.renderProps,
      this.dependentProps,
      (event: 'update:renderProps', value: Record<string, unknown>) => {
        this.$emit(event, value);
      },
    );

    // 处理 props
    const renderProps = processRenderProps(
      this.renderProps,
      this.props,
      renderEvents,
      (event: 'update:renderProps', value: Record<string, unknown>) => {
        this.$emit(event, value);
      },
    );

    return vue.h(
      BkButton,
      {
        theme: 'primary',
        onClick: () => this.component.default({
          ...renderEvents,
          ...renderProps,
        }),
      },
      ['点击展示组件'],
    );
  },
});
