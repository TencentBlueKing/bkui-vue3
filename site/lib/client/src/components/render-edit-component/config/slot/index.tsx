import { defineComponent, ref, computed } from 'vue';
import { Input as BkInput, bkTooltips } from 'bkui-vue';

import './index.postcss';

export default defineComponent({
  name: 'RenderSlot',
  props: {
    slotName: {
      type: String,
      default: '',
    },
    desc: {
      type: String
    },
    modelValue: {
      type: String
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
      return {
        content: props.desc,
        disabled: !props.desc,
        theme: 'light',
        placement: 'bottom-end',
        delay: 500,
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
          <span v-bkTooltips={this.toolTip}>{this.slotName}</span>
        </div>
        <BkInput 
          type='textarea'
          rows={4}
          modelValue={this.modelValue} 
          onUpdate:modelValue={this.handleUpdateModelValue} 
        />
      </div>
    );
  },
});
