import { defineComponent, ref, computed, type PropType } from 'vue';

import type { IComponentWiki, ValueType as ComponentPropValue } from '@/types/component';

import RenderNumber from './number.vue';
import RenderString from './string.vue';
import RenderBoolean from './boolean.vue';
import RenderEnum from './enum.vue';
import RenderArray from './array.vue';
import RenderObject from './object.vue';
import RenderErrorType from './errortype.vue';

import './index.postcss';

import { factType } from './utils';

// 根据类型渲染不同的组件
export default defineComponent({
  name: 'DynamicConfigItem',
  props: {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    modelValue: {
      type: [String, Number, Boolean, Object, Array] as PropType<ComponentPropValue>,
      default: undefined,
    },
    // options 仅在 数据类型 为 enum 时有效
    options: {
      type: Array as PropType<IComponentWiki['props'][number]['options']>,
      default: () => [],
    },
    complexTypes: {
      type: Array as PropType<IComponentWiki['types']>,
      default: () => [],
    },
    parentNo: {
      type: String,
      default: '',
    },
  },
  emits: {
    'update:modelValue': (__: ComponentPropValue) => true,
  },
  setup(props) {
    const singleType = ref('');
    const typeList = props.type.split('|').map(item => item.trim().replace(/'/g, '')).filter(item => item)
    singleType.value = typeList?.[0];
    const typeValue = computed(() => {
      return factType(singleType.value, props.options, props.complexTypes)
    });
    const isOnlyBoolean = computed(() => {
      return props.type.toLowerCase() === 'boolean'
    });
    return {
      singleType,
      typeList,
      typeValue,
      isOnlyBoolean,
    };
  },
  render() {
    const handleUpdate = (value: ComponentPropValue) => {
      this.$emit('update:modelValue', value);
    };
    const typeSelectRender = () => {
      if(this.typeList.length > 1) {
        return (
          <div class='dynamic-type-select'>
            <RenderEnum
              modelValue={this.singleType as string}
              onUpdate:modelValue={(value: string) => { this.singleType = value;}}
              options={this.typeList}
              clearable={false}
            />
          </div>
        )
      }
      return null
    }
    const typeConfigItemRender = () => {
      switch (this.typeValue) {
        case 'string':
          return (
            <RenderString
              modelValue={this.modelValue as string}
              onUpdate:modelValue={handleUpdate}
            />
          );
        case 'number':
          return (
            <RenderNumber
              modelValue={this.modelValue as number}
              onUpdate:modelValue={handleUpdate}
            />
          );
        case 'boolean':
          return (
            <RenderBoolean
              modelValue={this.modelValue as boolean}
              onUpdate:modelValue={handleUpdate}
            />
          );
        case 'enum':
          return (
            <RenderEnum
              modelValue={this.modelValue as string}
              onUpdate:modelValue={handleUpdate}
              options={this.options}
            />
          );
        case 'array':
          return (
            <RenderArray
              modelValue={this.modelValue as Array<Record<string, ComponentPropValue> | string | number | boolean>}
              onUpdate:modelValue={handleUpdate}
              name={this.name}
              type={this.singleType}
              complexTypes={this.complexTypes}
              parentNo={this.parentNo}
            />
          );
        case 'object':
          return (
            <RenderObject
              modelValue={this.modelValue as object}
              onUpdate:modelValue={handleUpdate}
              type={this.singleType}
              complexTypes={this.complexTypes}
            />
          );
        default:
          return (
            <RenderErrorType />
          );
      }
    };

    return (
      <div class='config-item'>
        <div class={`config-item-name${this.isOnlyBoolean ? ' mb4': ''}`}>
          {this.$slots.nameTip?.()}
        </div>
        <div class={`config-item-content${this.isOnlyBoolean || this.typeValue === 'array' ? '': ' type-flex'}`}>
          {typeSelectRender()}
          <div>
            {typeConfigItemRender()}
          </div>
        </div>
      </div>
    );
  },
});
