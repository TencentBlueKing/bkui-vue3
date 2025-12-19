import { computed, defineComponent, type PropType, ref, watch } from 'vue';

import type { CodeLanguages, IComponentWiki, ValueType as ComponentPropValue } from '@/types/component';

import Tab from '../config/tab';

import RenderArray from './array.vue';
import RenderBoolean from './boolean.vue';
import RenderEnum from './enum.vue';
import RenderErrorType from './errortype.vue';
import RenderFunction from './function.vue';
import RenderNumber from './number.vue';
import RenderObject from './object.vue';
import RenderString from './string.vue';
import {
  basicTypeToDefVal,
  factType,
  isTypeArray,
  isTypeFunction,
  splitType,
  valueType,
  isUndefined
} from './utils';

import './index.postcss';

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
    defaultVal: {
      type: [String, Number, Boolean, Object, Array] as PropType<ComponentPropValue>,
      default: undefined,
    },
    // options 仅在 数据类型 为 enum 时有效
    options: {
      type: Array as PropType<IComponentWiki['props'][number]['options']>,
      default: () => [] as IComponentWiki['props'][number]['options'],
    },
    complexTypes: {
      type: Array as PropType<IComponentWiki['types']>,
      default: () => [] as IComponentWiki['types'],
    },
    activeLanguage: {
      type: String as PropType<CodeLanguages>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    'update:modelValue': (__: ComponentPropValue) => true,
  },
  setup(props, { emit }) {
    const singleType = ref('');
    const typeList = computed(() => {
      return [...new Set(splitType(props.type))].map((item) => {
        const factTypeVal = factType(item, props.options);
        const typeInfo = {
          label: item,
          value: item,
          factType: factTypeVal,
        };
        if (isTypeArray(item)) {
          typeInfo.label = 'Array';
        }
        if (isTypeFunction(item)) {
          typeInfo.label = 'Function';
        }
        return typeInfo;
      });
    });
    const typeValue = computed(() => {
      const factTypeVal = typeList.value.find(typeItem => typeItem.value === singleType.value);
      return factTypeVal?.factType || 'errortype';
    });

    const handleUpdate = (value: ComponentPropValue) => {
      emit('update:modelValue', value);
    };
    const newModelValue = ref<ComponentPropValue>();
    watch(() => props.modelValue, (val) => {
      const newVal = isUndefined(val) ? props.defaultVal : val;
      newModelValue.value = newVal;
      const valType = valueType(newVal, singleType.value);
      const matchedType = typeList.value.find(typeItem => typeItem.factType === valType);
      singleType.value = matchedType ? matchedType.value : typeList.value[0]?.value || '';
    }, {
      immediate: true,
    });
    const handleTypeToValUpdate = () => {
      newModelValue.value = basicTypeToDefVal?.[typeValue.value as keyof typeof basicTypeToDefVal] ?? '';
      handleUpdate(newModelValue.value);
    };
    return {
      singleType,
      typeList,
      typeValue,
      handleUpdate,
      newModelValue,
      handleTypeToValUpdate,
    };
  },
  render() {
    const typeSelectRender = () => {
      if (this.typeList.length > 1) {
        return (
          <div class='dynamic-type-select'>
            <Tab
              tabs={this.typeList}
              activeTab={this.singleType}
              onUpdate:activeTab={(val) => {
                this.singleType = val;
                this.handleTypeToValUpdate();
              }}
            />
          </div>
        );
      }
      return null;
    };
    const typeConfigItemRender = () => {
      switch (this.typeValue) {
        case 'string':
          return (
            <RenderString
              modelValue={this.newModelValue as string}
              onUpdate:modelValue={this.handleUpdate}
              disabled={this.disabled}
            />
          );
        case 'number':
          return (
            <RenderNumber
              modelValue={this.newModelValue as number}
              onUpdate:modelValue={this.handleUpdate}
              disabled={this.disabled}
            />
          );
        case 'boolean':
          return (
            <RenderBoolean
              modelValue={this.newModelValue as boolean}
              onUpdate:modelValue={this.handleUpdate}
              disabled={this.disabled}
            />
          );
        case 'enum':
          return (
            <RenderEnum
              modelValue={this.newModelValue as string}
              onUpdate:modelValue={this.handleUpdate}
              options={this.options}
              disabled={this.disabled}
            />
          );
        case 'array':
          return (
            <RenderArray
              modelValue={this.newModelValue as Array<Record<string, ComponentPropValue> | string | number | boolean>}
              onUpdate:modelValue={this.handleUpdate}
              disabled={this.disabled}
            />
          );
        case 'object':
          return (
            <RenderObject
              modelValue={this.newModelValue as object}
              onUpdate:modelValue={this.handleUpdate}
              type={this.singleType}
              complexTypes={this.complexTypes}
              disabled={this.disabled}
            />
          );
        case 'function':
          return (
            <RenderFunction
              modelValue={this.newModelValue as string}
              activeLanguage={this.activeLanguage}
            />
          );
        default:
          return (
            <RenderErrorType />
          );
      }
    };

    return (
      <div class={'config-item'}>
        <div class="config-item-name">
          {this.$slots.nameTip?.()}
        </div>
        <div class={'config-item-content'}>
          {typeSelectRender()}
          <div>
            {typeConfigItemRender()}
          </div>
        </div>
      </div>
    );
  },
});
