import {
  clickoutside,
} from 'bkui-vue';
import type {
  Component,
  ComponentInstance,
  PropType } from 'vue';
import * as vue from 'vue';

import type { IProp } from '@/types/component';

import {
  buildDependentComponentsMap,
  processRenderEvents,
  processRenderProps,
  processRenderSlots,
  registerComponents,
} from './utils';

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
    componentStyle: {
      type: String,
    },
    component: {
      type: Object,
      required: true,
    },
    events: {
      type: Object as PropType<Record<string, string>>,
      default: () => ({}),
    },
    props: {
      type: Object as PropType<IProp[]>,
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
    dependentProps: {
      type: Array as vue.PropType<string[]>,
      default: () => ([] as string[]),
    },
  },
  emits: {
    'update:renderProps': (value: Record<string, unknown>) => value !== undefined,
  },
  // 占位，否则动态注册逻辑需要加额外判断
  components: {},
  created() {
    this.initStyle();
  },
  beforeUnmount() {
    this.removeStyle();
    // 移除在window上注册的依赖组件
    this.removeDependentFunctionComps();
  },
  methods: {
    initStyle() {
      // 移除已有的样式
      this.removeStyle();

      // 添加新的样式
      if (this.componentStyle) {
        const style = document.createElement('style');
        style.textContent = this.componentStyle;
        style.id = 'render-component-style';
        document.head.appendChild(style);
      }
    },
    removeStyle() {
      const style = document.getElementById('render-component-style');
      if (style) {
        document.head.removeChild(style);
      }
    },
    removeDependentFunctionComps() {
      Object.keys(this.dependentComponents).forEach((componentName) => {
        delete (window as unknown as Record<string, unknown>)[componentName];
      });
    },
  },
  render() {
    // template渲染模式, 子组件套主组件的渲染模式
    const templateRender = () => {
      // 构建当前组件的所有子组件映射
      const componentsMap: Record<string, Component> = {};
      Object.keys(this.component).forEach((key) => {
        componentsMap[key] = this.component[key];
      });

      // 创建运行时组件
      const renderPropsData = this.renderProps;
      const RuntimeComponent = vue.defineComponent({
        name: `Render${this.name?.charAt(0).toUpperCase() + this.name?.slice(1)}`,
        components: {
          ...componentsMap,
          ...buildDependentComponentsMap(this.dependentComponents),
        },
        template: this.template,
        setup() {
          return { ...renderPropsData };
        },
      });

      return vue.h(RuntimeComponent, this.renderProps);
    };

    // 处理 Backtop 组件
    const processBackTopRender = (component: vue.VNode) => {
      return vue.h(
        'section',
        {
          style: {
            width: '100%',
            height: '1000px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transform: 'translate(0,0)',
          },
        },
        [
          vue.h('div', ['继续滚动查看出现 Backtop 效果']),
          component,
        ],
      );
    };

    // 处理 Affix 组件
    const processAffixRender = (component: vue.VNode) => {
      return vue.h(
        'section',
        {
          style: {
            width: '100%',
            height: '2000px',
            alignSelf: 'initial',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            textAlign: 'left',
          },
        },
        [
          vue.h('div', {
            style: {
              width: '100%',
              height: '1000px',
              color: '#63656e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #63656e',
            },
          }, ['继续滚动查看固定效果']),
          component,
          vue.h(
            'div', {
              style: {
                width: '100%',
                height: '1000px',
                color: '#63656e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #63656e',
              },
            },
            ['继续滚动查看固定效果'],
          ),
        ],
      );
    };

    // 普通渲染模式
    const normalComponentRender = () => {
      // 注册组件和依赖组件
      registerComponents(
        this.component,
        this.dependentComponents,
        this as ComponentInstance<Component>,
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

      // 创建组件实例引用
      const componentRef = vue.ref<ComponentInstance<Component> | null>(null);

      // 处理 slots
      // form 表单组件需要额外的处理，因为表单组件的验证需要通过组件实例引用调用
      const renderSlots = processRenderSlots(
        this.renderSlots,
        this.renderProps,
        this.dependentProps,
        (event: 'update:renderProps', value: Record<string, unknown>) => {
          this.$emit(event, value);
        },
        () => componentRef.value?.validate?.(),
      );

      // 渲染组件
      const component = vue.h(
        this.component.default,
        {
          ...renderEvents,
          ...renderProps,
          ref: componentRef,
        },
        renderSlots,
      );

      // 如果是 Backtop 组件
      if (this.component.default.name === 'Backtop') {
        return processBackTopRender(component);
      }

      // 如果是 Affix 组件
      if (this.component.default.name === 'Affix') {
        return processAffixRender(component);
      }

      return vue.h(
        'section',
        {},
        [
          component,
        ],
      );
    };

    return this.template ? templateRender() : normalComponentRender();
  },
});
