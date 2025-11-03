import { defineComponent, ref, computed, watch, type PropType } from 'vue';

import type { IComponentWiki, ValueType as ComponentPropValue } from '@/types/component';

import RenderNumber from './number.vue';
import RenderString from './string.vue';
import RenderBoolean from './boolean.vue';
import RenderEnum from './enum.vue';
import RenderArray from './array.vue';
import RenderObject from './object.vue';
import RenderErrorType from './errortype.vue';

import './index.postcss';

import { basicTypeToDefVal, splitType, factType } from './utils';

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
  setup(props, { emit }) {
    const singleType = ref('');
    const typeList = computed(() => {
      return splitType(props.type)
    })
    singleType.value = typeList.value?.[0];
    const typeValue = computed(() => {
      return factType(singleType.value, props.options, props.complexTypes)
    });
    const isOnlyBoolean = computed(() => {
      return props.type.toLowerCase() === 'boolean'
    });
    
    const handleUpdate = (value: ComponentPropValue) => {
      emit('update:modelValue', value);
    };
    const newModelValue = ref<ComponentPropValue>()
    watch(() => props.modelValue, (val) => {
      newModelValue.value = val
    }, {
      immediate: true
    })
    watch(typeValue, () => {
      newModelValue.value = basicTypeToDefVal?.[typeValue.value as keyof typeof basicTypeToDefVal] ?? ''
      handleUpdate(newModelValue.value)
    })
    return {
      singleType,
      typeList,
      typeValue,
      isOnlyBoolean,
      handleUpdate,
      newModelValue,
    };
  },
  render() {
    const typeSelectRender = () => {
      if(this.typeList.length > 1) {
        return (
          <div class='dynamic-type-select'>
            <RenderEnum
              modelValue={this.singleType as string}
              onUpdate:modelValue={(value: string) => { 
                this.singleType = value;
              }}
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
              modelValue={this.newModelValue as string}
              onUpdate:modelValue={this.handleUpdate}
            />
          );
        case 'number':
          return (
            <RenderNumber
              modelValue={this.newModelValue as number}
              onUpdate:modelValue={this.handleUpdate}
            />
          );
        case 'boolean':
          return (
            <RenderBoolean
              modelValue={this.modelValue as boolean}
              onUpdate:modelValue={this.handleUpdate}
            />
          );
        case 'enum':
          return (
            <RenderEnum
              modelValue={this.newModelValue as string}
              onUpdate:modelValue={this.handleUpdate}
              options={this.options}
            />
          );
        case 'array':
          return (
            <RenderArray
              modelValue={this.newModelValue as Array<Record<string, ComponentPropValue> | string | number | boolean>}
              onUpdate:modelValue={this.handleUpdate}
              name={this.name}
              type={this.singleType}
              complexTypes={this.complexTypes}
              parentNo={this.parentNo}
            />
          );
        case 'object':
          return (
            <RenderObject
              modelValue={this.newModelValue as object}
              onUpdate:modelValue={this.handleUpdate}
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
