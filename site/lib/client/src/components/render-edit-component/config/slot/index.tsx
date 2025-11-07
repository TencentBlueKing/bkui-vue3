import { defineComponent, computed, type PropType } from 'vue';
import { Input as BkInput, bkTooltips } from 'bkui-vue';
import type {
  IParam
} from '@/types/component';

import './index.postcss';

export default defineComponent({
  name: 'RenderSlot',
  props: {
    name: {
      type: String,
      default: '',
    },
    description: {
      type: String
    },
    params: {
      type: Array as PropType<IParam[]>,
      default: () => []
    },
    modelValue: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: true
    }
  },
  emits: {
    'update:modelValue': (__: string) => true,
  },
  directives: {
    bkTooltips,
  },
  setup(props, { emit }) {
    const handleUpdateModelValue = (value: string) => {
      emit('update:modelValue', value);
    };
    const toolTip = computed(() => {
      const { name, description, params } = props
      const paramsStr = params.map(item => `${item.name}:${item.type}`).join(',')
      return {
        content: (
          <>
            <div class='slot-tip-bg even-bg'>
              <span>插槽：</span>
              <span>{ name }</span>
            </div>
            <div class='slot-tip-bg'>
              <span>说明：</span>
              <span title={description}>{ description }</span>
            </div>
            <div class='slot-tip-bg even-bg'>
              <span>参数：</span>
              <span title={paramsStr}>{ paramsStr }</span>
            </div>
          </>
        ),
        disabled: !description,
        theme: 'light',
        placement: 'bottom-end',
        delay: 500,
        extCls: 'slot-tip-content',
      }
    })
    return {
      handleUpdateModelValue,
      toolTip
    };
  },
  render() {
    return (
      <div class='config-slot'>
        <div class="config-slot-name">
          <span v-bkTooltips={this.toolTip}>{this.name}</span>
        </div>
        <BkInput 
          type='textarea'
          disabled={this.disabled}
          rows={4}
          modelValue={this.modelValue} 
          onUpdate:modelValue={this.handleUpdateModelValue} 
        />
      </div>
    );
  },
});
