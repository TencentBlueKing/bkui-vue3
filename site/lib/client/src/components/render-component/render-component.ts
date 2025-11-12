import {
  clickoutside,
} from 'bkui-vue';
import type {
  Component,
  ComponentInstance,
} from 'vue';
import * as vue from 'vue';

import {
  compile,
} from '@vue/compiler-dom';

import type { PropType } from 'vue';
import type { IProp } from '@/types/component';

import { kebabToCamel } from '@/common/util';

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
      type: String
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
  },
  render() {
    // 构建依赖组件映射的公共方法
    const buildDependentComponentsMap = () => {
      const map: Record<string, Component> = {};
      Object.keys(this.dependentComponents).forEach((componentName) => {
        const depComp = this.dependentComponents[componentName];
        if (!Object.keys(depComp).length) return;

        Object.keys(depComp).forEach((subKey) => {
          if (subKey === 'default') {
            // 转换为 PascalCase: 'bk-menu' -> 'BkMenu'
            const nameWithoutBk = componentName.startsWith('bk-')
              ? componentName.slice(3)
              : componentName;
            const pascalCaseName = `Bk${nameWithoutBk
              .split('-')
              .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
              .join('')}`;
            map[pascalCaseName] = depComp.default;
          } else {
            map[subKey] = depComp[subKey];
          }
        });
      });
      return map;
    };

    const renderComponent = () => {
      // 使用 template 渲染（支持子组件嵌套，如 CheckboxGroup）
      if (this.template) {
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
            ...buildDependentComponentsMap(),
          },
          template: this.template,
          setup() {
            return { ...renderPropsData };
          },
        });

        return vue.h(RuntimeComponent, this.renderProps);
      }

      // 注册当前组件的所有子组件
      if (Object.keys(this.component).length > 1) {
        Object.keys(this.component).forEach((key) => {
          (this as ComponentInstance<Component>)._.components[key] = this.component[key];
        });
      }

      // 注册依赖组件
      const dependentComponentsMap = buildDependentComponentsMap();
      Object.entries(dependentComponentsMap).forEach(([name, comp]) => {
        (this as ComponentInstance<Component>)._.components[name] = comp;
      });

      // 处理 events
      const renderEvents = Object.keys(this.events).reduce(
        (acc, key) => {
          const Fn = Function;
          // 处理箭头函数: (param: Type, param2: Type2) => 或 async (param: Type) =>
          const eventCode = this.events[key].replace(/(async\s+)?\(([^)]*)\)\s*=>/g, (_match: string, asyncKeyword: string, params: string) => {
            const cleanParams = params.replace(/(\w+)\s*:\s*[^,)]+/g, '$1');
            return `${asyncKeyword || ''}(${cleanParams}) =>`;
          });

          // 例如：'click' -> 'onClick', 'custom-event' -> 'onCustomEvent'
          const eventName = 'on' + key
            .split('-')
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join('');
          // 创建一个返回该箭头函数的函数，然后立即执行得到箭头函数本身
          acc[eventName] = Fn(`return (${eventCode})`)();
          return acc;
        },
        {} as Record<string, (data?: unknown) => void>,
      );

      // 处理 props
      const renderProps = Object.keys(this.renderProps).reduce((acc, key) => {
        const propValue = this.renderProps[key];
        const prop = this.props.find(item => kebabToCamel(item.name) === kebabToCamel(key));
  
        // 判断 prop 是否为函数类型（包含 => 或以 function 开头）
        const isFunctionType = prop.type && (prop.type.includes('=>') || prop.type.startsWith('function'));
        
        if (isFunctionType) {
          // 如果是函数类型且值是字符串，需要转换为可执行函数
          const Fn = Function;
          // 去除 TypeScript 类型标注（只处理参数列表中的类型标注）
          // 匹配箭头函数或普通函数的参数列表，避免影响函数体
          let functionCode = propValue;
          
          // 处理箭头函数: (param: Type, param2: Type2) => 或 async (param: Type) =>
          functionCode = functionCode.replace(/(async\s+)?\(([^)]*)\)\s*=>/g, (_match: string, asyncKeyword: string, params: string) => {
            // 去除参数中的类型标注: param: Type -> param
            const cleanParams = params.replace(/(\w+)\s*:\s*[^,)]+/g, '$1');
            return `${asyncKeyword || ''}(${cleanParams}) =>`;
          });

          // 转换为实际函数
          acc[prop.name] = Fn(`return (${functionCode})`)();
        } else {
          // 其他类型直接赋值
          acc[prop.name] = propValue;
        }

        if (prop.isSupportVModel) {
          renderEvents[`onUpdate:${key}`] = (value: unknown) => {
            const newRenderProps = { ...renderProps };
            newRenderProps[key] = value;
            this.$emit('update:renderProps', newRenderProps);
          };
        }

        return acc;
      }, {} as Record<string, unknown>);

      // 处理 slots
      const renderSlots = Object.keys(this.renderSlots).reduce(
        (acc, slotName) => {
          const Fn = Function;
          acc[slotName] = (data?: unknown) => Fn('Vue', 'data', compile(this.renderSlots[slotName]).code)(vue, data)(vue);
          return acc;
        },
        {} as Record<string, (data?: unknown) => object>,
      );

      // 渲染组件
      const component = vue.h(
        this.component.default,
        {
          ...renderEvents,
          ...renderProps,
        },
        renderSlots,
      );

      // 如果是 Backtop 组件
      if (this.component.default.name === 'Backtop') {
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
          ]
        );
      }

      // 如果是 Affix 组件
      if (this.component.default.name === 'Affix') {
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
            }
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
              ['继续滚动查看固定效果']
            ),
          ]
        );
      }

      return vue.h(
        'section',
        {},
        [
          component,
        ]
      );
    };

    return renderComponent();
  },
});
