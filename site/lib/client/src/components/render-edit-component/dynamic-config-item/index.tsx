import {
  defineComponent,
  type PropType,
} from 'vue';

import type {
  PropType as ComponentPropType,
  PropValue as ComponentPropValue,
} from '@/types/component';

import RenderNumber from './number.vue';
import RenderString from './string.vue';

// 根据类型渲染不同的组件
export default defineComponent({
  name: 'DynamicConfigItem',
  props: {
    type: {
      type: String as PropType<ComponentPropType>,
      required: true,
    },
    modelValue: {
      type: [String, Number, Boolean, Object, Array] as PropType<ComponentPropValue>,
      default: undefined,
    },
  },
  emits: {
    'update:modelValue': (__: ComponentPropValue) => true,
  },
  render() {
    const handleUpdate = (value: ComponentPropValue) => {
      this.$emit('update:modelValue', value);
    };

    switch (this.type) {
      case 'string':
        return <RenderString
          modelValue={this.modelValue as string}
          onUpdate:modelValue={handleUpdate}
        />;
      case 'number':
        return <RenderNumber
          modelValue={this.modelValue as number}
          onUpdate:modelValue={handleUpdate}
        />;

        // TODO: 添加其他类型的渲染组件
        // case 'boolean':
        // case 'array':
        // case 'object':
        // case 'enum';  a | b | c 这样的类型就是枚举

      default:
        return null;
    }
  },
});
