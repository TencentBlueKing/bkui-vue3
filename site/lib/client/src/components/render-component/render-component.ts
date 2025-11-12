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
  // 占位，否则动态注册逻辑需要加额外判断
  components: {},
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

      // 渲染组件
      const component = vue.h(
        this.component.default,
        this.renderProps,
        Object.keys(this.renderSlots).reduce(
          (acc, slotName) => {
            const Fn = Function;
            acc[slotName] = (data?: unknown) => Fn('Vue', 'data', compile(this.renderSlots[slotName]).code)(vue, data)(vue);
            return acc;
          },
          {} as Record<string, (data?: unknown) => object>,
        ),
      );

      // 如果是 Backtop 组件
      if (this.component.default.name === 'Backtop') {
        return vue.h('div', {
          style: this.style,
        }, [
          vue.h('div', ['继续滚动查看出现 Backtop 效果']),
          component,
        ]);
      }

      // 如果是 Affix 组件
      if (this.component.default.name === 'Affix') {
        return vue.h('div', {
          style: this.style,
        }, [
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
        ]);
      }

      return vue.h('div', {
        style: this.style,
      }, [
        component,
      ]);
    };
    return renderComponent();
  },
});
