import {
  defineComponent,
  computed,
} from 'vue';
import type {
  PropType,
} from 'vue';
import {
  bkTooltips,
} from 'bkui-vue';
import type {
  IParam,
} from '@/types/component';
import {
  filterXss,
} from '@blueking/xss-filter';

import './index.postcss';
import 'highlight.js/styles/atom-one-light.css';
import {
  useHighLightJs,
} from '@/hooks/use-highlighjs';
import {
  createSlots,
  parseStringTemplate,
  serializeElementTree
} from '../../code/template-parser';

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
    const { highlightFactory } = useHighLightJs();
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
    });
    const RenderSlot = () => highlightFactory(
      serializeElementTree(
        parseStringTemplate(
          createSlots(props.modelValue, props.name, props.params)
        )
      ), 'xml'
    );
    return {
      RenderSlot,
      handleUpdateModelValue,
      toolTip,
    };
  },
  render() {
    return (
      <div class='config-slot'>
        <div class="config-slot-name">
          <span v-bkTooltips={this.toolTip}>{this.name}</span>
        </div>
        <pre class="config-slot-content g-scrollbar"><code v-html={
          filterXss(this.RenderSlot())
        }></code></pre>
      </div>
    );
  },
});
